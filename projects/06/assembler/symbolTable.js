const PRELOAD_LABEL_TABLE = {
  SP: 0,
  LCL: 1,
  ARG: 2,
  THIS: 3,
  THAT: 4,

  R0: 0,
  R1: 1,
  R2: 2,
  R3: 3,
  R4: 4,
  R5: 5,
  R6: 6,
  R7: 7,
  R8: 8,
  R9: 9,
  R10: 10,
  R11: 11,
  R12: 12,
  R13: 13,
  R14: 14,
  R15: 15,

  SCREEN: 16384,
  KBD: 24576,
};

class SymbolTable {
  varIndex = 16;

  constructor(instructions, labels) {
    this.table = { ...PRELOAD_LABEL_TABLE };
    this.addLabelSymbols(labels);
    this.addInstructionSymbols(instructions);
  }

  addSymbol(symbol, value) {
    this.table[symbol] = value;
  }

  addLabelSymbols(labels) {
    labels.forEach((label, i) => {
      this.table[label.value] = label.lineNumber;
    });
  }

  addInstructionSymbols(instructions) {
    instructions.forEach((o) => {
      if (o.type === "A" && o.isSymbol) {
        if (!this.has(o.value)) {
          this.addSymbol(o.value, this.varIndex++);
        }
      }
    });
  }

  has(symbol) {
    return symbol in this.table;
  }

  getAddress(symbol) {
    return this.table[symbol];
  }
}

module.exports = SymbolTable;
