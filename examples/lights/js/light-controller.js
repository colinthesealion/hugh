/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/arduino.ts":
/*!***************************!*\
  !*** ./src/js/arduino.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Arduino = /** @class */ (function () {
    function Arduino(_a) {
        var _this = this;
        var server = _a.server, port = _a.port, endpoint = _a.endpoint, debug = _a.debug;
        this.isConnected = false;
        if (!('WebSocket' in window)) {
            throw new Error('WebSockets not supported by this browser');
        }
        var address = "ws://" + server + ":" + port + "/" + endpoint;
        this.arduino = new WebSocket(address);
        this.arduino.onopen = function () {
            console.log("Connected to " + address);
            _this.isConnected = true;
        };
        this.arduino.onerror = function (error) {
            console.error('Arduino connection error', error);
            _this.isConnected = false;
        };
        if (debug) {
            this.arduino.onmessage = function (event) {
                console.log('Server: ' + event.data);
            };
        }
    }
    Arduino.prototype.isAvailable = function () {
        return this.isConnected;
    };
    Arduino.prototype.sendData = function (data) {
        if (this.isConnected) {
            this.arduino.send(JSON.stringify(data));
        }
        return this.isConnected;
    };
    return Arduino;
}());
exports.default = Arduino;


/***/ }),

/***/ "./src/js/color-picker.ts":
/*!********************************!*\
  !*** ./src/js/color-picker.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
function getCoordinatesFromMouseEvent(event) {
    return {
        x: event.offsetX,
        y: event.offsetY,
    };
}
function getCoordinatesFromTouchEvent(event) {
    var target = event.target;
    var _a = target.getBoundingClientRect(), left = _a.left, top = _a.top;
    var _b = event.targetTouches[0], pageX = _b.pageX, pageY = _b.pageY;
    return {
        x: pageX - left,
        y: pageY - top,
    };
}
var ColorPicker = /** @class */ (function () {
    function ColorPicker(_a) {
        var canvas = _a.canvas, imageSrc = _a.imageSrc, onColorChange = _a.onColorChange, changeOnRelease = _a.changeOnRelease;
        this.context = null;
        this.dragging = false;
        this.changeOnRelease = false;
        this.canvas = canvas;
        this.promiseForImage = new Promise(function (resolve, reject) {
            var image = new Image();
            image.onload = function () {
                resolve(image);
            };
            image.onerror = function () {
                reject("Could not load " + imageSrc);
            };
            image.src = imageSrc;
        });
        this.onColorChange = onColorChange;
        this.changeOnRelease = !!changeOnRelease;
        this.drawCanvas();
        this.addEventListeners();
    }
    ColorPicker.prototype.addEventListeners = function () {
        var _this = this;
        // Window events
        window.addEventListener('resize', function () { return _this.drawCanvas(); });
        // Mouse events
        this.canvas.addEventListener('mousedown', function (event) {
            _this.dragging = true;
            if (!_this.changeOnRelease) {
                _this.changeColor(getCoordinatesFromMouseEvent(event));
            }
        });
        this.canvas.addEventListener('mousemove', function (event) {
            if (_this.dragging && !_this.changeOnRelease) {
                _this.changeColor(getCoordinatesFromMouseEvent(event));
            }
        });
        this.canvas.addEventListener('mouseup', function (event) {
            if (_this.changeOnRelease) {
                _this.changeColor(getCoordinatesFromMouseEvent(event));
            }
            _this.dragging = false;
        });
        // Touch events
        this.canvas.addEventListener('touchstart', function (event) {
            event.preventDefault();
            event.stopPropagation();
            _this.dragging = true;
            if (!_this.changeOnRelease && event.targetTouches.length) {
                _this.changeColor(getCoordinatesFromTouchEvent(event));
            }
        });
        this.canvas.addEventListener('touchmove', function (event) {
            event.stopPropagation();
            if (_this.dragging && !_this.changeOnRelease && event.targetTouches.length) {
                _this.changeColor(getCoordinatesFromTouchEvent(event));
            }
        });
        this.canvas.addEventListener('touchcancel', function () {
            _this.dragging = false;
        });
        this.canvas.addEventListener('touchend', function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (_this.changeOnRelease && event.targetTouches.length) {
                _this.changeColor(getCoordinatesFromTouchEvent(event));
            }
            _this.dragging = false;
        });
    };
    ColorPicker.prototype.drawCanvas = function () {
        return __awaiter(this, void 0, void 0, function () {
            var parent, size, image;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parent = this.canvas.parentElement;
                        if (!parent) {
                            throw new Error('Could not find parent element');
                        }
                        size = Math.min(parent.offsetHeight, parent.offsetWidth);
                        this.canvas.width = size - 30;
                        this.canvas.height = size - 30;
                        this.context = this.canvas.getContext('2d');
                        if (!this.context) return [3 /*break*/, 2];
                        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                        return [4 /*yield*/, this.promiseForImage];
                    case 1:
                        image = _a.sent();
                        this.context.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    ColorPicker.prototype.changeColor = function (_a) {
        var x = _a.x, y = _a.y;
        if (this.context) {
            var colorData = this.context.getImageData(x, y, 1, 1).data;
            this.onColorChange({
                red: colorData[0],
                green: colorData[1],
                blue: colorData[2],
            });
        }
    };
    ColorPicker.prototype.setChangeOnRelease = function (changeOnRelease) {
        this.changeOnRelease = changeOnRelease;
    };
    return ColorPicker;
}());
exports.default = ColorPicker;


/***/ }),

