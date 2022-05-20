import React from "react";
import {useNavigate} from "react-router-dom";

interface IProps {
    errorCode: number
    errorMessage?: string
}

const ErrorPage: React.FC<IProps> = (props) => {
    let navigate = useNavigate();

    const routeChange = () =>{
        navigate('/');
    }

    return (
        <div>
            <div className="container-fluid text-center mt-5">
                <h1 style={{fontSize: "40vmin"}}>{props.errorCode}</h1>
                <h3 className="mt-3 fw-bold">{props.errorMessage}</h3>
                <button
                    type="button"
                    className="mt-5 btn btn-outline-secondary p-3 px-5 fw-bold"
                    onClick={routeChange}
                >
                    Powrót do strony głównej
                </button>
            </div>
        </div>
    )
}

export default ErrorPage;