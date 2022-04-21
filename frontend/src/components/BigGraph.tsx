import React from "react";
// @ts-ignore
import JXGBoard from 'jsxgraph-react-js';

interface GraphProps {
    x: number[],
    y: number[]
}

const BigGraph: React.FC<GraphProps> = (props) => {
    // @ts-ignore
    const logicJS = (brd) => {
        brd.suspendUpdate();
        brd.create('curve', [props.x, props.y], { strokeColor: '#aa2233', strokeWidth: 3 });
        brd.unsuspendUpdate();
    }

    return (
        <JXGBoard
            logic={logicJS}
            boardAttributes={{ axis: true, boundingbox: [-12, 10, 12, -10] }}
            style={{
                border: "2px solid gray",
                borderRadius: "5px"
            }}
            className="mt-3"
        />
    );
}

export default BigGraph;