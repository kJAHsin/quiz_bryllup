/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,jsx}"],
	theme: {
		extend: {
			colors: {
				weddingPrimary: "#cc9048",
				weddingOrange: "#f6ba04",
				weddingDarkred: "#a04027",
				weddingGreen: "#94b145",
			},
		},
	},
	plugins: [],
};
