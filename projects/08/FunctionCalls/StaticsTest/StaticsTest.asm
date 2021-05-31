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

// function Class1.set 0
(Class1.set)

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

// pop, static 0
@SP
A=M-1
D=M
@Class1.0
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

// pop, static 1
@SP
A=M-1
D=M
@Class1.1
M=D
@SP
M=M-1

// push, constant 0
@0
D=A
@SP
A=M
M=D
@SP
M=M+1

// write Class1.set return
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

// function Class1.get 0
(Class1.get)

// push, static 0
@Class1.0
D=M
@SP
A=M
M=D
@SP
M=M+1

// push, static 1
@Class1.1
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

// write Class1.get return
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

// function Class2.set 0
(Class2.set)

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

// pop, static 0
@SP
A=M-1
D=M
@Class2.0
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

// pop, static 1
@SP
A=M-1
D=M
@Class2.1
M=D
@SP
M=M-1

// push, constant 0
@0
D=A
@SP
A=M
M=D
@SP
M=M+1

// write Class2.set return
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

// function Class2.get 0
(Class2.get)

// push, static 0
@Class2.0
D=M
@SP
A=M
M=D
@SP
M=M+1

// push, static 1
@Class2.1
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

// write Class2.get return
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

// push, constant 6
@6
D=A
@SP
A=M
M=D
@SP
M=M+1

// push, constant 8
@8
D=A
@SP
A=M
M=D
@SP
M=M+1

// call Class1.set 2
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
@7
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
@Class1.set
0;JMP
// return Address: call Class1.set 2
(Sys.init$ret.1)

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

// push, constant 23
@23
D=A
@SP
A=M
M=D
@SP
M=M+1

// push, constant 15
@15
D=A
@SP
A=M
M=D
@SP
M=M+1

// call Class2.set 2
// push retAddr
@Sys.init$ret.2
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
@7
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
@Class2.set
0;JMP
// return Address: call Class2.set 2
(Sys.init$ret.2)

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

// call Class1.get 0
// push retAddr
@Sys.init$ret.3
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
@Class1.get
0;JMP
// return Address: call Class1.get 0
(Sys.init$ret.3)

// call Class2.get 0
// push retAddr
@Sys.init$ret.4
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
@Class2.get
0;JMP
// return Address: call Class2.get 0
(Sys.init$ret.4)

(Sys.init$WHILE)

// goto WHILE
@Sys.init$WHILE
0;JMP
