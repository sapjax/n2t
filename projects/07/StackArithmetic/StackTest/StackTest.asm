// bootstrap
@256
D=A
@SP
M=D
// push, constant 17
@17
D=A
@SP
A=M
M=D
@SP
M=M+1
// push, constant 17
@17
D=A
@SP
A=M
M=D
@SP
M=M+1
// eq
@SP
A=M-1
D=M
A=A-1
D=D-M
M=-1
@J_true_0
D;JEQ
@2
D=A
@SP
A=M-D
M=0
(J_true_0)
@SP
M=M-1
// push, constant 17
@17
D=A
@SP
A=M
M=D
@SP
M=M+1
// push, constant 16
@16
D=A
@SP
A=M
M=D
@SP
M=M+1
// eq
@SP
A=M-1
D=M
A=A-1
D=D-M
M=-1
@J_true_1
D;JEQ
@2
D=A
@SP
A=M-D
M=0
(J_true_1)
@SP
M=M-1
// push, constant 16
@16
D=A
@SP
A=M
M=D
@SP
M=M+1
// push, constant 17
@17
D=A
@SP
A=M
M=D
@SP
M=M+1
// eq
@SP
A=M-1
D=M
A=A-1
D=D-M
M=-1
@J_true_2
D;JEQ
@2
D=A
@SP
A=M-D
M=0
(J_true_2)
@SP
M=M-1
// push, constant 892
@892
D=A
@SP
A=M
M=D
@SP
M=M+1
// push, constant 891
@891
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
@J_true_3
-D;JLT
@2
D=A
@SP
A=M-D
M=0
(J_true_3)
@SP
M=M-1
// push, constant 891
@891
D=A
@SP
A=M
M=D
@SP
M=M+1
// push, constant 892
@892
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
@J_true_4
-D;JLT
@2
D=A
@SP
A=M-D
M=0
(J_true_4)
@SP
M=M-1
// push, constant 891
@891
D=A
@SP
A=M
M=D
@SP
M=M+1
// push, constant 891
@891
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
@J_true_5
-D;JLT
@2
D=A
@SP
A=M-D
M=0
(J_true_5)
@SP
M=M-1
// push, constant 32767
@32767
D=A
@SP
A=M
M=D
@SP
M=M+1
// push, constant 32766
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1
// gt
@SP
A=M-1
D=M
A=A-1
D=D-M
M=-1
@J_true_6
-D;JGT
@2
D=A
@SP
A=M-D
M=0
(J_true_6)
@SP
M=M-1
// push, constant 32766
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1
// push, constant 32767
@32767
D=A
@SP
A=M
M=D
@SP
M=M+1
// gt
@SP
A=M-1
D=M
A=A-1
D=D-M
M=-1
@J_true_7
-D;JGT
@2
D=A
@SP
A=M-D
M=0
(J_true_7)
@SP
M=M-1
// push, constant 32766
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1
// push, constant 32766
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1
// gt
@SP
A=M-1
D=M
A=A-1
D=D-M
M=-1
@J_true_8
-D;JGT
@2
D=A
@SP
A=M-D
M=0
(J_true_8)
@SP
M=M-1
// push, constant 57
@57
D=A
@SP
A=M
M=D
@SP
M=M+1
// push, constant 31
@31
D=A
@SP
A=M
M=D
@SP
M=M+1
// push, constant 53
@53
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
// push, constant 112
@112
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
// neg
@SP
A=M-1
D=-M
M=D
// and
@SP
A=M-1
D=M
A=A-1
D=D&M
M=D
@SP
M=M-1
// push, constant 82
@82
D=A
@SP
A=M
M=D
@SP
M=M+1
// or
@SP
A=M-1
D=M
A=A-1
D=D|M
M=D
@SP
M=M-1
// not
@SP
A=M-1
D=!M
M=D
