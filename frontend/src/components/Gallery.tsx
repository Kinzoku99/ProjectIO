import React, {useEffect, useState} from "react";
import GalleryGraph from "./graphs/GalleryGraph";
import {EQ} from "../mathOutputFunctions";
import currentURL from "../URLconfig";

class IntegralGraphics {
    public graph: JSX.Element;
    public text: string;

    public constructor(graph: JSX.Element, text: string) {
        this.graph = graph;
        this.text = text;
    }
}

const Gallery: React.FC = () => {
    const [cards, setCards] = useState<IntegralGraphics[]>(Array(12).fill(new IntegralGraphics(<div style={{
        aspectRatio: "1 / 1",
        width: "90%",
        margin: "auto"
    }} className="mt-3"/>, '')));

    useEffect(() => {
        fetch(currentURL + 'gallery/', {
            method: 'GET',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: null
        }).then((response) => response.json())
            .then((data) => {
                let cardsFilled: IntegralGraphics[] = [];
                for (const element of data.elements) {
                    cardsFilled.push(new IntegralGraphics(<GalleryGraph x={element.x_values} y={element.y_values}/>, element.tex));
                }
                setCards(() => {
                    return cardsFilled;
                })
            })
    }, [])

    return (
        <div>
            <div className="album py-5">
                <div className="container">
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                        {cards.map((card) => (
                            <div id={card.text} className="col">
                                <div className="card shadow-sm">
                                    {card.graph}

                                    <div className="card-body">
                                        <p className="card-text">{EQ(card.text)}</p>
                                    </div>
                                </div>
                            </div>))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Gallery;