/***/ "./src/js/color.ts":
/*!*************************!*\
  !*** ./src/js/color.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
function toString(color) {
    if (Object.prototype.hasOwnProperty.call(color, 'alpha')
        && color.alpha !== undefined) {
        return "rgba(" + color.red + ", " + color.green + ", " + color.blue + ", " + color.alpha + ")";
    }
    else {
        return "rgb(" + color.red + ", " + color.green + ", " + color.blue + ")";
    }
}
exports.toString = toString;
function reduce(reducer, initialColor) {
    var colors = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        colors[_i - 2] = arguments[_i];
    }
    var color = colors.reduce(function (reduction, color) {
        reduction.red = reducer(reduction.red, color.red);
        reduction.green = reducer(reduction.green, color.green);
        reduction.blue = reducer(reduction.blue, color.blue);
        if (reduction.hasOwnProperty('alpha')
            || color.hasOwnProperty('alpha')) {
            reduction.alpha = reducer(reduction.alpha || 0, color.alpha || 0);
        }
        return reduction;
    }, initialColor);
    return color;
}
exports.reduce = reduce;
function interpolateColor(start, end, factor) {
    return reduce(function (reduction, channel) {
        return Math.round(reduction + factor * (channel - reduction));
    }, __assign({}, start), __assign({}, end));
}
exports.interpolateColor = interpolateColor;
function interpolateColors(start, end, nSteps) {
    var stepFactor = 1 / (nSteps - 1);
    var colors = [];
    for (var i = 0; i < nSteps; i++) {
        colors.push(interpolateColor(start, end, stepFactor * i));
    }
    return colors;
}
exports.interpolateColors = interpolateColors;
function toLinearGradient(direction, colors) {
    var colorStrings = colors.map(toString);
    if (direction !== 'down') {
        colorStrings.unshift("to  " + direction);
    }
    return "linear-gradient(" + colorStrings.join(',') + ")";
}
exports.toLinearGradient = toLinearGradient;
function equals(color1, color2) {
    if (!color1 && !color2) {
        return true;
    }
    else if (!color1) {
        return false;
    }
    else if (!color2) {
        return false;
    }
    else if (color1.red !== color2.red) {
        return false;
    }
    else if (color1.green !== color2.green) {
        return false;
    }
    else if (color1.blue !== color2.blue) {
        return false;
    }
    else if (Object.prototype.hasOwnProperty.call(color1, 'alpha')
        && Object.prototype.hasOwnProperty.call(color2, 'alpha')
        && color1.alpha !== color2.alpha) {
        return false;
    }
    else {
        return true;
    }
}
exports.equals = equals;


/***/ }),

/***/ "./src/js/controller.ts":
/*!******************************!*\
  !*** ./src/js/controller.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ColorUtils = __importStar(__webpack_require__(/*! ./color */ "./src/js/color.ts"));
