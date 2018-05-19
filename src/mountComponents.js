import { createDomElement, setAllProps } from "./util";
import { Component } from "./component";

let deepnessLevel = 0;
let didMountQueue = [];

export function mountComponents(element, parentComponentInstance) {
    // Receive an element and return the dom tree.
    // It recursively create the dom tree from the element.

    let returnElem;
    deepnessLevel++;

    if (!element || typeof element === "string" || typeof element === "boolean" || typeof element === "number") {
        // It is a text node.
        let text = "";

        if (element !== null || typeof element !== "undefined") {
            text = element;
        }

        returnElem = document.createTextNode(text);
    }
    else if (typeof element.type === "string") {
        // It is an html element.
        let elem = createDomElement(element.type);

        setAllProps(elem, element.props);

        if (Array.isArray(element.children) && element.children.length > 0) {
            element.children.map(function(child = "") {
                let mountedChild = mountComponents(child);
                elem.appendChild(mountedChild);
            });
        }
        returnElem = elem;
    }
    else if (typeof element.type === "function") {
        // It is a react component
        let compInstance = processComponentMounting(element);
        let renderedTree = compInstance.render && compInstance.render(Object.assign({}, element.props, {children: element.children}));
        // let renderedTree = compInstance.render && compInstance.render({...element.props, children: element.children});
        let mountedComp = mountComponents(renderedTree, compInstance);

        mountedComp._componentInstance = compInstance;
        mountedComp._componentConstructer = compInstance.constructor;

        if (typeof element.props.key !== "undefined") {
            mountedComp.__key = element.props.key + "";
        }

        compInstance._domNode = mountedComp;
        if (parentComponentInstance) {
            parentComponentInstance._rootComponent = compInstance;
        }

        didMountQueue.push(compInstance);
        returnElem = mountedComp;
    }

    deepnessLevel--;

    if (deepnessLevel === 0) {
        // Entire dom tree has been prepared.
        flushDidMountQueue();
        // setTimeout(flushDidMountQueue, 0);
    }

    return returnElem;
};

export function processComponentMounting(element) {
    if (typeof element.type === "function") {
        if (element.type.prototype && element.type.prototype.render) {
            // It is class based component
            let compInstance = new element.type(Object.assign({}, element.props, {children: element.children}));
            // let compInstance = new element.type({...element.props, children: element.children});

            // compInstance.props = {...compInstance.props, ...element.props, children: element.children};
            compInstance.props = Object.assign({}, compInstance.props, element.props, {children: element.children});
            typeof compInstance.componentWillMount === "function" && compInstance.componentWillMount();

            if (element.props && typeof element.props.ref === "function") {
                element.props.ref(compInstance);
            }
            return compInstance;
        }
        else {
            // It is functional component
            let comp = new Component();

            comp.constructor = element.type;
            comp.render = renderFunctionalComponent.bind(comp, element.type);

            return comp;
            // return element.type({...element.props, children: element.children})
        }
    }
}

export function renderFunctionalComponent(constructor, props) {
    return constructor(props || this.props);
}

export function flushDidMountQueue() {
    for(let i in didMountQueue) {
        didMountQueue[i] && didMountQueue[i].componentDidMount && didMountQueue[i].componentDidMount();
    }
    didMountQueue = [];
}
