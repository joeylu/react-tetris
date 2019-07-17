import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import Game from "./Game";

const Root = styled.div`
  font-family: sans-serif;
  text-align: center;
`;

class App extends React.PureComponent {
  game;

  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }

  componentDidMount() {
    this.game = new Game(this.canvas.current);
  }

  render() {
    return (
      <Root>
        <h1>Tetris</h1>
        <div ref={this.canvas} />
      </Root>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
