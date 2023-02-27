"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../app"));
/* eslint-disable no-undef */
app_1.default.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const DB = process.env.DATABASE;
const connect = async () => {
    const connectionParams = {
        useNewUrlParser: true,
        serverApi: ServerApiVersion.v1,
    };
    try {
        await mongoose_1.default.connect(DB, connectionParams);
        console.log('Database connected');
    }
    catch (err) {
        console.log('Database connection error', err);
    }
};
exports.connect = connect;
//# sourceMappingURL=database.config.js.map