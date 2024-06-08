# iLGE(iLauncherGameEngine)
iLGE(iLauncherGameEngine) is a Game Engine made in javascript, [click here](https://ilauncherdev.github.io/iLauncherGameEngine/) to open the example game.

Features:
- [x] audio object
- [x] data manager(Ex: data_add_item(key, variable), data_remove_item(key) and data_read_item(key))
- [x] rectangle element
- [x] sprite element
- [x] sprite effect element(Ex: dithering sprite effect element)
- [x] sprite font(Ex: `new iLGE_2D_Object_Font(source_object, "Font_ID", font_width, font_height, "abcdef")`)
- [x] text element
- [x] collider element
- [x] resource manager
- [x] object delay
- [x] object scale
- [x] object rotation
- [x] object priority for start_function, update_function and collisions
- [x] object z-order
- [x] object start_function(engine) and update_function(engine)
- [x] 2d vector for object movements


# Let's Get Started on this library
- download [vscode](https://code.visualstudio.com/) and install it to start.
- open vscode.
- click in the "Extensions" or Press Ctrl+Shift+X Keys and search for "Live Server".
- install extension called "Live Server".
- prepare your working folder.
- download the file named [iLGE-2d.js](https://raw.githubusercontent.com/iLauncherDev/iLauncherGameEngine/main/iLGE-2d.js "Open the context menu and click 'Save link as' or something like that") to your working folder.
- create the files to your working folder below:

index.html:
```
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>My First Game</title>
	<script src="iLGE-2d.js" type="text/javascript"></script>
	<style type="text/css">
		html, body {
			width: 100%;
			height: 100%;
			margin: 0px;
			border: 0;
			overflow: hidden;
			display: block;
		}

		canvas {
			width: 100%;
			height: 100%;
			object-fit: contain;
		}

		#GameScreen {
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: black;
			height: 100vh;
			width: 100vw;
		}
	</style>
</head>
<body>
	<div id="GameScreen"></div>
	<script src="index.js" type="text/javascript"></script>
</body>
</html>
```

index.js:
```
let game = new iLGE_2D_Engine(
	"MyFirstGame",
	null,
	document.getElementById("GameScreen"),
	0, 0,
	true
);

/**
 * 
 * @param {iLGE_2D_Engine} engine 
 */
game.start_function = function (engine) {
	/* setup the controls */
	this.control_map_set("up", "Keyboard_Code_KeyW");
	this.control_map_set("down", "Keyboard_Code_KeyS");
	this.control_map_set("left", "Keyboard_Code_KeyA");
	this.control_map_set("right", "Keyboard_Code_KeyD");

	/* setup the scene and camera */
	let scene = new iLGE_2D_Scene("MyScene", "SceneClass", true);
	let camera = new iLGE_2D_Object("MyCamera", "camera", iLGE_2D_Object_Type_Camera);

	/* set camera scale to 360px */
	camera.scale = 360;

	/* set the scene that camera will render */
	camera.scene = scene;

	/* set camera background */
	camera.addElement(new iLGE_2D_Object_Element_Rectangle("#000000", "rect", true));

	/* setup the camera viewer */
	let camera_viewer = new iLGE_2D_Object("MyViewer", "camera_viewer", iLGE_2D_Object_Type_Custom);
	camera_viewer.addElement(new iLGE_2D_Object_Element_Camera_Viewer(camera, "viewer", true));

	/**
	 * 
	 * @param {iLGE_2D_Engine} engine 
	 */
	camera_viewer.start_function = function (engine) {
		/* set z_order */
		this.z_order = 1;
	}

	/**
	 * 
	 * @param {iLGE_2D_Engine} engine 
	 */
	camera_viewer.update_function = function (engine) {
		/* set the x, y and scale to zero */
		this.x = this.y = this.scale = 0;

		/* set fullscreen */
		this.width = engine.width;
		this.height = engine.height;
	};
	/* add scene object for updates */
	this.addObject(scene);

	/* add camera viewer to hud */
	this.addObject(camera_viewer);

	/* setup player */
	let player = new iLGE_2D_Object(
		"Player", "player",
		iLGE_2D_Object_Type_Custom,
		0, 0, 0, 1, 64, 64
	);

	/**
	 * 
	 * @param {iLGE_2D_Engine} engine 
	 */
	player.start_function = function (engine) {
		alert("Hello!, It's me " + player.id + "!");
		this.speed = 8;
		this.camera_rotation_delay = 4;
		camera.speed = 16;
	};

	/**
	 * 
	 * @param {iLGE_2D_Engine} engine 
	 */
	player.update_function = function (engine) {
		let left = engine.control_map_get("right", true) - engine.control_map_get("left", true),
			up = engine.control_map_get("down", true) - engine.control_map_get("up", true);
		this.rotation += left * camera.speed * engine.deltaTime;
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
		let vector = this.getRotationVector();
		this.x += up * -vector.y * this.speed * engine.deltaTime;
		this.y += up * vector.x * this.speed * engine.deltaTime;
		camera.x = this.x - (camera.width - this.width) / 2;
		camera.y = this.y - (camera.height - this.height) / 2;
	};

	/* setup the wall */
	let wall = new iLGE_2D_Object(
		"Wall", "wall",
		iLGE_2D_Object_Type_Custom,
		0, 0, 0, 1, 256, 128
	);

	/* add rectangle to player */
	player.addElement(new iLGE_2D_Object_Element_Rectangle("#ffffff", "rect", true));

	/* add collider to player */
	player.addElement(new iLGE_2D_Object_Element_Collider(
		false, false, "collider",
		0, 0, player.width, player.height
	));

	/* add rectangle to wall */
	wall.addElement(new iLGE_2D_Object_Element_Rectangle("#ff00ff", "rect", true));

	/* add collider to wall */
	wall.addElement(new iLGE_2D_Object_Element_Collider(
		true, false, "blocker",
		0, 0, wall.width, wall.height
	));

	/* add player and wall to scene */
	scene.addObject(player);
	scene.addObject(wall);
};
game.start();
```
- click the "Go Live" button and test your first game!