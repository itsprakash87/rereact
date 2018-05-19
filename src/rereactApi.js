export function cloneElement(element, props, ...children) {
    let clonedElement = Object.assign({}, element);

    if (typeof props === "object") {
        clonedElement.props = Object.assign({}, clonedElement.props, props);
    }
    if (Array.isArray(children)) {
        clonedElement.children = Object.assign([], clonedElement.children, children);
    }
    return clonedElement;
}

export function findDOMNode(componentInstance) {
    return componentInstance && componentInstance._domNode;
}
