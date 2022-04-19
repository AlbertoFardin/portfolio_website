/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");

const AWS = require("aws-sdk");
const cors = require("cors");
const { v4: uuid } = require("uuid");
require("dotenv").config();
const bodyParser = require("body-parser");

AWS.config.update({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.USER_CHIME_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.USER_CHIME_AWS_SECRET_ACCESS_KEY,
  },
});

const mapIdMeetingSession = {};

const joinMeetingAPI = async (conferenceName) => {
  const chime = new AWS.Chime({ region: "us-east-1" });
  chime.endpoint = new AWS.Endpoint(
    "https://service.chime.aws.amazon.com/console"
  );

  if (!mapIdMeetingSession[conferenceName]) {
    mapIdMeetingSession[conferenceName] = await chime
      .createMeeting({
        ClientRequestToken: uuid(),
        MediaRegion: "us-west-2", // Specify the region in which to create the meeting.
      })
      .promise();
  }
  const meetingResponse = mapIdMeetingSession[conferenceName];

  const attendeeResponse = await chime
    .createAttendee({
      MeetingId: meetingResponse.Meeting.MeetingId,
      ExternalUserId: uuid(),
    })
    .promise();

  return { meetingResponse, attendeeResponse };
};

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.get("/", async (req, res) => {
  res.send("OK");
});

app.post("/conference/join", async (req, res) => {
  const { conferenceName } = req.body;
  const { meetingResponse, attendeeResponse } = await joinMeetingAPI(
    conferenceName
  );

  return res.send({ meetingResponse, attendeeResponse });
});

const HTTP_PORT = 3000;

app.listen(HTTP_PORT, () => {
  console.log(`Listening on port ${HTTP_PORT}!`);
});
