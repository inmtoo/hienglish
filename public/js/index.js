import {Tree} from "./Tree.js";

const elements = {
    tree: document.querySelectorAll("#tree_list  > .tree"),
    search: document.getElementById("search"),
    generateButton: document.getElementById("generate"),
    preloader: document.querySelector(".preloader")
};

/**
 *
 * @param method {"POST"|"GET"}
 * @param url {string}
 * @param data {FormData|URLSearchParams|string|null}
 * @return Promise<string>
 */
function sendRequest(method, url, data = null) {
    return new Promise(resolve => {
        elements.preloader.classList.add("opened");

        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            elements.preloader.classList.remove("opened");
            resolve(xhr.responseText);
        };
        xhr.open(method, url);
        xhr.send(data);
    });
}


elements.generateButton.addEventListener("click", function () {
    sendRequest("GET", "/generate")
        .then(() => {
            location.reload();
        });
});

/**
 *
 * @type {Tree[]}
 */
let treeArr = [];


window.deleteRoot = root => {
    const i = treeArr.findIndex(el => el === root);
    if (~i) treeArr.splice(i, 1);
};

window.delete = elementId => {
    return sendRequest("GET", "/delete?id=" + elementId)
        .then(() => {

        });
};

elements.tree.forEach(el => {
    treeArr.push(new Tree(el));
});

treeArr.forEach(el => {
    el.show();
    el.childsTree.forEach(el => el.show());
});

elements.search.addEventListener("input", function () {
    treeArr.forEach(tree => tree.search(this.value));
});

const sortable = new Draggable.Sortable(document.querySelectorAll(".children > div"), {
    draggable: ".tree",
    classes: {
        "source:dragging": ["tree_drag"],
        "body:dragging": ["tree_drag"]
    },
    // sortAnimation: {
    //     duration: 200,
    //     easingFunction: 'ease-in-out',
    // },
    // plugins: [Draggable.Plugins.SortAnimation],
    delay: 200
});

sortable.on('drag:stop', function (event) {
    treeArr.forEach(el => el.removeListeners());
    treeArr = [];
    elements.tree = document.querySelectorAll("#tree_list  > .tree");
    elements.tree.forEach(el => {
        treeArr.push(new Tree(el));
    });

    const current = event.source;
    const tree = current.parentElement.closest(".tree");
    const parentId = tree ? tree.dataset.id : 0;

    sendRequest("GET", `/update?id=${current.dataset.id}&parent_id=${parentId}`);
});