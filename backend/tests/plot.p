datafile = "tests/rk4_test_output.txt"
# frow = system('head -1 '.datafile)
# set xlabel word(frow, 1)
# set ylabel word(frow, 2)
plot datafile using 1:2
pause -1