import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import path from 'path';
import fs from 'fs';

// Main entry point for the backend
dotenv.config();

const app = express();

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to db');
    fs.readFile('cloths.json', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const products = JSON.parse(data);
      const db = mongoose.connection;
      const collection = db.collection('products');
      products.forEach((product) => {
        collection.insertOne(product, function (err) {
          if (err) {
            console.error(err);
            return;
          }
        });
      });
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API endpoint to return clientID for PayPal
app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

// Serve the static files from the React app
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));

// Catch-all route to serve index.html for any unmatched route (client-side routing)
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
