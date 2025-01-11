import axios from 'axios';

interface LLMParsedResult {
  action: 'createProjectAndDub' | 'getProjects' | 'unknown';
  details?: {
    sourceLanguage?: string;
    targetLanguage?: string;
    voiceMatchingMode?: string;
  };
}

export async function parseUserCommandWithLLM(
  userCommand: string,
  openAIApiKey: string
): Promise<LLMParsedResult> {
  const prompt = `
  You are an assistant that translates user instructions into structured JSON.
  If the user wants to create a dubbing project, respond with:
    {"action": "createProjectAndDub", "details": {"sourceLanguage":"...","targetLanguage":"...","voiceMatchingMode":"..."}}
  If the user wants to list projects, respond with:
    {"action": "getProjects"}
  Otherwise:
    {"action":"unknown"}

  User's input: "${userCommand}"
  `;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt,
        temperature: 0,
        max_tokens: 200
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAIApiKey}`,
        },
      }
    );

    const completionText: string = response.data.choices[0].text.trim();
    try {
      return JSON.parse(completionText);
    } catch {
      return { action: 'unknown' };
    }
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return { action: 'unknown' };
  }
} 