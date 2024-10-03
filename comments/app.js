import express from "express";
import cors from "cors";
import { randomBytes } from "crypto";
import axios from "axios";

const app = express();

app.use(cors());
app.use(express.json());


let commentsByPosts = [];


app.get("/posts/:postId/comments", (req, res) => {
    const { postId } = req.params;
    const comments = commentsByPosts[postId] || [];
    return res.status(200).send(comments);
});

app.post("/posts/:postId/comments", async (req, res) => {
    const { content } = req.body;
    const { postId } = req.params;

    const commentId = randomBytes(4).toString("hex");

    const postComments = commentsByPosts[postId] || [];

    const comment = {
        id: commentId,
        status: "pending",
        postId,
        content
    };

    commentsByPosts[postId] = [...postComments, comment];

    const event = {
        type: "CREATE_COMMENT",
        data: comment
    }

    try {
        await axios.post("http://localhost:4005/events", {
            event
        });
    } catch (error) {
        console.error(error);
    }

    res.status(201).send(comment)

});

// event listner
app.post("/events", async (req, res) => {
    const event = req.body;

    console.log("Event received:", event.type);
    console.log("Event data:", event.data);

    switch (event.type) {
        case "MODERATION_COMMENT":
            const commentIndex = commentsByPosts[event.data.postId].findIndex(comment => comment.id === event.data.id);

            commentsByPosts[event.data.postId][commentIndex] = event.data;
            try {
                await axios.post("http://localhost:4005/events", {
                    event: {
                        type: "UPDATE_COMMENT",
                        data: commentsByPosts[event.data.postId][commentIndex]
                    }
                });
            } catch (error) {
                console.error(error);
            }

            break;
        default:
            break;
    }

    return res.status(200).send({ status: "received" });
});

app.listen(4001, () => {
    console.log("Server is running on port 4001");
});