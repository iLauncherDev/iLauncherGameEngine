// Copyright (C) 2024 Daniel Victor
//
// This program is distributed under the terms of the GNU General Public License, Version 3
// (or any later version) published by the Free Software Foundation.
// You can obtain a copy of the license at https://www.gnu.org/licenses/gpl-3.0.en.html.

const iLGE_2D_Object_Element_Type_Sprite = "Sprite";
const iLGE_2D_Object_Element_Type_Rectangle = "Rectangle";
const iLGE_2D_Object_Element_Type_Collider = "Collider";
const iLGE_2D_Object_Element_Type_Text = "Text";
const iLGE_2D_Object_Element_Type_Sprite_Transition_Effect = "Sprite_Transition_Effect";
const __iLGE_2D_Object_Font = "Font";
const iLGE_2D_Object_Type_Camera = "Camera";
const iLGE_2D_Object_Type_Custom = "Custom";
const iLGE_2D_Source_Type_Image = "Image_Source";
const iLGE_2D_Source_Type_Audio = "Audio_Source";

class iLGE_2D_Source {
    source = 0;
    source_data = 0;
    #src = null;
    #type = null;

    getSrc() {
        return this.#src;
    }

    compareSrc(src) {
        return this.#src === src ? true : false;
    }

    compareSourceType(type) {
        return this.#type === type ? true : false;
    }

    stopAudio() {
        if (!this.compareSourceType(iLGE_2D_Source_Type_Audio))
            return;
        this.source.pause();
        this.currentTime = 0;
    }

    pauseAudio() {
        if (!this.compareSourceType(iLGE_2D_Source_Type_Audio))
            return;
        this.source.pause();
    }

    resumeAudio() {
        if (!this.compareSourceType(iLGE_2D_Source_Type_Audio))
            return;
        this.source.play();
    }

    playAudio() {
        if (!this.compareSourceType(iLGE_2D_Source_Type_Audio))
            return;
        this.source.currentTime = 0;
        this.source.play();
    }

    setAudioTime(time = 0) {
        this.currentTime = 0;
    }

    cloneIt() {
        let source = new Audio(this.source.src);
        return new iLGE_2D_Source(source, this.#src, this.#type);
    }

    constructor(source, src, type) {
        this.source = source;
        this.#src = src;
        this.#type = type;
    }
}

class iLGE_2D_Object_Font {
    image = 0;
    id = 0;
    type = __iLGE_2D_Object_Font;
    width = 0;
    height = 0;
    map = {};
    constructor(source_object, id, fontwidth, fontheight, fontmap) {
        let image_object = null;
        if (!source_object.compareSourceType(iLGE_2D_Source_Type_Image))
            return;
        image_object = source_object.source;
        this.canvas = document.createElement("canvas");
        this.canvas.style = "background-color: transparent;";
        this.canvas.id = id;
        this.canvas.width = fontwidth;
        this.canvas.height = fontheight;
        this.canvas_context = this.canvas.getContext("2d");
        this.image = image_object;
        this.id = id;
        this.width = fontwidth;
        this.height = fontheight;
        this.map = [];
        for (let i = 0; i < fontmap.length; i++) {
            let char = fontmap.charAt(i);
            this.map[char] = [this.width * i, 0];
        }
    }
}

class iLGE_2D_Vector2 {
    x = 0; y = 0;

