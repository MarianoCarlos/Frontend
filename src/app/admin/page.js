"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "@/utils/firebase";

export default function AdminPage() {
	const [users, setUsers] = useState([]);
	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		age: "",
		dob: "",
		disability: "",
	});
	const [editId, setEditId] = useState(null);

	const usersCollection = collection(db, "users");

	useEffect(() => {
		const fetchUsers = async () => {
			const snapshot = await getDocs(usersCollection);
			const usersList = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setUsers(usersList);
		};
		fetchUsers();
	}, []);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editId) {
				const userDoc = doc(db, "users", editId);
				await updateDoc(userDoc, {
					name: form.name,
					email: form.email,
					age: form.age,
					dob: form.dob,
					disability: form.disability,
					...(form.password && { password: form.password }),
				});
				setUsers(users.map((u) => (u.id === editId ? { ...u, ...form } : u)));
				setEditId(null);
			} else {
				const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
				const newUserRef = await addDoc(usersCollection, {
					name: form.name,
					email: form.email,
					uid: userCredential.user.uid,
					age: form.age,
					dob: form.dob,
					disability: form.disability,
				});
				setUsers([
					...users,
					{
						id: newUserRef.id,
						name: form.name,
						email: form.email,
						age: form.age,
						dob: form.dob,
						disability: form.disability,
					},
				]);
			}
			setForm({ name: "", email: "", password: "", age: "", dob: "", disability: "" });
		} catch (error) {
			console.error("Error saving user:", error.message);
			alert("Error: " + error.message);
		}
	};

	const handleEdit = (user) => {
		setEditId(user.id);
		setForm({
			name: user.name,
			email: user.email,
			password: "",
			age: user.age || "",
			dob: user.dob || "",
			disability: user.disability || "",
		});
	};

	const handleDelete = async (id) => {
		try {
			const response = await fetch("/api/deleteUser", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userID: id }),
			});
			const data = await response.json();

			if (response.ok) {
				setUsers(users.filter((u) => u.id !== id));
				alert(data.message);
			} else {
				alert(data.error);
			}
		} catch (error) {
			console.error("Error deleting user:", error);
			alert("Failed to delete user.");
		}
	};

	return (
		<div className="min-h-screen bg-[#EDEDED]/30">
			<Navbar />
			<main className="container mx-auto px-4 py-12 mt-16">
				<h1 className="text-4xl font-bold mb-8 text-center text-[#1D809A]">Admin Dashboard</h1>

				<form
					onSubmit={handleSubmit}
					className="max-w-md mx-auto mb-8 bg-white p-6 rounded shadow-md border border-gray-300"
				>
					<h2 className="text-xl font-semibold mb-4">{editId ? "Edit User" : "Add New User"}</h2>
					<input
						type="text"
						name="name"
						placeholder="Full Name"
						value={form.name}
						onChange={handleChange}
						className="w-full mb-4 p-2 border rounded"
						required
					/>
					<input
						type="email"
						name="email"
						placeholder="Email"
						value={form.email}
						onChange={handleChange}
						className="w-full mb-4 p-2 border rounded"
						required
					/>
					<input
						type="password"
						name="password"
						placeholder="Password"
						value={form.password}
						onChange={handleChange}
						className="w-full mb-4 p-2 border rounded"
						required={!editId}
					/>
					<input
						type="number"
						name="age"
						placeholder="Age"
						value={form.age}
						onChange={handleChange}
						className="w-full mb-4 p-2 border rounded"
					/>
					<input
						type="date"
						name="dob"
						placeholder="Date of Birth"
						value={form.dob}
						onChange={handleChange}
						className="w-full mb-4 p-2 border rounded"
					/>
					<input
						type="text"
						name="disability"
						placeholder="Disability (if any)"
						value={form.disability}
						onChange={handleChange}
						className="w-full mb-4 p-2 border rounded"
					/>
					<button
						type="submit"
						className="w-full bg-[#1D809A] text-white py-2 rounded hover:bg-[#166a7d] transition-colors"
					>
						{editId ? "Update User" : "Add User"}
					</button>
				</form>

				<div className="overflow-x-auto max-w-6xl mx-auto">
					<table className="w-full bg-white border rounded shadow-md text-left">
						<thead className="bg-[#1D809A] text-white">
							<tr>
								<th className="py-3 px-4">Name</th>
								<th className="py-3 px-4">Email</th>
								<th className="py-3 px-4">Age</th>
								<th className="py-3 px-4">DOB</th>
								<th className="py-3 px-4">Disability</th>
								<th className="py-3 px-4">Actions</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<tr key={user.id} className="border-t">
									<td className="py-3 px-4">{user.name}</td>
									<td className="py-3 px-4">{user.email}</td>
									<td className="py-3 px-4">{user.age || "-"}</td>
									<td className="py-3 px-4">{user.dob || "-"}</td>
									<td className="py-3 px-4">{user.disability || "-"}</td>
									<td className="py-3 px-4 space-x-2">
										<button
											onClick={() => handleEdit(user)}
											className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
										>
											Edit
										</button>
										<button
											onClick={() => handleDelete(user.id)}
											className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
										>
											Delete
										</button>
									</td>
								</tr>
							))}
							{users.length === 0 && (
								<tr>
									<td colSpan="6" className="text-center py-4 text-gray-500">
										No users found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</main>
		</div>
	);
}
