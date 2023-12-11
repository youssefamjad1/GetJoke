import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
app.set("view engine", "ejs");
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
 /* app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });*/

app.get("/", async (req, res) => {
  try {
    const result = await axios.get("https://v2.jokeapi.dev/joke/Any");
    //console.log(result);
    res.render("index.ejs", {
      setup: result.setup,
      delivery: result.delivery,
    });
    
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});
app.post('/submit', async (req, res) => {
  const userChoice = req.body.choice;
  const selectedCategories = req.body.category ? [].concat(req.body.category) : [];
  console.log(selectedCategories);

  // Decide the API URL based on user choice
  let apiUrl;
  if (userChoice === 'any') {
    apiUrl = 'https://v2.jokeapi.dev/joke/Any';
  } else if (userChoice === 'custom') {
    apiUrl = `https://v2.jokeapi.dev/joke/${selectedCategories.join(',')}`;
    //console.log(apiUrl);
  }

  try {
    const result = await axios.get(apiUrl);
    // Remove the following line if you only want to render a view
    //res.send(`User choice: ${userChoice}, Selected categories: ${selectedCategories.join(', ')}`);
    res.render("index.ejs", { setup: result.data.setup, delivery: result.data.delivery });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
