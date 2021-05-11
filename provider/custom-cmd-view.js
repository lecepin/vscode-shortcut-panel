const vscode = require("vscode");
const path = require("path");

class CustomCmdView {
  constructor() {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    this.data = [];
  }

  setData(data) {
    this.data = data;
  }

  getTreeItem(element) {
    return element;
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getChildren() {
    return this.data.map(
      (item) =>
        new CustomCmdViewItem({
          label: item.label,
          tooltip: "执行：" + item.content,
          command: {
            command: item.command,
            arguments: item.args,
          },
        })
    );
  }
}

class CustomCmdViewItem extends vscode.TreeItem {
  constructor(props) {
    super(props);

    if (props.iconPath) {
      this.iconPath = props.iconPath;
    } else {
      this.iconPath = {
        dark: path.join(__dirname, "../icon/script-d.svg"),
        light: path.join(__dirname, "../icon/script-l.svg"),
      };
    }

    if (props.command) {
      this.command = props.command;
    }

    if (props.tooltip) {
      this.tooltip = props.tooltip;
    }
  }
}

module.exports = CustomCmdView;
