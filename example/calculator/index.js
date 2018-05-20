/** @jsx createElement */

import { Component, createElement, render } from '@itsprakash87/rereact';
import Button from './Button';
import './style.css';

const BUTTON_TEXTS = ["1","2","3", "+", "4","5","6", "-", "7","8","9", "*",".", "0", "=", "/"];

class App extends Component {
  constructor() {
    super();
    this.state = {
      expression: "",
      error: "",
    };
  }

  handleButtonClick = (text) => {
    let expression;
    let error = "";

    if (text === "=") {
      try {
        expression = eval(this.state.expression).toString();
      }
      catch(err) {
        expression = this.state.expression;
        error = "Please enter a valid expression."
      }
    }
    else {
      expression = this.state.expression;

      expression += text;
    }
    this.setState({ expression, error });
  }

  handleClear = () =>{
    this.setState({ expression: "", error: "" });
  }

  handleBack = () => {
    let expression = this.state.expression;

    expression = expression.slice(0, - 1);
    this.setState({ expression , error: ""});
  }

  render() {
    return (
      <div>
          <div className={"container"}>
          <div className={"expression"}>
            <span className={"expression_text"}>{this.state.expression}</span>
          </div>
          <div className={"top_button_row"}>
            <Button className={"button_red"} text={"C"} onClick={this.handleClear} />
            <Button className={"button_back button_blue"} text={"Back"} onClick={this.handleBack} />
          </div>
          <div className={"buttons_container"}>
            {
              BUTTON_TEXTS.map((text, i) => <Button text={text} onClick={this.handleButtonClick} className={`${i%4 === 3 && "button_orange"}`} />)
            }
          </div>
        </div>
          {this.state.error && <div className={"error"}>{this.state.error}</div>}
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
