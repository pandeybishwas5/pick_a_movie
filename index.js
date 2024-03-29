// 1. Import express and axios
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";





const options = {
  method: 'GET',
  url: 'https://ott-details.p.rapidapi.com/advancedsearch',
  params: {
    start_year: '2010',
    end_year: '2024',
    min_imdb: '7',
    max_imdb: '10',
    genre: 'action',
    language: 'english',
    type: 'movie',
    sort: 'latest',
    page: '1'
  },
  headers: {
    'X-RapidAPI-Key': 'dbd62d8321mshbd058676ead6c8ep155606jsn5cfd448fa71e',
    'X-RapidAPI-Host': 'ott-details.p.rapidapi.com'
  }
};

// 2. Create an express app and set the port number.
const app = express();
const port = 5000;



// 3. Use the public folder for static files.
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.render("index.ejs")
});

app.get("/about", (req, res) => {
  res.render("about.ejs")
});

app.get("/search", (req, res) => {
  res.render("search.ejs")
});


app.post("/search", async(req,res) => {
  const mediaType = req.body.type;
  const genreList = ['action', 'comedy', 'thriller', 'horror'];
  const randomGenre = genreList[Math.floor(Math.random() * genreList.length)];
  console.log(randomGenre);

  const updatedOptions = {
    ...options,
    params: {
      genre: randomGenre,
      type: mediaType,
    },
  };
  try {
    const response = await axios.request(updatedOptions);
    console.log(response);
    const apiResponse = response.data;
    console.log(apiResponse);
    const movies = apiResponse.results;
    res.render("index.ejs", {movies});
    
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
})


app.post("/searchtitle", async(req,res) => {
  const newTitle = req.body.type;
  console.log(newTitle);
  const options = {
    method: 'GET',
    url: `https://cinema-api.p.rapidapi.com/get_ids/${newTitle}/movies`,
    headers: {
      'X-RapidAPI-Key': 'dbd62d8321mshbd058676ead6c8ep155606jsn5cfd448fa71e',
      'X-RapidAPI-Host': 'cinema-api.p.rapidapi.com'
    }
  };
  
  try {
    const response = await axios.request(options);
    const apiResponse = response.data;
    const results = apiResponse.data;
    res.render("search.ejs", {results});
  } catch (error) {
    console.error(error);
  }
});

const platformData = {
  netflix: '/images/netflix.png',
  hbomax: '/images/hbo.png',
  amazon: '/images/prime.png',
  youtube: '/images/youtube.png',
  tubitv: '/images/tubi.png',
  amazonprime: '/images/prime.png',
  appletvplus: '/images/apple.png'
}
app.get("/movie/:id", async(req, res) => {
  const movieId = req.params.id;
  const updatedOptions = {
    ...options,
    url: 'https://ott-details.p.rapidapi.com/gettitleDetails',
    params: {
      imdbid: movieId,
    },
  };
  try {
    const response = await axios.request(updatedOptions);
    const movieDetails = response.data;
    const streaming = movieDetails.streamingAvailability.country.US;
    res.render("movie.ejs", {movieDetails, streaming, platformData});
  } catch (error) {
    res.status(500).json({error: "An error occured" });
    
  }
});


// 6. Listen on your predefined port and start the server.
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });