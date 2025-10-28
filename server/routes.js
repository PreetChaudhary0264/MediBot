import { createServer } from "http";
import express from "express";
import multer from "multer";
import { extractText } from "./parser.js";
import { analyzeReport, chatAboutReport } from "./llm.js";
import { storage } from "./storage.js";

// Multer setup for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export async function registerRoutes(app) {
  // ✅ Upload Medical Report
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) return res.status(400).send("No file uploaded");

      const { path: filePath, mimetype, originalname } = req.file;

      // Extract text using parser
      const text = await extractText(filePath, mimetype);

      if (!text || text.trim().length < 10) {
        return res.status(400).send("No readable text found in the file");
      }

      // Create initial report entry in storage
      const report = await storage.createReport({
        filename: originalname,
        originalText: text,
        explanation: null,
      });

      // Send initial response immediately
      res.json(report);

      // 🔹 Background AI Analysis
      analyzeReport(text)
        .then(async (explanation) => {
          await storage.updateReportExplanation(report.id, explanation);
          console.log(`✅ Analysis completed for report ${report.id}`);
        })
        .catch(async (err) => {
          console.error("Background analysis failed:", err);
          await storage.setReportError(
            report.id,
            err.message || "Analysis failed"
          );
        });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).send("Failed to process file");
    }
  });

  // ✅ Get all reports
  app.get("/api/reports", async (_req, res) => {
    try {
      const reports = await storage.getAllReports();
      res.json(reports);
    } catch (err) {
      console.error("Get reports error:", err);
      res.status(500).send("Failed to fetch reports");
    }
  });

  // ✅ Get a single report by ID
  app.get("/api/reports/:id", async (req, res) => {
    try {
      const report = await storage.getReport(req.params.id);
      if (!report) return res.status(404).send("Report not found");
      res.json(report);
    } catch (err) {
      console.error("Get report error:", err);
      res.status(500).send("Failed to fetch report");
    }
  });

  // ✅ Get chat messages related to a report
  app.get("/api/messages/:reportId", async (req, res) => {
    try {
      const messages = await storage.getMessagesByReportId(req.params.reportId);
      res.json(messages);
    } catch (err) {
      console.error("Get messages error:", err);
      res.status(500).send("Failed to fetch messages");
    }
  });

  // ✅ Chat with AI about a report
  app.post("/api/chat/:reportId", async (req, res) => {
    try {
      const { reportId } = req.params;
      const message = req.body?.message?.trim();

      if (!message) return res.status(400).send("Message is required");

      const report = await storage.getReport(reportId);
      if (!report) return res.status(404).send("Report not found");
      if (!report.explanation)
        return res.status(400).send("Report analysis not ready yet");

      // Save user's message
      const userMessage = await storage.createMessage({
        reportId,
        role: "user",
        content: message,
      });

      // Get AI response
      const aiResponse = await chatAboutReport(
        report.originalText,
        report.explanation,
        message
      );

      // Save AI message
      const aiMessage = await storage.createMessage({
        reportId,
        role: "assistant",
        content: aiResponse,
      });

      res.json({ userMessage, aiMessage });
    } catch (err) {
      console.error("Chat error:", err);
      res.status(500).send("Failed to process chat");
    }
  });

  // ✅ Health check route (optional but helpful)
  app.get("/", (_req, res) => {
    res.send("✅ ReportEaseBot backend is running");
  });

  // Return HTTP server instance
  return createServer(app);
}


