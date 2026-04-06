import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const analyzeExpenses = async (transactions: any[]) => {
  const dataString = transactions.map(t => `${t.category}: ${t.amount} (${t.type})`).join(', ');

  const prompt = `
    You are a professional financial advisor.
    Analyze the following transaction data (Category: Amount (Type)) and return a JSON object.
    
    Data: ${dataString}

    The JSON MUST have these exact keys:
    1. "summary": A concise 2-sentence executive summary of their financial health.
    2. "overspending_warnings": An array of 3 specific warnings about categories where they spend too much.
    3. "saving_tips": An array of 3 actionable strategies to save money based on their data.
    4. "top_categories": An array of the top 3 categories by total expense amount.

    Ensure the response is valid JSON and contains NO other text.
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
      response_format: { type: 'json_object' },
    });

    return JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');
  } catch (error) {
    console.error('Groq AI Error:', error);
    throw new Error('Failed to generate AI insights');
  }
};

export const suggestCategory = async (description: string) => {
  const prompt = `
    Based on the description: "${description}", suggest the most appropriate category for this expense from common categories (Food, Rent, Travel, Shopping, Utilities, Health, Entertainment, Others).
    Return only the category name in plain text.
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
    });

    return chatCompletion.choices[0]?.message?.content?.trim() || 'Others';
  } catch (error) {
    console.error('Groq Category Suggestion Error:', error);
    return 'Others';
  }
};
