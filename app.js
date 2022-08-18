require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./Db/connectToDb');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const router = require('./router/router');

const port = process.env.PORT || 3001;

//middleware
app.use(express.json());

// router
app.use('/api/v1/', router);

//error middleware
app.use(errorHandler);
app.use(notFound);

const Serve = async () => {
  await connectDB(process.env.MONGO_URI);
  app.listen(port, () => {
    console.log(`Api serving on http://localhost:${port}`);
  });
};
Serve();
