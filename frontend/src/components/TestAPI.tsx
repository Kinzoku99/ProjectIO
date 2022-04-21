import React, {useState} from "react";
import {useForm} from "react-hook-form";
import currentURL from "../URLconfig";
import BigGraph from "./BigGraph";

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
                beg_x: -50,
                end_x: 50,
                step: 0.1
            }

            fetch(currentURL + 'calculator/graph/', {
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