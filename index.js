#! /usr/bin/env node
const minimist = require("minimist");
const handlers = {
  load: require("./loadConfig"),
  list: require("./list"),
  scan: require("./scan"),
};
const validOptions = require("./options");

function checkValidation(options) {
  const properties = Object.keys(options);
  function checkLimit() {
    return properties.length === 2;
  }
  function checkExistence() {
    return properties.slice(1).every((item) => Object.keys(validOptions).includes(item));
  }
  if (checkExistence() && checkLimit()) {
    return Promise.resolve(getOption(options));
  }
  return Promise.reject(
    "Run 'locus --help' to see available commands and options"
  );
}

// get executable option
function getOption(options) {
  const key = Object.keys(options)[1];
  return key === "load" ? [key, { path: options[key] }] : [key, options[key]];
}

function getInputs() {
  return Promise.resolve(minimist(process.argv.slice(2)));
}

function handleCommand([name, value]) {
  handlers[validOptions[name].handler](value);
}

function locus() {
  getInputs()
    .then(checkValidation)
    .then(handleCommand)
    .catch((err) => console.log(err));
}

locus();
