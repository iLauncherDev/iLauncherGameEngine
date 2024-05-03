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