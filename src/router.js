import express, { Router } from "express";
import * as dotenv from "dotenv";
dotenv.config();
const AUTH_SECRET = process.env.AUTH_SECRET;
if (!AUTH_SECRET) throw new Error("Du måste ange en AUTH_SECRET i .env-filen!");

import { postSchema, patchSchema } from "./validation.js";
import { parseCookies } from "./utils.js";
import * as db from "./db.js";

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
		.cookie("superSecretCode", AUTH_SECRET, {
			maxAge: 1000 * 60 * 60 * 24,
			path: "/"
		})
		.end();
});

router.post("/", express.json(), (req, res) => {
	const { population, capital, language } = req.body;
	const name = req.body.name?.toLowerCase();

	const { superSecretCode } = parseCookies(req.headers.cookie);
	if (superSecretCode !== AUTH_SECRET) return res.status(401).json({ error: "Du har inte behörighet att göra detta!" });

	const validation = postSchema.validate({ name, population, capital, language }, { abortEarly: false });

	if (validation.error) return res.status(400).json({ error: validation.error.details.map((detail) => detail.message) });

	if (db.hasLand(name)) return res.status(400).json({ error: "Landet finns redan i databasen!" });

	db.addLand(name, population, capital, language);

	res.status(201).json({ name, population, capital, language });
});

router.patch("/", express.json(), (req, res) => {
	const { population, capital, language } = req.body;
	const name = req.body.name?.toLowerCase();

	const { superSecretCode } = parseCookies(req.headers.cookie);
	if (superSecretCode !== AUTH_SECRET) return res.status(401).json({ error: "Du har inte behörighet att göra detta!" });

	const validation = patchSchema.validate({ name, population, capital, language }, { abortEarly: false });

	if (validation.error) return res.status(400).json({ error: validation.error.details.map((detail) => detail.message) });

	if (!db.hasLand(name)) return res.status(400).json({ error: "Landet finns inte i databasen!" });

	const matchedLand = db.getLand(name);

	matchedLand.population = population || matchedLand.population;
	matchedLand.capital = capital || matchedLand.capital;
	matchedLand.language = language || matchedLand.language;

	console.log(matchedLand);

	db.editLand(name, matchedLand.population, matchedLand.capital, matchedLand.language);

	res.status(200).json({ message: "Landet har uppdaterats!", data: { name, ...matchedLand } });
});

router.delete("/", express.json(), (req, res) => {
	const name = req.body.name?.toLowerCase();

	const { superSecretCode } = parseCookies(req.headers.cookie);
	if (superSecretCode !== AUTH_SECRET) return res.status(401).json({ error: "Du har inte behörighet att göra detta!" });

	if (!name) return res.status(400).json({ error: "Du måste ange ett land!" });

	if (!db.hasLand(name)) return res.status(400).json({ error: "Landet finns inte i databasen!" });

	db.deleteLand(name);

	res.status(200).json({ message: "Landet har tagits bort!" });
});

export default router;
