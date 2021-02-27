const { Octokit } = require("@octokit/core");
const octokit = new Octokit();

module.exports = function fetchFromGithub() {
  octokit
    .request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: "akasuv",
      repo: "configurations",
      path: "",
    })
    .then((res) => console.log(res))
    .catch((err) => {
      console.log("Fetch from Github failed", err);
    });
}
