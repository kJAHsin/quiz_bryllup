import { databases, DB_ID, COLLECTION_ID_QUIZ } from "./appwrite";
import { ID } from "appwrite";

const collections = [
	{
		dbID: DB_ID,
		id: COLLECTION_ID_QUIZ,
		name: "quiz",
	},
];

const db = {};

collections.forEach(
	(col) =>
		(db[col.name] = {
			create: (payload, id = ID.unique()) =>
				databases.createDocument(
					collections[0].dbID,
					collections[0].id,
					id,
					payload
				),

			list: (queries) =>
				databases.listDocuments(
					collections[0].dbID,
					collections[0].id,
					queries
				),

			get: (id) =>
				databases.getDocument(
					collections[0].dbID,
					collections[0].id,
					id
				),

			update: (id, payload) =>
				databases.updateDocument(
					collections[0].dbID,
					collections[0].id,
					id,
					payload
				),

			delete: (id) =>
				databases.deleteDocument(
					collections[0].dbID,
					collections[0].id,
					id
				),
		})
);

export { db };
