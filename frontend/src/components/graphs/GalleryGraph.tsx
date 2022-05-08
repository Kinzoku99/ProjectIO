import React from "react";
import JSXGraph from "./JSXGraph";

interface GraphProps {
    x: number[],
    y: number[]
}

const GalleryGraph: React.FC<GraphProps> = (props) => {
    const logicJS = (brd: any) => {
        brd.suspendUpdate();
        brd.create('curve', [props.x, props.y], { strokeColor: '#aa2233', strokeWidth: 3 });
        brd.unsuspendUpdate();
    }

    return (
        <JSXGraph
            logic={logicJS}
            boardAttributes={{
                axis: true,
                boundingbox: [-15, 15, 15, -15],
                maxboundingbox: [-40, 40, 40, -40],
                resize: {enabled: true, throttle: 100},
                showCopyright: false
            }}
            style={{
                border: "0 solid gray",
                borderRadius: "0",
                aspectRatio: "1 / 1",
                width: "90%",
                margin: "auto"
            }}
            className="mt-3"
        />
    );
}

export default GalleryGraph;