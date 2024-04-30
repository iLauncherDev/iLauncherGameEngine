let game = new iLGE_2D_Engine(
    "Test",
    [
        "CursorSprite.png",
        "PDV437.png",
        "DitherSprites.png",
        "clang.ogg"
    ],
    document.getElementById("GameScreen"),
    320, 200,
    true
);

let scene = new iLGE_2D_Scene("MyScene", "scene", true);
game.addObject(scene);

game.title = "Eat The Walls!";

let PDV437 = new iLGE_2D_Object_Font(
    game.getSourceObject("PDV437.png"), "PDV437", 9, 16,
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!;%:?*()_+-=.,/|\"'@#$^&{}[]"
);

game.addObject(PDV437);

let clang_audio = game.getSourceObject("clang.ogg");
let camera = new iLGE_2D_Object("MyCamera", "camera", iLGE_2D_Object_Type_Camera, 0, 0, 0, 360, 0, 0, scene);
let camera_hud = new iLGE_2D_Object("MyCameraHud", "camera_hud");
camera_hud.addElement(
    new iLGE_2D_Object_Element_Camera_Viewer(
        camera, "Hud", true
    )
);

let transition_ended = false, transition_loop = false;

let transition_effect = new iLGE_2D_Object("Transition_Effect");
transition_effect.dither = new iLGE_2D_Object_Element_Sprite_Transition_Effect(
    game.getSourceObject("DitherSprites.png"), "Dither", false, 2
);
transition_effect.addElement(transition_effect.dither);

let player = new iLGE_2D_Object("player", "player", iLGE_2D_Object_Type_Custom, 128, 128, 0, 1, 32, 64);

player.addElement(
    new iLGE_2D_Object_Element_Rectangle("#0000ff", "wall", true)
);

let room_index = 0;
let transition_toggle = false;

function createRoom(wall_size, room_size, wall_speed, rotation_range) {
    let wall_collider = new iLGE_2D_Object_Element_Collider(
        true, false, "wall_collder", 0, 0, wall_size, wall_size
    );
    for (let i = 0; i < room_size; i++) {
        for (let j = 0; j < room_size; j++) {
            if (i === 0 || i === room_size - 1 || j === 0 || j === room_size - 1) {
                let wall = new iLGE_2D_Object(
                    "wall" + (room_index++), "wall", iLGE_2D_Object_Type_Custom,
                    wall_size * j, wall_size * i, Math.random() * rotation_range, 1,
                    wall_size, wall_size
                );
                wall.speed = wall_speed;
                wall.update_function = function (engine) {
                    this.rotation += this.speed * engine.deltaTime;
                };
                wall.addElement(
                    new iLGE_2D_Object_Element_Rectangle("#ffff00", "wall", true)
                );
                wall.addElement(
                    wall_collider
                );
                scene.addObject(wall);
            }
        }
    }
}

camera.addElement(
    new iLGE_2D_Object_Element_Rectangle("#ffffff", "wall", true)
);

game.control_map_load();
game.control_map_set_default("Up", "Keyboard_Code_KeyW");
game.control_map_set_default("Down", "Keyboard_Code_KeyS");
game.control_map_set_default("Left", "Keyboard_Code_KeyA");
game.control_map_set_default("Right", "Keyboard_Code_KeyD");
game.control_map_set_default("RUN",
    [
        "Keyboard_Code_ShiftLeft",
        "Keyboard_Code_ShiftRight",
        "Gamepad0_Button_10"
    ]
);
game.control_map_set_default("Interact",
    [
        "Keyboard_Code_KeyQ",
        "Gamepad0_Button_2",
        "Mouse_Button_0"
    ]
);
game.control_map_set_default("Transition",
    [
        "Keyboard_Code_KeyE",
        "Gamepad0_Button_0"
    ]
);
game.control_map_set_default("MovementX", "Gamepad0_Axis_0_Positive");
game.control_map_set_default("MovementY", "Gamepad0_Axis_1_Positive");
game.control_map_set_default("MovementX1",
    [
        "Gamepad0_Axis_3_Negative"
    ]
);
game.control_map_set_default("CursorX",
    [
        "Mouse_ClientX_Positive"
    ]
);
game.control_map_set_default("CursorY",
    [
        "Mouse_ClientY_Positive"
    ]
);
game.control_map_set_default("CursorMovementX",
    [
        "Mouse_MovementX_Positive"
    ]
);
game.control_map_set_default("CursorMovementY",
    [
        "Mouse_MovementY_Positive"
    ]
);
game.control_map_set_default("TouchX", "Touch_ClientX_Positive");
game.control_map_set_default("TouchY", "Touch_ClientY_Positive");
game.control_map_set_default("TouchMovementX", "Touch_MovementX_Positive");
game.control_map_set_default("TouchMovementY", "Touch_MovementY_Positive");
game.control_map_restore_default();
game.control_map_save();

scene.addObject(player);
game.addObject(transition_effect);
createRoom(128, 128, 0, 0);

let total_walls = scene.countObjectByClass("wall"), eated_walls = 0;

/**
 * 
 * @param {iLGE_2D_Engine} engine 
 */
function DitherTransition(engine) {
    transition_effect.width = engine.width;
    transition_effect.height = engine.height;
    if (transition_effect.dither.src_index < 5 && transition_effect.dither.visible) {
        transition_effect.dither.src_index += engine.deltaTime * 0.25;
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
    this.min_speed = 4;
    this.max_speed = 8;
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
    this.cursor = new iLGE_2D_Object(
        "hud2", "cursor", iLGE_2D_Object_Type_Custom,
        0, 0, 0, 680, 48, 68
    );
    this.cursor.addElement(
        new iLGE_2D_Object_Element_Sprite(
            engine.getSourceObject("CursorSprite.png"),
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
        0, 0, this.width, this.height);
    console.log("Hello, it's me, " + this.id + "!");
    engine.pointerLock = true;
    this.max_stamina = 1024;
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
    this.game_title.x = 4 * this.game_title.scale_output;
    this.game_title.y = this.game_title.x;
    this.stamina_hud_green.width = stamina * this.stamina_hud_red.width;
    this.stamina_hud_red.x = 4 * this.stamina_hud_red.scale_output;
    this.stamina_hud_green.x = this.stamina_hud_red.x;
    this.stamina_hud_red.y =
        (engine.height - this.stamina_hud_red.height * this.stamina_hud_red.scale_output)
        - 4 * this.stamina_hud_red.scale_output;
    this.stamina_hud_green.y = this.stamina_hud_red.y;
    this.stamina_level.element[0].string = Math.floor(stamina * 100) + "%";
    this.stamina_level.width = this.stamina_level.element[0].string.length * PDV437.width;
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
    let vector_movement = new iLGE_2D_Vector2();
    let collided_wall = null;
    this.rotation +=
        (movementX * this.mouse_sensitivity -
            engine.control_map_get("MovementX1", false) * this.gamepad_sensitivity * engine.deltaTime);
    vector_movement.x = Left * this.speed * engine.deltaTime;
    vector_movement.y = Up * this.speed * engine.deltaTime;
    vector_movement = vector_movement.transform(this.getRotationDirection());
    this.x += vector_movement.x;
    this.y += vector_movement.y;
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
    camera.x = (this.x - (camera.width - this.width) / 2);
    camera.y = (this.y - (camera.height - this.height) / 2);
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
        collided_wall = this.collider.collidedWithByClass("wall");
        if (collided_wall) {
            this.scene.removeObject(collided_wall.id);
            clang_audio.cloneIt().playAudio();
            eated_walls++;
        }
    }
}

game.addObject(camera_hud);
game.start();