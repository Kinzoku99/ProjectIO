# DOSTĘPNE ENDPOINTY
## CALCULATOR
* **POST** `/api/calculator/integrate_trapezoid/` - Całkowania numeryczne z użyciem złożonej kwadratury trapezów.
    
    Argumenty:
    * `function_expression: string` - napis zawierający definicję funkcji
    * `variable_name: string` - napis zawierający nazwę zmiennej
    * `interval_begin: float` - początek przedziału całkowania
    * `interval_end: float` - koniec przedziału całkowania
    * `step_size: float` - wielkość kroku metody
    
    Zwraca:
    * `result: float` - aproksymacja całki z podanej funkcji

  
* **POST** `/api/calculator/integrate_romberg/` - Całkowanie numeryczne z użyciem metody Romberga.
    
    Argumenty:
    * `function_expression: string` - napis zawierający definicję funkcji
    * `variable_name: string` - napis zawierający nazwę zmiennej
    * `interval_begin: float` - początek przedziału całkowania
    * `interval_end: float` - koniec przedziału całkowania
    * `num_of_divisions: unsigned int` - liczba podziałów odcinka
    * `tol: float` - tolerancja, którą pragniemy osiągnąć

    Zwraca:
    * `result: float` - aproksymacja całki z podanej funkcji


* **POST** `/api/calculator/des_runge_kutta/1` - Traktując zadanie całkowania jak proste RRZ, znajduje jego trajektorię.

    Argumenty:
    * `function_expression: string` - napis zawierający definicję funkcji
    * `variable_name: string` - napis zawierający nazwę zmiennej
    * `initial_value: float` - wartość początkowa (całka jest +C)
    * `step_size: float` - krok metody
    * `begin_of_integrating_interval: float` - początek przedziału całkowania
    * `end_of_integrating_interval: float`- koniec przedziału całkowania
    * `rank_of_solver: unsigned int` - ranga

    Zwraca:
    * `x_values: float[]` - tablica argumentów funkcji
    * `y_values: float[]` - tablica wartości funkcji


* **POST** `/api/calculator/des_runge_kutta/2` - Traktując zadanie całkowania jak proste RRZ, znajduje jego trajektorię. 
`initial_value` jest obliczane za pomocą funkcji `integrate_romberg` tak, żeby wykres był wyśrodkowany w punkcie `(0, 0)`

    Argumenty:
    * `function_expression: string` - napis zawierający definicję funkcji
    * `variable_name: string` - napis zawierający nazwę zmiennej
    * `step_size: float` - krok metody
    * `num_of_divisions: unsigned int` - liczba podziałów odcinka (`integrate_romberg`)
    * `tol: float` - tolerancja, którą pragniemy osiągnąć (`integrate_romberg`)
    * `begin_of_integrating_interval: float` - początek przedziału całkowania
    * `end_of_integrating_interval: float`- koniec przedziału całkowania
    * `rank_of_solver: unsigned int` - ranga

    Zwraca:
    * `x_values: float[]` - tablica argumentów funkcji
    * `y_values: float[]` - tablica wartości funkcji


* **POST** `/api/calculator/indefinite_integration/` - Oblicza wzór całki dokładnej

    Argumenty:
    * `function_expression: string` - napis zawierający definicję funkcji
    * `variable_name: string` - napis zawierający nazwę zmiennej

    Zwraca:
    * `tex_string: string` - wynik 


* `[temp]` **POST** `/api/calculator/graph/` - Rysowanie wykresów funkcji.

    Argumenty:
    * `function_expression: string` - funkcja
    * `beg_x: float` - początek zakresu
    * `end_x: float` - koniec zakresu
    * `step_size: float` - krok
  
    Zwraca:
    * `x_values: float[]` - tablica argumentów funkcji
    * `y_values: float[]` - tablica wartości funkcji

## GALLERY
* **GET** `/api/gallery/` - zwraca wszystkie elementy galerii znajdujące się w bazie danych

    Argumenty: *brak*
  
    Zwraca:
    * `elements: object[]` - tablica obiektów przechowujących rekordy galerii; obiekty są postaci:
      * `id: int` - unikalne id elementu
      * `tex_string: string` - napis zawierający kod w texu przedstawiający definicję funkcji
      * `variable_name: string` - napis zawierający nazwę zmiennej
      * `x_values: float[]` - tablica argumentów funkcji
      * `y_values: float[]` - tablica wartości funkcji


* **GET** `/api/gallery/random/<num>` - zwraca losowe elementy galerii znajdujące się w bazie danych

    Argumenty: 
    * `<num>: unsigned int` - liczba elementów galerii do wylosowania (jeśli mniejsza od 0 lub większa od
  liczby elementów w bazie danych zwracany jest kod błedu 400)
  
    Zwraca:
    * `elements: object[]` - tablica obiektów przechowujących rekordy galerii; obiekty są postaci:
      * `id: int` - unikalne id elementu
      * `tex_string: string` - napis zawierający kod w texu przedstawiający definicję funkcji
      * `variable_name: string` - napis zawierający nazwę zmiennej
      * `x_values: float[]` - tablica argumentów funkcji
      * `y_values: float[]` - tablica wartości funkcji


* **POST** `/api/gallery/create/` - dodaje nowy element galerii do bazy danych

    Argumenty: 
    * `function_expression: string` - napis zawierający definicję funkcji
    * `tex_string: string` - napis zawierający kod w texu przedstawiający definicję funkcji
    * `variable_name: string` - napis zawierający nazwę zmiennej
  
    Zwraca:
    * `id: int` - unikalne id elementu
    * `function_expression: string` - napis zawierający definicję funkcji
    * `tex_string: string` - napis zawierający kod w texu przedstawiający definicję funkcji
    * `variable_name: string` - napis zawierający nazwę zmiennej