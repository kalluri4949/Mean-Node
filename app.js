require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const errorHandlerMiddleware = require('./middlewares/error-handler');
const cors = require('cors');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

// database connection
const connectDB = require('./db/connect');
// mongoose
//   .connect(
//     "mongodb+srv://rakesh:Bujjamma1524@nodeexpressprojects.p7z1dmn.mongodb.net/Mean-Stack?retryWrites=true&w=majority"
//   )
//   .then(() => {
//     console.log("Connected to database");
//   })
//   .catch(() => {
//     console.log("Connection Failed");
//   });

const path = require('path');
const postRouter = require('./routes/postRoutes');
const authRouter = require('./routes/userRoutes');

//Cors middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

app.use('/api/v1/posts', postRouter);
app.use('/api/v1/auth', authRouter);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

// module.exports = app;
