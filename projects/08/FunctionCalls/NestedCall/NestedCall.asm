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

// function Sys.init 0
(Sys.init)

// push, constant 4000
@4000
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

// push, constant 5000
@5000
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

// call Sys.main 0
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
@Sys.main
0;JMP
// return Address: call Sys.main 0
(Sys.init$ret.1)

// pop, temp 1
@1
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

(Sys.init$LOOP)

// goto LOOP
@Sys.init$LOOP
0;JMP

// function Sys.main 5
(Sys.main)
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
@0
D=A
@SP
A=M
M=D
@SP
M=M+1

// push, constant 4001
@4001
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

// push, constant 5001
@5001
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

// push, constant 200
@200
D=A
@SP
A=M
M=D
@SP
M=M+1

// pop, local 1
@1
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

// push, constant 40
@40
D=A
@SP
A=M
M=D
@SP
M=M+1

// pop, local 2
@2
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

// push, constant 6
@6
D=A
@SP
A=M
M=D
@SP
M=M+1

// pop, local 3
@3
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

// push, constant 123
@123
D=A
@SP
A=M
M=D
@SP
M=M+1

// call Sys.add12 1
// push retAddr
@Sys.main$ret.0
D=A
@SP
A=M
M=D
@SP
M=M+1
// save Sys.main state
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
// rePosition Sys.main ARG
@6
D=A
@SP
D=M-D
@ARG
M=D
// rePosition Sys.main LCL
@SP
D=M
@LCL
M=D
@Sys.add12
0;JMP
// return Address: call Sys.add12 1
(Sys.main$ret.0)

// pop, temp 0
@0
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

// push, local 2
@2
D=A
@LCL
A=D+M
D=M
@SP
A=M
M=D
@SP
M=M+1

// push, local 3
@3
D=A
@LCL
A=D+M
D=M
@SP
A=M
M=D
@SP
M=M+1

// push, local 4
@4
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

// add
@SP
A=M-1
D=M
A=A-1
D=D+M
M=D
@SP
M=M-1

// add
@SP
A=M-1
D=M
A=A-1
D=D+M
M=D
@SP
M=M-1

// add
@SP
A=M-1
D=M
A=A-1
D=D+M
M=D
@SP
M=M-1

// write Sys.main return
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

// function Sys.add12 0
(Sys.add12)

// push, constant 4002
@4002
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

// push, constant 5002
@5002
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

// push, constant 12
@12
D=A
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

// write Sys.add12 return
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
