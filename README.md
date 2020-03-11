# check-connectivity

## Geting started

```js
// Start up health server
const healthServer = new require("check-connectivity")({
  compatibleWith: {
    foo: "^1.0.0",
    bar: "^2.0.0"
  }
}).listen();

// Gracefully shut down health server
healthServer.shutdown();
```
