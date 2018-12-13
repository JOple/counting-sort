"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_client_1 = __importDefault(require("../../config.client"));
const csort_1 = require("../shared/csort");
exports.sort = {
    vanilla: (arr) => Promise.resolve(arr.sort((a, b) => a - b)),
    csortSeq: (arr) => new Promise(resolve => {
        csort_1.ATC_SEQ(arr, csort_1.CTA_SEQ_ASC(resolve));
    }),
    csortP2: (arr) => new Promise(resolve => {
        csort_1.ATC_PARALLEL_2(arr, csort_1.CTA_SIMPLE_ASC_2(resolve));
    }),
    csortHttp: (arr) => new Promise(resolve => {
        csort_1.ATC_B_HTTP(config_client_1.default.baseUrl + config_client_1.default.csortHttpPath)(config_client_1.default.csortHttpChunkSize)(arr, csort_1.CTA_GENERAL_ASC(resolve));
    }),
    csortHttpHalfServerHalfClient: (arr, serverDist = 0.5, id = 2) => new Promise(resolve => {
        csort_1.ATC_B_HTTP_HALFCLIENT_HALFSERVER(config_client_1.default.baseUrl + config_client_1.default.csortHttpAllServerPath + "/" + id)(config_client_1.default.csortHttpChunkSize)(serverDist)(arr, csort_1.CTA_GENERAL_ASC(resolve));
    }),
    csortHttpAllServer: (arr, id = 1) => new Promise(resolve => {
        csort_1.ATC_B_HTTPALLSERVER(config_client_1.default.baseUrl + config_client_1.default.csortHttpAllServerPath + "/" + id)(config_client_1.default.csortHttpChunkSize)(arr, csort_1.CTA_SEQ_ASC(resolve));
    }),
};
