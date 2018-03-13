
export function Component(props) {
    this.props = props;
}

var protos = {
    setState: function () {
        console.log("setState called")
    },
    forceUpdate: function() {
        console.log("force uopdate")
    }
};

Component.prototype = protos;
