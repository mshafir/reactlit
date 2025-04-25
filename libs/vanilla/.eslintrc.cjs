module.exports = {
	extends: ["next"],
	plugins: ["prettier"],
	rules: {
		"no-console": "error",
		"prettier/prettier": "warn",
		"@next/next/no-html-link-for-pages": "off",
		"react/jsx-key": 1,
	},
};
