import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./components/Header";
import MainPage from "./components/MainPage";
import ErrorPage from "./components/ErrorPage";
import ExactIntCalculator from "./components/ExactIntCalculator";
import IntValueCalculator from "./components/IntValueCalculator";
import AntiderivativeGraphsCalculator from "./components/AntiderivativeGraphsCalculator";

function App() {
    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/" element={<MainPage/>}/>
                <Route path="/exactint" element={<ExactIntCalculator/>}/>
                <Route path="/intvalue" element={<IntValueCalculator/>}/>
                <Route path="/antiderivativegraphs" element={<AntiderivativeGraphsCalculator/>}/>
                <Route path="/*" element={<ErrorPage errorCode={404} errorMessage="Nie znaleziono strony"/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
