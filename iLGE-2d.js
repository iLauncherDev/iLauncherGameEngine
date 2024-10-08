// Copyright (C) 2024 Daniel Victor
//
// This program is distributed under the terms of the GNU General Public License, Version 3
// (or any later version) published by the Free Software Foundation.
// You can obtain a copy of the license at https://www.gnu.org/licenses/gpl-3.0.en.html.

const iLGE_2D_Version = "0.5.3";
const iLGE_2D_Object_ScalingMode_Default = "default";
const iLGE_2D_Object_ScalingMode_None = "none";
const iLGE_2D_Object_Element_Type_Sprite = "Sprite";
const iLGE_2D_Object_Element_Type_Rectangle = "Rectangle";
const iLGE_2D_Object_Element_Rectangle_DrawingMode_Fill = "Fill";
const iLGE_2D_Object_Element_Rectangle_DrawingMode_Stroke = "Stroke";
const iLGE_2D_Object_Element_Type_Collider = "Collider";
const iLGE_2D_Object_Element_Collider_Mode_Discrete = "Discrete";
const iLGE_2D_Object_Element_Collider_Mode_ContinuousDynamic = "ContinuousDynamic";
const iLGE_2D_Object_Element_Collider_Mode_Continuous = "Continuous";
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

    transform(vector, origin = new iLGE_2D_Vector2()) {
        if (!vector)
            return this;

        const posX = this.x - origin.x;
        const posY = this.y - origin.y;

        const newX = vector.x * posX - vector.y * posY;
        const newY = vector.y * posX + vector.x * posY;

        this.x = newX + origin.x;
        this.y = newY + origin.y;

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

    createAudioBufferSource() {
        if (!this.compareSourceType(iLGE_2D_Source_Type_Audio))
            return null;
        const source = this.source.createBufferSource();

        source.audioSpeed = 1;
        source.playbackRate.value = source.audioSpeed;

        source.buffer = this.source.Abuffer;
        source.root = this.source;

        source.stereoPanner = this.source.createStereoPanner();
        source.stereoPanner.pan.value = 0;
        source.stereoPanner.connect(this.source.destination);

        source.analyser = this.source.createAnalyser();
        source.analyser.fftSize = 256;
        source.analyser.connect(source.stereoPanner);

        source.volume = this.source.createGain();
        source.volume.gain.value = 1;
        source.volume.connect(source.analyser);

        source.connect(source.volume);
        return source;
    }

    stopAudio(source) {
        if (!this.compareSourceType(iLGE_2D_Source_Type_Audio) || !source)
            return;
        source.stop();
    }

    pauseAudio(source) {
        if (!this.compareSourceType(iLGE_2D_Source_Type_Audio) || !source || !source.root)
            return;
        source.playbackRate.value = 0;
    }

    resumeAudio(source) {
        if (!this.compareSourceType(iLGE_2D_Source_Type_Audio) || !source || !source.root)
            return;
        source.playbackRate.value = source.audioSpeed;
    }

    playAudio(source, time = 0) {
        if (!this.compareSourceType(iLGE_2D_Source_Type_Audio) || !source || !source.root)
            return;
        source.start(time);
    }

    setAudioVolume(source, volume = 1) {
        if (!this.compareSourceType(iLGE_2D_Source_Type_Audio) || !source || !source.root)
            return;
        source.volume.gain.value = volume;
    }

    setAudioLoop(source, enabled = false) {
        if (!this.compareSourceType(iLGE_2D_Source_Type_Audio) || !source || !source.root)
            return;
        source.loop = enabled ? true : false;
    }

    setAudioSpeed(source, value = 1) {
        if (!this.compareSourceType(iLGE_2D_Source_Type_Audio) || !source || !source.root)
            return;
        source.audioSpeed = value;
        source.playbackRate.value = source.audioSpeed;
    }

    setAudioDirection(source, direction = 0) {
        if (!this.compareSourceType(iLGE_2D_Source_Type_Audio) || !source || !source.root)
            return;
        source.stereoPanner.pan.value = direction;
    }

    getAudioVolumeAverage(source) {
        if (!this.compareSourceType(iLGE_2D_Source_Type_Audio) || !source || !source.root)
            return 0;

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

        max_width = Math.round(max_width);
        max_height = Math.round(max_height);

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

            if (Math.round(current_line_width + char_width) > max_width) {
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

        size.width = Math.round(Math.max(size.width, current_line_width));
        size.height = Math.round(total_height);

        return size;
    }

    constructor(source_object, id, fontwidth, fontheight, fontmap) {
        this.canvas = new OffscreenCanvas(1, 1);
        this.canvas_context = this.canvas.getContext("2d");
        this.image = source_object;
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
    enableColorReplacement = false;
    colorTolerance = 0.25;
    blendFactor = 0.5;
    inputColor = "#000000";
    replaceColor = "#000000";

    image = 0;
    type = iLGE_2D_Object_Element_Type_Sprite;
    id = "OBJID";
    visible = true;
    src_x = 0;
    src_y = 0;
    src_width = 0;
    src_height = 0;
    opacity = 1;

    constructor(source_object, id, visible, src_x, src_y, src_width, src_height) {
        this.id = id;
        this.image = source_object;
        this.visible = visible;
        this.src_x = src_x;
        this.src_y = src_y;
        this.src_width = src_width;
        this.src_height = src_height;
    }
}

class iLGE_2D_Object_Element_Sprite_Transition_Effect {
    image = 0;
    id = "OBJID";
    type = iLGE_2D_Object_Element_Type_Sprite_Transition_Effect;
    visible = false;
    size = 0;
    src_index = 0;
    oldframe = 0;

    constructor(source_object, id, visible, size) {
        this.id = id;
        this.image = source_object;
        this.visible = visible;
        this.size = size;
    }
}

class iLGE_2D_Object_Element_Rectangle {
    type = iLGE_2D_Object_Element_Type_Rectangle;
    drawingMode = iLGE_2D_Object_Element_Rectangle_DrawingMode_Fill;
    strokeLineSize = 1;
    color = "#000000";
    id = "OBJID";
    visible = true;
    opacity = 1;

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
    alignment = { vertical: "top", horizontal: "left" };
    opacity = 1;

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
    best_quality = false;
    pixel_filtering = false;
    pixel_filtering_level = 0;
    visible = true;
    opacity = 1;

    canvas_context = new iLGE_Canvas(1, 1);

    clearScreen() {
        if (this.canvas && this.canvas_context) {
            this.canvas_context.clearScreen();
        }
    }

    close() {
        if (this.canvas && this.canvas_context) {
            this.canvas_context.close();
            this.canvas_context = this.canvas = null;
        }
    }

    constructor(camera, id, visible) {
        this.canvas = this.canvas_context.getCanvas();

        this.id = id;
        this.camera = camera;
        this.visible = visible;
    }
}

class iLGE_2D_Object_Element_Collider {
    type = iLGE_2D_Object_Element_Type_Collider;
    mode = iLGE_2D_Object_Element_Collider_Mode_Discrete;
    substeps = 10;
    blocker = false;
    noclip = false;
    id = "OBJID";
    collided_objects = [];
    incorporeal_objects = [];
    pivot = new iLGE_2D_Vector2(0.5, 0.5);
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    rotation = 0;

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
    scaling_mode = iLGE_2D_Object_ScalingMode_Default;
    pivot = new iLGE_2D_Vector2(0.5, 0.5);

    x = 0;
    y = 0;
    z_order = 0;
    old_x = 0;
    old_y = 0;
    rotation = 0;
    old_rotation = 0;
    scale = 0;
    scale_output = new iLGE_2D_Vector2(1, 1);
    width = 0;
    height = 0;
    min_speed = 0;
    speed = 0;
    max_speed = 0;
    element = [];
    _element_positions = [];
    _element_positions_reverted = [];
    reset = true;
    start_function = 0;
    update_function = 0;
    onCollisionResolved_function = 0;
    radians = 0;
    radians_cos = 0;
    radians_sin = 0;
    old_radians = 0;
    old_radians_cos = 0;
    old_radians_sin = 0;
    aabb_info = {
        x: 0, y: 0,
        width: 0, height: 0,
    };
    old_aabb_info = {
        x: 0, y: 0,
        width: 0, height: 0,
    };
    vertices = [];
    original_vertices = [];
    old_vertices = [];
    old_original_vertices = [];

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

    #rotatePoint(point, vector, origin) {
        const cos = vector.x;
        const sin = vector.y;
        const x = point.x - origin.x;
        const y = point.y - origin.y;
        return new iLGE_2D_Vector2(
            cos * x - sin * y + origin.x,
            sin * x + cos * y + origin.y
        );
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

    #getAABB(vertices) {
        let minX = vertices[0].x, maxX = vertices[0].x;
        let minY = vertices[0].y, maxY = vertices[0].y;

        for (let i = 1; i < vertices.length; i++) {
            minX = Math.min(minX, vertices[i].x);
            maxX = Math.max(maxX, vertices[i].x);
            minY = Math.min(minY, vertices[i].y);
            maxY = Math.max(maxY, vertices[i].y);
        }

        return {
            x: minX, y: minY,
            width: maxX - minX, height: maxY - minY,
        };
    }

    prepareForCollision() {
        this.radians = (Math.PI / 180) * this.rotation;
        this.radians_cos = Math.cos(this.radians);
        this.radians_sin = Math.sin(this.radians);
        this.old_radians = (Math.PI / 180) * this.old_rotation;
        this.old_radians_cos = Math.cos(this.old_radians);
        this.old_radians_sin = Math.sin(this.old_radians);
        let rotation_vector = new iLGE_2D_Vector2(this.radians_cos, this.radians_sin);
        let old_rotation_vector = new iLGE_2D_Vector2(this.old_radians_cos, this.old_radians_sin);

        let vertices = [
            new iLGE_2D_Vector2(
                0, this.height
            ),
            new iLGE_2D_Vector2(
                0, 0
            ),
            new iLGE_2D_Vector2(
                this.width, this.height
            ),
            new iLGE_2D_Vector2(
                this.width, 0
            ),
        ];

        let pivot = new iLGE_2D_Vector2(
            this.width * this.pivot.x, this.height * this.pivot.y
        );

        let offset = [], old_offset = [];

        for (let i = 0; i < vertices.length; i++) {
            old_offset[i] = this.#rotatePoint(vertices[i], old_rotation_vector, pivot);
            offset[i] = this.#rotatePoint(vertices[i], rotation_vector, pivot);
        }

        this.original_vertices = [];
        this.vertices = [];
        this.old_original_vertices = [];
        this.old_vertices = [];

        let objPos = new iLGE_2D_Vector2(this.x, this.y),
            objOldPos = new iLGE_2D_Vector2(this.old_x, this.old_y);

        for (let i = 0; i < offset.length; i++) {
            this.original_vertices[i] = vertices[i].cloneIt().sum(objPos);
            this.vertices[i] = offset[i].cloneIt().sum(objPos);

            this.old_original_vertices[i] = vertices[i].cloneIt().sum(objOldPos);
            this.old_vertices[i] = old_offset[i].cloneIt().sum(objOldPos);
        }

        this.aabb_info = this.#getAABB(this.vertices);
        this.old_aabb_info = this.#getAABB(this.old_vertices);
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
        this.old_rotation = rotation;
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
    #new_width = 0;
    #new_height = 0;
    start_function = 0;
    update_function = 0;

    #string_cache = [];
    #string_cache_styles = [];

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

    globalSpeed = 1;
    deltaTime = 0;
    fps = 0;
    fps_limit = 0;

    #time_new = 0;
    #time_old = 0;
    time_diff = 0;

    pointerLock = false;

    #gamepad_toggled_buttons_string = "Gamepad_Toggled_Buttons";
    #gamepads_connected_string = "Gamepads_connected";
    #gamepad_button_string = "_Button_";
    #gamepad_axis_string = "_Axis_";

    #isStopRequested = false;
    #isPaused = false;
    #isStoped = true;

    /**
     * 
     * @returns {iLGE_2D_Source}
     */
    convertImageToSource(image) {
        return new iLGE_2D_Source(image, null, iLGE_2D_Source_Type_Image);
    }

    /**
     * 
     * @returns {Number}
     */
    #getTime() {
        return performance.now();
    }

    /**
     * 
     * @param {Array} array 
     * @param {String} property
     * @param {Boolean} negativeSort
     */
    #getOrderInfo(array, property, negativeSort = false) {
        let output = [];
        let offset = Infinity;

        for (let object of array) {
            const value = object[property];
            switch (object.type) {
                case iLGE_2D_Object_Type_Custom:
                case iLGE_2D_Object_Type_Camera:
                    if (offset > value)
                        offset = value;
                    break;
            }
        }

        offset = Math.abs(offset);

        for (let object of array) {
            const value = offset + object[property];
            switch (object.type) {
                case iLGE_2D_Object_Type_Custom:
                case iLGE_2D_Object_Type_Camera:
                    if (!output[value])
                        output[value] = {
                            order: value,
                            array: [],
                        };
                    this.#smartPush(output[value].array, object);
                    break;
            }
        }

        if (negativeSort)
            output.sort((a, b) => b.order - a.order);
        else
            output.sort((a, b) => a.order - b.order);
        return output;
    }


    /**
     * 
     * @param {Array} array 
     */
    #getZOrderInfo(array) {
        return this.#getOrderInfo(array, "z_order", false);
    }

    /**
     * 
     * @param {Array} array 
     */
    #getPriorityInfo(array) {
        return this.#getOrderInfo(array, "priority", true);
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
    }

    clearAllObjects(){
        this.#objects = [];
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
            console.error("[iLGE-2d] JSON.parse");
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

    #rotatePoint(point, vector, origin) {
        const cos = vector.x;
        const sin = vector.y;
        const x = point.x - origin.x;
        const y = point.y - origin.y;
        return new iLGE_2D_Vector2(
            cos * x - sin * y + origin.x,
            sin * x + cos * y + origin.y
        );
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
    #aabb_collision_detection(object1, object2) {
        let aabb1 = object1.aabb_info;
        let aabb2 = object2.aabb_info;

        let aabb1_left = aabb1.x;
        let aabb1_right = aabb1.x + aabb1.width;
        let aabb1_top = aabb1.y;
        let aabb1_bottom = aabb1.y + aabb1.height;

        let aabb2_left = aabb2.x;
        let aabb2_right = aabb2.x + aabb2.width;
        let aabb2_top = aabb2.y;
        let aabb2_bottom = aabb2.y + aabb2.height;

        return aabb1_left < aabb2_right && aabb2_left < aabb1_right &&
            aabb1_top < aabb2_bottom && aabb2_top < aabb1_bottom;
    }


    /**
     * 
     * @param {iLGE_2D_Object} object1 
     * @param {iLGE_2D_Object} object2 
     * @returns {Boolean}
     */
    #collision_detection(object1, object2) {
        if (!this.#aabb_collision_detection(object1, object2))
            return false;

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
            if (max1 <= min2 || max2 <= min1)
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

    /**
     * 
     * @param {iLGE_2D_Source} source 
     * @param {String} type 
     * @returns {Boolean}
     */
    checkSourceObject(source, type) {
        if (!source ||
            typeof source.compareSourceType !== "function" ||
            !source.compareSourceType(type))
            return false;
        return true;
    }

    /**
     * 
     * @param {*} canvas_context 
     * @param {iLGE_2D_Source} image 
     * @param {Number} sx 
     * @param {Number} sy 
     * @param {Number} swidth 
     * @param {Number} sheight 
     * @param {Number} dx 
     * @param {Number} dy 
     * @param {Number} width 
     * @param {Number} height 
     * @returns 
     */
    #drawImage(canvas_context, image, sx, sy, swidth, sheight, dx, dy, width, height) {
        if (!this.checkSourceObject(image, iLGE_2D_Source_Type_Image))
            return;
        const pixel_filtering = canvas_context.pixel_filtering ? true : false;
        let pixel_filtering_level;
        switch (canvas_context.pixel_filtering_level) {
            case 0:
                pixel_filtering_level = "low";
                break;
            case 1:
                pixel_filtering_level = "medium";
                break;
            case 2:
                pixel_filtering_level = "high";
                break;
            default:
                pixel_filtering_level = "low";
                break;
        }

        canvas_context.imageSmoothingQuality =
            canvas_context.mozImageSmoothingQuality =
            canvas_context.webkitImageSmoothingQuality = pixel_filtering_level;
        canvas_context.imageSmoothingEnabled =
            canvas_context.mozImageSmoothingEnabled =
            canvas_context.webkitImageSmoothingEnabled = pixel_filtering;

        canvas_context.drawImage(
            image.source,
            sx, sy, swidth, sheight,
            dx, dy, width, height
        );
    }

    #fillRect(canvas_context, color, x, y, width, height) {
        canvas_context.fillRect(color, x, y, width, height);
    }

    #strokeRect(canvas_context, color, x, y, width, height) {
        canvas_context.strokeRect(color, x, y, width, height);
    }

    #drawText(string, canvas_context, max_width, max_height, font_id, x, y, px, color, alignment_vertical, alignment_horizontal) {
        const engine = this;

        if (!string || !canvas_context || !font_id)
            return null;

        let font_object = this.#find_font(font_id);
        if (!font_object)
            return null;

        max_width = Math.round(max_width);
        max_height = Math.round(max_height);

        const font_scale = font_object.height / px;
        const font_height = font_object.height / font_scale;

        if (!canvas_context.string_cache0)
            canvas_context.string_cache0 = [];

        if (y + px > max_height)
            return null;

        let string_cache = this.#smartFind(canvas_context.string_cache0, string);
        let isResized = false;

        let string_cache_size = {
            width: Math.round(max_width * font_scale),
            height: Math.round(max_height * font_scale)
        };

        if (!string_cache) {
            string_cache = {
                width: 0,
                height: 0,
                id: string,
                canvas: new OffscreenCanvas(string_cache_size.width, string_cache_size.height),
            };
            string_cache.canvas_context = string_cache.canvas.getContext("2d");
            this.#smartPush(canvas_context.string_cache0, string_cache);
            isResized = true;
        }

        if (string_cache.canvas.width !== string_cache_size.width ||
            string_cache.canvas.height !== string_cache_size.height) {
            string_cache.canvas.width = string_cache_size.width;
            string_cache.canvas.height = string_cache_size.height;
            isResized = true;
        }

        if (font_object.canvas.height !== font_object.height)
            font_object.canvas.height = font_object.height;

        const measureCharWidth = (char, scale = font_scale) => {
            if (font_object.width_array[char])
                return font_object.width_array[char] / scale;
            return 0;
        };

        let lines = 1;
        let tx = 0;

        for (let i = 0; i < string.length; i++) {
            const char = string.charAt(i);
            const char_width = measureCharWidth(char, 1);

            if (tx + char_width > string_cache_size.width || char === '\n') {
                tx = 0, lines++;
            }

            tx += char_width;
        }

        const total_text_height = lines * font_height;
        let font_aux_y = 0;

        switch (alignment_vertical) {
            case "bottom":
                font_aux_y = Math.round(max_height - total_text_height);
                break;
            case "center":
                font_aux_y = Math.round((max_height - total_text_height) / 2);
                break;
        }

        let font_x_pos = 0;
        let font_y_pos = 0;
        let current_line_width = 0;
        let line_start = 0;

        if (isResized) {
            string_cache.width = string_cache.height = 0;

            for (let i = 0; i < string.length; i++) {
                const char = string.charAt(i);
                const char_width = measureCharWidth(char);

                if (Math.round(current_line_width + char_width) > max_width || char === '\n') {
                    drawLine(string.slice(line_start, i), font_x_pos, font_y_pos, current_line_width);
                    font_y_pos += font_height;
                    string_cache.width = Math.max(string_cache.width, current_line_width);
                    string_cache.height = Math.max(string_cache.height, font_y_pos);
                    current_line_width = 0;
                    line_start = i;
                }

                current_line_width += char_width;

                string_cache.width = Math.max(string_cache.width, current_line_width);
                string_cache.height = Math.max(string_cache.height, font_y_pos);
            }

            if (line_start < string.length) {
                drawLine(string.slice(line_start), font_x_pos, font_y_pos, current_line_width);

                string_cache.width = Math.max(string_cache.width, current_line_width)
                string_cache.height = Math.max(string_cache.height, font_y_pos);
            }
        }

        function drawLine(line, font_x_pos, font_y_pos, line_width) {
            switch (alignment_horizontal) {
                case "right":
                    font_x_pos = Math.round(max_width - line_width);
                    break;
                case "center":
                    font_x_pos = Math.round((max_width - line_width) / 2);
                    break;
            }

            for (let i = 0; i < line.length; i++) {
                let char = line.charAt(i);
                if (!font_object.width_array[char] || !font_object.map[char])
                    continue;

                const font_width = measureCharWidth(char);

                font_object.canvas_context.globalCompositeOperation = "source-over";

                if (font_object.canvas.width !== font_object.width_array[char]) {
                    font_object.canvas.width = font_object.width_array[char];
                }

                font_object.canvas_context.clearRect(0, 0, font_object.canvas.width, font_object.canvas.height);

                engine.#drawImage(
                    font_object.canvas_context, font_object.image,
                    font_object.map[char][0], font_object.map[char][1],
                    font_object.width_array[char], font_object.height,
                    0, 0,
                    font_object.width_array[char], font_object.height
                );

                string_cache.canvas_context.imageSmoothingEnabled = false;
                string_cache.canvas_context.drawImage(
                    font_object.canvas,
                    0, 0,
                    font_object.canvas.width, font_object.canvas.height,
                    Math.round(font_x_pos * font_scale), Math.round((font_aux_y + font_y_pos) * font_scale),
                    Math.round(font_width * font_scale), Math.round(font_height * font_scale)
                );

                font_x_pos += font_width;
            }
        }

        string_cache.canvas_context.globalCompositeOperation = "source-in";
        string_cache.canvas_context.fillStyle = color;
        string_cache.canvas_context.fillRect(0, 0, string_cache.canvas.width, string_cache.canvas.height);
        string_cache.canvas_context.globalCompositeOperation = "source-over";

        this.#drawImage(
            canvas_context, this.convertImageToSource(string_cache.canvas),
            0, 0, string_cache.canvas.width, string_cache.canvas.height,
            x, y, string_cache.canvas.width / font_scale, string_cache.canvas.height / font_scale,
        );

        return {
            width: string_cache.width,
            height: string_cache.height
        };
    }

    #drawTextWithStyles(string, canvas_context, max_width, max_height, font_id, x, y, px, color, alignment_vertical, alignment_horizontal) {
        if (!string || !canvas_context || !font_id)
            return;

        let font_object = this.#find_font(font_id);
        if (!font_object)
            return;

        max_width = Math.round(max_width);
        max_height = Math.round(max_height);

        if (font_object.canvas.height !== font_object.height)
            font_object.canvas.height = font_object.height;

        const font_scale = font_object.height / px;
        const font_height = font_object.height / font_scale;

        if (!canvas_context.string_cache1)
            canvas_context.string_cache1 = [];

        let string_cache_size = {
            width: Math.round(max_width * font_scale),
            height: Math.round(max_height * font_scale)
        };

        let string_cache = this.#smartFind(canvas_context.string_cache1, string);
        let isResized = false;

        if (!string_cache) {
            string_cache = {
                id: string,
                color: color,
                canvas: new OffscreenCanvas(string_cache_size.width, string_cache_size.height),
            };
            string_cache.canvas_context = string_cache.canvas.getContext("2d");
            this.#smartPush(canvas_context.string_cache1, string_cache);
            isResized = true;
        }

        if (string_cache.canvas.width !== string_cache_size.width ||
            string_cache.canvas.height !== string_cache_size.height) {
            string_cache.canvas.width = string_cache_size.width;
            string_cache.canvas.height = string_cache_size.height;
            isResized = true;
        }

        if (string_cache.color !== color) {
            string_cache.canvas_context.clearRect(0, 0, string_cache.canvas.width, string_cache.canvas.height);
            string_cache.color = color;
            isResized = true;
        }

        string_cache.canvas_context.pixel_filtering = canvas_context.pixel_filtering;
        string_cache.canvas_context.pixel_filtering_level = canvas_context.pixel_filtering_level;

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

                if (char !== '\n')
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
                            const tagStartIndex = tagContent.indexOf('>');
                            const tagEndIndex = tagContent.indexOf('</color>', tagStartIndex + 1);

                            let tagWidth = 0;

                            for (let j = tagStartIndex + 1; j < tagEndIndex; j++) {
                                const tagChar = tagContent.charAt(j);
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

                if (Math.round(line_width + char_width) > max_width || char === '\n') {
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

        if (isResized) {
            const lines = _splitLine(string);

            const total_text_height = lines.length * font_height;
            let font_aux_y = 0;

            switch (alignment_vertical) {
                case "bottom":
                    font_aux_y = Math.round(max_height - total_text_height);
                    break;
                case "center":
                    font_aux_y = Math.round((max_height - total_text_height) / 2);
                    break;
            }

            for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
                const parts = splitLine(lines[lineIndex]);
                let font_aux_x = 0, line_width = 0;

                switch (alignment_horizontal) {
                    case "right":
                        for (let partIndex = 0; partIndex < parts.length; partIndex++) {
                            const part = parts[partIndex];
                            for (let index = 0; index < part.string.length; index++) {
                                let char = part.string.charAt(index);
                                if (!font_object.width_array[char] || !font_object.map[char])
                                    continue;
                                const font_width = font_object.width_array[char] / font_scale;
                                line_width += font_width;
                            }
                        }

                        font_aux_x = Math.round(max_width - line_width);
                        break;
                    case "center":
                        for (let partIndex = 0; partIndex < parts.length; partIndex++) {
                            const part = parts[partIndex];
                            for (let index = 0; index < part.string.length; index++) {
                                let char = part.string.charAt(index);
                                if (!font_object.width_array[char] || !font_object.map[char])
                                    continue;
                                const font_width = font_object.width_array[char] / font_scale;
                                line_width += font_width;
                            }
                        }

                        font_aux_x = Math.round((max_width - line_width) / 2);
                        break;
                }

                let font_x_pos = 0;
                let font_y_pos = lineIndex * font_height;

                if (font_y_pos >= max_height)
                    break;

                for (let partIndex = 0; partIndex < parts.length; partIndex++) {
                    const part = parts[partIndex];
                    if (!part.string || part.string.length < 1)
                        continue;

                    let size = this.#drawText(
                        part.string,
                        string_cache.canvas_context,
                        string_cache_size.width,
                        string_cache_size.height,
                        font_id,
                        Math.round((font_aux_x + font_x_pos) * font_scale),
                        Math.round((font_aux_y + font_y_pos) * font_scale),
                        font_object.height,
                        part.color,
                        "top",
                        "left"
                    );

                    font_x_pos += size.width / font_scale;
                }
            }
        }

        this.#drawImage(
            canvas_context, this.convertImageToSource(string_cache.canvas),
            0, 0, string_cache.canvas.width, string_cache.canvas.height,
            x, y, max_width, max_height
        );
    }

    /**
     * 
     * @param {iLGE_2D_Object_Element_Camera_Viewer} viewer 
     * @param {iLGE_2D_Object} camera 
     * @param {iLGE_2D_Object} vcamera 
     * @param {Number} z_order 
     * @returns 
     */
    #draw_camera_scene(viewer, camera, vcamera, objects) {
        const context = viewer.canvas_context;
        const transforms = context.transforms;

        for (let object of objects) {
            switch (object.type) {
                case iLGE_2D_Object_Type_Custom:
                    if (!object.element.length)
                        continue;
                    if (this.#collision_detection(vcamera, object)) {
                        let minScale = Math.min(object.scale_output.x, object.scale_output.y);
                        let object_width = object.width * camera.scale_output;
                        let object_height = object.height * camera.scale_output;
                        let object_half_size = [object_width * object.pivot.x, object_height * object.pivot.y];
                        let offset = new iLGE_2D_Vector2(
                            object.x * camera.scale_output + object_half_size[0],
                            object.y * camera.scale_output + object_half_size[1]
                        );

                        let rotation = (Math.PI / 180) * object.rotation;
                        context.save();
                        context.translate(
                            offset.x,
                            offset.y
                        );
                        context.rotate(rotation);

                        for (let element of object.element) {
                            if (!element.visible &&
                                (element.type !== iLGE_2D_Object_Element_Type_Collider || !this.debug))
                                continue;
                            context.setGlobalAlpha(element.opacity);

                            switch (element.type) {
                                case iLGE_2D_Object_Element_Type_Collider:
                                    let elementSize = [
                                        element.width * camera.scale_output,
                                        element.height * camera.scale_output
                                    ];

                                    let elementHalfSize = [
                                        elementSize[0] * element.pivot.x,
                                        elementSize[1] * element.pivot.y
                                    ];

                                    let colliderPosition = new iLGE_2D_Vector2(
                                        object.x * camera.scale_output + object._element_positions[element.id].x * camera.scale_output + elementHalfSize[0],
                                        object.y * camera.scale_output + object._element_positions[element.id].y * camera.scale_output + elementHalfSize[1]
                                    );

                                    context.save();
                                    context.rotate((Math.PI / 180) * element.rotation);
                                    context.translate(
                                        -offset.x,
                                        -offset.y
                                    );

                                    context.translate(
                                        colliderPosition.x,
                                        colliderPosition.y
                                    );

                                    context.setGlobalAlpha(0.15);
                                    this.#fillRect(
                                        context, "#000000",
                                        -elementHalfSize[0],
                                        -elementHalfSize[1],
                                        elementSize[0],
                                        elementSize[1]
                                    );
                                    context.restore();
                                    break;
                                case iLGE_2D_Object_Element_Type_Rectangle:
                                    context.setStrokeLineSize(element.strokeLineSize * camera.scale_output * object.scale);

                                    switch (element.drawingMode) {
                                        case iLGE_2D_Object_Element_Rectangle_DrawingMode_Fill:
                                            this.#fillRect(
                                                context, element.color,
                                                -object_half_size[0] * minScale,
                                                -object_half_size[1] * minScale,
                                                object_width * minScale,
                                                object_height * minScale
                                            );
                                            break;
                                        case iLGE_2D_Object_Element_Rectangle_DrawingMode_Stroke:
                                            this.#strokeRect(
                                                context, element.color,
                                                -object_half_size[0] * minScale,
                                                -object_half_size[1] * minScale,
                                                object_width * minScale,
                                                object_height * minScale
                                            );
                                            break;
                                    }
                                    break;
                                case iLGE_2D_Object_Element_Type_Sprite:
                                    if (context.isCustomCanvas) {
                                        transforms.image.enableColorReplacement = element.enableColorReplacement;
                                        transforms.image.colorTolerance = element.colorTolerance;
                                        transforms.image.blendFactor = element.blendFactor;
                                        transforms.image.inputColor =
                                            context.parseColor(element.inputColor);
                                        transforms.image.replaceColor =
                                            context.parseColor(element.replaceColor);
                                    }

                                    this.#drawImage(
                                        context, element.image,
                                        element.src_x, element.src_y,
                                        element.src_width, element.src_height,
                                        -object_half_size[0] * minScale,
                                        -object_half_size[1] * minScale,
                                        object_width * minScale,
                                        object_height * minScale
                                    );
                                    break;
                                case iLGE_2D_Object_Element_Type_Text:
                                    if (element.styled_text)
                                        this.#drawTextWithStyles(
                                            element.string, context,
                                            object_width * minScale,
                                            object_height * minScale,
                                            element.font_id,
                                            -object_half_size[0],
                                            -object_half_size[1],
                                            element.px * camera.scale_output * minScale, element.color,
                                            element.alignment.vertical,
                                            element.alignment.horizontal
                                        );
                                    else
                                        this.#drawText(
                                            element.string, context,
                                            object_width * minScale,
                                            object_height * minScale,
                                            element.font_id,
                                            -object_half_size[0] * minScale,
                                            -object_half_size[1] * minScale,
                                            element.px * camera.scale_output * minScale, element.color,
                                            element.alignment.vertical,
                                            element.alignment.horizontal
                                        );
                                    break;
                            }
                        }
                        context.restore();
                    }
                    break;
            }
        }
    }

    /**
     * 
     * @param {iLGE_Canvas} canvas_context
     * @param {iLGE_2D_Object} camera 
     * @param {iLGE_2D_Object_Element_Camera_Viewer} viewer 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width 
     * @param {Number} height 
     */
    #draw_camera(canvas_context, camera, viewer, x, y, width, height) {
        if (!canvas_context || !camera || camera.type !== iLGE_2D_Object_Type_Camera || !camera.scene)
            return;
        let scale = 1;
        if (camera.scale > 0) {
            scale = Math.min(
                width / camera.scale,
                height / camera.scale
            );
        }

        camera.scale_output = scale;
        camera.width = Math.round(width / scale);
        camera.height = Math.round(height / scale);

        if (viewer.best_quality) {
            if (viewer.canvas.width !== width || viewer.canvas.height !== height)
                viewer.canvas_context.setScreenResolution(width, height);
        }
        else {
            if (viewer.canvas.width !== camera.width || viewer.canvas.height !== camera.height)
                viewer.canvas_context.setScreenResolution(camera.width, camera.height);
            camera.scale_output = 1;
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
        vcamera.pivot = camera.pivot;
        vcamera.prepareForCollision();
        let camera_width = Math.round(camera.width * camera.scale_output);
        let camera_height = Math.round(camera.height * camera.scale_output);
        viewer.canvas_context.save();
        for (let element of camera.element) {
            if (!element.visible)
                continue;
            switch (element.type) {
                case iLGE_2D_Object_Element_Type_Rectangle:
                    viewer.canvas_context.fillRect(
                        element.color,
                        0, 0,
                        camera_width, camera_height
                    );
                    break;
                case iLGE_2D_Object_Element_Type_Sprite:
                    viewer.canvas_context.drawImage(
                        element.image,
                        element.src_x, element.src_y,
                        element.src_width, element.src_height,
                        0, 0,
                        camera_width, camera_height
                    );
                    break;
            }
        }
        viewer.canvas_context.setCameraPivot(
            ((viewer.canvas.width * camera.pivot.x) / viewer.canvas.width) * 2 - 1,
            ((viewer.canvas.height * camera.pivot.y) / viewer.canvas.height) * 2 - 1
        );
        viewer.canvas_context.translate(-camera.x * camera.scale_output, -camera.y * camera.scale_output);
        viewer.canvas_context.rotateCamera(-vcamera.radians);

        let zOrderInfo = this.#getZOrderInfo(camera.scene.objects);
        for (const objects of zOrderInfo) {
            if (!objects)
                continue;
            this.#draw_camera_scene(viewer, camera, vcamera, objects.array);
        }

        viewer.canvas_context.restore();
        if (this.debug) {
            viewer.canvas_context.setStrokeLineSize(camera.scale_output);
            viewer.canvas_context.strokeRect(
                "#000000",
                (vcamera.x - camera.x) * camera.scale_output, (vcamera.y - camera.y) * camera.scale_output,
                vcamera.width * camera.scale_output, vcamera.height * camera.scale_output
            );
        }

        canvas_context.pixel_filtering = viewer.pixel_filtering;
        canvas_context.pixel_filtering_level = viewer.pixel_filtering_level;
        this.#drawImage(
            canvas_context, this.convertImageToSource(viewer.canvas),
            0, 0, viewer.canvas.width, viewer.canvas.height,
            x, y, width, height
        );
        canvas_context.pixel_filtering = false;
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

        effect_size = Math.round(effect_size);

        let _effect_size = Math.max(effect_size, Math.round(effect_size * effect_scale));
        let _effect_size_cache = Math.round(_effect_size / effect_size) * effect_size;
        _effect_size = _effect_size_cache;

        if (!effect_spritesheet.effectCache) {
            effect_spritesheet.effectCache = {
                canvas: new OffscreenCanvas(_effect_size, _effect_size),
                context: null,
                maxIndex: effect_spritesheet.width / effect_size
            };
            effect_spritesheet.effectCache.context = effect_spritesheet.effectCache.canvas.getContext("2d");
        }

        const cache = effect_spritesheet.effectCache;

        effect_sprite_index = Math.min(Math.max(0, Math.floor(effect_sprite_index)), cache.maxIndex - 1);

        if (cache.canvas.width !== _effect_size || cache.canvas.height !== _effect_size)
            cache.canvas.width = cache.canvas.height = _effect_size;

        cache.context.clearRect(0, 0, cache.canvas.width, cache.canvas.height);

        cache.context.imageSmoothingEnabled = false;
        cache.context.drawImage(
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

        effect_frame_context.clearRect(0, 0, effect_frame.width, effect_frame.height);

        const pattern = effect_frame_context.createPattern(cache.canvas, "repeat");
        effect_frame_context.fillStyle = pattern;
        effect_frame_context.fillRect(0, 0, effect_frame.width, effect_frame.height);

        if (newframe) {
            effect_frame_context.globalCompositeOperation = "source-in";

            effect_frame_context.drawImage(
                newframe,
                dx, dy,
                newframe.width, newframe.height,
                0, 0,
                effect_frame.width, effect_frame.height
            );
        }

        if (oldframe) {
            effect_frame_context.globalCompositeOperation = "source-out";

            effect_frame_context.drawImage(
                oldframe,
                dx, dy,
                oldframe.width, oldframe.height,
                0, 0,
                effect_frame.width, effect_frame.height
            );
        }

        return effect_frame;
    }

    #draw_hud(objects) {
        const context = this.canvas_context;
        const transforms = context.transforms;

        for (let object of objects) {
            switch (object.type) {
                case iLGE_2D_Object_Type_Custom:
                    let object_scale = object.scale_output;
                    let minScale = Math.min(object_scale.x, object_scale.y);
                    let object_width = object.width * object_scale.x,
                        object_height = object.height * object_scale.y;
                    let object_half_size = [object_width * object.pivot.x, object_height * object.pivot.y];
                    let offset = new iLGE_2D_Vector2(
                        object.x + object_half_size[0],
                        object.y + object_half_size[1]
                    );

                    context.save();
                    context.translate(
                        offset.x,
                        offset.y
                    );
                    context.rotate((Math.PI / 180) * object.rotation);
                    for (let element of object.element) {
                        if (!element.visible &&
                            (element.type !== iLGE_2D_Object_Element_Type_Collider || !this.debug))
                            continue;
                        context.setGlobalAlpha(element.opacity);

                        switch (element.type) {
                            case iLGE_2D_Object_Element_Type_Collider:
                                let elementSize = [
                                    element.width,
                                    element.height
                                ];

                                let elementHalfSize = [
                                    elementSize[0] * element.pivot.x,
                                    elementSize[1] * element.pivot.y
                                ];

                                let colliderPosition = new iLGE_2D_Vector2(
                                    object.x + object._element_positions[element.id].x + elementHalfSize[0],
                                    object.y + object._element_positions[element.id].y + elementHalfSize[1]
                                );

                                context.save();
                                context.rotate((Math.PI / 180) * element.rotation);
                                context.translate(
                                    -offset.x,
                                    -offset.y
                                );

                                context.translate(
                                    colliderPosition.x,
                                    colliderPosition.y
                                );

                                context.setGlobalAlpha(0.15);
                                this.#fillRect(
                                    context, "#000000",
                                    -elementHalfSize[0],
                                    -elementHalfSize[1],
                                    elementSize[0],
                                    elementSize[1]
                                );
                                context.restore();
                                break;
                            case iLGE_2D_Object_Element_Type_Rectangle:
                                context.setStrokeLineSize(element.strokeLineSize * minScale);

                                switch (element.drawingMode) {
                                    case iLGE_2D_Object_Element_Rectangle_DrawingMode_Fill:
                                        this.#fillRect(
                                            context, element.color,
                                            -object_half_size[0],
                                            -object_half_size[1],
                                            object_width,
                                            object_height
                                        );
                                        break;
                                    case iLGE_2D_Object_Element_Rectangle_DrawingMode_Stroke:
                                        this.#strokeRect(
                                            context, element.color,
                                            -object_half_size[0],
                                            -object_half_size[1],
                                            object_width,
                                            object_height
                                        );
                                        break;
                                }
                                break;
                            case iLGE_2D_Object_Element_Type_Sprite:
                                if (context.isCustomCanvas) {
                                    transforms.image.enableColorReplacement = element.enableColorReplacement;
                                    transforms.image.colorTolerance = element.colorTolerance;
                                    transforms.image.blendFactor = element.blendFactor;
                                    transforms.image.inputColor =
                                        context.parseColor(element.inputColor);
                                    transforms.image.replaceColor =
                                        context.parseColor(element.replaceColor);
                                }

                                this.#drawImage(
                                    context, element.image,
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
                                        element.string, context,
                                        object_width,
                                        object_height,
                                        element.font_id,
                                        -object_half_size[0],
                                        -object_half_size[1],
                                        element.px * minScale, element.color,
                                        element.alignment.vertical,
                                        element.alignment.horizontal
                                    );
                                else
                                    this.#drawText(
                                        element.string, context,
                                        object_width,
                                        object_height,
                                        element.font_id,
                                        -object_half_size[0],
                                        -object_half_size[1],
                                        element.px * minScale, element.color,
                                        element.alignment.vertical,
                                        element.alignment.horizontal
                                    );
                                break;
                            case iLGE_2D_Object_Element_Type_Camera_Viewer:
                                this.#draw_camera(
                                    context, element.camera, element,
                                    -object_half_size[0],
                                    -object_half_size[1],
                                    object_width,
                                    object_height
                                );
                                break;
                        }
                    }
                    context.restore();
                    break;
            }
        }
    }

    #draw() {
        let zOrderInfo = this.#getZOrderInfo(this.#objects);
        for (const objects of zOrderInfo) {
            if (!objects)
                continue;
            this.#draw_hud(objects.array);
        }

        this.canvas_context.setGlobalAlpha(1);
        for (let object of this.#objects) {
            if (object.type === iLGE_2D_Object_Type_Custom && object.element.length) {
                this.canvas_context.save();
                let object_scale = Math.min(object.scale_output.x, object.scale_output.y);

                for (let element of object.element) {
                    if (!element.visible)
                        continue;
                    switch (element.type) {
                        case iLGE_2D_Object_Element_Type_Sprite_Transition_Effect:
                            if (this.checkSourceObject(element.image, iLGE_2D_Source_Type_Image)) {
                                let finalframe = this.#applyTransitionEffect(
                                    this.canvas, element.oldframe,
                                    object.x, object.y,
                                    object.width, object.height,
                                    element.image.source, element.size, object_scale, element.src_index);
                                this.#drawImage(
                                    this.canvas_context, this.convertImageToSource(finalframe),
                                    0, 0,
                                    finalframe.width, finalframe.height,
                                    object.x, object.y,
                                    finalframe.width, finalframe.height
                                );
                            }
                            break;
                    }
                }
                this.canvas_context.restore();
            }
        }
        this.canvas_context.globalAlpha = 1;
    }

    /**
     * 
     * @param {iLGE_2D_Object} object 
     */
    #createAABBSwept(object) {
        const minX = Math.min(object.old_aabb_info.x, object.aabb_info.x);
        const maxX = Math.max(object.old_aabb_info.x, object.aabb_info.x);
        const minY = Math.min(object.old_aabb_info.y, object.aabb_info.y);
        const maxY = Math.max(object.old_aabb_info.y, object.aabb_info.y);

        return {
            id: object.id,
            aabb_info: {
                x: minX,
                y: minY,
                width: Math.max(object.aabb_info.width, object.old_aabb_info.width) + (maxX - minX),
                height: Math.max(object.aabb_info.height, object.old_aabb_info.height) + (maxY - minY),
            },
        };
    }

    /**
     * 
     * @param {iLGE_2D_Object} object 
     * @param {Boolean} reverted
     */
    #getElementPosition(object, element, reverted = false) {
        const objectCenter = reverted ? new iLGE_2D_Vector2(
            element.width * 0.5 - object.width * object.pivot.x,
            element.height * 0.5 - object.height * object.pivot.y
        ) : new iLGE_2D_Vector2(
            object.width * object.pivot.x - element.width * 0.5,
            object.height * object.pivot.y - element.height * 0.5
        );
        const objectPoint = reverted ? new iLGE_2D_Vector2(
            -element.x,
            -element.y
        ) : new iLGE_2D_Vector2(
            element.x,
            element.y
        );

        const rotation_vector = new iLGE_2D_Vector2(object.radians_cos, object.radians_sin);

        const rotatedObjectPoint = this.#rotatePoint(
            objectPoint,
            rotation_vector,
            objectCenter
        );

        return {
            x: rotatedObjectPoint.x,
            y: rotatedObjectPoint.y,
        };
    }

    /**
     * 
     * @param {iLGE_2D_Object} object 
     */
    #convertToAABB(object) {
        let ret = {
            id: object.id,
            root: object,
            mode: object.mode,
            substeps: object.substeps,
            old_x: object.old_aabb_info.x,
            old_y: object.old_aabb_info.y,
            x: object.aabb_info.x,
            y: object.aabb_info.y,
            width: Math.max(object.aabb_info.width, object.old_aabb_info.width),
            height: Math.max(object.aabb_info.height, object.old_aabb_info.height),
            aabb_info: {
                x: object.aabb_info.x,
                y: object.aabb_info.y,
                width: Math.max(object.aabb_info.width, object.old_aabb_info.width),
                height: Math.max(object.aabb_info.height, object.old_aabb_info.height),
            },
            prepareForCollision: function () {
                this.aabb_info = {
                    x: this.x,
                    y: this.y,
                    width: this.width,
                    height: this.height,
                };
            },
        };
        return ret;
    }

    /**
     * 
     * @param {iLGE_2D_Object} target 
     * @param {Array} array
     */
    #getPotentialCollisions(target, array) {
        let output = [];
        if (!target || !array)
            return output;
        let aabbTarget = target;
        switch (target.mode) {
            case iLGE_2D_Object_Element_Collider_Mode_ContinuousDynamic:
            case iLGE_2D_Object_Element_Collider_Mode_Continuous:
                aabbTarget = this.#createAABBSwept(target);
            default:
                for (const object of array) {
                    if (object.id === aabbTarget.id || object._collision_checked)
                        continue;
                    let aabbObject = this.#createAABBSwept(object);
                    if (this.#aabb_collision_detection(aabbTarget, aabbObject))
                        this.#smartPush(output, object);
                }
                break;
        }

        return output;
    }

    /**
     * 
     * @param {iLGE_2D_Object} target 
     * @param {Array} array
     * @param {Boolean} isBlocker
     */
    #getCollisionsByDistance(target, array, isBlocker = false) {
        let output = [];
        let isDynamic = false;
        if (!target || !array)
            return array;
        switch (target.mode) {
            case iLGE_2D_Object_Element_Collider_Mode_ContinuousDynamic:
                isDynamic = true;
            case iLGE_2D_Object_Element_Collider_Mode_Continuous:
                let aabbTarget = this.#convertToAABB(target);

                const cache0 = aabbTarget.x - aabbTarget.old_x,
                    cache1 = aabbTarget.y - aabbTarget.old_y;

                let dynamicSteps = Math.max(Math.abs(cache0), Math.abs(cache1));
                let steps = Math.min(Math.abs(aabbTarget.substeps), dynamicSteps);
                if (isDynamic)
                    steps = dynamicSteps;

                let stepsRemain = Math.max(steps, 2);

                for (let i = 0; i <= steps; i++) {
                    const t = steps ? i / steps : 1;

                    aabbTarget.x = aabbTarget.old_x + t * cache0;
                    aabbTarget.y = aabbTarget.old_y + t * cache1;
                    aabbTarget.prepareForCollision();

                    let isCollided = false;
                    let savedPositions = [];

                    for (const object of array) {
                        if (object.id === target.id)
                            continue;
                        let aabbObject = this.#convertToAABB(object);
                        let result = this.#checkContinuousCollisionAABB(
                            aabbObject, aabbTarget,
                            aabbObject.old_x, aabbObject.old_y,
                            aabbObject.x, aabbObject.y
                        );

                        if (result) {
                            let isDifferent = true;
                            for (const position of savedPositions) {
                                if (position.x === aabbObject.x && position.y === aabbObject.y &&
                                    position.width === aabbObject.width && position.height === aabbObject.height) {
                                    isDifferent = false;
                                    break;
                                }
                            }
                            if (isDifferent)
                                stepsRemain = Math.ceil(stepsRemain / 2), savedPositions.push(aabbObject);
                            this.#smartPush(output, aabbObject.root), isCollided = true;
                        }
                    }

                    if (isCollided && isBlocker && stepsRemain < 1)
                        break;
                }

                return output;

        }

        return array;
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
    #checkContinuousCollisionAABB(
        tmp_object1, tmp_object2,
        startX, startY,
        endX, endY
    ) {
        let isDynamic = false;
        switch (tmp_object1.mode) {
            case iLGE_2D_Object_Element_Collider_Mode_ContinuousDynamic:
                isDynamic = true;
            case iLGE_2D_Object_Element_Collider_Mode_Continuous:
                const cache0 = endX - startX,
                    cache1 = endY - startY;

                let dynamicSteps = Math.max(Math.abs(cache0), Math.abs(cache1));
                let steps = Math.min(Math.abs(tmp_object1.substeps), dynamicSteps);
                if (isDynamic)
                    steps = dynamicSteps;

                for (let i = 0; i <= steps; i++) {
                    const t = steps ? i / steps : 1;

                    tmp_object1.x = startX + t * cache0;
                    tmp_object1.y = startY + t * cache1;
                    tmp_object1.prepareForCollision();

                    if (this.#aabb_collision_detection(tmp_object1, tmp_object2)) {
                        return true;
                    }
                }
                break;
            default:
                if (this.#aabb_collision_detection(tmp_object1, tmp_object2)) {
                    return true;
                }
                break;
        }

        return false;
    }

    /**
     * 
     * @param {iLGE_2D_Object} tmp_object1 
     * @param {iLGE_2D_Object} tmp_object2 
     * @param {Number} startX 
     * @param {Number} startY 
     * @param {Number} endX 
     * @param {Number} endY 
     * @param {Boolean} dontRecall
     * @returns 
     */
    #checkContinuousCollision(
        tmp_object1, tmp_object2,
        startX, startY,
        endX, endY,
        dontRecall = false
    ) {
        let isDynamic = false;
        switch (tmp_object1.mode) {
            case iLGE_2D_Object_Element_Collider_Mode_ContinuousDynamic:
                isDynamic = true;
            case iLGE_2D_Object_Element_Collider_Mode_Continuous:
                const cache0 = endX - startX,
                    cache1 = endY - startY;

                let dynamicSteps = Math.max(Math.abs(cache0), Math.abs(cache1));
                let steps = Math.min(Math.abs(tmp_object1.substeps), dynamicSteps);
                if (isDynamic)
                    steps = dynamicSteps;

                let start_vector, end_vector, swept;

                if (!dontRecall) {
                    start_vector = new iLGE_2D_Vector2(tmp_object2.old_x, tmp_object2.old_y);
                    end_vector = new iLGE_2D_Vector2(tmp_object2.x, tmp_object2.y);
                    swept = this.#createAABBSwept(tmp_object2);
                }

                for (let i = 0; i <= steps; i++) {
                    const t = steps ? i / steps : 1;

                    tmp_object1.x = startX + t * cache0;
                    tmp_object1.y = startY + t * cache1;
                    tmp_object1.prepareForCollision();

                    if (!dontRecall && this.#aabb_collision_detection(tmp_object1, swept)) {
                        this.#checkContinuousCollision(
                            tmp_object2, tmp_object1,
                            start_vector.x, start_vector.y,
                            end_vector.x, end_vector.y,
                            true
                        );
                    }

                    if (this.#collision_detection(tmp_object1, tmp_object2)) {
                        return true;
                    }
                }
                break;
            default:
                if (dontRecall) {
                    if (this.#collision_detection(tmp_object1, tmp_object2)) {
                        return true;
                    }
                } else {
                    if (this.#checkContinuousCollision(
                        tmp_object2, tmp_object1,
                        tmp_object2.old_x, tmp_object2.old_y,
                        tmp_object2.x, tmp_object2.y,
                        true
                    )) {
                        return true;
                    }
                }
                break;
        }

        return false;
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
                let colliderPosition = object2._element_positions[element2.id];

                let tmp_object2 = new iLGE_2D_Object(
                    null, null, iLGE_2D_Object_Type_Custom,
                    object2.old_x + colliderPosition.x, object2.old_y + colliderPosition.y,
                    object2.old_rotation + element2.rotation, object2.scale,
                    element2.width, element2.height,
                );
                tmp_object2.mode = element2.mode;
                tmp_object2.substeps = element2.substeps;
                tmp_object2._rotatedObjectPoint = object2._element_positions_reverted[element2.id];
                tmp_object2.pivot = element2.pivot;
                tmp_object2.x = object2.x + colliderPosition.x;
                tmp_object2.y = object2.y + colliderPosition.y;
                tmp_object2.rotation = object2.rotation + element2.rotation;
                tmp_object2.prepareForCollision();

                tmp_object1.backup_x = tmp_object1.x;
                tmp_object1.backup_y = tmp_object1.y;

                let result = this.#checkContinuousCollision(
                    tmp_object1, tmp_object2,
                    tmp_object1.old_x, tmp_object1.old_y,
                    tmp_object1.x, tmp_object1.y
                );

                if (!this.#smartFind(element2.incorporeal_objects, object1.id) &&
                    result) {
                    this.#smartPush(element1.collided_objects, object2);
                    this.#smartPush(element2.collided_objects, object1);

                    if (isBlocker && !element1.blocker && element2.blocker) {
                        let overlap = this.#getOverlaps(tmp_object1.vertices, tmp_object2.vertices);

                        if (Math.abs(overlap.x) < Math.abs(overlap.y)) {
                            tmp_object1.x -= overlap.x;
                            object1.x = tmp_object1.x + tmp_object1._rotatedObjectPoint.x;
                        } else {
                            tmp_object1.y -= overlap.y;
                            object1.y = tmp_object1.y + tmp_object1._rotatedObjectPoint.y;
                        }

                        tmp_object1.prepareForCollision();
                        object1.prepareForCollision();

                        if (!this.#isPaused && typeof object1.onCollisionResolved_function === "function")
                            object1.onCollisionResolved_function(this, element1);

                        object1.prepareForCollision();
                    }
                }

                tmp_object1.resolved_x = tmp_object1.x;
                tmp_object1.resolved_y = tmp_object1.y;
                tmp_object1.x = tmp_object1.backup_x;
                tmp_object1.y = tmp_object1.backup_y;
            }
        }
    }

    #check_collisions(
        objects_with_collider_element,
        blocker_objects_with_collider_element
    ) {
        for (let i = 0; i < objects_with_collider_element.length; i++) {
            let object1 = objects_with_collider_element[i];
            if (object1._collision_checked)
                continue;
            for (let element1 of object1.element) {
                if (element1.type === iLGE_2D_Object_Element_Type_Collider) {
                    let colliderPosition = object1._element_positions[element1.id];

                    let tmp_object1 = new iLGE_2D_Object(
                        null, null, iLGE_2D_Object_Type_Custom,
                        object1.old_x + colliderPosition.x, object1.old_y + colliderPosition.y,
                        object1.old_rotation + element1.rotation, object1.scale,
                        element1.width, element1.height,
                    );
                    tmp_object1.mode = element1.mode;
                    tmp_object1.substeps = element1.substeps;
                    tmp_object1._rotatedObjectPoint = object1._element_positions_reverted[element1.id];
                    tmp_object1.pivot = element1.pivot;
                    tmp_object1.x = object1.x + colliderPosition.x;
                    tmp_object1.y = object1.y + colliderPosition.y;
                    tmp_object1.rotation = object1.rotation + element1.rotation;
                    tmp_object1.resolved_x = tmp_object1.x;
                    tmp_object1.resolved_y = tmp_object1.y;
                    tmp_object1.prepareForCollision();

                    if (!element1.noclip) {
                        let blocker_objects =
                            this.#getPotentialCollisions(tmp_object1, blocker_objects_with_collider_element);
                        blocker_objects = this.#getCollisionsByDistance(tmp_object1, blocker_objects, true);

                        for (let j = blocker_objects.length - 1; j >= 0; j--) {
                            let object2 = blocker_objects[j];
                            if (object1.id === object2.id)
                                continue;
                            this.#check_object_collision(tmp_object1, element1, object1, object2, true);
                        }
                    }

                    tmp_object1.x = tmp_object1.resolved_x;
                    tmp_object1.y = tmp_object1.resolved_y;
                    tmp_object1.prepareForCollision();

                    let normal_objects =
                        this.#getPotentialCollisions(tmp_object1, objects_with_collider_element);
                    normal_objects = this.#getCollisionsByDistance(tmp_object1, objects_with_collider_element);

                    for (let j = 0; j < normal_objects.length; j++) {
                        let object2 = normal_objects[j];
                        if (object1.id === object2.id)
                            continue;
                        this.#check_object_collision(tmp_object1, element1, object1, object2, false);
                    }
                }
            }

            object1._collision_checked = true;
        }
    }

    /**
     * 
     * @param {iLGE_2D_Scene} scene 
     * @param {iLGE_2D_Object} object 
     */
    #objects_loop_calculateScaleOutput(scene, object) {
        switch (object.scaling_mode) {
            case "default":
                if (scene === this) {
                    let scale = 0;
                    switch (typeof object.scale) {
                        case "number":
                            scale = object.scale;
                            break;
                        case "object":
                            let x = typeof object.scale.x === "number" ? object.scale.x : 0;
                            let y = typeof object.scale.y === "number" ? object.scale.y : 0;

                            scale = Math.max(x, y);
                            break;
                    }

                    let scale_output = 1;
                    if (scale !== 0)
                        scale_output = Math.min(
                            this.canvas.width / scale,
                            this.canvas.height / scale
                        );

                    object.scale_output = new iLGE_2D_Vector2(scale_output, scale_output);
                    break;
                }
            default:
                switch (typeof object.scale) {
                    case "number":
                        object.scale_output = new iLGE_2D_Vector2(object.scale, object.scale);
                        break;
                    case "object":
                        let x = typeof object.scale.x === "number" ? object.scale.x : 0;
                        let y = typeof object.scale.y === "number" ? object.scale.y : 0;

                        object.scale_output = new iLGE_2D_Vector2(x, y);
                        break;
                }
                break;
        }
    }

    #objectsUpdate(
        priority, scene = this
    ) {
        for (const pArray of priority) {
            if (!pArray)
                continue;

            for (let object of pArray.array) {
                const isCustom = object.type === iLGE_2D_Object_Type_Custom,
                    isCamera = object.type === iLGE_2D_Object_Type_Camera;

                if (isCustom || isCamera) {
                    object.scene = scene;
                    object.old_x = object.x;
                    object.old_y = object.y;
                    object.old_rotation = object.rotation;

                    if (isCustom)
                        this.#objects_loop_calculateScaleOutput(scene, object);

                    if (!this.#isPaused && object.enabled) {
                        if (typeof object.start_function === "function" && object.reset) {
                            object.start_function(this);
                            object.reset = false;
                        }

                        if (typeof object.update_function === "function")
                            object.update_function(this);

                        object.delay = Math.max(object.delay - this.time_diff, 0);
                    }

                    object.prepareForCollision();

                    this.#objects_loop_calculateScaleOutput(scene, object);
                }
            }
        }
    }

    #objectsLoop(
        objects_with_collider_element, blocker_objects_with_collider_element,
        priority, scene = this
    ) {
        for (const pArray of priority) {
            if (!pArray)
                continue;

            for (let object of pArray.array) {
                const isCustom = object.type === iLGE_2D_Object_Type_Custom,
                    isCamera = object.type === iLGE_2D_Object_Type_Camera;

                if (isCustom || isCamera) {
                    object._collision_checked = false;
                    object._element_positions = [];
                    object._element_positions_reverted = [];

                    for (let element of object.element) {
                        if (element.type === iLGE_2D_Object_Element_Type_Collider) {
                            element.collided_objects = [];
                            object._element_positions[element.id] = this.#getElementPosition(object, element);
                            object._element_positions_reverted[element.id] = this.#getElementPosition(object, element, true);

                            if (element.blocker)
                                this.#smartPush(blocker_objects_with_collider_element, object);
                            else
                                this.#smartPush(objects_with_collider_element, object);
                        }
                    }
                }
            }
        }
    }

    #requestAnimationFrame(animation_function) {
        if (animation_function)
            window.requestAnimationFrame(animation_function);
    }

    stop() {
        this.#isStopRequested = true;
    }

    isPaused() {
        return this.#isPaused ? true : false;
    }

    isStoped(){
        return this.#isStoped ? true : false;
    }

    resume() {
        this.#isPaused = false;
    }

    pause() {
        this.#isPaused = true;
    }

    start() {
        if (this.#isStopRequested) {
            this.#isStopRequested = false;
            this.#isStoped = true;
            return;
        }

        this.#isStoped = false;

        this.#time_new = this.#getTime();
        this.time_diff = Math.max(this.#time_new - this.#time_old, 0);
        this.#time_old = this.#time_new;

        this.deltaTime = this.time_diff / (1000 / (60 * Math.max(this.globalSpeed, 0.00000001)));
        this.fps = Math.round(1000 / (this.time_diff ? this.time_diff : 1));

        if (this.#new_width !== this.width || this.#new_height !== this.height) {
            this.width = this.#new_width;
            this.height = this.#new_height;
            this.canvas_context.setScreenResolution(this.width, this.height);
        }

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

        if (typeof this.start_function === "function" && this.reset) {
            this.start_function(this);
            this.reset = false;
            this.#requestAnimationFrame(this.start);
            return;
        }
        if (typeof this.update_function === "function") {
            this.update_function(this);
        }

        if (this.#isPaused)
            this.deltaTime = 0;

        this.#gamepad_handler(null, this, null);

        let objects_with_collider_element = [];
        let blocker_objects_with_collider_element = [];
        let priority = this.#getPriorityInfo(this.#objects);

        for (let object of this.#objects) {
            if (object.type === iLGE_2D_Object_Type_Scene && object.enabled) {
                let objects_with_collider_element_scene = [];
                let blocker_objects_with_collider_element_scene = [];
                let priority_scene = this.#getPriorityInfo(object.objects);

                this.#objectsUpdate(
                    priority_scene, object
                );

                priority_scene = this.#getPriorityInfo(object.objects);

                this.#objectsLoop(
                    objects_with_collider_element_scene,
                    blocker_objects_with_collider_element_scene,
                    priority_scene, object
                );

                this.#check_collisions(
                    objects_with_collider_element_scene,
                    blocker_objects_with_collider_element_scene
                );
            }
        }

        this.#objectsUpdate(
            priority, this
        );

        priority = this.#getPriorityInfo(this.#objects);

        this.#objectsLoop(
            objects_with_collider_element,
            blocker_objects_with_collider_element,
            priority
        );

        this.#check_collisions(
            objects_with_collider_element,
            blocker_objects_with_collider_element
        );

        this.#draw();

        if (this.fps_limit > 0) {
            this.#time_new = this.#getTime();
            this.time_diff = Math.max(this.#time_new - this.#time_old, 0);

            let timeout = (1000 / this.fps_limit) - this.time_diff;

            if (timeout < 1) {
                this.#requestAnimationFrame(this.start);
            }
            else {
                let isThis = this;
                setTimeout(function () {
                    isThis.#requestAnimationFrame(isThis.start);
                }, timeout);
            }
        }
        else {
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
        isThis.#new_width = Math.round(window.innerWidth * window.devicePixelRatio);
        isThis.#new_height = Math.round(window.innerHeight * window.devicePixelRatio);
        console.log("[iLGE-2d] width: " + isThis.#new_width + ", height: " + isThis.#new_height + ";");
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
                                console.warn("[iLGE-2d] " + deadzone_string + " is null");
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
        if (!this.canvas)
            return null;
        let newframe = new OffscreenCanvas(this.canvas.width, this.canvas.height);
        let context = newframe.getContext("2d", { alpha: false });
        context.drawImage(
            this.canvas,
            0, 0, newframe.width, newframe.height,
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

    clearScreen() {
        if (this.canvas && this.canvas_context)
            this.canvas_context.clearScreen();
    }

    setScreenResolution(width, height) {
        this.auto_resize = false;
        this.#new_width = width;
        this.#new_height = height;
    }

    constructor(gameid, resource_files, html_div, width, height, auto_resize) {
        width = Math.max(1, width);
        height = Math.max(1, height);

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
        this.auto_resize = auto_resize ? true : false;
        this.canvas_context = new iLGE_Canvas(1, 1);
        this.canvas = this.canvas_context.getCanvas();
        this.width = this.#new_width = width;
        this.height = this.#new_height = height;
        this.canvas_context.setScreenResolution(this.width, this.height);

        this.#resize_handler(null, isThis);
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