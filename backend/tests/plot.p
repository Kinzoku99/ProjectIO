datafile = ""
frow = system('head -1 '.datafile)
set xlabel word(frow, 3)
set ylabel word(frow, 2)
set zlabel word(frow, 1)
# plot datafile using 1:2
splot datafile using 3:2:1
pause -1