Do połączenia kodu napisango w C++ z pythonem korzystam z biblioteki pybind11.

https://github.com/pybind/pybind11

Biblioteka do parsowania stringów na wyrażenia matematyczne:

http://www.partow.net/programming/exprtk/index.html

Instrukcje:
1. Tworzymy folder build
2. Wchodzimy do niego
3. Wywołujemy komende `cmake ..`
4. Następnie `make`
5. Powinien utworzyć się plik z rozszerzeniem .so jest to nasz moduł, który możemy zaimportować do pythona
