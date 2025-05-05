"use client";

import Navbar from "@/components/navbar";
import { useState, useEffect } from "react";
import { auth, db } from "@/utils/firebase"; // adjust path as needed
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

export default function Profile() {
	const [profile, setProfile] = useState(null);
	const [form, setForm] = useState({ name: "", age: "", dob: "", disability: "" });
	const [editMode, setEditMode] = useState(false);
	const [loading, setLoading] = useState(true);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				const docRef = doc(db, "users", user.uid);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					const data = docSnap.data();
					const formatted = {
						name: data.name || "",
						age: data.age || "",
						dob: data.dob || "",
						disability: data.disability || "",
					};
					setForm(formatted);
					setProfile(formatted); // 🔁 profile also gets "fullName"
				}
				console.log(docSnap.data());
			}
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	console.log("Profile data:", form);

	const handleSave = async () => {
		try {
			const user = auth.currentUser;
			if (!user) return;

			const docRef = doc(db, "users", user.uid);
			await updateDoc(docRef, form);
			setProfile(form);
			setEditMode(false);
			alert("Profile updated successfully!");
		} catch (error) {
			console.error("Error updating profile:", error);
			alert("Failed to update profile.");
		}
	};

	const handleChangePassword = async () => {
		try {
			if (newPassword !== confirmPassword) {
				alert("New passwords do not match.");
				return;
			}

			const user = auth.currentUser;
			if (!user || !user.email) return;

			const credential = EmailAuthProvider.credential(user.email, currentPassword);
			await reauthenticateWithCredential(user, credential);

			await updatePassword(user, newPassword);
			alert("Password updated successfully!");
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (error) {
			console.error("Error changing password:", error);
			alert("Failed to change password. Make sure your current password is correct.");
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex flex-col bg-gray-100">
				<Navbar />
				<main className="flex flex-1 items-center justify-center p-8 text-center">
					<p className="text-lg font-semibold">Loading profile...</p>
				</main>
				<footer className="text-center py-6 text-gray-600">
					<p>&copy; 2025 ASL Web App. All rights reserved.</p>
				</footer>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col bg-gray-100">
			<Navbar />

			<main className="flex flex-col items-center justify-center flex-1 p-8 text-center">
				<h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
				<p className="text-gray-600 mt-2">View and edit your personal information.</p>

				<div className="flex flex-col md:flex-row gap-6 justify-center mt-6 w-full max-w-4xl">
					{/* Profile Info Section */}
					<div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/2 text-left">
						<h2 className="text-lg font-semibold mb-4">Profile Details</h2>

						<div className="space-y-4">
							{editMode ? (
								<>
									<InputField
										label="Full Name"
										value={form?.name}
										onChange={(e) => setForm({ ...form, name: e.target.value })}
									/>
									<InputField
										label="Age"
										value={form?.age}
										onChange={(e) => setForm({ ...form, age: e.target.value })}
									/>
									<InputField
										label="Date of Birth"
										value={form?.dob}
										onChange={(e) => setForm({ ...form, dob: e.target.value })}
									/>
									<InputField
										label="Disability"
										value={form?.disability}
										onChange={(e) => setForm({ ...form, disability: e.target.value })}
									/>

									<button
										onClick={handleSave}
										className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
									>
										Save Changes
									</button>

									<div className="mt-6 border-t pt-6">
										<h2 className="text-lg font-semibold mb-4">Change Password</h2>

										<InputField
											label="Current Password"
											value={currentPassword}
											onChange={(e) => setCurrentPassword(e.target.value)}
										/>
										<InputField
											label="New Password"
											value={newPassword}
											onChange={(e) => setNewPassword(e.target.value)}
										/>
										<InputField
											label="Confirm New Password"
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
										/>

										<button
											onClick={handleChangePassword}
											className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
										>
											Change Password
										</button>
									</div>
								</>
							) : (
								<>
									<ProfileItem label="Full Name" value={profile?.name} />
									<ProfileItem label="Age" value={profile?.age} />
									<ProfileItem label="Date of Birth" value={profile?.dob} />
									<ProfileItem label="Disability" value={profile?.disability} />

									<button
										onClick={() => setEditMode(true)}
										className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
									>
										Edit Profile
									</button>
								</>
							)}
						</div>
					</div>

					{/* Placeholder Section */}
					<div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/2 flex flex-col justify-center items-center">
						<span className="text-gray-500 text-6xl">👤</span>
						<p className="text-gray-500 mt-2">Your profile information is private and secure.</p>
					</div>
				</div>
			</main>

			<footer className="text-center py-6 text-gray-600">
				<p>&copy; 2025 ASL Web App. All rights reserved.</p>
			</footer>
		</div>
	);
}

function ProfileItem({ label, value }) {
	return (
		<div>
			<span className="text-sm font-medium text-gray-600">{label}</span>
			<div className="text-lg font-semibold text-gray-900">{value || "N/A"}</div>
		</div>
	);
}

function InputField({ label, value, onChange }) {
	return (
		<div>
			<label className="block text-sm font-medium text-gray-600">{label}</label>
			<input className="mt-1 block w-full p-2 border border-gray-300 rounded" value={value} onChange={onChange} />
		</div>
	);
}
