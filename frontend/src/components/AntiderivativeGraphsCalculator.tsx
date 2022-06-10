import React, {useState} from "react";
import Gallery from "./Gallery";
import {useForm} from "react-hook-form";
import {CalculatorSettings} from "../calculatorSettings";
import currentURL from "../URLconfig";
import BigGraph from "./graphs/BigGraph";
import {getValueFromLS} from "../otherFunctions";

type FormData = {
    formula_expression: string,
    beg: number,
    end: number
}

const AntiderivativeGraphsCalculator: React.FC = () => {
    const {register, handleSubmit} = useForm<FormData>({
        defaultValues: {
            beg: CalculatorSettings.beg_x,
            end: CalculatorSettings.end_x
        }
    });

    let [result, setResult] = useState<JSX.Element>(<div/>);
    let [formulaValid, setFormulaValid] = useState<string>("");
    let [begValid, setBegValid] = useState<string>("");
    let [endValid, setEndValid] = useState<string>("");

    const onSubmit = handleSubmit((formData) => {
        const isFormulaValid = Object.entries(formData.formula_expression).length !== 0;
        const isBegValid = formData.beg.toString().length !== 0 && !isNaN(formData.beg);
        const isEndValid = formData.end.toString().length !== 0 && !isNaN(formData.end);

        setFormulaValid(isFormulaValid ? ' is-valid' : ' is-invalid');
        setBegValid(isBegValid ? ' is-valid' : ' is-invalid');
        setEndValid(isEndValid ? ' is-valid' : ' is-invalid');

        if (isFormulaValid && isBegValid && isEndValid) {
            const valuesRequest1 = {
                function_expression: formData.formula_expression,
                variable_name: getValueFromLS('variable_name', CalculatorSettings.variable_name),
                step_size: parseFloat(getValueFromLS('step_size_graph', CalculatorSettings.step_size.toString())),
                num_of_divisions: parseInt(getValueFromLS('num_of_divisions', CalculatorSettings.num_of_divisions.toString())),
                tol: parseFloat(getValueFromLS('tol', CalculatorSettings.tol.toString())),
                begin_of_integrating_interval: formData.beg,
                end_of_integrating_interval: formData.end,
                rank_of_solver: parseInt(getValueFromLS('rank_of_solver', CalculatorSettings.rank_of_solver.toString()))
            }

            const valuesRequest2 = {
                function_expression: formData.formula_expression,
                beg_x: formData.beg,
                end_x: formData.end,
                step_size: parseFloat(getValueFromLS('step_size_graph', CalculatorSettings.step_size.toString()))
            }

            fetch(currentURL + 'calculator/des_runge_kutta/2/', {
                method: 'POST',
                mode: 'cors',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(valuesRequest1)
            }).then((response) => {
                if (response.status === 400) {
                    setFormulaValid(' is-invalid');
                    setResult(<div/>);
                    return null;
                }
                else {
                    return response.json();
                }
            })
                .then((data) => {
                    if (data !== null) {
                        fetch(currentURL + 'calculator/graph/', {
                            method: 'POST',
                            mode: 'cors',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify(valuesRequest2)
                        }).then((response) => {
                            if (response.status === 500) {
                                setResult(<div/>);
                                setResult(
                                    <BigGraph x={data.x_values} y={data.y_values} x_func={[]} y_func={[]}/>
                                );
                                return null;
                            } else {
                                return response.json();
                            }
                        })
                            .then((data2) => {
                                if (data2 !== null) {
                                    setResult(<div/>)
                                    setResult(
                                        <BigGraph x={data.x_values} y={data.y_values} x_func={data2.x_values}
                                                  y_func={data2.y_values}/>
                                    )
                                }
                            })
                    }
                })

        }
    })

    const convertRemToPixels = (rem : number) => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

    document.addEventListener("scroll", function () {
        const calcPanel = document.querySelector<HTMLElement>(".calculator-panel");
        if (calcPanel !== null) {
            const navbarHeight = convertRemToPixels(3.5);
            const distanceFromTop = Math.abs( document.body.getBoundingClientRect().top);
            if (navbarHeight >= distanceFromTop)
                calcPanel.style.marginTop = (navbarHeight - distanceFromTop).toString(10) + "px";
            else
                calcPanel.style.marginTop = "0px";
        }
    });

    return (
        <main>
            <div className="panel-filler" style={{height: "42vh"}}/>

            <div className="main-content">
                <Gallery />

                <div className="calculator-panel" style={{zIndex: 100}}>
                    {/* To jest sekcja nagłówka naszej strony czyli o czym to jest */}
                    <section className="container text-center py-5">
                        <div className="row py-lg-5">
                            <div className="col-lg-6 col-md-8 mx-auto">
                                <h1 className="fw-light h11">Graficzny kalkulator funkcji pierwotnych</h1>

                                <p className="lead text-muted p11">
                                    Ten kalkulator rysuje wykres funkcji pierwotnej.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="container">
                        <div className="row">
                            <div className="col-lg-6 col-md-8 mx-auto">
                                <form noValidate={true} onSubmit={onSubmit}>
                                    <div className="form-floating mb-1">
                                        <input
                                            type="text"
                                            className={"form-control" + formulaValid}
                                            id="formula_expression"
                                            placeholder="formula"
                                            {...register("formula_expression")}
                                        />
                                        <label htmlFor="formula">Wzór</label>
                                    </div>
                                    <div className="mt-2 row gx-0 gx-md-1">
                                        <div className="form-floating mb-1 col-sm-12 col-md-6">
                                            <input
                                                type="text"
                                                className={"form-control" + begValid}
                                                id="beg"
                                                placeholder="beg"
                                                {...register("beg")}
                                            />
                                            <label htmlFor="beg">Początek zakresu</label>
                                        </div>
                                        <div className="form-floating mb-1 col-sm-12 col-md-6">
                                            <input
                                                type="text"
                                                className={"form-control" + endValid}
                                                id="end"
                                                placeholder="end"
                                                {...register("end")}
                                            />
                                            <label htmlFor="end">Koniec zakresu</label>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-outline-secondary mt-3 btn-calc-form"
                                        id="subbtn"
                                        style={{width: "50%", marginRight: "25%", marginLeft: "25%"}}
                                    >Policz</button>
                                </form>
                            </div>
                        </div>
                        <div id="exactresult" className="my-5">
                        {result}
                    </div>
                    </section>
                </div>
            </div>
        </main>
    );
}

export default AntiderivativeGraphsCalculator;