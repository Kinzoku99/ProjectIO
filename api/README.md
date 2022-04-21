# Dostępne endpointy
* **POST** `/calculator/trapezoid_quadrature_01/` - Procedura 
licząca całkę przy pomocy złożonej kwadratury trapezów.
    
    Argumenty:
    * `function: string` - funkcja
    * `step_size: number` - długość pojedynczego podziału
    
    Zwraca:
    * `result: number`

* **POST** `/calculator/romberg_quadrature_01/` - Procedura licząca całkę przy pomocy metody Romberga 
dla złożonej kwadratury trapezów.
    
    Argumenty:
    * `function: string` - funkcja
    * `num_of_divisions: number` - liczba wstępnych podziałów do wykonania
    * `tol: number` - oczekiwana tolerancja końcowa

    Zwraca:
    * `result: number`

* **POST** `/calculator/graph/` - Rysowanie wykresów funkcji.

    Argumenty:
    * `function: string` - funkcja
    * `beg_x: number` - początek zakresu
    * `end_x: number` - koniec zakresu
    * `step: number` - krok
  
    Zwraca:
    * `x_values: number[]` - tablica argumentów funkcji
    * `y_values: number[]` - tablica wartości funkcji
