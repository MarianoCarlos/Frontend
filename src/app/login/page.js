"use client";
import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/firebase";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!email || !password) {
			setError("Please fill in all fields");
			return;
		}

		setError(null);
		setIsLoading(true);

		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			console.log("User signed in:", userCredential.user);
			window.location.href = "/";
		} catch (err) {
			setError("Invalid email or password. Please try again.");
			console.error("Firebase Auth error:", err);
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
							<h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
							<p className="text-[#8D9192]">Sign in to your account to continue</p>
						</div>

						<div className="bg-white border border-[#8D9192] rounded-lg p-6 md:p-8 shadow-sm animate-fade-in">
							<form onSubmit={handleSubmit} className="space-y-4">
								{error && (
									<div className="bg-[#ffcccc] text-[#b91c1c] px-4 py-3 rounded-md text-sm">
										{error}
									</div>
								)}

								<div className="space-y-2">
									<label htmlFor="email" className="text-sm font-medium leading-none">
										Email
									</label>
									<input
										id="email"
										type="email"
										autoComplete="email"
										placeholder="you@example.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="flex h-10 w-full rounded-md border border-[#8D9192] bg-[#EDEDED] px-3 py-2 text-sm placeholder-[#8D9192] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D809A]"
										required
									/>
								</div>

								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<label htmlFor="password" className="text-sm font-medium leading-none">
											Password
										</label>
										<Link
											href="/forgot-password"
											className="text-xs text-[#1D809A] hover:underline"
										>
											Forgot password?
										</Link>
									</div>
									<div className="relative">
										<input
											id="password"
											type={showPassword ? "text" : "password"}
											autoComplete="current-password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											className="flex h-10 w-full rounded-md border border-[#8D9192] bg-[#EDEDED] px-3 py-2 pr-10 text-sm placeholder-[#8D9192] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D809A]"
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
								</div>

								<div className="flex items-center space-x-2">
									<input
										id="remember"
										type="checkbox"
										className="h-4 w-4 rounded border-[#8D9192] text-[#1D809A] focus:ring-[#1D809A]"
									/>
									<label htmlFor="remember" className="text-sm text-[#8D9192]">
										Remember me
									</label>
								</div>

								<button
									type="submit"
									disabled={isLoading}
									className="w-full flex items-center justify-center h-11 bg-[#1D809A] text-white rounded-md hover:opacity-90"
								>
									{isLoading ? (
										<span className="animate-pulse">Signing in...</span>
									) : (
										<>
											<LogIn size={16} className="mr-2" />
											Sign in
										</>
									)}
								</button>
							</form>

							<div className="mt-6 pt-6 border-t text-center">
								<p className="text-sm text-[#8D9192]">
									Don't have an account?{" "}
									<Link href="/signup" className="text-[#1D809A] font-medium hover:underline">
										Sign up
									</Link>
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Login;
