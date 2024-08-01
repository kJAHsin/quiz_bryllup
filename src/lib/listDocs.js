import { Client, Databases } from "appwrite";

const client = new Client()
	.setEndpoint("https://cloud.appwrite.io/v1")
	.setProject("66a34bdf0001b827496a")
	.setSession("");

const db = new Databases(client);

const result = async () =>
	await db.listDocuments("quiz-questions", "66a41e950014df0e4f65");

console.log(result);
