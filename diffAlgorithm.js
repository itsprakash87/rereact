import { unmountComponents } from "./unmountComponents";
import { setAllProps, createDomElement } from "./util";
import { updateComponents } from "./updateComponents";
import { mountComponents } from "./mountComponents";

export function diff(dom, element) {
    console.log("in diff");
    if (typeof element === "string" || typeof element === "number" || typeof element === "boolean") {
        console.log("in diff if");
        let textNode = document.createTextNode(element.toString());

        dom.parentNode.replaceChild(textNode, dom);
        unmountComponents(dom);
        return;
    }
    // if element is string/number/boolean
        // just replace dom.parentnod.replacechild(element, dom)
        // unmount(dom)

    else if (typeof element.type === "string") {
        console.log("in diff else if");
        if (dom && dom.nodeName && dom.nodeName.toLowerCase() === element.type) {
            console.log("in diff else if and if");
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

			if (dom.parentNode) {
                dom.parentNode.replaceChild(newDomRoot, dom);
            }
            diffChildren(newDomRoot, element);
            return;
        }
    }
    // else if element.type === string
        // if root domNode name === element.type
        // setProps() of dom with element.props
        // Iterate through children

        // else 
        // createElement with element.type
        // setProps() of created element with element.props
        // copy children of dom to children of element.
        // dom.parentnod.replacechild(newElement, dom)
        // Iterate through children

    else if (typeof element.type === "function") {
        console.log("is function")
        if (dom && dom._componentConstructer && dom._componentConstructer === element.type) {
            
            dom._componentInstance._nextProps = {...element.props, children: element.children};
            console.log("in if of functin ", dom._componentInstance)
            updateComponents(dom._componentInstance);
        }
        else {
            console.log("in else of functin")
            let newDom = mountComponents(element);

            dom.parentNode.replaceChild(newDom, dom);
            unmountComponents(dom);
        }
    }
    // else if element.type === function
        // if dom && dom._componentConstructer === element.type
            // dom._componentInstance._nextProps = {...element.props, children: element.children}
            // Call updateComponents(dom._componentInstance)

        // else 
            // let newDom = mountComponents(element)
            // dom.parentnod.replacechild(newDom, dom)
            // unmount(dom)
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

    console.log("", keyedChildren)
    console.log("", nonKeyedChildren)
    // iterate throug domChildren
        // if this children contain key (domChild.__key !== null), save it to "keyedChildren" object with key
        // else if domChild._componentInstance && domChild._componentInstance.props.key !== null, save it to keyedChildren
        // else save to unkeyedChildren

    for (let i = 0;i < elementChildren.length; i++) {
        let elementChild = elementChildren[i], child;

        if (elementChild && elementChild.props && elementChild.props.key && keyedChildren[elementChild.props.key]) {
            console.log("has matched key")
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
                            console.log("non keyed matched with ",j, " => ")
                            console.dir(nonKeyedChild)
                        child = nonKeyedChild;
                        nonKeyedChildren[j] = null;
                        break;
                    }
                }
            }
        }

        diff(child, elementChild);
    }
    // iterate through elementChildren
        // if elementChild.props.key and keyedChildren[elementChild.props.key] !== null
            // child = keyedChildren[elementChild.props.key]
            // keyedChildren[elementChild.props.key] = null

        // else
            // iterate through unkeyed children
                // 
                // if unkeyedChild._componentConstructer ===  elementChild.type
                // or unkeyedChild.nodeName === elementChild.type
                // or unkeyedChild.nodeType === 3 && typeof elementChild === "string"
                    // child = unkeyedChild
                    // unkeyedChildren[thisUnkeyedChildIndex] = null; 
                    // break unkeyed children loop.
                
        
        // diff(child, elementChildren)

    
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
    // iterate through keyedChildren
        // if keyChild !== null then it is unused. So unmount(keyChild)
    
    // iterate through unkeyedChildren
        // if unkeyedchild !== null unmount(unkeyedChild)
};
