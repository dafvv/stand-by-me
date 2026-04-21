import React, { useState, useEffect } from "react";
import { busRoutes } from "./mockData";

export default function App() {
	const [isRushHour, setIsRushHour] = useState(false);
	const [isAccessible, setIsAccessible] = useState(false);
	const [viewMode, setViewMode] = useState("app");
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	const timeString = currentTime.toLocaleTimeString("id-ID", {
		hour: "2-digit",
		minute: "2-digit",
	});

	const currentData = busRoutes.map((bus) => ({
		...bus,
		crowdedness: isRushHour ? "Penuh" : bus.crowdedness,
		eta: isRushHour ? bus.eta + 5 : bus.eta,
	}));

	const hasCrowdedBus = currentData.some((bus) => bus.crowdedness === "Penuh");

	const getBadgeColor = (status) => {
		if (isAccessible || viewMode === "smartwait") {
			if (status === "Penuh")
				return "bg-red-600 text-white font-black border-2 border-red-800";
			if (status === "Kosong")
				return "bg-blue-500 text-white font-black border-2 border-blue-700";
			return "bg-yellow-500 text-black font-black border-2 border-yellow-700";
		}
		if (status === "Kosong") return "text-blue-700 bg-blue-100";
		if (status === "Sedang") return "text-yellow-700 bg-yellow-100";
		return "text-red-700 bg-red-100";
	};

	return (
		<div
			className={`min-h-screen flex items-center justify-center p-4 pb-32 transition-colors duration-500 relative ${viewMode === "smartwait" ? "bg-black" : isAccessible ? "bg-gray-900" : "bg-slate-200"}`}
		>
			{/* 📱 VIEW: MOBILE APP */}
			{viewMode === "app" && (
				<div
					className={`relative w-full max-w-[380px] h-[750px] rounded-[3rem] shadow-2xl overflow-hidden border-[12px] flex flex-col transition-colors duration-300 ${isAccessible ? "border-gray-800 bg-black" : "border-gray-900 bg-white"}`}
				>
					<div
						className={`p-6 pb-4 border-b ${isAccessible ? "border-gray-800" : "border-slate-100"}`}
					>
						<p
							className={`text-xs font-semibold tracking-wider uppercase mb-1 ${isAccessible ? "text-yellow-400" : "text-slate-500"}`}
						>
							📍 Halte Harmoni
						</p>
						<h1
							className={`text-2xl font-black tracking-tight ${isAccessible ? "text-white" : "text-blue-900"}`}
						>
							Stand by Me.
						</h1>
						<p
							className={`text-xs mt-1 ${isAccessible ? "text-gray-300" : "text-slate-500"}`}
						>
							Estimasi kedatangan real-time.
						</p>
					</div>
					<div className="flex-1 overflow-y-auto p-4 space-y-3">
						{currentData.map((bus) => (
							<div
								key={bus.id}
								className={`p-4 rounded-2xl flex justify-between items-center transition-all ${isAccessible ? "border-2 border-gray-700 bg-gray-800" : "border border-slate-200 bg-white shadow-sm"}`}
							>
								<div className="flex-1 pr-2">
									<h3
										className={`font-bold leading-tight ${isAccessible ? "text-yellow-400 text-lg" : "text-slate-900 text-base"}`}
									>
										{bus.koridor} ➔ {bus.tujuan}
									</h3>
									<p
										className={`text-xs mt-1 font-medium ${isAccessible ? "text-gray-300" : "text-slate-500"}`}
									>
										{bus.via}
									</p>
								</div>
								<div className="text-right min-w-[70px]">
									<p
										className={`font-black tracking-tighter ${isAccessible ? "text-white text-2xl" : "text-blue-900 text-2xl"}`}
									>
										{bus.eta}{" "}
										<span className="text-xs font-bold opacity-70">mnt</span>
									</p>
									<span
										className={`inline-block px-2 py-1 mt-1 text-[10px] uppercase tracking-widest rounded-full ${getBadgeColor(bus.crowdedness)}`}
									>
										{bus.crowdedness}
									</span>
								</div>
							</div>
						))}
					</div>
					{hasCrowdedBus && (
						<div
							className={`m-4 p-4 rounded-2xl border-l-4 animate-fade-in-up ${isAccessible ? "bg-gray-800 border-yellow-400" : "bg-blue-50 border-blue-600"}`}
						>
							<div className="flex items-start gap-2">
								<span className="text-lg">💡</span>
								<p
									className={`text-xs font-semibold leading-relaxed ${isAccessible ? "text-yellow-400" : "text-blue-900"}`}
								>
									Koridor 9C saat ini Penuh. Disarankan naik bus berikutnya
									dalam 13 menit.
								</p>
							</div>
						</div>
					)}
				</div>
			)}

			{/* 📺 VIEW: SMARTWAIT DISPLAY (HALTE TV) */}
			{viewMode === "smartwait" && (
				<div className="relative w-full max-w-4xl aspect-video bg-gray-900 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border-8 border-gray-800 flex flex-col overflow-hidden text-white">
					<div className="flex justify-between items-end p-6 border-b-2 border-gray-700 bg-gray-800">
						<div>
							<p className="text-yellow-400 font-bold tracking-widest uppercase text-sm md:text-base mb-1">
								Transjakarta SmartWait
							</p>
							<h1 className="text-3xl md:text-4xl font-black tracking-tight">
								Halte Harmoni
							</h1>
						</div>
						<div className="text-right">
							<h2 className="text-4xl md:text-5xl font-black tabular-nums">
								{timeString}
							</h2>
						</div>
					</div>

					<div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-800/50 text-gray-400 font-bold tracking-wider uppercase text-xs md:text-sm border-b border-gray-700">
						<div className="col-span-4 md:col-span-3">Koridor & Tujuan</div>
						<div className="hidden md:block col-span-5">
							Live Tracking Tracker
						</div>
						<div className="col-span-4 md:col-span-2 text-center">Status</div>
						<div className="col-span-4 md:col-span-2 text-right">
							Waktu (Mnt)
						</div>
					</div>

					<div className="flex-1 p-6 space-y-4 overflow-y-auto">
						{currentData.map((bus) => (
							<div
								key={bus.id}
								className="grid grid-cols-12 gap-4 items-center bg-gray-800 p-4 md:p-5 rounded-2xl border border-gray-700"
							>
								<div className="col-span-4 md:col-span-3">
									<h3 className="text-2xl md:text-3xl font-black text-yellow-400">
										{bus.koridor}
									</h3>
									<p className="text-sm md:text-lg font-bold mt-1 text-gray-200">
										{bus.tujuan}
									</p>
								</div>

								<div className="hidden md:flex col-span-5 items-center relative h-full">
									<div className="absolute w-full h-2 bg-gray-700 rounded-full"></div>
									<div
										className={`absolute h-2 rounded-full transition-all duration-1000 ${bus.crowdedness === "Penuh" ? "bg-red-500" : "bg-blue-500"}`}
										style={{ width: `${100 - bus.eta * 5}%` }}
									></div>
									<div className="absolute right-0 w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div>
								</div>

								<div className="col-span-4 md:col-span-2 text-center">
									<span
										className={`inline-block px-3 py-2 text-xs md:text-sm font-bold tracking-widest rounded-lg uppercase ${getBadgeColor(bus.crowdedness)}`}
									>
										{bus.crowdedness}
									</span>
								</div>
								<div className="col-span-4 md:col-span-2 text-right">
									<p className="text-4xl md:text-5xl font-black tabular-nums">
										{bus.eta}
									</p>
								</div>
							</div>
						))}
					</div>

					{hasCrowdedBus && (
						<div className="bg-blue-900 border-t-4 border-yellow-400 p-4 flex items-center gap-4">
							<span className="text-2xl md:text-3xl bg-yellow-400 text-black rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-black shrink-0">
								!
							</span>
							<p className="text-sm md:text-base font-bold text-yellow-400 tracking-wide animate-pulse">
								PERHATIAN: Koridor 9C tujuan Pluit saat ini terpantau PENUH.
								Kami merekomendasikan menunggu bus berikutnya (13 Menit).
							</p>
						</div>
					)}
				</div>
			)}

			{/* 🎛️ FLOATING DIRECTOR'S DOCK (RESPONSIVE) */}
			<div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-4 bg-white/90 backdrop-blur-md p-3 md:px-6 md:py-4 rounded-full shadow-2xl border border-slate-200 z-50 overflow-x-auto max-w-[95vw]">
				<div className="flex bg-slate-100 p-1 rounded-full shrink-0">
					<button
						onClick={() => setViewMode("app")}
						className={`px-4 py-2 text-xs md:text-sm font-bold rounded-full transition-all ${viewMode === "app" ? "bg-white shadow-sm text-blue-600" : "text-slate-500"}`}
					>
						📱 App
					</button>
					<button
						onClick={() => setViewMode("smartwait")}
						className={`px-4 py-2 text-xs md:text-sm font-bold rounded-full transition-all ${viewMode === "smartwait" ? "bg-white shadow-sm text-blue-600" : "text-slate-500"}`}
					>
						📺 TV Halte
					</button>
				</div>

				<div className="w-px h-8 bg-slate-300 hidden md:block"></div>

				<button
					onClick={() => setIsRushHour(!isRushHour)}
					className={`shrink-0 px-4 py-2 rounded-full font-bold transition-all text-xs md:text-sm flex items-center gap-2 ${isRushHour ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
				>
					{isRushHour ? "🛑 Matikan Jam Sibuk" : "⏱️ Simulasi Jam Sibuk"}
				</button>

				{viewMode === "app" && (
					<button
						onClick={() => setIsAccessible(!isAccessible)}
						className={`shrink-0 px-4 py-2 rounded-full font-bold transition-all text-xs md:text-sm flex items-center gap-2 ${isAccessible ? "bg-yellow-100 text-yellow-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
					>
						{isAccessible ? "👁️ Matikan Inklusif" : "👓 Mode Inklusif"}
					</button>
				)}
			</div>
		</div>
	);
}
