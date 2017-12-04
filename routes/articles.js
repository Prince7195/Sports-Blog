const express = require('express');
const router = express.Router();

Article = require('../models/article');
Category = require('../models/category');

router.get('/', (req, res, next) => {
    Article.getArticles((err, articles) => {
        res.render('articles', {
            title: 'Articles',
            articles: articles
        });
    });
});

router.get('/show/:id', (req, res, next) => {
    Article.getArticleById(req.params.id, (error, article) => {
        res.render('article', {
            article: article
        });
    });    
});

router.get('/category/:category_id', (req, res, next) => {
    Article.getCategoryArticles(req.params.category_id ,(error, articles) => {
        Category.getCategoryById(req.params.category_id, (error, category) => {
            res.render('articles', {
                title: category.title+' Articles',
                articles: articles
            });
        });        
    });    
});

// add article - post
router.post('/add', (req, res, next) => {
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('category', 'Category is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    let errors = req.validationErrors();
    if(errors) {
        Category.getCategories((err, categories) => {
            res.render('add_article', {
                title: 'Create Article',
                errors: errors,
                categories: categories
            });
        });
    }else {
        let article = new Article();
        article.title = req.body.title;
        article.subtitle = req.body.subtitle;
        article.category = req.body.category;
        article.author = req.body.author;
        article.body = req.body.body;

        Article.addArticle(article, (err, articles) => {
            if (err) {
                res.send(err);
            }
            req.flash('success', 'Article Saved Successfully');
            res.redirect('/manage/articles');
        });
    }
    
});

// add article - post
router.post('/edit/:id', (req, res, next) => {
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('category', 'Category is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    let errors = req.validationErrors();
    if (errors) {
        Article.getArticleById(req.params.id, (err, article) => {
            if (err)
                res.send(err);
            Category.getCategories((err, categories) => {
                if (err) {
                    res.send(err);
                }
                res.render('edit_article', {
                    title: 'Edit Article',
                    errors: errors,
                    categories: categories,
                    article: article
                });
            });
        }); 
    } else {
        let article = new Article();
        const query = req.params.id;
        const update = {
            title: req.body.title,
            subtitle: req.body.subtitle,
            category: req.body.category,
            author: req.body.author,
            body: req.body.body
        }

        Article.updateArticle(query, update, {}, (err, articles) => {
            if (err) {
                res.send(err);
            }
            req.flash('success', 'Article Updated Successfully');
            res.redirect('/manage/articles');
        });
    }
    
});

// delete article
router.delete('/delete/:id', (req, res, next) => {
    const query = {
        _id: req.params.id
    };

    Article.removeArticle(query, (err, articles) => {
        if (err) {
            res.send(err);
        }
        res.status(200);
    });
});

// add comments - post

router.post('/comments/add/:id', (req, res, next) => {
    req.checkBody('comment_subject', 'Subject is required').notEmpty();
    req.checkBody('comment_author', 'Author is required').notEmpty();
    req.checkBody('comment_email', 'Email is required').notEmpty();
    req.checkBody('comment_body', 'Body is required').notEmpty();

    let errors = req.validationErrors();
    if(errors) {
        Article.getArticleById(req.params.id, (error, article) => {
            res.render('article', {
                article: article,
                errors: errors
            });
        });   
    }else {
        let article = new Article();
        let query = { _id: req.params.id}
        let comment = {
            comment_subject: req.body.comment_subject,
            comment_author: req.body.comment_author,
            comment_email: req.body.comment_email,
            comment_body: req.body.comment_body,
        }

        Article.addComment(query, comment, (error, article) => {
            res.redirect('/articles/show/' + req.params.id);
        });
    }
});

module.exports = router;