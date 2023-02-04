"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const filesApi = require("../api/file-api/index");
const { getBranchListRequest } = require("../api/github-api");

module.exports = class extends Generator {
  constructor(props, context) {
    super(props, context);
    this.branchsPromptListChoices = [];
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the badass ${chalk.red(
          "generator-template-demo"
        )} generator!`
      )
    );

    const prompts = [
      {
        type: "list",
        message: "请选择需要生成模板",
        name: "branch",
        choices: [...this.branchsPromptListChoices]
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  /**
   * 初始化 准备工作
   * @returns {Promise<void>}
   */
  async initializing() {
    try {
      console.log("正在下次拉取远程模板");
      const response = await getBranchListRequest();
      const list = await response.json(); // 分支列表
      list.forEach(item => {
        this.branchsPromptListChoices.push({
          name: item.name,
          value: item.name
        });
      });
    } catch (e) {
      console.log("Oops, error", e);
    }
  }

  /**
   * 写入文件
   */
  async writing() {
    const { branch } = this.props;
    await exec(
      `curl https://github.com/Shaun-Zhang0/generator_template/archive/refs/heads/${branch}.zip -O -J -L`,
      function(error, stdout, stderr) {
        if (error) {
          console.error("error", error);
          throw new Error(`EXEC error:${error.message}`);
        } else {
          filesApi.decompressFile(
            `./generator_template-${branch}.zip`,
            "project",
            () => {
              console.log("解压成功");
            },
            () => {},
            `generator_template-${branch}`
          );
        }
      }
    );
  }

  install() {
    this.installDependencies();
  }
};
