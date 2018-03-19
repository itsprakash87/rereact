import { updateComponents } from "./updateComponents";

export function Component(props) {
    this.props = props;
}

var protos = {
    setState: function (newState, cb) {
        console.log("setState called")
        this._prevState = this.state;
        this.state = {...this.state, ...newState};
        updateComponents(this, true, false);
    },
    forceUpdate: function() {
        console.log("force uopdate")
    }
};

Component.prototype = protos;
