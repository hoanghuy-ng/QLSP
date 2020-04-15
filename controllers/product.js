const product = require('../models/product');
//get tất cả sản phẩm
exports.getAll = function (request, response) {
    product.find({})
        .lean()
        .exec(function (error, data) {
            response.render('index', { productList: data.reverse() });
            // console.log(data);
            if (error) {
                log(error);
            }
        });
};

//get 1 sản phẩm
exports.getproduct = function (request, response) {
    product.findById(request.params.id)
        .lean()
        .exec((err, doc) => {
            if (!err) {
                response.render('edit', { product: doc });
            }
        });
};
//chỉnh sửa

exports.edit = function (request, response) {
    // routes.upload.single('image');
    product.updateOne(

        { _id: request.body._id },
        { $set: { name: request.body.name, price: request.body.price, image: request.body.image, description: request.body.description } },
        (err, doc) => {
            if (!err) {
                response.redirect('/index');
            } else {
                console.log('Edit Failed');
            }
        }
    );
};

//xóa sản phẩm
exports.delete = function (request, response) {
    product.deleteOne({ _id: request.params.id }, (err, doc) => {
        if (!err) {
            response.redirect('/index');
        } else {
            console.log(err);
        }
    });
};
