import React, {useState} from "react";
import {Toast, ToastContainer} from "react-bootstrap";

const Header: React.FC = () => {
    let [toast1Visible, setToast1Visible] = useState<boolean>(false);
    let [toast2Visible, setToast2Visible] = useState<boolean>(false);

    return (
        <div>
            <header>
                <nav id="navbar_top" className="navbar navbar-expand-md navbar-light bg-light">
                    <div className="container-fluid">
                        <a className="navbar-brand d-flex align-items-center align-middle" href="/">
                            <img id="header-logo" src="/logo512_black.png" height="512" width="512" alt="logo"/>
                            <h1 className="strong_ml mb-0">Całkowanie</h1>
                        </a>

                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"/>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-md-0">
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="/">Strona Główna</a>
                                </li>

                                <li className="nav-item dropdown">
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a className="nav-link dropdown-toggle" href="#" role="button"
                                       data-bs-toggle="dropdown">Kalkulatory</a>

                                    <ul className="dropdown-menu">
                                        <li className="dropdown-item">
                                            <a className="nav-link" href="/intvalue">Wartość całki</a>
                                        </li>

                                        <li className="dropdown-item">
                                            <a className="nav-link" href="/antiderivativegraphs">Wykresy funkcji pierwotnych</a>
                                        </li>

                                        <li className="dropdown-item">
                                            <a className="nav-link" href="/exactint">Dokładne funkcje pierwotne</a>
                                        </li>
                                    </ul>
                                </li>

                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="/info" role="button"
                                       data-bs-toggle="dropdown">Informacje</a>

                                    <ul className="dropdown-menu">
                                        <li className="dropdown-item">
                                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                            <a className="nav-link" id="contact" href="#" onClick={() => setToast1Visible(() => true)}>Kontakt</a>
                                        </li>

                                        <li className="dropdown-item">
                                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                            <a className="nav-link" id="sources" href="#" onClick={() => setToast2Visible(() => true)}>Źródła</a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
            <div className="position-fixed top-2 end-0 p-2" style={{zIndex: 1000}}>
                <ToastContainer>
                    <Toast show={toast1Visible} autohide={true} onClose={() => setToast1Visible(() => false)} animation={true}>
                        <Toast.Header>
                            <svg className="bd-placeholder-img rounded me-2" width="20" height="20"
                                 xmlns={"http://www.w3.org/2000/svg"} aria-hidden="true" preserveAspectRatio="xMidYMid slice"
                                 focusable="false">
                                <rect width="100%" height="100%" fill="#007aff"/>
                            </svg>
                            <strong className="me-auto">Kontakt</strong>
                        </Toast.Header>
                        <Toast.Body>{"Ewentualne problemy prosimy zgłaszać na\ne-mail: integralteam@gmail.com"}</Toast.Body>
                    </Toast>
                    <Toast show={toast2Visible} autohide={true} onClose={() => setToast2Visible(() => false)} animation={true}>
                        <Toast.Header>
                            <svg className="bd-placeholder-img rounded me-2" width="20" height="20"
                                 xmlns={"http://www.w3.org/2000/svg"} aria-hidden="true" preserveAspectRatio="xMidYMid slice"
                                 focusable="false">
                                <rect width="100%" height="100%" fill="#007aff"/>
                            </svg>
                            <strong className="me-auto">Źródła</strong>
                        </Toast.Header>
                        <Toast.Body>Tu będą jakieś źródła.</Toast.Body>
                    </Toast>
                </ToastContainer>
            </div>
        </div>
    );
}

export default Header;
