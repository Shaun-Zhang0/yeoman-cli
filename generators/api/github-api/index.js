const fetch = require("node-fetch");
const PRIVATE_TOKEN = "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";
const OWNER = "Shaun-Zhang0";
const REPOSITORY = "generator_template";

/**
 * Github请求
 * @param url 请求地址 {string}
 * @param options 参数 {object|null}
 * @returns {Promise}
 */
function githubRequest(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      Authorization: PRIVATE_TOKEN
    }
  });
}

/**
 * 拉取所有分支
 * @returns {Promise}
 */
function getBranchListRequest() {
  return githubRequest(
    `https://api.github.com/repos/${OWNER}/${REPOSITORY}/branches`
  );
}

/**
 * 获取分支的文件列表
 * @param branch 分支列表 {string}
 * @returns {Promise}
 */
function getFilesRequest(branch) {
  return githubRequest(
    `https://api.github.com/repos/${OWNER}/${REPOSITORY}/contents/template`,
    { ref: branch }
  );
}

function downloadFile(branch, filePath) {
  console.log("downloadSingleFile", branch, filePath);
  const url = new URL(
    `${OWNER}/${REPOSITORY}/master/template/index.html`,
    "https://raw.githubusercontent.com"
  );
  return githubRequest(
    // `https://raw.githubusercontent.com/${OWNER}/${REPOSITORY}/${branch}/${filePath}`
    `https://raw.githubusercontent.com/${OWNER}/${REPOSITORY}/master/template/index.html`,
    // Url,
    { "Content-Type": "text/plain" }
  );
}

module.exports = {
  getBranchListRequest,
  getFilesRequest,
  downloadSingleFile: downloadFile
};
