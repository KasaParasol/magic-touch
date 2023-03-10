const DEFAULT_OPTIONS = {
    holdThreshold: 750,
    acceptableDistThreshold: 1.5,
    flickThreshold: 1.5,
};

Object.freeze(DEFAULT_OPTIONS);

let opts = {...DEFAULT_OPTIONS};
let pointertart;
let holdedFlag = false;
let flickJudge = [];
let latestPoint;
let latestStartElem;
let calcDepthTargets = [];
const enchanted = [];

/**
 * @param { HTMLElement } target
 */
export function enchantment (target, _opts) {
    opts = Object.assign(DEFAULT_OPTIONS, _opts);

    enchanted.push(target);

    /**
     *
     * @param {MouseEvent | TouchEvent} evt
     */
    const eventHandler = evt => {
        const calcTarget = enchanted.filter(e => e.contains(evt.target))
                                     .map(e => {return {ref: e, result: calcdepth(e)}})
                                     .reduce((a, e) => !a || a.result < e.result? e: a )
                                     .ref;
        if (calcTarget !== evt.currentTarget) return;

        switch (evt.type) {
            case 'touchstart': {
                calcDepthTargets.push(target);
                setTimeout(() => {
                    const t = calcDepthTargets.reduce((a, e) => {
                        if (!a) return {result: calcdepth(e), ref: e};
                        const depth = calcdepth(e);
                        if (a.result < depth) return {result: depth, ref: e};
                    }, undefined).ref;
                    calcDepthTargets = [];

                    if (t !== target) return;

                    latestStartElem = target;
                    flickJudge = [];
                    latestPoint = {x: evt.touches[0].pageX, y: evt.touches[0].pageY};
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
                }, 1);
                break;
            }

            case 'mousedown': {
                calcDepthTargets.push(target);
                setTimeout(() => {
                    const t = calcDepthTargets.reduce((a, e) => {
                        if (!a) return {result: calcdepth(e), ref: e};
                        const depth = calcdepth(e);
                        if (a.result < depth) return {result: depth, ref: e};
                    }, undefined).ref;
                    calcDepthTargets = [];

                    if (t !== target) return;
                    latestStartElem = target;
                    flickJudge = [];
                    latestPoint = {x: evt.pageX, y: evt.pageY};
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
                }, 1);
                break;
            }

            case 'touchmove': {
                evt.preventDefault();
                const {pageX: x, pageY: y} = evt.touches[0];
                const i = document.elementFromPoint(x, y);

                if (evt.touches[0].screenY !== 0 && holdedFlag && latestStartElem && i !== latestStartElem && enchanted.includes(i)) {
                    i.dispatchEvent(new CustomEvent('holdover', {
                        bubbles: true,
                        cancelable: true,
                        detail: {point: {x, y}, item: latestStartElem, rawEv: evt},
                    }));
                }
                break;
            }

            case 'mousemove': {
                if (evt.screenY !== 0 && holdedFlag && latestStartElem && target !== latestStartElem) {
                    if (evt.button === pointertart.button
                    && evt.buttons === pointertart.buttons) {
                        const {pageX: x, pageY: y} = evt;
                        target.dispatchEvent(new CustomEvent('holdover', {
                            bubbles: true,
                            cancelable: true,
                            detail: {point: {x, y}, item: latestStartElem, rawEv: evt},
                        }));
                    }
                }

                break;
            }

            case 'touchend': {
                evt.preventDefault();
                const holdedFlagCache = holdedFlag;

                setTimeout(() => {
                    const {x, y} = latestPoint;
                    const i = document.elementFromPoint(x, y);

                    document.querySelector('textarea').value = `${holdedFlagCache}`

                    if (holdedFlagCache && latestStartElem && latestStartElem !== i && enchanted.includes(i)) {
                        i.dispatchEvent(new CustomEvent('holddrop', {
                            bubbles: true,
                            cancelable: true,
                            detail: {point: {x, y}, item: latestStartElem, rawEv: evt},
                        }));
                    }
                }, 1);
                break;
            }

            case 'mouseup': {
                const holdedFlagCache = holdedFlag;

                calcDepthTargets.push(target);
                setTimeout(() => {
                    const t = calcDepthTargets.reduce((a, e) => {
                        if (!a) return {result: calcdepth(e), ref: e};
                        const depth = calcdepth(e);
                        if (a.result < depth) return {result: depth, ref: e};
                    }, undefined).ref;
                    calcDepthTargets = [];

                    if (t !== target) return;

                    if (holdedFlagCache && latestStartElem && target !== latestStartElem) {
                        const {pageX: x, pageY: y} = evt;
                        target.dispatchEvent(new CustomEvent('holddrop', {
                            bubbles: true,
                            cancelable: true,
                            detail: {point: {x, y}, item: latestStartElem, rawEv: evt},
                        }));
                    }
                }, 1);
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
            evt.preventDefault();
            if (evt.touches[0].screenY === 0) break;

            if (pointertart) {
                const {x: x1, y: y1} = pointertart._poi;
                const {pageX: x2, pageY: y2} = evt.touches[0];
                const dist = Math.sqrt(Math.abs(x1 - x2) ^ 2 + Math.abs(y1 - y2) ^ 2);

                if (flickJudge.length > 0) {
                    flickJudge = [flickJudge.pop()];
                }

                const {pageX: x, pageY: y} = evt.touches[0];
                const obj = {x, y};
                flickJudge.push(obj);
                latestPoint = obj;
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    if (flickJudge[flickJudge.length - 1] === obj)
                        flickJudge = [];
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
                && evt.buttons === pointertart.buttons) {
                    if (flickJudge.length > 0) {
                        flickJudge = [flickJudge.pop()];
                    }

                    const {pageX: x, pageY: y} = evt;
                    const obj = {x, y};
                    flickJudge.push(obj);
                    latestPoint = obj;
                    requestAnimationFrame(() => requestAnimationFrame(() => {
                        if (flickJudge[flickJudge.length - 1] === obj)
                            flickJudge = [];
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
            evt.preventDefault();

            if (pointertart?.handler) {
                clearTimeout(pointertart.handler);
                pointertart.handler = undefined;
            }

            if (holdedFlag) {
                latestStartElem.dispatchEvent(new CustomEvent('holdleave', {
                    bubbles: true,
                    cancelable: true,
                    detail: {point: flickJudge[flickJudge.length - 1], rawEv: evt},
                }));
            }

            if (flickJudge.length >= 2) {
                const {x: x1, y: y1} = flickJudge[flickJudge.length - 2];
                const {x: x2, y: y2} = flickJudge[flickJudge.length - 1];
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
            flickJudge = [];
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
                    detail: {point: flickJudge[flickJudge.length - 1], rawEv: evt},
                }));
            }

            if (flickJudge.length >= 2 && !holdedFlag) {
                const {x: x1, y: y1} = flickJudge[flickJudge.length - 2];
                const {x: x2, y: y2} = flickJudge[flickJudge.length - 1];
                const dist = Math.sqrt(Math.abs(x1 - x2) ^ 2 + Math.abs(y1 - y2) ^ 2);
                if (dist > opts.flickThreshold) {
                    latestStartElem.dispatchEvent(new CustomEvent('flick', {
                        bubbles: true,
                        cancelable: true,
                        detail: {start: pointertart._poi, point: {x: x1, y: y1}, rawEv: evt, angle: Math.atan2(y2 - y1, x2 - x1), speed: dist},
                    }));
                }
            }

            flickJudge = [];
            pointertart = undefined;
            holdedFlag = false;
            break;
        }
    }
}

const calcdepth = (e) => {
    let current = e;
    let depth = 0;
    while (current.parentElement) {
        current = current.parentElement;
        depth++;
    }
    return depth;
}

window.addEventListener('touchmove', windowEventHander);
window.addEventListener('touchend', windowEventHander);
window.addEventListener('mousemove', windowEventHander);
window.addEventListener('mouseup', windowEventHander);

export default {enchantment};
