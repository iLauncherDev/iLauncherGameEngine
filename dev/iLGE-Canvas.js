// Copyright (C) 2024 Daniel Victor
//
// This program is distributed under the terms of the GNU General Public License, Version 3
// (or any later version) published by the Free Software Foundation.
// You can obtain a copy of the license at https://www.gnu.org/licenses/gpl-3.0.en.html.

class iLGE_Canvas {
    #clone(src) {
        let target = Array.isArray(src) ? [] : {};
        for (let prop in src) {
            let value = src[prop];
            if (value && typeof value === "object") {
                target[prop] = this.#clone(value);
            } else {
                target[prop] = value;
            }
        }
        return target;
    }

    compileShader(type, source) {
        const shader = this.canvas_context.createShader(type);
        this.canvas_context.shaderSource(shader, source);
        this.canvas_context.compileShader(shader);
        if (!this.canvas_context.getShaderParameter(shader, this.canvas_context.COMPILE_STATUS)) {
            console.error("[iLGE-Canvas] An error occurred compiling the shaders: " + this.canvas_context.getShaderInfoLog(shader));
            this.canvas_context.deleteShader(shader);
            return null;
        }
        return shader;
    }

    setupShaders() {
        /**
         * 
         * @param {WebGLRenderingContext} gl
         */
        const gl = this.canvas_context;

        const vertexShaderSource = `
            attribute vec4 aVertexPosition;
            attribute vec2 aTexCoord;

            uniform mat4 uProjectionMatrix;
            uniform mat4 uViewMatrix;
            uniform mat4 uModelViewMatrix;

            varying vec2 vTexCoord;

            void main(void) {
                gl_Position = uProjectionMatrix * uViewMatrix * uModelViewMatrix * aVertexPosition;
                vTexCoord = aTexCoord;
            }
        `;

        const fragmentShaderSource = `
            precision mediump float;
            uniform vec4 uColor;
            uniform sampler2D uSampler;
            uniform int uIsImage;
            uniform int uEnableColorReplacement;
            uniform float uAlpha;
            uniform float uBlendFactor;
            uniform float uColorTolerance;
            uniform vec4 uInputColor;
            uniform vec4 uReplaceColor;
            varying vec2 vTexCoord;

            void main(void) {
                vec4 color;
                
                if (uIsImage == 1) {
                    vec4 texColor = texture2D(uSampler, vTexCoord);

                    if (uEnableColorReplacement == 1 && length(texColor.rgba - uInputColor.rgba) < uColorTolerance) {
                        vec4 blendedColor = mix(texColor, uReplaceColor, uBlendFactor);
                        color = blendedColor;
                    } else {
                        color = texColor;
                    }
                } else {
                    color = uColor;
                }
                
                gl_FragColor = vec4(color.rgb, color.a * uAlpha);
            }
        `;

        this.program = gl.createProgram();
        const vertexShader = this.compileShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error('[iLGE-Canvas] An error occurred linking the program: ' + gl.getProgramInfoLog(this.program));
            return;
        }

        this.modelViewMatrixLocation = gl.getUniformLocation(this.program, 'uModelViewMatrix');
        this.viewMatrixLocation = gl.getUniformLocation(this.program, 'uViewMatrix');
        this.projectionMatrixLocation = gl.getUniformLocation(this.program, 'uProjectionMatrix');

        this.colorLocation = gl.getUniformLocation(this.program, 'uColor');
        this.samplerLocation = gl.getUniformLocation(this.program, 'uSampler');
        this.isImageLocation = gl.getUniformLocation(this.program, 'uIsImage');
        this.alphaLocation = gl.getUniformLocation(this.program, 'uAlpha');

        this.enableColorReplacementLocation = gl.getUniformLocation(this.program, 'uEnableColorReplacement');
        this.blendFactorLocation = gl.getUniformLocation(this.program, 'uBlendFactor');
        this.colorToleranceLocation = gl.getUniformLocation(this.program, 'uColorTolerance');
        this.inputColorLocation = gl.getUniformLocation(this.program, 'uInputColor');
        this.replaceColorLocation = gl.getUniformLocation(this.program, 'uReplaceColor');

        this.positionLocation = gl.getAttribLocation(this.program, 'aVertexPosition');
        this.texCoordLocation = gl.getAttribLocation(this.program, 'aTexCoord');
    }

    #multiplyMatrices(a, b) {
        const array = [];

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                array[i * 4 + j] = 0;
                for (let k = 0; k < 4; k++) {
                    array[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j];
                }
            }
        }

        return array;
    }

    applyTransformMatrix(matrix, isCamera) {
        if (!matrix || matrix.length < 4 * 4)
            return;

        if (isCamera)
            this.transforms.cameraMatrix = this.#multiplyMatrices(matrix, this.transforms.cameraMatrix);
        else
            this.transforms.matrix = this.#multiplyMatrices(matrix, this.transforms.matrix);
    }

    save() {
        this.transformsStack.push(this.#clone(this.transforms));
    }

    restore() {
        if (this.transformsStack.length > 0) {
            this.transforms = this.transformsStack.pop();
        }
    }

    scale(sx, sy) {
        let matrix = [
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];

        this.applyTransformMatrix(matrix, false);
    }

    translate(tx, ty) {
        let matrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, 0, 1,
        ];

        this.applyTransformMatrix(matrix, false);
    }

    rotate(angle) {
        angle = -angle;

        const cos = Math.cos(angle), sin = Math.sin(angle);
        let matrix = [
            cos, -sin, 0, 0,
            sin, cos, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];

        this.applyTransformMatrix(matrix, false);
    }

    #setTransforms() {
        /**
         * 
         * @param {WebGLRenderingContext} gl
         */
        const gl = this.canvas_context;

        gl.uniform1i(this.enableColorReplacementLocation, this.transforms.image.enableColorReplacement);
        gl.uniform1f(this.colorToleranceLocation, this.transforms.image.colorTolerance);
        gl.uniform1f(this.blendFactorLocation, this.transforms.image.blendFactor);
        gl.uniform4fv(this.inputColorLocation, new Float32Array(this.transforms.image.inputColor));
        gl.uniform4fv(this.replaceColorLocation, new Float32Array(this.transforms.image.replaceColor));

        gl.uniform1f(this.alphaLocation, this.transforms.globalAlpha);
        gl.uniformMatrix4fv(
            this.projectionMatrixLocation,
            false,
            this.projectionMatrix
        );
        gl.uniformMatrix4fv(
            this.viewMatrixLocation,
            false,
            new Float32Array(this.transforms.cameraMatrix)
        );
        gl.uniformMatrix4fv(
            this.modelViewMatrixLocation,
            false,
            new Float32Array(this.transforms.matrix)
        );
    }

    fillRect(colorStr, x, y, width, height) {
        /**
         * 
         * @param {WebGLRenderingContext} gl
         */
        const gl = this.canvas_context;
        const color = this.parseColor(colorStr);

        gl.useProgram(this.program);
        gl.disableVertexAttribArray(this.texCoordLocation);

        gl.uniform4fv(this.colorLocation, color);
        gl.uniform1i(this.isImageLocation, 0);

        this.#setTransforms();

        const vertices = new Float32Array([
            x, y,
            x + width, y,
            x, y + height,
            x + width, y + height
        ]);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.positionLocation);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    strokeRect(colorStr, x, y, width, height) {
        const strokeLineSize = this.transforms.strokeLineSize || 1;

        this.fillRect(colorStr, x, y, width, strokeLineSize);
        this.fillRect(colorStr, x, y + height - strokeLineSize, width, strokeLineSize);
        this.fillRect(colorStr, x, y, strokeLineSize, height);
        this.fillRect(colorStr, x + width - strokeLineSize, y, strokeLineSize, height);
    }

    #updateTexture(image) {
        /**
         * 
         * @param {WebGLRenderingContext} gl
         */
        const gl = this.canvas_context;

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA,
            gl.RGBA, gl.UNSIGNED_BYTE, image
        );

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.image_filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.image_filter);
    }

    drawImage(image, sx, sy, swidth, sheight, x, y, width, height) {
        /**
         * 
         * @param {WebGLRenderingContext} gl
         */
        const gl = this.canvas_context;

        this.image_filter = this.imageSmoothingEnabled ? gl.LINEAR : gl.NEAREST;
        this.#updateTexture(image);

        gl.useProgram(this.program);

        gl.uniform1i(this.isImageLocation, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(this.samplerLocation, 0);

        this.#setTransforms();

        const vertices = new Float32Array([
            x, y,
            x + width, y,
            x, y + height,
            x + width, y + height
        ]);

        const texCoords = new Float32Array([
            sx / image.width, sy / image.height,
            (sx + swidth) / image.width, sy / image.height,
            sx / image.width, (sy + sheight) / image.height,
            (sx + swidth) / image.width, (sy + sheight) / image.height
        ]);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.positionLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

        gl.vertexAttribPointer(this.texCoordLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.texCoordLocation);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    parseColor(colorStr) {
        let r = 0, g = 0, b = 0, a = 1;

        colorStr = colorStr.trim();

        const namedColors = {
            "black": [0, 0, 0, 1],
            "white": [1, 1, 1, 1],
            "red": [1, 0, 0, 1],
            "green": [0, 1, 0, 1],
            "blue": [0, 0, 1, 1],
        };

        if (namedColors[colorStr]) {
            return namedColors[colorStr];
        }

        const hexMatch = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.exec(colorStr);
        if (hexMatch) {
            const hex = hexMatch[1];
            if (hex.length === 6) {
                r = parseInt(hex.substr(0, 2), 16) / 255;
                g = parseInt(hex.substr(2, 2), 16) / 255;
                b = parseInt(hex.substr(4, 2), 16) / 255;
                a = 1;
            } else if (hex.length === 8) {
                r = parseInt(hex.substr(0, 2), 16) / 255;
                g = parseInt(hex.substr(2, 2), 16) / 255;
                b = parseInt(hex.substr(4, 2), 16) / 255;
                a = parseInt(hex.substr(6, 2), 16) / 255;
            }
            return [r, g, b, a];
        }

        const rgbaMatch = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/.exec(colorStr);
        if (rgbaMatch) {
            r = parseInt(rgbaMatch[1]) / 255;
            g = parseInt(rgbaMatch[2]) / 255;
            b = parseInt(rgbaMatch[3]) / 255;
            a = rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1.0;
            return [r, g, b, a];
        }

        return [0, 0, 0, 0];
    }

    clearScreen() {
        /**
         * 
         * @param {WebGLRenderingContext} gl
         */
        const gl = this.canvas_context;
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    appendChild(node) {
        node.appendChild(this.canvas);
    }

    removeChild(node) {
        node.removeChild(this.canvas);
    }

    getSize() {
        return { width: this.canvas.width, height: this.canvas.height };
    }

    getContext() {
        return this.canvas_context;
    }

    getCanvas() {
        return this.canvas;
    }

    setScreenResolution(width, height) {
        /**
         * 
         * @param {WebGLRenderingContext} gl
         */
        const gl = this.canvas_context;

        this.canvas.width = width;
        this.canvas.height = height;
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        this.projectionMatrix = new Float32Array([
            2 / this.canvas.width, 0, 0, 0,
            0, -2 / this.canvas.height, 0, 0,
            0, 0, 1, 0,
            -1, 1, 0, 1
        ]);
    }

    setGlobalAlpha(alpha = 1.0) {
        this.transforms.globalAlpha = alpha;
    }

    setGlobalCompositeOperation(operation = "source-over") {
        /**
         * 
         * @param {WebGLRenderingContext} gl
         */
        const gl = this.canvas_context;

        gl.enable(gl.BLEND);
        switch (operation) {
            case "source-over":
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                break;
            case "destination-over":
                gl.blendFunc(gl.ONE_MINUS_SRC_ALPHA, gl.SRC_ALPHA);
                break;
            case "lighter":
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
                break;
            case "copy":
                gl.blendFunc(gl.ONE, gl.ZERO);
                break;
            case "xor":
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                break;
            case "source-in":
                gl.blendFunc(gl.ZERO, gl.SRC_ALPHA);
                break;
            case "source-out":
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                break;
            default:
                console.warn("[iLGE-Canvas] Unsupported globalCompositeOperation: " + operation);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                break;
        }
    }

    setStrokeLineSize(strokeLineSize = 1.0) {
        this.transforms.strokeLineSize = strokeLineSize;
    }

    close() {
        /**
         * 
         * @param {WebGLRenderingContext} gl
         */
        const gl = this.canvas_context;

        gl.deleteProgram(this.program);
        gl.deleteBuffer(this.vertexBuffer);
        gl.deleteBuffer(this.texCoordBuffer);
        gl.deleteTexture(this.texture);

        const loseContextExtension = this.canvas_context.getExtension('WEBGL_lose_context');
        if (loseContextExtension) {
            loseContextExtension.loseContext();
        } else {
            console.warn("[iLGE-Canvas] WEBGL_lose_context extension not supported");
        }
    }

    constructor(width = 320, height = 200) {
        let webgl_contexts = [
            "webgl",
            "experimental-webgl",
        ];

        this.isCustomCanvas = true;
        this.canvas = document.createElement("canvas");

        for (let context of webgl_contexts) {
            this.canvas_context = this.canvas.getContext(
                context, {
                preserveDrawingBuffer: true,
                antialias: false,
                depth: false,
                stencil: false,
            });
            if (this.canvas_context)
                break;
            console.error("[iLGE-Canvas] This WebGL Context is not supported: " + context);
        }

        this.setScreenResolution(width, height);

        /**
         * 
         * @param {WebGLRenderingContext} gl
         */
        const gl = this.canvas_context;

        this.transforms = {
            image: {
                enableColorReplacement: false,
                colorTolerance: 0.25,
                blendFactor: 0.5,
                inputColor: [0.0, 0.0, 0.0, 1.0],
                replaceColor: [0.0, 0.0, 0.0, 1.0],
            },

            strokeLineSize: 1.0,
            globalAlpha: 1.0,
            cameraMatrix: [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ],
            matrix: [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ],
            scaling: { x: 1, y: 1 },
            translation: { x: 0, y: 0 }
        };

        this.transformsStack = [];
        this.image_filter = this.canvas_context.NEAREST;

        this.setupShaders();
        this.setGlobalCompositeOperation("source-over");
        this.setGlobalAlpha(1);

        this.vertexBuffer = gl.createBuffer();
        this.texCoordBuffer = gl.createBuffer();
        this.texture = gl.createTexture();
    }
}