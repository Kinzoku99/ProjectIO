import React, {useEffect, useState} from "react";
import {CalculatorSettings} from "../calculatorSettings";
import {Alert} from "react-bootstrap";

const getInitialValue = (name: string, defaultValue: string) => {
    if (localStorage.getItem(name) != null) {
        return localStorage.getItem(name) as string;
    }
    else {
        return defaultValue;
    }
}

const Settings: React.FC = () => {
    const [variableName, setVariableName] = useState<string>(
        getInitialValue('variable_name', CalculatorSettings.variable_name));
    const [intValueMethod, setIntValueMethod] = useState<string>(
        getInitialValue('int_value_method', CalculatorSettings.int_value_method));
    const [stepSizeTrapezoid, setStepSizeTrapezoid] = useState<string>(
        getInitialValue('step_size_trapezoid', CalculatorSettings.step_size.toString()));
    const [numOfDivisions, setNumOfDivisions] = useState<string>(
        getInitialValue('num_of_divisions', CalculatorSettings.num_of_divisions.toString()));
    const [numOfDivisionsValid, setNumOfDivisionsValid] = useState<string>('');
    const [tol, setTol] = useState<string>(getInitialValue('tol', CalculatorSettings.tol.toString()));
    const [stepSizeGraph, setStepSizeGraph] = useState<string>(
        getInitialValue('step_size_graph', CalculatorSettings.step_size.toString()));
    const [rankOfSolver, setRankOfSolver] = useState<string>(
        getInitialValue('rank_of_solver', CalculatorSettings.rank_of_solver.toString()));
    const [rankOfSolverValid, setRankOfSolverValid] = useState<string>('');

    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertTimeout, setAlertTimeout] = useState<NodeJS.Timeout>();

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validateNumOfDivisions = parseInt(numOfDivisions, 10) >= 1;
        const validateRankOfSolver = parseInt(rankOfSolver, 10) >= 1 && parseInt(rankOfSolver, 10) <= 4;
        validateNumOfDivisions ? setNumOfDivisionsValid('') : setNumOfDivisionsValid(' is-invalid');
        validateRankOfSolver ? setRankOfSolverValid('') : setRankOfSolverValid(' is-invalid');

        if (validateNumOfDivisions && validateRankOfSolver) {
            localStorage.setItem('variable_name', variableName);
            localStorage.setItem('int_value_method', intValueMethod);
            localStorage.setItem('step_size_trapezoid', stepSizeTrapezoid);
            localStorage.setItem('num_of_divisions', numOfDivisions);
            localStorage.setItem('tol', tol);
            localStorage.setItem('step_size_graph', stepSizeGraph);
            localStorage.setItem('rank_of_solver', rankOfSolver);

            setShowAlert(true);

            setAlertTimeout(setTimeout(() => {
                setShowAlert(false);
            }, 5000));
        }
    }

    const restoreDefault = () => {
        localStorage.setItem('variable_name', CalculatorSettings.variable_name);
        localStorage.setItem('int_value_method', CalculatorSettings.int_value_method);
        localStorage.setItem('step_size_trapezoid', CalculatorSettings.step_size.toString());
        localStorage.setItem('num_of_divisions', CalculatorSettings.num_of_divisions.toString());
        localStorage.setItem('tol', CalculatorSettings.tol.toString());
        localStorage.setItem('step_size_graph', CalculatorSettings.step_size.toString());
        localStorage.setItem('rank_of_solver', CalculatorSettings.rank_of_solver.toString());

        setVariableName(CalculatorSettings.variable_name);
        setIntValueMethod(CalculatorSettings.int_value_method);
        setStepSizeTrapezoid(CalculatorSettings.step_size.toString());
        setNumOfDivisions(CalculatorSettings.num_of_divisions.toString());
        setTol(CalculatorSettings.tol.toString());
        setStepSizeGraph(CalculatorSettings.step_size.toString());
        setRankOfSolver(CalculatorSettings.rank_of_solver.toString());

        setNumOfDivisionsValid('');
        setRankOfSolverValid('');
    }

    return (
        <main>
            <div className="row mx-2">
                <Alert
                    show={showAlert}
                    variant="success"
                    className="col-12 col-md-6 my-3 mx-auto fade"
                    onClose={() => {
                        setShowAlert(false);
                        if (alertTimeout) {
                            clearTimeout(alertTimeout);
                        }
                    }}
                    dismissible
                >
                    Ustawienia zapisane pomyślnie!
                </Alert>
            </div>
            <div className="container text-center py-5">
                <h1 className="fw-light h11">Zaawansowane ustawienia kalkulatorów</h1>
            </div>
            <section className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-8 mx-auto">
                        <form noValidate={true} onSubmit={event => onSubmit(event)}>
                            <div className="mb-4">
                                <p className="lead text-muted p11 mb-2">Ustawienia globalne</p>
                                <div className="form-floating mb-1">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="variable_name"
                                        placeholder="variable_name"
                                        value={variableName}
                                        onChange={event => setVariableName(event.target.value)}
                                    />
                                    <label htmlFor="variable_name">Nazwa zmiennej</label>
                                </div>
                            </div>
                            <div className="mb-4">
                                <p className="lead text-muted p11  mb-2">Całkowanie numeryczne</p>
                                <div className="form-floating mb-3">
                                    <select
                                        className="form-select"
                                        id="method_select"
                                        onChange={event => setIntValueMethod(event.target.value)}
                                        value={intValueMethod}
                                    >
                                        <option value="trapezoid">Metoda złożonej kwadratury trapezów</option>
                                        <option value="romberg">Metoda Romberga</option>
                                    </select>
                                    <label htmlFor="method_select">Domyślna metoda</label>
                                </div>
                                Metoda złożonej kwadratury trapezów
                                <div className="form-floating mb-3 mt-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="step_size_trapezoid"
                                        placeholder="step_size_trapezoid"
                                        value={stepSizeTrapezoid}
                                        onChange={event => setStepSizeTrapezoid(event.target.value)}
                                    />
                                    <label htmlFor="step_size_trapezoid">Wielkość kroku</label>
                                </div>
                                Metoda Romberga
                                <div className="form-floating mb-1 mt-3">
                                    <input
                                        type="number"
                                        className={"form-control" + numOfDivisionsValid}
                                        id="num_of_divisions"
                                        placeholder="num_of_divisions"
                                        value={numOfDivisions}
                                        onChange={event => setNumOfDivisions(event.target.value)}
                                        min={1}
                                    />
                                    <label htmlFor="num_of_divisions">Liczba podziałów odcinka</label>
                                    <div className="invalid-feedback mb-2">
                                        Podaj liczbę większą od 1
                                    </div>
                                </div>
                                <div className="form-floating mb-1">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="tol"
                                        placeholder="tol"
                                        value={tol}
                                        onChange={event => setTol(event.target.value)}
                                    />
                                    <label htmlFor="tol">Tolerancja</label>
                                </div>
                            </div>
                            <div className="mb-4">
                                <p className="lead text-muted p11 mb-2">Rysowanie wykresów</p>
                                <div className="form-floating mb-1">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="step_size_graph"
                                        placeholder="step_size_graph"
                                        value={stepSizeGraph}
                                        onChange={event => setStepSizeGraph(event.target.value)}
                                    />
                                    <label htmlFor="step_size_graph">Wielkość kroku</label>
                                </div>
                                <div className="form-floating mb-1">
                                    <input
                                        type="number"
                                        className={"form-control" + rankOfSolverValid}
                                        id="rank_of_solver"
                                        placeholder="rank_of_solver"
                                        value={rankOfSolver}
                                        onChange={event => setRankOfSolver(event.target.value)}
                                        min={1}
                                        max={4}
                                    />
                                    <label htmlFor="rank_of_solver">Ranga</label>
                                    <div className="invalid-feedback mb-2">
                                        Podaj liczbę z zakresu od 1 do 4
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-secondary mt-3"
                                id="subbtn-fill"
                                style={{width: "49%", marginRight: "1%"}}
                            >Zatwierdź</button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary mt-3 btn-calc-form"
                                id="defbtn"
                                onClick={restoreDefault}
                                style={{width: "49%", marginLeft: "1%"}}
                            >Przywróć domyślne</button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Settings;