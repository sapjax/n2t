import { KIND } from './grammar'

type TableItem = {
  name: string
  type: string
  kind: KIND
  index: number
}

type Table = {
  [name: string]: TableItem
}

class SymbolTable {
  #classTable: Table = {}
  #subroutineTable: Table = {}

  constructor() {}

  startSubroutine() {
    this.#subroutineTable = {}
  }

  #isClassKind(kind: KIND) {
    return kind === KIND.field || kind === KIND.static
  }

  #tableOf(kind: KIND) {
    return this.#isClassKind(kind) ? this.#classTable : this.#subroutineTable
  }

  /**
   * defines a new identifier of a given name, type and kind and
   * assigns it a running index.
   * STATIC and FIELD identifiers have a class scope, while ARG and VAR
   * identifiers have a subroutine scope.
   */
  define(name: string, type: string, kind: KIND) {
    const table = this.#tableOf(kind)
    table[name] = {
      name,
      type,
      kind,
      index: this.varCount(kind),
    }
  }

  /**
   * return the number of variables of the given kind already defined
   * in the current scope
   */
  varCount(kind: KIND): number {
    const table = this.#tableOf(kind)
    return Object.values(table).filter(item => item.kind === kind).length
  }

  /**
   * return the kind of the named identifier in the current scope
   * If the identifier is unknown in the current scope, return NONE.
   */
  kindOf(name: string): KIND {
    return (this.#subroutineTable[name] ?? this.#classTable[name])?.kind
  }

  /**
   * return the type of the named identifier in the current scope
   */
  typeOf(name: string) {
    return (this.#subroutineTable[name] ?? this.#classTable[name])?.type
  }

  /**
   * return the index assigned to the named identifier
   * If no index found, return -1
   */
  indexOf(name: string): number {
    return (this.#subroutineTable[name] ?? this.#classTable[name])?.index ?? -1
  }
}

export default SymbolTable
