import { Client, Databases } from "appwrite";

const client = new Client();
const DB_ID = "quiz-questions";
const PROJECT_ID = "66a34bdf0001b827496a";
const COLLECTION_ID_QUIZ = "66a3509c0037667539ed";

client.setEndpoint("https://cloud.appwrite.io/v1").setProject(PROJECT_ID);

export const databases = new Databases(client);
export { DB_ID, COLLECTION_ID_QUIZ };
