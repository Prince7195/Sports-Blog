const mongoose = require('mongoose');

// article schema
const articleSchema = mongoose.Schema({
    title: {
        type: String
    },
    subtitle: {
        type: String
    },
    category: {
        type: String
    },
    body: {
        type: String
    },
    author: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    comments: [{
        comment_subject: {
            type: String
        },
        comment_body: {
            type: String
        },
        comment_author: {
            type: String
        },
        comment_email: {
            type: String
        },
        comment_date: {
            type: String
        },
    }]
});

const Article = module.exports = mongoose.model('Article', articleSchema);

// get article
module.exports.getArticles = function (callback, limit) {
    Article.find(callback).limit(limit).sort([['title', 'ascending']]);
}

// get article by category
module.exports.getCategoryArticles = (categoryId, callback) => {
    let query = { category: categoryId }
    Article.find(query, callback).sort([['title', 'ascending']]);
}

// add article
module.exports.addArticle = function (article, callback) {
    Article.create(article, callback);
}

// get single article
module.exports.getArticleById = function (id, callback) {
    Article.findById(id, callback);
}

// update single article
module.exports.updateArticle = function (id, article, options, callback) {
    Article.findOneAndUpdate(id, article, options, callback)
}

// delete article
module.exports.removeArticle = (id, callback) => {
    Article.remove(id, callback);
}

// add comment
module.exports.addComment = (query, comment, callback) => {
    Article.update(query,{
        $push: {
            comments: comment
        }        
    }, callback);
}