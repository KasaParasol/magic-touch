const DEFAULT_OPTIONS = {
    holdThreshold: 750,
    acceptableDistThreshold: 1.5,
    flickThreshold: 1.5,
};

Object.freeze(DEFAULT_OPTIONS);

/**
 * @param { HTMLElement } target
 */
export const enchantment = (target, opts) => {
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

export default {enchantment};