"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.suscribeController = void 0;
const suscribeModel_1 = __importDefault(require("../model/suscribeModel"));
const utils_1 = require("../utils/utils");
// create a new suscribe controller function
const suscribeController = async (req, res, next) => {
    try {
        const { email } = req.body;
        const { error } = utils_1.suscribeSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 'error',
                message: error.details[0].message,
            });
        }
        const duplicateEmail = await suscribeModel_1.default.findOne({ email });
        if (duplicateEmail) {
            return res.status(401).json({ message: "You have already suscribed to ISDS News Letter" });
        }
        const newSuscribe = new suscribeModel_1.default({
            email,
            date: new Date().toISOString(),
        });
        newSuscribe.save((err, suscribe) => {
            if (err) {
                return res.status(400).json({
                    status: 'error',
                    message: err,
                });
            }
            return res.status(201).json({
                status: 'success',
                message: 'You have successfully suscribed',
                data: suscribe,
            });
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error,
        });
    }
};
exports.suscribeController = suscribeController;
//# sourceMappingURL=suscribeController.js.map