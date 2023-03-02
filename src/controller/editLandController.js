import * as db from "../db.js";
import { patchSchema } from "../validation.js";

export default function editLandController(req, res) {
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
}
