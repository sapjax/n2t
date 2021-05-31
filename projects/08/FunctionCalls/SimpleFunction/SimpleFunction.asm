// function SimpleFunction.test 2
(SimpleFunction.test)
@0
D=A
@SP
A=M
M=D
@SP
M=M+1
@0
D=A
@SP
A=M
M=D
@SP
M=M+1

// push, local 0
@0
D=A
@LCL
A=D+M
D=M
@SP
A=M
M=D
@SP
M=M+1

// push, local 1
@1
D=A
@LCL
A=D+M
D=M
@SP
A=M
M=D
@SP
M=M+1

// add
@SP
A=M-1
D=M
A=A-1
D=D+M
M=D
@SP
M=M-1

// not
@SP
A=M-1
D=!M
M=D

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

// add
@SP
A=M-1
D=M
A=A-1
D=D+M
M=D
@SP
M=M-1

// push, argument 1
@1
D=A
@ARG
A=D+M
D=M
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

// write SimpleFunction.test return
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
