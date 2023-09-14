const express = require("express");
const axios = require("axios");
const bodyParser = require('body-parser');
const fs = require("fs");
const cors = require('cors');

const app = express();

app.use(express.urlencoded());


app.use(bodyParser.text());

// const filepath = "./files/my_file.txt";

// let fileContent = "";
// fs.readFile(filepath, "utf8", (err, data) => {
//     if (err) {
//         console.error(`Error reading the file: ${err.message}`);
//         return;
//     }
//     fileContent = data;
// });

app.use(cors());

// app.get("/", (req, res) => {
//     res.send("Hi");
// });
// app.post("/hello", (req, res) => {
//     res.send("post okkkkkk")
// })

let BODY = "DEFAULT BODY";
let fileName = "DEFAULT";


app.post("/save", (req, res, next) => {
    BODY = JSON.parse(req.body).data;
    fileName = JSON.parse(req.body).fileName;
    res.send(BODY);
});


// app.post("/api/dropbox/redirect", (req, res) => {
//     BODY = req.body;
//     // console.log(access_token);
//     const authorizationUrl = "https://www.dropbox.com/oauth2/authorize?client_id=m4of4ek7lvyylpo&redirect_uri=http://localhost:4000/api/verify/redirect&response_type=token&access_token_type=offline";
//     fetch(authorizationUrl, {
//         method: "get",
//         headers: {
//             "Content-type": "application/json; charset=UTF-8"
//         }
//     });
// });

app.get('/api/verify/redirect', (req, res, next) => {
    const access_token = req.query;
    const code_value = access_token.code;
    const tokenEndpoint = "https://api.dropboxapi.com/oauth2/token";
    const authorizationCode = code_value; // Replace with your actual authorization code
    const redirectUri = "http://localhost:4000/api/verify/redirect"; // Replace with your actual redirect URI
    const clientId = "m4of4ek7lvyylpo"; // Replace with your Dropbox app's client ID
    const clientSecret = "jx48vq6or2uzg9e"; // Replace with your Dropbox app's client secret

    const data = new URLSearchParams();
    data.append("code", authorizationCode);
    data.append("grant_type", "authorization_code");
    data.append("redirect_uri", redirectUri);
    data.append("client_id", clientId);
    data.append("client_secret", clientSecret);

    axios
        .post(tokenEndpoint, data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
        .then((response) => {
            console.log("Access Token:", response.data.access_token);
            const accessTokenValue = response.data.access_token;

            const uploadUrl = "https://content.dropboxapi.com/2/files/upload";
            const accessToken = accessTokenValue; // Replace with your actual Dropbox access token
            // const filePath = filepath; // Replace with the path to your local file
            // const fileName = 
            const remotePath = `/folder/${fileName}.html`; // Replace with the desired remote path

            const headers = {
                Authorization: `Bearer ${accessToken}`,
                "Dropbox-API-Arg": JSON.stringify({
                    autorename: false,
                    mode: "add",
                    mute: false,
                    path: remotePath,
                    strict_conflict: false,
                }),
                "Content-Type": "application/octet-stream",
            };

            axios
                .post(uploadUrl, BODY, { headers })
                .then((response) => {
                    console.log("Upload Response:", response.data);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        })
        .catch((error) => {
            console.error("Error:", error);
        });

    console.log(code_value);
    res.send(code_value);
})





app.listen(4000, () => {
    console.log("server started");
});