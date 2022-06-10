export const GaussTypes = ['Hermite', 'Chebyshev', 'Laugerre', 'Legrende']

export const CalculatorSettings = {
    variable_name: 'x',
    step_size: 0.1,
    num_of_divisions: 10,
    tol: 0.01,
    initial_value: 0,
    rank_of_solver: 4,
    beg_x: -100,
    end_x: 100,
    interval_begin: 0,
    interval_end: 1,
    int_value_method: 'trapezoid',
    gauss_type: GaussTypes[0],
    gauss_rank: 1
};