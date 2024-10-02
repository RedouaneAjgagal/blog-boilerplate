import express from "express";
import axios from "axios";

const app = express();

app.use(express.json());


app.post("/events", async (req, res) => {
    const { event } = req.body;

    axios.post("http://localhost:4000/events", event).catch(err => console.error(err));
    axios.post("http://localhost:4001/events", event).catch(err => console.error(err));
    axios.post("http://localhost:4002/events", event).catch(err => console.error(err));
    axios.post("http://localhost:4003/events", event).catch(err => console.error(err));

    res.status(200).send({ status: "OK" });
});

app.listen(4005, () => {
    console.log("Server is running on port 4005");
});