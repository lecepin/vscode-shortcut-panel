const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const CustomCmdViewProvider = require("./provider/custom-cmd-view");
const LocalStorage = require("./storage/localStorage");

function _refreshCustomView(vProvider, data) {
  vscode.commands.executeCommand(
    "setContext",
    "lp-shortcut-panel.showCustomWelcome",
    data.length ? false : true
  );
  vProvider.setData(data);
  vProvider.refresh();
}

function activate(context) {
  // 本地存储
  const localStorage = new LocalStorage(context);

  // 面板：自定义命令
  const customCmdViewProvider = new CustomCmdViewProvider();
  vscode.window.registerTreeDataProvider(
    "lp-shortcut-panel-custom-commands",
    customCmdViewProvider
  );
  _refreshCustomView(customCmdViewProvider, localStorage.getAllValue());

  // 命令：exec
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "lp-shortcut-panel.exec-cmd",
      async (arg) => {
        vscode.window.terminals.map(
          (item) => item.name == arg.title && item.dispose()
        );
        const terminal = vscode.window.createTerminal(arg.title);

        terminal.show();
        terminal.sendText(arg.cmd);
      }
    )
  );

  // 命令：add
  context.subscriptions.push(
    vscode.commands.registerCommand("lp-shortcut-panel.add-cmd", async () => {
      const cmdName = await vscode.window.showInputBox({
        title: "命令名称",
        placeHolder: "请输入命令名称",
      });
      if (!cmdName) {
        return;
      }

      const cmdContent = await vscode.window.showInputBox({
        title: "命令内容",
        placeHolder: "请输入命令内容",
      });
      if (!cmdContent) {
        return;
      }

      await localStorage.setValue(cmdName, {
        label: cmdName,
        content: cmdContent,
        command: "lp-shortcut-panel.exec-cmd",
        args: [{ cmd: cmdContent, title: cmdName }],
      });
      _refreshCustomView(customCmdViewProvider, localStorage.getAllValue());
    })
  );

  // 命令：npm start
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "lp-shortcut-panel.npm-start",
      async (arg) => {
        vscode.window.terminals.map(
          (item) => item.name == "启动项目" && item.dispose()
        );
        const terminal = vscode.window.createTerminal("启动项目");

        terminal.show();
        terminal.sendText(`tnpm i && npm start`);
      }
    )
  );

  // 命令：del node_modules
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "lp-shortcut-panel.del-nodemodules",
      async (arg) => {
        vscode.window.withProgress(
          {
            title: "正在删除 node_modules …",
            cancellable: false,
            location: vscode.ProgressLocation.Notification,
          },
          (progress) => {
            return new Promise((res) => {
              setTimeout(() => {
                try {
                  child_process.execSync(
                    `rm -rf ${path.join(
                      vscode.workspace.rootPath,
                      "node_modules"
                    )}`
                  );
                } catch (error) {
                  console.error(error);
                  vscode.window.showErrorMessage("删除 node_modules 失败！");
                }
                res();
              });
            });
          }
        );
      }
    )
  );

  // 命令：npm start
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "lp-shortcut-panel.pub-def",
      async (arg) => {
        vscode.window.terminals.map(
          (item) => item.name == "发布 DEF" && item.dispose()
        );
        const terminal = vscode.window.createTerminal("发布 DEF");

        terminal.show();
        terminal.sendText(`def p`);
      }
    )
  );

  // 命令：modify
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "lp-shortcut-panel.modify-cmd",
      async (arg) => {
        console.log(arg);
        const cmdObj = localStorage.getValue(arg.label.label);
        console.log(cmdObj);
        const cmdName = await vscode.window.showInputBox({
          title: "命令名称",
          placeHolder: "请输入命令名称",
          value: cmdObj.label,
        });
        if (!cmdName) {
          return;
        }

        const cmdContent = await vscode.window.showInputBox({
          title: "命令内容",
          placeHolder: "请输入命令内容",
          value: cmdObj.content,
        });
        if (!cmdContent) {
          return;
        }
        await localStorage.remove(arg.label.label);
        await localStorage.setValue(cmdName, {
          label: cmdName,
          content: cmdContent,
          command: "lp-shortcut-panel.exec-cmd",
          args: [{ cmd: cmdContent, title: cmdName }],
        });
        _refreshCustomView(customCmdViewProvider, localStorage.getAllValue());
      }
    )
  );

  // 命令：del
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "lp-shortcut-panel.del-cmd",
      async (arg) => {
        const del = await vscode.window.showQuickPick(["删除", "取消"], {
          title: "确定要删除？",
        });

        if (del == "删除") {
          await localStorage.remove(arg.label.label);
          _refreshCustomView(customCmdViewProvider, localStorage.getAllValue());
        }
      }
    )
  );
}

function deactivate() {
  vscode.window.terminals.map((terminal) => terminals.dispose());
}

module.exports = {
  activate,
  deactivate,
};
