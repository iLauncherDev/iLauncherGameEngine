const cursorSrc = "CursorSprite.png";

class MapMatrix {
    x = 0;
    y = 0;
    array = [];
    safe_zones = [0];
    visible_zones = [0];

    /**
     * 
     * @param {Number} safe_zone 
     */
    addSafeZone(safe_zone = 0) {
        for (const zone of this.safe_zones) {
            if (zone === safe_zone)
                return;
        }
        this.safe_zones.push(safe_zone);
    }

    /**
     * 
     * @param {Number} visible_zone 
     */
    addVisibleZone(visible_zone = 0) {
        for (const zone of this.visible_zones) {
            if (zone === visible_zone)
                return;
        }
        this.visible_zones.push(visible_zone);
    }

    /**
     * 
     * @param {iLGE_2D_Vector2} vector 
     * @returns {iLGE_2D_Vector2}
     */
    getArrayVector(vector) {
        let convertedVector = new iLGE_2D_Vector2(
            Math.floor(vector.x / this.size),
            Math.floor(vector.y / this.size)
        );
        if (convertedVector.x < this.x ||
            convertedVector.y < this.y ||
            convertedVector.y >= this.array.length ||
            convertedVector.x >= this.array[convertedVector.y].length) {
            return null;
        }
        convertedVector.x -= this.x;
        convertedVector.y -= this.y;
        return convertedVector;
    }

    /**
     * 
     * @param {iLGE_2D_Vector2} vector 
     * @returns {iLGE_2D_Vector2}
     */
    getArrayCellCenter(vector) {
        if (!vector ||
            vector.y >= this.array.length ||
            vector.x >= this.array[vector.y].length)
            return null;
        return new iLGE_2D_Vector2(
            (vector.x + this.x + 0.5) * this.size,
            (vector.y + this.y + 0.5) * this.size
        );
    }

    /**
     * 
     * @param {Number} zone 
     * @returns {Number}
     */
    countZones(zone = 0) {
        let zones = 0;
        for (let y = 0; y < this.array.length; y++) {
            let horizontal = this.array[y];
            for (let x = 0; x < horizontal.length; x++) {
                if (horizontal[x] === zone)
                    zones++;
            }
        }
        return zones;
    }

    /**
     * 
     * @param {Number} zone 
     * @param {Number} index 
     */
    getZonePosition(zone = 0, index = 0) {
        for (let y = 0; y < this.array.length; y++) {
            let horizontal = this.array[y];
            for (let x = 0; x < horizontal.length; x++) {
                if (horizontal[x] === zone) {
                    if (index < 1)
                        return this.getArrayCellCenter(new iLGE_2D_Vector2(x, y));
                    index--;
                }
            }
        }
        return null;
    }

    /**
     * 
     * @param {iLGE_2D_Object} object1 
     * @param {iLGE_2D_Object} object2 
     * @returns {Boolean}
     */
    canSee(object1, object2) {
        let tmpVector1 = new iLGE_2D_Vector2(
            object1.x + object1.width / 2,
            object1.y + object1.height / 2
        );
        let tmpVector2 = new iLGE_2D_Vector2(
            object2.x + object2.width / 2,
            object2.y + object2.height / 2
        );
        let convertedVector1 = new iLGE_2D_Vector2(
            Math.floor(tmpVector1.x / this.size),
            Math.floor(tmpVector1.y / this.size)
        );
        let convertedVector2 = new iLGE_2D_Vector2(
            Math.floor(tmpVector2.x / this.size),
            Math.floor(tmpVector2.y / this.size)
        );
        if (convertedVector1.x < this.x ||
            convertedVector1.y < this.y ||
            convertedVector1.y >= this.array.length ||
            convertedVector1.x >= this.array[convertedVector1.y].length) {
            return false;
        }
        if (convertedVector2.x < this.x ||
            convertedVector2.y < this.y ||
            convertedVector2.y >= this.array.length ||
            convertedVector2.x >= this.array[convertedVector2.y].length) {
            return false;
        }
        convertedVector1.x -= this.x;
        convertedVector1.y -= this.y;
        convertedVector2.x -= this.x;
        convertedVector2.y -= this.y;
        const dx = Math.abs(convertedVector2.x - convertedVector1.x);
        const dy = Math.abs(convertedVector2.y - convertedVector1.y);
        const sx = (convertedVector1.x < convertedVector2.x) ? 1 : -1;
        const sy = (convertedVector1.y < convertedVector2.y) ? 1 : -1;
        let err = dx - dy;
        while (
            convertedVector1.x !== convertedVector2.x ||
            convertedVector1.y !== convertedVector2.y
        ) {
            if (!this.visible_zones.includes(this.array[convertedVector1.y][convertedVector1.x])) {
                return false;
            }
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                convertedVector1.x += sx;
            }
            if (e2 < dx) {
                err += dx;
                convertedVector1.y += sy;
            }
        }
        return this.visible_zones.includes(this.array[convertedVector1.y][convertedVector1.x]) ?
            true : false;
    }

    constructor(array, x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.array = array;
    }
}

