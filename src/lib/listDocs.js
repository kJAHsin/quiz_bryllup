import { Client, Databases } from "appwrite";

const client = new Client()
	.setEndpoint("https://cloud.appwrite.io/v1")
	.setProject("66a34bdf0001b827496a")
	.setSession("");

const db = new Databases(client);

export const result = async () => {
	try {
		const data = await db.listDocuments(
			"quiz-questions",
			"66a41e950014df0e4f65"
		);
		const sorted = data.documents.sort((a, b) => b.score - a.score);
		return sorted;
	} catch (err) {
		console.error(err);
	}
	return await sorted;
};
