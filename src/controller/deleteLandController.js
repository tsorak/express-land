import * as db from "../db.js";

export default function deleteLandController(req, res) {
	const name = req.body.name?.toLowerCase();

	if (!name) return res.status(400).json({ error: "Du måste ange ett land!" });

	if (!db.hasLand(name)) return res.status(400).json({ error: "Landet finns inte i databasen!" });

	db.deleteLand(name);

	res.status(200).json({ message: "Landet har tagits bort!" });
}
