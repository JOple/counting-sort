"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
const config_server_1 = __importDefault(require("../../config.server"));
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
_1.default.use(express_1.default.json());
_1.default.use(express_1.default.urlencoded());
_1.default.use(express_1.default.static(path_1.join(config_server_1.default.rootDir, "public")));
