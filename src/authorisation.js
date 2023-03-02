import * as dotenv from "dotenv";
dotenv.config();

const AUTH_SECRET = process.env.AUTH_SECRET;
if (!AUTH_SECRET) throw new Error("Du måste ange en AUTH_SECRET i .env-filen!");

import { parseCookies } from "./utils.js";

function generateToken() {
	return AUTH_SECRET;
}

function verifyToken(req, res, next) {
	const { superSecretCode } = parseCookies(req.headers.cookie);
	if (superSecretCode !== AUTH_SECRET) return res.status(401).json({ error: "Du har inte behörighet att göra detta!" });

	next();
}

export { generateToken, verifyToken };
