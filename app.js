const express = require('express');
const mongoose = require('mongoose');
const adminRoute = require('./routes/routes.js');
const app = express();
const http = require('http').createServer(app);
const mongodb = require('mongodb');
const io = require('socket.io').listen(http);
const multer = require('multer');
const path = require('path');
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
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: storage,
    //kiểm tra file upload có phải là hình ảnh hay không
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'));
        }
        callback(null, true);
    },
    limits: {
        fileSize: 1024 * 1024 * 5,//giới hạn filesize = 5Mb
    },
});
io.sockets.on('connection', function (socket) {
    console.log("socket kết nối thành công")
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
    socket.on('insertproduct', upload.single('image'), function (name, price, description, image) {
        var product = { name: name, price: price, description: description, image: originalname };
        collection_product.save(product, function (err, result) {
            if (err) {
                console.log("wwww" + err);
                socket.emit('insertproduct', false);
            } else {
                console.log('ok');
                socket.emit('insertproduct', true);
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

//cấu hình handlebars
const expressHbs = require('express-handlebars');
app.engine(
    '.html',
    expressHbs({
        defaultLayout: '',
    })
);
app.set('view engine', '.html');
