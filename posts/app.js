import express from "express";
import cors from "cors";
import { randomBytes } from "crypto"

const app = express();

app.use(cors());
app.use(express.json());

const posts = {};

app.get("/posts", (req, res) => {
    return res.status(200).send(posts);
});

app.post("/posts", (req, res) => {
    const { title } = req.body;
    const postId = randomBytes(4).toString("hex");

    posts[postId] = {
        id: postId,
        title
    };

    res.status(201).send(posts[postId]);
})

app.listen(4000, () => {
    console.log("Server is running on port 4000");
});