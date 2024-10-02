import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

const posts = {};

app.get("/query-posts", (req, res) => {
    res.status(200).send(posts);
});

// event listner
app.post("/events", (req, res) => {
    const event = req.body;
    console.log(event);

    switch (event.type) {
        case "CREATE_POST":
            posts[event.data.id] = {
                ...event.data,
                comments: []
            };
            break;
        case "CREATE_COMMENT":
            const post = posts[event.data.postId];
            if (!post) return; // found no post with the provided ID
            post.comments.push({
                id: event.data.id,
                content: event.data.content
            });
            break;
        default:
            break;
    }


    res.status(200).send({ status: "received" });
});

app.listen(4002, () => {
    console.log("Server is running on port 4002");
});