import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";

// FIX: Per Gemini API guidelines, initialize GoogleGenAI directly with process.env.API_KEY
// and remove manual API_KEY validation.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const scheduleEventFunctionDeclaration: FunctionDeclaration = {
  name: 'scheduleEvent',
  description: 'Schedules a calendar event with specified details.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: 'The title of the event.',
      },
      date: {
        type: Type.STRING,
        description: 'The date of the event in YYYY-MM-DD format.',
      },
      startTime: {
        type: Type.STRING,
        description: 'The start time of the event in 24-hour HH:MM format.',
      },
      endTime: {
        type: Type.STRING,
        description: 'The end time of the event in 24-hour HH:MM format.',
      },
      attendees: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: 'A list of attendees for the event.',
      },
    },
    required: ['title', 'date', 'startTime', 'endTime'],
  },
};

export const getSchedulingFunctionCall = async (prompt: string) => {
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format
  const systemInstruction = `You are an expert scheduling assistant. Based on the user's request, call the necessary functions to manage the calendar. Today's date is ${today}. If the user provides a relative date like 'tomorrow', calculate the actual date. If a duration is given without an end time, calculate the end time.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        tools: [{ functionDeclarations: [scheduleEventFunctionDeclaration] }],
      },
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      return response.functionCalls[0];
    }
    return null;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("There was an issue communicating with the AI assistant.");
  }
};
