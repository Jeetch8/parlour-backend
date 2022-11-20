require("dotenv").config();
require("express-async-errors");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const expressFileUpload = require("express-fileupload");
const notFoundMiddleware = require("./Middleware/not-found");
const errorHandlerMiddleware = require("./Middleware/error-handler");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const { setOriginHeader } = require("./Middleware/OriginSetter");

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
// app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json({ limit: "100mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.static("./public"));
app.use(expressFileUpload({ useTempFiles: true }));
app.use(setOriginHeader);

// Routes
app.use("/api/v1/admin", require("./Routes/Admin_Routes"));
app.use("/api/v1/blogs", require("./Routes/Blog_Routes"));
app.use("/api/v1/user/auth", require("./Routes/UserAuth_Routes"));
app.use("/api/v1/imageUpload", require("./Routes/ImageUpload_Route"));

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URL, () => {
  app.listen(port);
  console.log(`Server Running on ${port}`);
});
