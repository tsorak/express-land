import express from "express";
import joi from "joi";
import * as dotenv from "dotenv";
dotenv.config();

import * as db from "./db.js";
import { parseCookies } from "./utils.js";

const AUTH_SECRET = process.env.AUTH_SECRET;
if (!AUTH_SECRET) throw new Error("Du måste ange en AUTH_SECRET i .env-filen!");

//joi

const postSchema = joi.object({
	name: joi.string().min(3).required(),
	population: joi.number().min(1).required(),
	capital: joi.string().min(3).required(),
	language: joi.string().min(3).required()
});

const patchSchema = joi.object({
	name: joi.string().min(3).required(),
	population: joi.number().min(1),
	capital: joi.string().min(3),
	language: joi.string().min(3)
});

//express

const app = express();

app.get("/", (req, res) => {
	const land = req.query.land?.toLowerCase();

	if (!land) return res.send("Ange ett land i sökfältet!");

	const matchedLand = db.getLand(land);

	if (!matchedLand) return res.json({ error: "Landet finns inte i databasen!" });

	res.json(db.getLand(land));
});

app.get("/lands", (req, res) => {
	res.json(Object.fromEntries(db.getAllLands()));
});

app.get("/givemeadmin", (req, res) => {
	return res
		.cookie("superSecretCode", AUTH_SECRET, {
			maxAge: 1000 * 60 * 60 * 24,
			path: "/"
		})
		.end();
});

app.post("/", express.json(), (req, res) => {
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

app.patch("/", express.json(), (req, res) => {
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

app.delete("/", express.json(), (req, res) => {
	const name = req.body.name?.toLowerCase();

	const { superSecretCode } = parseCookies(req.headers.cookie);
	if (superSecretCode !== AUTH_SECRET) return res.status(401).json({ error: "Du har inte behörighet att göra detta!" });

	if (!name) return res.status(400).json({ error: "Du måste ange ett land!" });

	if (!db.hasLand(name)) return res.status(400).json({ error: "Landet finns inte i databasen!" });

	db.deleteLand(name);

	res.status(200).json({ message: "Landet har tagits bort!" });
});

app.listen(3000, () => {
	console.clear();
	console.log("Server started on port 3000");
	console.log("http://localhost:3000"); //DevSkim: ignore DS137138

	console.log(db.getAllLands());
});
