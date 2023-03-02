const lander = new Map();

lander.set("sverige", { population: 1000, capital: "Poland", language: "Latin" });
lander.set("turkiet", { population: 50, capital: "Ankara", language: "Istanbul" });
lander.set("usa", { population: 5000, capital: "Califörnia", language: "Finska" });

function hasLand(land) {
	return lander.has(land);
}

function getLand(land) {
	const matchedLand = lander.get(land);
	if (!matchedLand) return undefined;
	return JSON.parse(JSON.stringify(matchedLand));
}

function getAllLands() {
	return lander.entries();
}

function addLand(land, population, capital, language) {
	lander.set(land, { population, capital, language });
}

function editLand(land, population, capital, language) {
	if (!lander.has(land)) return false;

	lander.set(land, { population, capital, language });
	return true;
}

function deleteLand(land) {
	if (!lander.has(land)) return false;

	lander.delete(land);
	return true;
}

export { getLand, addLand, editLand, deleteLand, getAllLands, hasLand };
