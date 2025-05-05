"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, CameraOff, Copy, Volume2, RotateCcw, PauseCircle, Play, SwitchCamera, Loader } from "lucide-react";
import Navbar from "../../components/navbar";

export default function Translate() {
	const [webcamActive, setWebcamActive] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [translatedText, setTranslatedText] = useState("");
	const [copySuccess, setCopySuccess] = useState(false);
	const [cameraError, setCameraError] = useState(null);
	const [facingMode, setFacingMode] = useState("user");
	const videoRef = useRef(null);
	const streamRef = useRef(null);

	const startWebcam = useCallback(async () => {
		try {
			setIsLoading(true);
			setCameraError(null);

			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => track.stop());
				streamRef.current = null;
			}

			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
			});
			streamRef.current = stream;
			videoRef.current.srcObject = stream;

			videoRef.current
				.play()
				.then(() => {
					setWebcamActive(true);
					setIsLoading(false);
				})
				.catch(() => {
					setCameraError("Could not play video.");
					setIsLoading(false);
				});
		} catch (err) {
			setCameraError("Error accessing webcam.");
			setIsLoading(false);
		}
	}, [facingMode]);

	const stopWebcam = () => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
			setWebcamActive(false);
		}
	};

	const togglePause = () => {
		setIsPaused((prev) => {
			const newState = !prev;
			if (videoRef.current) {
				if (newState) {
					videoRef.current.pause();
				} else {
					videoRef.current.play();
				}
			}
			return newState;
		});
	};

	const switchCamera = () => {
		setFacingMode(facingMode === "user" ? "environment" : "user");
	};

	const copyToClipboard = () => {
		if (translatedText) {
			navigator.clipboard
				.writeText(translatedText)
				.then(() => {
					setCopySuccess(true);
					setTimeout(() => setCopySuccess(false), 2000);
				})
				.catch(() => console.error("Copy failed"));
		}
	};

	useEffect(() => {
		if (webcamActive && !isPaused) {
			const interval = setInterval(captureFrameAndSend, 1000); // every second
			return () => clearInterval(interval);
		}
	}, [webcamActive, isPaused]);

	const captureFrameAndSend = async () => {
		if (!videoRef.current) return;
		const canvas = document.createElement("canvas");
		canvas.width = videoRef.current.videoWidth;
		canvas.height = videoRef.current.videoHeight;
		const ctx = canvas.getContext("2d");
		ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

		canvas.toBlob(async (blob) => {
			if (!blob) return;
			const formData = new FormData();
			formData.append("file", blob, "frame.jpg");

			try {
				const response = await fetch("http://localhost:8000/predict", {
					method: "POST",
					body: formData,
				});
				const data = await response.json();
				if (data.prediction) {
					setTranslatedText((prev) => prev + data.prediction);
				}
			} catch (error) {
				console.error("Prediction error:", error);
			}
		}, "image/jpeg");
	};

	return (
		<div className="min-h-screen bg-[#EDEDED] text-[#252525] flex flex-col">
			<Navbar />
			<main className="flex-1 pt-16 pb-12">
				<div className="container mx-auto px-4 md:px-6 mt-16">
					<div className="max-w-6xl mx-auto">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
							{/* Left Panel - Camera */}
							<div>
								<div className="rounded-xl overflow-hidden border bg-[#FFFFFF] shadow-md relative h-[450px]">
									<video
										ref={videoRef}
										autoPlay
										playsInline
										muted
										className={`w-full h-full object-cover ${!webcamActive ? "hidden" : ""}`}
									/>
									{cameraError && (
										<div className="absolute inset-0 bg-black/70 flex items-center justify-center text-center p-6">
											<div className="bg-[#FFFFFF] p-4 rounded-lg max-w-md">
												<CameraOff className="mx-auto mb-4 text-red-500" size={32} />
												<p className="text-red-500 font-semibold mb-2">Camera Error</p>
												<p className="text-sm text-[#8D9192]">{cameraError}</p>
											</div>
										</div>
									)}
									<div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
										{webcamActive ? (
											<>
												<button
													onClick={togglePause}
													className="bg-[#EDEDED] text-[#252525] py-2 px-4 rounded-md"
												>
													{isPaused ? <Play size={20} /> : <PauseCircle size={20} />}
												</button>
												<button
													onClick={switchCamera}
													className="bg-[#EDEDED] text-[#252525] py-2 px-4 rounded-md"
												>
													<SwitchCamera size={20} />
												</button>
												<button
													onClick={stopWebcam}
													className="bg-[#EDEDED] text-[#252525] py-2 px-4 rounded-md"
												>
													<CameraOff size={20} />
												</button>
											</>
										) : (
											<button
												onClick={startWebcam}
												disabled={isLoading}
												className="bg-[#1D809A] hover:bg-[#166a7d] text-white py-2 px-4 rounded-full flex items-center gap-2"
											>
												{isLoading ? (
													<Loader size={18} className="animate-spin" />
												) : (
													<Camera size={18} />
												)}
												{isLoading ? "Connecting..." : "Start Camera"}
											</button>
										)}
									</div>
								</div>
							</div>

							{/* Right Panel - Translated Text */}
							<div>
								<div className="rounded-xl border bg-[#FFFFFF] h-[450px] shadow-md flex flex-col">
									<div className="p-4 border-b flex justify-between items-center">
										<h2 className="font-medium">Translated Text</h2>
									</div>
									<div className="flex-1 p-4 overflow-auto">
										{translatedText ? (
											<p className="whitespace-pre-wrap break-words">{translatedText}</p>
										) : (
											<div className="h-full flex items-center justify-center text-center">
												<p className="text-[#8D9192] bg-[#FFFFFF] rounded-lg p-4 w-full">
													Enable your camera to start translating...
												</p>
											</div>
										)}
									</div>
									<div className="p-4 pt-0 flex flex-wrap justify-center gap-2">
										<button
											onClick={copyToClipboard}
											disabled={!translatedText}
											className="bg-[#1D809A] text-white py-2 px-4 rounded-md flex items-center gap-2"
										>
											<Copy size={16} />
											{copySuccess ? "Copied!" : "Copy"}
										</button>
										<button
											onClick={() => console.log("Speak")}
											disabled={!translatedText}
											className="bg-[#1D809A] text-white py-2 px-4 rounded-md flex items-center gap-2"
										>
											<Volume2 size={16} />
											Speak
										</button>
										<button
											onClick={() => setTranslatedText("")}
											disabled={!translatedText}
											className="bg-[#EDEDED] text-[#252525] py-2 px-4 rounded-md flex items-center gap-2"
										>
											<RotateCcw size={16} />
											Reset
										</button>
									</div>
								</div>
							</div>
						</div>

						{/* Instructions */}
						<div className="bg-[#EDEDED] rounded-xl p-6 border">
							<h2 className="text-xl font-semibold mb-4">How to use the translator</h2>
							<ol className="space-y-3 list-decimal pl-5">
								<li>Click "Start Camera" to allow access to your webcam</li>
								<li>Position yourself in the frame where your hand gestures are clearly visible</li>
								<li>Start signing using American Sign Language (ASL)</li>
								<li>Your signs will be translated to text in real-time in the panel on the right</li>
								<li>Use the controls to copy, have the text read aloud, or reset the translation</li>
							</ol>
							<div className="mt-4 p-4 bg-[#FFFFFF] rounded-lg border">
								<p className="text-sm text-[#8D9192]">
									<strong>Note:</strong> For best results, ensure good lighting and a clear
									background. The translator works best with standard ASL signs.
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>
			<footer className="text-center py-6 text-gray-600">
				<p>&copy; 2025 ASL Web App. All rights reserved.</p>
			</footer>
		</div>
	);
}
