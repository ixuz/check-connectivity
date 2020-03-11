test("getHealth", done => {
  const Health = require("../index");
  const health = new Health({
    compatibleWith: {
      foo: "^1.0.0",
      bar: "^2.0.0"
    }
  });

  health.getHealth().then(result => {
    expect(result.status).toBe("UP");
    expect(result.uptime).toBeGreaterThan(0);
    expect(typeof result.dependencies).toBe("object");
    expect(result.dependencies.depsWereOk).toBeDefined();
    expect(result.dependencies.depsWereOk).toBeTruthy();
    done();
  });
});

test("isCompatibleWith", () => {
  const Health = require("../index");
  const health = new Health({
    compatibleWith: {
      foo: "^1.0.0",
      bar: "^2.0.0",
      baz: "^3.9.12"
    }
  });

  expect(health.isCompatibleWith("foo", "1.2.3")).toBeTruthy();
  expect(health.isCompatibleWith("foo", "0.5.1")).toBeFalsy();
  expect(health.isCompatibleWith("bar", "2.3.1")).toBeTruthy();
  expect(health.isCompatibleWith("bar", "1.1.1")).toBeFalsy();
  expect(health.isCompatibleWith("baz", "3.9.36-alpha")).toBeTruthy();
  expect(health.isCompatibleWith("baz", "3.9.11-alpha")).toBeFalsy();
});
