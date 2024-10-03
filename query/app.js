import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

app.use(express.json());
app.use(cors());

const posts = {};

app.get("/query-posts", (req, res) => {
    const postsWithUnstrictedComments = {};

    for (const key in posts) {
        postsWithUnstrictedComments[key] = posts[key];
        postsWithUnstrictedComments[key].comments = posts[key].comments.map(comment => {
            if (comment.status === "pending") {
                return {
                    ...comment,
                    content: "This comment content is pending at the moment"
                }
            } else if (comment.status === "rejected") {
                return {
                    ...comment,
                    content: "This has been restricted"
                }
            } else {
                return comment
            }
        });
    }

    res.status(200).send(postsWithUnstrictedComments);
});

const queryEventsHandler = (event) => {
    switch (event.type) {
        case "UPDATE_COMMENT":
            if (!posts[event.data.postId]) return res.status(400).send({ status: "faild" });

            const commentId = posts[event.data.postId].comments.findIndex(comment => comment.id === event.data.id);
            if (typeof commentId !== "number") return res.status(400).send({ status: "faild" });

            posts[event.data.postId].comments[commentId] = {
                id: event.data.id,
                content: event.data.content,
                status: event.data.status
            }

            break;
        case "CREATE_POST":
            posts[event.data.id] = {
                ...event.data,
                comments: []
            };
            break;
        case "CREATE_COMMENT":
            const post = posts[event.data.postId];
            if (!post) return res.status(400).send({ status: "faild" }); // found no post with the provided ID
            post.comments.push({
                id: event.data.id,
                content: event.data.content,
                status: event.data.status,
            });
            break;
        default:
            break;
    }
}

// event listner
app.post("/events", (req, res) => {
    const event = req.body;

    queryEventsHandler(event);

    res.status(200).send({ status: "received" });
});

app.listen(4002, async () => {
    console.log("Server is running on port 4002");

    try {
        const res = await axios.get("http://localhost:4005/events");
        const events = res.data;
        console.log(events);
        
        for (const event of events) {
            queryEventsHandler(event);
        }
    } catch (error) {
        console.error(error);
    }
});