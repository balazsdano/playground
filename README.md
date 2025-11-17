# Mastra playground

## Quick setup

1. Clone repo
2. Install dependencies: `npm i`
3. Create `.env` file with single line content `OPENAI_API_KEY=[your openai api key]`
4. Run frontend: `npm run frontend:dev` (default: `http://localhost:5173/`)
4. Run backend: `npm run backend:dev` (default: `http://localhost:4111/` - frontend hard-coded to use this)
6. Open UI and have conversation
7. Check traces in Mastra Studio observability tab: `http://localhost:4111/observability` (or whatever port you run backend at)

## Agentic architectural approaches

This repo contains prototypes for the following approaches:
- single agent
- single learning agent
- agent network
- multi-step workflow

To configure which approach is used, set the `approach` value in `src/config.ts`.
Both backend and frontend dev-servers should get hot-reloaded when you change the config file. If they don't, then manually restart them.
Backend uses in-memory storage, so restarting the server will reset the storage.

## Example conversation messages

**Koala quiz:**
1. I'd like a quiz about koalas.
2. I am a high-school biology teacher. I will give a lecture about koalas, covering basic topics. I want to print and hand out a simple quiz with 4 easy questions. To help students practise.
3. Please add a bonus question.
