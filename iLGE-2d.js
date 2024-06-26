// Copyright (C) 2024 Daniel Victor
//
// This program is distributed under the terms of the GNU General Public License, Version 3
// (or any later version) published by the Free Software Foundation.
// You can obtain a copy of the license at https://www.gnu.org/licenses/gpl-3.0.en.html.

const iLGE_2D_Object_Element_Type_Sprite = "Sprite";
const iLGE_2D_Object_Element_Type_Rectangle = "Rectangle";
const iLGE_2D_Object_Element_Type_Collider = "Collider";
const iLGE_2D_Object_Element_Type_Text = "Text";
const iLGE_2D_Object_Element_Type_Camera_Viewer = "Camera_Viewer";
const iLGE_2D_Object_Element_Type_Sprite_Transition_Effect = "Sprite_Transition_Effect";
const iLGE_2D_Object_Type_Font = "Font";
const iLGE_2D_Object_Type_Camera = "Camera";
const iLGE_2D_Object_Type_Custom = "Custom";
const iLGE_2D_Object_Type_Scene = "Scene";
const iLGE_2D_Source_Type_Image = "Image_Source";
const iLGE_2D_Source_Type_Audio = "Audio_Source";
const iLGE_2D_Source_Type_RAW = "RAW_Source";

class iLGE_2D_Vector2 {
    x = 0; y = 0;

    cloneIt() {
        return new iLGE_2D_Vector2(this.x, this.y);
    }

