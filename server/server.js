const express = require("express");
const { google } = require("googleapis");
const request = require("request");
const cors = require("cors");
const urlParse = require("url-parse");
const queryParse = require("query-string");
const bodyParser = require("body-parser");
const axios = require("axios");
var opn = require("opn");
const morgan = require("morgan");
const pd = require("node-pandas");
const nodemailer = require("nodemailer");
const Gmailpush = require("gmailpush");

const app = express();

app.use(cors());
app.use(morgan("dev"));
// app.use(cors({origin: 'https://google.com'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

const gmailpush = new Gmailpush({
  clientId:
    "YOUR_CLIENT_ID",
  clientSecret: "YOUR_CLIENT_SECRET",
  pubsubTopic: "YOUR_PUB_SUB_TOPIC_URL",
});

let user_credentials = [];
app.get("/abc", (req, res) => {
  // console.log(req.body);
  const oauth2Client = new google.auth.OAuth2(
    "YOUR_CLIENT_ID",
    "YOUR_CLIENT_SECRET",
    "YOUR_REDIRECT_URL" 
  );
  const scopes = [
    "https://mail.google.com/",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/pubsub",
  ];
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    state: JSON.stringify({
      callbackUrl: req.body.callbackUrl,
      userID: req.body.userid,
    }),
  });
  request(url, (err, response, body) => {
    console.log("error: ", err);
    console.log("statusCode: ", response && response.statusCode);
    // console.log("Response: ", response);
    console.log(url);
    
    res.send({ url });
  });
});
let accessToken = "";
let refreshToken = "";
let email = "";
let token = {};
app.get("/go", async (req, res) => {
  // console.log(response);
  const queryUrl = new urlParse(req.url);
  const code = queryParse.parse(queryUrl.query).code;
  console.log("code: ", code);
  const oauth2Client = new google.auth.OAuth2(
    "YOUR_CLIENT_ID",
    "YOUR_CLIENT_SECRET",
    "YOUR_REDIRECT_URL"
  );
  const {tokens} = await oauth2Client.getToken(code);
  token = tokens;
  // console.log(tokens);
  console.log(token);

  accessToken = tokens.access_token;
  refreshToken = tokens.refresh_token;
  console.log("Access token", accessToken);
  console.log("refresh token", refreshToken);

  res.redirect("http://localhost:3000/csv");
});

app.get("/useremail", async (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    "YOUR_CLIENT_ID",
    "YOUR_CLIENT_SECRET",
    "YOUR_REDIRECT_URL"
  );

  oauth2Client.setCredentials({ access_token: accessToken });
  var oauth2 = google.oauth2({
    auth: oauth2Client,
    version: "v2",
  });
  const info = await oauth2.userinfo.get();
  email = info.data.email;
  console.log(email);
  res.send(email);
});

app.post("/emails", async (req, res) => {
  // console.log(req.body);
  let columns = [];
  let colsData = [];
  const d = req.body;
  console.log(d);
  csvFileData = d.filedata;
  // console.log(csvFileData);
  csvFileData.map((datarows, i) => {
    if (i === 0) {
      columns.push(...datarows);
    } else if (i < csvFileData.length - 1) {
      colsData.push(datarows);
    }
  });

  // console.log(inputLength.followup0);
  // console.log(columns);
  // console.log(colsData);
  // df = pd.DataFrame(colsData, columns);
  // console.log(df);
  // df.forEach(ele=>{
  //   let messag="hffkkd {Name}"
  //   message=messag.s
  //   console.log(ele);
  // })
  function interpolate(string, obj) {
    return string.replace(/{{(.+?)}}/g, (m, p1) => obj[p1] ?? "");
  }
  var newData = {};
  var dataobjects = [];
  // const ddd={}
  colsData.map((rows, index) => {
    let data = { ...rows };
    var keys = Object.keys(data);

    for (var a in columns) {
      //using new obj
      newData[columns[a]] = data[keys[a]];

      //editing same obj
      data[columns[a]] = data[keys[a]];
      delete data[keys[a]];
    }

    // console.log(data);
    // console.log(newData);
    dataobjects.push(data);
  });
  console.log(dataobjects);
  // console.log();

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: email,
      clientId:
        "YOUR_CLIENT_ID",
      clientSecret: "YOUR_CLIENT_SECRET",
      refreshToken: refreshToken,
      accessToken: accessToken,
    },
  });

  dataobjects.map((obj) => {
    // for (let i=0; i<df.length; i++){
    let to_email = interpolate("{{Email}}", obj);
    transporter.sendMail({
      from: email,
      to: to_email,
      subject: d.emailHeader.subject,
      html:
        interpolate(d.emailBody, obj) +
        '<img src="https://YOUR_WEBSITE/open/' +
        to_email +
        '" style="display:none">',
    });
    // }
  });
  // const oauth2Client = new google.auth.OAuth2(
  //   "YOUR_CLIENT_ID",
  //   "YOUR_CLIENT_SECRET",
  //   "YOUR_REDIRECT_URL"
  // );

  // await oauth2Client.setCredentials(token);
  // // async function watchMyLabel(auth) {
  // const gmail = await google.gmail({
  //   version: "v1",
  //   auth: {
  //     type: "OAuth2",
  //     user: email,
  //     clientId:
  //       "YOUR_CLIENT_ID",
  //     clientSecret: "YOUR_CLIENT_SECRET",
  //     refreshToken: refreshToken,
  //     accessToken: accessToken,
  //   },
  // });
  // const resp = await gmail.users.watch({
  //   userId: "me",
  //   requestBody: {
  //     labelIds: ["UNREAD"],
  //     labelFilterAction: "include",
  //     topicName: "YOUR_PUB_SUB_TOPIC_URL",
  //   },
  // });
  // }

  // watchMyLabel(oauth2Client)
});

