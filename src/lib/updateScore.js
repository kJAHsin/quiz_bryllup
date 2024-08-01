import { Client, Databases } from "appwrite";
import { ID } from "appwrite";

const API_ENDPOINT = "https://cloud.appwrite.io/v1";
const PROJECT_ID = "66a34bdf0001b827496a";
const DB_ID = "quiz-questions";
const COLLECTION_ID = "66a41e950014df0e4f65";

const client = new Client()
	.setEndpoint(API_ENDPOINT)
	.setProject(PROJECT_ID)
	.setSession("");

const databases = new Databases(client);

export async function updateScoreForUser({ userID, score }) {
	try {
		const DOCUMENT_ID = ID.unique();

		const updatedDocument = await databases.createDocument(
			DB_ID,
			COLLECTION_ID,
			DOCUMENT_ID,
			{ user: userID, score }
		);

		if (updatedDocument) {
			return updatedDocument;
		}
	} catch (err) {
		console.error(err);
	}
}
