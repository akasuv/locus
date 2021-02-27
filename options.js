module.exports = {
  load: {
    description:
      "load specific configuration files from Github repos/recommend templates",
    handler: "load",
  },
  list: {
    description: "display all available configuration files from Github repo",
    handler: "list",
  },
  scan: {
    description: "scan package.json and display all configurable packages",
    handler: "scan",
  },
};