let classic_map = new MapMatrix([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
    [1, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 2, 0, 0, 0, 0, 1, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 2, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 2, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 1, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 1],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 2, 0, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 2, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 2, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 2, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 9, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
], 0, 0, 256);

classic_map.addSafeZone(2);
classic_map.addSafeZone(8);
classic_map.addSafeZone(9);
classic_map.addVisibleZone(2);
classic_map.addVisibleZone(8);
classic_map.addVisibleZone(9);

function onLoad() {
    function loadMap(scene, map) {
        let offset = new iLGE_2D_Vector2(
            map.x * map.size,
            map.y * map.size
        );
        for (let y = 0; y < map.array.length; y++) {
            let array = map.array[y];
            for (let x = 0; x < array.length; x++) {
                let value = array[x];
                switch (value) {
                    case 1:
                        let wall = new iLGE_2D_GameObject("Wall_" + (y * array.length + x), "wall");
                        wall.transform.position = new iLGE_2D_Vector2(
                            x * map.size + offset.x,
                            y * map.size + offset.y
                        );
                        wall.transform.size = new iLGE_2D_Vector2(
                            map.size,
                            map.size
                        );
                        wall.addComponent(new iLGE_2D_GameObject_Component_Rectangle("#ffff00", "rect", true));
                        wall.addComponent(new iLGE_2D_GameObject_Component_Collider(
                            true, false, "blocker",
                            0, 0, wall.transform.size.x, wall.transform.size.y
                        ));
                        scene.addObject(wall);
                        break;
                }
            }
        }
    }

    let game = new iLGE_2D_Engine(
        "Test",
        [
            cursorSrc,
            "PDV437.png",
            "PRO_ATLAS.png",
            "DitherSprites.png",
            "clang.ogg"
        ],
        document.getElementById("GameScreen"),
        320, 200,
        true
    );

    game.start_function = function () {
        this.control_map_load();
        this.control_map_set_default("Up", "Keyboard_Code_KeyW");
        this.control_map_set_default("Down", "Keyboard_Code_KeyS");
        this.control_map_set_default("Left", "Keyboard_Code_KeyA");
        this.control_map_set_default("Right", "Keyboard_Code_KeyD");
        this.control_map_set_default("RUN",
            [
                "Keyboard_Code_ShiftLeft",
                "Keyboard_Code_ShiftRight",
                "Gamepad0_Button_10"
            ]
        );
        this.control_map_set_default("Interact",
            [
                "Keyboard_Code_KeyQ",
                "Gamepad0_Button_2",
                "Mouse_Button_0"
            ]
        );
        this.control_map_set_default("Transition",
            [
                "Keyboard_Code_KeyE",
                "Gamepad0_Button_0"
            ]
        );
        this.control_map_set_default("MovementX", "Gamepad0_Axis_0_Positive");
        this.control_map_set_default("MovementY", "Gamepad0_Axis_1_Positive");
        this.control_map_set_default("MovementX1",
            [
                "Gamepad0_Axis_3_Negative"
            ]
        );
        this.control_map_set_default("CursorX",
            [
                "Mouse_ClientX_Positive"
            ]
        );
        this.control_map_set_default("CursorY",
            [
                "Mouse_ClientY_Positive"
            ]
        );
        this.control_map_set_default("CursorMovementX",
            [
                "Mouse_MovementX_Positive"
            ]
        );
        this.control_map_set_default("CursorMovementY",
            [
                "Mouse_MovementY_Positive"
            ]
        );
        this.control_map_set_default("TouchX", "Touch_ClientX_Positive");
        this.control_map_set_default("TouchY", "Touch_ClientY_Positive");
        this.control_map_set_default("TouchMovementX", "Touch_MovementX_Positive");
        this.control_map_set_default("TouchMovementY", "Touch_MovementY_Positive");
        this.control_map_restore_default();
        this.control_map_save();

        const playerScript = {
            object: new iLGE_2D_GameObject(),
            id: "playerScript",
            type: iLGE_2D_GameObject_Component_Type_Script,
            min_speed: 8,
            speed: 0,
            max_speed: 16,
            mouseSensitivity: 1000 / 180,

            /**
             * 
             * @param {iLGE_2D_Engine} engine 
             */
            Update: function (engine) {
                let cursorMovementX = engine.control_map_get("CursorMovementX", false);
                let Left = engine.control_map_get("MovementX", true) | (
                    engine.control_map_get("Right", true) - engine.control_map_get("Left", true)
                );
                let Up = engine.control_map_get("MovementY", true) | (
                    engine.control_map_get("Down", true) - engine.control_map_get("Up", true)
                );

                if (engine.control_map_get("RUN", true))
                    this.speed = this.max_speed;
                else
                    this.speed = this.min_speed;

                const movement = new iLGE_2D_Vector2(Left, Up);
                movement.transform(this.object.getRotationVector());
                movement.normalize();

                movement.multiply(new iLGE_2D_Vector2(
                    this.speed * engine.deltaTime,
                    this.speed * engine.deltaTime
                ));

                const transform = this.object.transform;
                transform.translate(movement.x, movement.y);
                transform.rotate(cursorMovementX / this.mouseSensitivity);
            },
        };

        let scene = new iLGE_2D_Scene("main", "scene", true);

        loadMap(scene, classic_map);

        let zonePosition = classic_map.getZonePosition(9);

        let player = new iLGE_2D_GameObject("player", "player");
        player.zOrder = -1;
        player.transform.position = zonePosition;
        player.transform.size = new iLGE_2D_Vector2(32, 64);
        player.collider = new iLGE_2D_GameObject_Component_Collider(
            false, false, "collider", 0, 0, 16, 16
        );
        player.collider.transform.position.x = (player.transform.size.x - player.collider.transform.size.x) / 2;
        player.collider.transform.position.y = (player.transform.size.y - player.collider.transform.size.y) / 2;
        player.collider.mode = iLGE_2D_GameObject_Component_Collider_Mode_ContinuousDynamic;
        player.addComponent(new iLGE_2D_GameObject_Component_Rectangle("#0000ff", "rect", true));
        player.addComponent(player.collider);
        player.addComponent(playerScript);

        let camera = new iLGE_2D_GameObject("camera", "camera", iLGE_2D_GameObject_Type_Camera, scene);
        camera.addComponent(new iLGE_2D_GameObject_Component_Rectangle("#ffffff", "rectangle", true));
        camera.transform.scaling.x = camera.transform.scaling.y = 360;

        scene.addObject(player);
        scene.addObject(camera);

        const viewerScript = {
            object: new iLGE_2D_GameObject(),
            id: "viewerScript",
            type: iLGE_2D_GameObject_Component_Type_Script,
            cameraTransform: camera.transform,
            playerTransform: player.transform,

            /**
             * 
             * @param {iLGE_2D_Engine} engine 
             */
            Update: function (engine) {
                const transform = this.object.transform;

                transform.size.x = engine.width;
                transform.size.y = engine.height;
                this.cameraTransform.position.x =
                    this.playerTransform.position.x - (this.cameraTransform.size.x - this.playerTransform.size.x) / 2;
                this.cameraTransform.position.y =
                    this.playerTransform.position.y - (this.cameraTransform.size.y - this.playerTransform.size.y) / 2;
                this.cameraTransform.rotation = this.playerTransform.rotation;
            },
        }

        let cameraViewer = new iLGE_2D_GameObject("cameraViewer", "viewer");
        let viewer = new iLGE_2D_GameObject_Component_Camera_Viewer(camera, "viewer", true);
        viewer.best_quality = true;
        cameraViewer.viewer = viewer;
        cameraViewer.addComponent(viewer);
        cameraViewer.addComponent(viewerScript);

        this.addObject(cameraViewer);
        this.addObject(scene);
    };

    game.update_function = function () {
        this.clearScreen();
    };

    game.debug = true;
    game.pointerLock = true;
    game.start();
}