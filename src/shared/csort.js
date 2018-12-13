"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const utils_1 = require("./utils");
function count(arr, start, end) {
    var len = arr.length;
    var counts = [];
    for (var i = 0; i < len; i++) {
        var num = arr[i];
        counts[num] = counts[num] ? counts[num] + 1 : 1;
    }
    return counts;
}
exports.count = count;
function output(counts, asc) {
    var output = [];
    var update = asc ? num => output.push(num) : num => output.unshift(num);
    var len = counts.length;
    for (var num = 0; num < len; num++) {
        var count = counts[num];
        if (count) {
            for (var i = 0; i < count; i++)
                update(num);
        }
    }
    return output;
}
exports.output = output;
function joinCounts(a, b) {
    var end = Math.max(a.length, b.length);
    for (var i = 0; i < end; i++) {
        var c1 = a[i] || 0;
        var c2 = b[i] || 0;
        a[i] = c1 + c2;
    }
}
exports.joinCounts = joinCounts;
/***************************************************************************/
exports.CTA_B_SEQ = asc => cb => (counts, _) => cb(output(counts, asc));
exports.CTA_SEQ_ASC = exports.CTA_B_SEQ(true);
exports.CTA_B_SIMPLE = asc => nthreads => cb => {
    var accum = [];
    var done = 0;
    return (counts, _) => {
        done++;
        joinCounts(accum, counts);
        if (done >= nthreads)
            cb(output(accum, asc));
    };
};
exports.CTA_SIMPLE_ASC_1 = exports.CTA_B_SIMPLE(true)(1);
exports.CTA_SIMPLE_ASC_2 = exports.CTA_B_SIMPLE(true)(2);
exports.CTA_B_GENERAL = asc => cb => {
    var accum = [];
    var status = [];
    var done = 0;
    var finalReached = false;
    return (counts, isDone) => {
        finalReached = isDone;
        var d = done++;
        status[d] = false;
        joinCounts(accum, counts);
        status[d] = true;
        if (finalReached) {
            var oneIsNotDone = false;
            for (var i = 0; i < status.length; i++) {
                if (!status[i]) {
                    oneIsNotDone = true;
                    break;
                }
            }
            if (!oneIsNotDone)
                cb(output(accum, asc));
        }
    };
};
exports.CTA_GENERAL_ASC = exports.CTA_B_GENERAL(true);
/***************************************************************************/
exports.ATC_SEQ = (arr, cb) => cb(count(arr, 0, arr.length), true);
exports.ATC_B_PARALLEL = nt => {
    function asyncCount(arr, s, e) {
        return __awaiter(this, void 0, void 0, function* () {
            return count(arr, s, e);
        });
    }
    return (arr, cb) => {
        var len = arr.length;
        var threads = Math.min(nt, len);
        var size = Math.ceil(len / threads);
        var countDone = 0;
        for (var i = 0; i < threads; i++) {
            var start = i * size;
            var end = Math.min(start + size, len) - 1;
            asyncCount(arr, start, end).then(c => {
                countDone++;
                cb(c, countDone == threads);
            });
        }
    };
};
exports.ATC_PARALLEL_2 = exports.ATC_B_PARALLEL(2);
exports.ATC_B_HTTP = uri => {
    function asyncCount(arr, s, e) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                console.log("ATC_HTTP Contacting", uri);
                request_1.default.post(uri, {
                    body: JSON.stringify([...utils_1.subarray(arr, s, e)]),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                }, (err, resp, body) => {
                    resolve(JSON.parse(body));
                });
            });
        });
    }
    return chunkSize => (arr, cb) => {
        var len = arr.length;
        var threads = Math.floor(len / Math.min(chunkSize, len));
        var size = Math.ceil(len / threads);
        var countDone = 0;
        for (var i = 0; i < threads; i++) {
            var start = i * size;
            var end = Math.min(start + size, len);
            asyncCount(arr, start, end).then(c => {
                countDone++;
                cb(c, countDone == threads);
            });
        }
    };
};
exports.ATC_B_HTTPALLSERVER = uri => {
    function asyncCount(arr, s, e) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                console.log("ATC_HTTPALLSERVER Contacting", uri);
                request_1.default.post(uri, {
                    body: JSON.stringify([...utils_1.subarray(arr, s, e)]),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                }, (err, resp, body) => {
                    resolve();
                });
            });
        });
    }
    function getCounts() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                request_1.default.get(uri, {
                    headers: {
                        "Accept": "application/json"
                    }
                }, (err, resp, body) => {
                    resolve(JSON.parse(body));
                });
            });
        });
    }
    return chunkSize => (arr, cb) => {
        var len = arr.length;
        var threads = Math.floor(len / Math.min(chunkSize, len));
        var size = Math.ceil(len / threads);
        var countDone = 0;
        for (var i = 0; i < threads; i++) {
            var start = i * size;
            var end = Math.min(start + size, len);
            asyncCount(arr, start, end).then(() => {
                countDone++;
                if (countDone == threads) {
                    getCounts().then(counts => {
                        cb(counts, true);
                    });
                }
            });
        }
    };
};
