// pages/api/deleteUser.js
import admin from "../../lib/firebaseAdmin";

export default async function handler(req, res) {
	if (req.method === "DELETE") {
		const { userID } = req.body;

		if (!userID) {
			return res.status(400).json({ error: "User ID is required." });
		}

		try {
			// Delete the user from Firebase Authentication
			await admin.auth().deleteUser(userID);

			// Optionally, delete the user data from Firestore
			await admin.firestore().collection("users").doc(userID).delete();

			return res.status(200).json({ message: "User deleted successfully." });
		} catch (error) {
			console.error("Error deleting user:", error);
			return res.status(500).json({ error: "Failed to delete user." });
		}
	} else {
		return res.status(405).json({ error: "Method Not Allowed" });
	}
}
