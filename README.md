# Lyric Genius AI

Lyric Genius AI is an application that combines lyrics retrieval with AI-powered chat functionality, allowing users to interact with song information and lyrics using artificial intelligence.

## Features

- Search for songs using the Genius API
- Retrieve song details and lyrics
- AI-powered chat interaction about songs and lyrics using OpenRouter AI (Claude 3.5 Sonnet)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/PierrunoYT/lyric-genius-ai.git
   ```
2. Navigate to the project directory:
   ```
   cd lyric-genius-ai
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   GENIUS_ACCESS_TOKEN=your_genius_api_token
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

## Usage

1. Start the server:
   ```
   npm start
   ```
2. Open a web browser and navigate to `http://localhost:3000`

## API Endpoints

- `POST /api/search`: Search for songs
- `GET /api/song/:id`: Get details for a specific song
- `POST /api/chat`: Interact with the AI about song lyrics

## Technologies Used

- Express.js
- Axios
- Cheerio
- OpenRouter AI (Claude 3.5 Sonnet)
- Genius API

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

PierrunoYT
