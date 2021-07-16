"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const inversify_1 = require("inversify");
const types_1 = tslib_1.__importDefault(require("./types"));
const connections_1 = require("./connections");
var container = new inversify_1.Container();
container.bind(types_1.default.UserConnection).to(connections_1.AnonymousConnection);
exports.default = container;