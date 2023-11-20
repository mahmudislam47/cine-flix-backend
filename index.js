const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json()); 

const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.djzcyyl.mongodb.net/`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const mediaCollection = client.db("movieDB").collection("data");

    app.get("/api", async (req, res) => {
      const p = await mediaCollection.find().toArray();
      res.json(p);
    });

    // POST route to add a movie
    app.post("/api/addmovie", async (req, res) => {
      try {
        const newMovie = req.body; // Assuming the request body contains the movie information
        const result = await mediaCollection.insertOne(newMovie);

        res.json({
          message: "Movie added successfully",
          movieId: result.insertedId,
        });
      } catch (error) {
        console.error("Error adding movie:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.get("/api/:tmdbId", async (req, res) => {
      const tmdbId = req.params.tmdbId;

      try {
        const movie = await mediaCollection.findOne({ tmdbId: tmdbId });

        if (movie) {
          res.json(movie);
        } else {
          res.status(404).json({ error: "Movie not found" });
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.delete("/api/:tmdbId", async (req, res) => {
      const tmdbId = req.params.tmdbId;

      try {
        const result = await mediaCollection.deleteOne({ tmdbId: tmdbId });

        if (result.deletedCount > 0) {
          res.json({ message: "Movie deleted successfully" });
        } else {
          res.status(404).json({ error: "Movie not found" });
        }
      } catch (error) {
        console.error("Error deleting movie:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server running....");
});

app.listen(port, () => {
  console.log(`server running.... on port ${port}`);
});
