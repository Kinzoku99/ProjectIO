import {MathComponent} from "mathjax-react";
import React from "react";

export const iEQ = (eq: string) => {
    return (
        <MathComponent tex={eq} display={false} />
    )
}

export const EQ = (eq: string) => {
    return (
        <MathComponent tex={eq} display={true}/>
    )
}