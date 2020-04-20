const express = require('express');
const mongoose = require('mongoose');
const adminRoute = require('./routes/routes.js');
const app = express();
const http = require('http').createServer(app);
const mongodb = require('mongodb');
const io = require('socket.io').listen(http);
const multer = require('multer');
const path = require('path');
const crypto = require('crypto')
var fileimage = "";
app.use(adminRoute);

app.use(express.static('uploads'));
app.use(express.static('public'));
// app.use('*/css', express.static('public/css'));
// app.use('*/js', express.static('public/js'));
// app.use('*/images', express.static('public/images'));
const MongoClient = mongodb.MongoClient;
const url = 'mongodb+srv://admin:admin@cluster-ht8fe.gcp.mongodb.net/test?retryWrites=true&w=majority';

// MongoClient.connect(url, function (err, db) {
//     if (err) {
//         console.log('err', url);

//     } else {
//         console.log('sfgssgsd', url);
//         collection = db.collection('admin')
//     }
// }
// );
//cấu hình multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './uploads');
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     },
// });

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        return crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) {
                return cb(err);
            }
            return cb(null, "" + (raw.toString('hex')) + (path.extname(file.originalname)));
        });
    }
});


// Post files
app.post(
    "/uploadd",
    multer({
        storage: storage
    }).single('uploadd'), function (req, res) {
        console.log(req.file);
        console.log(req.body);
        res.redirect("/uploads/" + req.file.filename);
        console.log(req.file.filename);
        fileimage = req.file.filename;
        return res.status(req.file.filename).end();
    });

io.sockets.on('connection', function (socket) {
    console.log("socket kết nối thành công");


    socket.on('login', function (email, password) {
        console.log('event: ' + email + " va pass " + password);
        const cusor = collection.find({ email: email });
        cusor.each(function (err, doc) {
            if (err) {
                console.log('err');
                socket.emit('login', false);
            } else {
                if (doc != null) {
                    if (doc.password == password) {
                        console.log(doc.password);
                        socket.emit('login', true);
                    }
                    socket.emit('login', false);

                } else {
                    socket.emit('login', false);

                }
            }
        });

    });
    socket.on('register', function (email, password) {
        var admin = { email: email, password: password };
        collection.save(admin, function (err, result) {
            if (err) {
                console.log("wwww" + err);
                socket.emit('register', false);
            } else {
                console.log('ok');
                socket.emit('register', true);
            }
        });
    });
    socket.on('insertProduct', function (name, price, description, image) {


        var product = { name: name, price: price, description: description, image: fileimage };
        collection_product.save(product, function (err, result) {
            if (err) {
                console.log("wwww" + err);
                socket.emit('insertProduct', false);
            } else {
                console.log('ok');
                socket.emit('insertProduct', true);
            }
        });
    });
    socket.on('updateProduct', function (_id, name, price, description, image) {
        console.log(name + " update ")


        collection_product.update({ _id: new mongodb.ObjectID(_id) },
            { $set: { name: name, price: price, description: description, image: fileimage } }, function (err, result) {
                if (err) {
                    console.log("wwww" + err);
                    socket.emit('updateProduct', false);
                } else {
                    console.log('ok');
                    socket.emit('updateProduct', true);
                }
            });
    });
    socket.on('deleteProduct', function (_id) {
        console.log(_id + " update ")

        const id = { _id: new mongodb.ObjectID(_id) };
        collection_product.remove(id, function (err, result) {
            if (err) {
                console.log("wwww" + err);
                socket.emit('deleteProduct', false);
            } else {
                console.log('ok');
                socket.emit('deleteProduct', true);
            }
        });
    });
    socket.on('getProduct', function (msg) {
        var cusor = collection_product.find();
        cusor.each(function (err, doc) {
            if (doc != null) {
                var products = JSON.parse(JSON.stringify(doc));
                console.log(products);
                socket.emit('getProduct', products);
            } else {
                console.log('kêt thúc');
            }
        })
    })
});

mongoose.set('useCreateIndex', true);

http.listen(process.env.PORT || 4100, () => { });

//connect to mongodb
mongoose.connect(
    'mongodb+srv://admin:admin@cluster-ht8fe.gcp.mongodb.net/test?retryWrites=true&w=majority',
    { useUnifiedTopology: true, useNewUrlParser: true },
    (err, db) => {
        if (err) {
            console.log('Can not connect to mongodb, because ' + err);
        } else {
            console.log('Connect to mongodb successful');
            collection = db.collection("admins");
            collection_product = db.collection("products");
        }
    }
);

// cấu hình handlebars
const expressHbs = require('express-handlebars');
app.engine(
    '.html',
    expressHbs({
        defaultLayout: '',
    })
);
app.set('view engine', '.html');
