// bootstrap
@256
D=A
@SP
M=D
// call Sys.init 0
// push retAddr
@bootstrap$ret.0
D=A
@SP
A=M
M=D
@SP
M=M+1
// save bootstrap state
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
// rePosition bootstrap ARG
@5
D=A
@SP
D=M-D
@ARG
M=D
// rePosition bootstrap LCL
@SP
D=M
@LCL
M=D
@Sys.init
0;JMP
// return Address: call Sys.init 0
(bootstrap$ret.0)
// push, constant 10
@10
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop, local 0
@0
D=A
@LCL
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
// push, constant 21
@21
D=A
@SP
A=M
M=D
@SP
M=M+1
// push, constant 22
@22
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop, argument 2
@2
D=A
@ARG
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
// pop, argument 1
@1
D=A
@ARG
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
// push, constant 36
@36
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop, this 6
@6
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
// push, constant 42
@42
D=A
@SP
A=M
M=D
@SP
M=M+1
// push, constant 45
@45
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop, that 5
@5
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
// pop, that 2
@2
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
// push, constant 510
@510
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop, temp 6
@6
D=A
@5
D=D+A
@addr
M=D
@SP
M=M-1
A=M
D=M
@addr
A=M
M=D
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
// push, that 5
@5
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
// push, this 6
@6
D=A
@THIS
A=D+M
D=M
@SP
A=M
M=D
@SP
M=M+1
// push, this 6
@6
D=A
@THIS
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
// sub
@SP
A=M-1
D=M
A=A-1
D=D-M
M=-D
@SP
M=M-1
// push, temp 6
@6
D=A
@5
A=D+A
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
// function Sys.init 0
(Sys.init)
// write Sys.init return
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
