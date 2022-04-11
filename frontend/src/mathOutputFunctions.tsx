import {MathComponent} from "mathjax-react";
import React from "react";

const LIMIT = 100;

export const iEQ = (eq: string) => {
    return (
        <MathComponent tex={eq} display={false} />
    )
}

export const EQ: (eq: string) => (JSX.Element) = (eq: string) => {
    if (eq.length >= LIMIT) {
        let equations: Array<string> = [];
        let components: Array<JSX.Element> = [];

        let match: IterableIterator<RegExpMatchArray> = eq.matchAll(/[-+=]+/g);
        let lastSplit = 0;
        let next = match.next();

        while (!next.done) {
            const split = next.value;

            if (split.index !== undefined && split.index - lastSplit >= LIMIT) {
                equations.push(eq.substring(lastSplit, split.index) + ' ' + split[0]);
                lastSplit = split.index;
            }

            next = match.next();
        }

        equations.push(eq.substring(lastSplit));

        for (const element of equations) {
            components.push(<MathComponent tex={element} display={true}/>)
        }

        return (
            <div className="math-multiline">
                {components}
            </div>
        );
    }
    else {
        return (
            <MathComponent tex={eq} display={true}/>
        );
    }
}