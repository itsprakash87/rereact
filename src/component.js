import { updateComponents, enqueSetState } from "./updateComponents";

export function Component(props) {
    this.props = props;
}

var protos = {
    setState: function (newState, cb) {
        enqueSetState(this, newState, cb);
    },
    forceUpdate: function() {
        console.log("force uopdate")
    }
};

Component.prototype = protos;
