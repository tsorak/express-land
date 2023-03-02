import * as db from "../db.js";

export default function getLandController(req, res) {
	const land = req.query.land?.toLowerCase();

	if (!land) return res.send("Ange ett land i sökfältet!");

	const matchedLand = db.getLand(land);

	if (!matchedLand) return res.json({ error: "Landet finns inte i databasen!" });

	res.json(db.getLand(land));
}
