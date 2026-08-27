import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// The model we want to use (using 2.0 Flash as it's fast and efficient for text)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

/**
 * Generate a response using Gemini based on a system instruction and user prompt.
 */
export async function generateAIResponse(systemInstruction, prompt) {
  try {
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemInstruction }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I will follow these instructions." }],
        },
      ],
    })

    const result = await chat.sendMessage(prompt)
    const response = result.response
    return response.text()
  } catch (error) {
    console.error('Error generating AI response:', error)
    throw new Error('Failed to generate AI response')
  }
}