var MODE;
(function (MODE) {
    MODE[MODE["CHOOSE"] = 0] = "CHOOSE";
    MODE[MODE["CASCADE"] = 1] = "CASCADE";
    MODE[MODE["PALETTE"] = 2] = "PALETTE";
    MODE[MODE["CASCADE_PALLETTE"] = 3] = "CASCADE_PALLETTE";
    MODE[MODE["RAINBOW"] = 4] = "RAINBOW";
})(MODE = exports.MODE || (exports.MODE = {}));
exports.MODE_OPTIONS = [
    {
        name: 'Rainbow',
        value: MODE.RAINBOW,
    },
    {
        name: 'Choose a Color',
        value: MODE.CHOOSE,
    },
    {
        name: 'Cascade a Color',
        value: MODE.CASCADE,
    },
    {
        name: 'Choose a Palette',
        value: MODE.PALETTE,
    },
    {
        name: 'Cascade a Palette',
        value: MODE.CASCADE_PALLETTE,
    },
];
var Controller = /** @class */ (function () {
    function Controller(_a) {
        var deltaMs = _a.deltaMs, nSteps = _a.nSteps;
        this.palette = [];
        this.mode = MODE.CHOOSE;
        this.deltaMs = deltaMs;
        this.nSteps = nSteps;
        this.mode = MODE.RAINBOW;
        this.currentColor = {
            red: 0,
            green: 0,
            blue: 0,
        };
    }
    Controller.prototype.startPaletteShift = function () {
        var _this = this;
        if (this.intervalId) {
            return;
        }
        if (this.palette.length < 1) {
            this.currentColor = {
                red: 0,
                green: 0,
                blue: 0,
            };
        }
        else if (this.palette.length === 1) {
            this.currentColor = this.palette[0];
        }
        else {
            var startIndex_1 = 0;
            var nextIndex_1 = 1;
            var increment_1 = 1;
            var colors_1 = ColorUtils.interpolateColors(this.palette[startIndex_1], this.palette[nextIndex_1], this.nSteps);
            var stepIndex_1 = 0;
            this.currentColor = colors_1[stepIndex_1++];
            this.intervalId = window.setInterval(function () {
                if (stepIndex_1 >= _this.nSteps) {
                    startIndex_1 += increment_1;
                    nextIndex_1 += increment_1;
                    if (nextIndex_1 >= _this.palette.length) {
                        nextIndex_1 = startIndex_1 - 1;
                        increment_1 = -1;
                    }
                    else if (nextIndex_1 < 0) {
                        nextIndex_1 = startIndex_1 + 1;
                        increment_1 = 1;
                    }
                    colors_1 = ColorUtils.interpolateColors(_this.palette[startIndex_1], _this.palette[nextIndex_1], _this.nSteps);
                    stepIndex_1 = 0;
                }
                _this.currentColor = colors_1[stepIndex_1++];
            }, this.deltaMs);
        }
    };
    Controller.prototype.handleColorChange = function (color) {
        switch (this.mode) {
            case MODE.CHOOSE:
            case MODE.CASCADE: {
                this.currentColor = color;
                break;
            }
            case MODE.PALETTE:
            case MODE.CASCADE_PALLETTE: {
                if (!ColorUtils.equals(color, this.palette.slice(-1)[0])) {
                    this.palette.push(color);
                    this.startPaletteShift();
                }
                break;
            }
            case MODE.RAINBOW: {
                break;
            }
            default: {
                throw new Error("Unknown mode: " + this.mode);
            }
        }
    };
    Controller.prototype.setMode = function (mode) {
        if (this.mode !== mode) {
            if (mode === MODE.PALETTE
                || mode === MODE.CASCADE_PALLETTE) {
                this.clearPalette();
            }
            window.clearInterval(this.intervalId);
            this.intervalId = undefined;
            this.mode = mode;
        }
    };
    Controller.prototype.getMode = function () {
        return this.mode;
    };
    Controller.prototype.clearPalette = function () {
        if (this.intervalId) {
            window.clearInterval(this.intervalId);
        }
        this.palette = [];
    };
    Controller.prototype.getPayload = function () {
        var payload;
        switch (this.mode) {
            case MODE.RAINBOW:
                payload = {
                    command: 'rainbow',
                };
                break;
            case MODE.CHOOSE:
            case MODE.CASCADE:
                payload = {
                    command: (this.mode === MODE.CHOOSE) ? 'all' : 'cascade',
                    color: this.currentColor,
                };
                break;
            case MODE.PALETTE:
            case MODE.CASCADE_PALLETTE:
                payload = {
                    command: (this.mode === MODE.PALETTE) ? 'all' : 'cascade',
                    color: this.currentColor,
                };
                break;
            default:
            // no-op
        }
        if (this.previousPayload && payload
            && this.previousPayload.command === payload.command
            && ColorUtils.equals(this.previousPayload.color, payload.color)) {
            return undefined;
        }
        this.previousPayload = payload;
        return payload;
    };
    return Controller;
}());
exports.default = Controller;


