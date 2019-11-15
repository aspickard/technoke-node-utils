const jwt = require('jsonwebtoken')

const response = (statusCode, cors, contentType, data) => {
  let resp = {
      statusCode: statusCode,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json',
        'Content-Security-Policy': `default-src \'self\' *.${process.env.BASE_DOMAIN}`
      }
    }

  if (cors) {
    resp.headers['Access-Control-Allow-Origin'] = '*'
  }

  if (data) {
    try {
      JSON.parse(data)
    } catch (e) {
      data = JSON.stringify(data)
    }
    resp.body = data
  }

  return resp
}

const corsResponse = (statusCode, data) => {
  return response(statusCode, true, 'application/json', data)
}

const successResponse = (data) => {
  return corsResponse(200, data)
}

const unauthorizedResponse = () => {
  return corsResponse(401)
}

const errorResponse = (statusCode, data) => {
  return corsResponse(statusCode || 500, data)
}

const optionsResponse = () => {
  let resp = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'X-PINGOTHER,Content-Type,Authorization',
      'Access-Control-Allow-Credentials': true
    }
  }
  return resp
}

const parseRequest = async (req) => {
  return new Promise((resolve, reject) => {
    try {
      let body = ''
      req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
      })
      req.on('end', async () => {
        let data = JSON.parse(body)
        resolve(data)
      })
    }
    catch (error) {
      reject()
    }
  })
}

const returnResponse = (res, response) => {
  res.writeHead(response.statusCode, response.headers)
  if (response.body) {
    res.write(JSON.stringify(response.body))
  }
  res.end()
}

const formatHeaders = (token) => {
  let headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

const decodeToken = async (token, secret) => {
  return new Promise((resolve, reject) => {
    token = token.substring("Bearer: ".length)
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        console.log(err)
        reject()
      }

      // if everything is good, save to request for use in other routes
      console.log('Authentication successful', decoded.id)
      resolve(decoded)
    })
  })
}

export {
  successResponse, unauthorizedResponse, errorResponse, corsResponse,
  optionsResponse, response, parseRequest, returnResponse, formatHeaders,
  decodeToken
}
