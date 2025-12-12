import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

// Fix: Use process.env.API_KEY directly in initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialInsights = async (transactions: Transaction[], query: string): Promise<string> => {
  // Fix: Do not manually check for API key or prompt user; assume environment is valid.

  try {
    // Summarize data to avoid token limits if dataset is huge
    const summary = transactions.reduce((acc, curr) => {
      acc.total += curr.amount;
      acc.byBranch[curr.branch] = (acc.byBranch[curr.branch] || 0) + curr.amount;
      acc.byMode[curr.paymentMode] = (acc.byMode[curr.paymentMode] || 0) + curr.amount;
      return acc;
    }, { total: 0, byBranch: {} as Record<string, number>, byMode: {} as Record<string, number> });

    const recentTransactions = transactions.slice(0, 10);

    const prompt = `
      You are a business intelligence analyst. Analyze the following sales data summary and recent transactions.
      
      Data Summary:
      Total Revenue: ${summary.total}
      Revenue by Branch: ${JSON.stringify(summary.byBranch)}
      Revenue by Payment Mode: ${JSON.stringify(summary.byMode)}
      
      Recent 10 Transactions:
      ${JSON.stringify(recentTransactions)}

      User Question: "${query}"

      Provide a concise, professional, and actionable answer. Use bullet points if necessary.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "I couldn't generate an insight at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while communicating with the AI service.";
  }
};