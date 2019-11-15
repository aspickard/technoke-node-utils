# Technoke Node Utils

Technoke NodeJS utility methods. Common methods utilized for REST network formatting and logging.

## How to Use

1. npm install --save "git+ssh://git@github.com:aspickard/technoke-npm-utils.git"
2. import { method } from 'technoke-utils'

## Methods

### Logging

The logging methods control console output. There are three log levels; in order of increasing severity they
are INFO, WARN, ERROR. A message can be output with corresponding severity through the use of the info(),
warn() and error() methods. To change the level of log output, set the LOG_LEVEL environment variable. 1
(default) will print only error level messages, while 2 will print warn and error messages, and finally 3 will
print all levels of debug output.

```
import {info, warn, error} from 'technoke-utils'
process.env.LOG_LEVEL = 3
info("I will be printed to the console output.")
process.env.LOG_LEVEL = 2
info("Now I will not print to the console.")
warn("But I will.")
error("And so will I!")
```

### Formatters

The formatter methods are mostly utilized to format HTTP responses for REST APIs.

```
successResponse (data): Returns formatted a 200 response including a cors headers and data as the body.
unauthorizedResponse: Returns formatted a 401 response with cors headers.
errorResponse (data): Returns formatted a 500 error response with data as the body.
corsResponse (statusCode, data): Returns formatted a response with cors headers, statusCode, and data as body
optionsResponse: Returns formatted options response that allows credentials, GET, OPTIONS, and POST.
response (statusCode, cors, contentType, data): Base response formatter.
parseRequest: Parses a node request object and asynchronously returns it.
returnResponse: Takes a node response object and writes the given response data to the stream.
formatHeaders (token): Formats headers for authenticated form requests.
decodeToken (token, secret): Decodes a JWT tocken utilizing the provided JWT secret.
```
