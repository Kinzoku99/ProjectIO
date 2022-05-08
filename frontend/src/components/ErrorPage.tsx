import React from "react";

interface IProps {
    errorCode: number
    errorMessage?: string
}

const ErrorPage: React.FC<IProps> = (props) => {
    return (
        <div>
            <div className="container-fluid text-center mt-5">
                <h1>{props.errorCode}</h1>
                <h4 className="mt-3">{props.errorMessage}</h4>
            </div>
        </div>
    )
}

export default ErrorPage;