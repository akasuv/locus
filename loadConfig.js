const ora = require("ora")();
const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");

// Load config
module.exports = function loadConfig(options) {
  const { path, dest = "" } = options;
  const pathType = getPathType(path);
  const generator = dest
    ? generateConfig
    : withFilenameInquirer(generateConfig);

  if (pathType === null) {
    console.log("Invalid path type");
    return;
  }
  if (pathType === "local" && validateLocalPath(path)) {
    generator(path, loadConfigByLocalPath, dest);
    return;
  }
  if (pathType === "url") {
    const rawUrl = path
      .replace("//github.com/", "//raw.githubusercontent.com/")
      .replace("/blob/", "/");

    ora.start("checking...");
    axios
      .get(rawUrl)
      .then((res) => {
        ora.stop();
        const contentType = res.headers["content-type"].split(";")[0];
        if (contentType === "text/plain") {
          generator(path, loadConfigByUrl, dest);
        } else {
          ora.fail("File not exist, please check the url ");
        }
      })
      .catch(() => {
        ora.fail("URL not exist, please check the url");
      });
  }
};

function validateLocalPath(path) {
  try {
    fs.statSync(path);
    return true;
  } catch (error) {
    ora.fail("no such file, please check the path");
  }
}

function getPathType(path) {
  const checkIsAbsolutePath = (path) => /^(\/([a-z]|[A-Z])+)+/.test(path);
  const checkIsRelativePath = (path) => /^(\.|\..)\/.+/.test(path);
  const checkIsLocalPath = (path) =>
    checkIsAbsolutePath(path) || checkIsRelativePath(path);
  const checkIsUrl = (path) =>
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
      path
    );

  if (checkIsLocalPath(path)) {
    return "local";
  }
  if (checkIsUrl(path)) {
    return "url";
  }
  return null;
}

function generateConfig(sourcePath, loader, dest) {
  loader(sourcePath, dest);
}

function withFilenameInquirer(callback) {
  return (...args) => {
    const defaultName = getDefaultFilename(args[0]);

    inquirer
      .prompt({
        name: "filename",
        type: "input",
        message: "change filename (press enter to skip):",
        default: defaultName,
      })
      .then((answers) => {
        const dest = `./${answers.filename}`;
        try {
          if (fs.statSync(dest)) {
            withOverrideConfirm(() => callback(...args.slice(0, 2), dest));
          }
        } catch {
          callback(...args.slice(0, 2), dest);
        }
      });
  };
}

function loadConfigByLocalPath(path, dest) {
  const data = fs.readFileSync(path, "utf8");
  fs.writeFileSync(dest, data);
  ora.succeed("File saved at: " + dest);
}

function loadConfigByUrl(url, dest) {
  const rawUrl = url
    .replace("//github.com/", "//raw.githubusercontent.com/")
    .replace("/blob/", "/");

  ora.start("loading...");
  axios.get(rawUrl).then((res) => {
    const contentType = res.headers["content-type"].split(";")[0];
    if (contentType === "text/plain") {
      fs.writeFileSync(dest, res.data);
      ora.succeed("File saved at: " + dest);
    } else {
      ora.fail("File not exist, please check the url ");
    }
  });
}
function getDefaultFilename(path) {
  return `${path.split("/").pop()}`;
}

function withOverrideConfirm(callback) {
  inquirer
    .prompt({
      name: "override",
      type: "confirm",
      message: "File already exists, do you want to override?",
    })
    .then((answers) => {
      answers.override && callback();
    });
}
