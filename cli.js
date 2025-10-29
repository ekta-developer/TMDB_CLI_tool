#!/usr/bin/env node

require('dotenv').config();
const { program } = require('commander');
const run = require('./src/index');

program
  .name('tmdb-app')
  .description('CLI to fetch movies from TMDB')
  .option('-t, --type <type>', 'movie type: playing|popular|top|upcoming', 'playing')
  .option('-p, --page <page>', 'page number (TMDB pagination)', '1')
  .option('-n, --number <n>', 'number of items to show (max 20)', '10')
  .parse(process.argv);

const opts = program.opts();

run({
  type: opts.type,
  page: parseInt(opts.page, 10) || 1,
  number: Math.min(Math.max(parseInt(opts.number, 10) || 10, 1), 20)
});
