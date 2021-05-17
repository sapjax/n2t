// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)
//
// This program only needs to handle arguments that satisfy
// R0 >= 0, R1 >= 0, and R0*R1 < 32768.

// Put your code here.

// index = 0
@index
M=0
@product
M=0

@R1
D=M
@times
M=D

// loop
(LOOP)
  // if index > R1, stop to end
  @times
  D=M
  @index
  D=D-M
  @STOP
  D;JEQ

  @R0
  D=M
  @product
  M=M+D
  @index
  M=M+1
  @LOOP
  0;JMP

(STOP)  
  @product
  D=M
  @R2
  M=D

// end
(END)
  @END
  0;JMP