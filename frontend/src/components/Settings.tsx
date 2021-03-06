import React, {useState} from "react";
import {CalculatorSettings} from "../calculatorSettings";
import {Alert} from "react-bootstrap";
import {GaussTypes} from "../calculatorSettings";

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
    const [variableNameValid, setVariableNameValid] = useState<string>('');
    const [intValueMethod, setIntValueMethod] = useState<string>(
        getInitialValue('int_value_method', CalculatorSettings.int_value_method));
    const [numOfDivisionsTrapezoid, setNumOfDivisionsTrapezoid] = useState<string>(
        getInitialValue('num_of_divisions_trapezoid', CalculatorSettings.num_of_divisions.toString()));
    const [numOfDivisionsTrapezoidValid, setNumOfDivisionsTrapezoidValid] = useState<string>('');
    const [numOfDivisions, setNumOfDivisions] = useState<string>(
        getInitialValue('num_of_divisions', CalculatorSettings.num_of_divisions.toString()));
    const [numOfDivisionsValid, setNumOfDivisionsValid] = useState<string>('');
    const [tol, setTol] = useState<string>(getInitialValue('tol', CalculatorSettings.tol.toString()));
    const [tolValid, setTolValid] = useState<string>('');
    const [gaussValueMethod, setGaussValueMethod] = useState<string>(
        getInitialValue('gauss_value_method', CalculatorSettings.gauss_type));
    const [gaussRank, setGaussRank] = useState<string>(
        getInitialValue('gauss_rank', CalculatorSettings.gauss_rank.toString()));
    const [gaussRankValid, setGaussRankValid] = useState<string>('');
    const [stepSizeGraph, setStepSizeGraph] = useState<string>(
        getInitialValue('step_size_graph', CalculatorSettings.step_size.toString()));
    const [stepSizeGraphValid, setStepSizeGraphValid] = useState<string>('');
    const [rankOfSolver, setRankOfSolver] = useState<string>(
        getInitialValue('rank_of_solver', CalculatorSettings.rank_of_solver.toString()));
    const [rankOfSolverValid, setRankOfSolverValid] = useState<string>('');

    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertTimeout, setAlertTimeout] = useState<NodeJS.Timeout>();
    const [showAlertDef, setShowAlertDef] = useState<boolean>(false);
    const [alertTimeoutDef, setAlertTimeoutDef] = useState<NodeJS.Timeout>();

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validateVariableName = variableName.length > 0;
        const validateNumOfDivisionsTrapezoid = parseInt(numOfDivisionsTrapezoid, 10) >= 1;
        const validateNumOfDivisions = parseInt(numOfDivisions, 10) >= 1;
        const validateTol = tol.length > 0 && !isNaN(Number(tol));
        const validateGaussRank = parseInt(gaussRank, 10) >= 1;
        const validateStepSizeGraph = stepSizeGraph.length > 0 && !isNaN(Number(stepSizeGraph));
        const validateRankOfSolver = parseInt(rankOfSolver, 10) >= 1 && parseInt(rankOfSolver, 10) <= 4;

        validateVariableName ? setVariableNameValid('') : setVariableNameValid(' is-invalid');
        validateNumOfDivisionsTrapezoid ? setNumOfDivisionsTrapezoidValid('') : setNumOfDivisionsTrapezoidValid(' is-invalid');
        validateNumOfDivisions ? setNumOfDivisionsValid('') : setNumOfDivisionsValid(' is-invalid');
        validateTol ? setTolValid('') : setTolValid(' is-invalid');
        validateGaussRank ? setGaussRankValid('') : setGaussRankValid(' is-invalid');
        validateStepSizeGraph ? setStepSizeGraphValid('') : setStepSizeGraphValid(' is-invalid');
        validateRankOfSolver ? setRankOfSolverValid('') : setRankOfSolverValid(' is-invalid');

        if (validateVariableName &&
            validateNumOfDivisionsTrapezoid &&
            validateNumOfDivisions &&
            validateTol &&
            validateGaussRank &&
            validateStepSizeGraph &&
            validateRankOfSolver) {
            localStorage.setItem('variable_name', variableName);
            localStorage.setItem('int_value_method', intValueMethod);
            localStorage.setItem('num_of_divisions_trapezoid', numOfDivisionsTrapezoid);
            localStorage.setItem('num_of_divisions', numOfDivisions);
            localStorage.setItem('tol', tol);
            localStorage.setItem('gauss_value_method', gaussValueMethod);
            localStorage.setItem('gauss_rank', gaussRank);
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
        localStorage.setItem('num_of_divisions_trapezoid', CalculatorSettings.num_of_divisions.toString());
        localStorage.setItem('num_of_divisions', CalculatorSettings.num_of_divisions.toString());
        localStorage.setItem('tol', CalculatorSettings.tol.toString());
        localStorage.setItem('gauss_value_method', CalculatorSettings.gauss_type);
        localStorage.setItem('gauss_rank', CalculatorSettings.gauss_rank.toString());
        localStorage.setItem('step_size_graph', CalculatorSettings.step_size.toString());
        localStorage.setItem('rank_of_solver', CalculatorSettings.rank_of_solver.toString());

        setVariableName(CalculatorSettings.variable_name);
        setIntValueMethod(CalculatorSettings.int_value_method);
        setNumOfDivisionsTrapezoid(CalculatorSettings.num_of_divisions.toString());
        setNumOfDivisions(CalculatorSettings.num_of_divisions.toString());
        setTol(CalculatorSettings.tol.toString());
        setGaussValueMethod(CalculatorSettings.gauss_type);
        setGaussRank(CalculatorSettings.gauss_rank.toString());
        setStepSizeGraph(CalculatorSettings.step_size.toString());
        setRankOfSolver(CalculatorSettings.rank_of_solver.toString());

        setVariableNameValid('');
        setNumOfDivisionsTrapezoidValid('');
        setNumOfDivisionsValid('');
        setTolValid('');
        setGaussRankValid('');
        setStepSizeGraphValid('');
        setRankOfSolverValid('');

        setShowAlertDef(true);

        setAlertTimeoutDef(setTimeout(() => {
            setShowAlertDef(false);
        }, 5000));
    }

    return (
        <main>
            <div className="row mx-2">
                <Alert
                    show={showAlert}
                    variant="success"
                    className="col-12 col-md-6 mt-2 mb-0 mx-auto fade"
                    onClose={() => {
                        setShowAlert(false);
                        if (alertTimeout) {
                            clearTimeout(alertTimeout);
                        }
                    }}
                    dismissible
                >
                    Ustawienia zapisane pomy??lnie!
                </Alert>
            </div>
            <div className="row mx-2">
                <Alert
                    show={showAlertDef}
                    variant="secondary"
                    className="col-12 col-md-6 mt-2 mb-0 mx-auto fade"
                    onClose={() => {
                        setShowAlertDef(false);
                        if (alertTimeoutDef) {
                            clearTimeout(alertTimeoutDef);
                        }
                    }}
                    dismissible
                >
                    Przywr??cono ustawienia domy??lne
                </Alert>
            </div>
            <div className="container text-center py-5">
                <h1 className="fw-light h11">Zaawansowane ustawienia kalkulator??w</h1>
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
                                        className={"form-control" + variableNameValid}
                                        id="variable_name"
                                        placeholder="variable_name"
                                        value={variableName}
                                        onChange={event => setVariableName(event.target.value)}
                                    />
                                    <label htmlFor="variable_name">Nazwa zmiennej</label>
                                </div>
                            </div>
                            <div className="mb-4">
                                <p className="lead text-muted p11  mb-2">Ca??kowanie numeryczne</p>
                                <div className="form-floating mb-3">
                                    <select
                                        className="form-select"
                                        id="method_select"
                                        onChange={event => setIntValueMethod(event.target.value)}
                                        value={intValueMethod}
                                    >
                                        <option value="trapezoid">Metoda z??o??onej kwadratury trapez??w</option>
                                        <option value="romberg">Metoda Romberga</option>
                                        <option value="gauss">Metoda Gaussa</option>
                                        <option value="gauss_weight">Metoda Gaussa z wag??</option>
                                    </select>
                                    <label htmlFor="method_select">Domy??lna metoda</label>
                                </div>
                                Metoda z??o??onej kwadratury trapez??w
                                <div className="form-floating mb-3 mt-3">
                                    <input
                                        type="number"
                                        className={"form-control" + numOfDivisionsTrapezoidValid}
                                        id="num_of_divisions_trapezoid"
                                        placeholder="num_of_divisions_trapezoid"
                                        value={numOfDivisionsTrapezoid}
                                        onChange={event => setNumOfDivisionsTrapezoid(event.target.value)}
                                        min={1}
                                    />
                                    <label htmlFor="num_of_divisions_trapezoid">Liczba podzia????w odcinka</label>
                                    <div className="invalid-feedback mb-2">
                                        Podaj liczb?? wi??ksz?? od 1
                                    </div>
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
                                    <label htmlFor="num_of_divisions">Liczba podzia????w odcinka</label>
                                    <div className="invalid-feedback mb-2">
                                        Podaj liczb?? wi??ksz?? od 1
                                    </div>
                                </div>
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        className={"form-control" + tolValid}
                                        id="tol"
                                        placeholder="tol"
                                        value={tol}
                                        onChange={event => setTol(event.target.value)}
                                    />
                                    <label htmlFor="tol">Tolerancja</label>
                                </div>
                                Metoda Gaussa
                                <div className="form-floating mt-3 mb-1">
                                    <select
                                        className="form-select"
                                        id="gauss_method_select"
                                        onChange={event => setGaussValueMethod(event.target.value)}
                                        value={gaussValueMethod}
                                    >
                                        {GaussTypes.map((value) => {
                                            if (value === 'Laugerre' || value === 'Legrende') {
                                                return <option value={value} key={value} disabled={true}>
                                                    {value} - coming soon
                                                </option>
                                            }
                                            return <option value={value} key={value}>{value}</option>
                                        })}
                                    </select>
                                    <label htmlFor="gauss_method_select">Domy??lna metoda</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input
                                        type="number"
                                        className={"form-control" + gaussRankValid}
                                        id="gauss_rank"
                                        placeholder="gauss_rank"
                                        value={gaussRank}
                                        onChange={event => setGaussRank(event.target.value)}
                                        min={1}
                                    />
                                    <label htmlFor="gauss_rank">Ranga</label>
                                    <div className="invalid-feedback mb-2">
                                        Podaj liczb?? wi??ksz?? od 0
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <p className="lead text-muted p11 mb-2">Rysowanie wykres??w</p>
                                <div className="form-floating mb-1">
                                    <input
                                        type="text"
                                        className={"form-control" + stepSizeGraphValid}
                                        id="step_size_graph"
                                        placeholder="step_size_graph"
                                        value={stepSizeGraph}
                                        onChange={event => setStepSizeGraph(event.target.value)}
                                    />
                                    <label htmlFor="step_size_graph">Wielko???? kroku</label>
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
                                        Podaj liczb?? z zakresu od 1 do 4
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-secondary mt-3"
                                id="subbtn-fill"
                                style={{width: "49%", marginRight: "1%"}}
                            >Zatwierd??</button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary mt-3 btn-calc-form"
                                id="defbtn"
                                onClick={restoreDefault}
                                style={{width: "49%", marginLeft: "1%"}}
                            >Przywr???? domy??lne</button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Settings;