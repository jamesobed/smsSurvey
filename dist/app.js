"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const email_1 = __importDefault(require("./routes/email"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
// Swagger
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const swaggerDocument = yamljs_1.default.load("./swagger.yaml");
// ROUTESS
const users_1 = __importDefault(require("./routes/users"));
const contactUsRoute_1 = __importDefault(require("./routes/contactUsRoute"));
const postRoute_1 = __importDefault(require("./routes/postRoute"));
const commentRoute_1 = __importDefault(require("./routes/commentRoute"));
const suscribe_1 = __importDefault(require("./routes/suscribe"));
const surveyController_1 = require("./controller/surveyController");
const secret = process.env.keyuyyt;
const HOUR = 3 * 1000; // 1 hour in milliseconds
// minute
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)());
app.use((0, express_fileupload_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
setInterval(() => {
    surveyController_1.sendSurveyNotification;
}, HOUR);
const googleSecretFunction = () => {
    fs_1.default.writeFile("./credentialss.json", secret, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
    console.log("success");
};
googleSecretFunction();
app.use("/api/mail", email_1.default);
app.use("/user", users_1.default);
app.use("/post", postRoute_1.default);
app.use("/comment", commentRoute_1.default);
app.use("/isds-admin", contactUsRoute_1.default);
app.use("/isds", suscribe_1.default);
app.use("/", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
});
exports.default = app;
//# sourceMappingURL=app.js.map