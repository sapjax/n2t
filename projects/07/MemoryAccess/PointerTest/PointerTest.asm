// bootstrap
@256
D=A
@SP
M=D
// push, constant 3030
@3030
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop, pointer 0
@SP
M=M-1
A=M
D=M
@THIS
M=D
// push, constant 3040
@3040
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop, pointer 1
@SP
M=M-1
A=M
D=M
@THAT
M=D
// push, constant 32
@32
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop, this 2
@2
D=A
@THIS
D=D+M
@addr
M=D
@SP
M=M-1
A=M
D=M
@addr
A=M
M=D
// push, constant 46
@46
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop, that 6
@6
D=A
@THAT
D=D+M
@addr
M=D
@SP
M=M-1
A=M
D=M
@addr
A=M
M=D
// push, pointer 0
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
// push, pointer 1
@THAT
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
// push, this 2
@2
D=A
@THIS
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
// push, that 6
@6
D=A
@THAT
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
