// 1. Import express and axios
import express from "express";
import axios from "axios";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const options = {
  method: 'GET',
  url: 'https://ott-details.p.rapidapi.com/advancedsearch',
  params: {
    start_year: '1970',
    end_year: '2020',
    min_imdb: '6',
    max_imdb: '7.8',
    genre: 'action',
    language: 'english',
    type: 'movie',
    sort: 'latest',
    page: '1'
  },
  headers: {
    'X-RapidAPI-Key': '5545521360msh9481ab1e7e88958p1ccd39jsnb3c180e4a3d7',
    'X-RapidAPI-Host': 'ott-details.p.rapidapi.com'
  }
};

// 2. Create an express app and set the port number.
const app = express();
const port = 3000;



// 3. Use the public folder for static files.
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.render("index.ejs")
});

app.get("/about", (req, res) => {
  res.render("about.ejs")
});


app.post("/search", async(req,res) => {
  
  try {
    const response = await axios.request(options);
    const apiResponse = response.data;
    const movies = apiResponse.results;
    res.render("index.ejs", {movies});
    
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
})




// 6. Listen on your predefined port and start the server.
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });