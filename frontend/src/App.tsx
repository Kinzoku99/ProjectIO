import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./components/Header";
import MainPage from "./components/MainPage";
import ErrorPage from "./components/ErrorPage";
import ExactIntCalculator from "./components/ExactIntCalculator";
import TestAPI from "./components/TestAPI";
import TestNum from "./components/TestNum";

function App() {
    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/" element={<MainPage/>}/>
                <Route path="/exactint" element={<ExactIntCalculator/>}/>
                <Route path="/test/graph" element={<TestAPI/>}/>
                <Route path="/test/num" element={<TestNum/>}/>
                <Route path="/*" element={<ErrorPage errorCode={404} errorMessage="Nie znaleziono strony"/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
