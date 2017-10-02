// Bring in our scrape script and makeDate scripts
var scrape = require("../scripts/scrape");
var makeDate = require("../scripts/date");

// Bring in the Headline and Note mongoose models
var Headline = require("../models/Headline");

module.exports = {
  fetch: function(cb) {

    // Run scrape function
    scrape(function(data) {
      // Here data is an array of article objects with headlines and summaries
      // Setting this to articles for clarity
      var articles = data;
      // Make sure each article object has a date and is not saved by default
      for (var i = 0; i < articles.length; i++) {
        articles[i].date = makeDate();
        articles[i].saved = false;
      }
      
      Headline.collection.insertMany(articles, { ordered: false }, function(err, docs) {
        cb(err, docs);
      });
    });
  },
  delete: function(query, cb) {
    Headline.remove(query, cb);
  },
  get: function(query, cb) {
    // Prepare a query to get the data we scraped,
    // and sort starting from most recent (sorted by id num)
    Headline.find(query)
      .sort({
        _id: -1
      })
      // Execute this query
      .exec(function(err, doc) {
        // Once finished, pass the list into the callback function
        cb(doc);
      });
  },
  update: function(query, cb) {
    // Update the headline with the id supplied
    // set it to be equal to any new values we pass in on query
    Headline.update({ _id: query._id }, {
      $set: query
    }, {}, cb);
  }
};
