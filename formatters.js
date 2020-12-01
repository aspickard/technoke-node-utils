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
  if(req.headers['content-type'].indexOf('multipart/form-data') > -1) {
    req.setEncoding('latin1')
  }
  return new Promise((resolve, reject) => {
    try {
      let body = ''
      req.on('data', chunk => {
        body += chunk
      })
      req.on('end', async () => {
        if(req.headers['content-type'].indexOf('multipart/form-data') > -1) {
          let data = parseFile(body)
          resolve(data)
        }
        else {
          let data = JSON.parse(body)
          resolve(data)
        }
      })
    }
    catch (error) {
      reject()
    }
  })
}

function getMatching(string, regex) {
  // Helper function when using non-matching groups
  const matches = string.match(regex)
  if (!matches || matches.length < 2) {
    return null
  }
  return matches[1]
}

const parseFile = (item) => {
  let result = {}
  let name = getMatching(item, /(?:name=")(.+?)(?:")/)
  let value = getMatching(item, /(?:\r\n\r\n)([\S\s]*)(?:\r\n)/)
  let filename = getMatching(item, /(?:filename=")(.*?)(?:")/)
  if (filename && (filename = filename.trim())) {
    // Add the file information in a files array
    let file = {}
    file[name] = value
    file['filename'] = filename
    let contentType = getMatching(item, /(?:Content-Type:)(.*?)(?:\r\n)/)
    if (contentType && (contentType = contentType.trim())) {
      file['Content-Type'] = contentType
    }
    if (!result.files) {
      result.files = []
    }
    result.files.push(file)
  } else {
    // Key/Value pair
    result[name] = value
  }
  return result
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

module.exports = {
  successResponse, unauthorizedResponse, errorResponse, corsResponse,
  optionsResponse, response, parseRequest, returnResponse, formatHeaders,
  decodeToken
}
