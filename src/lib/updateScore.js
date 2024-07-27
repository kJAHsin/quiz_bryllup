import { Client, Databases } from "node-appwrite";

const client = new Client()
	.setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
	.setProject("5df5acd0d48c2") // Your project ID
	.setKey("919c2d18fb5d4...a2ae413da83346ad2"); // Your secret API key

const databases = new Databases(client);

const result = await databases.updateCollection(
	"<DATABASE_ID>", // databaseId
	"<COLLECTION_ID>", // collectionId
	"<COLLECTION_NAME>" // name
);