app.post(
  // Use URL set as Pub/Sub Subscription endpoint
  "/pubsub-push-endpoint",
  // Parse JSON request payload
  express.json(),
  (req, res) => {
    // Acknowledge Gmail push notification webhook
    
    gmailpush
      .getMessages({
        notification: req.body,
        token

      })
      .then((messages) => {
        console.log(messages[0].snippet);
      })
      .catch((err) => {
        console.log(err);
      });
      console.log("Error after this line");
    res.sendStatus(200);

  }
);

app.get("/reademails", async (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    "YOUR_CLIENT_ID",
    "YOUR_CLIENT_SECRET",
    "YOUR_REDIRECT_URL"
  );

  oauth2Client.setCredentials({ access_token: accessToken });

  const gmail = await google.gmail({ version: "v1", auth: oauth2Client });
  gmail.users.labels.list(
    {
      userId: "me",
    },
    (err, response) => {
      if (err) return console.log("The API returned an error: " + err);
      const labels = response.data.labels;
      if (labels.length) {
        // console.log("Labels:");
        labels.forEach((label) => {
          // console.log(`- ${label.name}`);
        });
        // res.send(labels)
      } else {
        console.log("No labels found.");
      }
    }
  );
  let messages = [];
  let threadids = [];
  function printMessage(messageID, auth) {
    // console.log("Message Id:", messageID);
    var gmail = google.gmail("v1");
    let msgId = "";
    sentMessages.map((element) => {
      // console.log(element.id,messageID[0].id);
      if (element.threadId === messageID[0].threadId) {
        console.log("Message:", messageID[0].threadId);
        if (!threadids.includes(messageID[0].threadId)) {
          threadids.push(messageID[0].threadId);
          msgId = messageID[0].id;
        }
      }
      // if (messageID.length > 0) printMessage(messageID, auth);
    });
    gmail.users.messages.get(
      {
        auth: auth,
        userId: "me",
        id: messageID[0].id,
      },
      function (err, response) {
        // console.log(response);
        // res.send(response)
        if (msgId !== "") {
          messages.push(response.data.snippet);
        }

        messageID.splice(0, 1);
        if (messageID.length > 0) printMessage(messageID, auth);
        else {
          console.log("All Done");
          console.log(sentMessages);
          res.send(messages);
        }
      }
    );
  }
  // get message list
  let sentMessages = [];
  gmail.users.messages.list(
    {
      auth: oauth2Client,
      userId: "me",
      maxResults: 20,
      q: "label:sent to:'RECIPENT'",
    },
    function (err, response) {
      // console.log(response);
      sentMessages = response.data.messages;
      // console.log("++++++++++++++++++++++++++");
      // res.send(response.data.messages)
      // printMessage(response.data.messages, oauth2Client);
    }
  );
  gmail.users.messages.list(
    {
      auth: oauth2Client,
      userId: "me",
      maxResults: 20,
      q: "label:inbox from:'RECIPENT'",
    },
    function (err, response) {
      // console.log(response);
      // console.log("++++++++++++++++++++++++++");
      // res.send(response.data.messages)
      printMessage(response.data.messages, oauth2Client);
    }
  );
});

// display the result

app.get("/open/:recipent", async (req, res) => {
  // let Recipent= re.params['recipent']
  console.log("Email Opened By Recipent: ", req.params.recipent);
  // res.send("<h1>Email Opened</h1>")
});
app.listen(8080, () => console.log("server running at 8080!"));
