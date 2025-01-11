import axios from 'axios';
import { parseUserCommandWithLLM } from './llm';

interface CreateDubProjectParams {
  name: string;
  sourceLanguage: string;
  targetLanguage: string;
  dubAccent?: string;
  mediaFileURI: string;
  transcriptFileURI?: string;
  translationFileURI?: string;
  voiceMatchingMode?: string;
  customizedVoiceMatchingSpeakers?: {
    speaker: string;
    voiceMatchingMode: string;
  }[];
  thirdPartyId?: string;
}

interface CreateDubProjectResponse {
  projectId: string;
  jobId: string;
  dubStatus: string;
}

export async function createProjectAndDub(
  token: string,
  params: CreateDubProjectParams
): Promise<CreateDubProjectResponse> {
  const url = 'https://translate-api.speechlab.ai/v1/projects/createProjectAndDub';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.post<CreateDubProjectResponse>(url, params, { headers });
  return response.data;
}

interface FilterParams {
  sortBy?: string;
  limit?: number;
  page?: number;
  thirdPartyIDs?: string; 
  expand?: string;
}

export async function getProjects(token: string, filters?: FilterParams) {
  const url = 'https://translate-api.speechlab.ai/v1/projects';
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.get(url, { headers, params: filters });
  return response.data;
}

export async function interpretUserCommand(
  userCommand: string,
  token: string,
  openAIApiKey: string
): Promise<string> {
  const parsed = await parseUserCommandWithLLM(userCommand, openAIApiKey);

  switch (parsed.action) {
    case 'createProjectAndDub': {
      const sourceLanguage = parsed.details?.sourceLanguage || 'en';
      const targetLanguage = parsed.details?.targetLanguage || 'es_la';
      const voiceMatchingMode = parsed.details?.voiceMatchingMode || 'source';

      const params: CreateDubProjectParams = {
        name: 'My LLM-Interpreted Project',
        sourceLanguage,
        targetLanguage,
        dubAccent: targetLanguage,
        mediaFileURI: 's3://mock-bucket/my-video.mp4',
        transcriptFileURI: 's3://mock-bucket/my-transcript.txt',
        translationFileURI: 's3://mock-bucket/my-translation.txt',
        voiceMatchingMode,
        customizedVoiceMatchingSpeakers: [
          {
            speaker: 'Speaker 1',
            voiceMatchingMode,
          },
        ],
        thirdPartyId: 'demo-id-123'
      };

      try {
        const result = await createProjectAndDub(token, params);
        return `Dub project created!\nProject ID: ${result.projectId}\nJob ID: ${result.jobId}\nStatus: ${result.dubStatus}`;
      } catch (error) {
        return `Error creating dub project: ${(error as Error).message}`;
      }
    }
    case 'getProjects': {
      try {
        const projectsData = await getProjects(token, {
          sortBy: 'owner:asc,updatedAt:desc',
          limit: 10,
          page: 1,
          thirdPartyIDs: 'demo-id-123', 
          expand: 'true',
        });
        return `Projects fetched! Found ${projectsData.projects?.length ?? 0} project(s).`;
      } catch (error) {
        return `Error fetching projects: ${(error as Error).message}`;
      }
    }
    default:
      return `I'm not sure how to handle the command: "${userCommand}"`;
  }
} 