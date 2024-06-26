# 0.4.0
    changed the Audio to AudioContext

# 0.3.18
    added incorporeal objects support in iLGE_2D_Object_Element_Collider class
    fixed blocker collision resolution in iLGE_2D_Engine class
    redraw onepixel_canvas_context in iLGE_2D_Engine class
    removed {willReadFrequently: true} in all canvas contexts

# 0.3.17
    fixed deltaTime accuracy

# 0.3.16
    now scaling is done without using the canvas_context.scale function
    delta mouse button and keyboard keys

# 0.3.15
    added scale support for transition effect

# 0.3.14
    added getStringSize function in iLGE_2D_Object_Font class
    added "enabled" boolean in iLGE_2D_Object class

# 0.3.13
    fixed keyboard_handler in iLGE_2D_Engine class

# 0.3.12
    mouse movement is delta now
    added {willReadFrequently: true} in some contexts

# 0.3.11
    added fps control
    fixed #check_object_collision in iLGE_2D_Engine class
    fixed #drawTextWithStyles in iLGE_2D_Engine class

# 0.3.10
    added styled text support
    fixed #drawText function in iLGE_2D_Engine class

# 0.3.9
    added text alignment for vertical and horizontal

# 0.3.8
    set imageSmoothingEnabled to false for each frame
    set onepixel_canvas_context.imageSmoothingEnabled to false when onepixel_canvas is not set or is resized

# 0.3.7
    optimized #fillRect function in iLGE_2D_Engine class

# 0.3.6
    blurry rectangles fixed in chrome/chromium browsers

# 0.3.5
    fixed cloneIt function in iLGE_2D_Vector2 class

# 0.3.4
    use modern browsers api

# 0.3.3
    fixed the possibility of some collisions being ignored
    duplicated objects will be ignored
    fixed transform function in iLGE_2D_Vector2 class

# 0.3.2
    added multiply, divide and cloneIt functions in iLGE_2D_Vector2 class
    removed setDelay and checkDelay functions in iLGE_2D_Engine class, use object.delay instead
    fixed pointerLock

# 0.3.1
    added setAudioVolume in iLGE_2D_Source class
    removed useless resumeAudio in iLGE_2D_Source class
    improved cloneIt function in iLGE_2D_Source class
    added setDelay and checkDelay functions in iLGE_2D_Engine class

# 0.3.0
    check if pointerLock is true before locking

# 0.2.10
    added setScreenResolution function in iLGE_2D_Engine class

# 0.2.9
    added load and unload resource files functions in iLGE_2D_Engine class
    added start_function and update_function variable in iLGE_2D_Engine class

# 0.2.8
    improved camera rendering quality
    added scale support for #draw_camera_scene function in iLGE_2D_Engine class

# 0.2.7
    fixed pointerLock for chromium-based browsers

# 0.2.6
    optimize #drawText function in iLGE_2D_Engine class

# 0.2.5
    add support for RAW files

# 0.2.4
    fonts that do not have a fixed width are now supported

# 0.2.3
    added priority variable in iLGE_2D_Object class

# 0.2.2
    fixed a small bug in #check_collisions function inside iLGE_2D_Engine class

# 0.2.1
    rename #getRotationDirection to #getRotationVector in class iLGE_2D_Object

# 0.2.0
    added class iLGE_2D_Scene
    added scene variable in class iLGE_2D_Object for camera
    removed #objects variable in class iLGE_2D_Engine

# 0.1.16
    added touch events
    added movement for touch events
    added #control_map_get_helper function in class iLGE_2D_Engine
    optimize #clone_array function in class iLGE_2D_Engine
    added #objects_loop function in class iLGE_2D_Engine

# 0.1.15
    the camera is now rendered in hud
    code style adjustiment
    added id in missing classes

# 0.1.14
    improve z_order in class iLGE_2D_Object

# 0.1.13
    code style adjustiment
    improve #smartClean in class iLGE_2D_Engine

# 0.1.12
    fix a potential problem in collision preparation and detection
    optimize collision checker

# 0.1.11
    added count*ObjectByClass functions in class iLGE_2D_Engine
    remove useless "if (object.findElementByType())"
    remove useless #smartClean in class iLGE_2D_Object
    improve #smartClean in class iLGE_2D_Engine

# 0.1.10
    added toggle in mouse and keyboard events

# 0.1.9
    implemented z_order in class iLGE_2D_Object
    changed mouse events and pointerLock behavior
    added event.preventDefault() in mouse contextMenu event
    fixed control_map_get() in class iLGE_2D_Engine