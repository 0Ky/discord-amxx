const fs = require('node:fs');
const path = require('node:path');
const log = require('./logger');

function getCommandFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  const files = entries
    .filter((entry) => !entry.isDirectory() && entry.name.endsWith('.js'))
    .map((entry) => path.join(dir, entry.name));

  for (const folder of entries.filter((entry) => entry.isDirectory())) {
    files.push(...getCommandFiles(path.join(dir, folder.name)));
  }

  return files;
}

module.exports = { getCommandFiles };
