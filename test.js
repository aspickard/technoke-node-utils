const { successResponse, error } = require('./index')

let resp = successResponse('test')
error(JSON.stringify(resp))
