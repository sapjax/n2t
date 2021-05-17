// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.

@color
M=0

@SCREEN
D=A
@addr
M=D

@KBD
D=A
@max
M=D

(LOOP)

  // if addr = max, goto observer
  @max
  D=M
  @addr
  D=D-M
  @OBSERVER
  D;JEQ

  // draw color
  @color
  D=M
  @addr
  A=M
  M=D

  // set addr = addr + 16
  @addr
  M=M+1

  @LOOP
  0;JMP


(SETBLANK)
  // if blank, do nothing
  @color
  D=M+1
  @OBSERVER
  D;JEQ

  // set color to blank, then draw
  @color
  M=-1
  @LOOP
  0;JMP

(SETWHITE)
  // if white, do nothing
  @color
  D=M
  @OBSERVER
  D;JEQ

  // set color to white, then draw
  @color
  M=0
  @LOOP
  0;JMP

(OBSERVER)
  // reset addr
  @SCREEN
  D=A
  @addr
  M=D

  @KBD
  D=M
  @SETWHITE
  D;JEQ
  @SETBLANK
  D;JNE

(END)
  @END
  0;JMP
