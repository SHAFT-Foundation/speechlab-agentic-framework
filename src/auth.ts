import axios from 'axios';

interface AuthResponse {
  tokens: {
    accessToken: {
      jwtToken: string;
    };
  };
}

export async function getToken(email: string, password: string): Promise<string> {
  try {
    const payload = { email, password };
    const response = await axios.post<AuthResponse>(
      'https://translate-api.speechlab.ai/v1/auth/login',
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data.tokens.accessToken.jwtToken;
  } catch (error) {
    throw new Error(`Failed to retrieve token: ${error}`);
  }
} 