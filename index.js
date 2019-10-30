const Octokit = require("@octokit/rest");

const octokit = new Octokit({
  userAgent: "prouser123/reposize"
});

async function GetSizeFromRepo(owner, repo) {
  // Get the most recent commit
  octokit.repos.listCommits({ owner, repo, per_page: 1 }).then(data => {
    octokit.git
      .getTree({ owner, repo, tree_sha: data.data[0].sha, recursive: 1 })
      .then(data => {
        // Each object in data.tree has a size number in bytes
        let projectSize = 0;
        // Iterate over every file that we found
        for (var i = 0, len = data.data.tree.length; i < len; i++) {
          // If the value is a number, add it to the total
          if (Number.isInteger(data.data.tree[i].size))
            projectSize += data.data.tree[i].size;
        }
        // give the total
        console.log(require("pretty-bytes")(projectSize));
      });
  });
}

GetSizeFromRepo("Inrixia", "floatplane-downloader");
GetSizeFromRepo("mdmulti", "client-unity");
