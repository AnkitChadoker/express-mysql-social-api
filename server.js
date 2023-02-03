require('dotenv').config();
const http = require('http');
const express = require('express');
require('./connection');

const auth = require('./middlewares/auth-middleware');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/user', [auth], userRoutes);

const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));