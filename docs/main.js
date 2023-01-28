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

let opts = {...DEFAULT_OPTIONS};
let pointertart;
let holdedFlag = false;
let latestPoint = [];
let latestStartElem;

/**
 * @param { HTMLElement } target
 */
function enchantment (target, _opts) {
    opts = Object.assign(DEFAULT_OPTIONS, _opts);

    /**
     *
     * @param {MouseEvent | TouchEvent} evt
     */
    const eventHandler = evt => {
        switch (evt.type) {
            case 'touchstart': {
                latestStartElem = target;
                latestPoint = [];
                if (!pointertart) {
                    pointertart = {
                        touches: evt.touches,
                        _poi: {x: evt.touches[0].pageX, y: evt.touches[0].pageY},
                        handler: setTimeout(() => {
                            target.dispatchEvent(new CustomEvent('hold', {
                                bubbles: true,
                                cancelable: true,
                                detail: {point: pointertart._poi, rawEv: evt},
                            }));
                            pointertart.handler = undefined;
                            holdedFlag = true;
                        }, opts.holdThreshold),
                    };
                }
                else if (pointertart.handler) {
                    clearTimeout(pointertart.handler);
                    pointertart.handler = undefined;
                }

                break;
            }

            case 'mousedown': {
                latestStartElem = target;
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
                                detail: {point: pointertart._poi, rawEv: evt},
                            }));
                            holdedFlag = true;
                            pointertart.handler = undefined;
                        }, opts.holdThreshold),
                    };
                }
                else if (pointertart.handler) {
                    clearTimeout(pointertart.handler);
                    pointertart.handler = undefined;
                }

                break;
            }

            case 'touchmove': {
                if (evt.touches[0].screenY !== 0 && holdedFlag && latestStartElem && target !== latestStartElem) {
                    const {pageX: x, pageY: y} = evt.touches[0];
                    target.dispatchEvent(new CustomEvent('holdover', {
                        bubbles: true,
                        cancelable: true,
                        detail: {point: {x, y}, rawEv: evt},
                    }));
                }
                break;
            }

            case 'mousemove': {
                if (evt.screenY !== 0 && holdedFlag && latestStartElem && target !== latestStartElem) {
                    const {pageX: x, pageY: y} = evt;
                    target.dispatchEvent(new CustomEvent('holdover', {
                        bubbles: true,
                        cancelable: true,
                        detail: {point: {x, y}, item: latestStartElem, rawEv: evt},
                    }));
                }
                break;
            }

            case 'touchend': {
                if (holdedFlag && latestStartElem && target !== latestStartElem) {
                    const {pageX: x, pageY: y} = evt.touches[0];
                    target.dispatchEvent(new CustomEvent('holddrop', {
                        bubbles: true,
                        cancelable: true,
                        detail: {point: {x, y}, item: latestStartElem, rawEv: evt},
                    }));
                }
                break;
            }

            case 'mouseup': {
                if (holdedFlag && latestStartElem && target !== latestStartElem) {
                    const {pageX: x, pageY: y} = evt;
                    target.dispatchEvent(new CustomEvent('holddrop', {
                        bubbles: true,
                        cancelable: true,
                        detail: {point: {x, y}, rawEv: evt},
                    }));
                }
                break;
            }
        }
    };

    target.addEventListener('touchstart', eventHandler);
    target.addEventListener('mousedown', eventHandler);
    target.addEventListener('touchmove', eventHandler);
    target.addEventListener('touchend', eventHandler);
    target.addEventListener('mousemove', eventHandler);
    target.addEventListener('mouseup', eventHandler);
}

