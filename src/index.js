// main logic and pretty printing
const chalk = require('chalk');
const { fetchMovies, getEndpointForType } = require('./tmdb');

function truncate(str, n = 140) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

function printHeader(type, page, totalPages) {
  const endpoint = getEndpointForType(type);
  console.log(chalk.bold.green(`\nTMDB — ${type.toUpperCase()} (${endpoint}) — page ${page} of ${totalPages}\n`));
}

function printMovies(movies, number) {
  // show limited number of movies
  const slice = movies.slice(0, number);
  const rows = slice.map((m, idx) => {
    return {
      '#': idx + 1,
      Title: m.title || m.original_title,
      'Release Date': m.release_date || '—',
      Rating: m.vote_average != null ? m.vote_average : '—',
      Overview: truncate(m.overview, 120)
    };
  });

  // console.table works well for simple display
  console.table(rows);
}

async function run({ type = 'playing', page = 1, number = 10 }) {
  const apiKey = process.env.TMDB_API_KEY;
  try {
    if (!apiKey) {
      console.error(chalk.red('Error: TMDB_API_KEY not set. Create a .env file with TMDB_API_KEY=your_key'));
      process.exitCode = 2;
      return;
    }

    const data = await fetchMovies({ apiKey, type, page });

    printHeader(type, data.page, data.total_pages || 1);

    if (!Array.isArray(data.results) || data.results.length === 0) {
      console.log(chalk.yellow('No movies found.'));
      return;
    }

    printMovies(data.results, number);

    // Helpful footer
    console.log(chalk.gray(`\nShowing ${Math.min(number, data.results.length)} of ${data.total_results || 'unknown'} results on this page.`));
    console.log(chalk.gray('Use --page N to fetch other pages.\n'));
  } catch (err) {
    console.error(chalk.red('Error:'), err.message || String(err));
    process.exitCode = 1;
  }
}

module.exports = run;
