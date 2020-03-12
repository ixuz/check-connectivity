# check-connectivity

This module starts up an HTTP webserver with a single registered GET `/health` endpoint.

Example `/health` response body.

```json
{
  "name": "af-connect-demo",
  "version": "1.0.0-beta",
  "status": "UP",
  "uptime": 29.517,
  "compatibleWith": {
    "af-connect": "^1.0.0-beta",
    "af-portability": "^1.0.0-beta",
    "error": []
  },
  "dependencies": {
    "log": [
      "check-dependencies: installed: 1.1.0, expected: ^1.1.0",
      "dotenv: installed: 8.1.0, expected: ^8.1.0",
      "ejs: installed: 2.7.1, expected: ^2.7.1",
      "express: installed: 4.17.1, expected: ^4.17.1",
      "request: installed: 2.88.0, expected: ^2.88.0",
      "request-promise: installed: 4.2.4, expected: ^4.2.4",
      "semver: installed: 7.1.3, expected: ^7.1.3",
      "nodemon: installed: 1.19.2, expected: ^1.19.2"
    ],
    "error": [],
    "depsWereOk": true,
    "status": 0
  }
}
```

## Getting started

```js
// Start up health server
const healthServer = new require("check-connectivity")({
  compatibleWith: {
    "other-service": "^1.0.0", // <service name>: "<service version>"
    "another-service": "^2.0.0" // <service name>: "<service version>"
  }
}).listen();

// Check compatability with other service
healthServer
  .checkCompatabilityWith("http://other.service.com:9800/health")
  .then(result => console.log("Compatible: ", result));

// Gracefully shut down health server
healthServer.shutdown();
```
