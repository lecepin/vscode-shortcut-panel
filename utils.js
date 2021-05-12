const child_process = require("child_process");

function validCmd(cmd) {
  try {
    child_process.execSync(cmd);
    return true;
  } catch (error) {
    return false;
  }
}

function disposeTerminalByName(terminals, name) {
  terminals.map((item) => item.name == name && item.dispose());
}

module.exports = { validCmd, disposeTerminalByName };
