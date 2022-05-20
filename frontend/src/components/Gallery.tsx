import React, {useEffect, useState} from "react";
import GalleryGraph from "./graphs/GalleryGraph";
import {EQ} from "../mathOutputFunctions";
import currentURL from "../URLconfig";

class IntegralGraphics {
    public id: number;
    public graph: JSX.Element;
    public text: string;

    public constructor(id: number, graph: JSX.Element, text: string) {
        this.id = id;
        this.graph = graph;
        this.text = text;
    }
}

const Gallery: React.FC = () => {
    const [loader, setLoader] = useState<JSX.Element>(<div className="lds-ripple"><div/><div/></div>);
    const [cards, setCards] = useState<IntegralGraphics[]>(Array(0));

    useEffect(() => {
        fetch(currentURL + 'gallery/random/12', {
            method: 'GET',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: null
        }).then((response) => response.json())
            .then((data) => {
                let cardsFilled: IntegralGraphics[] = [];
                for (const element of data.elements) {
                    cardsFilled.push(new IntegralGraphics(
                        element.id,
                        <GalleryGraph x={element.x_values} y={element.y_values}/>,
                        "\\int \\:" + element.tex_string + " \\:d" + element.variable_name)
                    );
                }
                setCards(cardsFilled);
            });
    }, []);

    useEffect(() => {
        if (cards.length > 0) {
            setLoader(<div/>);
        }
    }, [cards])

    return (
        <div>
            {loader}
            <div className="album py-5">
                <div className="container">
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                        {cards.map((card) => (
                            <div key={card.id} className="col">
                                <div className="card shadow-sm">
                                    {card.graph}

                                    <div className="card-body">
                                        <div className="card-text">{EQ(card.text)}</div>
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