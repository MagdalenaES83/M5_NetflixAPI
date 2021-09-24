import express from "express";
import fs from "fs";
import uniqid from "uniqid";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { parseFile } from "../utils/upload/index.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const mediaFilePath = path.join(__dirname, "media.json");
const commentsFilePath = path.join(__dirname, "comments.json");



const router = express.Router();


router.get("/", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(mediaFilePath);
    const fileAsString = fileAsBuffer.toString();
    const fileAsJSON = JSON.parse(fileAsString);
    res.send(fileAsJSON);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});


router.post("/", async (req, res, next) => {
  try {
    const { title, type, year, imdbID, poster,   } = req.body;

    const movie = {
      id: uniqid(),
      title,
      type,
      year,
      imdbID,
      poster,            
    };

    const fileAsBuffer = fs.readFileSync(mediaFilePath);
    const fileAsString = fileAsBuffer.toString();
    const fileAsJSONArray = JSON.parse(fileAsString);
    fileAsJSONArray.push(movie);
    fs.writeFileSync(mediaFilePath, JSON.stringify(fileAsJSONArray));
    res.send(movie);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});


router.post("/:id/comment", async (req, res, next) => {
  try {
    const { comment, rate, elementID  } = req.body;
    const review  = {           
        id: uniqid(),
        comment, 
        rate, 
        elementID,
        createdAt: new Date()
    };

    const fileAsBuffer = fs.readFileSync(mediaFilePath);
    const fileAsString = fileAsBuffer.toString();
    const fileAsJSONArray = JSON.parse(fileAsString);
    fileAsJSONArray.push(com);

    fs.writeFileSync(commentsFilePath, JSON.stringify(fileAsJSONArray));

    res.send(com);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});


router.get("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(mediaFilePath);
    const fileAsString = fileAsBuffer.toString();
    const fileAsJSONArray = JSON.parse(fileAsString);
    const movie = fileAsJSONArray.find(
      (movie) => movie.id === req.params.id
    );
    if (!movie) {
      res
        .status(404)
        .send({ message: `Movie with ${req.params.id} is not found!` });
    }
    res.send(movie);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});


router.delete("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(mediaFilePath);
    const fileAsString = fileAsBuffer.toString();
    let fileAsJSONArray = JSON.parse(fileAsString);

    const movie = fileAsJSONArray.find(
      (movie) => movie.id === req.params.id
    );
    if (!movie) {
      res
        .status(404)
        .send({ message: `movie with ${req.params.id} is not found!` });
    }
    fileAsJSONArray = fileAsJSONArray.filter(
      (movie) => movie.id !== req.params.id
    );
    fs.writeFileSync(mediaFilePath, JSON.stringify(fileAsJSONArray));
    res.status(204).send();
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});


router.put("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(mediaFilePath);
    const fileAsString = fileAsBuffer.toString();
    let fileAsJSONArray = JSON.parse(fileAsString);

    const movieIndex = fileAsJSONArray.findIndex(
      (movie) => movie.id === req.params.id
    );
    if (!movieIndex == -1) {
      res
        .status(404)
        .send({ message: `Movie with ${req.params.id} is not found!` });
    }
    const previousMovieData = fileAsJSONArray[movieIndex];
    const changedMovie = {
      ...previousMovieData,
      ...req.body,
      updatedAt: new Date(),
      id: req.params.id,
    };
    fileAsJSONArray[movieIndex] = changedMovie;

    fs.writeFileSync(mediaFilePath, JSON.stringify(fileAsJSONArray));
    res.send(changedMovie);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

router.put(
  "/:id/cover",
  parseFile.single("cover"),
  async (req, res, next) => {
    try {
      const fileAsBuffer = fs.readFileSync(mediaFilePath);
      const fileAsString = fileAsBuffer.toString();
      let fileAsJSONArray = JSON.parse(fileAsString);

      const movieIndex = fileAsJSONArray.findIndex(
        (movie) => movie.id === req.params.id
      );
      if (!movieIndex == -1) {
        res
          .status(404)
          .send({ message: `Movie with ${req.params.id} is not found!` });
      }
      const previousMovieData = fileAsJSONArray[movieIndex];
      const changedMovie = {
        ...previousMovieData,
        avatar: req.file.path,
        updatedAt: new Date(),
        id: req.params.id,
      };
      fileAsJSONArray[movieIndex] = changedAuthor;
      fs.writeFileSync(mediaFilePath, JSON.stringify(fileAsJSONArray));
      res.send(changedMovie);
    } catch (error) {
      res.send(500).send({ message: error.message });
    }
  }
);

export default router;
