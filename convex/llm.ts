import { GoogleGenAI, Type, FunctionCallingConfigMode } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const tools = [
  {
    functionDeclarations: [
      {
        name: "createTasks",
        description: "Create new tasks and track them",
        parameters: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description:
                      "Short 4-5 word title summarizing the task",
                  },
                  description: {
                    type: Type.STRING,
                    description:
                      "Longer paragraph with relevant context from the user's message. Leave empty if no extra context.",
                  },
                },
                required: ["title"],
              },
            },
          },
          required: ["tasks"],
        },
      },
    ],
  },
];

export async function generateTasks(
  input: string,
): Promise<Array<{ title: string; description?: string }>> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    config: {
      tools,
      toolConfig: {
        functionCallingConfig: {
          mode: FunctionCallingConfigMode.ANY,
          allowedFunctionNames: ["createTasks"],
        },
      },
      systemInstruction: [
        {
          text: "You're a todolist tracker. Extract tasks from the user's message. Each task gets a short 4-5 word title. If the user provides relevant context (names, deadlines, details), include it in the description. Otherwise leave description empty.",
        },
      ],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: input }],
      },
    ],
  });

  const functionCall = response.functionCalls?.[0];
  if (!functionCall || functionCall.name !== "createTasks") {
    throw new Error("Failed to generate tasks");
  }

  const args = functionCall.args as {
    tasks: Array<{ title: string; description?: string }>;
  };
  return args.tasks;
}
