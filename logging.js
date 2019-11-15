const LOG_LEVEL = process.env['LOG_LEVEL'] || 1

const LOG_LEVELS = {
  1: 'ERROR',
  2: 'WARNING',
  3: 'INFO'
}

function log(message, level) {
  if (!level) {
    level = 3
  }
  if (LOG_LEVEL >= level) {
    console.log(`${LOG_LEVELS[level]}: ${message}`)
  }
}

function error(message) {
  log(message, 1)
}

function warn(message) {
  log(message, 2)
}

function info(message) {
  log(message, 3)
}

module.exports = {
  info: info,
  warn: warn,
  error: error
}
