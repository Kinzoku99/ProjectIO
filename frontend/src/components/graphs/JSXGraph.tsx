import React from 'react';
import assign from 'lodash/assign';
import JXG from 'jsxgraph';

interface JSXGraphProps {
    style?: {
        [key: string]: string | number
    },
    className?: string,
    logic: (board: object) => void,
    boardAttributes?: {
        [key: string]: any
    }
}

type JSXGraphState = {
    board: any;
}

const BoardContext = React.createContext<any>(null);

class JSXGraph extends React.Component<JSXGraphProps, JSXGraphState> {
    private readonly id: string;
    private readonly defaultStyle: {};
    private readonly defaultBoardAttributes: {};

    constructor(props: JSXGraphProps) {
        super(props);
        this.state = { board: null };
        this.id = 'board_' + Math.random().toString(36).slice(2, 11);
        this.defaultStyle = {};
        this.defaultBoardAttributes = {};
    }

    // called only after initial render
    componentDidMount() {
        // now that div exists, create new JSXGraph board with it
        let attributes = {};
        Object.assign(attributes, this.defaultBoardAttributes, this.props.boardAttributes || {});
        let board = JXG.JSXGraph.initBoard(this.id, attributes);
        this.props.logic(board);

        this.setState({
            board: board
        });
    }

    // called only if shouldComponentUpdate returns true
    // for rendering the JSXGraph board div and any child elements
    render() {
        let style = assign(this.defaultStyle, this.props.style || {})

        return (
            <BoardContext.Provider value={this.state.board}>
                <div id={this.id} className={'jxgbox ' + this.props.className} style={style} />
            </BoardContext.Provider>
        )
    }
}

export default JSXGraph;