const Octokit = require("@octokit/rest");
const pretty = require("pretty-bytes");

function createOctokit() {
  return new Octokit({
    userAgent: "prouser123/reposize/self_kit"
  });
}

async function BytesForSha(octokit, owner, repo, sha) {
  // Get the file tree for that commit
  const tree = await octokit.git.getTree({
    owner,
    repo,
    tree_sha: sha,
    recursive: 1
  });

  // Each object in data.tree has a size number in bytes
  let projectSize = 0;

  const t = tree.data.tree;

  // Iterate over every file that we found
  for (var i = 0, len = t.length; i < len; i++) {
    // If the value is a number, add it to the total
    if (Number.isInteger(t[i].size)) projectSize += t[i].size;
  }

  // return the total
  return projectSize;
}

async function Bytes(octokit, owner, repo) {
  // Get the most recent commit
  const commit = await octokit.repos.listCommits({
    owner,
    repo,
    per_page: 1
  });

  return await BytesForSha(octokit, owner, repo, commit.data[0].sha);
}

async function Pretty(octokit, owner, repo) {
  return pretty(await Bytes(octokit, owner, repo));
}

async function GetBytes(owner, repo) {
  return await Bytes(createOctokit(), owner, repo);
}

async function GetPrettyBytes(owner, repo) {
  return await Pretty(createOctokit(), owner, repo);
}

async function GetPrettyBytesWithKit(octokit, owner, repo) {
  return await Pretty(octokit, owner, repo);
}

async function GetBytesWithKit(octokit, owner, repo) {
  return await Bytes(octokit, owner, repo);
}

async function GetPrettyBytesWithKitSha(octokit, owner, repo, sha) {
  return await pretty(
    await GetPrettyBytesWithKitSha(octokit, owner, repo, sha)
  );
}

module.exports = {
  GetBytes,
  GetPrettyBytes
};

module.exports.withKit = {
  GetPrettyBytes: GetPrettyBytesWithKit,
  GetBytes: GetBytesWithKit,
  GetBytesFromSha: BytesForSha,
  GetPrettyBytesFromSha: GetPrettyBytesWithKitSha
};
