"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import { auth } from "@/utils/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
	const router = useRouter();
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [username, setUsername] = useState("");

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setUsername(user.email);
			} else {
				setUsername(null);
			}
		});
		return () => unsubscribe();
	}, []);

	const toggleMenu = () => setIsMenuOpen((prev) => !prev);

	const handleSignOut = async () => {
		try {
			await signOut(auth);

			// ❌ Remove 'isAdmin' cookie by expiring it
			document.cookie = "isAdmin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
			document.cookie = "isLoggedin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

			setUsername(null);
			router.push("/");
		} catch (err) {
			console.error("Sign-out error:", err);
		}
	};

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				isScrolled ? "backdrop-blur-md shadow-sm bg-[rgba(237,237,237,0.8)]" : "bg-transparent"
			}`}
		>
			<div className="container mx-auto px-4 md:px-6">
				<div className="flex items-center justify-between h-16 md:h-20">
					{/* Logo */}
					<Link
						href="/"
						className="flex items-center space-x-2 text-xl font-bold tracking-tight text-[#252525]"
					>
						<span className="px-2 py-1 rounded bg-[#1D809A] text-white">InSync</span>
					</Link>

					{/* Desktop Menu */}
					<nav className="hidden md:flex items-center space-x-6">
						{["Home", "Translate", "Library", "Learn", "About"].map((text) => (
							<Link
								key={text}
								href={`/${text.toLowerCase() === "home" ? "" : text.toLowerCase()}`}
								className="text-sm font-medium transition-colors text-[#252525] hover:text-[#1D809A]"
							>
								{text}
							</Link>
						))}

						{username ? (
							<div className="flex items-center space-x-4 ml-6">
								<div className="flex items-center space-x-2">
									<Link href="/profile" className="flex items-center space-x-2">
										<User size={20} className="text-[#1D809A]" />
										<span className="text-sm font-medium text-[#252525]">{username}</span>
									</Link>
								</div>
								<button
									onClick={handleSignOut}
									className="px-4 py-2 rounded-md border text-sm font-medium transition-colors hover:bg-[#1D809A] hover:text-white"
								>
									Sign Out
								</button>
							</div>
						) : (
							<>
								<Link
									href="/login"
									className="px-4 py-2 rounded-md border text-sm font-medium transition-colors hover:bg-[#1D809A] hover:text-white"
								>
									Log In
								</Link>
								<Link
									href="/signup"
									className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-[#1D809A] text-white hover:bg-[#2296A1]"
								>
									Sign Up
								</Link>
							</>
						)}
					</nav>

					{/* Mobile Menu Button */}
					<div className="flex items-center md:hidden">
						<button
							onClick={toggleMenu}
							className="p-2 rounded-md transition-colors bg-[#EDEDED] text-[#252525]"
							aria-label="Toggle Menu"
						>
							{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{isMenuOpen && (
				<div className="md:hidden border-t bg-[#EDEDED] border-[#8D9192]">
					<div className="container mx-auto px-4 py-6 space-y-4">
						{["Home", "Translate", "Library", "Learn", "About"].map((text) => (
							<Link
								key={text}
								href={`/${text.toLowerCase() === "home" ? "" : text.toLowerCase()}`}
								className="block py-2 text-sm font-medium transition-colors text-[#252525] hover:text-[#1D809A]"
								onClick={() => setIsMenuOpen(false)}
							>
								{text}
							</Link>
						))}

						<div className="flex flex-col space-y-3 pt-4 border-t border-[#8D9192]">
							{username ? (
								<>
									<div className="flex items-center space-x-3">
										<User size={20} className="text-[#1D809A]" />
										<span className="text-sm font-medium text-[#252525]">{username}</span>
									</div>
									<button
										onClick={handleSignOut}
										className="w-full text-center px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-[#1D809A] hover:text-white border-[#8D9192] border-[1px] text-[#252525]"
									>
										Sign Out
									</button>
								</>
							) : (
								<>
									<Link
										href="/login"
										className="w-full text-center px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-[#1D809A] hover:text-white border-[#8D9192] border-[1px] text-[#252525]"
										onClick={() => setIsMenuOpen(false)}
									>
										Log In
									</Link>
									<Link
										href="/signup"
										className="w-full text-center px-4 py-2 rounded-md text-sm font-medium transition-colors bg-[#1D809A] text-white hover:bg-[#2296A1]"
										onClick={() => setIsMenuOpen(false)}
									>
										Sign Up
									</Link>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</header>
	);
}
