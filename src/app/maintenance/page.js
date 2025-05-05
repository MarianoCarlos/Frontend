"use client";

export default function MaintenancePage() {
	return (
		<div className="min-h-screen flex flex-col justify-center items-center bg-[#f5f5f5] text-center px-4">
			<h1 className="text-4xl md:text-5xl font-bold text-[#1D809A] mb-4 animate-pulse">
				We're currently undergoing maintenance
			</h1>
			<p className="text-lg md:text-xl text-[#4B5563] mb-6 max-w-2xl">
				Our site is temporarily unavailable while we perform essential updates to improve your experience. We’ll
				be back shortly—thank you for your patience!
			</p>
			<div className="text-sm text-[#6B7280]">
				&copy; {new Date().getFullYear()} ASL App. All rights reserved.
			</div>
		</div>
	);
}
