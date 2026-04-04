# uni-discord-bot

Discord slash-command bot for a Hebrew-speaking university server with a deliberately sarcastic student personality.

## Setup

Create a `.env` file with:

```env
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
DISCORD_REPRESENTATIVE_USER_IDS=173926117172838401,402922149041405974
DISCORD_RANDOM_EVENTS_ENABLED=false
DISCORD_RANDOM_EVENTS_CHANNEL_ID=
DISCORD_RANDOM_EVENTS_INTERVAL_MINUTES=180
DISCORD_VOICE_IGNORE_MINUTES=2
```

## Commands

- `/course ask` answers course questions using local summary files and returns relevant references plus an exam tip.
- `/course files` and `/summary` expose local summary PDFs.
- `/deadline add|list|panic` stores deadlines in `.bot-data/deadlines.json` and calculates time left.
- `/food choose` and `/budget survive` handle student survival decisions.
- `/poll` adds commentary and meme reactions.
- `/voice` joins voice, nags, and leaves if ignored.
- `/oracle` answers with half wisdom, half chaos.
- `/persona set|view` lets each user control how spicy the bot gets.
- `/tal`, `/noam`, `/eliyahu`, `/weather`, `/ping`, `/help`, and `/pizza` were upgraded to use the new personality layer.

## Development

```bash
pnpm install
pnpm addCommands
pnpm dev
```

For production builds:

```bash
pnpm build
pnpm start
```
