import express from "express";
import cors from "cors";
import { randomBytes } from "crypto";
import { log } from "console";

const app = express();

app.use(cors());
app.use(express.json());


let commentsByPosts = [];


app.get("/posts/:postId/comments", (req, res) => {
    const { postId } = req.params;
    const comments = commentsByPosts[postId] || [];
    return res.status(200).send(comments);
});

app.post("/posts/:postId/comments", (req, res) => {
    const { content } = req.body;
    const { postId } = req.params;

    const commentId = randomBytes(4).toString("hex");

    const postComments = commentsByPosts[postId] || [];

    const comment = {
        id: commentId,
        content
    };

    commentsByPosts[postId] = [...postComments, comment];

    console.log(commentsByPosts);


    res.status(201).send(comment)

});

app.listen(4001, () => {
    console.log("Server is running on port 4001");
});