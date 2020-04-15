const adminController = require('../controllers/admin');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
//import modules
const multer = require('multer');
const path = require('path');
//lấy dữ liệu từ form
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//import controllers
const productController = require('../controllers/product');

//import models
const product = require('../models/product');
const Admin = require('../models/admin');

//import controller
const session = require('express-session');
const Passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

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
//phương thức upload file + insert dư liệu vào mongoDB
router.post('/upload', upload.single('image'), (request, response) => {
    let Product = new product({
        name: request.body.name,
        price: request.body.price,
        description: request.body.description,
        image: request.file.originalname, //chỉ lấy tên file upload

    });

    Product.save(function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            response.redirect('/index');
        }
    });
});

//cấu hình Passport
router.use(
    session({
        secret: 'mysecret', //thuôc tính bắt buộc
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 10,
        },
        //cookie sẽ tồn tại trong 5 phút, nếu xóa dòng code sau thì cookie sẽ hết hạn sau khi đóng trinh duyệt
    })
);

//2 hàm khởi tạo passport
router.use(Passport.initialize());
router.use(Passport.session());
//chứng thực thông tin đăng nhập trên mongoDB
Passport.use(
    new LocalStrategy(
        //email, password là name của thẻ input trong form login, nếu k khai báo mặc định sẽ là username, password
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        (email, password, done) => {
            Admin.findOne({ email: email, password: password }, function (err, user) {
                console.log(user);
                if (err) {
                    console.log(err);
                }
                if (user) {
                    //thành công sẽ trả về true với giá trị user
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    )
);
//sau khi chứng thức thành công passport sẽ gọi hàm .serializeUser() vói tham số user giá trị đã lưu bên trên
//chọn thuộc tính email của user để ghi vào cookie
Passport.serializeUser((user, done) => {
    done(null, user.email);
});
//biến cookieID chính là giá trị user.email bên trên
Passport.deserializeUser((cookieID, done) => {
    Admin.findOne({ email: cookieID }, function (err, user) {
        if (err) {
            console.log(err);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
});
//khai báo phương thức xác thực đăng nhập sau
const isAuthenticated = function (request, response, next) {
    if (request.isAuthenticated()) return next();
    response.redirect('/'); //nếu chưa đăng nhập sẽ quay về trang login
};




router.get('/', (req, res) => {
    res.render('Login');
});

router.post('/Login', Passport.authenticate('local', {
    successRedirect: '/index',
    failureRedirect: '/'
}));

// router.get('/register', (req, res) => {
//     res.render('SignUp');
// });

// router.post('/register', adminController.register);
// router.get('/index', (req, res) => {
//     res.render('Main');
// });
//get All
router.get('/index', isAuthenticated, productController.getAll);
//get Watch
router.get('/edit/:id', productController.getproduct);
//edit
router.post('/edit', isAuthenticated, productController.edit);
//delete
router.get('/delete/:id', isAuthenticated, productController.delete);





module.exports = router;
