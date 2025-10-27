import { createRequire } from "module";
import { createWorker } from "tesseract.js";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    return data.text.trim();
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to parse PDF file");
  }
}

export async function extractTextFromImage(buffer: Buffer): Promise<string> {
  let worker;
  try {
    worker = await createWorker("eng");
    const { data } = await worker.recognize(buffer);
    await worker.terminate();
    return data.text.trim();
  } catch (error) {
    if (worker) {
      await worker.terminate();
    }
    console.error("OCR error:", error);
    throw new Error("Failed to extract text from image");
  }
}
