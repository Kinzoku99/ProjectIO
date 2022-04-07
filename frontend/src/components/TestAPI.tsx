import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {isNumberObject} from "util/types";
import currentURL from "../URLconfig";

type FormData = {
    a: number
    b: number
}

const TestAPI: React.FC = () => {
    const {register, handleSubmit} = useForm<FormData>();
    const [aValid, setAValid] = useState<string>('');
    const [bValid, setBValid] = useState<string>('');

    const [calculatedResultHTML, setCalculatedResultHTML] = useState<JSX.Element>()

    const onSubmit = handleSubmit((formData) => {
        const isAValid = Object.entries(formData.a).length !== 0;
        const isBValid = Object.entries(formData.b).length !== 0;

        setAValid(isAValid ? ' is-valid' : ' is-invalid');
        setBValid(isBValid ? ' is-valid' : ' is-invalid');

        if (isAValid && isBValid) {
            const values = {
                a: formData.a,
                b: formData.b
            }

            fetch(currentURL + 'calculator/hello/', {
                method: 'POST',
                mode: 'cors',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(values)
            }).then((response) => response.json())
                .then((data) => {
                    setCalculatedResultHTML(
                        <div className="mt-5">
                            <p className="font-weight-bold">Serwer zwrócił wynik:</p>
                            <h3>{data.result}</h3>
                        </div>
                    )
                })
        }
    });

    return (
        <main>
            <div className="container text-center py-5 d-flex flex-column align-items-center">
                <h1>Test działania API</h1>
                <h2>obliczanie a &times; b</h2>

                <form noValidate={true} className="mt-5 w-50" onSubmit={onSubmit}>
                    <div className="form-floating mb-1">
                        <input
                            type="number"
                            className={"form-control" + aValid}
                            id="a"
                            placeholder="a"
                            {...register("a")}
                        />
                        <label htmlFor="a">Podaj a</label>
                    </div>
                    <div className="form-floating mb-1">
                        <input
                            type="number"
                            className={"form-control" + bValid}
                            id="b"
                            placeholder="b"
                            {...register("b")}
                        />
                        <label htmlFor="b">Podaj b</label>
                    </div>
                    <button type="submit" className="w-100 btn-primary mt-3">Submit</button>
                </form>
                {calculatedResultHTML}
            </div>
        </main>
    );
}

export default TestAPI;