"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_server_1 = __importDefault(require("../../config.server"));
exports.app = express_1.default();
exports.default = exports.app;
require("./init");
require("./main-page");
require("./procedure-call-target");
require("./sort-services");
exports.app.listen(config_server_1.default.serverPort, () => console.log("Server started at " + config_server_1.default.serverPort));
