import { Client, Account } from "appwrite";

const PROJECT_ID = "66a34bdf0001b827496a";

const client = new Client()
	.setEndpoint("https://cloud.appwrite.io/v1")
	.setProject(PROJECT_ID);

const account = new Account(client);

export async function createAccount({ email, password, userID }) {
	try {
		const userAccount = await account.create(userID, email, password);
		if (userAccount) {
			return login({
				userID,
				email,
				password,
			});
		} else {
			return userAccount;
		}
	} catch (err) {
		console.error(err);
	}
}

export async function login({ email, password }) {
	try {
		return await account.createEmailPasswordSession(email, password);
	} catch (err) {
		console.error(err);
	}
}
