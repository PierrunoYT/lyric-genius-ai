import express from 'express';
import type { Request, Response } from 'express';
import axios from 'axios';
import cors from 'cors';
import path from 'path';
import config from './config';
import * as cheerio from 'cheerio';

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'public')));

const GENIUS_API_BASE_URL = 'https://api.genius.com';
const GENIUS_ACCESS_TOKEN = config.geniusAccessToken;
const OPENROUTER_API_KEY = config.openrouterApiKey;
const YOUR_SITE_URL = 'http://localhost:3000'; // Update this with your actual site URL
const YOUR_SITE_NAME = 'Lyrics AI App'; // Update this with your actual site name

async function searchSong(query: string) {
  try {
    const response = await axios.get(`${GENIUS_API_BASE_URL}/search`, {
      params: { q: query },
      headers: { 'Authorization': `Bearer ${GENIUS_ACCESS_TOKEN}` }
    });
    return response.data.response.hits;
  } catch (error) {
    console.error('Error searching song:', error);
    throw error;
  }
}

async function getSongDetails(songId: number) {
  try {
    const response = await axios.get(`${GENIUS_API_BASE_URL}/songs/${songId}`, {
      headers: { 'Authorization': `Bearer ${GENIUS_ACCESS_TOKEN}` }
    });
    const song = response.data.response.song;
    const lyrics = await scrapeLyrics(song.url);
    return { ...song, lyrics };
  } catch (error) {
    console.error('Error getting song details:', error);
    throw error;
  }
}

async function scrapeLyrics(url: string) {
  try {
    console.log('Scraping lyrics from URL:', url);
    const response = await axios.get(url);
    console.log('Response received, status:', response.status);
    
    if (!response.data) {
      console.error('No data received from the URL');
      return 'Lyrics not available';
    }

    const $ = cheerio.load(response.data);
    console.log('Cheerio loaded successfully');

    // Try different selectors
    let lyrics = $('[data-lyrics-container="true"]').text().trim();
    if (!lyrics) {
      lyrics = $('.lyrics').text().trim();
    }
    if (!lyrics) {
      lyrics = $('div[class*="Lyrics__Root"]').text().trim();
    }

    console.log('Lyrics found:', lyrics ? 'Yes' : 'No');
    return lyrics || 'Lyrics not available';
  } catch (error) {
    console.error('Error scraping lyrics:', error);
    return 'Error fetching lyrics';
  }
}

app.post('/api/search', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    const results = await searchSong(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while searching for songs' });
  }
});

app.get('/api/song/:id', async (req: Request, res: Response) => {
  try {
    const songId = parseInt(req.params.id);
    const songDetails = await getSongDetails(songId);
    res.json(songDetails);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching song details' });
  }
});

app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, context } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "anthropic/claude-3.5-sonnet:beta",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Context: ${context}\n\nUser: ${message}\n\nAI:`
              }
            ]
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": YOUR_SITE_URL,
          "X-Title": YOUR_SITE_NAME,
          "Content-Type": "application/json"
        }
      }
    );

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const choice = response.data.choices[0];
      if (choice.message && choice.message.content && choice.message.content.length > 0) {
        const reply = choice.message.content[0].text;
        if (typeof reply === 'string') {
          res.json({ reply: reply.trim() });
        } else {
          throw new Error('Unexpected reply format');
        }
      } else {
        throw new Error('No content in the response');
      }
    } else {
      throw new Error('Invalid response structure');
    }
  } catch (error) {
    console.error('Error in chat interaction:', error);
    res.status(500).json({ error: 'An error occurred during the chat interaction' });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
