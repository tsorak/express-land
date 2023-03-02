import * as db from "../db.js";

export default function getAllLandsController(req, res) {
	res.json(Object.fromEntries(db.getAllLands()));
}
