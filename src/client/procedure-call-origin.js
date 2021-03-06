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
const config_client_1 = __importDefault(require("../../config.client"));
function rpc(obj) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            var url = config_client_1.default.baseUrl + config_client_1.default.rpcAccessPoint + "?q=" + encodeURI(JSON.stringify(Object.assign({}, config_client_1.default, obj)));
            console.log("Contacting " + url);
            $.get(url).done(a => {
                resolve(a);
            }).fail((e, err) => {
                reject(err);
            });
        });
    });
}
exports.rpc = rpc;
