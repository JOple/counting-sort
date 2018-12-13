"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    baseUrl: "http://localhost:" + (process.env.PORT || 3000),
    rpcAccessPoint: "/rpc",
    csortHttpPath: "/ss/http",
    csortHttpAllServerPath: "/ss/http-all-server",
    csortHttpChunkSize: 10000
};
exports.default = exports.config;
