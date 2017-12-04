const express = require('express');
const router = express.Router();

Article = require('../models/article');

router.get('/', (req, res, next) => {
    Article.getArticles((err, articles) => {
        res.render('index', {
            title: 'Index',
            articles: articles
        });
    }, 5);    
});

module.exports = router;