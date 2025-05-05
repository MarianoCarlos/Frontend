"use client";
import Image from "next/image";
import Navbar from "../components/navbar";
import { ChevronRight, BookOpen, Hand, Brain, MessageSquare, Video, Activity } from "lucide-react";
import Link from "next/link";

export default function Home() {
	return (
		<div className="min-h-screen flex flex-col bg-[#EDEDED] bg-opacity-30">
			<Navbar />

			{/* Hero Section */}
			<main className="flex flex-col items-center justify-center flex-1 p-8 text-center mt-16">
				<div className="container mx-auto px-4 md:px-6 relative">
					<div className="max-w-4xl mx-auto text-center animate-fade-in">
						{/* Tagline */}
						<div className="inline-block px-3 py-1 mb-6 text-sm font-medium text-[#1D809A] bg-[#1D809A]/10 rounded-full">
							Breaking communication barriers
						</div>

						{/* Title */}
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
							ASL to Text Translation. <br />
							<span className="text-[#1D809A]">Accessible for everyone.</span>
						</h1>

						{/* Subtitle */}
						<p className="text-xl md:text-2xl text-[#8D9192] max-w-3xl mx-auto mb-10">
							InSync translates American Sign Language into text in real-time, making communication
							seamless for everyone.
						</p>

						{/* Buttons */}
						<div className="flex flex-col sm:flex-row justify-center gap-4">
							<Link
								href="/translate"
								className="text-base py-3 px-6 bg-[#1D809A] text-white rounded-full hover:bg-[#166a7d] transition-colors flex items-center justify-center shadow-md"
								style={{ minWidth: "150px" }}
							>
								Start Translating
								<ChevronRight size={16} className="ml-2" />
							</Link>
							<Link
								href="/learn"
								className="text-base py-3 px-6 border border-[#1D809A] text-[#1D809A] rounded-full hover:bg-[#1D809A] hover:text-white transition-colors flex items-center justify-center shadow-md"
								style={{ minWidth: "150px" }}
							>
								Learn ASL
								<BookOpen size={16} className="ml-2" />
							</Link>
						</div>
					</div>
				</div>
			</main>

			{/* Features Section */}
			<section className="py-20 md:py-32 ">
				<div className="container mx-auto px-4 md:px-6">
					<div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
						<h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
							Breaking Barriers with Technology
						</h2>
						<p className="text-xl text-[#8D9192]">
							Our platform combines powerful features to create a seamless translation experience.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
						<div className=" p-6 rounded-lg bg-white border border-gray-400 shadow-md hover:shadow-lg transition-shadow">
							<div className=" w-12 h-12 rounded-full bg-[#1D809A]/10 text-[#1D809A] flex items-center justify-center mb-4">
								<Hand size={32} />
							</div>
							<h3 className=" text-lg font-semibold mb-2">ASL Recognition</h3>
							<p className="f text-sm text-[#6B7280]">
								Advanced computer vision technology to accurately recognize American Sign Language
								gestures.
							</p>
						</div>

						<div className=" p-6 rounded-lg bg-white border border-gray-400 shadow-md hover:shadow-lg transition-shadow">
							<div className="  w-12 h-12 rounded-full bg-[#1D809A]/10 text-[#1D809A] flex items-center justify-center mb-4">
								<Brain size={32} />
							</div>
							<h3 className=" text-lg font-semibold mb-2">Real-time Processing</h3>
							<p className=" text-sm text-[#6B7280]">
								Instantaneous translation of signs to text with our high-performance machine learning
								model.
							</p>
						</div>

						<div className=" p-6 rounded-lg bg-white border border-gray-400 shadow-md hover:shadow-lg transition-shadow">
							<div className=" w-12 h-12 rounded-full bg-[#1D809A]/10 text-[#1D809A] flex items-center justify-center mb-4">
								<MessageSquare size={32} />
							</div>
							<h3 className=" text-lg font-semibold mb-2">Text Output</h3>
							<p className=" text-sm text-[#6B7280]">
								Clean, accurate text display of translated sign language for seamless communication.
							</p>
						</div>

						<div className=" p-6 rounded-lg bg-white border border-gray-400 shadow-md hover:shadow-lg transition-shadow">
							<div className="  w-12 h-12 rounded-full bg-[#1D809A]/10 text-[#1D809A] flex items-center justify-center mb-4">
								<Video size={32} />
							</div>
							<h3 className=" text-lg font-semibold mb-2">Webcam Integration</h3>
							<p className=" text-sm text-[#6B7280]">
								Easy-to-use webcam interface that works with any standard camera on your device.
							</p>
						</div>

						<div className=" p-6 rounded-lg bg-white border border-gray-400 shadow-md hover:shadow-lg transition-shadow">
							<div className=" w-12 h-12 rounded-full bg-[#1D809A]/10 text-[#1D809A] flex items-center justify-center mb-4">
								<BookOpen size={32} />
							</div>
							<h3 className=" text-lg font-semibold mb-2">Learning Resources</h3>
							<p className=" text-sm text-[#6B7280]">
								Comprehensive guides and tutorials to help you learn and practice ASL effectively.
							</p>
						</div>

						<div className=" p-6 rounded-lg bg-white border border-gray-400 shadow-md hover:shadow-lg transition-shadow">
							<div className=" m w-12 h-12 rounded-full bg-[#1D809A]/10 text-[#1D809A] flex items-center justify-center mb-4">
								<Activity size={32} />
							</div>
							<h3 className=" text-lg font-semibold mb-2">Progress Tracking</h3>
							<p className=" text-sm text-[#6B7280]">
								Monitor your learning journey with detailed stats and improvement metrics.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="text-center py-6 text-[#252525] dark:text-[#F7F7F7]">
				<p>&copy; 2025 ASL Web App. All rights reserved.</p>
			</footer>
		</div>
	);
}
