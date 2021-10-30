import {Tree} from "./Tree.js";

const elements = {
    tree: document.querySelectorAll("#tree_list  > .tree"),
    search: document.getElementById("search"),
    generateButton: document.getElementById("generate")
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
        const xhr = new XMLHttpRequest();
        xhr.onload = () => resolve(xhr.responseText);
        xhr.open(method, url);
        xhr.send(data);
    });
}


elements.generateButton.addEventListener("click", function () {
    sendRequest("GET", "/generate")
        .then(() => {

        });
});

/**
 *
 * @type {Tree[]}
 */
let treeArr = [];

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

sortable.on('sortable:sorted', function () {
    treeArr.forEach(el => el.removeListeners());
    treeArr = [];
    elements.tree = document.querySelectorAll("#tree_list  > .tree");
    elements.tree.forEach(el => {
        treeArr.push(new Tree(el));
    });
});