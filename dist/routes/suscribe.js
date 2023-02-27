"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const suscribeController_1 = require("../controller/suscribeController");
router.post('/suscribe', suscribeController_1.suscribeController);
exports.default = router;
//# sourceMappingURL=suscribe.js.map