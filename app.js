require("dotenv").config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true })); //To start parsing through the body of the post request.

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  //HTTP REQUEST USING HTTP method
  const city = req.body.cityName;
  const lon = req.body.Longitude; // Syntax (req.body.name)
  const lat = req.body.Latitude;
  const unit = "metric";
  const apiKey = process.env.API_KEY;
  // this url is the require call for the API
  const url =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=" +
    unit +
    "&appid=" +
    apiKey;

  // This callback function make a response call for the API
  https.get(url, function (response) {
    console.log(response.statusCode);

    //Generate the response from the API server to My server.
    response.on("data", function (data) {
      const weatherData = JSON.parse(data); //converts hexadec to JS objects.
      const temp = weatherData.list[0].main.temp; //Fetch temp
      const desc = weatherData.list[0].weather[0].description; //Fetch weather description.
      const icon = weatherData.list[0].weather[0].icon; // Fetch the Icon of the weather.
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"; //URL of image w.r.t the key icon.
      //Generate the response from My server to Client's server.
      res.write(
        "<h1>The temperature in " +
          city +
          " is " +
          temp +
          " degree Celsius.</h1>"
      );
      res.write("<p> The weather is currently " + desc + " </p>"); // write can be multiple in the app method.
      res.write("<img src=" + imageURL + " >");
      res.send(); //only one in the app method.
    });
  });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
