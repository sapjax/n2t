// bootstrap
@256
D=A
@SP
M=D
// call Sys.init 0
// push retAddr
@Sys.init$ret.0
D=A
@SP
A=M
M=D
@SP
M=M+1
// save Sys.init state
// push LCL
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
// push ARG
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
// push THIS
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
// push THAT
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
// rePosition Sys.init ARG
@5
D=A
@SP
D=M-D
@ARG
M=D
// rePosition Sys.init LCL
@SP
D=M
@LCL
M=D
@Sys.init
0;JMP
// return Address: call Sys.init 0
(Sys.init$ret.0)

// function Main.fibonacci 0
(Main.fibonacci)

// push, argument 0
@0
D=A
@ARG
A=D+M
D=M
@SP
A=M
M=D
@SP
M=M+1

// push, constant 2
@2
D=A
@SP
A=M
M=D
@SP
M=M+1

// lt
@SP
A=M-1
D=M
A=A-1
D=D-M
M=-1
@J_true_0
-D;JLT
@2
D=A
@SP
A=M-D
M=0
(J_true_0)
@SP
M=M-1

// if-goto IF_TRUE
@SP
M=M-1
A=M
D=M
@Main.fibonacci$IF_TRUE
D;JNE

// goto IF_FALSE
@Main.fibonacci$IF_FALSE
0;JMP

(Main.fibonacci$IF_TRUE)

// push, argument 0
@0
D=A
@ARG
A=D+M
D=M
@SP
A=M
M=D
@SP
M=M+1

// write Main.fibonacci return
@LCL
D=M
@endFrame
M=D
@5
A=D-A
D=M
@retAddr
M=D
// *ARG = pop()
@SP
A=M-1
D=M
@ARG
A=M
M=D
// SP = ARG + 1
@ARG
D=M
@SP
M=D+1
// THAT = *(endFrame -1)
@endFrame
A=M-1
D=M
@THAT
M=D
// THIS = *(endFrame -2)
@2
D=A
@endFrame
A=M-D
D=M
@THIS
M=D
// ARG = *(endFrame -3)
@3
D=A
@endFrame
A=M-D
D=M
@ARG
M=D
// LCL = *(endFrame -4)
@4
D=A
@endFrame
A=M-D
D=M
@LCL
M=D
// goto retAddr
@retAddr
A=M
0;JMP

(Main.fibonacci$IF_FALSE)

// push, argument 0
@0
D=A
@ARG
A=D+M
D=M
@SP
A=M
M=D
@SP
M=M+1

// push, constant 2
@2
D=A
@SP
A=M
M=D
@SP
M=M+1

// sub
@SP
A=M-1
D=M
A=A-1
D=D-M
M=-D
@SP
M=M-1

// call Main.fibonacci 1
// push retAddr
@Main.fibonacci$ret.0
D=A
@SP
A=M
M=D
@SP
M=M+1
// save Main.fibonacci state
// push LCL
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
// push ARG
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
// push THIS
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
// push THAT
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
// rePosition Main.fibonacci ARG
@6
D=A
@SP
D=M-D
@ARG
M=D
// rePosition Main.fibonacci LCL
@SP
D=M
@LCL
M=D
@Main.fibonacci
0;JMP
// return Address: call Main.fibonacci 1
(Main.fibonacci$ret.0)

// push, argument 0
@0
D=A
@ARG
A=D+M
D=M
@SP
A=M
M=D
@SP
M=M+1

// push, constant 1
@1
D=A
@SP
A=M
M=D
@SP
M=M+1

// sub
@SP
A=M-1
D=M
A=A-1
D=D-M
M=-D
@SP
M=M-1

// call Main.fibonacci 1
// push retAddr
@Main.fibonacci$ret.1
D=A
@SP
A=M
M=D
@SP
M=M+1
// save Main.fibonacci state
// push LCL
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
// push ARG
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
// push THIS
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
// push THAT
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
// rePosition Main.fibonacci ARG
@6
D=A
@SP
D=M-D
@ARG
M=D
// rePosition Main.fibonacci LCL
@SP
D=M
@LCL
M=D
@Main.fibonacci
0;JMP
// return Address: call Main.fibonacci 1
(Main.fibonacci$ret.1)

// add
@SP
A=M-1
D=M
A=A-1
D=D+M
M=D
@SP
M=M-1

// write Main.fibonacci return
@LCL
D=M
@endFrame
M=D
@5
A=D-A
D=M
@retAddr
M=D
// *ARG = pop()
@SP
A=M-1
D=M
@ARG
A=M
M=D
// SP = ARG + 1
@ARG
D=M
@SP
M=D+1
// THAT = *(endFrame -1)
@endFrame
A=M-1
D=M
@THAT
M=D
// THIS = *(endFrame -2)
@2
D=A
@endFrame
A=M-D
D=M
@THIS
M=D
// ARG = *(endFrame -3)
@3
D=A
@endFrame
A=M-D
D=M
@ARG
M=D
// LCL = *(endFrame -4)
@4
D=A
@endFrame
A=M-D
D=M
@LCL
M=D
// goto retAddr
@retAddr
A=M
0;JMP

// function Sys.init 0
(Sys.init)

// push, constant 4
@4
D=A
@SP
A=M
M=D
@SP
M=M+1

// call Main.fibonacci 1
// push retAddr
@Sys.init$ret.1
D=A
@SP
A=M
M=D
@SP
M=M+1
// save Sys.init state
// push LCL
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
// push ARG
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
// push THIS
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
// push THAT
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
// rePosition Sys.init ARG
@6
D=A
@SP
D=M-D
@ARG
M=D
// rePosition Sys.init LCL
@SP
D=M
@LCL
M=D
@Main.fibonacci
0;JMP
// return Address: call Main.fibonacci 1
(Sys.init$ret.1)

(Sys.init$WHILE)

// goto WHILE
@Sys.init$WHILE
0;JMP
