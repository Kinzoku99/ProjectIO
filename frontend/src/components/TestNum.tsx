import React, {useState} from "react";
import {useForm} from "react-hook-form";
import currentURL from "../URLconfig";
import BigGraph from "./BigGraph";

type FormData = {
    formula: string,
    stepSize: number,
    numOfDivisions: number,
    tol: number
}

const TestNum: React.FC = () => {
    const {register, handleSubmit} = useForm<FormData>();
    const [formulaValid, setFormulaValid] = useState<string>('');
    const [stepSizeValid, setStepSizeValid] = useState<string>('');
    const [numOfDivisionsValid, setNumOfDivisionsValid] = useState<string>('');
    const [tolValid, setTolValid] = useState<string>('');
    const [trapezoidResult, setTrapezoidResult] = useState<string>('');
    const [rombergResult, setRombergResult] = useState<string>('');
    const [graph, setGraph] = useState<JSX.Element>();

    const onSubmit = handleSubmit((formData) => {
        const isFormulaValid = Object.entries(formData.formula).length !== 0;
        const isStepSizeValid = Object.entries(formData.stepSize).length !== 0 && !isNaN(formData.stepSize);
        const isNumOfDivisionsValid = Object.entries(formData.numOfDivisions).length !== 0 && !isNaN(formData.numOfDivisions);
        const isTolValid = Object.entries(formData.tol).length !== 0 && !isNaN(formData.tol);

        setFormulaValid(isFormulaValid ? ' is-valid' : ' is-invalid');
        setStepSizeValid(isStepSizeValid ? ' is-valid' : ' is-invalid');
        setNumOfDivisionsValid(isNumOfDivisionsValid ? ' is-valid' : ' is-invalid');
        setTolValid(isTolValid ? ' is-valid' : ' is-invalid');

        if (isFormulaValid && isStepSizeValid && isNumOfDivisionsValid && isTolValid) {
            const valuesTrapezoid = {
                function: formData.formula,
                step_size: formData.stepSize
            }

            const valuesRomberg = {
                function: formData.formula,
                num_of_divisions: formData.numOfDivisions,
                tol: formData.tol
            }

            const valuesGraph = {
                function: formData.formula,
                beg_x: -50,
                end_x: 50,
                step: 0.1
            }

            fetch(currentURL + 'calculator/trapezoid_quadrature_01/', {
                method: 'POST',
                mode: 'cors',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(valuesTrapezoid)
            }).then((response) => response.json())
                .then((data) => {
                    setTrapezoidResult(data.result);

                    fetch(currentURL + 'calculator/romberg_quadrature_01/', {
                        method: 'POST',
                        mode: 'cors',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(valuesRomberg)
                    }).then((response) => response.json())
                        .then((data) => {
                            setRombergResult(data.result);

                            fetch(currentURL + 'calculator/graph/', {
                                method: 'POST',
                                mode: 'cors',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify(valuesGraph)
                            }).then((response) => response.json())
                                .then((data) => {
                                    setGraph(<div/>)
                                    setGraph(
                                        <BigGraph x={data.x_values} y={data.y_values}/>
                                    )
                                })
                        })
                })
        }
    });

    return (
        <main>
            <div className="container text-center py-5 d-flex flex-column align-items-center">
                <h1>Test działania API - funkcje C++</h1>
                <div className="text-start mt-5 w-50">
                    Dostępne funkcje:
                    <ul>
                        <li>
                            <span className="fw-bold">trapezoid_quadrature_01</span> - Procedura licząca całkę przy
                            pomocy złożonej kwadratury trapezów.
                        </li>
                        <li>
                            <span className="fw-bold">romberg_quadrature_01</span> - Procedura licząca całkę przy
                            pomocy metody Romberga dla złożonej kwadratury trapezów.
                        </li>
                    </ul>
                </div>

                <form noValidate={true} className="mt-5 w-50" onSubmit={onSubmit}>
                    <div className="form-floating mb-1">
                        <input
                            type="text"
                            className={"w-100 form-control" + formulaValid}
                            id="formula"
                            placeholder="formula"
                            {...register("formula")}
                        />
                        <label htmlFor="formula">Podaj wzór funkcji</label>
                    </div>
                    <p>podaj dane do funkcji <span className="fw-bold">trapezoid_quadrature_01</span></p>
                    <div className="form-floating mb-1">
                        <input
                            type="text"
                            className={"w-100 form-control" + stepSizeValid}
                            id="stepSize"
                            placeholder="stepSize"
                            {...register("stepSize")}
                        />
                        <label htmlFor="formula">Długość pojedynczego podziału</label>
                    </div>
                    <p>podaj dane do funkcji <span className="fw-bold">romberg_quadrature_01</span></p>
                    <div className="form-floating mb-1">
                        <input
                            type="text"
                            className={"w-100 form-control" + numOfDivisionsValid}
                            id="numOfDivisions"
                            placeholder="numOfDivisions"
                            {...register("numOfDivisions")}
                        />
                        <label htmlFor="formula">Liczba wstępnych podziałów do wykonania</label>
                    </div>
                    <div className="form-floating mb-1">
                        <input
                            type="text"
                            className={"w-100 form-control" + tolValid}
                            id="tol"
                            placeholder="tol"
                            {...register("tol")}
                        />
                        <label htmlFor="formula">Oczekiwana tolerancja końcowa</label>
                    </div>
                    <button type="submit" className="w-100 btn-primary mt-3">Submit</button>
                </form>
                <div className="mt-5">
                    trapezoid_quadrature_01
                    <h2 className="mb-2">{trapezoidResult}</h2>
                    romberg_quadrature_01
                    <h2 className="mb-2">{rombergResult}</h2>
                    Wykres:
                    {graph}
                </div>
            </div>
        </main>
    );
}

export default TestNum;