import { createDomElement, setAllProps } from "./util";
import { mountComponents } from "./mountComponents";
import { unmountComponents } from "./unmountComponents";
import { diff } from "./diffAlgorithm";

let pendingSetStates = [];

export function enqueSetState(compInstance, newState, cb) {
    pendingSetStates.push({ compInstance, newState, cb });

    if (typeof Promise !== "undefined") {
        Promise.resolve().then(processPendingSetStates);
    }
}

export function processPendingSetStates() {
    let uniqueRenders = new Set();

    while (pendingSetStates.length > 0) {
        let pendingSetState = pendingSetStates.shift();
        let { compInstance, newState, cb } = pendingSetState;

        compInstance._prevState = compInstance.state;
        compInstance.state = typeof newState ==='function' ? {...compInstance.state, ...newState(compInstance.state, compInstance.props) } : {...compInstance.state, ...newState};
        typeof cb === "function" && cb();
        uniqueRenders.add(pendingSetState);
    }

    uniqueRenders = Array.from(uniqueRenders);

    for (let i = 0;i < uniqueRenders.length;i++) {
        let { compInstance } = uniqueRenders[i];

        updateComponents(compInstance, true, false);
    }
}

export function updateComponents(compInstance, IS_ORIGIN, IS_FORCE_RENDER) {
    let prevProps = compInstance.props;
    let nextProps = !IS_ORIGIN ? compInstance._nextProps : compInstance.props;
    let prevState = (IS_ORIGIN && !IS_FORCE_RENDER) ? compInstance._prevState : compInstance.state;
    let nextState = compInstance.state;

    // Check shouldComponentUpdate
    if (!IS_FORCE_RENDER && compInstance.shouldComponentUpdate && !compInstance.shouldComponentUpdate(nextProps, nextState)) {
        // should not rerender component.
        return;
    }
    if (!IS_ORIGIN) {
        compInstance.componentWillReceiveProps && compInstance.componentWillReceiveProps(nextProps);
    }

    compInstance.componentWillUpdate && compInstance.componentWillUpdate(nextProps, nextState);

    if (!IS_ORIGIN) {
        compInstance.props = compInstance._nextProps;
    }
    compInstance._nextProps ? (delete compInstance._nextProps) : null;
    compInstance._prevState ? (delete compInstance._prevState) : null;

    let rendered = compInstance.render();

    if (compInstance._rootComponent) {
        // if last root component was a react component
        if (rendered.type === "function" && rendered.type === compInstance._rootComponent.constructor) {
            // Root of last tree and new tree are same component. So start updating from that component
            let rootComponent = compInstance._rootComponent;

            rootComponent._nextProps = {...rendered.props, children: rendered.children};
            updateComponent(rootComponent);
        }
    }
    else {
        let newDom, oldDom = compInstance._domNode;

        if (rendered.type === "function") {
            // Root component has changed in new tree.
            newDom = mountComponents(rendered, compInstance);
            if (oldDom && oldDom.parentNode) {
                oldDom.parentNode.replaceChild(newDom, oldDom);
            }
            unmountComponents(oldDom);
        }
        else {
            newDom = diff(oldDom, rendered);
        }
    }

    compInstance.componentDidUpdate && compInstance.componentDidUpdate(prevProps, prevState);
}
