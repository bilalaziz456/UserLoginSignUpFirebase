const firebase = require("firebase");
firebase.initializeApp({
    serviceAccount: "./userandinventory-firebase-adminsdk-ptuwk-eee35cdeb8.json",
    databaseURL: "https://userandinventory.firebaseio.com/"
});
let databaseConnection = firebase.database();
module.exports = databaseConnection;