const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.DBURL;

const user = require('./Route/userRoute');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/API',user);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);

mongoose.connect(MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB',MONGO_URI);
}).catch((err) => {
    console.log('Error connecting to MongoDB', err);
});