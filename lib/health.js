"use strict";

const http = require("http");
const express = require("express");
const semver = require("semver");
const checkDependencies = require("check-dependencies");
const fetch = require("node-fetch");

const defaultOpts = {
  host: "localhost",
  port: 9800,
  compatibleWith: {}
};

module.exports = function(opts) {
  this.opts = { ...defaultOpts, ...opts };

  this.listen = function() {
    const host = this.opts.host || undefined;
    const port = this.opts.port || 9800;

    this.server = http.createServer(this.app);

    if (host !== undefined && host !== "localhost") {
      this.server.listen(port, host, () => {
        if (this.opts.debug)
          console.log(`Health endpoint served on host:port: ${host}:${port} !`);
      });
    } else {
      this.server.listen(port, () => {
        if (this.opts.debug)
          console.log(`Health endpoint served on port: ${port} !`);
      });
    }
    return this;
  };

  this.shutdown = function() {
    if (this.server !== undefined) this.server.close();
    this.server = undefined;
  };

  this.getHealth = function() {
    let status = "UP";

    const compatibleWithErrors = Object.keys(this.opts.compatibleWith)
      .map(key => {
        if (!semver.validRange(this.opts.compatibleWith[key])) {
          return `Invalid sememantic versioning range on opts.compatibleWith['${key}']`;
        }
        return false;
      })
      .filter(element => {
        return element !== false;
      });
    if (compatibleWithErrors > 0) status = "ERRORED";

    return checkDependencies({}).then(dependencies => {
      if (!dependencies.depsWereOk) status = "ERRORED";

      if (this.opts.onHealth !== undefined) {
        this.opts.onHealth();
      }

      return {
        name: process.env.npm_package_name,
        version: process.env.npm_package_version,
        status: status,
        uptime: process.uptime(),
        compatibleWith: {
          ...this.opts.compatibleWith,
          error: compatibleWithErrors
        },
        dependencies: dependencies
      };
    });
  };

  this.isCompatibleWith = function(otherServiceName, otherServiceVersion) {
    if (this.opts.compatibleWith[otherServiceName] !== undefined) {
      const result = semver.satisfies(
        semver.coerce(otherServiceVersion),
        this.opts.compatibleWith[otherServiceName]
      );
      return result;
    } else {
      return false;
    }
  };

  this.app = express();
  this.app.get("/health", (req, res, next) => {
    return this.getHealth()
      .then(health => {
        res.json(health);
      })
      .catch(err => {
        console.log("error: ", err);
        res.status(500).json({ result: "error" });
      });
  });

  this.checkCompatabilityWith = function(otherServiceUrl) {
    return fetch(otherServiceUrl)
      .then(response => response.json())
      .then(json => this.isCompatibleWith(json.name, json.version))
      .catch(err => {
        console.log("error: ", err);
        return false;
      });
  };

  this.app = express();
  this.app.get("/health", (req, res, next) => {
    return this.getHealth()
      .then(health => {
        res.json(health);
      })
      .catch(err => {
        console.log("error: ", err);
        res.status(500).json({ result: "error" });
      });
  });
};
