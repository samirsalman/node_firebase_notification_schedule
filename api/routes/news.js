const express = require("express");
const router = express.Router();
const axios = require("axios");
const News = require("../models/news");
var admin = require("firebase-admin");
var serviceAccount = require("../../corona-virus-italia-firebase-adminsdk-etcfa-a6e2249698.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var options = {
  priority: "high",
  timeToLive: 60 * 60 * 24,
  click_action: "FLUTTER_NOTIFICATION_CLICK"
};

var lastUpdate = [];
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
}, 600000);

setInterval(() => {
  axios
    .get("http://march.pythonanywhere.com/")
    .then(response => {
      console.log("Updated news: ", Date.now());

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
    })
    .catch(error => {
      console.log(error);
    });
}, 21600000); //Schedule evry 6 hours --> 21600000 milliseconds

router.get("/last", (req, res, next) => {
  res.send(lastUpdate);
});

module.exports = router;
