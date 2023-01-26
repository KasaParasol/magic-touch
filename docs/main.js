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
        }
    };

    target.addEventListener('touchstart', eventHandler);
    target.addEventListener('mousedown', eventHandler);
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
                    detail: {poi: {x, y}, rawEv: evt},
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
                    detail: {poi: {x, y}, rawEv: evt},
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
                    detail: {poi: latestPoint[latestPoint.length - 1], rawEv: evt},
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
                        detail: {start: pointertart._poi, poi: {x: x1, y: y1}, rawEv: evt, angle: Math.atan2(y2 - y1, x2 - x1), speed: dist},
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
                    detail: {poi: latestPoint[latestPoint.length - 1], rawEv: evt},
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
                        detail: {start: pointertart._poi, poi: {x: x1, y: y1}, rawEv: evt, angle: Math.atan2(y2 - y1, x2 - x1), speed: dist},
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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YztBQUNyQyx1QkFBdUIsY0FBYztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLCtCQUErQixhQUFhLCtEQUErRDtBQUM1SSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBZSxDQUFDLFlBQVksRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL01hZ2ljVG91Y2gvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL01hZ2ljVG91Y2gvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vTWFnaWNUb3VjaC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vTWFnaWNUb3VjaC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL01hZ2ljVG91Y2gvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9NYWdpY1RvdWNoLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIk1hZ2ljVG91Y2hcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiTWFnaWNUb3VjaFwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsICgpID0+IHtcbnJldHVybiAiLCIvLyBUaGUgcmVxdWlyZSBzY29wZVxudmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHtcclxuICAgIGhvbGRUaHJlc2hvbGQ6IDc1MCxcclxuICAgIGFjY2VwdGFibGVEaXN0VGhyZXNob2xkOiAxLjUsXHJcbiAgICBmbGlja1RocmVzaG9sZDogMS41LFxyXG59O1xyXG5cclxuT2JqZWN0LmZyZWV6ZShERUZBVUxUX09QVElPTlMpO1xyXG5cclxubGV0IG9wdHMgPSB7Li4uREVGQVVMVF9PUFRJT05TfTtcclxubGV0IHBvaW50ZXJ0YXJ0O1xyXG5sZXQgaG9sZGVkRmxhZyA9IGZhbHNlO1xyXG5sZXQgbGF0ZXN0UG9pbnQgPSBbXTtcclxubGV0IGxhdGVzdFN0YXJ0RWxlbTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0geyBIVE1MRWxlbWVudCB9IHRhcmdldFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGVuY2hhbnRtZW50ICh0YXJnZXQsIF9vcHRzKSB7XHJcbiAgICBvcHRzID0gT2JqZWN0LmFzc2lnbihERUZBVUxUX09QVElPTlMsIF9vcHRzKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge01vdXNlRXZlbnQgfCBUb3VjaEV2ZW50fSBldnRcclxuICAgICAqL1xyXG4gICAgY29uc3QgZXZlbnRIYW5kbGVyID0gZXZ0ID0+IHtcclxuICAgICAgICBzd2l0Y2ggKGV2dC50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3RvdWNoc3RhcnQnOiB7XHJcbiAgICAgICAgICAgICAgICBsYXRlc3RTdGFydEVsZW0gPSB0YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICBsYXRlc3RQb2ludCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFwb2ludGVydGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvaW50ZXJ0YXJ0ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3VjaGVzOiBldnQudG91Y2hlcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3BvaToge3g6IGV2dC50b3VjaGVzWzBdLnBhZ2VYLCB5OiBldnQudG91Y2hlc1swXS5wYWdlWX0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXI6IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdob2xkJywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHtwb2ludDogcG9pbnRlcnRhcnQuX3BvaSwgcmF3RXY6IGV2dH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludGVydGFydC5oYW5kbGVyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9sZGVkRmxhZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIG9wdHMuaG9sZFRocmVzaG9sZCksXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBvaW50ZXJ0YXJ0LmhhbmRsZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQocG9pbnRlcnRhcnQuaGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRlcnRhcnQuaGFuZGxlciA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY2FzZSAnbW91c2Vkb3duJzoge1xyXG4gICAgICAgICAgICAgICAgbGF0ZXN0U3RhcnRFbGVtID0gdGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgbGF0ZXN0UG9pbnQgPSBbXTtcclxuICAgICAgICAgICAgICAgIGlmICghcG9pbnRlcnRhcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBwb2ludGVydGFydCA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uOiBldnQuYnV0dG9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBldnQuYnV0dG9ucyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3BvaToge3g6IGV2dC5wYWdlWCwgeTogZXZ0LnBhZ2VZfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcjogc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2hvbGQnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnViYmxlczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbDoge3BvaW50OiBwb2ludGVydGFydC5fcG9pLCByYXdFdjogZXZ0fSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvbGRlZEZsYWcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRlcnRhcnQuaGFuZGxlciA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgb3B0cy5ob2xkVGhyZXNob2xkKSxcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocG9pbnRlcnRhcnQuaGFuZGxlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChwb2ludGVydGFydC5oYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgICAgICBwb2ludGVydGFydC5oYW5kbGVyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGV2ZW50SGFuZGxlcik7XHJcbiAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZXZlbnRIYW5kbGVyKTtcclxufVxyXG5cclxuZnVuY3Rpb24gd2luZG93RXZlbnRIYW5kZXIgKGV2dCkge1xyXG4gICAgaWYgKCFsYXRlc3RTdGFydEVsZW0pIHJldHVybjtcclxuXHJcbiAgICBzd2l0Y2ggKGV2dC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAndG91Y2htb3ZlJzoge1xyXG4gICAgICAgICAgICBpZiAoZXZ0LnRvdWNoZXNbMF0uc2NyZWVuWSA9PT0gMCkgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBpZiAocG9pbnRlcnRhcnQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHt4OiB4MSwgeTogeTF9ID0gcG9pbnRlcnRhcnQuX3BvaTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHtwYWdlWDogeDIsIHBhZ2VZOiB5Mn0gPSBldnQudG91Y2hlc1swXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRpc3QgPSBNYXRoLnNxcnQoTWF0aC5hYnMoeDEgLSB4MikgXiAyICsgTWF0aC5hYnMoeTEgLSB5MikgXiAyKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobGF0ZXN0UG9pbnQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhdGVzdFBvaW50ID0gW2xhdGVzdFBvaW50LnBvcCgpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCB7cGFnZVg6IHgsIHBhZ2VZOiB5fSA9IGV2dC50b3VjaGVzWzBdO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2JqID0ge3gsIHl9O1xyXG4gICAgICAgICAgICAgICAgbGF0ZXN0UG9pbnQucHVzaChvYmopO1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhdGVzdFBvaW50W2xhdGVzdFBvaW50Lmxlbmd0aCAtIDFdID09PSBvYmopXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhdGVzdFBvaW50ID0gW107XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGRpc3QgPiBvcHRzLmFjY2VwdGFibGVEaXN0VGhyZXNob2xkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHBvaW50ZXJ0YXJ0LmhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvaW50ZXJ0YXJ0LmhhbmRsZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChob2xkZWRGbGFnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7cGFnZVg6IHgsIHBhZ2VZOiB5fSA9IGV2dC50b3VjaGVzWzBdO1xyXG4gICAgICAgICAgICAgICAgbGF0ZXN0U3RhcnRFbGVtLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdob2xkbW92ZScsIHtcclxuICAgICAgICAgICAgICAgICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7cG9pOiB7eCwgeX0sIHJhd0V2OiBldnR9LFxyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNhc2UgJ21vdXNlbW92ZSc6IHtcclxuICAgICAgICAgICAgaWYgKGV2dC5zY3JlZW5ZID09PSAwKSBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGlmIChwb2ludGVydGFydCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qge3g6IHgxLCB5OiB5MX0gPSBwb2ludGVydGFydC5fcG9pO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qge3BhZ2VYOiB4MiwgcGFnZVk6IHkyfSA9IGV2dDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRpc3QgPSBNYXRoLnNxcnQoTWF0aC5hYnMoeDEgLSB4MikgXiAyICsgTWF0aC5hYnMoeTEgLSB5MikgXiAyKTtcclxuICAgICAgICAgICAgICAgIGlmIChldnQuYnV0dG9uID09PSBwb2ludGVydGFydC5idXR0b25cclxuICAgICAgICAgICAgICAgIHx8IGV2dC5idXR0b25zID09PSBwb2ludGVydGFydC5idXR0b25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhdGVzdFBvaW50Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGF0ZXN0UG9pbnQgPSBbbGF0ZXN0UG9pbnQucG9wKCldO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qge3BhZ2VYOiB4LCBwYWdlWTogeX0gPSBldnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2JqID0ge3gsIHl9O1xyXG4gICAgICAgICAgICAgICAgICAgIGxhdGVzdFBvaW50LnB1c2gob2JqKTtcclxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxhdGVzdFBvaW50W2xhdGVzdFBvaW50Lmxlbmd0aCAtIDFdID09PSBvYmopXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXRlc3RQb2ludCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGlzdCA+IG9wdHMuYWNjZXB0YWJsZURpc3RUaHJlc2hvbGRcclxuICAgICAgICAgICAgICAgIHx8IGV2dC5idXR0b24gIT09IHBvaW50ZXJ0YXJ0LmJ1dHRvblxyXG4gICAgICAgICAgICAgICAgfHwgZXZ0LmJ1dHRvbnMgIT09IHBvaW50ZXJ0YXJ0LmJ1dHRvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQocG9pbnRlcnRhcnQuaGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRlcnRhcnQuaGFuZGxlciA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGhvbGRlZEZsYWcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHtwYWdlWDogeCwgcGFnZVk6IHl9ID0gZXZ0O1xyXG4gICAgICAgICAgICAgICAgbGF0ZXN0U3RhcnRFbGVtLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdob2xkbW92ZScsIHtcclxuICAgICAgICAgICAgICAgICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7cG9pOiB7eCwgeX0sIHJhd0V2OiBldnR9LFxyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNhc2UgJ3RvdWNoZW5kJzoge1xyXG4gICAgICAgICAgICBpZiAocG9pbnRlcnRhcnQ/LmhhbmRsZXIpIHtcclxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChwb2ludGVydGFydC5oYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgIHBvaW50ZXJ0YXJ0LmhhbmRsZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChob2xkZWRGbGFnKSB7XHJcbiAgICAgICAgICAgICAgICBsYXRlc3RTdGFydEVsZW0uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2hvbGRsZWF2ZScsIHtcclxuICAgICAgICAgICAgICAgICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7cG9pOiBsYXRlc3RQb2ludFtsYXRlc3RQb2ludC5sZW5ndGggLSAxXSwgcmF3RXY6IGV2dH0sXHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChsYXRlc3RQb2ludC5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qge3g6IHgxLCB5OiB5MX0gPSBsYXRlc3RQb2ludFtsYXRlc3RQb2ludC5sZW5ndGggLSAyXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHt4OiB4MiwgeTogeTJ9ID0gbGF0ZXN0UG9pbnRbbGF0ZXN0UG9pbnQubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkaXN0ID0gTWF0aC5zcXJ0KE1hdGguYWJzKHgxIC0geDIpIF4gMiArIE1hdGguYWJzKHkxIC0geTIpIF4gMik7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGlzdCA+IG9wdHMuZmxpY2tUaHJlc2hvbGQgJiYgIWhvbGRlZEZsYWcpIHtcclxuICAgICAgICAgICAgICAgICAgICBsYXRlc3RTdGFydEVsZW0uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2ZsaWNrJywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHtzdGFydDogcG9pbnRlcnRhcnQuX3BvaSwgcG9pOiB7eDogeDEsIHk6IHkxfSwgcmF3RXY6IGV2dCwgYW5nbGU6IE1hdGguYXRhbjIoeTIgLSB5MSwgeDIgLSB4MSksIHNwZWVkOiBkaXN0fSxcclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGhvbGRlZEZsYWcgPSBmYWxzZTtcclxuICAgICAgICAgICAgbGF0ZXN0UG9pbnQgPSBbXTtcclxuICAgICAgICAgICAgcG9pbnRlcnRhcnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2FzZSAnbW91c2V1cCc6IHtcclxuICAgICAgICAgICAgaWYgKHBvaW50ZXJ0YXJ0Py5oYW5kbGVyKSB7XHJcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQocG9pbnRlcnRhcnQuaGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICBwb2ludGVydGFydC5oYW5kbGVyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaG9sZGVkRmxhZykge1xyXG4gICAgICAgICAgICAgICAgbGF0ZXN0U3RhcnRFbGVtLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdob2xkbGVhdmUnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnViYmxlczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDoge3BvaTogbGF0ZXN0UG9pbnRbbGF0ZXN0UG9pbnQubGVuZ3RoIC0gMV0sIHJhd0V2OiBldnR9LFxyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAobGF0ZXN0UG9pbnQubGVuZ3RoID49IDIgJiYgIWhvbGRlZEZsYWcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHt4OiB4MSwgeTogeTF9ID0gbGF0ZXN0UG9pbnRbbGF0ZXN0UG9pbnQubGVuZ3RoIC0gMl07XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7eDogeDIsIHk6IHkyfSA9IGxhdGVzdFBvaW50W2xhdGVzdFBvaW50Lmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGlzdCA9IE1hdGguc3FydChNYXRoLmFicyh4MSAtIHgyKSBeIDIgKyBNYXRoLmFicyh5MSAtIHkyKSBeIDIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpc3QgPiBvcHRzLmZsaWNrVGhyZXNob2xkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGF0ZXN0U3RhcnRFbGVtLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdmbGljaycsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnViYmxlczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7c3RhcnQ6IHBvaW50ZXJ0YXJ0Ll9wb2ksIHBvaToge3g6IHgxLCB5OiB5MX0sIHJhd0V2OiBldnQsIGFuZ2xlOiBNYXRoLmF0YW4yKHkyIC0geTEsIHgyIC0geDEpLCBzcGVlZDogZGlzdH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsYXRlc3RQb2ludCA9IFtdO1xyXG4gICAgICAgICAgICBwb2ludGVydGFydCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgaG9sZGVkRmxhZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB3aW5kb3dFdmVudEhhbmRlcik7XHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHdpbmRvd0V2ZW50SGFuZGVyKTtcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHdpbmRvd0V2ZW50SGFuZGVyKTtcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB3aW5kb3dFdmVudEhhbmRlcik7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7ZW5jaGFudG1lbnR9O1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=