    sum(vector) {
        if (!vector)
            return new iLGE_2D_Vector2(this.x, this.y);
        return new iLGE_2D_Vector2(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector) {
        if (!vector)
            return new iLGE_2D_Vector2(this.x, this.y);
        return new iLGE_2D_Vector2(this.x - vector.x, this.y - vector.y);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        let magnitude = this.magnitude();
        if (!magnitude)
            return new iLGE_2D_Vector2(this.x, this.y);
        return new iLGE_2D_Vector2(this.x / magnitude, this.y / magnitude);
    }

    transform(vector_or_number) {
        switch (typeof vector_or_number) {
            case "object":
                return new iLGE_2D_Vector2(
                    vector_or_number.x * this.x - vector_or_number.y * this.y,
                    vector_or_number.y * this.x + vector_or_number.x * this.y
                );
            case "number":
                let cos = Math.cos(vector_or_number),
                    sin = Math.sin(vector_or_number);
                return new iLGE_2D_Vector2(
                    cos * this.x - sin * this.y,
                    sin * this.x + cos * this.y
                );
        }
        return null;
    }

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

class iLGE_2D_Object_Element_Sprite {
    type = iLGE_2D_Object_Element_Type_Sprite;
    visible = true;
    src_x = 0;
    src_y = 0;
    src_width = 0;
    src_height = 0;
    constructor(source_object, id, visible, src_x, src_y, src_width, src_height) {
        let image_object = null;
        if (!source_object.compareSourceType(iLGE_2D_Source_Type_Image))
            return;
        image_object = source_object.source;
        this.id = id;
        this.image = image_object;
        this.visible = visible;
        this.src_x = src_x;
        this.src_y = src_y;
        this.src_width = src_width;
        this.src_height = src_height;
    }
}

class iLGE_2D_Object_Element_Rectangle {
    type = iLGE_2D_Object_Element_Type_Rectangle;
    color = "#000000";
    visible = true;
    constructor(color, id, visible) {
        this.id = id;
        this.color = color;
        this.visible = visible;
    }
}

class iLGE_2D_Object_Element_Text {
    type = iLGE_2D_Object_Element_Type_Text;
    font_id = 0;
    id = 0;
    string = 0;
    px = 0;
    color = "#000000";
    visible = true;
    constructor(font_id, id, string, px, color, visible) {
        this.font_id = font_id;
        this.id = id;
        this.string = string;
        this.px = px;
        this.color = color;
        this.visible = visible;
    }
}

class iLGE_2D_Object_Element_Collider {
    type = iLGE_2D_Object_Element_Type_Collider;
    blocker = false;
    noclip = false;
    collided_objects = [];
    x = 0;
    y = 0;
    width = 0;
    height = 0;

    collidedWithByClass(class_id = "CLASS") {
        for (let collided_object of this.collided_objects) {
            if (collided_object.class_id === class_id)
                return collided_object;
        }
        return null;
    }

    collidedWithById(id = "OBJID") {
        for (let collided_object of this.collided_objects) {
            if (collided_object.id === id)
                return collided_object;
        }
        return null;
    }

    constructor(blocker, noclip, id, x, y, width, height) {
        this.id = id;
        this.blocker = blocker;
        this.noclip = noclip;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

class iLGE_2D_Object_Element_Sprite_Transition_Effect {
    image = new Image();
    type = iLGE_2D_Object_Element_Type_Sprite_Transition_Effect;
    visible = false;
    size = 0;
    src_index = 0;
    oldframe = 0;

    constructor(source_object, visible, size) {
        let image_object = null;
        if (!source_object.compareSourceType(iLGE_2D_Source_Type_Image))
            return;
        image_object = source_object.source;
        this.image = image_object;
        this.visible = visible;
        this.size = size;
    }
}

class iLGE_2D_Object {
    id = "OBJID";

    /* Reserverd For Camera */
    allow_rendering = true;

    x = 0;
    y = 0;
    z_order = 0;
    old_x = 0;
    old_y = 0;
    rotation = 0;
    scale = 0;
    scale_output = 0;
    width = 0;
    height = 0;
    min_speed = 0;
    speed = 0;
    max_speed = 0;
    element = [];
    reset = true;
    start_function = 0;
    update_function = 0;
    radians = 0;
    radians_cos = 0;
    radians_sin = 0;
    vertices = [];

    /**
     * 
     * @param {Array} array 
     * @param {String} id 
     */
    #smartFind(array, id) {
        for (let i = array.length - 1; i >= 0; i--) {
            let array_object = array[i];
            if (array_object.id === id) {
                return array_object;
            }
        }
        return null;
    }

    /**
     * 
     * @param {Array} array 
     * @param {*} object 
     */
    #smartPush(array, object) {
        for (let i = array.length - 1; i >= 0; i--) {
            let array_object = array[i];
            if (object === array_object) {
                return;
            }
        }
        array.push(object);
    }

    /**
     * 
     * @param {Array} array 
     * @param {*} object 
     */
    #smartPop(array, object) {
        for (let i = array.length - 1; i >= 0; i--) {
            let array_object = array[i];
            if (object === array_object) {
                array.splice(i, 1);
                return;
            }
        }
    }

    findElementByType(type) {
        for (let i = this.element.length - 1; i >= 0; i--) {
            let array_object = this.element[i];
            if (array_object.type === type) {
                return array_object;
            }
        }
        return null;
    }

    findElementById(id) {
        return this.#smartFind(this.element, id);
    }

    addElement(object_element) {
        this.#smartPush(this.element, object_element);
    }

    removeElement(id) {
        this.#smartPop(this.element, this.#smartFind(this.element, id));
    }

    getHalfSize(scaled = false) {
        if (scaled)
            return [
                this.scaled_width / 2,
                this.scaled_height / 2,
            ];
        else
            return [
                this.width / 2,
                this.height / 2,
            ];
    }

    getRotationDirection(object = this) {
        let radians = (Math.PI / 180) * object.rotation;
        let x = Math.cos(radians), y = Math.sin(radians);
        return new iLGE_2D_Vector2(x, y);
    }

    prepareForCollision() {
        let halfSize = this.getHalfSize();
        this.radians = (Math.PI / 180) * this.rotation;
        this.radians_cos = Math.cos(this.radians);
        this.radians_sin = Math.sin(this.radians);
        this.vertices = [
            {
                x: halfSize[0] + this.x + halfSize[0] * this.radians_cos - halfSize[1] * this.radians_sin,
                y: halfSize[1] + this.y + halfSize[0] * this.radians_sin + halfSize[1] * this.radians_cos
            },
            {
                x: halfSize[0] + this.x - halfSize[0] * this.radians_cos - halfSize[1] * this.radians_sin,
                y: halfSize[1] + this.y - halfSize[0] * this.radians_sin + halfSize[1] * this.radians_cos
            },
            {
                x: halfSize[0] + this.x - halfSize[0] * this.radians_cos + halfSize[1] * this.radians_sin,
                y: halfSize[1] + this.y - halfSize[0] * this.radians_sin - halfSize[1] * this.radians_cos
            },
            {
                x: halfSize[0] + this.x + halfSize[0] * this.radians_cos + halfSize[1] * this.radians_sin,
                y: halfSize[1] + this.y + halfSize[0] * this.radians_sin - halfSize[1] * this.radians_cos
            }
        ];
    }

    constructor(
        id = "OBJID", class_id = "CLASS", type = iLGE_2D_Object_Type_Custom,
        x = 0, y = 0, rotation = 0, scale = 0,
        width = 0, height = 0, min_speed = 0, max_speed = 0) {
        this.id = id;
        this.class_id = class_id;
        this.type = type;
        this.direction_x = 1;
        this.direction_y = 1;
        this.old_x = x;
        this.old_y = y;
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.scale = scale;
        this.width = width;
        this.height = height;
        this.min_speed = min_speed;
        this.speed = min_speed;
        this.max_speed = max_speed;
    }
}

class iLGE_2D_Engine {
    auto_resize = false;
    width = 0;
    height = 0;

    #control_map_key = "Control_Map";

    /* Game Objects */
    #objects = [];

    /* Hud Objects */
    #objects_hud = [];

    /* Selected Camera */
    #selected_camera = null;

    /* Controls Interrupts Value Array */
    #controls = {};

    #control_map = {};
    #control_map_default = {};
    #source = [];
    #loaded_sources = 0;
    #total_sources = 0;

    deltaTime = 1;
    fps = 0;

    #time_new = 2000;
    #time_old = 1000;
    #time_diff = 1000;

    pointerLock = false;

    #gamepad_toggled_buttons_string = "Gamepad_Toggled_Buttons";
    #gamepads_connected_string = "Gamepads_connected";
    #gamepad_button_string = "_Button_";
    #gamepad_axis_string = "_Axis_";

    /**
     * 
     * @param {Array} array 
     * @param {String} id 
     */
    #smartFind(array, id) {
        for (let i = array.length - 1; i >= 0; i--) {
            let array_object = array[i];
            if (array_object.id === id) {
                return array_object;
            }
        }
        return null;
    }

    /**
     * 
     * @param {Array} array1 
     * @param {Array} array2 
     */
    #smartClean(array1, array2) {
        for (let i = array1.length - 1; i >= 0; i--) {
            if (!this.#smartFind(array2, array1[i].id)) {
                array1.splice(i, 1);
            }
        }
    }

