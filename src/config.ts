import dotenv from 'dotenv';

dotenv.config();

interface Config {
  geniusAccessToken: string | undefined;
  openrouterApiKey: string | undefined;
  geniusAppWebsiteUrl: string;
  geniusRedirectUri: string;
}

const config: Config = {
  geniusAccessToken: process.env.GENIUS_ACCESS_TOKEN,
  openrouterApiKey: process.env.OPENROUTER_API_KEY,
  geniusAppWebsiteUrl: 'https://your-app-website.com',
  geniusRedirectUri: 'https://your-app-website.com/callback'
};

export default config;
