"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../shared/utils");
exports.arr = {
    asc: n => [...utils_1.range(1, n)],
    desc: n => [...utils_1.range(n, 1)],
    rand: n => [...utils_1.range(1, n)].sort((a, b) => Math.random() - 0.5)
};
