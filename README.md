![alt text][logo]

[logo]: https://github.com/MagnumOpuses/project-meta/blob/master/img/jobtechdev_black.png "JobTech dev logo"

[A JobTech Project](https://www.jobtechdev.se)

# Check Connectivity

This is a small node module that helps you monitor the health of your web service.

- [Versions](#versions)
- [Interface Diagram](#interface-diagram)
- [Getting Started](#getting-started)
  - [Step 1: Acquire this package](#step-1-acquire-this-package)
  - [Step 2: Configure and start embedded server](#step-2-configure-and-start-embedded-server)
  - [Step 3: Install middleware](#step-3-install-middleware)
  - [Step 4: Graceful shutdown of embedded server](#step-4-graceful-shutdown-of-embedded-server)
- [Routes](#routes)
  - [`/health`](#health)
    - [Input parameters](#input-parameters)
    - [Example HTTP request](#example-http-request)
    - [Example HTTP response](#example-http-response)
  - [`/checkCompatability`](#checkcompatability)
    - [Input parameters](#input-parameters-1)
    - [Example HTTP request](#example-http-request-1)
    - [Example HTTP response](#example-http-response-1)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Versions

1.0.1-beta

### Interface diagram

![Interface diagram v1](.github/img/interface-diagram-v1.png?raw=true)

## Getting started

### Step 1: Acquire this package

This module has not yet been published to NPM, therefore we suggest you install it directly from this GitHub repository.

```
npm install git+https://git@github.com/MagnumOpuses/check-connectivity
```

### Step 2: Configure and start embedded server

```js
// Start up the health server
const healthServer = new require("check-connectivity")({
  port: 9801, // Optional configuration property, default 9800.
  compatibleWith: {
    "other-service": "^1.0.0", // <service name>: "<service version>"
    "another-service": "^2.0.0" // <service name>: "<service version>"
  }
}).listen();
```

:warning: A general recommendation is to not publically expose the operational port of the health server (default port: 9800).

### Step 3: Install middleware

The health middleware serves an endpoint (`/checkCompatability`) that allows other external services to call and verify version compatability.

Install the check-connectivity middleware into your own Express server.

```js
// Your Express app
const app = require("express")(); // A sample Express app.

// Install middleware into your main express app.
// This enables the route "/checkCompatability"
app.use(health.middleware());
```

### Step 4: Graceful shutdown of embedded server

```js
// Graceful shutdown of embedded server
healthServer.shutdown();
```

---

## Routes

| Route                                        | Method | Location                           | Description                                                                                                                                                                                       |
| -------------------------------------------- | ------ | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`/health`](#health)                         | `GET`  | Embedded server                    | This endpoint presents the current health state of this application. In general, this endpoint is not intended to be served to be public.                                                         |
| [`/checkCompatability`](#checkcompatability) | `GET`  | Your Express server(as middleware) | This endpoint will return a positive response if the provided query parameters (`name` and `version`) satisfies the compatible semver range defined in options upon instantiation of this module. |

### `/health`

#### Input parameters

None

#### Example HTTP request

```
$ curl http://localhost:3000/health
```

#### Example HTTP response

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

### `/checkCompatability`

#### Input parameters

| Parameter name | Parameter type | Usage description                                       |
| -------------- | -------------- | ------------------------------------------------------- |
| `name`         | Query          | Name of the calling service (e.g. `sample-web-service`) |
| `version`      | Query          | Version of the calling service (e.g. `3.11.5-beta`)     |

#### Example HTTP request

```
$ curl http://localhost:3000/checkCompatability?name=foo&version=1.2.3
```

#### Example HTTP response

```json
{
  "result": true
}
```

## Contributing

For small projects you can just add a few sentences if and how you'd like people to contribute.

For larger projects add a [CONTRIBUTING.md](CONTRIBUTING_TEMPLATE.md) file with a detailed description of how contributions are to be made. See the [CONTRIBUTING.md template](CONTRIBUTING_TEMPLATE.md).

## License

Add the license name and a link to the license file that contains the full text.

## Acknowledgments

Add any acknowledgments you might want to share (inspiration etc.).
