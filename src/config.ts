import dotenv from 'dotenv';

dotenv.config();

interface Config {
  geniusAccessToken: string | undefined;
  openrouterApiKey: string | undefined;
}

const config: Config = {
  geniusAccessToken: process.env.GENIUS_ACCESS_TOKEN,
  openrouterApiKey: process.env.OPENROUTER_API_KEY
};

export default config;
