import express from "express";
import cors from "cors";
import { randomBytes } from "crypto";
import axios from "axios";

const app = express();

app.use(cors());
app.use(express.json());

const posts = {};

app.get("/posts", (req, res) => {
    return res.status(200).send(posts);
});

app.post("/posts", async (req, res) => {
    const { title } = req.body;
    const postId = randomBytes(4).toString("hex");

    const newPost = {
        id: postId,
        title
    };

    posts[postId] = newPost;


    const event = {
        type: "CREATE_POST",
        data: posts[postId]
    };
    try {
        await axios.post("http://localhost:4005/events", {
            event
        });
    } catch (error) {
        console.error(error);
    }

    res.status(201).send(posts[postId]);
});

// event listner
app.post("/events", (req, res) => {
    const event = req.body;

    console.log("Event received:", event.type);
    console.log("Event data:", event.data);

    return res.status(200).send({ status: "received" });
});

app.listen(4000, () => {
    console.log("V5 IS HERE");
    console.log("Server is running on port 4000");
});