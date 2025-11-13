# Mastra playground

## Quick setup

1. Clone repo
2. Install dependencies: `npm i`
3. Create `.env` file with single line content `OPENAI_API_KEY=[your openai api key]`
4. Run backend: `npm run backend:dev`
5. Run frontend: `npm run frontend:dev` (by default runs it at `http://localhost:5173/`)

## Agentic architectural approaches

This repo contains prototypes for the following approaches:
- single agent
- single learning agent
- agent network
- multi-step workflow

To configure which approach is used, set the `approach` value in `src/config.ts`.
Both backend and frontend devservers should get hot-reloaded when you change the config file. If they don't, then manually restart them.

## Example conversation messages

### Koala quiz

1. Hello. I'd like a quiz

2. I am a high-school biology teacher. I will give a lecture about koalas, covering basic topics. I want to print and hand out a simple quiz with 4 easy questions. Just to help students' practise a little.
