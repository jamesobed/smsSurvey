import createError, { HttpError } from "http-errors";
import expressUpload from "express-fileupload";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import mailRouter from "./routes/email";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";

// Swagger
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
const swaggerDocument = YAML.load("./swagger.yaml");

// ROUTESS
import usersRouter from "./routes/users";
import contactUsRouter from "./routes/contactUsRoute";
import postRouter from "./routes/postRoute";
import commentRouter from "./routes/commentRoute";
import suscribe from "./routes/suscribe";

import { sendSurveyNotification } from "./controller/surveyController";

const secret: any = process.env.keyuyyt;
const HOUR = 3 * 1000; // 1 hour in milliseconds
// minute

const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(expressUpload());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "public")));

setInterval(() => {
  sendSurveyNotification;
}, HOUR);

const googleSecretFunction = () => {
  fs.writeFile("./credentialss.json", secret, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  console.log("success");
};

googleSecretFunction();

app.use("/api/mail", mailRouter);
app.use("/user", usersRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.use("/isds-admin", contactUsRouter);
app.use("/isds", suscribe);
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(function (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
});

export default app;
