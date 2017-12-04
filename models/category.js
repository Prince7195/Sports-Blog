const mongoose = require('mongoose');

// category schema
const categorySchema = mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    }
});

const Category = module.exports = mongoose.model('Category', categorySchema);

// get categories
module.exports.getCategories = function(callback, limit) {
    Category.find(callback).limit(limit).sort([['title', 'ascending']]);
}

// add category
module.exports.addCategory = function(category, callback) {
    Category.create(category, callback);
}

// get single category
module.exports.getCategoryById = function(id, callback) {
    Category.findById(id, callback);
}

// update single category
module.exports.updateCategory = function(id, category, options, callback) {
    Category.findOneAndUpdate(id, category, options, callback)
}

// delete category
module.exports.removeCategory = (id, callback) => {
    Category.remove(id, callback);
}