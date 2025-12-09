import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

// ---------- PROMPT TEMPLATES -------------
const ANALYSIS_PROMPT = `
You are a medical expert assistant helping patients understand their medical reports. 
Your task is to:
1. Read the report carefully.
2. Identify key findings and diagnoses.
3. Explain in simple, friendly language.
4. Organize with clear markdown sections:
   - **Summary**
   - **Key Findings**
   - **Detailed Explanation**
   - **What This Means**
   - **Next Steps** (if needed)

Medical Report:
---
{reportText}
---
`;

const CHAT_PROMPT = `
You are a medical expert assistant. A patient has uploaded a medical report and you’ve already explained it.

Original Report:
---
{reportText}
---

Your Previous Explanation:
---
{explanation}
---

Now the patient asks:
"{question}"

Give a concise, kind, and accurate answer. 
If the question is unrelated to the report, gently say so.
`;

// ---------- ANALYZE REPORT ----------
export async function analyzeReport(reportText) {
  const prompt = ANALYSIS_PROMPT.replace("{reportText}", reportText);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text.trim() || "No analysis generated.";
  } catch (err) {
    console.error("AI Analysis Error:", err.message);
    throw new Error("Failed to analyze the report. Please try again later.");
  }
}

// ---------- CHAT ABOUT REPORT ----------
export async function chatAboutReport(reportText, explanation, question) {
  const prompt = CHAT_PROMPT
    .replace("{reportText}", reportText)
    .replace("{explanation}", explanation)
    .replace("{question}", question);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text.trim() || "No response generated.";
  } catch (err) {
    console.error("AI Chat Error:", err.message);
    throw new Error("Failed to process your question. Please try again later.");
  }
}



