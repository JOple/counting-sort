"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
const csort_1 = require("../shared/csort");
_1.default.post("/ss/http", (req, res) => {
    var counts = [];
    for (var num of req.body)
        counts[num] = counts[num] ? counts[num] + 1 : 1;
    res.json(counts);
});
exports.httpAllServerStatus = {};
exports.httpAllServerRecords = {};
_1.default.get("/ss/http-all-server/", (req, res) => {
    res.json({
        records: exports.httpAllServerRecords,
        status: exports.httpAllServerStatus
    });
});
_1.default.post("/ss/http-all-server/:id", (req, res) => {
    var id = req.params.id;
    var arr = req.body;
    var counts = exports.httpAllServerRecords[id];
    if (!counts)
        exports.httpAllServerRecords[id] = counts = [];
    exports.httpAllServerStatus[id] = (exports.httpAllServerStatus[id] || 0) + 1;
    var newCounts = csort_1.count(arr, 0, arr.length);
    csort_1.joinCounts(counts, newCounts);
    exports.httpAllServerStatus[id] = exports.httpAllServerStatus[id] - 1;
    res.sendStatus(200);
});
_1.default.get("/ss/http-all-server/:id", (req, res) => {
    res.json(exports.httpAllServerRecords[req.params.id] || []);
    delete exports.httpAllServerRecords[req.params.id];
    delete exports.httpAllServerStatus[req.params.id];
});
