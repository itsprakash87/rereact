import { createDomElement, setAllProps } from "./util";

export function updateComponents(element) {
    // Receive an element and return the dom tree.
    // It recursively create the dom tree from the element.

    if (!element || typeof element === "string" || typeof element === "boolean") {
        // It is a text node.
        let text = "";

        if (typeof element === "string") {
            text = element;
        }

        let elem = document.createTextNode(text);

        return elem;
    }
    else if (typeof element.type === "string") {
        // It is an html element.
        let elem = createDomElement(element.type);
        
        setAllProps(elem, element.props);

        if (Array.isArray(element.children) && element.children.length > 0) {
            element.children.map(function(child) {
                let mountedChild = updateComponents(child);
                // console.log(mountedChild)
                elem.appendChild(mountedChild);
            });
        }
        return elem;
    }
    else if (typeof element.type === "function") {
        // It is a react component
        let elem = processComponentUpdation(element);

        return updateComponents(elem);
    }
};

export function processComponentUpdation(element) {
    if (typeof element.type === "function") {
        if (element.type.prototype && element.type.prototype.render) {
            // It is class based component
            let compInstance = new element.type({...element.props, children: element.children});

            compInstance.props = {...compInstance.props, ...element.props, children: element.children};
            typeof compInstance.componentWillReceiveProps === "function" && compInstance.componentWillReceiveProps();
            typeof compInstance.componentWillUpdate === "function" && compInstance.componentWillUpdate();

            return compInstance.render();
        }
        else {
            // It is functional component
            return element.type({...element.props, children: element.children})
        }
    }
}
