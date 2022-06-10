import React, {useState} from "react";
import Gallery from "./Gallery";
import {EQ} from "../mathOutputFunctions";
import {CalculatorSettings, GaussTypes} from "../calculatorSettings";
import currentURL from "../URLconfig";
import {getValueFromLS} from "../otherFunctions";
import {Collapse, OverlayTrigger, Popover} from "react-bootstrap";

const getInitialValue = (name: string, defaultValue: string) => {
    if (localStorage.getItem(name) != null) {
        return localStorage.getItem(name) as string;
    }
    else {
        return defaultValue;
    }
}

const IntValueCalculator: React.FC = () => {
    let [formula, setFormula] = useState<string>('');
    let [radio, setRadio] = useState<string>(getValueFromLS('int_value_method', CalculatorSettings.int_value_method));
    let [result, setResult] = useState<string>('');
    let [inputValid, setInputValid] = useState<string>('');
    let [collapseOpen, setCollapseOpen] = useState<boolean>(false);

    const [variableName, setVariableName] = useState<string>(
        getInitialValue('variable_name', CalculatorSettings.variable_name));
    const [gaussValueMethod, setGaussValueMethod] = useState<string>(
        getInitialValue('gauss_value_method', CalculatorSettings.gauss_type));
    const [intervalBegin, setIntervalBegin] = useState<string>(CalculatorSettings.interval_begin.toString());
    const [intervalEnd, setIntervalEnd] = useState<string>(CalculatorSettings.interval_end.toString());
    const [variableNameValid, setVariableNameValid] = useState<string>('');
    const [intervalBeginValid, setIntervalBeginValid] = useState<string>('');
    const [intervalEndValid, setIntervalEndValid] = useState<string>('');

    const calculatorSettings = (
        <div className="mt-3">
            <p className="lead text-muted p11  mb-2">Dodatkowe ustawienia</p>
            <div className="form-floating mb-1">
                <input
                    type="text"
                    className={"form-control" + variableNameValid}
                    id="variable_name"
                    placeholder="variable_name"
                    value={variableName}
                    onChange={event => {
                        setVariableName(event.target.value);
                        if (event.target.value.length === 0) setVariableNameValid(' is-invalid');
                        else setVariableNameValid('');
                    }}
                />
                <label htmlFor="variable_name">Nazwa zmiennej</label>
            </div>
            {(radio === 'trapezoid' || radio === 'romberg') ?
                <div className="mt-2 row gx-0 gx-md-1">
                    <div className="form-floating mb-1 col-sm-12 col-md-6">
                        <input
                            type="text"
                            className={"form-control" + intervalBeginValid}
                            id="interval_begin"
                            placeholder="interval_begin"
                            value={intervalBegin}
                            onChange={event => {
                                setIntervalBegin(event.target.value);
                                if (event.target.value.length === 0 || isNaN(Number(event.target.value))) setIntervalBeginValid(' is-invalid');
                                else setIntervalBeginValid('');
                            }}
                        />
                        <label htmlFor="interval_begin">Początek zakresu</label>
                    </div>
                    <div className="form-floating mb-1 col-sm-12 col-md-6">
                        <input
                            type="text"
                            className={"form-control" + intervalEndValid}
                            id="interval_end"
                            placeholder="interval_end"
                            value={intervalEnd}
                            onChange={event => {
                                setIntervalEnd(event.target.value);
                                if (event.target.value.length === 0 || isNaN(Number(event.target.value))) setIntervalEndValid(' is-invalid');
                                else setIntervalEndValid('');
                            }}
                        />
                        <label htmlFor="interval_end">Koniec zakresu</label>
                    </div>
                </div>
                : <div/>
            }
            {(radio === 'gauss' || radio === 'gauss_weight') ?
                <div className="form-floating mt-2 mb-1">
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
                    <label htmlFor="gauss_method_select">Metoda</label>
                </div>
                : <div/>
            }
        </div>
    );

    const getPopover = (id: string, text: string) => {
        return (
            <Popover id={id}>
                <Popover.Body className="p-2">
                    {text}
                </Popover.Body>
            </Popover>
        );
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (variableNameValid === '' && intervalBeginValid === '' && intervalEndValid === '') {
            if (formula.length === 0) {
                setInputValid(' is-invalid');
            } else {
                const valuesRequest1 = {
                    function_expression: formula,
                    variable_name: variableName,
                    interval_begin: parseFloat(intervalBegin),
                    interval_end: parseFloat(intervalEnd),
                    num_of_divisions: parseInt(getValueFromLS('num_of_divisions_trapezoid', CalculatorSettings.num_of_divisions.toString()))
                }

                const valuesRequest2 = {
                    function_expression: formula,
                    variable_name: variableName,
                    interval_begin: parseFloat(intervalBegin),
                    interval_end: parseFloat(intervalEnd),
                    num_of_divisions: parseInt(getValueFromLS('num_of_divisions', CalculatorSettings.num_of_divisions.toString())),
                    tol: parseFloat(getValueFromLS('tol', CalculatorSettings.tol.toString()))
                }

                const valuesRequest3 = {
                    function_expression: formula,
                    variable_name: variableName,
                    type: gaussValueMethod,
                    rank: parseInt(getValueFromLS('gauss_rank', CalculatorSettings.gauss_rank.toString()))
                }

                if (radio === "trapezoid") {
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
                                    + "} d" + valuesRequest1.variable_name + "\\: \\: " + data.tex_function + " = " + data.result);
                                setInputValid("");
                            }
                        });
                } else if (radio === 'romberg') {
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
                                    + "} d" + valuesRequest2.variable_name + "\\: \\: " + data.tex_function + " = " + data.result);
                                setInputValid("");
                            }
                        });
                } else if (radio === 'gauss') {
                    fetch(currentURL + 'calculator/integrate_gauss/', {
                        method: 'POST',
                        mode: 'cors',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(valuesRequest3)
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
                                setResult("\\int d" + valuesRequest3.variable_name + "\\: \\: " + data.tex_function + " = " + data.result);
                                setInputValid("");
                            }
                        });
                } else {
                    fetch(currentURL + 'calculator/integrate_gauss_weight/', {
                        method: 'POST',
                        mode: 'cors',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(valuesRequest3)
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
                                setResult("\\int d" + valuesRequest3.variable_name + "\\: \\: " + data.tex_function + " = " + data.result);
                                setInputValid("");
                            }
                        });
                }
            }
        }
    };

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
                                <form noValidate={true} onSubmit={event => onSubmit(event)}>
                                    <div className="row">
                                        <div className="input-group m-0 p-0" style={{width: "80%"}}>
                                            <button
                                                className="input-group-text"
                                                id="basic-addon1"
                                                type="button"
                                                onClick={() => setCollapseOpen(!collapseOpen)}
                                            >
                                                <i className="bi bi-gear-fill"></i>
                                            </button>
                                            <input
                                                type="text"
                                                className={"form-control m-0" + inputValid}
                                                id="formula3"
                                                onChange={event => setFormula(event.target.value)}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-outline-secondary"
                                            id="subbtn2"
                                            style={{width: "20%"}}
                                            disabled={!(variableNameValid === '' && intervalBeginValid === '' && intervalEndValid === '')}
                                        >Policz</button>
                                    </div>
                                    <Collapse in={collapseOpen}>
                                        <div  id="example-collapse-text">
                                            <div className="card card-body mt-2">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        id="methodRadio1"
                                                        value="trapezoid"
                                                        name="methodRadio"
                                                        checked={radio === "trapezoid"}
                                                        onChange={event => {
                                                            setRadio(event.target.value);
                                                            setResult('');
                                                        }}
                                                    />
                                                    <OverlayTrigger
                                                        placement="right"
                                                        overlay={getPopover('trapezoid', 'Lorem ipsum dolor sit amet, ' +
                                                            'consectetur adipiscing elit. Praesent vitae est et arcu vulputate eleifend. ' +
                                                            'Aenean lacinia in dui et mattis. Nulla facilisi. In pharetra et ante quis placerat. ' +
                                                            'Nulla nec suscipit mauris. Sed sagittis scelerisque enim id congue. Nam et auctor tellus, ' +
                                                            'ullamcorper fermentum lorem. Suspendisse pellentesque tellus sed magna tincidunt, sit amet ' +
                                                            'facilisis mi commodo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ' +
                                                            'ridiculus mus. Phasellus vehicula risus non mauris ornare, et bibendum turpis bibendum.')}
                                                    >
                                                        <label className="form-check-label fw-light" htmlFor="flexRadioDefault1" style={{paddingRight: "10px"}}>
                                                            Metoda złożonej kwadratury trapezów
                                                        </label>
                                                    </OverlayTrigger>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        id="methodRadio1"
                                                        value="romberg"
                                                        name="methodRadio"
                                                        checked={radio === "romberg"}
                                                        onChange={event => {
                                                            setRadio(event.target.value);
                                                            setResult('');
                                                        }}
                                                    />
                                                    <OverlayTrigger
                                                        placement="right"
                                                        overlay={getPopover('romberg', 'Lorem ipsum dolor sit amet, ' +
                                                            'consectetur adipiscing elit. Praesent vitae est et arcu vulputate eleifend. ' +
                                                            'Aenean lacinia in dui et mattis. Nulla facilisi. In pharetra et ante quis placerat. ' +
                                                            'Nulla nec suscipit mauris. Sed sagittis scelerisque enim id congue. Nam et auctor tellus, ' +
                                                            'ullamcorper fermentum lorem. Suspendisse pellentesque tellus sed magna tincidunt, sit amet ' +
                                                            'facilisis mi commodo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ' +
                                                            'ridiculus mus. Phasellus vehicula risus non mauris ornare, et bibendum turpis bibendum.')}
                                                    >
                                                        <label className="form-check-label fw-light" htmlFor="flexRadioDefault2" style={{paddingRight: "10px"}}>
                                                            Metoda Romberga
                                                        </label>
                                                    </OverlayTrigger>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        id="methodRadio1"
                                                        value="gauss"
                                                        name="methodRadio"
                                                        checked={radio === "gauss"}
                                                        onChange={event => {
                                                            setRadio(event.target.value);
                                                            setResult('');
                                                        }}
                                                    />
                                                    <OverlayTrigger
                                                        placement="right"
                                                        overlay={getPopover('gauss', 'Lorem ipsum dolor sit amet, ' +
                                                            'consectetur adipiscing elit. Praesent vitae est et arcu vulputate eleifend. ' +
                                                            'Aenean lacinia in dui et mattis. Nulla facilisi. In pharetra et ante quis placerat. ' +
                                                            'Nulla nec suscipit mauris. Sed sagittis scelerisque enim id congue. Nam et auctor tellus, ' +
                                                            'ullamcorper fermentum lorem. Suspendisse pellentesque tellus sed magna tincidunt, sit amet ' +
                                                            'facilisis mi commodo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ' +
                                                            'ridiculus mus. Phasellus vehicula risus non mauris ornare, et bibendum turpis bibendum.')}
                                                    >
                                                        <label className="form-check-label fw-light" htmlFor="flexRadioDefault3" style={{paddingRight: "10px"}}>
                                                            Metoda Gaussa
                                                        </label>
                                                    </OverlayTrigger>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        id="methodRadio1"
                                                        value="gauss_weight"
                                                        name="methodRadio"
                                                        checked={radio === "gauss_weight"}
                                                        onChange={event => {
                                                            setRadio(event.target.value);
                                                            setResult('');
                                                        }}
                                                    />
                                                    <OverlayTrigger
                                                        placement="right"
                                                        overlay={getPopover('gauss_weight', 'Lorem ipsum dolor sit amet, ' +
                                                            'consectetur adipiscing elit. Praesent vitae est et arcu vulputate eleifend. ' +
                                                            'Aenean lacinia in dui et mattis. Nulla facilisi. In pharetra et ante quis placerat. ' +
                                                            'Nulla nec suscipit mauris. Sed sagittis scelerisque enim id congue. Nam et auctor tellus, ' +
                                                            'ullamcorper fermentum lorem. Suspendisse pellentesque tellus sed magna tincidunt, sit amet ' +
                                                            'facilisis mi commodo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ' +
                                                            'ridiculus mus. Phasellus vehicula risus non mauris ornare, et bibendum turpis bibendum.')}
                                                    >
                                                        <label className="form-check-label fw-light" htmlFor="flexRadioDefault4" style={{paddingRight: "10px"}}>
                                                            Metoda Gaussa z wagą
                                                        </label>
                                                    </OverlayTrigger>
                                                </div>
                                            </div>
                                            {calculatorSettings}
                                        </div>
                                    </Collapse>
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
