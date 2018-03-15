
export function diff(dom, element) {
    // if element is string/number/boolean
        // just replace dom.parentnod.replacechild(element, dom)
        // unmount(dom)

    // else if element.type === string
        // if root domNode name === element.type
        // setProps() of dom with element.props
        // Iterate through children

        // else 
        // createElement with element.type
        // setProps() of created element with element.props
        // copy children of dom to children of element.
        // Iterate through children

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
    let domChildren = dom.childNodes;
    let elementChildren = element.children;

    // iterate throug domChildren
        // if this children contain key (domChild.__key !== null), save it to "keyedChildren" object with key
        // else if domChild._componentInstance && domChild._componentInstance.props.key !== null, save it to keyedChildren
        // else save to unkeyedChildren

    // iterate through elementChildren
        // if elementChild.props.key and keyedChildren[elementChild.props.key] !== null
            // diff(keyedChildren[elementChild.props.key], elementChild)
            // keyedChildren[elementChild.props.key] = null

        // else
            // iterate through unkeyed children
                // 
                // if unkeyedChild.nodeName ===  
};