    sum(vector) {
        if (typeof vector === "number")
            vector = new iLGE_2D_Vector2(vector, vector);
        if (!vector)
            return this;
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    subtract(vector) {
        if (typeof vector === "number")
            vector = new iLGE_2D_Vector2(vector, vector);
        if (!vector)
            return this;
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    multiply(vector) {
        if (typeof vector === "number")
            vector = new iLGE_2D_Vector2(vector, vector);
        if (!vector)
            return this;
        this.x *= vector.x;
        this.y *= vector.y;
        return this;
    }

    divide(vector) {
        if (typeof vector === "number")
            vector = new iLGE_2D_Vector2(vector, vector);
        if (!vector)
            return this;
        this.x = vector.x !== 0 ? (this.x / vector.x) : 0;
        this.y = vector.y !== 0 ? (this.y / vector.y) : 0;
        return this;
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        let magnitude = this.magnitude();
        if (!magnitude)
            return this;
        this.x /= magnitude;
        this.y /= magnitude;
        return this;
    }

    transform(vector) {
        if (!vector)
            return this;
        const newX = vector.x * this.x - vector.y * this.y;
        const newY = vector.y * this.x + vector.x * this.y;
        this.x = newX;
        this.y = newY;
        return this;
    }

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

class iLGE_2D_Source {
    source = 0;
    source_data = [];
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
        this.source.currentTime = 0;
    }

    pauseAudio() {
        if (!this.compareSourceType(iLGE_2D_Source_Type_Audio))
            return;
        this.source.pause();
    }

    createAudioBufferSource() {
        if (!this.compareSourceType(iLGE_2D_Source_Type_Audio))
            return null;
        const source = this.source.createBufferSource();
        source.buffer = this.source.Abuffer;

        source.analyser = this.source.createAnalyser();
        source.analyser.fftSize = 256;
        source.analyser.connect(this.source.destination);

        source.volume = this.source.createGain();
        source.volume.gain.value = 1;
        source.volume.connect(source.analyser);

        source.connect(source.volume);
        return source;
    }

    playAudio(source) {
        if (!this.compareSourceType(iLGE_2D_Source_Type_Audio) || !source)
            return null;
        source.start();
    }

    setAudioTime(source, time = 0) {
        if (!this.compareSourceType(iLGE_2D_Source_Type_Audio) || !source)
            return;
        source.currentTime = time;
    }

    setAudioVolume(source, volume = 1) {
        if (!this.compareSourceType(iLGE_2D_Source_Type_Audio) || !source)
            return;
        source.volume.gain.value = volume;
    }

    getAudioVolumeAverage(source) {
        if (!this.compareSourceType(iLGE_2D_Source_Type_Audio) || !source)
            return;
        const dataArray = new Uint8Array(source.analyser.frequencyBinCount);

        let sum = 0;
        for (const amplitude of dataArray) {
            sum += Math.abs(amplitude - 128);
        }

        const average = sum / dataArray.length;
        const normalizedVolume = average / 128;
        return normalizedVolume;
    }

    cloneIt() {
        let source = new iLGE_2D_Source(null, this.#src, this.#type);
        switch (this.#type) {
            case iLGE_2D_Source_Type_Audio:
                console.error("[iLGE-2d] Cannot clone AudioContext!");
                source = null;
                break;
            case iLGE_2D_Source_Type_Image:
                source.source = new Image();
                source.source.src = this.source.src;
                break;
        }
        if (this.source_data && source) {
            let arraybuffer = new ArrayBuffer(this.source_data.length);
            for (let i = 0; i < arraybuffer.length; i++)
                arraybuffer[i] = this.source_data[i];
            source.source_data = arraybuffer;
        }
        return source;
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
    type = iLGE_2D_Object_Type_Font;
    width_array = [];
    width = 0;
    height = 0;
    map = [];

    /**
    * 
    * @param {String} string 
    * @param {Number} px 
    * @param {Number} max_width
    * @param {Number} max_height
    * @returns {Object} size - { width: Number, height: Number }
    */
    getStringSize(string, px, max_width, max_height) {
        let size = { width: 0, height: 0 };
        if (!string || !this.width_array.length)
            return size;

        const font_scale = this.height / px;
        const font_height = this.height / font_scale;
        let current_line_width = 0;
        let total_height = font_height;

        for (let i = 0; i < string.length; i++) {
            const char = string.charAt(i);
            const char_width = this.width_array[char] / font_scale;

            if (char === '\n') {
                size.width = Math.max(size.width, current_line_width);
                current_line_width = 0;
                total_height += font_height;
                if (total_height > max_height) {
                    break;
                }
                continue;
            }

            if (current_line_width + char_width > max_width) {
                size.width = Math.max(size.width, current_line_width);
                current_line_width = char_width;
                total_height += font_height;
                if (total_height > max_height) {
                    break;
                }
            } else {
                current_line_width += char_width;
            }
        }

        size.width = Math.max(size.width, current_line_width);
        size.height = total_height;

        return size;
    }

    constructor(source_object, id, fontwidth, fontheight, fontmap) {
        let image_object = null;
        if (!source_object.compareSourceType(iLGE_2D_Source_Type_Image))
            return;
        image_object = source_object.source;
        this.canvas = new OffscreenCanvas(1, 1);
        this.canvas_context = this.canvas.getContext("2d");
        this.image = image_object;
        this.id = id;
        switch (typeof fontwidth) {
            case "object":
                for (let i = 0; i < fontmap.length; i++) {
                    let char = fontmap.charAt(i);
                    this.width_array[char] = fontwidth[i];
                }
                break;
            case "number":
                for (let i = 0; i < fontmap.length; i++) {
                    let char = fontmap.charAt(i);
                    this.width_array[char] = fontwidth;
                }
                break;
        }
        this.height = fontheight;
        let offset_x = 0;
        for (let i = 0; i < fontmap.length; i++) {
            let char = fontmap.charAt(i);
            this.map[char] = [offset_x, 0];
            offset_x += this.width_array[char];
        }
    }
}

class iLGE_2D_Object_Element_Sprite {
    image = 0;
    type = iLGE_2D_Object_Element_Type_Sprite;
    id = "OBJID";
    visible = true;
    src_x = 0;
    src_y = 0;
    src_width = 0;
    src_height = 0;
    constructor(source_object, id, visible, src_x, src_y, src_width, src_height) {
        let image_object = null;
        if (!source_object || !source_object.compareSourceType(iLGE_2D_Source_Type_Image))
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
    id = "OBJID";
    visible = true;
    constructor(color, id, visible) {
        this.id = id;
        this.color = color;
        this.visible = visible;
    }
}

class iLGE_2D_Object_Element_Text {
    type = iLGE_2D_Object_Element_Type_Text;
    font_id = "FONTID";
    id = "OBJID";
    string = 0;
    px = 0;
    color = "#000000";
    visible = true;
    styled_text = false;
    alignment_center = { vertical: false, horizontal: false };
    constructor(font_id, id, string, px, color, visible) {
        this.font_id = font_id;
        this.id = id;
        this.string = string;
        this.px = px;
        this.color = color;
        this.visible = visible;
    }
}

class iLGE_2D_Object_Element_Camera_Viewer {
    type = iLGE_2D_Object_Element_Type_Camera_Viewer;
    id = "OBJID";
    camera = 0;
    visible = true;
    constructor(camera, id, visible) {
        this.id = id;
        this.camera = camera;
        this.visible = visible;
    }
}

class iLGE_2D_Object_Element_Collider {
    type = iLGE_2D_Object_Element_Type_Collider;
    blocker = false;
    noclip = false;
    id = "OBJID";
    collided_objects = [];
    incorporeal_objects = [];
    x = 0;
    y = 0;
    width = 0;
    height = 0;

    /**
     * 
     * @param {Array} array 
     * @returns {Array}
     */
    #clone_array(array) {
        let copy = [];
        for (let i = 0; i < array.length; i++)
            copy[i] = Object.assign({}, array[i]);
        return copy;
    }

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
    countIncorporealObjectByClass(class_id) {
        let number = 0;
        for (let array_object of this.incorporeal_objects) {
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
    findIncorporealObject(id) {
        for (let array_object of this.incorporeal_objects) {
            if (array_object.id === id) {
                return array_object;
            }
        }
        return null;
    }

    /**
     * 
     * @param {String} class_id
     * @param {Number} index
     * @returns {iLGE_2D_Object}
     */
    findIncorporealObjectByClass(class_id, index = 0) {
        for (let array_object of this.incorporeal_objects) {
            if (array_object.class_id === class_id) {
                if (index < 1)
                    return array_object;
                index--;
            }
        }
        return null;
    }

    /**
     * 
     * @param {iLGE_2D_Object} object 
     */
    addIncorporealObject(object) {
        if (typeof object !== "object")
            return;
        if (!this.#smartFind(this.incorporeal_objects, object.id))
            this.#smartPush(this.incorporeal_objects, object);
    }

    removeIncorporealObject(id) {
        this.#smartPop(this.incorporeal_objects, this.#smartFind(this.incorporeal_objects, id));

        for (let object of this.incorporeal_objects) {
            if (object.type === iLGE_2D_Object_Type_Custom) {
                for (let element of object.element) {
                    if (element.type === iLGE_2D_Object_Element_Type_Collider) {
                        this.#smartClean(element.collided_objects, this.incorporeal_objects);
                    }
                }
            }
        }
    }

    collidedWithByClass(class_id = "CLASS", index = 0) {
        for (let collided_object of this.collided_objects) {
            if (collided_object.class_id === class_id) {
                if (index < 1)
                    return collided_object;
                index--;
            }
        }
        return null;
    }

    collidedWithById(id = "OBJID") {
        for (let collided_object of this.collided_objects) {
            if (collided_object.id === id) {
                return collided_object;
            }
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
    id = "OBJID";
    type = iLGE_2D_Object_Element_Type_Sprite_Transition_Effect;
    visible = false;
    size = 0;
    src_index = 0;
    oldframe = 0;

    constructor(source_object, id, visible, size) {
        let image_object = null;
        if (!source_object.compareSourceType(iLGE_2D_Source_Type_Image))
            return;
        image_object = source_object.source;
        this.id = id;
        this.image = image_object;
        this.visible = visible;
        this.size = size;
    }
}

class iLGE_2D_Scene {
    id = "SCENEID";
    class_id = "CLASS";
    enabled = true;
    type = iLGE_2D_Object_Type_Scene;
    objects = [];

    /**
     * 
     * @param {Array} array 
     * @returns {Array}
     */
    #clone_array(array) {
        let copy = [];
        for (let i = 0; i < array.length; i++)
            copy[i] = Object.assign({}, array[i]);
        return copy;
    }

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
        for (let array_object of this.objects) {
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
        for (let array_object of this.objects) {
            if (array_object.id === id) {
                return array_object;
            }
        }
        return null;
    }

    /**
     * 
     * @param {String} class_id
     * @param {Number} index
     * @returns {iLGE_2D_Object}
     */
    findObjectByClass(class_id, index = 0) {
        for (let array_object of this.objects) {
            if (array_object.class_id === class_id) {
                if (index < 1)
                    return array_object;
                index--;
            }
        }
        return null;
    }

    /**
     * 
     * @param {iLGE_2D_Object} object 
     */
    addObject(object) {
        if (typeof object !== "object")
            return;
        if (!this.#smartFind(this.objects, object.id))
            this.#smartPush(this.objects, object);
    }

    removeObject(id) {
        this.#smartPop(this.objects, this.#smartFind(this.objects, id));
        for (let object of this.objects) {
            if (object.type === iLGE_2D_Object_Type_Custom) {
                for (let element of object.element) {
                    if (element.type === iLGE_2D_Object_Element_Type_Collider) {
                        this.#smartClean(element.collided_objects, this.objects);
                    }
                }
            }
        }
    }

    constructor(id = "SCENEID", class_id = "CLASS", enabled = true) {
        this.id = id;
        this.class_id = class_id;
        this.enabled = enabled;
    }
}

class iLGE_2D_Object {
    id = "OBJID";
    class_id = "CLASS";
    scene = 0;
    priority = 0;
    delay = 0;
    enabled = true;

    x = 0;
    y = 0;
    z_order = 0;
    old_x = 0;
    old_y = 0;
    rotation = 0;
    old_rotation = 0;
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

    findElementByType(type, index = 0) {
        for (let i = this.element.length - 1; i >= 0; i--) {
            let array_object = this.element[i];
            if (array_object.type === type) {
                if (index < 1)
                    return array_object;
                index--;
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

    getRotationVector(object = this) {
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
        width = 0, height = 0, scene = null) {
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
        this.scene = scene;
    }
}

class iLGE_2D_Engine {
    auto_resize = false;
    reset = true;
    width = 0;
    height = 0;
    start_function = 0;
    update_function = 0;

    #control_map_key = "Control_Map";

    /* Game Objects */
    #objects = [];

    /* Controls Interrupts Value Array */
    #controls = {};

    #control_map = {};
    #control_map_default = {};
    #source = [];
    #loaded_sources = 0;
    #total_sources = 0;

    deltaTime = 0;
    fps = 0;
    fps_limit = 0;

    #time_new = 0;
    #time_old = 0;
    #time_diff = 0;

    pointerLock = false;

    #gamepad_toggled_buttons_string = "Gamepad_Toggled_Buttons";
    #gamepads_connected_string = "Gamepads_connected";
    #gamepad_button_string = "_Button_";
    #gamepad_axis_string = "_Axis_";

    #getTime() {
        return performance.now();
    }

    /**
     * 
     * @param {Array} array 
     */
    #getZOrderInfo(array) {
        let min = Infinity, max = -Infinity;
        for (let object of array) {
            const value = object.z_order;
            switch (object.type) {
                case iLGE_2D_Object_Type_Custom:
                case iLGE_2D_Object_Type_Camera:
                    if (value > max)
                        max = value;
                    if (value < min)
                        min = value;
                    break;
            }
        }
        return {
            min: min,
            max: max,
        };
    }

    /**
     * 
     * @param {Array} array 
     */
    #getPriorityInfo(array) {
        let min = Infinity, max = -Infinity;
        for (let object of array) {
            const value = object.priority;
            switch (object.type) {
                case iLGE_2D_Object_Type_Custom:
                case iLGE_2D_Object_Type_Camera:
                    if (value > max)
                        max = value;
                    if (value < min)
                        min = value;
                    break;
            }
        }
        return {
            min: min,
            max: max,
        };
    }

    /**
     * 
     * @param {Array} array 
     * @returns {Array}
     */
    #clone_array(array) {
        let copy = [];
        for (let i = 0; i < array.length; i++)
            copy[i] = Object.assign({}, array[i]);
        return copy;
    }

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
     * @param {String} id
     * @returns {iLGE_2D_Object}
     */
    findObject(id) {
        for (let array_object of this.#objects) {
            if (array_object.id === id) {
                return array_object;
            }
        }
        return null;
    }

    /**
     * 
     * @param {String} class_id
     * @param {Number} index
     * @returns {iLGE_2D_Object}
     */
    findObjectByClass(class_id, index = 0) {
        for (let array_object of this.#objects) {
            if (array_object.class_id === class_id) {
                if (index < 1)
                    return array_object;
                index--;
            }
        }
        return null;
    }

    /**
     * 
     * @param {iLGE_2D_Object} object 
     */
    addObject(object) {
        if (typeof object !== "object")
            return;
        if (!this.#smartFind(this.#objects, object.id))
            this.#smartPush(this.#objects, object);
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

    #control_map_handle_control(control, repeat) {
        if (!control)
            return;
        if (control.startsWith("Mouse_Button") ||
            control.startsWith("Keyboard_")) {
            this.#controls[control] = this.#controls[control + "_Cache"];
        }
    }

    #control_map_get_helper(control, repeat) {
        if (!control)
            return 0;
        let control_value = this.#controls[control],
            old_control_value = control_value;
        this.#control_map_handle_control(control, repeat);
        if (!control_value)
            return 0;
        if (!repeat) {
            switch (typeof control_value) {
                case "object":
                    control_value = this.#clone_array(old_control_value);
                    for (let i = 0; i < old_control_value.length; i++)
                        old_control_value[i].value = 0;
                    break;
                default:
                    this.#controls[control] = 0;
                    break;
            }
        }
        return control_value;
    }

    control_map_get(action, repeat) {
        let control1 = this.#control_map[action],
            control2 = this.#control_map_default[action],
            best_control = 0;
        best_control = control1 ? control1 : control2;

        switch (typeof best_control) {
            case "string":
                return this.#control_map_get_helper(best_control, repeat);
            case "object":
                for (let control of best_control) {
                    let control_value = this.#control_map_get_helper(control, repeat);
                    if (!control_value)
                        continue;
                    return control_value;
                }
                break;
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

    #getOverlaps(vertices1, vertices2) {
        let minX1 = Math.min(...vertices1.map(vertex => vertex.x));
        let maxX1 = Math.max(...vertices1.map(vertex => vertex.x));
        let minX2 = Math.min(...vertices2.map(vertex => vertex.x));
        let maxX2 = Math.max(...vertices2.map(vertex => vertex.x));

        let minY1 = Math.min(...vertices1.map(vertex => vertex.y));
        let maxY1 = Math.max(...vertices1.map(vertex => vertex.y));
        let minY2 = Math.min(...vertices2.map(vertex => vertex.y));
        let maxY2 = Math.max(...vertices2.map(vertex => vertex.y));

        let overlapX = 0;
        if (minX1 < maxX2 && maxX1 > minX2) {
            overlapX = Math.min(maxX1, maxX2) - Math.max(minX1, minX2);
            if (minX1 > minX2) {
                overlapX = -overlapX;
            }
        }

        let overlapY = 0;
        if (minY1 < maxY2 && maxY1 > minY2) {
            overlapY = Math.min(maxY1, maxY2) - Math.max(minY1, minY2);
            if (minY1 > minY2) {
                overlapY = -overlapY;
            }
        }

        return { x: overlapX, y: overlapY };
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
                this.#objects[i].type === iLGE_2D_Object_Type_Font) {
                return this.#objects[i];
            }
        }
        return null;
    }

    #drawImage(canvas_context, image, sx, sy, swidth, sheight, dx, dy, width, height) {
        if (!image)
            return;
        canvas_context.imageSmoothingEnabled = false;
        canvas_context.drawImage(
            image,
            sx, sy, swidth, sheight,
            dx, dy, width, height
        );
    }

    #fillRect(canvas_context, color, x, y, width, height) {
        if (!canvas_context.onepixel_canvas) {
            canvas_context.onepixel_canvas = new OffscreenCanvas(1, 1);
            canvas_context.onepixel_canvas_context = canvas_context.onepixel_canvas.getContext("2d");
            canvas_context.onepixel_canvas_context.imageSmoothingEnabled = false;
        }

        if (canvas_context.onepixel_canvas.width !== 1 || canvas_context.onepixel_canvas.height !== 1) {
            canvas_context.onepixel_canvas.width = canvas_context.onepixel_canvas.height = 1;
            canvas_context.onepixel_canvas_context.imageSmoothingEnabled = false;
        }

        canvas_context.onepixel_canvas_context.fillStyle = color;
        canvas_context.onepixel_canvas_context.fillRect(0, 0, 1, 1);

        canvas_context.imageSmoothingEnabled = false;
        canvas_context.drawImage(
            canvas_context.onepixel_canvas,
            0, 0, 1, 1,
            x, y, width, height
        );
    }

    #drawTextWithStyles(string, canvas_context, max_width, max_height, font_id, x, y, px, color, v_center, h_center) {
        if (!string || !canvas_context || !font_id)
            return;

        let font_object = this.#find_font(font_id);
        if (!font_object)
            return;

        if (font_object.canvas.height !== font_object.height)
            font_object.canvas.height = font_object.height;

        const font_scale = font_object.height / px;
        const font_height = font_object.height / font_scale;

        if (y + px > max_height)
            return;

        const splitLine = (line) => {
            let parts = [];
            let currentPart = { string: '', color: color };

            for (let i = 0; i < line.length; i++) {
                const char = line.charAt(i);

                if (char === '<') {
                    let endIndex = line.indexOf('>', i);
                    if (endIndex !== -1 && line.startsWith('<color=', i)) {
                        let cache0 = line.indexOf('=', i) + 1,
                            cache1 = line.indexOf('<', endIndex),
                            cache2 = line.indexOf('>', endIndex + 1);
                        const colorValue = line.substring(cache0, endIndex);
                        const colorString = line.substring(endIndex + 1, cache1);
                        parts.push(currentPart);
                        currentPart = { string: colorString, color: colorValue };
                        parts.push(currentPart);
                        currentPart = { string: '', color: color };
                        i = cache2;
                        continue;
                    }
                }

                currentPart.string += char;
            }

            parts.push(currentPart);

            return parts;
        };

        const _splitLine = (line) => {
            let line_width = 0;
            let splitLines = [];
            let currentLine = '';

            for (let i = 0; i < line.length; i++) {
                const char = line.charAt(i);
                let char_width = 0;

                if (char === '<') {
                    let endIndex = line.indexOf('>', i);
                    if (endIndex !== -1 && line.startsWith('<color=', i)) {
                        let closeTagIndex = line.indexOf('</color>', endIndex);
                        if (closeTagIndex !== -1) {
                            const tagContent = line.substring(i, closeTagIndex + 8);
                            let tagWidth = 0;

                            for (let j = endIndex + 1; j < closeTagIndex; j++) {
                                const tagChar = line.charAt(j);
                                if (font_object.width_array[tagChar])
                                    char_width = font_object.width_array[tagChar] / font_scale;
                                line_width += char_width;
                                tagWidth += char_width;
                            }

                            if (line_width > max_width) {
                                splitLines.push(currentLine);
                                currentLine = '';
                                line_width = 0;
                            }

                            currentLine += tagContent;
                            line_width += tagWidth;

                            i = closeTagIndex + 7;
                            continue;
                        }
                    }
                }

                if (font_object.width_array[char])
                    char_width = font_object.width_array[char] / font_scale;

                if (line_width + char_width > max_width || char === '\n') {
                    splitLines.push(currentLine);
                    currentLine = '';
                    line_width = 0;
                }

                currentLine += char;
                line_width += char_width;
            }

            if (currentLine)
                splitLines.push(currentLine);

            return splitLines;
        };

        const lines = _splitLine(string);

        const total_text_height = lines.length * font_height;
        let font_aux_y = v_center ? (max_height - total_text_height) / 2 : 0;

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const parts = splitLine(lines[lineIndex]);
            let font_aux_x = 0;

            if (h_center) {
                let line_width = 0;
                for (let partIndex = 0; partIndex < parts.length; partIndex++) {
                    const part = parts[partIndex];
                    for (let index = 0; index < part.string.length; index++) {
                        let char = part.string.charAt(index);
                        if (!font_object.width_array[char] || !font_object.map[char])
                            continue;
                        const font_width = font_object.width_array[char] / font_scale;
                        if (line_width + font_width >= max_width)
                            break;
                        line_width += font_width;
                    }
                }
                font_aux_x = (max_width - line_width) / 2;
            }

            let font_x_pos = 0;
            let font_y_pos = lineIndex * font_height;

            for (let partIndex = 0; partIndex < parts.length; partIndex++) {
                const part = parts[partIndex];
                for (let i = 0; i < part.string.length; i++) {
                    let char = part.string.charAt(i);
                    if (!font_object.width_array[char] || !font_object.map[char])
                        continue;

                    const font_width = font_object.width_array[char] / font_scale;

                    if (font_y_pos >= max_height)
                        break;

                    font_object.canvas_context.globalCompositeOperation = "source-over";

                    if (font_object.canvas.width !== font_object.width_array[char]) {
                        font_object.canvas.width = font_object.width_array[char];
                    } else {
                        font_object.canvas_context.clearRect(
                            0, 0,
                            font_object.canvas.width, font_object.canvas.height
                        );
                    }

                    this.#drawImage(
                        font_object.canvas_context, font_object.image,
                        font_object.map[char][0], font_object.map[char][1],
                        font_object.canvas.width, font_object.canvas.height,
                        0, 0,
                        font_object.canvas.width, font_object.canvas.height
                    );

                    font_object.canvas_context.globalCompositeOperation = "source-in";

                    this.#fillRect(
                        font_object.canvas_context, part.color,
                        0, 0,
                        font_object.canvas.width, font_object.canvas.height
                    );

                    this.#drawImage(
                        canvas_context, font_object.canvas,
                        0, 0, font_object.canvas.width, font_object.canvas.height,
                        x + font_aux_x + font_x_pos, y + font_aux_y + font_y_pos, font_width, font_height
                    );

                    font_x_pos += font_width;
                }
            }
        }
    }

