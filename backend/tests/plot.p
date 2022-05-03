if (ARGC != 1) {
    msg = sprintf("Użycie: (z pozycji ProjectIO/backend)\n\tgnuplot -c tests/plot.p N\n,gdzie N to numer testu rk_test do narysowania.")
    print(msg)
    exit;
}

datafile = sprintf("tests/outputs/rk_out%s.txt", ARG1)
plot datafile using 1:2
pause -1