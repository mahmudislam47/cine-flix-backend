const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
app.use(cors());

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

    // ...

    app.get("/api/:tmdbId", async (req, res) => {
      const tmdbId = req.params.tmdbId;

      try {
        // Use the provided tmdbId to fetch the corresponding movie from mediaCollection
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

    // ...

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
