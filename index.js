const axios = require('axios');
const cheerio = require('cheerio');
const { GENIUS_API_KEY, OPENROUTER_API_KEY } = require('./config');

async function searchSong(title, artist) {
  try {
    const response = await axios.get('https://api.genius.com/search', {
      headers: {
        'Authorization': `Bearer ${GENIUS_API_KEY}`
      },
      params: {
        q: `${title} ${artist}`
      }
    });

    const hit = response.data.response.hits[0];
    if (!hit) {
      throw new Error('No results found');
    }

    return {
      id: hit.result.id,
      url: hit.result.url,
      title: hit.result.title,
      artist: hit.result.primary_artist.name
    };
  } catch (error) {
    console.error('Error searching for song:', error.message);
    throw error;
  }
}

async function getLyrics(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    return $('div[class^="Lyrics__Container"]').text().trim();
  } catch (error) {
    console.error('Error fetching lyrics:', error.message);
    throw error;
  }
}

async function summarizeLyrics(lyrics) {
  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that summarizes song lyrics.' },
        { role: 'user', content: `Summarize the following lyrics:\n\n${lyrics}` }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error summarizing lyrics:', error.message);
    throw error;
  }
}

async function main() {
  try {
    const songInfo = await searchSong('Bohemian Rhapsody', 'Queen');
    console.log('Song found:', songInfo);

    const lyrics = await getLyrics(songInfo.url);
    console.log('Lyrics:', lyrics);

    const summary = await summarizeLyrics(lyrics);
    console.log('Summary:', summary);
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

main();
