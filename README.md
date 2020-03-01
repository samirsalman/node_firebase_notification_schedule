# Node Firebase Notification Schedule (with NEWS API)

A server that schedule updates from NewsAPI every 15 minutes and send push notifications (with Firebase) every 6 hours. The server have also two endpoints for API to have the latest news.


## How to use it

You can clone the repository, configure your firebase project and add a service account to use Firebase Push Notification and then add the file to cloned project directory and add the path to **./api/routes/news.js** file where you find `<YOUR SERVICE ACCOUNT KEY FILE>` .
You can follow this tutorial:

<a href="https://firebase.google.com/docs/admin/setup">Firebase admin SDK tutorial</a>


## How to start it

***After setting your Firebase admin SDK in the project*** and added your NewsAPI key wher you find `<YOUR NEWSAPI KEY>` in **./api/routes/news.js** file, you can start the project with `node server.js` command. ***If you start project for the first time, you must run `npm install` command.***


## Author

Samir Salman
