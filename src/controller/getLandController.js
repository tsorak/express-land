import * as db from "../db.js";

export default function getLandController(req, res) {
	const land = req.query.land?.toLowerCase();

	if (!land) return res.send("Ange ett land i sökfältet! <br/> Exempel: <a href='http://localhost:3000/?land=sverige'>http://localhost:3000/?land=sverige</a>"); //DevSkim: ignore DS137138

	const matchedLand = db.getLand(land);

	if (!matchedLand) return res.json({ error: "Landet finns inte i databasen!" });

	res.json(db.getLand(land));
}
