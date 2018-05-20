
let deepnessLevel = 0;
let unmountQueue = [];

export function unmountComponents(dom) {
    deepnessLevel++;

    if (dom) {
        let childNodes = Array.prototype.slice.call(dom.childNodes, 0) || [];

        childNodes.map(function(node) {
            unmountComponents(node)
        });

        if (dom && dom._componentInstance) {
            unmountQueue.push(dom._componentInstance);
        }
    }

    deepnessLevel--;

    if (deepnessLevel === 0) {
        if (dom && dom.parentNode) {
            dom.parentNode.removeChild(dom);
        }
        flushUnmountQueue();
    }
}

export function flushUnmountQueue() {
    for(let i in unmountQueue) {
        unmountQueue[i] && unmountQueue[i].componentWillUnmount && unmountQueue[i].componentWillUnmount();
    }
    unmountQueue = [];
}

