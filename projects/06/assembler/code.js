const TOKEN = require("./token");
const SymbolTable = require("./symbolTable");

const DEST_MAP = {
  null: "000",
  M: "001",
  D: "010",
  MD: "011",
  A: "100",
  AM: "101",
  AD: "110",
  AMD: "111",
};

const COMP_MAP = {
  101010: ["0"],
  111111: ["1"],
  111010: ["-1"],
  "001100": ["D"],
  110000: ["A", "M"],
  "001101": ["!D"],
  110001: ["!A", "!M"],
  "001111": ["-D"],
  110011: ["-A", "-M"],
  "011111": ["D+1"],
  110111: ["A+1", "M+1"],
  "001110": ["D-1"],
  110010: ["A-1", "M-1"],
  "000010": ["D+A", "D+M"],
  "010011": ["D-A", "D-M"],
  "000111": ["A-D", "M-D"],
  "000000": ["D&A", "D&M"],
  "010101": ["D|A", "D|M"],
};

const JUMP_MAP = {
  null: "000",
  JGT: "001",
  JEQ: "010",
  JGE: "011",
  JLT: "100",
  JNE: "101",
  JLE: "110",
  JMP: "111",
};

class Code {
  constructor(instructions, labels) {
    this.instructions = instructions;
    this.labels = labels;
    this.symbolTable = new SymbolTable(instructions, labels);
  }

  C_PREFIX = "111";

  toBinary() {
    const result = [];
    this.instructions.forEach((o) => {
      if (o.type === "A") {
        let address = o.value;
        if (o.isSymbol) {
          address = this.symbolTable.getAddress(o.value);
        }
        result.push(["0", this.numToBinary(address)].join(""));
      } else if (o.type === "C") {
        const [dest, comp, jump] = o.value;
        const c = [
          this.C_PREFIX,
          this.compToBinary(String(comp)),
          this.destToBinary(String(dest)),
          this.jumpToBinary(String(jump)),
        ];
        result.push(c.join(""));
      }
    });
    return result;
  }

  numToBinary(num) {
    const bin = Number(num).toString(2);
    const padZeroLength = Math.max(15 - bin.length, 0);
    const padZeros = "0".repeat(padZeroLength);
    return [padZeros, bin].join("");
  }

  destToBinary(dest) {
    return DEST_MAP[dest];
  }

  compToBinary(comp) {
    for (let key in COMP_MAP) {
      const values = COMP_MAP[key];
      const index = values.indexOf(comp);
      if (index >= 0) {
        return [index, key].join("");
      }
    }
  }

  jumpToBinary(jump) {
    return JUMP_MAP[jump];
  }
}

module.exports = Code;
