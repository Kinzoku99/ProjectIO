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
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-calculator-fill" viewBox="0 0 16 16">
                                <path
                                    d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm2 .5v2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5zm0 4v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zM4.5 9a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM4 12.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zM7.5 6a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM7 9.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zm.5 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM10 6.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zm.5 2.5a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5h-1z"/>
                            </svg>
                            <h1 className="strong_ml mb-0">Całkowanie</h1>
                        </a>

                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"/>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
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
                                            <a className="nav-link" href="/graphs">Wykresy funkcji pierwotnych</a>
                                        </li>

                                        <li className="dropdown-item">
                                            <a className="nav-link" href="/exactint">Dokładne funkcje pierwotne</a>
                                        </li>
                                    </ul>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link" href="/settings">Ustawienia</a>
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

                                <li className="nav-item">
                                    <a className="nav-link" href="/login" style={{color: "navy"}}>zaloguj się</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
            <div className="position-fixed top-2 end-0 p-2" style={{zIndex: 10}}>
                <ToastContainer>
                    <Toast show={toast1Visible} onClose={() => setToast1Visible(() => false)} animation={true}>
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
                    <Toast show={toast2Visible} onClose={() => setToast2Visible(() => false)} animation={true}>
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