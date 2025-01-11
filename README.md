# SpeechLab Agentic Framework

📚 [Documentation](https://shaft-foundation.github.io/SpeechlabAgentsDocs/)

A basic frameworkin **TypeScript** for interacting with [SpeechLab's Dubbing & Translation API](https://translate-api.speechlab.ai). Demonstrates:

- **Authentication** via `/v1/auth/login`
- **Project Creation & Dubbing** via `/v1/projects/createProjectAndDub`
- **Project Retrieval** via `/v1/projects`
- A simple "agent" pattern that interprets user commands such as "Create a Spanish dub for this video."

## Features

- **Functional-Style** Implementation
- **CLI Usage**: `node dist/index.js "Create a Spanish dub for this video"`
- **Docker** Support
- **MIT License**

## Setup

1. **Clone** the repository:
   ```bash
   git clone https://github.com/your-org/speechlab-agentic-framework.git
   cd speechlab-agentic-framework
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables** (Optional):
   - SPEECHLAB_EMAIL
   - SPEECHLAB_PASSWORD
   - OPENAI_API_KEY

   If not provided, the code will use REDACTED as placeholders.

4. **Build** the project:
   ```bash
   npm run build
   ```

5. **Run** the CLI:
   ```bash
   npm start "Create a Spanish dub for this video"
   ```

## Usage Examples

### Basic Dubbing Request
```bash
npm start "Create a Spanish dub for this video"
```

The agent will:
- Obtain an auth token
- Submit a project creation request with default parameters (en→es_la, etc.)
- Print out the project and job IDs

### Listing Projects
```bash
npm start "List projects"
```

The agent will:
- Obtain an auth token
- Fetch projects using GET /v1/projects
- Print how many projects were retrieved

## Docker

You can build and run this project inside a Docker container.

Build the image:
```bash
docker build -t speechlab-agentic-framework .
```

Run the container:
```bash
docker run -it --rm \
  -e SPEECHLAB_EMAIL="REDACTED" \
  -e SPEECHLAB_PASSWORD="REDACTED" \
  -e OPENAI_API_KEY="sk-<your-key>" \
  speechlab-agentic-framework
```

By default, the container starts with the command: `node dist/index.js "Create a Spanish dub for this video"`.

## Contributing

1. Fork or clone this repository
2. Create a new feature branch
3. Submit a pull request (PR) for review

## Known Issues

- This demo uses mock S3 URLs for media. In production, supply actual publicly accessible URLs or follow your S3 bucket's ACL requirements.
- The "agentic" parser is extremely naive without OpenAI; with OpenAI, we rely on correct JSON responses from the LLM.

## Future Enhancements

- More advanced prompt engineering for LLM-based parsing
- Voice Matching with custom speaker profiles
- Multi-language dubbing in one request
- Real-time streaming for live translations

## Tests

Run tests with:
```bash
npm test
```

## License

MIT
