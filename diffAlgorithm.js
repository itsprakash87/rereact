import { unmountComponents } from "./unmountComponents";
import { setAllProps, createDomElement } from "./util";
import { updateComponents } from "./updateComponents";
import { mountComponents } from "./mountComponents";

export function diff(dom, element) {
    if (typeof element === "string" || typeof element === "number" || typeof element === "boolean") {
        element = element.toString();
        if (dom && dom.nodeType === 3) {
            // Previous node was also a text node. So just update the value.
            dom.nodeValue !== element && (dom.nodeValue = element);
        }
        else {
            // Otherwise create a new text node and replace that with existing dom.
            let textNode = document.createTextNode(element.toString());

            dom.parentNode.replaceChild(textNode, dom);
            unmountComponents(dom);
        }
        return;
    }
    else if (typeof element.type === "string") {
        if (dom && dom.nodeName && dom.nodeName.toLowerCase() === element.type) {
            setAllProps(dom, element.props);
            diffChildren(dom, element);
            return;
        }
        else {
            let newDomRoot = createDomElement(element.type);

            setAllProps(newDomRoot, element.props);
			while (dom.firstChild) {
                newDomRoot.appendChild(dom.firstChild);
            }

            if (dom && typeof dom._componentConstructer === "function" && typeof dom._componentInstance === "object") {
                // This dom is the root node of some component.
                newDomRoot._componentInstance = dom._componentInstance;
                newDomRoot._componentConstructer = dom._componentConstructer;
                newDomRoot._componentInstance._domNode = newDomRoot;
            }

			if (dom.parentNode) {
                dom.parentNode.replaceChild(newDomRoot, dom);
            }
            diffChildren(newDomRoot, element);
            return;
        }
    }
    else if (typeof element.type === "function") {
        if (dom && dom._componentConstructer && dom._componentConstructer === element.type) {
            
            // dom._componentInstance._nextProps = {...element.props, children: element.children};
            dom._componentInstance._nextProps = Object.assign({}, element.props, {children: element.children});
            updateComponents(dom._componentInstance);
        }
        else {
            let newDom = mountComponents(element);

            dom.parentNode.replaceChild(newDom, dom);
            unmountComponents(dom);
        }
    }
};

export function diffChildren(dom, element) {
    let domChildren = dom.childNodes || [];
    let elementChildren = element.children || [];
    let keyedChildren = {}, nonKeyedChildren = [];

    for (let i = 0;i < domChildren.length; i++) {
        let domChild = domChildren[i];

        if ((domChild && domChild.__key) && (domChild._componentInstance && domChild._componentInstance.props.key)) {
            keyedChildren[domChild.__key] = domChild;
        }
        else {
            nonKeyedChildren.push(domChild);
        }
    }

    for (let i = 0;i < elementChildren.length; i++) {
        let elementChild = elementChildren[i], child;

        if (elementChild && elementChild.props && elementChild.props.key && keyedChildren[elementChild.props.key]) {
            child = keyedChildren[elementChild.props.key];
            keyedChildren[elementChild.props.key] = null;
        }
        else {
            for (let j = 0;j < nonKeyedChildren.length;j++) {
                if (nonKeyedChildren[j]) {
                    let nonKeyedChild = nonKeyedChildren[j];

                    if ((nonKeyedChild._componentConstructer ===  elementChild.type) || 
                        (nonKeyedChild.nodeName.toLowerCase() === elementChild.type) ||
                        (nonKeyedChild.nodeType === 3 && typeof elementChild === "string")) {
                        child = nonKeyedChild;
                        nonKeyedChildren[j] = null;
                        break;
                    }
                }
            }
        }

        // if (child) {
            diff(child, elementChild);
        // }
        // else {
        //     let newChild = mountComponents(elementChild);

        //     dom.appendChild(newChild);
        // }
    
    }
    
    Object.keys(keyedChildren).map(function(key){
        let keyedChild = keyedChildren[key];

        if (keyedChild) {
            unmountComponents(keyedChild);
        }
    });

    for(let i = 0;i < nonKeyedChildren.length;i++) {
        if (nonKeyedChildren[i]) {
            unmountComponents(nonKeyedChildren);
        }
    }
};
