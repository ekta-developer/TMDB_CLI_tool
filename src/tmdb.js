// fetch handler
const axios = require('axios');

const TYPE_TO_ENDPOINT = {
  playing: 'now_playing',
  popular: 'popular',
  top: 'top_rated',
  upcoming: 'upcoming'
};

function getEndpointForType(type) {
  return TYPE_TO_ENDPOINT[type];
}

async function fetchMovies({ apiKey, type = 'playing', page = 1 }) {
  const endpoint = getEndpointForType(type);
  if (!endpoint) {
    const allowed = Object.keys(TYPE_TO_ENDPOINT).join(', ');
    throw new Error(`Invalid type "${type}". Allowed types: ${allowed}`);
  }

  const url = `https://api.themoviedb.org/3/movie/${endpoint}`;
  try {
    const resp = await axios.get(url, {
      params: {
        api_key: apiKey,
        language: 'en-US',
        page
      },
      timeout: 10000
    });

    if (resp.status !== 200) {
      throw new Error(`TMDB API returned status ${resp.status}`);
    }

    return resp.data; // contains results[], page, total_pages, total_results
  } catch (err) {
    // Normalize axios errors
    if (err.response) {
      // API responded with an error status
      const message = err.response.data && err.response.data.status_message
        ? err.response.data.status_message
        : `TMDB API error (status ${err.response.status})`;
      throw new Error(message);
    } else if (err.request) {
      // No response received
      throw new Error('No response from TMDB API (network or CORS issue)');
    } else {
      throw new Error(err.message);
    }
  }
}

module.exports = {
  fetchMovies,
  getEndpointForType
};
