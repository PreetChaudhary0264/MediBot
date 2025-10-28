import fs from "fs/promises";
import { createWorker } from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs"; // ✅ works natively with ESM

/**
 * Extract text from a PDF using pdfjs-dist
 */
export async function extractTextFromPDF(filePath) {
  try {
    const data = new Uint8Array(await fs.readFile(filePath));
    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      text += pageText + "\n";
    }

    return text.trim();
  } catch (err) {
    console.error("PDF parsing error:", err);
    throw new Error("Failed to extract text from PDF");
  }
}

/**
 * Extract text from an image using Tesseract.js
 */
export async function extractTextFromImage(filePath) {
  const worker = await createWorker("eng");
  try {
    const { data } = await worker.recognize(filePath);
    return data.text.trim();
  } catch (err) {
    console.error("OCR error:", err);
    throw new Error("Failed to extract text from image");
  } finally {
    await worker.terminate();
  }
}

/**
 * Detect file type and extract text accordingly
 */
export async function extractText(filePath, mimetype) {
  try {
    if (mimetype === "application/pdf") {
      return await extractTextFromPDF(filePath);
    } else if (mimetype.startsWith("image/")) {
      return await extractTextFromImage(filePath);
    } else {
      throw new Error("Unsupported file format. Please upload a PDF or image file.");
    }
  } catch (err) {
    console.error("File parsing error:", err.message);
    throw err;
  }
}


