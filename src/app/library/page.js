"use client";
import React from "react";
import Navbar from "../../components/navbar";
import Image from "next/image";
import { Hand } from "lucide-react";

const aslLetters = Array.from({ length: 26 }, (_, i) => {
	const letter = String.fromCharCode(65 + i); // A-Z
	return {
		letter,
		image: `/asl_letters/${letter.toLowerCase()}.png`,
	};
});

const Letters = () => {
	return (
		<div className="min-h-screen flex flex-col" style={{ backgroundColor: "#EDEDED", color: "#252525" }}>
			<Navbar />

			<main className="flex-1 pt-32 pb-20">
				<div className="container mx-auto px-4 md:px-6">
					<div className="max-w-5xl mx-auto text-center mb-12">
						<div
							className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full"
							style={{ backgroundColor: "rgba(29, 128, 154, 0.1)", color: "#1D809A" }}
						>
							ASL Alphabet
						</div>
						<h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
							Explore the ASL Letters A-Z
						</h1>
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
						{aslLetters.map(({ letter, image }) => (
							<div key={letter} className="bg-white rounded-xl shadow hover:shadow-md transition border">
								<div className="relative w-full aspect-square">
									<Image
										src={image}
										alt={`ASL for ${letter}`}
										fill
										className="rounded-t-xl object-cover"
									/>
								</div>
								<div className="p-3 text-center">
									<h3 className="text-lg font-semibold" style={{ color: "#1D809A" }}>
										Letter {letter}
									</h3>
								</div>
							</div>
						))}
					</div>
				</div>
			</main>

			<footer className="text-center py-6 text-gray-600">
				<p>&copy; 2025 ASL Web App. All rights reserved.</p>
			</footer>
		</div>
	);
};

export default Letters;