function windowEventHander (evt) {
    if (!latestStartElem) return;

    switch (evt.type) {
        case 'touchmove': {
            if (evt.touches[0].screenY === 0) break;

            if (pointertart) {
                const {x: x1, y: y1} = pointertart._poi;
                const {pageX: x2, pageY: y2} = evt.touches[0];
                const dist = Math.sqrt(Math.abs(x1 - x2) ^ 2 + Math.abs(y1 - y2) ^ 2);

                if (latestPoint.length > 0) {
                    latestPoint = [latestPoint.pop()];
                }

                const {pageX: x, pageY: y} = evt.touches[0];
                const obj = {x, y};
                latestPoint.push(obj);
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    if (latestPoint[latestPoint.length - 1] === obj)
                        latestPoint = [];
                }));

                if (dist > opts.acceptableDistThreshold) {
                    clearTimeout(pointertart.handler);
                    pointertart.handler = undefined;
                }
            }

            if (holdedFlag) {
                const {pageX: x, pageY: y} = evt.touches[0];
                latestStartElem.dispatchEvent(new CustomEvent('holdmove', {
                    bubbles: true,
                    cancelable: true,
                    detail: {point: {x, y}, rawEv: evt},
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
                    if (latestPoint.length > 0) {
                        latestPoint = [latestPoint.pop()];
                    }

                    const {pageX: x, pageY: y} = evt;
                    const obj = {x, y};
                    latestPoint.push(obj);
                    requestAnimationFrame(() => requestAnimationFrame(() => {
                        if (latestPoint[latestPoint.length - 1] === obj)
                            latestPoint = [];
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
                latestStartElem.dispatchEvent(new CustomEvent('holdmove', {
                    bubbles: true,
                    cancelable: true,
                    detail: {point: {x, y}, rawEv: evt},
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
                latestStartElem.dispatchEvent(new CustomEvent('holdleave', {
                    bubbles: true,
                    cancelable: true,
                    detail: {point: latestPoint[latestPoint.length - 1], rawEv: evt},
                }));
            }

            if (latestPoint.length >= 2) {
                const {x: x1, y: y1} = latestPoint[latestPoint.length - 2];
                const {x: x2, y: y2} = latestPoint[latestPoint.length - 1];
                const dist = Math.sqrt(Math.abs(x1 - x2) ^ 2 + Math.abs(y1 - y2) ^ 2);
                if (dist > opts.flickThreshold && !holdedFlag) {
                    latestStartElem.dispatchEvent(new CustomEvent('flick', {
                        bubbles: true,
                        cancelable: true,
                        detail: {start: pointertart._poi, point: {x: x1, y: y1}, rawEv: evt, angle: Math.atan2(y2 - y1, x2 - x1), speed: dist},
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
                latestStartElem.dispatchEvent(new CustomEvent('holdleave', {
                    bubbles: true,
                    cancelable: true,
                    detail: {point: latestPoint[latestPoint.length - 1], rawEv: evt},
                }));
            }

            if (latestPoint.length >= 2 && !holdedFlag) {
                const {x: x1, y: y1} = latestPoint[latestPoint.length - 2];
                const {x: x2, y: y2} = latestPoint[latestPoint.length - 1];
                const dist = Math.sqrt(Math.abs(x1 - x2) ^ 2 + Math.abs(y1 - y2) ^ 2);
                if (dist > opts.flickThreshold) {
                    latestStartElem.dispatchEvent(new CustomEvent('flick', {
                        bubbles: true,
                        cancelable: true,
                        detail: {start: pointertart._poi, point: {x: x1, y: y1}, rawEv: evt, angle: Math.atan2(y2 - y1, x2 - x1), speed: dist},
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

window.addEventListener('touchmove', windowEventHander);
window.addEventListener('touchend', windowEventHander);
window.addEventListener('mousemove', windowEventHander);
window.addEventListener('mouseup', windowEventHander);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({enchantment});

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QW9CO0FBQzNDO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixRQUFRLEtBQUssYUFBYTtBQUN2RCxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLHVEQUF1RDtBQUNwRixpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGNBQWM7QUFDckMsdUJBQXVCLGNBQWM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxpQ0FBaUMsYUFBYSwrREFBK0Q7QUFDOUkscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLHVEQUF1RDtBQUNwRixpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGNBQWM7QUFDckMsdUJBQXVCLGNBQWM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxpQ0FBaUMsYUFBYSwrREFBK0Q7QUFDOUkscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUVBQWUsQ0FBQyxZQUFZLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9NYWdpY1RvdWNoL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9NYWdpY1RvdWNoL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL01hZ2ljVG91Y2gvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL01hZ2ljVG91Y2gvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9NYWdpY1RvdWNoL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vTWFnaWNUb3VjaC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJNYWdpY1RvdWNoXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIk1hZ2ljVG91Y2hcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCAoKSA9PiB7XG5yZXR1cm4gIiwiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJjb25zdCBERUZBVUxUX09QVElPTlMgPSB7XHJcbiAgICBob2xkVGhyZXNob2xkOiA3NTAsXHJcbiAgICBhY2NlcHRhYmxlRGlzdFRocmVzaG9sZDogMS41LFxyXG4gICAgZmxpY2tUaHJlc2hvbGQ6IDEuNSxcclxufTtcclxuXHJcbk9iamVjdC5mcmVlemUoREVGQVVMVF9PUFRJT05TKTtcclxuXHJcbmxldCBvcHRzID0gey4uLkRFRkFVTFRfT1BUSU9OU307XHJcbmxldCBwb2ludGVydGFydDtcclxubGV0IGhvbGRlZEZsYWcgPSBmYWxzZTtcclxubGV0IGxhdGVzdFBvaW50ID0gW107XHJcbmxldCBsYXRlc3RTdGFydEVsZW07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHsgSFRNTEVsZW1lbnQgfSB0YXJnZXRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBlbmNoYW50bWVudCAodGFyZ2V0LCBfb3B0cykge1xyXG4gICAgb3B0cyA9IE9iamVjdC5hc3NpZ24oREVGQVVMVF9PUFRJT05TLCBfb3B0cyk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtNb3VzZUV2ZW50IHwgVG91Y2hFdmVudH0gZXZ0XHJcbiAgICAgKi9cclxuICAgIGNvbnN0IGV2ZW50SGFuZGxlciA9IGV2dCA9PiB7XHJcbiAgICAgICAgc3dpdGNoIChldnQudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICd0b3VjaHN0YXJ0Jzoge1xyXG4gICAgICAgICAgICAgICAgbGF0ZXN0U3RhcnRFbGVtID0gdGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgbGF0ZXN0UG9pbnQgPSBbXTtcclxuICAgICAgICAgICAgICAgIGlmICghcG9pbnRlcnRhcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBwb2ludGVydGFydCA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG91Y2hlczogZXZ0LnRvdWNoZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9wb2k6IHt4OiBldnQudG91Y2hlc1swXS5wYWdlWCwgeTogZXZ0LnRvdWNoZXNbMF0ucGFnZVl9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyOiBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnaG9sZCcsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7cG9pbnQ6IHBvaW50ZXJ0YXJ0Ll9wb2ksIHJhd0V2OiBldnR9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRlcnRhcnQuaGFuZGxlciA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvbGRlZEZsYWcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBvcHRzLmhvbGRUaHJlc2hvbGQpLFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwb2ludGVydGFydC5oYW5kbGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHBvaW50ZXJ0YXJ0LmhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvaW50ZXJ0YXJ0LmhhbmRsZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlZG93bic6IHtcclxuICAgICAgICAgICAgICAgIGxhdGVzdFN0YXJ0RWxlbSA9IHRhcmdldDtcclxuICAgICAgICAgICAgICAgIGxhdGVzdFBvaW50ID0gW107XHJcbiAgICAgICAgICAgICAgICBpZiAoIXBvaW50ZXJ0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRlcnRhcnQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbjogZXZ0LmJ1dHRvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogZXZ0LmJ1dHRvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9wb2k6IHt4OiBldnQucGFnZVgsIHk6IGV2dC5wYWdlWX0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXI6IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdob2xkJywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHtwb2ludDogcG9pbnRlcnRhcnQuX3BvaSwgcmF3RXY6IGV2dH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBob2xkZWRGbGFnID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50ZXJ0YXJ0LmhhbmRsZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIG9wdHMuaG9sZFRocmVzaG9sZCksXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBvaW50ZXJ0YXJ0LmhhbmRsZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQocG9pbnRlcnRhcnQuaGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRlcnRhcnQuaGFuZGxlciA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY2FzZSAndG91Y2htb3ZlJzoge1xyXG4gICAgICAgICAgICAgICAgaWYgKGV2dC50b3VjaGVzWzBdLnNjcmVlblkgIT09IDAgJiYgaG9sZGVkRmxhZyAmJiBsYXRlc3RTdGFydEVsZW0gJiYgdGFyZ2V0ICE9PSBsYXRlc3RTdGFydEVsZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB7cGFnZVg6IHgsIHBhZ2VZOiB5fSA9IGV2dC50b3VjaGVzWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnaG9sZG92ZXInLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbDoge3BvaW50OiB7eCwgeX0sIHJhd0V2OiBldnR9LFxyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjYXNlICdtb3VzZW1vdmUnOiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXZ0LnNjcmVlblkgIT09IDAgJiYgaG9sZGVkRmxhZyAmJiBsYXRlc3RTdGFydEVsZW0gJiYgdGFyZ2V0ICE9PSBsYXRlc3RTdGFydEVsZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB7cGFnZVg6IHgsIHBhZ2VZOiB5fSA9IGV2dDtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2hvbGRvdmVyJywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHtwb2ludDoge3gsIHl9LCBpdGVtOiBsYXRlc3RTdGFydEVsZW0sIHJhd0V2OiBldnR9LFxyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjYXNlICd0b3VjaGVuZCc6IHtcclxuICAgICAgICAgICAgICAgIGlmIChob2xkZWRGbGFnICYmIGxhdGVzdFN0YXJ0RWxlbSAmJiB0YXJnZXQgIT09IGxhdGVzdFN0YXJ0RWxlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHtwYWdlWDogeCwgcGFnZVk6IHl9ID0gZXZ0LnRvdWNoZXNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdob2xkZHJvcCcsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnViYmxlczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7cG9pbnQ6IHt4LCB5fSwgaXRlbTogbGF0ZXN0U3RhcnRFbGVtLCByYXdFdjogZXZ0fSxcclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY2FzZSAnbW91c2V1cCc6IHtcclxuICAgICAgICAgICAgICAgIGlmIChob2xkZWRGbGFnICYmIGxhdGVzdFN0YXJ0RWxlbSAmJiB0YXJnZXQgIT09IGxhdGVzdFN0YXJ0RWxlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHtwYWdlWDogeCwgcGFnZVk6IHl9ID0gZXZ0O1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnaG9sZGRyb3AnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbDoge3BvaW50OiB7eCwgeX0sIHJhd0V2OiBldnR9LFxyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGV2ZW50SGFuZGxlcik7XHJcbiAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZXZlbnRIYW5kbGVyKTtcclxuICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBldmVudEhhbmRsZXIpO1xyXG4gICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgZXZlbnRIYW5kbGVyKTtcclxuICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBldmVudEhhbmRsZXIpO1xyXG4gICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBldmVudEhhbmRsZXIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB3aW5kb3dFdmVudEhhbmRlciAoZXZ0KSB7XHJcbiAgICBpZiAoIWxhdGVzdFN0YXJ0RWxlbSkgcmV0dXJuO1xyXG5cclxuICAgIHN3aXRjaCAoZXZ0LnR5cGUpIHtcclxuICAgICAgICBjYXNlICd0b3VjaG1vdmUnOiB7XHJcbiAgICAgICAgICAgIGlmIChldnQudG91Y2hlc1swXS5zY3JlZW5ZID09PSAwKSBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGlmIChwb2ludGVydGFydCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qge3g6IHgxLCB5OiB5MX0gPSBwb2ludGVydGFydC5fcG9pO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qge3BhZ2VYOiB4MiwgcGFnZVk6IHkyfSA9IGV2dC50b3VjaGVzWzBdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGlzdCA9IE1hdGguc3FydChNYXRoLmFicyh4MSAtIHgyKSBeIDIgKyBNYXRoLmFicyh5MSAtIHkyKSBeIDIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChsYXRlc3RQb2ludC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGF0ZXN0UG9pbnQgPSBbbGF0ZXN0UG9pbnQucG9wKCldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHtwYWdlWDogeCwgcGFnZVk6IHl9ID0gZXZ0LnRvdWNoZXNbMF07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvYmogPSB7eCwgeX07XHJcbiAgICAgICAgICAgICAgICBsYXRlc3RQb2ludC5wdXNoKG9iaik7XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGF0ZXN0UG9pbnRbbGF0ZXN0UG9pbnQubGVuZ3RoIC0gMV0gPT09IG9iailcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGF0ZXN0UG9pbnQgPSBbXTtcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGlzdCA+IG9wdHMuYWNjZXB0YWJsZURpc3RUaHJlc2hvbGQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQocG9pbnRlcnRhcnQuaGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRlcnRhcnQuaGFuZGxlciA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGhvbGRlZEZsYWcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHtwYWdlWDogeCwgcGFnZVk6IHl9ID0gZXZ0LnRvdWNoZXNbMF07XHJcbiAgICAgICAgICAgICAgICBsYXRlc3RTdGFydEVsZW0uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2hvbGRtb3ZlJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHtwb2ludDoge3gsIHl9LCByYXdFdjogZXZ0fSxcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjYXNlICdtb3VzZW1vdmUnOiB7XHJcbiAgICAgICAgICAgIGlmIChldnQuc2NyZWVuWSA9PT0gMCkgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBpZiAocG9pbnRlcnRhcnQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHt4OiB4MSwgeTogeTF9ID0gcG9pbnRlcnRhcnQuX3BvaTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHtwYWdlWDogeDIsIHBhZ2VZOiB5Mn0gPSBldnQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkaXN0ID0gTWF0aC5zcXJ0KE1hdGguYWJzKHgxIC0geDIpIF4gMiArIE1hdGguYWJzKHkxIC0geTIpIF4gMik7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXZ0LmJ1dHRvbiA9PT0gcG9pbnRlcnRhcnQuYnV0dG9uXHJcbiAgICAgICAgICAgICAgICB8fCBldnQuYnV0dG9ucyA9PT0gcG9pbnRlcnRhcnQuYnV0dG9ucykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXRlc3RQb2ludC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhdGVzdFBvaW50ID0gW2xhdGVzdFBvaW50LnBvcCgpXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHtwYWdlWDogeCwgcGFnZVk6IHl9ID0gZXZ0O1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9iaiA9IHt4LCB5fTtcclxuICAgICAgICAgICAgICAgICAgICBsYXRlc3RQb2ludC5wdXNoKG9iaik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsYXRlc3RQb2ludFtsYXRlc3RQb2ludC5sZW5ndGggLSAxXSA9PT0gb2JqKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF0ZXN0UG9pbnQgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGRpc3QgPiBvcHRzLmFjY2VwdGFibGVEaXN0VGhyZXNob2xkXHJcbiAgICAgICAgICAgICAgICB8fCBldnQuYnV0dG9uICE9PSBwb2ludGVydGFydC5idXR0b25cclxuICAgICAgICAgICAgICAgIHx8IGV2dC5idXR0b25zICE9PSBwb2ludGVydGFydC5idXR0b25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHBvaW50ZXJ0YXJ0LmhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvaW50ZXJ0YXJ0LmhhbmRsZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChob2xkZWRGbGFnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7cGFnZVg6IHgsIHBhZ2VZOiB5fSA9IGV2dDtcclxuICAgICAgICAgICAgICAgIGxhdGVzdFN0YXJ0RWxlbS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnaG9sZG1vdmUnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnViYmxlczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDoge3BvaW50OiB7eCwgeX0sIHJhd0V2OiBldnR9LFxyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNhc2UgJ3RvdWNoZW5kJzoge1xyXG4gICAgICAgICAgICBpZiAocG9pbnRlcnRhcnQ/LmhhbmRsZXIpIHtcclxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChwb2ludGVydGFydC5oYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgIHBvaW50ZXJ0YXJ0LmhhbmRsZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChob2xkZWRGbGFnKSB7XHJcbiAgICAgICAgICAgICAgICBsYXRlc3RTdGFydEVsZW0uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2hvbGRsZWF2ZScsIHtcclxuICAgICAgICAgICAgICAgICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7cG9pbnQ6IGxhdGVzdFBvaW50W2xhdGVzdFBvaW50Lmxlbmd0aCAtIDFdLCByYXdFdjogZXZ0fSxcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGxhdGVzdFBvaW50Lmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7eDogeDEsIHk6IHkxfSA9IGxhdGVzdFBvaW50W2xhdGVzdFBvaW50Lmxlbmd0aCAtIDJdO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qge3g6IHgyLCB5OiB5Mn0gPSBsYXRlc3RQb2ludFtsYXRlc3RQb2ludC5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRpc3QgPSBNYXRoLnNxcnQoTWF0aC5hYnMoeDEgLSB4MikgXiAyICsgTWF0aC5hYnMoeTEgLSB5MikgXiAyKTtcclxuICAgICAgICAgICAgICAgIGlmIChkaXN0ID4gb3B0cy5mbGlja1RocmVzaG9sZCAmJiAhaG9sZGVkRmxhZykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhdGVzdFN0YXJ0RWxlbS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZmxpY2snLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbDoge3N0YXJ0OiBwb2ludGVydGFydC5fcG9pLCBwb2ludDoge3g6IHgxLCB5OiB5MX0sIHJhd0V2OiBldnQsIGFuZ2xlOiBNYXRoLmF0YW4yKHkyIC0geTEsIHgyIC0geDEpLCBzcGVlZDogZGlzdH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBob2xkZWRGbGFnID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxhdGVzdFBvaW50ID0gW107XHJcbiAgICAgICAgICAgIHBvaW50ZXJ0YXJ0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNhc2UgJ21vdXNldXAnOiB7XHJcbiAgICAgICAgICAgIGlmIChwb2ludGVydGFydD8uaGFuZGxlcikge1xyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHBvaW50ZXJ0YXJ0LmhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgcG9pbnRlcnRhcnQuaGFuZGxlciA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGhvbGRlZEZsYWcpIHtcclxuICAgICAgICAgICAgICAgIGxhdGVzdFN0YXJ0RWxlbS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnaG9sZGxlYXZlJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHtwb2ludDogbGF0ZXN0UG9pbnRbbGF0ZXN0UG9pbnQubGVuZ3RoIC0gMV0sIHJhd0V2OiBldnR9LFxyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAobGF0ZXN0UG9pbnQubGVuZ3RoID49IDIgJiYgIWhvbGRlZEZsYWcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHt4OiB4MSwgeTogeTF9ID0gbGF0ZXN0UG9pbnRbbGF0ZXN0UG9pbnQubGVuZ3RoIC0gMl07XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7eDogeDIsIHk6IHkyfSA9IGxhdGVzdFBvaW50W2xhdGVzdFBvaW50Lmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGlzdCA9IE1hdGguc3FydChNYXRoLmFicyh4MSAtIHgyKSBeIDIgKyBNYXRoLmFicyh5MSAtIHkyKSBeIDIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpc3QgPiBvcHRzLmZsaWNrVGhyZXNob2xkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGF0ZXN0U3RhcnRFbGVtLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdmbGljaycsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnViYmxlczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7c3RhcnQ6IHBvaW50ZXJ0YXJ0Ll9wb2ksIHBvaW50OiB7eDogeDEsIHk6IHkxfSwgcmF3RXY6IGV2dCwgYW5nbGU6IE1hdGguYXRhbjIoeTIgLSB5MSwgeDIgLSB4MSksIHNwZWVkOiBkaXN0fSxcclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxhdGVzdFBvaW50ID0gW107XHJcbiAgICAgICAgICAgIHBvaW50ZXJ0YXJ0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBob2xkZWRGbGFnID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHdpbmRvd0V2ZW50SGFuZGVyKTtcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgd2luZG93RXZlbnRIYW5kZXIpO1xyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgd2luZG93RXZlbnRIYW5kZXIpO1xyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHdpbmRvd0V2ZW50SGFuZGVyKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtlbmNoYW50bWVudH07XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==