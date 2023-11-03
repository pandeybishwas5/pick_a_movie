// 1. Import express and axios
import express from "express";
import axios from "axios";





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
    'X-RapidAPI-Key': '7ff4ffdfe8msh1fb2a17ce6ec576p17ead1jsnfb6dd3516aab',
    'X-RapidAPI-Host': 'ott-details.p.rapidapi.com'
  }
};

// 2. Create an express app and set the port number.
const app = express();
const port = 5000;



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