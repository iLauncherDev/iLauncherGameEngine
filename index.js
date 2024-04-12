let game = new iLGE_2D_Engine(
    "Test", ["PDV437.png", "DitherSprites.png"], [],
    document.getElementById("GameScreen"), 320, 200, true);

let PDV437 = new iLGE_2D_Object_Font(
    game.getImageObject("PDV437.png"), "PDV437", 9, 16,
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!;%:?*()_+-=.,/|\"'@#$^&{}[]"
);

game.addObject(PDV437);

let camera = new iLGE_2D_Object("MyCamera", "camera", iLGE_2D_Object_Type_Camera, 0, 0, 0, 360, 0, 0, 0, 0);
game.debug = false;
game.occlusion_culling_test = false;

let transition_ended = false, transition_loop = false;

let transition_effect = new iLGE_2D_Object("Transition_Effect");
transition_effect.dither = new iLGE_2D_Object_Element_Sprite_Transition_Effect(
    game.getImageObject("DitherSprites.png"), false, 2
);
transition_effect.addElement(transition_effect.dither);

let player = new iLGE_2D_Object("player", "player", iLGE_2D_Object_Type_Custom, 128, 128, 0, 1, 32, 64, 4, 8);

player.addElement(
    new iLGE_2D_Object_Element_Rectangle("#0000ff", "wall", true)
);

let room_index = 0;
let transition_toggle = false;

function createRoom(wall_size, room_size, wall_speed, rotation_range) {
    let wall_collider = new iLGE_2D_Object_Element_Collider(true, false, "wall_collder", 0, 0, wall_size, wall_size);
    for (let i = 0; i < room_size; i++) {
        for (let j = 0; j < room_size; j++) {
            if (i === 0 || i === room_size - 1 || j === 0 || j === room_size - 1) {
                let wall = new iLGE_2D_Object(
                    "wall" + (room_index++), "wall", iLGE_2D_Object_Type_Custom,
                    wall_size * j, wall_size * i, Math.random() * rotation_range, 1,
                    wall_size, wall_size, wall_speed, wall_speed
                );
                wall.update_function = function (engine) {
                    this.rotation += this.speed * engine.deltaTime;
                };
                wall.addElement(
                    new iLGE_2D_Object_Element_Rectangle("#ffff00", "wall", true)
                );
                wall.addElement(
                    wall_collider
                );
                game.addObject(wall);
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
    ["Keyboard_Code_ShiftLeft", "Keyboard_Code_ShiftRight", "Gamepad0_Button_10"]
);
game.control_map_set_default("Interact",
    ["Keyboard_Code_KeyQ", "Gamepad0_Button_2"]
);
game.control_map_set_default("Transition",
    ["Keyboard_Code_KeyE", "Gamepad0_Button_0"]
);
game.control_map_set_default("MouseX", iLGE_2D_Control_MouseX_Positive);
game.control_map_set_default("MovementX", "Gamepad0_Axis_0_Positive");
game.control_map_set_default("MovementY", "Gamepad0_Axis_1_Positive");
game.control_map_set_default("MovementX1",
    ["Gamepad0_Axis_3_Negative"]
);
game.control_map_restore_default();
game.control_map_save();

game.addObject(player);
game.addHudObject(transition_effect);
createRoom(128, 128, 0, 0);

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
    this.stamina_hud_green = new iLGE_2D_Object("hud0", null, iLGE_2D_Object_Type_Custom, 0, 0, 0, 320, 128, 8, 0, 0);
    this.stamina_hud_green.addElement(
        new iLGE_2D_Object_Element_Rectangle("#00ff00", "wall", true)
    );
    this.stamina_hud_red = new iLGE_2D_Object(
        "hud1", null, iLGE_2D_Object_Type_Custom, 0, 0, this.stamina_hud_green.rotation,
        this.stamina_hud_green.scale, this.stamina_hud_green.width, this.stamina_hud_green.height, 0, 0);
    this.stamina_hud_red.addElement(
        new iLGE_2D_Object_Element_Rectangle("#ff0000", "wall", true)
    );
    game.addHudObject(this.stamina_hud_red);
    game.addHudObject(this.stamina_hud_green);
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
    player.addElement(
        this.collider
    );
}

/**
 * 
 * @param {iLGE_2D_Engine} engine 
 */
player.update_function = function (engine) {
    this.stamina_hud_green.width = (this.stamina / this.max_stamina) * this.stamina_hud_red.width;
    this.stamina_hud_red.x = 4 * this.stamina_hud_red.scale_output;
    this.stamina_hud_green.x = this.stamina_hud_red.x;
    this.stamina_hud_red.y = (engine.height - this.stamina_hud_red.scaled_height) - 4 * this.stamina_hud_red.scale_output;
    this.stamina_hud_green.y = this.stamina_hud_red.y;
    if (!transition_ended) {
        transition_ended = !DitherTransition(engine);
        return;
    }
    else if (transition_loop) {
        transition_effect.dither.oldframe = engine.getFrameData();
        DitherTransition(engine);
    }
    else
    {
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
    let Left = engine.control_map_get("MovementX", true) |
        (engine.control_map_get("Right", true) - engine.control_map_get("Left", true));
    let Up = engine.control_map_get("MovementY", true) | (
        engine.control_map_get("Down", true) - engine.control_map_get("Up", true)
    );
    let run = engine.control_map_get("RUN", true);
    let vector_movement = new iLGE_2D_Vector2();
    let collided_wall = null;
    this.rotation +=
        (engine.control_map_get("MouseX", false) * this.mouse_sensitivity -
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
        if (collided_wall)
            engine.removeObject(collided_wall.id);
    }
}

game.setDefaultCamera(camera);
game.start();