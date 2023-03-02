import express, { Router } from "express";

import { generateToken, verifyToken } from "./authorisation.js";

import getLandController from "./controller/getLandController.js";
import getAllLandsController from "./controller/getAllLandsController.js";
import addLandController from "./controller/addLandController.js";
import editLandController from "./controller/editLandController.js";
import deleteLandController from "./controller/deleteLandController.js";

const router = Router();

router.get("/", getLandController);

router.get("/lands", getAllLandsController);

router.get("/givemeadmin", (req, res) => {
	return res
		.cookie("superSecretCode", generateToken(), {
			maxAge: 1000 * 60 * 60 * 24,
			path: "/"
		})
		.end();
});

router.post("/", verifyToken, express.json(), addLandController);

router.patch("/", verifyToken, express.json(), editLandController);

router.delete("/", verifyToken, express.json(), deleteLandController);

export default router;
