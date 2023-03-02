import * as db from "../db.js";
import { postSchema } from "../validation.js";

export default function addLandController(req, res) {
	const { population, capital, language } = req.body;
	const name = req.body.name?.toLowerCase();

	const validation = postSchema.validate({ name, population, capital, language }, { abortEarly: false });

	if (validation.error) return res.status(400).json({ error: validation.error.details.map((detail) => detail.message) });

	if (db.hasLand(name)) return res.status(400).json({ error: "Landet finns redan i databasen!" });

	db.addLand(name, population, capital, language);

	res.status(201).json({ message: "Lade till landet i databasen", data: { name, population, capital, language } });
}
