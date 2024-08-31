const cursorSrc = "CursorSprite.png";

function onLoad() {
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
            min_speed: 4,
            speed: 0,
            max_speed: 8,
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

                if (engine.control_map_get("RUN"))
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
                transform.rotate(cursorMovementX * this.mouseSensitivity);
            },
        };

        let scene = new iLGE_2D_Scene("main", "scene", true);

        let player = new iLGE_2D_GameObject("player", "player");
        player.transform.scaling.x = 1;
        player.transform.size = new iLGE_2D_Vector2(32, 64);
        player.zOrder = 1;
        player.collider = new iLGE_2D_GameObject_Component_Collider(
            false, false, "collider", 0, 0, player.transform.size.x, player.transform.size.y
        );
        player.collider.mode = iLGE_2D_GameObject_Component_Collider_Mode_ContinuousDynamic;
        player.addComponent(player.collider);
        player.addComponent(new iLGE_2D_GameObject_Component_Rectangle("#0000ff", "rect", true));
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