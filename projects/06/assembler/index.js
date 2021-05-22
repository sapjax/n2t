const fs = require("fs");
const path = require("path");
const process = require("process");
const Parser = require("./parser");
const Code = require("./code");

async function main() {
  const fileName = process.argv[2];
  const filePath = path.join(__dirname, fileName);
  const parser = new Parser(filePath);
  const { instructions, labels } = parser.parse();
  const code = new Code(instructions, labels);
  const binaryLines = code.toBinary();
  const content = binaryLines.join("\n");
  writeFile(content, filePath);
}

function writeFile(content, filePath) {
  const fileName = path.basename(filePath, ".asm") + ".hack";
  const outPath = path.join(path.dirname(filePath), fileName);
  fs.writeFileSync(outPath, content);
  console.log("Assembler Run Successfully!");
}

main();
