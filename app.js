// Imports
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const csurf = require('csurf');
const mongoose = require('mongoose');
const mongoDBStore = require('connect-mongodb-session')(session);
const multer = require('multer');
const port = process.env.PORT || 3000

// Adding Routers
const publicRouter = require('./routers/public');
const adminRouter = require('./routers/admin');
const accountRouter = require('./routers/account');

// MongoDB connection string
const uri = process.env.MONGODB_URI || 'mongodb+srv://GhostITShell:GitS1995@gits.rcujn.mongodb.net/?retryWrites=true&w=majority';

// Store for sessions
var store = new mongoDBStore({
    uri: uri,
    collection: 'mySessions'
})

// Multer Configuration
app.use(express.static(path.join(__dirname,'public')));
const maxSize = 100 * 1024 * 1024;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage, limits: { fieldSize: maxSize }}).single('image');

// Adding helpful stuffs
app.use(upload)
app.use(bodyParser.urlencoded({
    limit:'200mb',
    parameterLimit: 100000,
    extended: false}));
app.use(cookieParser());
app.use(csurf({cookie: true}));
app.use(session({
    secret: 'GhostITShell',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000 
    },
    store: store
}));

//Adding Routers
app.use(publicRouter);
app.use('/admin', adminRouter);
app.use(accountRouter);

app.set('view engine', 'pug');
app.set('views', './views');

mongoose.connect(uri, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true
                    })
.then(() => {
    console.log('Connected to MongoDB!');
    app.listen(port);
})
.catch(err =>{
    console.log(err);
})