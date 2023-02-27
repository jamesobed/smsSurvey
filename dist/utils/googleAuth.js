"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const auth = new googleapis_1.google.auth.GoogleAuth({
    keyFile: 'credentialss.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
});
exports.default = auth;
//# sourceMappingURL=googleAuth.js.map