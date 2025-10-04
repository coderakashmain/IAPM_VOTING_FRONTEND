// src/utils/logger.js

export function log(level = 'info', message, data = null) {
  const timestamp = new Date().toISOString();
  const output = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

  if (data) {
    console[level] ? console[level](output, data) : console.log(output, data);
  } else {
    console[level] ? console[level](output) : console.log(output);
  }
}
