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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
const config_server_1 = __importDefault(require("../../config.server"));
const osm = __importStar(require("../client/index"));
_1.default.get("/rpc", (req, res) => {
    const defaults = {
        sort: "vanilla",
        arr: "desc",
        n: 1000,
        show: false,
    };
    var cfg = JSON.parse(req.query.q || "{}");
    var cmd = Object.assign({}, config_server_1.default, osm.config, defaults, cfg);
    for (var key in cmd)
        osm.config[key] = cmd[key];
    console.log("RpcOpts:", cmd);
    var out = [];
    var fn = osm.sort[cmd.sort];
    var arr = [...osm.arr[cmd.arr](cmd.n)];
    osm.execTime(function (arr) {
        return __awaiter(this, void 0, void 0, function* () {
            out = yield fn(arr);
        });
    }, arr).then(time => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json({
            opts: cmd,
            execTime: time,
            output: cfg.show ? out : undefined
        });
    });
});
