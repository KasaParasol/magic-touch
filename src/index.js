const DEFAULT_OPTIONS = {
    holdThreshold: 750,
    acceptableDistThreshold: 16,
    flickThreshold: 3,
};

Object.freeze(DEFAULT_OPTIONS);

/**
 * @param { HTMLElement } target
 */
export const enchantment = (target, opts) => {
    opts = Object.assign(DEFAULT_OPTIONS, opts);
    let pointertart;
    let holdedFlag = false;
    let flickFlag = false;
    let latestPoint = [];
    /**
     * 
     * @param {MouseEvent | TouchEvent} evt 
     */
    const eventHandler = (evt) => {
        switch (evt.type) {
            case 'touchstart': {
                latestPoint = [];
                flickFlag = false;
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
                flickFlag = false;
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
                flickFlag = false;
                if (pointertart) {
                    const {x: x1, y: y1} = pointertart._poi;
                    const {pageX: x2, pageY: y2} = evt.touches[0];
                    const dist = Math.sqrt(Math.abs(x1 - x2) ^ 2 + Math.abs(y1 - y2) ^ 2);
                    if (dist > opts.acceptableDistThreshold) {
                        clearTimeout(pointertart.handler);
                        pointertart.handler = undefined;
                    }
                }
                break;
            }
            case 'mousemove': {
                flickFlag = false;
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

                break;
            }
            case 'touchend': {
                latestPoint = [];
                holdedFlag = false;
                if (pointertart?.handler) {
                    clearTimeout(pointertart.handler);
                    pointertart.handler = undefined;
                }
                pointertart = undefined;
                break;
            }
            case 'mouseup': {
                holdedFlag = false;
                if (pointertart?.handler) {
                    clearTimeout(pointertart.handler);
                    pointertart.handler = undefined;
                }
                if (latestPoint.length >= 2) {
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

export default {enchantment};