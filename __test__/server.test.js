const fetch = require("node-fetch");

test("server listen", done => {
  const Health = require("../index");
  const health = new Health({
    host: "localhost",
    port: 9800,
    compatibleWith: {
      foo: "^1.0.0",
      bar: "^2.0.0"
    }
  }).listen();

  fetch("http://localhost:9800/health")
    .then(result => {
      expect(result.status).toBe(200);
      health.shutdown();
      done();
    })
    .catch(err => {
      health.shutdown();
      done.fail("Failed to query health app server! Error: " + err);
    });
});

test("check compatability with other health server", done => {
  const Health = require("../index");

  const healthA = new Health({
    host: "localhost",
    port: 9800,
    compatibleWith: {
      foo: "^1.0.0",
      bar: "^2.0.0",
      "check-connectivity": "^1.0.0"
    }
  }).listen();

  const healthB = new Health({
    host: "localhost",
    port: 9900,
    compatibleWith: {
      foo: "^1.0.0",
      bar: "^2.0.0"
    }
  }).listen();

  healthA
    .checkCompatabilityWith("http://localhost:9900/health")
    .then(result => {
      expect(result).toBeTruthy();
      healthA.shutdown();
      healthB.shutdown();
      done();
    })
    .catch(err => {
      healthA.shutdown();
      healthB.shutdown();
      done.fail("Failed to query other health app server! Error: " + err);
    });
});
