const fs = require("fs");
const StreamZip = require("node-stream-zip");
const shell = require("shelljs");
const rimraf = require("rimraf");

/**
 * 删除对应路径的文件
 * @param filePath {string}
 * @param callback {function}
 */
function deleteFile(filePath, callback) {
  if (!filePath) {
    throw new Error("filePath can not defined");
  }

  fs.unlink(filePath, function(err) {
    // eslint-disable-next-line no-unused-expressions
    err && console.log(err);
    if (err) {
      throw new Error(err.message);
    }

    callback();
  });
}

function isDirEmpty(dirname) {
  return fs.promises.readdir(dirname).then(files => {
    return files.length === 0;
  });
}

/**
 * 删除文件夹
 * @param dirPath
 */
function deleteDir(dirPath) {
  if (!dirPath) {
    throw new Error("dirPath is required");
  }

  rimraf(dirPath, () => {});
}

/**
 * 复制文件夹
 * @param inputDirPath {string}
 * @param outputDirPath {string}
 */
function copyFiles(inputDirPath, outputDirPath) {
  return shell.cp("-R", inputDirPath, outputDirPath);
}

/**
 * 解压文件
 * @param filePath {String} 需要解压的文件夹的绝对路径
 * @param decompressFolderName {String} 解压后的文件夹名称
 * @param successCallBack {Function} 解压成功后的回调
 * @param errorCallBack {function} 解压失败后的回调
 * @param zipFileName
 */
function decompressFile(
  filePath,
  decompressFolderName,
  successCallBack,
  errorCallBack,
  zipFileName
) {
  const zip = new StreamZip({
    file: filePath,
    storeEntries: true
  });
  zip.on("ready", () => {
    zip.extract(null, `./`, (err, count) => {
      console.log(err ? "Extract error" : `文件创建完成`);
      if (err /** 抛出异常 */) {
        throw new Error(`Extract error: ${err.message}`);
      } else {
        /**
         * 解压成功后的回调
         */
        successCallBack();
        deleteFile(filePath, () => {});
        // Generator_template-react-temlate/template/
        copyFiles(`./${zipFileName}/template/*`, "./");
        deleteDir(zipFileName);
      }

      zip.close();
    });
  });
  zip.on("entry", entry => {
    if (entry.isDirectory) {
      console.log(`正在创建目录 ${entry.name}`);
    } else {
      console.log(`正在创建 ${entry.name}`);
    }
  });
}

module.exports = {
  deleteFile,
  decompressFile
};
