import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const ANALYSIS_PROMPT = `You are a medical expert assistant helping patients understand their medical reports. Your task is to:

1. Read the medical report carefully
2. Identify key findings, test results, and diagnoses
3. Explain everything in simple, non-technical language
4. Organize the explanation with clear sections
5. Highlight any concerning findings (but avoid causing panic)
6. Explain medical terms in parentheses when first used

Format your response in markdown with:
- **Summary** section at the top
- **Key Findings** section for important results
- **Detailed Explanation** for each section of the report
- **What This Means** section to interpret the results
- **Next Steps** if applicable

Medical Report:
---
{reportText}
---

Provide a clear, compassionate, and accurate explanation that helps the patient understand their medical report:`;

const CHAT_PROMPT = `You are a medical expert assistant. A patient has uploaded a medical report and you've already provided them with an explanation.

Original Medical Report:
---
{reportText}
---

Your Previous Explanation:
---
{explanation}
---

The patient is now asking a follow-up question. Answer it clearly, compassionately, and accurately. Keep your answer concise but informative. If the question is about something not in the report, politely let them know.

Patient's Question: {question}

Your Answer:`;

export async function analyzeReport(reportText: string): Promise<string> {
  const prompt = ANALYSIS_PROMPT.replace("{reportText}", reportText);

  try {
    const response = await hf.textGeneration({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      inputs: prompt,
      parameters: {
        max_new_tokens: 2000,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false,
      },
    });

    return response.generated_text.trim();
  } catch (error) {
    console.error("LLM analysis error:", error);
    throw new Error("Failed to analyze report. Please try again.");
  }
}

export async function chatAboutReport(
  reportText: string,
  explanation: string,
  question: string
): Promise<string> {
  const prompt = CHAT_PROMPT
    .replace("{reportText}", reportText)
    .replace("{explanation}", explanation)
    .replace("{question}", question);

  try {
    const response = await hf.textGeneration({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false,
      },
    });

    return response.generated_text.trim();
  } catch (error) {
    console.error("LLM chat error:", error);
    throw new Error("Failed to process your question. Please try again.");
  }
}
