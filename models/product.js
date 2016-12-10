/**
 * Created by HoangTruongLe on 12/8/2016.
 */
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var productSchema = new schema({
    productName: {
        type: String,
        require: true
    },
    productPrice: {
        type: String,
        require: true,
        default: 0
    },
    productImage: {
        type: Array,
        default: ['noimage.png']
    },
    productType: {
        type: String,
        default: 'none'
    },
    productInfo: {
        type: String,
        default: 'No Info'
    }
});


productSchema.statics.getProductById = function (req, res) {
    console.log(req.params.id);
    this.findOne({'_id': req.params.id}, function (err, product) {
        console.log(product);
        if (err) return res.status(404).json({'Success': false, 'Error': err});
        return res.status(200).json({'Success': true, 'Product': product});
    })
};

productSchema.statics.createProduct = function (req, res) {
    var product = new this({
        productName: req.body.productName,
        productPrice: req.body.productPrice,
        productImage: req.body.productImage,
        productType: req.body.productType,
        productInfo: req.body.productInfo
    });
    product.save().then(function (product) {
        res.status(200).json({'Success': true, 'Product': product});
    })
        .catch(function (err) {
            res.status(500).json({'Success': false, 'Error': err});
        });
};

productSchema.statics.updateProduct = function (req, res) {
    var newProduct = {
        productName: req.body.productName,
        productPrice: req.body.productPrice,
        productImage: req.body.productImage,
        productType: req.body.productType,
        productInfo: req.body.productInfo
    };
    this.findOneAndUpdate({'_id':req.body.productId},{$set: newProduct},{new:true},function (err,product) {
        if(err) res.status(404).json({'Success': false, 'Error': err});
            res.status(200).json({'Success': true, 'Product': product});
    })
};

productSchema.statics.deleteProduct = function (req, res) {
    this.findOneAndRemove({'_id':req.body.productId},function (err,reslt) {
        if(err) return res.status(404).json({'Success': false, 'Error': err});
        return res.status(200).json({'Success': true, 'Product': reslt});
    })
};
productSchema.statics.getAllProducts = function (req, res) {
    this.find().then(function (products) {
        res.status(200).json({'Success': true, 'Product': products});
    })
        .catch(function (err) {
            res.status(500).json({'Success': false, 'Error': err});
        });
};
productSchema.statics.searchProducts = function (req, res) {

};


module.exports = mongoose.model('product', productSchema);