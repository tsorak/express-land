function parseCookies(cookieStr) {
	if (!cookieStr) return {};
	const cookies = cookieStr.split("; ");
	const cookieObj = {};
	cookies.forEach((cookie) => {
		const [key, value] = cookie.split("=");
		cookieObj[key] = value;
	});
	return cookieObj;
}

export { parseCookies };
