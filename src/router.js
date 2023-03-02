import express, { Router } from "express";

import { postSchema, patchSchema } from "./validation.js";
import * as db from "./db.js";
import { generateToken, verifyToken } from "./authorisation.js";

const router = Router();

router.get("/", (req, res) => {
	const land = req.query.land?.toLowerCase();

	if (!land) return res.send("Ange ett land i sökfältet!");

	const matchedLand = db.getLand(land);

	if (!matchedLand) return res.json({ error: "Landet finns inte i databasen!" });

	res.json(db.getLand(land));
});

router.get("/lands", (req, res) => {
	res.json(Object.fromEntries(db.getAllLands()));
});

router.get("/givemeadmin", (req, res) => {
	return res
		.cookie("superSecretCode", generateToken(), {
			maxAge: 1000 * 60 * 60 * 24,
			path: "/"
		})
		.end();
});

router.post("/", verifyToken, express.json(), (req, res) => {
	const { population, capital, language } = req.body;
	const name = req.body.name?.toLowerCase();

	const validation = postSchema.validate({ name, population, capital, language }, { abortEarly: false });

	if (validation.error) return res.status(400).json({ error: validation.error.details.map((detail) => detail.message) });

	if (db.hasLand(name)) return res.status(400).json({ error: "Landet finns redan i databasen!" });

	db.addLand(name, population, capital, language);

	res.status(201).json({ name, population, capital, language });
});

router.patch("/", verifyToken, express.json(), (req, res) => {
	const { population, capital, language } = req.body;
	const name = req.body.name?.toLowerCase();

	const validation = patchSchema.validate({ name, population, capital, language }, { abortEarly: false });

	if (validation.error) return res.status(400).json({ error: validation.error.details.map((detail) => detail.message) });

	if (!db.hasLand(name)) return res.status(400).json({ error: "Landet finns inte i databasen!" });

	const matchedLand = db.getLand(name);

	matchedLand.population = population || matchedLand.population;
	matchedLand.capital = capital || matchedLand.capital;
	matchedLand.language = language || matchedLand.language;

	db.editLand(name, matchedLand.population, matchedLand.capital, matchedLand.language);

	res.status(200).json({ message: "Landet har uppdaterats!", data: { name, ...matchedLand } });
});

router.delete("/", verifyToken, express.json(), (req, res) => {
	const name = req.body.name?.toLowerCase();

	if (!name) return res.status(400).json({ error: "Du måste ange ett land!" });

	if (!db.hasLand(name)) return res.status(400).json({ error: "Landet finns inte i databasen!" });

	db.deleteLand(name);

	res.status(200).json({ message: "Landet har tagits bort!" });
});

export default router;