    #drawText(string, canvas_context, max_width, max_height, font_id, x, y, px, color, v_center, h_center) {
        if (!string || !canvas_context || !font_id)
            return;

        let font_object = this.#find_font(font_id);
        if (!font_object)
            return;

        if (font_object.canvas.height !== font_object.height)
            font_object.canvas.height = font_object.height;

        const font_scale = font_object.height / px;
        const font_height = font_object.height / font_scale;

        if (y + px > max_height)
            return;

        const splitLine = (line) => {
            let line_width = 0;
            let splitLines = [];
            let currentLine = '';

            for (let i = 0; i < line.length; i++) {
                const char = line.charAt(i);
                let char_width = 0;

                if (font_object.width_array[char])
                    char_width = font_object.width_array[char] / font_scale;

                if (line_width + char_width > max_width || char === '\n') {
                    splitLines.push(currentLine);
                    currentLine = char;
                    line_width = char_width;
                } else {
                    currentLine += char;
                    line_width += char_width;
                }
            }

            if (currentLine)
                splitLines.push(currentLine);

            return splitLines;
        };

        const lines = splitLine(string);

        const total_text_height = lines.length * font_height;
        let font_aux_y = v_center ? (max_height - total_text_height) / 2 : 0;

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];
            let font_aux_x = 0;

            if (h_center) {
                const line_width = line.split('').reduce((acc, char) => {
                    if (font_object.width_array[char])
                        return acc + font_object.width_array[char] / font_scale;
                    return acc;
                }, 0);
                font_aux_x = (max_width - line_width) / 2;
            }

            let font_x_pos = 0;
            let font_y_pos = lineIndex * font_height;

            for (let i = 0; i < line.length; i++) {
                let char = line.charAt(i);
                if (!font_object.width_array[char] || !font_object.map[char])
                    continue;

                const font_width = font_object.width_array[char] / font_scale;

                if (font_y_pos >= max_height)
                    break;

                font_object.canvas_context.globalCompositeOperation = "source-over";

                if (font_object.canvas.width !== font_object.width_array[char]) {
                    font_object.canvas.width = font_object.width_array[char];
                } else {
                    font_object.canvas_context.clearRect(
                        0, 0,
                        font_object.canvas.width, font_object.canvas.height
                    );
                }

                this.#drawImage(
                    font_object.canvas_context, font_object.image,
                    font_object.map[char][0], font_object.map[char][1],
                    font_object.canvas.width, font_object.canvas.height,
                    0, 0,
                    font_object.canvas.width, font_object.canvas.height
                );

                font_object.canvas_context.globalCompositeOperation = "source-in";

                this.#fillRect(
                    font_object.canvas_context, color,
                    0, 0,
                    font_object.canvas.width, font_object.canvas.height
                );

                this.#drawImage(
                    canvas_context, font_object.canvas,
                    0, 0, font_object.canvas.width, font_object.canvas.height,
                    x + font_x_pos + font_aux_x, y + font_y_pos + font_aux_y, font_width, font_height
                );

                font_x_pos += font_width;
            }
        }
    }

    #draw_camera_scene(camera, vcamera, z_order) {
        let z_order_find = false;
        for (let object of camera.scene.objects) {
            switch (object.type) {
                case iLGE_2D_Object_Type_Custom:
                    if (!object.element.length || object.z_order !== z_order)
                        continue;
                    z_order_find = true;
                    if (this.#collision_detection(vcamera, object)) {
                        let object_width = object.width * camera.scale_output;
                        let object_height = object.height * camera.scale_output;
                        let object_half_size = [object_width / 2, object_height / 2];
                        camera.canvas_context.save();
                        camera.canvas_context.translate(
                            object.x * camera.scale_output + object_half_size[0],
                            object.y * camera.scale_output + object_half_size[1]
                        );
                        camera.canvas_context.rotate((Math.PI / 180) * object.rotation);
                        for (let element of object.element) {
                            if (!element.visible)
                                continue;
                            switch (element.type) {
                                case iLGE_2D_Object_Element_Type_Rectangle:
                                    this.#fillRect(
                                        camera.canvas_context, element.color,
                                        -object_half_size[0] * object.scale,
                                        -object_half_size[1] * object.scale,
                                        object_width * object.scale,
                                        object_height * object.scale
                                    );
                                    break;
                                case iLGE_2D_Object_Element_Type_Sprite:
                                    this.#drawImage(
                                        camera.canvas_context, element.image,
                                        element.src_x, element.src_y,
                                        element.src_width, element.src_height,
                                        -object_half_size[0] * object.scale,
                                        -object_half_size[1] * object.scale,
                                        object_width * object.scale,
                                        object_height * object.scale
                                    );
                                    break;
                                case iLGE_2D_Object_Element_Type_Text:
                                    if (element.styled_text)
                                        this.#drawTextWithStyles(
                                            element.string, camera.canvas_context,
                                            object_width * object.scale,
                                            object_height * object.scale,
                                            element.font_id,
                                            -object_half_size[0] * object.scale,
                                            -object_half_size[1] * object.scale,
                                            element.px * camera.scale_output * object.scale, element.color,
                                            element.alignment_center.vertical,
                                            element.alignment_center.horizontal
                                        );
                                    else
                                        this.#drawText(
                                            element.string, camera.canvas_context,
                                            object_width * object.scale,
                                            object_height * object.scale,
                                            element.font_id,
                                            -object_half_size[0] * object.scale,
                                            -object_half_size[1] * object.scale,
                                            element.px * camera.scale_output * object.scale, element.color,
                                            element.alignment_center.vertical,
                                            element.alignment_center.horizontal
                                        );
                                    break;
                            }
                        }
                        camera.canvas_context.restore();
                    }
                    break;
            }
        }
        return z_order_find;
    }

    /**
    * @param camera {iLGE_2D_Object}
    */
    #draw_camera(camera, object, x, y, width, height) {
        if (!camera || camera.type !== iLGE_2D_Object_Type_Camera || !camera.scene)
            return;
        if (!camera.canvas) {
            camera.canvas = new OffscreenCanvas(1, 1);
            camera.canvas_context = camera.canvas.getContext("2d");
        }
        let scale = 1;
        if (camera.scale > 0) {
            scale = Math.min(
                object.width / camera.scale,
                object.height / camera.scale
            );
        }
        camera.scale_output = scale;
        camera.width = object.width / scale;
        camera.height = object.height / scale;
        camera.canvas.width = object.width;
        camera.canvas.height = object.height;
        camera.canvas_context.imageSmoothingEnabled = false;
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
        vcamera.x += 1, vcamera.y += 1;
        vcamera.width -= 2, vcamera.height -= 2;
        vcamera.prepareForCollision();
        let camera_width = camera.width * camera.scale_output;
        let camera_height = camera.height * camera.scale_output;
        let halfSize = [camera_width / 2, camera_height / 2];
        camera.canvas_context.save();
        for (let element of camera.element) {
            if (!element.visible)
                continue;
            switch (element.type) {
                case iLGE_2D_Object_Element_Type_Rectangle:
                    this.#fillRect(
                        camera.canvas_context, element.color,
                        0, 0,
                        camera_width, camera_height
                    );
                    break;
                case iLGE_2D_Object_Element_Type_Sprite:
                    this.#drawImage(
                        camera.canvas_context, element.image,
                        element.src_x, element.src_y,
                        element.src_width, element.src_height,
                        0, 0,
                        camera_width, camera_height
                    );
                    break;
            }
        }
        camera.canvas_context.translate(
            halfSize[0],
            halfSize[1]
        );
        camera.canvas_context.rotate(-camera.rotation * (Math.PI / 180));
        camera.canvas_context.translate(
            -camera.x * camera.scale_output - halfSize[0],
            -camera.y * camera.scale_output - halfSize[1]
        );
        let z_order_info = this.#getZOrderInfo(camera.scene.objects);
        for (let z_order = z_order_info.min; z_order <= z_order_info.max; z_order++) {
            this.#draw_camera_scene(camera, vcamera, z_order);
        }
        camera.canvas_context.restore();
        if (this.debug) {
            camera.canvas_context.strokeStyle = "#000000";
            camera.canvas_context.strokeRect(
                (vcamera.x - camera.x) * camera.scale_output, (vcamera.y - camera.y) * camera.scale_output,
                vcamera.width * camera.scale_output, vcamera.height * camera.scale_output
            );
        }
        this.#drawImage(
            this.canvas_context, camera.canvas,
            0, 0, camera.canvas.width, camera.canvas.height,
            x, y, width, height
        );
    }

    /**
     * 
     * @param {OffscreenCanvas} newframe 
     * @param {OffscreenCanvas} oldframe 
     * @param {Number} dx 
     * @param {Number} dy 
     * @param {Number} dwidth 
     * @param {Number} dheight 
     * @param {Number} effect_spritesheet 
     * @param {Number} effect_size 
     * @param {Number} effect_scale 
     * @param {Number} effect_sprite_index 
     * @returns {OffscreenCanvas}
     */
    #applyTransitionEffect(
        newframe, oldframe, dx, dy, dwidth, dheight,
        effect_spritesheet, effect_size, effect_scale, effect_sprite_index
    ) {
        if (!newframe || !effect_spritesheet || !effect_size)
            return null;

        let _effect_size = Math.max(effect_size, effect_size * effect_scale);

        if (!effect_spritesheet.effectCache) {
            effect_spritesheet.effectCache = {
                canvas: new OffscreenCanvas(_effect_size, _effect_size),
                context: null,
                maxIndex: effect_spritesheet.width / effect_size
            };
            effect_spritesheet.effectCache.context = effect_spritesheet.effectCache.canvas.getContext("2d");
        }

        const cache = effect_spritesheet.effectCache;

        effect_size = Math.floor(effect_size);
        effect_sprite_index = Math.min(Math.max(0, Math.floor(effect_sprite_index)), cache.maxIndex - 1);

        if (cache.canvas.width !== _effect_size || cache.canvas.height !== _effect_size)
            cache.canvas.width = cache.canvas.height = _effect_size;

        cache.context.clearRect(0, 0, cache.canvas.width, cache.canvas.height);

        this.#drawImage(
            cache.context,
            effect_spritesheet,
            effect_size * effect_sprite_index, 0,
            effect_size, effect_size,
            0, 0,
            cache.canvas.width, cache.canvas.height
        );

        if (!this.effect_frame) {
            this.effect_frame = new OffscreenCanvas(dwidth, dheight);
            this.effect_frame_context = this.effect_frame.getContext("2d");
        }

        const effect_frame = this.effect_frame;
        const effect_frame_context = this.effect_frame_context;

        if (effect_frame.width !== dwidth || effect_frame.height !== dheight) {
            effect_frame.width = dwidth;
            effect_frame.height = dheight;
        }

        if (oldframe)
            effect_frame_context.drawImage(
                oldframe,
                dx, dy,
                effect_frame.width, effect_frame.height,
                0, 0,
                effect_frame.width, effect_frame.height
            );

        const pattern = effect_frame_context.createPattern(cache.canvas, "repeat");
        effect_frame_context.fillStyle = pattern;
        effect_frame_context.fillRect(0, 0, effect_frame.width, effect_frame.height);

        if (newframe) {
            const tmp_canvas = new OffscreenCanvas(effect_frame.width, effect_frame.height);
            const tmp_context = tmp_canvas.getContext("2d");

            tmp_context.fillStyle = pattern;
            tmp_context.fillRect(0, 0, tmp_canvas.width, tmp_canvas.height);

            tmp_context.globalCompositeOperation = "source-in";

            tmp_context.drawImage(newframe, 0, 0);

            effect_frame_context.drawImage(
                tmp_canvas,
                dx, dy,
                effect_frame.width, effect_frame.height,
                0, 0,
                effect_frame.width, effect_frame.height
            );
        }

        return effect_frame;
    }

    #draw_hud(z_order) {
        let z_order_find = false;
        for (let object of this.#objects) {
            if (object.z_order !== z_order)
                continue;
            switch (object.type) {
                case iLGE_2D_Object_Type_Custom:
                    if (!object.element.length)
                        break;
                    z_order_find = true;
                    let object_scale = 1;
                    if (object.scale > 0) {
                        object_scale = Math.min(
                            this.canvas.width / object.scale,
                            this.canvas.height / object.scale
                        );
                    }
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
                        this.canvas_context.imageSmoothingEnabled = false;
                        switch (element.type) {
                            case iLGE_2D_Object_Element_Type_Rectangle:
                                this.#fillRect(
                                    this.canvas_context, element.color,
                                    -object_half_size[0],
                                    -object_half_size[1],
                                    object_width,
                                    object_height
                                );
                                break;
                            case iLGE_2D_Object_Element_Type_Sprite:
                                this.#drawImage(
                                    this.canvas_context, element.image,
                                    element.src_x, element.src_y,
                                    element.src_width, element.src_height,
                                    -object_half_size[0],
                                    -object_half_size[1],
                                    object_width,
                                    object_height
                                );
                                break;
                            case iLGE_2D_Object_Element_Type_Text:
                                if (element.styled_text)
                                    this.#drawTextWithStyles(
                                        element.string, this.canvas_context,
                                        object_width,
                                        object_height,
                                        element.font_id,
                                        -object_half_size[0],
                                        -object_half_size[1],
                                        element.px * object_scale, element.color,
                                        element.alignment_center.vertical,
                                        element.alignment_center.horizontal
                                    );
                                else
                                    this.#drawText(
                                        element.string, this.canvas_context,
                                        object_width,
                                        object_height,
                                        element.font_id,
                                        -object_half_size[0],
                                        -object_half_size[1],
                                        element.px * object_scale, element.color,
                                        element.alignment_center.vertical,
                                        element.alignment_center.horizontal
                                    );
                                break;
                            case iLGE_2D_Object_Element_Type_Camera_Viewer:
                                this.#draw_camera(
                                    element.camera, object,
                                    -object_half_size[0],
                                    -object_half_size[1],
                                    object_width,
                                    object_height,
                                );
                                break;
                        }
                    }
                    this.canvas_context.restore();
                    break;
            }
        }
        return z_order_find;
    }

    #draw() {
        let z_order_info = this.#getZOrderInfo(this.#objects);
        for (let z_order = z_order_info.min; z_order <= z_order_info.max; z_order++) {
            this.#draw_hud(z_order);
        }
        for (let object of this.#objects) {
            if (object.type === iLGE_2D_Object_Type_Custom && object.element.length) {
                this.canvas_context.save();
                let object_scale = 1;
                if (object.scale > 0) {
                    object_scale = Math.min(
                        this.canvas.width / object.scale,
                        this.canvas.height / object.scale
                    );
                }
                for (let element of object.element) {
                    if (!element.visible)
                        continue;
                    switch (element.type) {
                        case iLGE_2D_Object_Element_Type_Sprite_Transition_Effect:
                            let finalframe = this.#applyTransitionEffect(
                                this.getFrameData(), element.oldframe,
                                object.x, object.y,
                                object.width, object.height,
                                element.image, element.size, object_scale, element.src_index);
                            this.#drawImage(
                                this.canvas_context,
                                finalframe,
                                0, 0,
                                finalframe.width, finalframe.height,
                                object.x, object.y,
                                finalframe.width, finalframe.height
                            );
                            break;
                    }
                }
                this.canvas_context.restore();
            }
        }
    }

    /**
     * 
     * @param {iLGE_2D_Object} tmp_object1 
     * @param {iLGE_2D_Object} tmp_object2 
     * @param {Number} startX 
     * @param {Number} startY 
     * @param {Number} endX 
     * @param {Number} endY 
     * @returns 
     */
    #checkContinuousCollision(tmp_object1, tmp_object2, startX, startY, endX, endY) {
        const steps = Math.max(Math.abs(endX - startX), Math.abs(endY - startY), 1);
        let collisionPoint = null;

        const increments = 1 / steps;

        for (let t = 0; t <= 1; t += increments) {
            tmp_object1.x = startX + t * (endX - startX);
            tmp_object1.y = startY + t * (endY - startY);
            tmp_object1.prepareForCollision();

            if (this.#collision_detection(tmp_object1, tmp_object2)) {
                collisionPoint = {
                    x: tmp_object1.x,
                    y: tmp_object1.y
                };
                break;
            }
        }
        return collisionPoint;
    }

    /**
     * 
     * @param {iLGE_2D_Object} tmp_object1 
     * @param {iLGE_2D_Object_Element_Collider} element1 
     * @param {iLGE_2D_Object} object1 
     * @param {iLGE_2D_Object} object2 
     */
    #check_object_collision(tmp_object1, element1, object1, object2, isBlocker) {
        for (let element2 of object2.element) {
            if (element2.type === iLGE_2D_Object_Element_Type_Collider) {
                let tmp_object2 = new iLGE_2D_Object(
                    null, null, iLGE_2D_Object_Type_Custom,
                    object2.x + element2.x, object2.y + element2.y,
                    object2.rotation, object2.scale,
                    element2.width, element2.height,
                );
                tmp_object2.prepareForCollision();

                if (!this.#smartFind(element2.incorporeal_objects, object1.id) &&
                    this.#collision_detection(tmp_object1, tmp_object2)) {
                    if (isBlocker && !element1.blocker && !element1.noclip && element2.blocker) {
                        const velocityX1 = object1.x - object1.old_x;
                        const velocityY1 = object1.y - object1.old_y;

                        const velocityX2 = object2.x - object2.old_x;
                        const velocityY2 = object2.y - object2.old_y;

                        const relativeVelocityX = velocityX1 - velocityX2;
                        const relativeVelocityY = velocityY1 - velocityY2;

                        const collisionPoint = this.#checkContinuousCollision(
                            tmp_object1, tmp_object2,
                            object1.old_x, object1.old_y,
                            object1.x + relativeVelocityX, object1.y + relativeVelocityY
                        );

                        if (collisionPoint) {
                            const overlap = this.#getOverlaps(tmp_object1.vertices, tmp_object2.vertices);

                            if (Math.abs(overlap.x) < Math.abs(overlap.y)) {
                                object1.x = collisionPoint.x - overlap.x;
                            } else {
                                object1.y = collisionPoint.y - overlap.y;
                            }
                        }

                        tmp_object1.x = object1.x;
                        tmp_object1.y = object1.y;
                        tmp_object1.prepareForCollision();
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

    #check_collisions(
        objects_with_collider_element,
        blocker_objects_with_collider_element
    ) {
        for (let i = 0; i < objects_with_collider_element.length; i++) {
            let object1 = objects_with_collider_element[i];
            for (let element1 of object1.element) {
                if (element1.type === iLGE_2D_Object_Element_Type_Collider) {
                    let tmp_object1 = new iLGE_2D_Object(
                        null, null, iLGE_2D_Object_Type_Custom,
                        object1.x + element1.x, object1.y + element1.y,
                        object1.rotation, object1.scale,
                        element1.width, element1.height,
                    );
                    tmp_object1.prepareForCollision();
                    for (let j = i + 1; j < objects_with_collider_element.length; j++) {
                        let object2 = objects_with_collider_element[j];
                        if (object1.id === object2.id)
                            continue;
                        this.#check_object_collision(tmp_object1, element1, object1, object2, false);
                    }
                    for (let j = 0; j < blocker_objects_with_collider_element.length; j++) {
                        let object2 = blocker_objects_with_collider_element[j];
                        if (object1 === object2)
                            continue;
                        this.#check_object_collision(tmp_object1, element1, object1, object2, true);
                    }
                }
            }
        }
    }

    #objects_loop(
        objects_with_collider_element, blocker_objects_with_collider_element,
        array, priority, scene = this
    ) {
        for (let p = priority.max; p >= priority.min; p--) {
            for (let object of array) {
                if (object.priority !== p)
                    continue;
                if (object.delay > 0)
                    object.delay -= this.#time_diff;
                object.scene = scene;
                object.old_x = object.x;
                object.old_y = object.y;
                object.old_rotation = object.rotation;
                if (object.enabled) {
                    if (object.start_function && object.reset) {
                        object.start_function(this);
                        object.reset = false;
                    }
                    if (object.update_function)
                        object.update_function(this);
                }
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
        }
    }

    #requestAnimationFrame(animation_function) {
        if (animation_function)
            window.requestAnimationFrame(animation_function);
    }

    start() {
        this.#time_new = this.#getTime();
        this.#time_diff = this.#time_new - this.#time_old;
        this.#time_old = this.#time_new;

        if (!this.pointerLock) {
            document.exitPointerLock();
            this.canvas.style = "cursor: auto;";
        }
        else {
            this.canvas.style = "cursor: none;";
        }

        if (this.#loaded_sources < this.#total_sources) {
            this.#requestAnimationFrame(this.start);
            return;
        }

        if (this.start_function && this.reset) {
            this.start_function(this);
            this.reset = false;
            this.#requestAnimationFrame(this.start);
            return;
        }
        if (this.update_function) {
            this.update_function(this);
        }

        this.#gamepad_handler(null, this, null);
        let objects_with_collider_element = [];
        let blocker_objects_with_collider_element = [];
        let priority;
        for (let object of this.#objects) {
            if (object.type === iLGE_2D_Object_Type_Scene && object.enabled) {
                let objects_with_collider_element_scene = [];
                let blocker_objects_with_collider_element_scene = [];
                priority = this.#getPriorityInfo(object.objects);
                this.#objects_loop(
                    objects_with_collider_element_scene,
                    blocker_objects_with_collider_element_scene,
                    object.objects, priority, object
                );
                this.#check_collisions(
                    objects_with_collider_element_scene,
                    blocker_objects_with_collider_element_scene
                );
            }
        }
        priority = this.#getPriorityInfo(this.#objects);
        this.#objects_loop(
            objects_with_collider_element,
            blocker_objects_with_collider_element,
            this.#objects, priority
        );
        this.#check_collisions(
            objects_with_collider_element,
            blocker_objects_with_collider_element
        );
        this.#draw();
        if (this.fps_limit > 0) {
            let timeout = (1000 / this.fps_limit) - this.#time_diff;
            if (timeout < 1)
                timeout = 1;
            let isThis = this;
            setTimeout(function () {
                isThis.deltaTime = isThis.#time_diff / (1000 / 60);
                isThis.fps = Math.round(1000 / (isThis.#time_diff ? isThis.#time_diff : 1));
                isThis.#requestAnimationFrame(isThis.start);
            }, timeout);
        }
        else {
            this.deltaTime = this.#time_diff / (1000 / 60);
            this.fps = Math.round(1000 / (this.#time_diff ? this.#time_diff : 1));
            this.#requestAnimationFrame(this.start);
        }
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
    }

    /**
     * 
     * @param {this} isThis 
     * @param {TouchList} touches 
     * @param {Boolean} positive 
     * @param {Boolean} movement
     * @param {String} state 
     */
    #handle_touchlist_array(isThis, touches, positive, movement, state) {
        const sign = positive ? 1 : -1;
        const sign_tag = positive ? "_Positive" : "_Negative";
        const touch_tag = "Touch";
        const clientX_tag = movement ? "_MovementX" : "_ClientX";
        const clientY_tag = movement ? "_MovementY" : "_ClientY";
        if (!isThis.#controls[touch_tag + clientX_tag + sign_tag])
            isThis.#controls[touch_tag + clientX_tag + sign_tag] = [];
        if (!isThis.#controls[touch_tag + clientY_tag + sign_tag])
            isThis.#controls[touch_tag + clientY_tag + sign_tag] = [];
        for (let i = 0; i < touches.length; i++) {
            const touch = touches[i];
            let clientX = touch.clientX * sign * window.devicePixelRatio,
                clientY = touch.clientY * sign * window.devicePixelRatio;
            let id = touch.identifier % 10;
            let objectX = isThis.#smartFind(
                isThis.#controls[touch_tag + clientX_tag + sign_tag],
                id
            );
            let objectY = isThis.#smartFind(
                isThis.#controls[touch_tag + clientY_tag + sign_tag],
                id
            );
            if (!objectX) {
                objectX = {
                    value: 0,
                    old_value: 0,
                    id: id,
                    state: state,
                };
                isThis.#controls[touch_tag + clientX_tag + sign_tag].push(objectX);
            }
            objectX.value = movement ? clientX - objectX.old_value : clientX;
            objectX.old_value = clientX;
            objectX.id = id;
            objectX.state = state;
            if (!objectY) {
                objectY = {
                    value: 0,
                    old_value: 0,
                    id: id,
                    state: state,
                };
                isThis.#controls[touch_tag + clientY_tag + sign_tag].push(objectY);
            }
            objectY.value = movement ? clientY - objectY.old_value : clientY;
            objectY.old_value = clientY;
            objectY.id = id;
            objectY.state = state;
        }
    }

    /**
     * 
     * @param {TouchEvent} event 
     * @param {this} isThis 
     * @param {String} type 
     */
    #touch_handler(event, isThis, type) {
        event.preventDefault();
        const touch_tag = "Touch";
        const state_tag = "_State";
        isThis.#controls[touch_tag + state_tag] = true;
        let touches = event.changedTouches;
        switch (type) {
            case "start":
            case "move":
                isThis.#handle_touchlist_array(isThis, touches, true, false, "Down");
                isThis.#handle_touchlist_array(isThis, touches, false, false, "Down");
                isThis.#handle_touchlist_array(isThis, touches, true, true, "Down");
                isThis.#handle_touchlist_array(isThis, touches, false, true, "Down");
                break;
            case "leave":
            case "cancel":
                isThis.#handle_touchlist_array(isThis, touches, true, false, "Cancel/Leave");
                isThis.#handle_touchlist_array(isThis, touches, false, false, "Cancel/Leave");
                isThis.#handle_touchlist_array(isThis, touches, true, true, "Cancel/Leave");
                isThis.#handle_touchlist_array(isThis, touches, false, true, "Cancel/Leave");
                break;
            case "end":
                isThis.#handle_touchlist_array(isThis, touches, true, false, "Up");
                isThis.#handle_touchlist_array(isThis, touches, false, false, "Up");
                isThis.#handle_touchlist_array(isThis, touches, true, true, "Up");
                isThis.#handle_touchlist_array(isThis, touches, false, true, "Up");
                break;
        }
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
                if (!isThis.#controls[mouse_movementX_string + "_Positive"])
                    isThis.#controls[mouse_movementX_string + "_Positive"] =
                        isThis.#controls[mouse_movementX_string + "_Negative"] = 0;
                if (!isThis.#controls[mouse_movementY_string + "_Positive"])
                    isThis.#controls[mouse_movementY_string + "_Positive"] =
                        isThis.#controls[mouse_movementY_string + "_Negative"] = 0;
                isThis.#controls[mouse_movementX_string + "_Positive"] += movementX;
                isThis.#controls[mouse_movementY_string + "_Positive"] += movementY;
                isThis.#controls[mouse_movementX_string + "_Negative"] += -movementX;
                isThis.#controls[mouse_movementY_string + "_Negative"] += -movementY;
                break;
            case "ContextMenu":
                event.preventDefault();
                break;
            case "ButtonDown":
                if (!isThis.#controls[mouse_button_toggled_string][event.button]) {
                    isThis.#controls["Mouse_Button_" + event.button + "_Toggle"] =
                        isThis.#controls["Mouse_Button_" + event.button + "_Toggle"] ? false : true;
                    isThis.#controls[mouse_button_toggled_string][event.button] = true;
                }
                isThis.#controls["Mouse_Button_" + event.button] = true;
                isThis.#controls["Mouse_Button_" + event.button + "_Cache"] = true;
                break;
            case "ButtonUp":
                isThis.#controls["Mouse_Button_" + event.button + "_Cache"] = false;
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
        const keyboard_keycode_key = keyborad_keycode_tag + "_" + event.keyCode;
        const keyboard_which_key = keyborad_which_tag + "_" + event.which;
        const keyboard_key_key = keyborad_key_tag + "_" + event.key;
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
        if (bool) {
            isThis.#controls[keyboard_code_key] = bool;
            isThis.#controls[keyboard_keycode_key] = bool;
            isThis.#controls[keyboard_which_key] = bool;
            isThis.#controls[keyboard_key_key] = bool;
        }
        isThis.#controls[keyboard_code_key + "_Cache"] = bool;
        isThis.#controls[keyboard_keycode_key + "_Cache"] = bool;
        isThis.#controls[keyboard_which_key + "_Cache"] = bool;
        isThis.#controls[keyboard_key_key + "_Cache"] = bool;
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

    /**
     * 
     * @returns {OffscreenCanvas}
     */
    getFrameData() {
        let newframe = new OffscreenCanvas(this.width, this.height);
        let context = newframe.getContext("2d");
        this.#drawImage(
            context, this.canvas,
            0, 0, this.width, this.height,
            0, 0, newframe.width, newframe.height
        );
        return newframe;
    }

    /**
     * 
     * @param {String} src 
     * @returns {iLGE_2D_Source}
     */
    findSourceObject(src) {
        for (let i = 0; i < this.#source.length; i++) {
            if (this.#source[i]) {
                if (this.#source[i].compareSrc)
                    if (this.#source[i].compareSrc(src))
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

    unloadResourcesFiles(resource_files) {
        let isThis = this;
        let result = true;
        if (!resource_files)
            return false;
        for (let i = 0; i < resource_files.length; i++) {
            let source_url = resource_files[i];
            let source = this.findSourceObject(source_url);
            if (!source)
                continue;
            this.#smartPop(isThis.#source, source);
            source.source = null;
            source.source_data = null;
            isThis.#loaded_sources--;
            isThis.#total_sources--;
        }
        return result;
    }

    loadResourcesFiles(resource_files) {
        let isThis = this;
        let result = true;
        if (!resource_files)
            return false;
        for (let i = 0; i < resource_files.length; i++) {
            let source_url = resource_files[i];
            let source = this.findSourceObject(source_url);
            if (source)
                continue;
            isThis.#total_sources++;
            let source_format = isThis.#getSourceFormat(source_url);
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
                            isThis.#total_sources--;
                            result = false;
                            return;
                        }
                        let imageData = xhr.response;
                        source_object.source_data = imageData;
                        source.onload = function () {
                            isThis.#source.push(source_object);
                            isThis.#loaded_sources++;
                        };
                        source.src = URL.createObjectURL(
                            new Blob([imageData, { type: "image/mpeg" }])
                        );
                    };
                    xhr.send();
                    break;
                case ".wav":
                case ".mp3":
                case ".ogg":
                    source = new (window.AudioContext || window.webkitAudioContext)();
                    source_object = new iLGE_2D_Source(source, source_url, iLGE_2D_Source_Type_Audio);
                    xhr.onload = async function () {
                        if (xhr.status !== 200) {
                            isThis.#total_sources--;
                            result = false;
                            return;
                        }
                        let audioData = xhr.response;
                        source.Abuffer = await source.decodeAudioData(audioData);
                        source_object.source_data = audioData;
                        isThis.#source.push(source_object);
                        isThis.#loaded_sources++;
                    };
                    xhr.send();
                    break;
                default:
                    source_object = new iLGE_2D_Source(null, source_url, iLGE_2D_Source_Type_RAW);
                    xhr.onload = function () {
                        if (xhr.status !== 200) {
                            isThis.#total_sources--;
                            result = false;
                            return;
                        }
                        let RAWData = xhr.response;
                        source_object.source_data = RAWData;
                        isThis.#source.push(source_object);
                        isThis.#loaded_sources++;
                    };
                    xhr.send();
                    break;
            }
        }
        return result;
    }

    setScreenResolution(width, height) {
        this.auto_resize = false;
        this.width = width;
        this.height = height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    constructor(gameid, resource_files, html_div, width, height, auto_resize) {
        let isThis = this;
        let vendors = ['webkit', 'moz'];
        for (let x = 0; x < vendors.length && !window.requestAnimationFrame; x++) {
            const vendor = vendors[x];
            window.requestAnimationFrame =
                window[vendor + 'RequestAnimationFrame'];
            window.cancelAnimationFrame =
                window[vendor + 'CancelAnimationFrame'] ||
                window[vendor + 'CancelRequestAnimationFrame'];
        }
        this.loadResourcesFiles(resource_files);
        this.gameid = gameid;
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
        this.canvas.addEventListener("touchstart",
            function (event) {
                isThis.#touch_handler(event, isThis, "start");
            }, true);
        this.canvas.addEventListener("touchend",
            function (event) {
                isThis.#touch_handler(event, isThis, "end");
            }, true);
        this.canvas.addEventListener("touchmove",
            function (event) {
                isThis.#touch_handler(event, isThis, "move");
            }, true);
        this.canvas.addEventListener("touchleave",
            function (event) {
                isThis.#touch_handler(event, isThis, "leave");
            }, true);
        this.canvas.addEventListener("touchcancel",
            function (event) {
                isThis.#touch_handler(event, isThis, "cancel");
            }, true);
        this.canvas.addEventListener("click",
            async function (event) {
                if (isThis.pointerLock)
                    await isThis.canvas.requestPointerLock();
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