    /**
     * 
     * @param {Array} array 
     * @param {*} object 
     */
    #smartPush(array, object) {
        for (let i = array.length - 1; i >= 0; i--) {
            let array_object = array[i];
            if (object === array_object) {
                return;
            }
        }
        array.push(object);
    }

    /**
     * 
     * @param {Array} array 
     * @param {*} object 
     */
    #smartPop(array, object) {
        for (let i = array.length - 1; i >= 0; i--) {
            let array_object = array[i];
            if (object === array_object) {
                array.splice(i, 1);
                return;
            }
        }
    }

    /**
    * 
    * @param {String} class_id
    * @returns {Number}
    */
    countObjectByClass(class_id) {
        let number = 0;
        for (let array_object of this.#objects) {
            if (array_object.class_id === class_id) {
                number++;
            }
        }
        return number;
    }

    /**
    * 
    * @param {String} class_id
    * @returns {Number}
    */
    countHudObjectByClass(class_id) {
        let number = 0;
        for (let array_object of this.#objects) {
            if (array_object.class_id === class_id) {
                number++;
            }
        }
        return number;
    }

    /**
     * 
     * @param {String} id
     * @returns {iLGE_2D_Object}
     */
    findObject(id) {
        return this.#smartFind(this.#objects, id);
    }

    /**
     * 
     * @param {String} id
     * @returns {iLGE_2D_Object}
     */
    findHudObject(id) {
        return this.#smartFind(this.#objects_hud, id);
    }

    /**
     * 
     * @param {iLGE_2D_Object} object 
     */
    addObject(object) {
        if (typeof object !== "object")
            return;
        this.#smartPush(this.#objects, object);
    }

    /**
     * 
     * @param {iLGE_2D_Object} object 
     */
    addHudObject(object) {
        if (typeof object !== "object")
            return;
        this.#smartPush(this.#objects_hud, object);
    }

    removeObject(id) {
        this.#smartPop(this.#objects, this.#smartFind(this.#objects, id));
        for (let object of this.#objects) {
            if (object.type === iLGE_2D_Object_Type_Custom) {
                for (let element of object.element) {
                    if (element.type === iLGE_2D_Object_Element_Type_Collider) {
                        this.#smartClean(element.collided_objects, this.#objects);
                    }
                }
            }
        }
    }

    removeHudObject(id) {
        this.#smartPop(this.#objects_hud, this.#smartFind(this.#objects_hud, id));
        for (let object of this.#objects_hud) {
            if (object.type === iLGE_2D_Object_Type_Custom) {
                for (let element of object.element) {
                    if (element.type === iLGE_2D_Object_Element_Type_Collider) {
                        this.#smartClean(element.collided_objects, this.#objects_hud);
                    }
                }
            }
        }
    }

    data_add_item(key, variable) {
        if (typeof variable === "object")
            window.localStorage.setItem(this.gameid + "_" + key, JSON.stringify(variable));
        else
            window.localStorage.setItem(this.gameid + "_" + key, variable);
    }

    data_remove_item(key) {
        window.localStorage.removeItem(this.gameid + "_" + key);
    }

    data_read_item(key) {
        let ret;
        try {
            ret = JSON.parse(window.localStorage.getItem(this.gameid + "_" + key));
        } catch (error) {
            ret = window.localStorage.getItem(this.gameid + "_" + key);
            console.error("JSON.parse");
        }
        return ret;
    }

    control_get_gamepads_connected() {
        let ret = this.#controls[this.#gamepads_connected_string];
        return ret ? ret : 0;
    }

    control_map_set(action, control) {
        this.#control_map[action] = control;
    }

    control_map_set_default(action, control) {
        this.#control_map_default[action] = control;
    }

    control_map_get(action, repeat) {
        let control1 = this.#control_map[action],
            control2 = this.#control_map_default[action],
            best_control = 0;
        best_control = control1 ? control1 : control2;

        switch (typeof best_control) {
            case "string":
                let control_value = this.#controls[best_control];
                if (!control_value)
                    break;
                if (!repeat)
                    this.#controls[best_control] = 0;
                return control_value;
            case "object":
                for (let control of best_control) {
                    let control_value = this.#controls[control];
                    if (!control_value)
                        continue;
                    if (!repeat)
                        this.#controls[control] = 0;
                    return control_value;
                }
        }
        return 0;
    }

    control_map_save() {
        if (this.#control_map.length)
            this.data_add_item(this.#control_map_key, this.#control_map);
        else
            this.data_add_item(this.#control_map_key, this.#control_map_default);
    }

    control_map_load() {
        this.#control_map = this.data_read_item(this.#control_map_key);
        if (!this.#control_map)
            this.#control_map = {};
    }

    control_map_restore_default() {
        this.data_add_item(this.#control_map_key, this.#control_map_default);
        this.control_map_load();
    }

    /**
     * 
     * @param {iLGE_2D_Object} object 
     * @param {Number} radians 
     * @returns {Array}
     */
    #calculate_vertices(object, radians) {
        let halfSize = object.getHalfSize();
        let sin = Math.sin(radians), cos = Math.cos(radians);
        return [
            {
                x: halfSize[0] + object.x + halfSize[0] * cos - halfSize[1] * sin,
                y: halfSize[1] + object.y + halfSize[0] * sin + halfSize[1] * cos
            },
            {
                x: halfSize[0] + object.x - halfSize[0] * cos - halfSize[1] * sin,
                y: halfSize[1] + object.y - halfSize[0] * sin + halfSize[1] * cos
            },
            {
                x: halfSize[0] + object.x - halfSize[0] * cos + halfSize[1] * sin,
                y: halfSize[1] + object.y - halfSize[0] * sin - halfSize[1] * cos
            },
            {
                x: halfSize[0] + object.x + halfSize[0] * cos + halfSize[1] * sin,
                y: halfSize[1] + object.y + halfSize[0] * sin - halfSize[1] * cos
            }
        ];
    }

    #getOverlapX(vertices1, vertices2) {
        let minX1 = Math.min(...vertices1.map(vertex => vertex.x));
        let maxX1 = Math.max(...vertices1.map(vertex => vertex.x));
        let minX2 = Math.min(...vertices2.map(vertex => vertex.x));
        let maxX2 = Math.max(...vertices2.map(vertex => vertex.x));
        let overlapX = Math.max(0, Math.min(maxX1, maxX2) - Math.max(minX1, minX2));
        return overlapX;
    }

    #getOverlapY(vertices1, vertices2) {
        let minY1 = Math.min(...vertices1.map(vertex => vertex.y));
        let maxY1 = Math.max(...vertices1.map(vertex => vertex.y));
        let minY2 = Math.min(...vertices2.map(vertex => vertex.y));
        let maxY2 = Math.max(...vertices2.map(vertex => vertex.y));
        let overlapY = Math.max(0, Math.min(maxY1, maxY2) - Math.max(minY1, minY2));
        return overlapY;
    }


    /**
     * 
     * @param {iLGE_2D_Object} object1 
     * @param {iLGE_2D_Object} object2 
     * @returns {Boolean}
     */
    #collision_detection(object1, object2) {
        let cos1 = object1.radians_cos;
        let sin1 = object1.radians_sin;
        let cos2 = object2.radians_cos;
        let sin2 = object2.radians_sin;

        let axes = [
            { x: cos1, y: sin1 },
            { x: -sin1, y: cos1 },
            { x: cos2, y: sin2 },
            { x: -sin2, y: cos2 }
        ];

        for (let i = 0; i < axes.length; i++) {
            let axis = axes[i];
            let min1 = Infinity, max1 = -Infinity;
            let min2 = Infinity, max2 = -Infinity;
            for (let j = 0; j < object1.vertices.length; j++) {
                let dot = object1.vertices[j].x * axis.x + object1.vertices[j].y * axis.y;
                min1 = Math.min(min1, dot);
                max1 = Math.max(max1, dot);
            }
            for (let j = 0; j < object2.vertices.length; j++) {
                let dot = object2.vertices[j].x * axis.x + object2.vertices[j].y * axis.y;
                min2 = Math.min(min2, dot);
                max2 = Math.max(max2, dot);
            }
            if (max1 < min2 || max2 < min1)
                return false;
        }
        return true;
    }

    #find_font(font_id) {
        for (let i = 0; i < this.#objects.length; i++) {
            if (this.#objects[i].id === font_id &&
                this.#objects[i].type === __iLGE_2D_Object_Font) {
                return this.#objects[i];
            }
        }
        return null;
    }

    #drawText(string, canvas_context, max_width, max_height, font_id, x, y, px, color) {
        if (!string || !canvas_context || !font_id)
            return;
        let font_object = this.#find_font(font_id);
        if (!font_object)
            return;
        const font_scale = font_object.height / px;
        const font_width = Math.round(font_object.width / font_scale);
        const font_height = Math.round(font_object.height / font_scale);
        if (y + px > max_height)
            return;
        let font_x_pos = 0;
        let font_y_pos = 0;
        for (let i = 0; i < string.length; i++) {
            let char = string.charAt(i);
            switch (char) {
                case '\n':
                    font_x_pos = 0;
                    font_y_pos += font_height;
                    continue;
                case ' ':
                    font_x_pos += font_width;
                    continue;
            }
            if (x + font_x_pos >= max_width) {
                font_x_pos = 0;
                font_y_pos += font_height;
            }
            if (y + font_y_pos >= max_height)
                break;
            font_object.canvas.width = font_width;
            font_object.canvas.height = font_height;
            font_object.canvas_context.imageSmoothingEnabled = false;
            font_object.canvas_context.drawImage(
                font_object.image,
                font_object.map[char][0], font_object.map[char][1],
                font_object.width, font_object.height,
                0, 0,
                font_width, font_height);
            font_object.canvas_context.globalCompositeOperation = "source-in";
            font_object.canvas_context.fillStyle = color;
            font_object.canvas_context.fillRect(0, 0, font_width, font_height);
            canvas_context.drawImage(
                font_object.canvas,
                0, 0, font_width, font_height,
                x + font_x_pos, y + font_y_pos, font_width, font_height
            );
            font_x_pos += font_width;
        }
    }

    #draw_camera_scene(camera, vcamera, z_order) {
        let z_order_find = false;
        for (let object of this.#objects) {
            if (object.type === iLGE_2D_Object_Type_Custom &&
                object.element.length && object.z_order === z_order) {
                z_order_find = true;
                if (this.#collision_detection(vcamera, object)) {
                    let object_half_size = object.getHalfSize();
                    camera.canvas_context.save();
                    camera.canvas_context.translate(
                        object.x + object_half_size[0],
                        object.y + object_half_size[1]
                    );
                    camera.canvas_context.rotate((Math.PI / 180) * object.rotation);
                    for (let element of object.element) {
                        if (!element.visible)
                            continue;
                        switch (element.type) {
                            case iLGE_2D_Object_Element_Type_Rectangle:
                                camera.canvas_context.fillStyle = element.color;
                                camera.canvas_context.fillRect(
                                    -object_half_size[0],
                                    -object_half_size[1],
                                    object.width,
                                    object.height
                                );
                                break;
                            case iLGE_2D_Object_Element_Type_Sprite:
                                camera.canvas_context.drawImage(
                                    element.image,
                                    element.src_x, element.src_y,
                                    element.src_width, element.src_height,
                                    -object_half_size[0],
                                    -object_half_size[1],
                                    object.width,
                                    object.height
                                );
                                break;
                            case iLGE_2D_Object_Element_Type_Text:
                                this.#drawText(
                                    element.string, camera.canvas_context,
                                    object_half_size[0],
                                    object_half_size[1],
                                    element.font_id,
                                    -object_half_size[0],
                                    -object_half_size[1],
                                    element.px, element.color
                                );
                                break;
                        }
                    }
                    camera.canvas_context.restore();
                }
            }
        }
        return z_order_find;
    }

    #getZOrderInfo(array) {
        let min = Infinity, max = -Infinity;
        for (let object of array) {
            switch (object.type) {
                case iLGE_2D_Object_Type_Custom:
                case iLGE_2D_Object_Type_Camera:
                    if (object.z_order > max)
                        max = object.z_order;
                    if (object.z_order < min)
                        min = object.z_order;
                    break;
            }
        }
        return {
            min: min,
            max: max,
        };
    }

    /**
    * @param camera {iLGE_2D_Object}
    */
    #draw_camera(camera, x, y, width, height) {
        if (camera.type !== iLGE_2D_Object_Type_Camera && camera.allow_rendering)
            return;
        if (!camera.canvas) {
            camera.canvas = document.createElement("canvas");
            camera.canvas.id = camera.id;
            camera.canvas_context = camera.canvas.getContext("2d");
            camera.canvas_context.imageSmoothingEnabled = false;
        }
        let scale = Math.min(
            this.canvas.width / camera.scale,
            this.canvas.height / camera.scale
        );
        camera.width = this.canvas.width / scale;
        camera.height = this.canvas.height / scale;
        camera.canvas.width = Math.round(camera.width);
        camera.canvas.height = Math.round(camera.height);
        for (let element of camera.element) {
            if (!element.visible)
                continue;
            switch (element.type) {
                case iLGE_2D_Object_Element_Type_Rectangle:
                    camera.canvas_context.fillStyle = element.color;
                    camera.canvas_context.fillRect(
                        0, 0,
                        camera.width, camera.height
                    );
                    break;
                case iLGE_2D_Object_Element_Type_Sprite:
                    camera.canvas_context.drawImage(
                        element.image,
                        element.src_x, element.src_y,
                        element.src_width, element.src_height,
                        0, 0,
                        camera.width, camera.height
                    );
                    break;
            }
        }
        let vcamera = new iLGE_2D_Object(
            null, null, iLGE_2D_Object_Type_Camera,
            camera.x, camera.y,
            camera.rotation, camera.scale, camera.width, camera.height
        );
        if (this.occlusion_culling_test) {
            vcamera.width /= 2;
            vcamera.height /= 2;
            vcamera.x += (camera.width / 2) / 2;
            vcamera.y += (camera.height / 2) / 2;
        }
        vcamera.prepareForCollision();
        let halfSize = camera.getHalfSize();
        camera.canvas_context.save();
        camera.canvas_context.translate(
            halfSize[0],
            halfSize[1]
        );
        camera.canvas_context.rotate(-camera.rotation * (Math.PI / 180));
        camera.canvas_context.translate(
            -camera.x - halfSize[0],
            -camera.y - halfSize[1]
        );
        let z_order_info = this.#getZOrderInfo(this.#objects);
        for (let z_order = z_order_info.min; z_order <= z_order_info.max; z_order++) {
            this.#draw_camera_scene(camera, vcamera, z_order);
        }
        camera.canvas_context.restore();
        if (this.debug) {
            camera.canvas_context.strokeStyle = "#000000";
            camera.canvas_context.strokeRect(
                vcamera.x - camera.x, vcamera.y - camera.y,
                vcamera.width, vcamera.height
            );
        }
        this.canvas_context.drawImage(
            camera.canvas,
            Math.round(x), Math.round(y),
            Math.round(width), Math.round(height)
        );
    }

    #applyTransitionEffect(
        newframe, oldframe, dx, dy, dwidth, dheight,
        effect_spritesheet, effect_size, effect_sprite_index
    ) {
        if (!newframe || !effect_spritesheet || !effect_size)
            return null;
        if (!effect_spritesheet.canvas) {
            effect_spritesheet.canvas = document.createElement("canvas");
            effect_spritesheet.canvas_context = effect_spritesheet.canvas.getContext("2d");
            effect_spritesheet.max_index = effect_spritesheet.width / effect_size;
        }
        effect_size = Math.floor(effect_size);
        effect_sprite_index = Math.floor(effect_sprite_index);
        if (effect_sprite_index >= effect_spritesheet.max_index)
            effect_sprite_index = effect_spritesheet.max_index - 1;
        else if (effect_sprite_index <= 0)
            effect_sprite_index = 0;
        effect_spritesheet.canvas_context.drawImage(
            effect_spritesheet,
            effect_size * effect_sprite_index, 0,
            effect_size, effect_size,
            0, 0, effect_size, effect_size
        );
        effect_spritesheet.width = effect_size;
        effect_spritesheet.height = effect_size;
        let effect_spritesheet_data = effect_spritesheet.canvas_context.getImageData(
            0, 0,
            effect_size, effect_size
        ).data;
        let effect_frame = new ImageData(dwidth, dheight);
        let is_different = newframe !== oldframe && oldframe ? true : false;
        let precalc_pos = [];
        let _x = 0, _y = 0;
        for (let y = 0; y < dheight; y++) {
            if (_y > effect_size)
                _y = 0;
            precalc_pos[y] = [];
            for (let x = 0; x < dwidth; x++) {
                if (_x > effect_size)
                    _x = 0;
                precalc_pos[y][x] = (_y * effect_size + _x) * 4;
                _x++;
            }
            _y++;
        }
        for (let y = 0; y < dheight; y++) {
            let effect_frame_index = y * effect_frame.width * 4;
            let frame_index = ((y + dy) * newframe.width + dx) * 4;
            for (let x = 0; x < dwidth; x++) {
                let effect_spritesheet_data_index = precalc_pos[y][x];
                if (effect_spritesheet_data[effect_spritesheet_data_index + 0] +
                    effect_spritesheet_data[effect_spritesheet_data_index + 1] +
                    effect_spritesheet_data[effect_spritesheet_data_index + 2] > 0) {
                    for (let i = 3; i >= 0; i--)
                        effect_frame.data[effect_frame_index + i] = newframe.data[frame_index + i];
                }
                else if (is_different) {
                    for (let i = 3; i >= 0; i--)
                        effect_frame.data[effect_frame_index + i] = oldframe.data[frame_index + i];
                }
                frame_index += 4;
                effect_frame_index += 4;
            }
        }
        return effect_frame;
    }

    #draw_hud(z_order) {
        let z_order_find = false;
        for (let object of this.#objects_hud) {
            if (object.type === iLGE_2D_Object_Type_Custom &&
                object.element.length && object.z_order === z_order) {
                z_order_find = true;
                if (object.scale < 1)
                    object.scale = this.canvas.width;
                let object_scale = Math.min(
                    this.canvas.width / object.scale,
                    this.canvas.height / object.scale
                );
                let object_width = object.width * object_scale,
                    object_height = object.height * object_scale;
                object.scale_output = object_scale;
                let object_half_size = [object_width / 2, object_height / 2];
                this.canvas_context.save();
                this.canvas_context.translate(
                    object.x + object_half_size[0],
                    object.y + object_half_size[1]
                );
                this.canvas_context.rotate((Math.PI / 180) * object.rotation);
                for (let element of object.element) {
                    if (!element.visible)
                        continue;
                    switch (element.type) {
                        case iLGE_2D_Object_Element_Type_Rectangle:
                            this.canvas_context.fillStyle = element.color;
                            this.canvas_context.fillRect(
                                -object_half_size[0],
                                -object_half_size[1],
                                object_width,
                                object_height
                            );
                            break;
                        case iLGE_2D_Object_Element_Type_Sprite:
                            this.canvas_context.drawImage(
                                element.image,
                                element.src_x, element.src_y,
                                element.src_width, element.src_height,
                                -object_half_size[0],
                                -object_half_size[1],
                                object_width,
                                object_height
                            );
                            break;
                        case iLGE_2D_Object_Element_Type_Text:
                            this.#drawText(
                                element.string, this.canvas_context,
                                object_half_size[0],
                                object_half_size[1],
                                element.font_id,
                                -object_half_size[0],
                                -object_half_size[1],
                                element.px * object_scale, element.color
                            );
                            break;
                    }
                }
                this.canvas_context.restore();
            }
        }
        return z_order_find;
    }

    #draw() {
        if (this.#selected_camera) {
            if (this.#selected_camera.scale < 1)
                this.#selected_camera.scale = this.canvas.width;
            this.#draw_camera(
                this.#selected_camera,
                0, 0,
                this.canvas.width, this.canvas.height
            );
        }
        let z_order_info = this.#getZOrderInfo(this.#objects_hud);
        for (let z_order = z_order_info.min; z_order <= z_order_info.max; z_order++) {
            this.#draw_hud(z_order);
        }
        for (let object of this.#objects_hud) {
            if (object.type === iLGE_2D_Object_Type_Custom && object.element.length) {
                this.canvas_context.save();
                for (let element of object.element) {
                    if (!element.visible)
                        continue;
                    switch (element.type) {
                        case iLGE_2D_Object_Element_Type_Sprite_Transition_Effect:
                            let finalframe = this.#applyTransitionEffect(
                                this.getFrameData(), element.oldframe,
                                object.x, object.y,
                                object.width, object.height,
                                element.image, element.size, element.src_index);
                            this.canvas_context.putImageData(finalframe, object.x, object.y);
                            break;
                    }
                }
                this.canvas_context.restore();
            }
        }
    }

    #check_collisions(
        objects_with_collider_element,
        blocker_objects_with_collider_element
    ) {
        for (let object1 of objects_with_collider_element) {
            for (let element1 of object1.element) {
                if (element1.type === iLGE_2D_Object_Element_Type_Collider) {
                    let tmp_object1 = new iLGE_2D_Object(
                        null, null, iLGE_2D_Object_Type_Custom,
                        object1.x + element1.x, object1.y + element1.y,
                        object1.rotation, object1.scale,
                        element1.width, element1.height,
                    );
                    tmp_object1.prepareForCollision();
                    for (let object2 of blocker_objects_with_collider_element) {
                        if (object1 === object2)
                            continue;
                        for (let element2 of object2.element) {
                            if (element2.type === iLGE_2D_Object_Element_Type_Collider) {
                                let tmp_object2 = new iLGE_2D_Object(
                                    null, null, iLGE_2D_Object_Type_Custom,
                                    object2.x + element2.x, object2.y + element2.y,
                                    object2.rotation, object2.scale,
                                    element2.width, element2.height,
                                );
                                tmp_object2.prepareForCollision();
                                if (this.#collision_detection(tmp_object1, tmp_object2)) {
                                    if (!element1.blocker && !element1.noclip && element2.blocker) {
                                        object1.x = object1.old_x;
                                        object1.y = object1.old_y;
                                        let overlapX = this.#getOverlapX(
                                            tmp_object1.vertices,
                                            tmp_object2.vertices
                                        );
                                        let overlapY = this.#getOverlapY(
                                            tmp_object1.vertices,
                                            tmp_object2.vertices
                                        );
                                        if (overlapX < overlapY) {
                                            let directionX = (tmp_object1.x < tmp_object2.x) ? -1 : 1;
                                            object1.x += overlapX * directionX;
                                        } else {
                                            let directionY = (tmp_object1.y < tmp_object2.y) ? -1 : 1;
                                            object1.y += overlapY * directionY;
                                        }
                                        object1.new_x = object1.x;
                                        object1.new_y = object1.y;
                                    }
                                    this.#smartPush(element1.collided_objects, object2);
                                    this.#smartPush(element2.collided_objects, object1);
                                }
                                else {
                                    this.#smartPop(element1.collided_objects, object2);
                                    this.#smartPop(element2.collided_objects, object1);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    start() {
        if (!this.pointerLock) {
            document.exitPointerLock();
            this.canvas.style = "cursor: auto;";
        }
        else {
            this.canvas.style = "cursor: none;";
        }
        if (this.#loaded_sources < this.#total_sources) {
            window.requestAnimationFrame(this.start);
            return;
        }
        this.#time_old = (new Date()).getTime();
        this.#gamepad_handler(null, this, null);
        let objects_with_collider_element = [];
        let blocker_objects_with_collider_element = [];
        for (let object of this.#objects) {
            object.old_x = object.x;
            object.old_y = object.y;
            if (object.start_function && object.reset) {
                object.start_function(this);
                object.reset = false;
            }
            if (object.update_function)
                object.update_function(this);
        }
        for (let object of this.#objects) {
            switch (object.type) {
                case iLGE_2D_Object_Type_Custom:
                    for (let element of object.element) {
                        if (element.type === iLGE_2D_Object_Element_Type_Collider) {
                            if (element.blocker)
                                this.#smartPush(blocker_objects_with_collider_element, object);
                            else
                                this.#smartPush(objects_with_collider_element, object);
                            break;
                        }
                    }
                    object.prepareForCollision();
                    break;
            }
        }
        this.#check_collisions(
            objects_with_collider_element,
            blocker_objects_with_collider_element
        );
        this.#draw();
        this.#time_new = (new Date()).getTime();
        this.#time_diff = this.#time_new - this.#time_old;
        this.deltaTime = this.#time_diff / (1000 / 60);
        this.fps = Math.round(1000 / (this.#time_diff ? this.#time_diff : 1));
        window.requestAnimationFrame(this.start);
    }

    setDefaultCamera(camera) {
        if (camera.type !== iLGE_2D_Object_Type_Camera)
            return;
        this.#selected_camera = camera;
    }

    /**
     * 
     * @param {Event} event 
     * @param {this} isThis 
     */
    #resize_handler(event, isThis) {
        if (!isThis.auto_resize)
            return;
        isThis.width = window.innerWidth * window.devicePixelRatio;
        isThis.height = window.innerHeight * window.devicePixelRatio;
        console.log(`width: ${isThis.width}, height: ${isThis.height};`);
        isThis.canvas.width = isThis.width;
        isThis.canvas.height = isThis.height;
        isThis.canvas_context.imageSmoothingEnabled = false;
    }

    /**
     * 
     * @param {MouseEvent} event 
     * @param {this} isThis 
     * @param {String} type 
     */
    #mouse_handler(event, isThis, type) {
        const mouse_clientX_string = "Mouse_ClientX";
        const mouse_clientY_string = "Mouse_ClientY";
        const mouse_movementX_string = "Mouse_MovementX";
        const mouse_movementY_string = "Mouse_MovementY";
        const mouse_button_toggled_string = "Mouse_Button_Toggled";
        if (!isThis.#controls[mouse_button_toggled_string])
            isThis.#controls[mouse_button_toggled_string] = [];
        switch (type) {
            case "Movement":
                let movementX = event.movementX,
                    movementY = event.movementY;
                let clientX = event.clientX,
                    clientY = event.clientY;
                isThis.#controls[mouse_clientX_string + "_Positive"] = clientX;
                isThis.#controls[mouse_clientY_string + "_Positive"] = clientY;
                isThis.#controls[mouse_clientX_string + "_Negative"] = -clientX;
                isThis.#controls[mouse_clientY_string + "_Negative"] = -clientY;
                isThis.#controls[mouse_movementX_string + "_Positive"] = movementX;
                isThis.#controls[mouse_movementY_string + "_Positive"] = movementY;
                isThis.#controls[mouse_movementX_string + "_Negative"] = -movementX;
                isThis.#controls[mouse_movementY_string + "_Negative"] = -movementY;
                break;
            case "ContextMenu":
                event.preventDefault();
                break;
            case "ButtonDown":
                if (isThis.pointerLock)
                    isThis.canvas.requestPointerLock({
                        unadjustedMovement: true,
                    });
                if (!isThis.#controls[mouse_button_toggled_string][event.button]) {
                    isThis.#controls["Mouse_Button_" + event.button + "_Toggle"] =
                        isThis.#controls["Mouse_Button_" + event.button + "_Toggle"] ? false : true;
                    isThis.#controls[mouse_button_toggled_string][event.button] = true;
                }
                isThis.#controls["Mouse_Button_" + event.button] = true;
                break;
            case "ButtonUp":
                if (isThis.pointerLock)
                    isThis.canvas.requestPointerLock({
                        unadjustedMovement: true,
                    });
                isThis.#controls["Mouse_Button_" + event.button] = false;
                isThis.#controls[mouse_button_toggled_string][event.button] = false;
                break;
        }
    }

    /**
     * 
     * @param {KeyboardEvent} event 
     * @param {this} isThis 
     * @param {Boolean} bool 
     */
    #keyboard_handler(event, isThis, bool) {
        const keyborad_code_tag = "Keyboard_Code";
        const keyborad_keycode_tag = "Keyboard_Keycode";
        const keyborad_which_tag = "Keyboard_Which";
        const keyborad_key_tag = "Keyboard_Key";
        const keyboard_code_key = keyborad_code_tag + "_" + event.code;
        const keyboard_keycode_key = keyborad_keycode_tag + "_" + event.code;
        const keyboard_which_key = keyborad_which_tag + "_" + event.code;
        const keyboard_key_key = keyborad_key_tag + "_" + event.code;
        if (!isThis.#controls[keyborad_code_tag + "_Toggled"])
            isThis.#controls[keyborad_code_tag + "_Toggled"] = [];
        if (!isThis.#controls[keyborad_keycode_tag + "_Toggled"])
            isThis.#controls[keyborad_keycode_tag + "_Toggled"] = [];
        if (!isThis.#controls[keyborad_which_tag + "_Toggled"])
            isThis.#controls[keyborad_which_tag + "_Toggled"] = [];
        if (!isThis.#controls[keyborad_key_tag + "_Toggled"])
            isThis.#controls[keyborad_key_tag + "_Toggled"] = [];
        if (bool) {
            if (!isThis.#controls[keyborad_code_tag + "_Toggled"][keyboard_code_key]) {
                isThis.#controls[keyboard_code_key + "_Toggle"] =
                    isThis.#controls[keyboard_code_key + "_Toggle"] ? false : true;
                isThis.#controls[keyborad_code_tag + "_Toggled"][keyboard_code_key] = true;
            }
            if (!isThis.#controls[keyborad_keycode_tag + "_Toggled"][keyboard_keycode_key]) {
                isThis.#controls[keyboard_keycode_key + "_Toggle"] =
                    isThis.#controls[keyboard_keycode_key + "_Toggle"] ? false : true;
                isThis.#controls[keyborad_keycode_tag + "_Toggled"][keyboard_keycode_key] = true;
            }
            if (!isThis.#controls[keyborad_which_tag + "_Toggled"][keyboard_which_key]) {
                isThis.#controls[keyboard_which_key + "_Toggle"] =
                    isThis.#controls[keyboard_which_key + "_Toggle"] ? false : true;
                isThis.#controls[keyborad_which_tag + "_Toggled"][keyboard_which_key] = true;
            }
            if (!isThis.#controls[keyborad_key_tag + "_Toggled"][keyboard_key_key]) {
                isThis.#controls[keyboard_key_key + "_Toggle"] =
                    isThis.#controls[keyboard_key_key + "_Toggle"] ? false : true;
                isThis.#controls[keyborad_key_tag + "_Toggled"][keyboard_key_key] = true;
            }
        }
        else {
            isThis.#controls[keyborad_code_tag + "_Toggled"][keyboard_code_key] = false;
            isThis.#controls[keyborad_keycode_tag + "_Toggled"][keyboard_keycode_key] = false;
            isThis.#controls[keyborad_which_tag + "_Toggled"][keyboard_which_key] = false;
            isThis.#controls[keyborad_key_tag + "_Toggled"][keyboard_key_key] = false;
        }
        isThis.#controls[keyboard_code_key] = bool;
        isThis.#controls[keyboard_keycode_key] = bool;
        isThis.#controls[keyboard_which_key] = bool;
        isThis.#controls[keyboard_key_key] = bool;
    }

    /**
     * 
     * @param {GamepadEvent} event 
     * @param {this} isThis 
     * @param {String} type 
     */
    #gamepad_handler(event, isThis, type) {
        if (!isThis.gamepad_supported)
            return;
        if (!isThis.#controls[isThis.#gamepad_toggled_buttons_string])
            isThis.#controls[isThis.#gamepad_toggled_buttons_string] = [];
        switch (type) {
            default:
                let gamepads = navigator.getGamepads();
                let gamepads_connected = gamepads.length;
                isThis.#controls[isThis.#gamepads_connected_string] = gamepads_connected;
                for (let n = 0; n < gamepads_connected; n++) {
                    let gamepad = gamepads[n];
                    let gamepad_string = "Gamepad" + n;
                    if (!isThis.#controls[isThis.#gamepad_toggled_buttons_string][n])
                        isThis.#controls[isThis.#gamepad_toggled_buttons_string][n] = [];
                    let gamepad_toggled_buttons = isThis.#controls[isThis.#gamepad_toggled_buttons_string][n];
                    if (gamepad) {
                        for (let i = 0; i < gamepad.buttons.length; i++) {
                            let button_string = gamepad_string + isThis.#gamepad_button_string + i;
                            let button_toggle_string = button_string + "_Toggle";
                            let is_button_pressed = gamepad.buttons[i].pressed;
                            isThis.#controls[button_string] = is_button_pressed;
                            if (is_button_pressed) {
                                if (!gamepad_toggled_buttons[i]) {
                                    isThis.#controls[button_toggle_string] =
                                        isThis.#controls[button_toggle_string] ? false : true;
                                    gamepad_toggled_buttons[i] = true;
                                }
                            }
                            else {
                                gamepad_toggled_buttons[i] = false;
                            }
                        }
                        for (let i = 0; i < gamepad.axes.length; i++) {
                            let axis = gamepad.axes[i];
                            let axis_string = gamepad_string + isThis.#gamepad_axis_string + i;
                            let deadzone_string =
                                isThis.#control_map_key + "_" + gamepad_string +
                                isThis.#gamepad_axis_string + i + "_Deadzone";
                            let deadzone = isThis.data_read_item(deadzone_string);
                            if (!deadzone) {
                                isThis.data_add_item(deadzone_string, String(0.5));
                                deadzone = Number(isThis.data_read_item(deadzone_string));
                                console.warn(deadzone_string + " is null");
                            }
                            if (Math.abs(axis) < deadzone)
                                axis = 0;
                            isThis.#controls[axis_string + "_Positive"] = axis;
                            isThis.#controls[axis_string + "_Negative"] = -axis;
                        }
                    }
                }
                break;
        }
    }

    getFrameData() {
        return this.canvas_context.getImageData(0, 0, this.width, this.height);
    }

    /**
     * 
     * @param {String} src 
     * @returns {iLGE_2D_Source}
     */
    getSourceObject(src) {
        for (let i = 0; i < this.#source.length; i++) {
            if (this.#source[i].compareSrc(src)) {
                return this.#source[i];
            }
        }
        return null;
    }

    #getSourceFormat(src) {
        if (!src)
            return null;
        let start_at = 0,
            end_at = src.length;
        for (let i = src.length; i >= 0; i--) {
            let char = src.charAt(i);
            if (char === ".") {
                start_at = i;
                break;
            }
        }
        return src.slice(start_at, end_at);
    }

    constructor(gameid, source_files, html_div, width, height, auto_resize) {
        let isThis = this;
        this.gameid = gameid;
        isThis.#total_sources = source_files.length;
        for (let i = 0; i < source_files.length; i++) {
            let source_url = source_files[i];
            let source_format = isThis.#getSourceFormat(source_url);
            let source = null;
            let xhr = new XMLHttpRequest();
            let source_object;
            xhr.open("GET", source_url);
            xhr.responseType = "arraybuffer";
            switch (source_format) {
                case ".jpeg":
                case ".jpg":
                case ".png":
                    source = new Image();
                    source_object = new iLGE_2D_Source(source, source_url, iLGE_2D_Source_Type_Image);
                    xhr.onload = function () {
                        if (xhr.status !== 200) {
                            return;
                        }
                        let imageData = xhr.response;
                        source_object.source_data = imageData;
                        source.onload = function () {
                            isThis.#loaded_sources++;
                        };
                        source.src = URL.createObjectURL(
                            new Blob([imageData, { type: "image/mpeg" }])
                        );
                    };
                    xhr.send();
                    this.#source.push(source_object);
                    break;
                case ".wav":
                case ".mp3":
                case ".ogg":
                    source = new Audio();
                    source_object = new iLGE_2D_Source(source, source_url, iLGE_2D_Source_Type_Audio);
                    xhr.onload = function () {
                        if (xhr.status !== 200) {
                            return;
                        }
                        let audioData = xhr.response;
                        source_object.source_data = audioData;
                        source.src = URL.createObjectURL(
                            new Blob([audioData, { type: "audio/mpeg" }])
                        );
                        isThis.#loaded_sources++;
                    };
                    xhr.send();
                    this.#source.push(source_object);
                    break;
            }
        }
        this.start = this.start.bind(isThis);
        this.canvas = document.createElement("canvas");
        this.canvas_context = this.canvas.getContext("2d");
        this.canvas.width = width;
        this.canvas.height = height;
        if (auto_resize)
            this.auto_resize = auto_resize;
        if (this.auto_resize) {
            this.canvas.width = window.innerWidth * window.devicePixelRatio;
            this.canvas.height = window.innerHeight * window.devicePixelRatio;
        }
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.canvas_context.imageSmoothingEnabled = false;
        if ("getGamepads" in navigator) {
            this.gamepad_supported = true;
            window.addEventListener("gamepadconnected", function (event) {
                isThis.#gamepad_handler(event, isThis, "connected");
            }, true);
            window.addEventListener("gamepaddisconnected", function (event) {
                isThis.#gamepad_handler(event, isThis, "disconnected");
            }, true);
        }
        window.addEventListener("resize",
            function (event) {
                isThis.#resize_handler(event, isThis);
            }, true);
        this.canvas.addEventListener("mousemove",
            function (event) {
                isThis.#mouse_handler(event, isThis, "Movement");
            }, true);
        this.canvas.addEventListener("mousedown",
            function (event) {
                isThis.#mouse_handler(event, isThis, "ButtonDown");
            }, true);
        this.canvas.addEventListener("mouseup",
            function (event) {
                isThis.#mouse_handler(event, isThis, "ButtonUp");
            }, true);
        this.canvas.addEventListener("contextmenu",
            function (event) {
                isThis.#mouse_handler(event, isThis, "ContextMenu");
            }, true);
        window.addEventListener("keydown",
            function (event) {
                isThis.#keyboard_handler(event, isThis, true);
            }, true);
        window.addEventListener("keyup",
            function (event) {
                isThis.#keyboard_handler(event, isThis, false);
            }, true);
        html_div.appendChild(this.canvas);
    };
}