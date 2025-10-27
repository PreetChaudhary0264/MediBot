import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { extractTextFromPDF, extractTextFromImage } from "./parser";
import { analyzeReport, chatAboutReport } from "./llm";
import { insertReportSchema, insertMessageSchema } from "@shared/schema";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send("No file uploaded");
      }

      const { originalname, mimetype, buffer } = req.file;

      let extractedText = "";

      if (mimetype === "application/pdf") {
        extractedText = await extractTextFromPDF(buffer);
      } else if (mimetype.startsWith("image/")) {
        extractedText = await extractTextFromImage(buffer);
      } else {
        return res.status(400).send("Unsupported file type. Please upload PDF or image files.");
      }

      if (!extractedText || extractedText.length < 10) {
        return res.status(400).send("Could not extract meaningful text from the file. Please ensure the file contains readable text.");
      }

      const report = await storage.createReport({
        filename: originalname,
        originalText: extractedText,
        explanation: null,
      });

      res.json(report);

      analyzeReport(extractedText)
        .then((explanation) => {
          storage.updateReportExplanation(report.id, explanation);
        })
        .catch((error) => {
          console.error("Background analysis failed:", error);
          storage.setReportError(
            report.id,
            error instanceof Error ? error.message : "Analysis failed. Please try again."
          );
        });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).send(error instanceof Error ? error.message : "Failed to process file");
    }
  });

  app.get("/api/reports", async (_req, res) => {
    try {
      const reports = await storage.getAllReports();
      res.json(reports);
    } catch (error) {
      console.error("Get reports error:", error);
      res.status(500).send("Failed to fetch reports");
    }
  });

  app.get("/api/reports/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const report = await storage.getReport(id);

      if (!report) {
        return res.status(404).send("Report not found");
      }

      res.json(report);
    } catch (error) {
      console.error("Get report error:", error);
      res.status(500).send("Failed to fetch report");
    }
  });

  app.get("/api/messages/:reportId", async (req, res) => {
    try {
      const { reportId } = req.params;
      const messages = await storage.getMessagesByReportId(reportId);
      res.json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).send("Failed to fetch messages");
    }
  });

  app.post("/api/chat/:reportId", async (req, res) => {
    try {
      const { reportId } = req.params;
      const { message } = req.body;

      if (!message || typeof message !== "string" || message.trim().length === 0) {
        return res.status(400).send("Message is required");
      }

      const report = await storage.getReport(reportId);
      if (!report) {
        return res.status(404).send("Report not found");
      }

      if (!report.explanation) {
        return res.status(400).send("Report analysis is not yet complete. Please wait.");
      }

      const userMessage = await storage.createMessage({
        reportId,
        role: "user",
        content: message.trim(),
      });

      const aiResponse = await chatAboutReport(
        report.originalText,
        report.explanation,
        message.trim()
      );

      const aiMessage = await storage.createMessage({
        reportId,
        role: "assistant",
        content: aiResponse,
      });

      res.json({ userMessage, aiMessage });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).send(error instanceof Error ? error.message : "Failed to process chat");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
