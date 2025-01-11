import { getToken } from './auth';
import { interpretUserCommand } from './agent';

const userCommand = process.argv.slice(2).join(' ');

async function main() {
  if (!userCommand) {
    console.log('Usage: node dist/index.js "<command>"');
    process.exit(1);
  }

  const email = process.env.SPEECHLAB_EMAIL || 'REDACTED';
  const password = process.env.SPEECHLAB_PASSWORD || 'REDACTED';
  const openAIApiKey = process.env.OPENAI_API_KEY || 'REDACTED';

  try {
    const token = await getToken(email, password);
    const agentResponse = await interpretUserCommand(userCommand, token, openAIApiKey);
    console.log(agentResponse);
  } catch (error) {
    console.error(`Something went wrong: ${(error as Error).message}`);
    process.exit(1);
  }
}

main(); 