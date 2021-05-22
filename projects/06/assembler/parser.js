const os = require("os");
const fs = require("fs");
const TOKEN = require("./token");

class Parser {
  constructor(filePath) {
    this.path = filePath;
  }

  readFile() {
    return fs.readFileSync(this.path, {
      encoding: "utf-8",
    });
  }

  trimSpace(line) {
    const lienWithoutComment = line.split(TOKEN.COMMENT)[0] || "";
    return lienWithoutComment.trim();
  }

  parseA(line) {
    return line.replace(TOKEN.A_INSTRUCTION, "");
  }

  parseC(line) {
    const [assignment, jump = null] = line.split(TOKEN.C_SEPARATOR);
    if (assignment.indexOf(TOKEN.ASSIGN) != -1) {
      let [dest, comp] = assignment.split(TOKEN.ASSIGN);
      return [dest, comp, jump];
    } else {
      return [null, assignment, jump];
    }
  }

  parseLabel(line) {
    return line.replace(TOKEN.LABEL_START, "").replace(TOKEN.LABEL_END, "");
  }

  parse() {
    const content = this.readFile();
    const lines = content.split(os.EOL);
    const instructions = [];
    const labels = [];
    let lineNumber = 0;
    for (let line of lines) {
      const l = this.trimSpace(line);
      switch (l[0]) {
        case TOKEN.COMMENT:
        case undefined:
          break;
        case TOKEN.A_INSTRUCTION:
          lineNumber++;
          instructions.push({
            type: "A",
            value: this.parseA(l),
            isSymbol: !/\d/.test(l[1]),
          });
          break;
        case TOKEN.LABEL_START:
          labels.push({
            value: this.parseLabel(l),
            lineNumber: lineNumber,
          });
          break;
        default:
          lineNumber++;
          instructions.push({
            type: "C",
            value: this.parseC(l),
          });
          break;
      }
    }
    return {
      instructions,
      labels,
    };
  }
}

module.exports = Parser;
