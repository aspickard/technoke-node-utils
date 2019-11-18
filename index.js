'use strict'

const {
  successResponse, unauthorizedResponse, errorResponse, corsResponse,
  optionsResponse, response, parseRequest, returnResponse, formatHeaders,
  decodeToken
} = require('./formatters')

const {
  info: info,
  warn: warn,
  error: error
} = require('./logging')

module.exports = {
  successResponse, unauthorizedResponse, errorResponse, corsResponse,
  optionsResponse, response, parseRequest, returnResponse, formatHeaders,
  decodeToken,
  info, warn, error
}

