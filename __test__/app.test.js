const request = require("supertest");

test("/health endpoint", done => {
  const Health = require("../index");
  const health = new Health({
    host: "localhost",
    port: 9800,
    compatibleWith: {
      foo: "^1.0.0",
      bar: "^2.0.0"
    }
  });

  request(health.app)
    .get("/health")
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      done();
    });
});
