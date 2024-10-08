import express from "express";
import axios from "axios";

const app = express();

app.use(express.json());

const events = [];


app.post("/events", async (req, res) => {
    const { event } = req.body;

    events.push(event);

    console.log(`Received an event: ${event.type}`);

    axios.post("http://posts-serv:4000/events", event).catch(err => console.error(err));
    axios.post("http://comments-serv:4001/events", event).catch(err => console.error(err));
    axios.post("http://query-serv:4002/events", event).catch(err => console.error(err));
    axios.post("http://moderation-serv:4003/events", event).catch(err => console.error(err));

    res.status(200).send({ status: "OK" });
});

app.get("/events", async (req, res) => {
    res.status(200).send(events);
});

app.listen(4005, () => {
    console.log("Server is running on port 4005");
});