/***/ }),

/***/ "./src/js/index.ts":
/*!*************************!*\
  !*** ./src/js/index.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var arduino_1 = __importDefault(__webpack_require__(/*! ./arduino */ "./src/js/arduino.ts"));
var color_picker_1 = __importDefault(__webpack_require__(/*! ./color-picker */ "./src/js/color-picker.ts"));
var controller_1 = __importStar(__webpack_require__(/*! ./controller */ "./src/js/controller.ts"));
var ColorUtils = __importStar(__webpack_require__(/*! ./color */ "./src/js/color.ts"));
var arduino;
function paintRainbow() {
    delete document.body.style.background;
    document.body.style.backgroundImage = ColorUtils.toLinearGradient('down', [
        { red: 255, green: 0, blue: 0 },
        { red: 255, green: 165, blue: 0 },
        { red: 255, green: 255, blue: 0 },
        { red: 0, green: 255, blue: 0 },
        { red: 0, green: 0, blue: 255 },
        { red: 128, green: 0, blue: 128 },
        { red: 199, green: 21, blue: 133 },
    ]);
}
paintRainbow();
try {
    arduino = new arduino_1.default({
        server: 'hugh.local',
        port: 9998,
        endpoint: 'console',
    });
}
catch (e) {
    console.error('Could not connect to arduino');
}
var deltaMs = 200;
var controller = new controller_1.default({
    deltaMs: deltaMs,
    nSteps: 20,
});
var canvasBlock = document.querySelector('#color-block');
var canvasStrip = document.querySelector('#color-strip');
if (!canvasBlock || !canvasStrip) {
    throw new Error('Cannot find canvas in the document');
}
var colorPicker = new color_picker_1.default({
    canvasBlock: canvasBlock,
    canvasStrip: canvasStrip,
    imageSrc: 'images/colorwheel3.png',
    onColorChange: function (color) {
        controller.handleColorChange(color);
        if ((controller.getMode() === controller_1.MODE.PALETTE
            || controller.getMode() === controller_1.MODE.CASCADE_PALLETTE)
            && controller.palette.length > 1) {
            delete document.body.style.background;
            document.body.style.backgroundImage = ColorUtils.toLinearGradient('down', controller.palette);
        }
        else if (controller.getMode() !== controller_1.MODE.RAINBOW) {
            delete document.body.style.backgroundImage;
            document.body.style.background = ColorUtils.toString(color);
        }
    },
});
var clearPalette = document.querySelector('#clear-palette');
if (clearPalette) {
    clearPalette.addEventListener('click', function () {
        controller.clearPalette();
        delete document.body.style.backgroundImage;
        document.body.style.background = 'black';
    });
}
var dropdownMenu = document.querySelector('.dropdown-menu');
if (dropdownMenu) {
    controller_1.MODE_OPTIONS.forEach(function (option) {
        var menuItem = document.createElement('a');
        menuItem.className = 'dropdown-item';
        menuItem.href = '#';
        menuItem.innerText = option.name;
        menuItem.addEventListener('click', function () {
            controller.setMode(option.value);
            if (option.value === controller_1.MODE.RAINBOW) {
                paintRainbow();
            }
            else {
                document.body.style.background = 'black';
            }
            if (clearPalette) {
                clearPalette.style.display = (option.value === controller_1.MODE.PALETTE || option.value === controller_1.MODE.CASCADE_PALLETTE)
                    ? 'block'
                    : 'none';
            }
            /*
            colorPicker.setChangeOnRelease(
              option.value === MODE.PALETTE
              || option.value === MODE.CASCADE_PALLETTE
            );
            */
            colorPicker.drawCanvas();
        });
        dropdownMenu.appendChild(menuItem);
    });
}
setInterval(function () {
    colorPicker; // to keep it from getting garbage collected
    var payload = controller.getPayload();
    if (payload) {
        if (arduino && arduino.isAvailable()) {
            arduino.sendData(JSON.stringify(payload));
        }
        else {
            console.log(payload);
        }
    }
}, deltaMs);


/***/ })

/******/ });
//# sourceMappingURL=light-controller.js.map