// Download the Firebase config to a local, untracked file.
var fs = require("fs");
var https = require("https");
var FIREBASE_CONFIG_URL = 'https://climateiq.web.app/__/firebase/init.json';

function downloadFirebaseConfig() {
    var file = fs.createWriteStream('firebase-config.json');
    https.get(FIREBASE_CONFIG_URL, function (response) {
        response.pipe(file);
    });
}

downloadFirebaseConfig();
