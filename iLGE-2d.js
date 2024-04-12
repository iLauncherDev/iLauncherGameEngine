class iLGE_2D {
    /* Game Data */
    data = {
        add_item: function (key, value) {
            window.localStorage.setItem(key, value);
        },
        remove_item: function (key) {
            window.localStorage.removeItem(key);
        },
        read_item: function (key) {
            return window.localStorage.getItem(key);
        },
    };

    /* Control Map Settings */
    control_map = {
        map: [],
        map_default: [],
        set: function (action, key) {
            this.map[action] = key;
        },
        set_default: function (action, key) {
            this.map_default[action] = key;
        },
        clear: function (action) {
            this.map[action] = null;
        },
        save: function () {
            this.data.add_item("Control_Map", map);
        },
        load: function () {
            this.map = this.data.read_item(action);
            if (this.map == null) {
                this.map = [];
                for (var i = 0; i < this.map_default.length; i++)
                    this.map[i] = this.map_default[i];
            }
        },
        restore: function () {
            for (var i = 0; i < this.map_default.length; i++)
                this.map[i] = this.map_default[i];
        },
    };

    constructor(html_div, auto_resize) {
        var isThis = this;
        this.canvas = document.createElement("canvas");
        this.auto_resize = auto_resize;
        if (this.auto_resize) {
            this.canvas.width = window.innerWidth * window.devicePixelRatio;
            this.canvas.height = window.innerHeight * window.devicePixelRatio;
        }
        window.addEventListener("resize",
            /**
            * @param event {Event}
            */
            function (event) {
                console.log(isThis.auto_resize);
                if (!isThis.auto_resize)
                    return;
                isThis.canvas.width = window.innerWidth * window.devicePixelRatio;
                isThis.canvas.height = window.innerHeight * window.devicePixelRatio;
                console.log("width: ");
                console.log(isThis.canvas.width);
                console.log(";\n");
                console.log("height: ");
                console.log(isThis.canvas.height);
                console.log(";\n");
            }, true);
        html_div.appendChild(this.canvas);
    };
}