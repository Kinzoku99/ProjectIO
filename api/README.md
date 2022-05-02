# Dostępne endpointy
* **POST** `/api/calculator/trapezoid_quadrature_01/` - Procedura 
licząca całkę przy pomocy złożonej kwadratury trapezów.
    
    Argumenty:
    * `function: string` - funkcja
    * `step_size: number` - długość pojedynczego podziału
    
    Zwraca:
    * `result: number`

* **POST** `/api/calculator/romberg_quadrature_01/` - Procedura licząca całkę przy pomocy metody Romberga 
dla złożonej kwadratury trapezów.
    
    Argumenty:
    * `function: string` - funkcja
    * `num_of_divisions: number` - liczba wstępnych podziałów do wykonania
    * `tol: number` - oczekiwana tolerancja końcowa

    Zwraca:
    * `result: number`

* **POST** `/api/calculator/des_runge_kutta/` - Używa podejścia równań różniczkowych do narysowania trajektorii 
rozwiązania. Tak jak metoda Simpsona.

    Argumenty:
    * `function: string` - funkcja
    * `initial_value: number` - wartość początkowa
    * `step_size: number` - długość pojedynczego podziału
    * `begin_of_integrating_interval: number` - początek zakresu całkowania
    * `end_of_integrating_interval: number`- koniec zakresu całkowania
    * `rank_of_solver: number` - ranga

    Zwraca:
    * `x_values: number[]` - tablica argumentów funkcji
    * `y_values: number[]` - tablica wartości funkcji

* **POST** `/api/calculator/graph/` - Rysowanie wykresów funkcji.

    Argumenty:
    * `function: string` - funkcja
    * `beg_x: number` - początek zakresu
    * `end_x: number` - koniec zakresu
    * `step_size: number` - krok
  
    Zwraca:
    * `x_values: number[]` - tablica argumentów funkcji
    * `y_values: number[]` - tablica wartości funkcji
