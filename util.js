
export function flatten(a, shallow,r){
    if(!r){ r = []}

    if (shallow) {
        return r.concat.apply(r,a);
    }
        
    for(let i=0; i<a.length; i++){
        Array.isArray(a[i]) ? (flatten(a[i],shallow,r)) : (r.push(a[i]));
    }
    return r;
}

export function createDomElement(elementType) {
    return document.createElement(elementType);
}

export function setAllProps(elem, props = {}) {
    Object.keys(props).map(function(key) {
        let value = props[key];

        setProp(elem, key, value);
    });
}

export function setProp(elem, propKey = "", propValue) {
    if (propKey === "ref") {
        if (typeof propValue === "function") {
            propValue(elem);
        }
        return;
    }
    if (propKey === "key") {
        elem.__key = propValue;
        return;
    }
    if (propKey === "dangerouslySetInnerHTML") {
        return;
    }
    if (propKey.startsWith("on")) {
        // This is event handler.
        let eventType = propKey.toLowerCase().substring(2);

        if (eventType === "change" && (elem.nodeName.toLowerCase() === "textarea" || elem.nodeName.toLowerCase() === "input")) {
            // In react, onchange event on input/textarea behave as oninput event.
            eventType = "input";
        }
        elem.addEventListener(eventType, propValue);

        if (elem._prevListeners && elem._prevListeners[eventType] && elem._prevListeners[eventType] !== propValue) {
            elem.removeEventListener(eventType, elem._prevListeners[eventType]);
            delete elem._prevListeners[eventType];
        }

        elem._prevListeners = elem._prevListeners || {};
        elem._prevListeners[eventType] = propValue;
        return;
    }
    if (propKey === "style") {
        if (typeof propValue === "object") {
            for (let i in propValue) {
                let value = propValue[i];
				elem.style[i] = value;
			}
        }
        else if (typeof propValue === "string") {
            elem.style.cssText = propValue; 
        }
        return;
    }
    if (propKey === "className") {
        propKey = "class";
    }
    elem.setAttribute(propKey, propValue);
};
