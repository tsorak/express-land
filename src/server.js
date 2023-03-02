import express from "express";

import router from "./router.js";

const app = express();

app.use(router);

app.listen(3000, () => {
	console.clear();
	console.log("Server started on port 3000");
	console.log("http://localhost:3000"); //DevSkim: ignore DS137138
});
