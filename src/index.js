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
export const enchantment = (target, _opts) => {
    opts = Object.assign(DEFAULT_OPTIONS, _opts);

    /**
     * 
     * @param {MouseEvent | TouchEvent} evt
     */
    const eventHandler = (evt) => {
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
                                detail: {point: pointertart._poi, rawEv: evt}
                            }));
                            pointertart.handler = undefined;
                            holdedFlag = true;
                        }, opts.holdThreshold)
                    };
                }
                else {
                    if (pointertart.handler) {
                        clearTimeout(pointertart.handler);
                        pointertart.handler = undefined;
                    }
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
                                detail: {point: pointertart._poi, rawEv: evt}
                            }));
                            holdedFlag = true;
                            pointertart.handler = undefined;
                        }, opts.holdThreshold)
                    };
                }
                else {
                    if (pointertart.handler) {
                        clearTimeout(pointertart.handler);
                        pointertart.handler = undefined;
                    }
                }
                break;
            }
        }
    };

    target.addEventListener('touchstart', eventHandler);
    target.addEventListener('mousedown', eventHandler);
};

const windowEventHander = (evt) => {
    if (!latestStartElem) return;
    switch(evt.type) {
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
                latestStartElem.dispatchEvent(new CustomEvent('holdmove', {
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
                latestStartElem.dispatchEvent(new CustomEvent('holdmove', {
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
                latestStartElem.dispatchEvent(new CustomEvent('holdleave', {
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
                    latestStartElem.dispatchEvent(new CustomEvent('flick', {
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
                latestStartElem.dispatchEvent(new CustomEvent('holdleave', {
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
                    latestStartElem.dispatchEvent(new CustomEvent('flick', {
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
};

window.addEventListener('touchmove', windowEventHander);
window.addEventListener('touchend', windowEventHander);
window.addEventListener('mousemove', windowEventHander);
window.addEventListener('mouseup', windowEventHander);

export default {enchantment};