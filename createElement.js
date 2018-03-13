
// Create an element object. 

export function createElement(type, props, ...children) {
    return {
        type, props: props || {}, children: children || []
    }
};
