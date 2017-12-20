const express = require('express');
const request = require('request');
const router = express.Router();

// Mongoose Model
const SearchTerm = require('../models/searchTerm');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/api/imagesearch/:searchValue', (req, res, next) => {
  let searchValue = req.params.searchValue;
  let offset = req.query.offset;

  // Save Search Term in DB
  SearchTerm.create({ term: searchValue }, (err, searchTerm) => {
    if (err) throw err;
  });

  const key = process.env.CSE_API_KEY;
  const cx = process.env.CSE_API_CX;
  let url = 'https://www.googleapis.com/customsearch/v1?q=' + searchValue + '&cx=' + cx + '&searchType=image&key=' + key;
  if (offset) url += '&start=' + offset;

  // Google CSE API http request
  request(url, (error, response, body) => {
    let items = JSON.parse(body).items;
    let images = [];

    items.map((item) => {
      images.push({
        "url": item.link,
        "snippet": item.snippet,
        "thumbnail": item.image.thumbnailLink,
        "context": item.image.contextLink,
      });
    });

    res.json(images);
  });

});

// Display Search Terms JSON
router.get('/api/searchHistory', (req, res, next) => {
  let searchHistory = [];

  // Get Search Terms from DB
  SearchTerm.find((err, searchTerms) => {
    if (err) throw err;
    searchTerms.map((a) => { searchHistory.push({ term: a.term, date: a.date }); });
    res.json(searchHistory);
  }, 10);
});

module.exports = router;
