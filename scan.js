const { cosmiconfig } = require("cosmiconfig");
const packageList = require("./packageList");
const loadConfig = require("./loadConfig");
const inquirer = require("inquirer");

module.exports = function scan() {
  const devExplorer = cosmiconfig("locus", {
    searchPlaces: ["package.json"],
    packageProp: ["devDependencies"],
  });
  const explorer = cosmiconfig("locus", {
    searchPlaces: ["package.json"],
    packageProp: ["dependencies"],
  });

  explorer
    .search()
    .then((res) => {
      return devExplorer
        .search()
        .then((res2) => ({ ...res.config, ...res2.config }));
    })
    .then((res) => {
      return Object.keys(res).filter((item) =>
        Object.keys(packageList).includes(item)
      );
    })
    .then((res) => {
      inquirer
        .prompt({
          type: "list",
          name: "packages",
          message: "which package config do you want to load?",
          choices: res,
        })
        .then((answer) => {
          console.log(packageList[answer.packages]);
          loadConfig({ path: packageList[answer.packages] });
        });
    });
}
