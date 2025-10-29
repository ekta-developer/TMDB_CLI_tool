// server.js
require('dotenv').config();
const express = require('express');
const { fetchMovies } = require('./src/tmdb');

const app = express();
const PORT = 3000;

app.get('/movies', async (req, res) => {
  const { type = 'playing', page = 1 } = req.query;

  try {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: 'TMDB_API_KEY not found in .env' });
    }

    const data = await fetchMovies({ apiKey, type, page });
    res.json({
      type,
      page: data.page,
      total_pages: data.total_pages,
      total_results: data.total_results,
      movies: data.results.map((m) => ({
        title: m.title,
        release_date: m.release_date,
        rating: m.vote_average,
        overview: m.overview,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
