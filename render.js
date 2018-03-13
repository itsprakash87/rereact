import { mountComponents } from "./mountComponents";

export function render(element, container, cb) {
    let domTree = mountComponents(element);

    if (domTree && container) {
        container.appendChild(domTree);
    }

    if (typeof cb === "function") {
        cb();
    }

    return domTree;
};
