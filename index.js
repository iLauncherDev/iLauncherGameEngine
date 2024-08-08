let game = new iLGE_2D_Engine(
    "Test",
    [
        "CursorSprite.png",
        "PDV437.png",
        "PRO_ATLAS.png",
        "DitherSprites.png",
        "clang.ogg"
    ],
    document.getElementById("GameScreen"),
    320, 200,
    true
);

game.debug = true;

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
                    /* setup the wall */
                    let wall = new iLGE_2D_Object(
                        "Wall_" + (y * array.length + x), "wall",
                        iLGE_2D_Object_Type_Custom,
                        x * map.size + offset.x, y * map.size + offset.y, 0, 1, map.size, map.size
                    );
                    /* add rectangle to wall */
                    wall.addElement(new iLGE_2D_Object_Element_Rectangle("#ffff00", "rect", true));
                    /* add collider to wall */
                    wall.addElement(new iLGE_2D_Object_Element_Collider(
                        true, false, "blocker",
                        0, 0, wall.width, wall.height
                    ));
                    scene.addObject(wall);
                    break;
            }
        }
    }
}

game.start_function = function (engine) {
    let scene = new iLGE_2D_Scene("MyScene", "scene", true);
    this.addObject(scene);

    this.title = "Eat The Walls!";

    let PRO_ATLAS = new iLGE_2D_Object_Font(
        this.findSourceObject("PRO_ATLAS.png"), "PRO_ATLAS",
        [
            34, 17, 30, 30, 34, 32, 32, 34, 30,
            32, 30, 30, 27, 30, 30, 27, 27,
            27, 7, 22, 30, 7, 37, 27, 27,
            27, 27, 25, 25, 27, 27, 30, 39,
            34, 32, 30, 37, 30, 34, 34, 34,
            27, 39, 39, 32, 37, 32, 32, 52,
            42, 44, 30, 52, 34, 37, 39, 39,
            37, 59, 42, 37, 39, 7, 12, 44,
            10, 30, 30, 20, 17, 39, 27, 22,
            25, 12, 12, 27, 7, 17, 7, 49,
            52, 30, 27, 39, 22, 22, 17, 17, 24,
        ],
        72,
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!;%:?*()_+-=.,/|\"'@#$^&{}[] "
    );

    let PDV437 = new iLGE_2D_Object_Font(
        this.findSourceObject("PDV437.png"), "PDV437",
        9,
        16,
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!;%:?*()_+-=.,/|\"'@#$^&{}[] "
    );

    this.addObject(PRO_ATLAS);
    this.addObject(PDV437);

    let clang_audio = this.findSourceObject("clang.ogg");
    let camera = new iLGE_2D_Object("MyCamera", "camera", iLGE_2D_Object_Type_Camera, 0, 0, 0, 360, 0, 0, scene);
    let camera_hud = new iLGE_2D_Object("MyCameraHud", "camera_hud");
    camera_hud.viewer = new iLGE_2D_Object_Element_Camera_Viewer(
        camera, "Hud", true
    );
    camera_hud.addElement(
        camera_hud.viewer
    );
    camera_hud.viewer.best_quality = true;

    let transition_ended = false, transition_loop = false;

    let transition_effect = new iLGE_2D_Object("Transition_Effect");
    transition_effect.dither = new iLGE_2D_Object_Element_Sprite_Transition_Effect(
        this.findSourceObject("DitherSprites.png"), "Dither", false, 4
    );
    transition_effect.addElement(transition_effect.dither);

    let player = new iLGE_2D_Object("player", "player", iLGE_2D_Object_Type_Custom, 128, 128, 0, 1, 32, 64);

    player.addElement(
        new iLGE_2D_Object_Element_Rectangle("#0000ff", "wall", true)
    );

    let transition_toggle = false;

    camera.addElement(
        new iLGE_2D_Object_Element_Rectangle("#ffffff", "wall", true)
    );

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

    scene.addObject(player);
    this.addObject(transition_effect);
    loadMap(scene, classic_map);

    let position = classic_map.getZonePosition(9);
    player.x = position.x - player.width / 2;
    player.y = position.y - player.height / 2;

    let total_walls = scene.countObjectByClass("wall"), eated_walls = 0;

    /**
     * 
     * @param {iLGE_2D_Engine} engine 
     */
    function DitherTransition(engine) {
        transition_effect.width = engine.width;
        transition_effect.height = engine.height;
        if (transition_effect.dither.src_index < 17 && transition_effect.dither.visible) {
            transition_effect.dither.src_index += engine.deltaTime * 1;
            return true;
        }
        else if (transition_effect.dither.visible) {
            transition_effect.dither.visible = false;
            transition_effect.dither.src_index = 0;
            return false;
        }
        transition_effect.dither.visible = true;
        return true;
    }

    /**
     * 
     * @param {iLGE_2D_Engine} engine 
     */
    player.start_function = function (engine) {
        this.min_speed = 8;
        this.max_speed = 16;
        this.stamina_level = new iLGE_2D_Object(
            "hud0", null, iLGE_2D_Object_Type_Custom,
            0, 0, 0, 320, 9 * 4, 16
        );
        this.game_title = new iLGE_2D_Object(
            "hud1", null, iLGE_2D_Object_Type_Custom,
            0, 0, 0, 320, 320, 320
        );
        this.game_title.addElement(
            new iLGE_2D_Object_Element_Text(
                "PDV437", "PDV437", null, 16, "#000000", true
            )
        );
        this.game_title.element[0].alignment.horizontal = "center";
        this.game_title.element[0].styled_text = true;
        this.cursor = new iLGE_2D_Object(
            "hud2", "cursor", iLGE_2D_Object_Type_Custom,
            0, 0, 0, 680, 48, 68
        );
        this.cursor.addElement(
            new iLGE_2D_Object_Element_Sprite(
                engine.findSourceObject("CursorSprite.png"),
                "CursorSprite", true, 0, 0, 48, 68
            )
        );
        this.stamina_level.addElement(
            new iLGE_2D_Object_Element_Text(
                "PDV437", "PDV437", null, 16, "#000000", true
            )
        );
        this.stamina_hud_green = new iLGE_2D_Object(
            "hud3", null, iLGE_2D_Object_Type_Custom,
            0, 0, 0, 320, 128, 8
        );
        this.stamina_hud_green.addElement(
            new iLGE_2D_Object_Element_Rectangle("#00ff00", "wall", true)
        );
        this.stamina_hud_red = new iLGE_2D_Object(
            "hud4", null, iLGE_2D_Object_Type_Custom, 0, 0, this.stamina_hud_green.rotation,
            this.stamina_hud_green.scale, this.stamina_hud_green.width, this.stamina_hud_green.height, 0, 0);
        this.stamina_hud_red.addElement(
            new iLGE_2D_Object_Element_Rectangle("#ff0000", "wall", true)
        );
        this.cursor.z_order = 1;
        engine.addObject(this.cursor);
        engine.addObject(this.game_title);
        engine.addObject(this.stamina_level);
        engine.addObject(this.stamina_hud_red);
        engine.addObject(this.stamina_hud_green);
        this.collider = new iLGE_2D_Object_Element_Collider(
            false, false, this.id + "_collder",
            0, 0, 16, 16
        );
        this.collider.x = (this.width - this.collider.width) / 2;
        this.collider.y = (this.height - this.collider.height) / 2;
        this.collider.rotation = 45;
        
        console.log("Hello, it's me, " + this.id + "!");
        engine.pointerLock = true;
        this.max_stamina = 2048;
        this.stamina = this.max_stamina;
        this.gamepad_sensitivity = 16;
        this.mouse_sensitivity = 1 / 4;
        this.camera_rotation_delay = 4;
        this.addElement(
            this.collider
        );
        /**
         * 
         * @param {iLGE_2D_Engine} engine 
         */
        this.cursor_update = function (engine, movementX, movementY, isMovement) {
            if (isMovement) {
                this.cursor.x += movementX;
                this.cursor.y += movementY;
            }
            else {
                this.cursor.x = movementX;
                this.cursor.y = movementY;
            }
            if (this.cursor.x < 0)
                this.cursor.x = -1;
            if (this.cursor.y < 0)
                this.cursor.y = -1;
            if (this.cursor.x > engine.width)
                this.cursor.x = engine.width - 1;
            if (this.cursor.y > engine.height)
                this.cursor.y = engine.height - 1;
        };

        this.updateCameraPosition = function () {
            camera.x = (this.x - (camera.width - this.width) / 2);
            camera.y = (this.y - (camera.height - this.height) / 2);
        }
        this.onCollisionResolved_function = this.updateCameraPosition;
    }

    /**
     * 
     * @param {iLGE_2D_Engine} engine 
     */
    player.update_function = function (engine) {
        let movementX = engine.control_map_get("CursorMovementX", false),
            movementY = engine.control_map_get("CursorMovementY", false),
            clientX = engine.control_map_get("CursorX", true),
            clientY = engine.control_map_get("CursorY", true),
            touchmovementX = engine.control_map_get("TouchMovementX", false),
            touchmovementY = engine.control_map_get("TouchMovementY", false);
        camera_hud.width = engine.width;
        camera_hud.height = engine.height;
        if (touchmovementX && touchmovementY) {
            for (let i = 0; i < touchmovementX.length; i++) {
                if (touchmovementX[i].state === "Down" && touchmovementY[i].state === "Down") {
                    movementX = touchmovementX[i].value;
                    movementY = touchmovementY[i].value;
                }
            }
        }
        this.cursor_update(engine, movementX, movementY, true);
        this.game_title.element[0].string =
            engine.title + "\n" +
            eated_walls + "/" + total_walls + " Eated Walls";
        let stamina = this.stamina / this.max_stamina;
        this.game_title.x = (engine.width - this.game_title.width * this.game_title.scale_output) / 2;
        this.game_title.y = 4 * this.game_title.scale_output;
        this.stamina_hud_green.width = stamina * this.stamina_hud_red.width;
        this.stamina_hud_red.x = 4 * this.stamina_hud_red.scale_output;
        this.stamina_hud_green.x = this.stamina_hud_red.x;
        this.stamina_hud_red.y =
            (engine.height - this.stamina_hud_red.height * this.stamina_hud_red.scale_output)
            - 4 * this.stamina_hud_red.scale_output;
        this.stamina_hud_green.y = this.stamina_hud_red.y;
        this.stamina_level.element[0].string = "Stamina " + Math.floor(stamina * 100) + "%";
        this.stamina_level.width = this.stamina_level.element[0].string.length * 9 + 1;
        this.stamina_level.y =
            this.stamina_hud_red.y - this.stamina_level.height * this.stamina_level.scale_output;
        this.stamina_level.x =
            this.stamina_hud_red.x +
            (this.stamina_hud_red.width * this.stamina_hud_red.scale_output
                - this.stamina_level.width * this.stamina_level.scale_output) / 2;
        if (!transition_ended) {
            transition_ended = !DitherTransition(engine);
            return;
        }
        else if (transition_loop) {
            transition_effect.dither.oldframe = engine.getFrameData();
            DitherTransition(engine);
        }
        else {
            transition_effect.dither.visible = false;
            transition_effect.dither.src_index = 0;
        }
        if (engine.control_map_get("Transition", true)) {

            if (!transition_toggle) {
                transition_loop = transition_loop ? false : true;
            }
            transition_toggle = true;
        }
        else {
            transition_toggle = false;
        }
        let Left = engine.control_map_get("MovementX", true) | (
            engine.control_map_get("Right", true) - engine.control_map_get("Left", true)
        );
        let Up = engine.control_map_get("MovementY", true) | (
            engine.control_map_get("Down", true) - engine.control_map_get("Up", true)
        );
        let run = engine.control_map_get("RUN", true);
        let collided_wall = null, collided_index = 0;
        this.rotation +=
            (movementX * this.mouse_sensitivity -
                engine.control_map_get("MovementX1", false) * this.gamepad_sensitivity * engine.deltaTime);
        let vector_movement = new iLGE_2D_Vector2(
            Left,
            Up
        );
        vector_movement.transform(this.getRotationVector());
        vector_movement.normalize();
        this.x += vector_movement.x * this.speed * engine.deltaTime;
        this.y += vector_movement.y * this.speed * engine.deltaTime;
        if (run && this.stamina > 0) {
            this.speed = this.max_speed;
            if (vector_movement.x || vector_movement.y)
                this.stamina -= engine.deltaTime * this.min_speed;
            if (this.stamina < 0)
                this.stamina = 0;
        }
        else {
            this.speed = this.min_speed;
        }
        if (!vector_movement.x && !vector_movement.y) {
            this.stamina += engine.deltaTime * this.max_speed;
            if (this.stamina > this.max_stamina)
                this.stamina = this.max_stamina;
        }
        this.updateCameraPosition();
        if (camera.rotation < this.rotation) {
            camera.rotation +=
                (this.rotation - camera.rotation) / this.camera_rotation_delay *
                engine.deltaTime;
            if (camera.rotation > this.rotation)
                camera.rotation = this.rotation;
        }
        else {
            camera.rotation +=
                (this.rotation - camera.rotation) / this.camera_rotation_delay *
                engine.deltaTime;
            if (camera.rotation < this.rotation)
                camera.rotation = this.rotation;
        }
        if (engine.control_map_get("Interact", true)) {
            collided_wall = this.collider.collidedWithByClass("wall", collided_index++);
            while (collided_wall) {
                /**
                 * 
                 * @param {iLGE_2D_Engine} engine 
                 */
                collided_wall.start_function = function (engine) {
                    this.delay = 150;
                }
                /**
                 * 
                 * @param {iLGE_2D_Engine} engine 
                 */
                collided_wall.update_function = function (engine) {
                    if (this.delay < 1) {
                        const source = clang_audio.createAudioBufferSource();
                        clang_audio.playAudio(source);
                        this.scene.removeObject(this.id);
                        eated_walls++;
                    }
                };

                if (collided_wall.delay < 1)
                    collided_wall.reset = true;
                collided_wall = this.collider.collidedWithByClass("wall", collided_index++);
            }
        }
    }
    this.addObject(camera_hud);
}
game.start();