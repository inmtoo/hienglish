export class Tree {

    constructor(element, parent = null) {
        /**
         * @type {HTMLElement}
         */
        this.element = element;
        /**
         *
         * @type {null|Tree}
         */
        this.parent = parent;

        /**
         * @type {HTMLElement}
         */
        this.title = element.querySelector(".title");
        /**
         * @type {HTMLElement|null}
         */
        this.childrenOverflow = element.querySelector(".children");
        /**
         *
         * @type {HTMLElement|null}
         */
        this.children = this.childrenOverflow ? this.childrenOverflow.firstElementChild : null;
        this.closestChildren = this.element.closest(".children");
        this.name = this.title.innerText.toLowerCase();

        /**
         *
         * @type {Tree[]}
         */
        this.childsTree = [];
        if (this.children) {
            for (let c of this.children.children) {
                this.childsTree.push(new Tree(c, this));
            }
        }

        this.listeners = {
            titleClick: () => "",
            measure: () => ""
        };
        this.setListeners();
    }

    measureChildren(event) {
        const height = this.children.getBoundingClientRect().height;

        this.childrenOverflow.style.setProperty("transition", "height 250ms");
        if (!this.childrenOverflow.classList.contains("opened")) {
            this.childrenOverflow.style.height = height + "px";
            setTimeout(() => this.childrenOverflow.style.height = "0", 0);
        } else {
            this.childrenOverflow.style.height = height + "px";
            const f = () => {
                this.childrenOverflow.removeEventListener("transitionend", f);
                setTimeout(() => this.childrenOverflow.style.height = "auto", 0);
            }
            this.childrenOverflow.addEventListener("transitionend", f);
        }
        // let change;
        // let height = this.children.getBoundingClientRect().height;
        // if (event.detail && event.detail.hasOwnProperty("height")) height += event.detail.height;
        // if (!this.childrenOverflow.classList.contains("opened")) {
        //     change = -height;
        //     this.childrenOverflow.style.height = "0";
        // } else {
        //     change = height;
        //     this.childrenOverflow.style.height = height + "px";
        // }
        //
        // if (this.closestChildren) {
        //
        //     // контрольное изменение высоты
        //     const f = () => {
        //         this.childrenOverflow.removeEventListener("transitionend", f);
        //         setTimeout(() => this.closestChildren.dispatchEvent(new CustomEvent("measure", {detail: {height: 0}})), 10);
        //     }
        //     this.childrenOverflow.addEventListener("transitionend", f);
        //     /////////
        //
        //     /// изменяем высоту без задержки
        //     const obj = {detail: {}};
        //     if (event.detail && event.detail.hasOwnProperty("height")) obj.detail.height = event.detail.height;
        //     else obj.detail.height = change;
        //     this.closestChildren.dispatchEvent(new CustomEvent("measure", obj));
        // }

    }

    hide() {
        if (!this.childrenOverflow) return;

        this.childrenOverflow.classList.remove("opened");
        this.childrenOverflow.style.transition = "none";
        this.childrenOverflow.style.height = "0";
    }

    show() {
        if (!this.childrenOverflow) return;

        this.childrenOverflow.classList.add("opened");
        this.childrenOverflow.style.transition = "none";
        this.childrenOverflow.style.height = "auto";
    }

    search(name) {
        name = name.toLowerCase();

        let isFound = false;
        let childsFound = false;
        if (this.name.includes(name)) isFound = true;
        this.childsTree.forEach(el => {
            if (el.search(name)) {
                isFound = true;
                childsFound = true;
            }
        });

        if (childsFound) {
            this.show();
        } else {
            this.hide();
        }

        return isFound;
    }

    onClickTitle() {
        if (!this.childrenOverflow) return;

        this.childrenOverflow.classList.toggle("opened");
        this.childrenOverflow.dispatchEvent(new CustomEvent("measure"));

    }

    setListeners() {
        this.listeners.titleClick = () => this.onClickTitle()
        this.title.addEventListener("click", this.listeners.titleClick);
        if (this.childrenOverflow) {
            this.listeners.measure = e => this.measureChildren(e);
            this.childrenOverflow.addEventListener("measure", this.listeners.measure);
        }

    }

    removeListeners() {
        this.title.removeEventListener("click", this.listeners.titleClick);
        if (this.childrenOverflow) this.childrenOverflow.removeEventListener("measure", this.listeners.measure);

        this.childsTree.forEach(el => el.removeListeners());
    }

}

