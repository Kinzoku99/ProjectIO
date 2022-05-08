import React from "react";
import JSXGraph from "./JSXGraph";

interface GraphProps {
    x: number[],
    y: number[],
    x_func: number[],
    y_func: number[]
}

const BigGraph: React.FC<GraphProps> = (props) => {
    const logicJS = (brd: any) => {
        brd.suspendUpdate();
        brd.create('curve', [props.x_func, props.y_func], { strokeColor: '#6c757d', strokeWidth: 1 });
        brd.create('curve', [props.x, props.y], { strokeColor: '#aa2233', strokeWidth: 3 });
        brd.unsuspendUpdate();
    }

    return (
        <JSXGraph
            logic={logicJS}
            boardAttributes={{
                axis: true,
                boundingbox: [-20, 20, 20, -20],
                maxboundingbox: [-100, 100, 100, -100],
                resize: {enabled: true, throttle: 100},
                showCopyright: false,
                showFullscreen: true,
                fullscreen: {
                    symbol: '\u22c7'
                }
            }}
            style={{
                border: "2px solid gray",
                borderRadius: "5px",
                aspectRatio: "1 / 1"
            }}
            className="mt-3 col-6 m-auto"
        />
    );
}

export default BigGraph;