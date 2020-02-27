const express = require("express");
const router = express.Router();
const axios = require("axios");
const News = require("../models/news");
var admin = require("firebase-admin");
var serviceAccount = require("../../corona-virus-italia-firebase-adminsdk-etcfa-a6e2249698.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const timeNotification = 21600000;
const timeUpdate = 900000;

//const timeNotification = 21000;
//const timeUpdate = 20000;

var options = {
  priority: "high",
  timeToLive: 60 * 60 * 24,
  click_action: "FLUTTER_NOTIFICATION_CLICK"
};

var lastUpdate = [];
var lastUpdateString = "";
test = 0;

axios
  .get(
    "http://newsapi.org/v2/top-headlines?country=it&q=coronavirus&apiKey=4f63bdc1e1104b96a1a0961cddf3ed37"
  )
  .then(response => {
    console.log("Updated news: ", Date.now());
    lastUpdateString = response.data;
    response.data.articles.map(el => {
      var news = new News(
        el.title,
        el.description,
        el.urlToImage,
        el.publishedAt,
        el.url
      );
      lastUpdate.push(news);
    });
    console.log(lastUpdate[0]);
  });
/*admin
  .messaging()
  .sendToTopic("all", payload, options)
  .then(response => {
    console.log("notification sent");
  })
  .catch(error => {
    console.log(error);
  });
  */

setInterval(() => {
  console.log("active");
  test = test + 1;
}, 1000);

setInterval(() => {
  lastUpdateString.articles.map(el => {
    var news = new News(
      el.title,
      el.description,
      el.urlToImage,
      el.publishedAt,
      el.url
    );
    lastUpdate.push(news);
  });
  console.log(lastUpdate[0]);
  if (lastUpdate.length > 0) {
    var payload = {
      data: {
        url: lastUpdate[0].link
      },
      notification: {
        title: lastUpdate[0].title,
        body: lastUpdate[0].description,
        image: lastUpdate[0].image,
        click_action: "FLUTTER_NOTIFICATION_CLICK"
      }
    };

    admin
      .messaging()
      .sendToTopic("all", payload, options)
      .then(response => {
        console.log("notification sent");
      })
      .catch(error => {
        console.log(error);
      });
  }
}, timeNotification); //Schedule evry 6 hours --> 21600000 milliseconds

setInterval(() => {
  axios
    .get(
      "http://newsapi.org/v2/top-headlines?country=it&q=coronavirus&apiKey=4f63bdc1e1104b96a1a0961cddf3ed37"
    )
    .then(response => {
      console.log("Updated news: ", Date.now());
      lastUpdateString = response.data;
      response.data.articles.map(el => {
        var news = new News(
          el.title,
          el.description,
          el.urlToImage,
          el.publishedAt,
          el.url
        );
        lastUpdate.push(news);
      });
      console.log(lastUpdate[0]);
    });
}, timeUpdate); //Schedule evry 6 hours --> 21600000 milliseconds

router.get("/last", (req, res, next) => {
  res.send(lastUpdateString);
});

router.get("/news", (req, res, next) => {
  res.send(test);
});
module.exports = router;
