"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotsPattern = /\./g;
function createClassName(selector) {
    return selector.replace(dotsPattern, '_dot');
}
exports.default = createClassName;
