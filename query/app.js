import express from "express";
import cors from "cors";

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
    
    console.log(posts);
    
    res.status(200).send(postsWithUnstrictedComments);
});

// event listner
app.post("/events", (req, res) => {
    const event = req.body;
    // console.log(event);

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


    res.status(200).send({ status: "received" });
});

app.listen(4002, () => {
    console.log("Server is running on port 4002");
});