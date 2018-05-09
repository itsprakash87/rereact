
let deepnessLevel = 0;
let unmountQueue = [];

export function unmountComponents(dom) {
    deepnessLevel++;

    if (dom) {
        let childNodes = dom.childNodes || [];

        childNodes.map(function(node) {
            unmountComponents()
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
}

