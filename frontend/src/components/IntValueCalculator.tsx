import React, {useState} from "react";
import Gallery from "./Gallery";
import {EQ} from "../mathOutputFunctions";
import {CalculatorSettings} from "../calculatorSettings";
import currentURL from "../URLconfig";
import {useForm} from "react-hook-form";

type FormData = {
    formula: string,
    methodRadio: any
}

const PRECISION = 8;

const roundFloat = (number: number): string => {
    let factor = Math.pow(10, PRECISION);
    return (Math.round(number * factor) / factor).toString();
}

const IntValueCalculator: React.FC = () => {
    const {register, handleSubmit} = useForm<FormData>();
    let [result, setResult] = useState<string>("");
    let [inputValid, setInputValid] = useState<string>("");

    const onSubmit = handleSubmit((formData) => {
        if (Object.entries(formData.formula).length === 0) {
            setInputValid(' is-invalid');
        }
        else {
            const valuesRequest1 = {
                function_expression: formData.formula,
                variable_name: CalculatorSettings.variable_name,
                interval_begin: CalculatorSettings.interval_begin,
                interval_end: CalculatorSettings.interval_end,
                step_size: CalculatorSettings.step_size
            }

            const valuesRequest2 = {
                function_expression: formData.formula,
                variable_name: CalculatorSettings.variable_name,
                interval_begin: CalculatorSettings.interval_begin,
                interval_end: CalculatorSettings.interval_end,
                num_of_divisions: CalculatorSettings.num_of_divisions,
                tol: CalculatorSettings.tol
            }

            if (formData.methodRadio === "trapezoid") {
                fetch(currentURL + 'calculator/integrate_trapezoid/', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(valuesRequest1)
                }).then((response) => {
                    if (response.status === 400) {
                        setInputValid(" is-invalid");
                        setResult("");
                        return null;
                    }
                    return response.json();
                })
                    .then((data) => {
                        if (data !== null) {
                            setResult("\\int_{" + valuesRequest1.interval_begin + "}^{" + valuesRequest1.interval_end
                                + "} dx\\: \\: " + data.tex_function + " = " + roundFloat(data.result));
                            setInputValid("");
                        }
                    });
            }
            else {
                fetch(currentURL + 'calculator/integrate_romberg/', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(valuesRequest2)
                }).then((response) => {
                    if (response.status === 400) {
                        setInputValid(" is-invalid");
                        setResult("");
                        return null;
                    }
                    return response.json();
                    })
                    .then((data) => {
                        if (data !== null) {
                            setResult("\\int_{" + valuesRequest2.interval_begin + "}^{" + valuesRequest2.interval_end
                                + "} dx\\: \\: " + data.tex_function + " = " + roundFloat(data.result));
                            setInputValid("");
                        }
                    });
            }
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
            <div className="panel-filler"/>

            <div className="main-content">
                <Gallery />

                <div className="calculator-panel">
                    {/* To jest sekcja nagłówka naszej strony czyli o czym to jest */}
                    <section className="container text-center py-5">
                        <div className="row py-lg-5">
                            <div className="col-lg-6 col-md-8 mx-auto">
                                <h1 className="fw-light h11">Kalkulator wartości całki</h1>

                                <p className="lead text-muted p11">
                                    Ten kalkulator wykonuje całkowanie numeryczne.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="container">
                        <div className="row">
                            <div className="col-lg-6 col-md-8 mx-auto">
                                <form noValidate={true} onSubmit={onSubmit}>
                                    <div className="row">
                                        <input
                                            type="text"
                                            className={"form-control m-0" + inputValid}
                                            id="formula2"
                                            style={{width: "80%"}}
                                            {...register("formula")}
                                        />
                                        <button
                                            type="submit"
                                            className="btn btn-outline-secondary"
                                            id="subbtn"
                                            style={{width: "20%"}}
                                        >Policz</button>
                                    </div>
                                    <div className="mt-3">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="methodRadio1"
                                                value="trapezoid"
                                                checked
                                                {...register("methodRadio")}
                                            />
                                            <label className="form-check-label fw-light" htmlFor="flexRadioDefault1">
                                                Metoda złożonej kwadratury trapezów
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="methodRadio2"
                                                value="romberg"
                                                {...register("methodRadio")}
                                            />
                                            <label className="form-check-label fw-light" htmlFor="flexRadioDefault2">
                                                Metoda Romberga
                                            </label>
                                        </div>
                                    </div>
                                </form>

                                <div id="exactresult" className="my-5">
                                    {EQ(result)}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}

export default IntValueCalculator;
