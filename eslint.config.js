const { defineConfig } = require("eslint/config")
const js = require("@eslint/js")
const eslintPluginPrettier = require("eslint-plugin-prettier")
const eslintConfigPrettier = require("eslint-config-prettier")
const globals = require("globals")

module.exports = defineConfig([
	js.configs.recommended, // Appliquer les regles recommandées ES
	eslintConfigPrettier, // Desactiver les regles conflictuelles avec Prettier
	{
		files: ["**/*.js"],
		languageOptions: {
			sourceType: "commonjs",
			globals: {
				...globals.node,
			},
		},
		plugins: {
			prettier: eslintPluginPrettier,
		},
		rules: {
			...eslintConfigPrettier.rules, // Desactiver explicitement les regles de formatage potentiellement conflictuelles
			"prettier/prettier": "error", // Lever une erreur quand le code n'est pas Prettier-friendly
		},
	},
])
