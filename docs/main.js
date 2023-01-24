(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["MagicTouch"] = factory();
	else
		root["MagicTouch"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "enchantment": () => (/* binding */ enchantment)
/* harmony export */ });
const DEFAULT_OPTIONS = {
    holdThreshold: 750,
    acceptableDistThreshold: 1.5,
    flickThreshold: 1.5,
};

Object.freeze(DEFAULT_OPTIONS);

/**
 * @param { HTMLElement } target
 */
const enchantment = (target, opts) => {
    opts = Object.assign(DEFAULT_OPTIONS, opts);
    let pointertart;
    let holdedFlag = false;
    let latestPoint = [];

    /**
     * 
     * @param {MouseEvent | TouchEvent} evt
     */
    const eventHandler = (evt) => {
        switch (evt.type) {
            case 'touchstart': {
                latestPoint = [];
                if (!pointertart) {
                    pointertart = {
                        touches: evt.touches,
                        _poi: {x: evt.touches[0].pageX, y: evt.touches[0].pageY},
                        handler: setTimeout(() => {
                            target.dispatchEvent(new CustomEvent('hold', {
                                bubbles: true,
                                cancelable: true,
                                detail: {point: pointertart._poi, rawEv: evt}
                            }));
                            pointertart = undefined;
                            holdedFlag = true;
                        }, opts.holdThreshold)
                    };
                }
                else {
                    if (pointertart) {
                        clearTimeout(pointertart.handler);
                        pointertart = undefined;
                    }
                }
                break;
            }
            case 'mousedown': {
                latestPoint = [];
                if (!pointertart) {
                    pointertart = {
                        button: evt.button,
                        buttons: evt.buttons,
                        _poi: {x: evt.pageX, y: evt.pageY},
                        handler: setTimeout(() => {
                            target.dispatchEvent(new CustomEvent('hold', {
                                bubbles: true,
                                cancelable: true,
                                detail: {point: pointertart._poi, rawEv: evt}
                            }));
                            holdedFlag = true;
                            pointertart = undefined;
                        }, opts.holdThreshold)
                    };
                }
                else {
                    if (pointertart) {
                        clearTimeout(pointertart.handler);
                        pointertart = undefined;
                    }
                }
                break;
            }
            case 'touchmove': {
                if (evt.touches[0].screenY === 0) break;
                if (pointertart) {
                    const {x: x1, y: y1} = pointertart._poi;
                    const {pageX: x2, pageY: y2} = evt.touches[0];
                    const dist = Math.sqrt(Math.abs(x1 - x2) ^ 2 + Math.abs(y1 - y2) ^ 2);

                    if (!!latestPoint.length) latestPoint = [latestPoint.pop()];
                    const {pageX: x, pageY: y} = evt.touches[0];
                    const obj = {x, y};
                    latestPoint.push(obj);
                    requestAnimationFrame(() => requestAnimationFrame(() => {
                        if (latestPoint[latestPoint.length - 1] === obj) latestPoint = [];
                    }));

                    if (dist > opts.acceptableDistThreshold) {
                        clearTimeout(pointertart.handler);
                        pointertart.handler = undefined;
                    }
                }

                if (holdedFlag) {
                    const {pageX: x, pageY: y} = evt.touches[0];
                    target.dispatchEvent(new CustomEvent('holdmove', {
                        bubbles: true,
                        cancelable: true,
                        detail: {poi: {x, y}, rawEv: evt}
                    }));
                }
                break;
            }
            case 'mousemove': {
                if (evt.screenY === 0) break;
                if (pointertart) {
                    const {x: x1, y: y1} = pointertart._poi;
                    const {pageX: x2, pageY: y2} = evt;
                    const dist = Math.sqrt(Math.abs(x1 - x2) ^ 2 + Math.abs(y1 - y2) ^ 2);
                    if (evt.button === pointertart.button
                    || evt.buttons === pointertart.buttons) {
                        if (!!latestPoint.length) latestPoint = [latestPoint.pop()];
                        const {pageX: x, pageY: y} = evt;
                        const obj = {x, y};
                        latestPoint.push(obj);
                        requestAnimationFrame(() => requestAnimationFrame(() => {
                            if (latestPoint[latestPoint.length - 1] === obj) latestPoint = [];
                        }));
                    }

                    if (dist > opts.acceptableDistThreshold
                    || evt.button !== pointertart.button
                    || evt.buttons !== pointertart.buttons) {
                        clearTimeout(pointertart.handler);
                        pointertart.handler = undefined;
                    }
                }

                if (holdedFlag) {
                    const {pageX: x, pageY: y} = evt;
                    target.dispatchEvent(new CustomEvent('holdmove', {
                        bubbles: true,
                        cancelable: true,
                        detail: {poi: {x, y}, rawEv: evt}
                    }));
                }
                break;
            }
            case 'touchend': {
                if (pointertart?.handler) {
                    clearTimeout(pointertart.handler);
                    pointertart.handler = undefined;
                }
                if (holdedFlag) {
                    target.dispatchEvent(new CustomEvent('holdleave', {
                        bubbles: true,
                        cancelable: true,
                        detail: {poi: latestPoint[latestPoint.length - 1], rawEv: evt}
                    }));
                }
                if (latestPoint.length >= 2) {
                    const {x: x1, y: y1} = latestPoint[latestPoint.length - 2];
                    const {x: x2, y: y2} = latestPoint[latestPoint.length - 1];
                    const dist = Math.sqrt(Math.abs(x1 - x2) ^ 2 + Math.abs(y1 - y2) ^ 2);
                    if (dist > opts.flickThreshold && !holdedFlag) {
                        target.dispatchEvent(new CustomEvent('flick', {
                            bubbles: true,
                            cancelable: true,
                            detail: {start: pointertart._poi, poi: {x: x1, y: y1}, rawEv: evt, angle: Math.atan2(y2 - y1, x2 - x1), speed: dist}
                        }));
                    }
                }

                holdedFlag = false;
                latestPoint = [];
                pointertart = undefined;
                break;
            }
            case 'mouseup': {
                if (pointertart?.handler) {
                    clearTimeout(pointertart.handler);
                    pointertart.handler = undefined;
                }
                if (holdedFlag) {
                    target.dispatchEvent(new CustomEvent('holdleave', {
                        bubbles: true,
                        cancelable: true,
                        detail: {poi: latestPoint[latestPoint.length - 1], rawEv: evt}
                    }));
                }
                if (latestPoint.length >= 2 && !holdedFlag) {
                    const {x: x1, y: y1} = latestPoint[latestPoint.length - 2];
                    const {x: x2, y: y2} = latestPoint[latestPoint.length - 1];
                    const dist = Math.sqrt(Math.abs(x1 - x2) ^ 2 + Math.abs(y1 - y2) ^ 2);
                    if (dist > opts.flickThreshold) {
                        target.dispatchEvent(new CustomEvent('flick', {
                            bubbles: true,
                            cancelable: true,
                            detail: {start: pointertart._poi, poi: {x: x1, y: y1}, rawEv: evt, angle: Math.atan2(y2 - y1, x2 - x1), speed: dist}
                        }));
                    }
                }
                latestPoint = [];
                pointertart = undefined;
                holdedFlag = false;
                break;
            }
        }
    }

    target.addEventListener('touchstart', eventHandler);
    target.addEventListener('touchmove', eventHandler);
    target.addEventListener('touchend', eventHandler);
    target.addEventListener('mousedown', eventHandler);
    target.addEventListener('mousemove', eventHandler);
    target.addEventListener('mouseup', eventHandler);
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({enchantment});
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TWFnaWNUb3VjaC93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vTWFnaWNUb3VjaC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9NYWdpY1RvdWNoL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9NYWdpY1RvdWNoL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vTWFnaWNUb3VjaC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL01hZ2ljVG91Y2gvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiTWFnaWNUb3VjaFwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJNYWdpY1RvdWNoXCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgKCkgPT4ge1xucmV0dXJuICIsIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiY29uc3QgREVGQVVMVF9PUFRJT05TID0ge1xyXG4gICAgaG9sZFRocmVzaG9sZDogNzUwLFxyXG4gICAgYWNjZXB0YWJsZURpc3RUaHJlc2hvbGQ6IDEuNSxcclxuICAgIGZsaWNrVGhyZXNob2xkOiAxLjUsXHJcbn07XHJcblxyXG5PYmplY3QuZnJlZXplKERFRkFVTFRfT1BUSU9OUyk7XHJcblxyXG4vKipcclxuICogQHBhcmFtIHsgSFRNTEVsZW1lbnQgfSB0YXJnZXRcclxuICovXHJcbmV4cG9ydCBjb25zdCBlbmNoYW50bWVudCA9ICh0YXJnZXQsIG9wdHMpID0+IHtcclxuICAgIG9wdHMgPSBPYmplY3QuYXNzaWduKERFRkFVTFRfT1BUSU9OUywgb3B0cyk7XHJcbiAgICBsZXQgcG9pbnRlcnRhcnQ7XHJcbiAgICBsZXQgaG9sZGVkRmxhZyA9IGZhbHNlO1xyXG4gICAgbGV0IGxhdGVzdFBvaW50ID0gW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7TW91c2VFdmVudCB8IFRvdWNoRXZlbnR9IGV2dFxyXG4gICAgICovXHJcbiAgICBjb25zdCBldmVudEhhbmRsZXIgPSAoZXZ0KSA9PiB7XHJcbiAgICAgICAgc3dpdGNoIChldnQudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICd0b3VjaHN0YXJ0Jzoge1xyXG4gICAgICAgICAgICAgICAgbGF0ZXN0UG9pbnQgPSBbXTtcclxuICAgICAgICAgICAgICAgIGlmICghcG9pbnRlcnRhcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBwb2ludGVydGFydCA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG91Y2hlczogZXZ0LnRvdWNoZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9wb2k6IHt4OiBldnQudG91Y2hlc1swXS5wYWdlWCwgeTogZXZ0LnRvdWNoZXNbMF0ucGFnZVl9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyOiBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnaG9sZCcsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7cG9pbnQ6IHBvaW50ZXJ0YXJ0Ll9wb2ksIHJhd0V2OiBldnR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludGVydGFydCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvbGRlZEZsYWcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBvcHRzLmhvbGRUaHJlc2hvbGQpXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwb2ludGVydGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQocG9pbnRlcnRhcnQuaGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50ZXJ0YXJ0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlZG93bic6IHtcclxuICAgICAgICAgICAgICAgIGxhdGVzdFBvaW50ID0gW107XHJcbiAgICAgICAgICAgICAgICBpZiAoIXBvaW50ZXJ0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRlcnRhcnQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbjogZXZ0LmJ1dHRvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogZXZ0LmJ1dHRvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9wb2k6IHt4OiBldnQucGFnZVgsIHk6IGV2dC5wYWdlWX0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXI6IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdob2xkJywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHtwb2ludDogcG9pbnRlcnRhcnQuX3BvaSwgcmF3RXY6IGV2dH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvbGRlZEZsYWcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRlcnRhcnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIG9wdHMuaG9sZFRocmVzaG9sZClcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvaW50ZXJ0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChwb2ludGVydGFydC5oYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRlcnRhcnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSAndG91Y2htb3ZlJzoge1xyXG4gICAgICAgICAgICAgICAgaWYgKGV2dC50b3VjaGVzWzBdLnNjcmVlblkgPT09IDApIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBvaW50ZXJ0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qge3g6IHgxLCB5OiB5MX0gPSBwb2ludGVydGFydC5fcG9pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHtwYWdlWDogeDIsIHBhZ2VZOiB5Mn0gPSBldnQudG91Y2hlc1swXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0ID0gTWF0aC5zcXJ0KE1hdGguYWJzKHgxIC0geDIpIF4gMiArIE1hdGguYWJzKHkxIC0geTIpIF4gMik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghIWxhdGVzdFBvaW50Lmxlbmd0aCkgbGF0ZXN0UG9pbnQgPSBbbGF0ZXN0UG9pbnQucG9wKCldO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHtwYWdlWDogeCwgcGFnZVk6IHl9ID0gZXZ0LnRvdWNoZXNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2JqID0ge3gsIHl9O1xyXG4gICAgICAgICAgICAgICAgICAgIGxhdGVzdFBvaW50LnB1c2gob2JqKTtcclxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxhdGVzdFBvaW50W2xhdGVzdFBvaW50Lmxlbmd0aCAtIDFdID09PSBvYmopIGxhdGVzdFBvaW50ID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGlzdCA+IG9wdHMuYWNjZXB0YWJsZURpc3RUaHJlc2hvbGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHBvaW50ZXJ0YXJ0LmhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludGVydGFydC5oYW5kbGVyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaG9sZGVkRmxhZykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHtwYWdlWDogeCwgcGFnZVk6IHl9ID0gZXZ0LnRvdWNoZXNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdob2xkbW92ZScsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnViYmxlczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7cG9pOiB7eCwgeX0sIHJhd0V2OiBldnR9XHJcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSAnbW91c2Vtb3ZlJzoge1xyXG4gICAgICAgICAgICAgICAgaWYgKGV2dC5zY3JlZW5ZID09PSAwKSBicmVhaztcclxuICAgICAgICAgICAgICAgIGlmIChwb2ludGVydGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHt4OiB4MSwgeTogeTF9ID0gcG9pbnRlcnRhcnQuX3BvaTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB7cGFnZVg6IHgyLCBwYWdlWTogeTJ9ID0gZXZ0O1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpc3QgPSBNYXRoLnNxcnQoTWF0aC5hYnMoeDEgLSB4MikgXiAyICsgTWF0aC5hYnMoeTEgLSB5MikgXiAyKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXZ0LmJ1dHRvbiA9PT0gcG9pbnRlcnRhcnQuYnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgZXZ0LmJ1dHRvbnMgPT09IHBvaW50ZXJ0YXJ0LmJ1dHRvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEhbGF0ZXN0UG9pbnQubGVuZ3RoKSBsYXRlc3RQb2ludCA9IFtsYXRlc3RQb2ludC5wb3AoKV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHtwYWdlWDogeCwgcGFnZVk6IHl9ID0gZXZ0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvYmogPSB7eCwgeX07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhdGVzdFBvaW50LnB1c2gob2JqKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobGF0ZXN0UG9pbnRbbGF0ZXN0UG9pbnQubGVuZ3RoIC0gMV0gPT09IG9iaikgbGF0ZXN0UG9pbnQgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3QgPiBvcHRzLmFjY2VwdGFibGVEaXN0VGhyZXNob2xkXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgZXZ0LmJ1dHRvbiAhPT0gcG9pbnRlcnRhcnQuYnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgZXZ0LmJ1dHRvbnMgIT09IHBvaW50ZXJ0YXJ0LmJ1dHRvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHBvaW50ZXJ0YXJ0LmhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludGVydGFydC5oYW5kbGVyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaG9sZGVkRmxhZykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHtwYWdlWDogeCwgcGFnZVk6IHl9ID0gZXZ0O1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnaG9sZG1vdmUnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbDoge3BvaToge3gsIHl9LCByYXdFdjogZXZ0fVxyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgJ3RvdWNoZW5kJzoge1xyXG4gICAgICAgICAgICAgICAgaWYgKHBvaW50ZXJ0YXJ0Py5oYW5kbGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHBvaW50ZXJ0YXJ0LmhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvaW50ZXJ0YXJ0LmhhbmRsZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoaG9sZGVkRmxhZykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnaG9sZGxlYXZlJywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHtwb2k6IGxhdGVzdFBvaW50W2xhdGVzdFBvaW50Lmxlbmd0aCAtIDFdLCByYXdFdjogZXZ0fVxyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChsYXRlc3RQb2ludC5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHt4OiB4MSwgeTogeTF9ID0gbGF0ZXN0UG9pbnRbbGF0ZXN0UG9pbnQubGVuZ3RoIC0gMl07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qge3g6IHgyLCB5OiB5Mn0gPSBsYXRlc3RQb2ludFtsYXRlc3RQb2ludC5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0ID0gTWF0aC5zcXJ0KE1hdGguYWJzKHgxIC0geDIpIF4gMiArIE1hdGguYWJzKHkxIC0geTIpIF4gMik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3QgPiBvcHRzLmZsaWNrVGhyZXNob2xkICYmICFob2xkZWRGbGFnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZmxpY2snLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbDoge3N0YXJ0OiBwb2ludGVydGFydC5fcG9pLCBwb2k6IHt4OiB4MSwgeTogeTF9LCByYXdFdjogZXZ0LCBhbmdsZTogTWF0aC5hdGFuMih5MiAtIHkxLCB4MiAtIHgxKSwgc3BlZWQ6IGRpc3R9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaG9sZGVkRmxhZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgbGF0ZXN0UG9pbnQgPSBbXTtcclxuICAgICAgICAgICAgICAgIHBvaW50ZXJ0YXJ0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSAnbW91c2V1cCc6IHtcclxuICAgICAgICAgICAgICAgIGlmIChwb2ludGVydGFydD8uaGFuZGxlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChwb2ludGVydGFydC5oYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgICAgICBwb2ludGVydGFydC5oYW5kbGVyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGhvbGRlZEZsYWcpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2hvbGRsZWF2ZScsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnViYmxlczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7cG9pOiBsYXRlc3RQb2ludFtsYXRlc3RQb2ludC5sZW5ndGggLSAxXSwgcmF3RXY6IGV2dH1cclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobGF0ZXN0UG9pbnQubGVuZ3RoID49IDIgJiYgIWhvbGRlZEZsYWcpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB7eDogeDEsIHk6IHkxfSA9IGxhdGVzdFBvaW50W2xhdGVzdFBvaW50Lmxlbmd0aCAtIDJdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHt4OiB4MiwgeTogeTJ9ID0gbGF0ZXN0UG9pbnRbbGF0ZXN0UG9pbnQubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlzdCA9IE1hdGguc3FydChNYXRoLmFicyh4MSAtIHgyKSBeIDIgKyBNYXRoLmFicyh5MSAtIHkyKSBeIDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXN0ID4gb3B0cy5mbGlja1RocmVzaG9sZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2ZsaWNrJywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnViYmxlczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHtzdGFydDogcG9pbnRlcnRhcnQuX3BvaSwgcG9pOiB7eDogeDEsIHk6IHkxfSwgcmF3RXY6IGV2dCwgYW5nbGU6IE1hdGguYXRhbjIoeTIgLSB5MSwgeDIgLSB4MSksIHNwZWVkOiBkaXN0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGF0ZXN0UG9pbnQgPSBbXTtcclxuICAgICAgICAgICAgICAgIHBvaW50ZXJ0YXJ0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgaG9sZGVkRmxhZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBldmVudEhhbmRsZXIpO1xyXG4gICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIGV2ZW50SGFuZGxlcik7XHJcbiAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBldmVudEhhbmRsZXIpO1xyXG4gICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGV2ZW50SGFuZGxlcik7XHJcbiAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZXZlbnRIYW5kbGVyKTtcclxuICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZXZlbnRIYW5kbGVyKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtlbmNoYW50bWVudH07Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9