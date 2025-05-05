"use client";
import { useState } from "react";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { Eye, EyeOff, UserPlus, Check } from "lucide-react";
import { auth } from "@/utils/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

export default function SignUp() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		age: "",
		dob: "",
		disability: "",
	});

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [agreeToTerms, setAgreeToTerms] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const passwordStrength = () => {
		const { password } = formData;
		if (!password) return 0;
		let score = 0;
		if (password.length >= 8) score++;
		if (/[A-Z]/.test(password)) score++;
		if (/[0-9]/.test(password)) score++;
		if (/[^A-Za-z0-9]/.test(password)) score++;
		return score;
	};

	const getStrengthColor = () => {
		const score = passwordStrength();
		if (score === 0) return "bg-[#EDEDED]"; // Gray
		if (score === 1) return "bg-[#FFB200]"; // Yellow
		if (score === 2) return "bg-[#FF6B00]"; // Orange
		if (score >= 3) return "bg-[#1D809A]"; // Green
	};

	const getStrengthText = () => {
		const score = passwordStrength();
		if (score === 0) return "Too short";
		if (score === 1) return "Weak";
		if (score === 2) return "Moderate";
		if (score >= 3) return "Strong";
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword)
			return setError("Please fill in all fields");
		if (formData.password !== formData.confirmPassword) return setError("Passwords do not match");

		setIsLoading(true);

		try {
			const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

			await updateProfile(userCredential.user, {
				displayName: formData.name,
			});

			// Save user profile in Firestore
			await setDoc(doc(db, "users", userCredential.user.uid), {
				name: formData.name,
				email: formData.email,
				age: formData.age,
				dob: formData.dob,
				disability: formData.disability,
				password: formData.password,
			});

			// Redirect or show success message
			console.log("Account created successfully!");
			// Example: redirect to dashboard
			// router.push("/dashboard");
		} catch (error) {
			setError(error.message || "Failed to create account");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col bg-[#EDEDED] text-[#252525]">
			<Navbar />
			<main className="flex-1 pt-32 pb-20">
				<div className="container mx-auto px-4 md:px-6">
					<div className="max-w-md mx-auto">
						<div className="text-center mb-8 animate-fade-in">
							<h1 className="text-3xl font-bold tracking-tight mb-2">Create an account</h1>
							<p className="text-[#8D9192]">Sign up to get started with InSync</p>
						</div>

						<div className="bg-[#FFFFFF] border rounded-lg p-6 md:p-8 shadow-sm animate-fade-in">
							<form onSubmit={handleSubmit} className="space-y-4">
								{error && (
									<div className="bg-[#F44336]/10 text-[#F44336] px-4 py-3 rounded-md text-sm">
										{error}
									</div>
								)}

								<div className="space-y-2">
									<label htmlFor="name" className="text-sm font-medium leading-none text-[#252525]">
										Full Name
									</label>
									<input
										id="name"
										name="name"
										type="text"
										autoComplete="name"
										placeholder="John Doe"
										value={formData.name}
										onChange={handleChange}
										className="flex h-10 w-full rounded-md border border-[#8D9192] bg-[#EDEDED] px-3 py-2 text-sm ring-offset-background placeholder:text-[#8D9192] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D809A] focus-visible:ring-offset-2"
										required
									/>
								</div>

								<div className="space-y-2">
									<label htmlFor="email" className="text-sm font-medium leading-none text-[#252525]">
										Email
									</label>
									<input
										id="email"
										name="email"
										type="email"
										autoComplete="email"
										placeholder="you@example.com"
										value={formData.email}
										onChange={handleChange}
										className="flex h-10 w-full rounded-md border border-[#8D9192] bg-[#EDEDED] px-3 py-2 text-sm ring-offset-background placeholder:text-[#8D9192] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D809A] focus-visible:ring-offset-2"
										required
									/>
								</div>

								{/* Age Input */}
								<div className="space-y-2">
									<label htmlFor="age" className="text-sm font-medium text-[#252525]">
										Age
									</label>
									<input
										id="age"
										name="age"
										type="number"
										value={formData.age}
										onChange={handleChange}
										className="flex h-10 w-full rounded-md border border-[#8D9192] bg-[#EDEDED] px-3 py-2 text-sm placeholder:text-[#8D9192] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D809A]"
										placeholder="Enter your age"
										required
									/>
								</div>

								{/* Date of Birth Input */}
								<div className="space-y-2">
									<label htmlFor="dob" className="text-sm font-medium text-[#252525]">
										Date of Birth
									</label>
									<input
										id="dob"
										name="dob"
										type="date"
										value={formData.dob}
										onChange={handleChange}
										className="flex h-10 w-full rounded-md border border-[#8D9192] bg-[#EDEDED] px-3 py-2 text-sm placeholder:text-[#8D9192] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D809A]"
										required
									/>
								</div>

								{/* Disability Input */}
								<div className="space-y-2">
									<label htmlFor="disability" className="text-sm font-medium text-[#252525]">
										Disability
									</label>
									<input
										id="disability"
										name="disability"
										type="text"
										value={formData.disability}
										onChange={handleChange}
										className="flex h-10 w-full rounded-md border border-[#8D9192] bg-[#EDEDED] px-3 py-2 text-sm placeholder:text-[#8D9192] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D809A]"
										placeholder="E.g. Hearing Impairment"
										required
									/>
								</div>

								<div className="space-y-2">
									<label
										htmlFor="password"
										className="text-sm font-medium leading-none text-[#252525]"
									>
										Password
									</label>
									<div className="relative">
										<input
											id="password"
											name="password"
											type={showPassword ? "text" : "password"}
											autoComplete="new-password"
											value={formData.password}
											onChange={handleChange}
											className="flex h-10 w-full rounded-md border border-[#8D9192] bg-[#EDEDED] px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-[#8D9192] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D809A] focus-visible:ring-offset-2"
											required
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8D9192] hover:text-[#252525]"
											aria-label={showPassword ? "Hide password" : "Show password"}
										>
											{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
										</button>
									</div>
									{formData.password && (
										<div className="mt-2">
											<div className="flex justify-between items-center mb-1">
												<div className="h-1.5 w-full bg-[#EDEDED] rounded-full overflow-hidden">
													<div
														className={`h-full ${getStrengthColor()}`}
														style={{ width: `${passwordStrength() * 25}%` }}
													></div>
												</div>
												<span className="text-xs ml-2 min-w-[45px] text-[#8D9192]">
													{getStrengthText()}
												</span>
											</div>
											<p className="text-xs text-[#8D9192]">
												Use 8+ characters with a mix of uppercase, lowercase, numbers, and
												symbols
											</p>
										</div>
									)}
								</div>

								<div className="space-y-2">
									<label
										htmlFor="confirmPassword"
										className="text-sm font-medium leading-none text-[#252525]"
									>
										Confirm Password
									</label>
									<div className="relative">
										<input
											id="confirmPassword"
											name="confirmPassword"
											type={showConfirmPassword ? "text" : "password"}
											autoComplete="new-password"
											value={formData.confirmPassword}
											onChange={handleChange}
											className="flex h-10 w-full rounded-md border border-[#8D9192] bg-[#EDEDED] px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-[#8D9192] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D809A] focus-visible:ring-offset-2"
											required
										/>
										<button
											type="button"
											onClick={() => setShowConfirmPassword(!showConfirmPassword)}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8D9192] hover:text-[#252525]"
											aria-label={showConfirmPassword ? "Hide password" : "Show password"}
										>
											{showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
										</button>
										{formData.confirmPassword && formData.password === formData.confirmPassword && (
											<div className="absolute right-10 top-1/2 -translate-y-1/2 text-[#1D809A]">
												<Check size={16} />
											</div>
										)}
									</div>
								</div>

								<div className="flex items-start space-x-2 pt-2">
									<input
										id="terms"
										type="checkbox"
										checked={agreeToTerms}
										onChange={() => setAgreeToTerms(!agreeToTerms)}
										className="h-4 w-4 mt-1 rounded border-[#8D9192] text-[#1D809A] focus:ring-[#1D809A]"
										required
									/>
									<label htmlFor="terms" className="text-sm text-[#8D9192]">
										I agree to the{" "}
										<Link href="/terms" className="text-[#1D809A] hover:underline">
											Terms of Service
										</Link>{" "}
										and{" "}
										<Link href="/privacy" className="text-[#1D809A] hover:underline">
											Privacy Policy
										</Link>
									</label>
								</div>

								<button
									type="submit"
									disabled={isLoading}
									className="w-full bg-[#1D809A] text-[#FFFFFF] flex items-center justify-center h-11 mt-6"
								>
									{isLoading ? (
										<span className="animate-pulse">Creating account...</span>
									) : (
										<>
											<UserPlus size={16} className="mr-2" />
											Create account
										</>
									)}
								</button>
							</form>

							<div className="mt-6 pt-6 border-t text-center">
								<p className="text-sm text-[#8D9192]">
									Already have an account?{" "}
									<Link href="/login" className="text-[#1D809A] font-medium hover:underline">
										Sign in
									</Link>
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
