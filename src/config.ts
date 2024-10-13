import dotenv from 'dotenv';

dotenv.config();

interface Config {
  geniusAccessToken: string | undefined;
  openrouterApiKey: string | undefined;
  geniusRedirectUri: string;
}

const config: Config = {
  geniusAccessToken: process.env.GENIUS_ACCESS_TOKEN,
  openrouterApiKey: process.env.OPENROUTER_API_KEY,
  geniusRedirectUri: 'http://localhost:3000/callback'
};

export default config;
