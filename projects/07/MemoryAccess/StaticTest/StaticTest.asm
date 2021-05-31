// bootstrap
@256
D=A
@SP
M=D
// push, constant 111
@111
D=A
@SP
A=M
M=D
@SP
M=M+1
// push, constant 333
@333
D=A
@SP
A=M
M=D
@SP
M=M+1
// push, constant 888
@888
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop, static 8
@SP
A=M-1
D=M
@Statictest.8
M=D
@SP
M=M-1
// pop, static 3
@SP
A=M-1
D=M
@Statictest.3
M=D
@SP
M=M-1
// pop, static 1
@SP
A=M-1
D=M
@Statictest.1
M=D
@SP
M=M-1
// push, static 3
@Statictest.3
D=M
@SP
A=M
M=D
@SP
M=M+1
// push, static 1
@Statictest.1
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
// push, static 8
@Statictest.8
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
