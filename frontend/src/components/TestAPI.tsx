import React, {useState} from "react";
import {useForm} from "react-hook-form";
import currentURL from "../URLconfig";
import BigGraph from "./BigGraph";
import {CalculatorSettings} from "../calculatorSettings";

type FormData = {
    formula: string
}

const TestAPI: React.FC = () => {
    const {register, handleSubmit} = useForm<FormData>();
    const [formulaValid, setFormulaValid] = useState<string>('');
    const [graph, setGraph] = useState<JSX.Element>()

    const onSubmit = handleSubmit((formData) => {
        const isFormulaValid = Object.entries(formData.formula).length !== 0;
        setFormulaValid(isFormulaValid ? ' is-valid' : ' is-invalid');

        if (isFormulaValid) {
            const values = {
                function: formData.formula,
                initial_value: CalculatorSettings.initial_value,
                step_size: CalculatorSettings.step_size,
                begin_of_integrating_interval: CalculatorSettings.begin_of_integrating_interval,
                end_of_integrating_interval: CalculatorSettings.end_of_integrating_interval,
                rank_of_solver: CalculatorSettings.rank_of_solver
            }

            fetch(currentURL + 'calculator/des_runge_kutta/', {
                method: 'POST',
                mode: 'cors',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(values)
            }).then((response) => response.json())
                .then((data) => {
                    setGraph(<div/>)
                    setGraph(
                        <BigGraph x={data.x_values} y={data.y_values}/>
                    )
                })
        }
    });

    return (
        <main>
            <div className="container text-center py-5 d-flex flex-column align-items-center">
                <h1>Test działania API</h1>
                <h2>podaj funkcję do narysowania wykresu</h2>

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
                    <button type="submit" className="w-100 btn-primary mt-3">Submit</button>
                </form>
                {graph}
            </div>
        </main>
    );
}

export default TestAPI;