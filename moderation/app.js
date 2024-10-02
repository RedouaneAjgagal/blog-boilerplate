import express from "express";
import axios from "axios";

const app = express();

app.use(express.json());

// event listner
app.post("/events", async (req, res) => {
    const event = req.body;

    // console.log(event);

    switch (event.type) {
        case "CREATE_COMMENT":
            await sleep();
            const badWords = ["orange", "welcome"];

            const isBadWord = event.data.content.split(" ").some(word => {
                if (badWords.includes(word)) return true;
                return false;
            });
            const status = isBadWord
                ? "rejected"
                : "approved";

            console.log("---------------");
            console.log(event);


            try {
                await axios.post("http://localhost:4001/events", {
                    type: "MODERATION_COMMENT",
                    data: {
                        ...event.data,
                        status
                    }
                });
            } catch (error) {
                console.error(error);
            }
            break;
        default:
            break;
    }


    res.status(200).send({ status: "received" });
});

const sleep = async () => {
    return new Promise(resolve => setTimeout(resolve, 5000));
}


app.listen(4003, () => {
    console.log("server is running on port 4003");
});