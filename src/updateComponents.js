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
    // TODO:: This Set is useless here. Remove that.
    let uniqueRenders = new Set();

    while (pendingSetStates.length > 0) {
        let pendingSetState = pendingSetStates.shift();
        let { compInstance, newState, cb } = pendingSetState;

        compInstance._prevState = compInstance.state;
        compInstance.state = typeof newState ==='function' ? Object.assign({}, compInstance.state, newState(compInstance.state, compInstance.props)) : Object.assign({}, compInstance.state, newState);
        typeof cb === "function" && cb();
        uniqueRenders.add(pendingSetState);
    }

    uniqueRenders = Array.from(uniqueRenders);

    for (let i = 0;i < uniqueRenders.length;i++) {
        let { compInstance } = uniqueRenders[i];

        updateComponents(compInstance, true, false);
    }
}

export function forceUpdate(compInstance) {
    compInstance && updateComponents(compInstance, true, true);
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

        // if last root component was a react component
    if (compInstance._rootComponent && typeof rendered.type === "function" && rendered.type === compInstance._rootComponent.constructor) {
        // Root of last tree and new tree are same component. So start updating from that component
        let rootComponent = compInstance._rootComponent;

        rootComponent._nextProps = Object.assign({}, rendered.props, {children: rendered.children});
        updateComponent(rootComponent);
    }
    else {
        let newDom, oldDom = compInstance._domNode;

        if (typeof rendered.type === "function" || compInstance._rootComponent) {
            // Root component has changed in new tree.
            delete compInstance._rootComponent;
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
