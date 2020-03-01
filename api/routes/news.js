const express = require("express");
const router = express.Router();
const axios = require("axios");
const News = require("../models/news");
var admin = require("firebase-admin");
var serviceAccount = require("../../<YOUR SERVICE ACCOUNT KEY FILE>");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const timeNotification = 21600000;
const timeUpdate = 900000;

//const timeNotification = 21000;
//const timeUpdate = 20000;

//Firebase notifications options (for Flutter front-end)
var options = {
  priority: "high",
  timeToLive: 60 * 60 * 24,
  click_action: "FLUTTER_NOTIFICATION_CLICK"
};

//lastUpdate is an array with last news, updated every 15 minutes
var lastUpdate = [];
//lastUpdateString is the json String of the update from NewsAPI.
var lastUpdateString = "";

//Initialize lastUpdate and lastUpdateStringfor the first time
axios
  .get(
    "http://newsapi.org/v2/top-headlines?country=<YOUR COUNTRY>&apiKey=<YOUR NEWSAPI KEY>"
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

//Schedule a function every 6 hours that send a push notification to all devices with the last news (title, description and image)
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
    //payload for our notification, you can see firebase admin sdk doc for explain
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

    //function from firebase admin SDK that send notification
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

//function to update news evry 15 minutes
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

//endpoint to have last news
router.get("/last", (req, res, next) => {
  res.send(lastUpdateString);
});

module.exports = router;
