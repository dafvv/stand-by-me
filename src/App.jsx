import React, { useState, useEffect, useMemo } from "react";
// 1. IMPORT DATA DARI mockData.js AGAR FILE INI LEBIH BERSIH
import {
	initialRoutes,
	journeySteps,
	halteArrivals,
	halteLayanan,
	detailBusData,
} from "./mockData";

// ============================================================
// ICONS & HELPERS
// ============================================================
const BusSideIcon = ({ className, ...props }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 640 640"
		className={className}
		fill="currentColor"
		{...props}
	>
		<path d="M480 64C568.4 64 640 135.6 640 224L640 448C640 483.3 611.3 512 576 512L570.4 512C557.2 549.3 521.8 576 480 576C438.2 576 402.7 549.3 389.6 512L250.5 512C237.3 549.3 201.8 576 160.1 576C118.4 576 82.9 549.3 69.7 512L64 512C28.7 512 0 483.3 0 448L0 160C0 107 43 64 96 64L480 64zM160 432C133.5 432 112 453.5 112 480C112 506.5 133.5 528 160 528C186.5 528 208 506.5 208 480C208 453.5 186.5 432 160 432zM480 432C453.5 432 432 453.5 432 480C432 506.5 453.5 528 480 528C506.5 528 528 506.5 528 480C528 453.5 506.5 432 480 432zM480 128C462.3 128 448 142.3 448 160L448 352C448 369.7 462.3 384 480 384L544 384C561.7 384 576 369.7 576 352L576 224C576 171 533 128 480 128zM248 288L352 288C369.7 288 384 273.7 384 256L384 160C384 142.3 369.7 128 352 128L248 128L248 288zM96 128C78.3 128 64 142.3 64 160L64 256C64 273.7 78.3 288 96 288L200 288L200 128L96 128z" />
	</svg>
);
const BackIcon = () => (
	<svg
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke="white"
		strokeWidth="2.5"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<polyline points="15 18 9 12 15 6" />
	</svg>
);
const ChevronDown = () => (
	<svg
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="#7a9bbf"
		strokeWidth="2.5"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<polyline points="6 9 12 15 18 9" />
	</svg>
);
const WalkIcon = ({ size = 20, color = "#cce0f5" }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke={color}
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<circle cx="12" cy="4" r="2" />
		<path d="M9 10l1 5-2 5M15 10l-1 5 2 5M9 10h6l1-3H8l1 3z" />
	</svg>
);
const BusFrontlessIcon = ({ size = 20, color = "#7ab8f5" }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke={color}
		strokeWidth="1.8"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<rect x="3" y="6" width="18" height="13" rx="2" />
		<path d="M3 10h18" />
		<circle cx="7.5" cy="19" r="1.5" />
		<circle cx="16.5" cy="19" r="1.5" />
	</svg>
);

function addMinToTimeStr(timeStr, minutes) {
	const [h, m] = timeStr.split(":").map(Number);
	const d = new Date();
	d.setHours(h, m + minutes, 0, 0);
	return d
		.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
		.replace(".", ":");
}
function crowdStatus(baseStatus, isRushHour, offsetMin) {
	if (isRushHour) return "Penuh";
	if (offsetMin >= 60) return "Kosong";
	return baseStatus;
}

// ============================================================
// KOMPONEN PETA & TV HALTE
// ============================================================
const TransjakartaLiveMap = () => {
	useEffect(() => {
		let mapInstance = null;
		const initializeMap = () => {
			if (!window.L) {
				setTimeout(initializeMap, 100);
				return;
			}
			const mapContainer = document.getElementById("tj-real-map");
			if (!mapContainer || mapContainer._leaflet_id) return;
			const L = window.L;
			mapInstance = L.map("tj-real-map", {
				center: [-6.1754, 106.8272],
				zoom: 13,
				zoomControl: false,
				attributionControl: false,
			});
			L.tileLayer(
				"https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
				{ maxZoom: 19 },
			).addTo(mapInstance);
			L.polyline(
				[
					[-6.17, 106.822],
					[-6.1754, 106.8272],
					[-6.184, 106.823],
					[-6.195, 106.8225],
				],
				{ color: "#C92C27", weight: 5, opacity: 0.9 },
			).addTo(mapInstance);
			const busIcon = L.divIcon({
				className: "custom-bus-marker",
				html: `<div style="background-color: #C92C27; border: 2px solid white; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">1</div>`,
				iconSize: [34, 34],
				iconAnchor: [17, 17],
			});
			L.marker([-6.1754, 106.8272], { icon: busIcon }).addTo(mapInstance);
		};
		if (!document.getElementById("leaflet-css")) {
			const link = document.createElement("link");
			link.id = "leaflet-css";
			link.rel = "stylesheet";
			link.href =
				"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
			document.head.appendChild(link);
		}
		if (!document.getElementById("leaflet-js")) {
			const script = document.createElement("script");
			script.id = "leaflet-js";
			script.src =
				"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
			script.onload = initializeMap;
			document.head.appendChild(script);
		} else initializeMap();
		return () => {
			if (mapInstance) mapInstance.remove();
		};
	}, []);
	return (
		<div id="tj-real-map" className="absolute inset-0 z-0 bg-[#0a1624]"></div>
	);
};

const TVDisplay = () => {
	const [clock, setClock] = useState("");
	const [buses, setBuses] = useState([
		{
			id: 1,
			koridor: "1",
			rute: "Blok M → Kota",
			plate: "TJ-307",
			jarak: 0.8,
			eta: 2,
			status: "Sedang",
			koridorColor: "#D0021B",
		},
		{
			id: 2,
			koridor: "1",
			rute: "Blok M → Kota",
			plate: "TJ-273",
			jarak: 2.4,
			eta: 5,
			status: "Kosong",
			koridorColor: "#D0021B",
		},
		{
			id: 3,
			koridor: "2",
			rute: "Pulogadung → Monas",
			plate: "DMR-250158",
			jarak: 3.1,
			eta: 8,
			status: "Kosong",
			koridorColor: "#00529B",
		},
		{
			id: 4,
			koridor: "8",
			rute: "Lebak Bulus → Ps. Baru",
			plate: "MB-1641",
			jarak: 4.8,
			eta: 11,
			status: "Sedang",
			koridorColor: "#D1106A",
		},
		{
			id: 5,
			koridor: "8",
			rute: "Lebak Bulus → Ps. Baru",
			plate: "MB-1640",
			jarak: 6.0,
			eta: 14,
			status: "Kosong",
			koridorColor: "#D1106A",
		},
		{
			id: 6,
			koridor: "3",
			rute: "Kalideres → Monas",
			plate: "MB-1626",
			jarak: 7.5,
			eta: 18,
			status: "Kosong",
			koridorColor: "#F5A623",
		},
	]);

	useEffect(() => {
		const clockInterval = setInterval(() => {
			const now = new Date();
			const days = [
				"Minggu",
				"Senin",
				"Selasa",
				"Rabu",
				"Kamis",
				"Jumat",
				"Sabtu",
			];
			const months = [
				"Januari",
				"Februari",
				"Maret",
				"April",
				"Mei",
				"Juni",
				"Juli",
				"Agustus",
				"September",
				"Oktober",
				"November",
				"Desember",
			];
			setClock(
				`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} WIB  |  ${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`,
			);
		}, 1000);
		const tickInterval = setInterval(() => {
			setBuses((prev) =>
				prev.map((b) => ({
					...b,
					eta: Math.max(1, b.eta - 1),
					jarak: Math.max(0.1, b.jarak - 0.08),
				})),
			);
		}, 5000);
		return () => {
			clearInterval(clockInterval);
			clearInterval(tickInterval);
		};
	}, []);

	return (
		<div className="w-full flex justify-center items-center p-4">
			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800;900&family=Barlow+Condensed:wght@600;700;800&display=swap');
        .tv-wrapper { font-family: 'Barlow', sans-serif; width: 100%; max-width: 1100px; display: flex; flex-direction: column; align-items: center; }
        .tv-outer { width: 100%; background: #111; border-radius: 16px; padding: 14px 14px 28px; box-shadow: 0 0 0 3px #2a2a2a, 0 15px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05); position: relative; }
        .tv-stand { width: 80px; height: 16px; background: #1a1a1a; margin: 0 auto; border-radius: 0 0 8px 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.4); }
        .tv-screen { background: #f0f4f8; border-radius: 6px; overflow: hidden; aspect-ratio: 16/9; position: relative; display: flex; flex-direction: column; }
        .header-bar { background: #fff; border-bottom: 3px solid #00AEEF; display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; flex-shrink: 0; }
        .halte-name { font-size: clamp(13px, 1.8vw, 22px); font-weight: 800; color: #003D7C; letter-spacing: -0.2px; line-height: 1; }
        .halte-sub { font-size: clamp(8px, 0.9vw, 11px); font-weight: 500; color: #6b8caf; margin-top: 1px; }
        .tj-circle { width: clamp(28px, 3.5vw, 44px); height: clamp(28px, 3.5vw, 44px); border-radius: 50%; background: linear-gradient(135deg, #00AEEF 0%, #005BAC 100%); display: flex; align-items: center; justify-content: center; }
        .tj-wordmark { font-size: clamp(9px, 1.1vw, 14px); font-weight: 800; color: #003D7C; line-height: 1.1; }
        .body-area { flex: 1; display: flex; overflow: hidden; }
        .ad-panel { width: 32%; background: #fff; border-right: 2px solid #e0eaf5; display: flex; flex-direction: column; flex-shrink: 0; }
        .ad-label { background: #003D7C; color: #fff; font-size: clamp(7px, 0.85vw, 11px); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; text-align: center; }
        .ad-body { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px; gap: 8px; background: linear-gradient(160deg, #EBF6FD 0%, #F5FAFF 100%); }
        .ad-icon { width: clamp(22px, 2.8vw, 36px); height: clamp(22px, 2.8vw, 36px); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .ad-title { font-size: clamp(9px, 1.1vw, 15px); font-weight: 800; color: #003D7C; text-align: center; line-height: 1.3; }
        .ad-desc { font-size: clamp(7px, 0.8vw, 10px); color: #5a7a9a; text-align: center; line-height: 1.4; }
        .app-badge { background: #003D7C; color: #fff; font-size: clamp(5px, 0.65vw, 9px); font-weight: 700; padding: 3px 8px; border-radius: 4px; }
        .table-panel { flex: 1; background: #fff; display: flex; flex-direction: column; }
        .live-bar { background: #003D7C; color: #fff; display: flex; align-items: center; gap: 8px; padding: 4px 14px; font-size: clamp(7px, 0.85vw, 11px); font-weight: 700; }
        .live-dot { width: 8px; height: 8px; border-radius: 50%; background: #00ff88; animation: pulse 1.2s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .table-head { display: grid; grid-template-columns: 2.4fr 1.4fr 1fr 1fr 1.3fr; background: #EBF6FD; border-bottom: 2px solid #00AEEF; padding: 0 14px; }
        .th { font-size: clamp(6px, 0.75vw, 10px); font-weight: 800; color: #003D7C; text-transform: uppercase; letter-spacing: 0.8px; padding: 6px 4px; }
        .table-row { display: grid; grid-template-columns: 2.4fr 1.4fr 1fr 1fr 1.3fr; padding: 0 14px; border-bottom: 1px solid #f0f5fa; align-items: center; }
        .table-row:nth-child(even) { background: #FAFCFF; }
        .td { font-size: clamp(7px, 0.9vw, 12px); color: #1a2a3a; padding: 7px 4px; }
        .koridor-badge { border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: clamp(6px, 0.75vw, 10px); font-weight: 900; color: #fff; min-width: clamp(18px, 2.2vw, 28px); height: clamp(18px, 2.2vw, 28px); font-family: 'Barlow Condensed', sans-serif; }
        .route-name { font-size: clamp(7px, 0.88vw, 11px); font-weight: 600; color: #1a3a5c; line-height: 1.3; }
        .plate-cell { font-size: clamp(6.5px, 0.82vw, 11px); font-weight: 700; color: #003D7C; letter-spacing: 0.3px; font-family: 'Barlow Condensed', sans-serif; }
        .eta-num { font-size: clamp(11px, 1.5vw, 20px); font-weight: 900; color: #00AEEF; font-family: 'Barlow Condensed', sans-serif; line-height: 1; }
        .status-badge { border-radius: 4px; padding: 3px 7px; font-size: clamp(6px, 0.72vw, 9px); font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; display: inline-block; }
        .status-kosong { background: #d4f5e9; color: #0a6640; }
        .status-sedang { background: #fff3d6; color: #92540a; }
        .status-penuh { background: #fde8e8; color: #991b1b; }
        .info-strip { background: #003D7C; color: #fff; display: flex; align-items: center; gap: 10px; padding: 4px 14px; }
        .radio-marquee { overflow: hidden; flex: 1; }
        .marquee-inner { display: inline-block; animation: marquee 22s linear infinite; white-space: nowrap; font-size: clamp(6px, 0.72vw, 9px); color: rgba(255,255,255,0.8); }
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .time-bar { background: #00AEEF; color: #fff; display: flex; align-items: center; justify-content: space-between; padding: 4px 14px; }
      `}</style>
			<div className="tv-wrapper">
				<div className="tv-outer">
					<div className="tv-screen">
						<div className="header-bar">
							<div>
								<div className="halte-name">Harmoni Arah Kota</div>
								<div className="halte-sub">Koridor Utama BRT Transjakarta</div>
							</div>
							<div className="flex items-center">
								<img
									src="https://upload.wikimedia.org/wikipedia/commons/d/de/TransJakarta_Logo_%28cropped%29.svg"
									alt="Logo Transjakarta"
									className="h-[38px] object-contain drop-shadow-sm"
								/>
							</div>
						</div>
						<div className="body-area">
							<div className="ad-panel">
								<div className="ad-label">Info Halte</div>
								<div className="ad-body">
									<div className="flex gap-2 mb-1">
										<div className="ad-icon" style={{ background: "#EBF6FD" }}>
											<svg
												width="18"
												height="18"
												viewBox="0 0 24 24"
												fill="none"
												stroke="#00AEEF"
												strokeWidth="2.5"
												strokeLinecap="round"
											>
												<circle cx="12" cy="12" r="10" />
												<polyline points="12 6 12 12 16 14" />
											</svg>
										</div>
										<div className="ad-icon" style={{ background: "#FFF3D6" }}>
											<svg
												width="18"
												height="18"
												viewBox="0 0 24 24"
												fill="none"
												stroke="#E6A020"
												strokeWidth="2.5"
												strokeLinecap="round"
											>
												<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
											</svg>
										</div>
										<div className="ad-icon" style={{ background: "#D4F5E9" }}>
											<svg
												width="18"
												height="18"
												viewBox="0 0 24 24"
												fill="none"
												stroke="#0a6640"
												strokeWidth="2.5"
												strokeLinecap="round"
											>
												<path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 014.07 4.18 2 2 0 016.06 2h3a2 2 0 012 1.72c.12.96.36 1.9.72 2.81a2 2 0 01-.45 2.11L10.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.36 1.85.6 2.81.72A2 2 0 0122 16.92z" />
											</svg>
										</div>
									</div>
									<div className="ad-title">
										Gunakan Aplikasi
										<br />
										TiJe untuk perjalanan
										<br />
										lebih nyaman!
									</div>
									<div className="ad-desc">
										Pantau kedatangan bus,
										<br />
										beli tiket, dan rencanakan
										<br />
										perjalanan kamu sekarang.
									</div>
									<div className="flex gap-1.5 mt-1">
										<div className="app-badge">App Store</div>
										<div className="app-badge">Google Play</div>
									</div>
								</div>
							</div>
							<div className="table-panel">
								<div className="live-bar">
									<div className="live-dot"></div>
									<span>LIVE — Kedatangan Bus Real-Time</span>
								</div>
								<div className="flex-1 flex flex-col overflow-hidden">
									<div className="table-head">
										<div className="th">Rute Bus</div>
										<div className="th">No Bus</div>
										<div className="th text-right">Jarak</div>
										<div className="th text-right">Estimasi</div>
										<div className="th text-center">Status</div>
									</div>
									<div className="flex-1 flex flex-col overflow-hidden">
										{buses.map((b) => (
											<div key={b.id} className="table-row">
												<div className="td">
													<div className="flex items-center gap-1.5">
														<div
															className="koridor-badge"
															style={{ background: b.koridorColor }}
														>
															{b.koridor}
														</div>
														<div className="route-name">{b.rute}</div>
													</div>
												</div>
												<div className="td">
													<span className="plate-cell">{b.plate}</span>
												</div>
												<div className="td text-right">
													<span className="font-bold text-[#C25E10] text-[clamp(7px,0.88vw,11px)]">
														{Number(b.jarak).toFixed(1)} km
													</span>
												</div>
												<div className="td text-right">
													<div className="eta-num">{b.eta}</div>
													<div className="text-[clamp(6px,0.7vw,9px)] font-semibold text-[#6b8caf] tracking-wider">
														mnt
													</div>
												</div>
												<div className="td flex justify-center">
													<div
														className={`status-badge ${b.status === "Kosong" ? "status-kosong" : b.status === "Sedang" ? "status-sedang" : "status-penuh"}`}
													>
														{b.status}
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
						<div className="info-strip">
							<div className="bg-[#D0021B] text-white font-extrabold px-2 py-0.5 rounded-[3px] uppercase tracking-wider text-[clamp(6px,0.7vw,9px)] shrink-0">
								Sedang Mengudara
							</div>
							<div className="radio-marquee">
								<span className="marquee-inner">
									Live Radio — Dengarkan siaran langsung TJ Radio Jakarta dengan
									kualitas audio terbaik &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
									Layanan BRT Transjakarta beroperasi pada pukul 05:00 – 23:59
									WIB &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; Tetap jaga jarak dan
									patuhi peraturan di dalam halte
									&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; Prioritaskan kursi untuk
									lansia, ibu hamil, dan penyandang disabilitas
								</span>
							</div>
						</div>
						<div className="time-bar">
							<div className="text-[clamp(8px,1vw,13px)] font-extrabold tracking-wide">
								{clock || "--:-- WIB | -, -- --- ----"}
							</div>
							<div className="text-[clamp(6px,0.72vw,9px)] font-semibold text-white/85">
								Layanan BRT Transjakarta beroperasi pada pukul 05:00 – 23:59 WIB
							</div>
						</div>
					</div>
					<div className="tv-stand"></div>
				</div>
			</div>
		</div>
	);
};

// ============================================================
// SHARED SUBCOMPONENTS (MOBILE APP)
// ============================================================
const DepartureBar = ({ value, onChange }) => (
	<div className="bg-[#1c2d45] rounded-2xl px-4 py-3 flex items-center justify-between">
		<span className="text-[#7a9bbf] text-xs font-semibold uppercase tracking-wider">
			Keberangkatan
		</span>
		<div className="relative flex items-center gap-1">
			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="appearance-none bg-[#0b1629] text-white text-xs font-bold py-1.5 pl-3 pr-7 rounded-lg outline-none border border-[#2a3f5e] cursor-pointer"
			>
				<option value="sekarang">Sekarang</option>
				<option value="15">+ 15 Menit</option>
				<option value="30">+ 30 Menit</option>
				<option value="60">+ 1 Jam</option>
				<option value="120">+ 2 Jam</option>
			</select>
			<div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
				<ChevronDown />
			</div>
		</div>
	</div>
);
const CrowdBusIcon = ({ crowd }) => {
	const color =
		crowd === "Kosong" ? "#2ec07a" : crowd === "Sedang" ? "#e6a020" : "#e05a30";
	return (
		<div className="flex flex-col items-center gap-1">
			<BusSideIcon className="w-10 h-10" style={{ color }} />
			<div className="h-1.5 w-7 rounded-full" style={{ background: color }} />
		</div>
	);
};
const JarakStatusRow = ({ jarak, crowd }) => {
	const crowdColor =
		crowd === "Kosong" ? "#2ec07a" : crowd === "Sedang" ? "#e6a020" : "#e05a30";
	return (
		<div className="flex gap-2">
			<div
				className="flex-1 rounded-xl p-3"
				style={{ background: "#1e1608", border: "1px solid #3a2810" }}
			>
				<span
					className="block text-[8px] font-black uppercase tracking-widest mb-1"
					style={{ color: "#e6a020" }}
				>
					Jarak Bus
				</span>
				<div className="flex items-center justify-between">
					<span className="font-black text-sm" style={{ color: "#e6a020" }}>
						{jarak}
					</span>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#e6a020"
						strokeWidth="2"
						strokeLinecap="round"
					>
						<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
						<circle cx="12" cy="10" r="3" />
					</svg>
				</div>
			</div>
			<div
				className="flex-[1.5] rounded-xl p-3 flex items-center justify-between"
				style={{ background: "#0e1e30", border: "1px solid #1a3050" }}
			>
				<div>
					<span
						className="block text-[8px] font-black uppercase tracking-widest mb-1"
						style={{ color: "#7ab8f5" }}
					>
						Status Bus
					</span>
					<span className="font-black text-sm" style={{ color: crowdColor }}>
						{crowd}
					</span>
				</div>
				<BusSideIcon className="w-9 h-9" style={{ color: crowdColor }} />
			</div>
		</div>
	);
};
const Divider = ({ my = "my-0" }) => (
	<div className={`h-px bg-[#1a2d44] ${my}`} />
);

// ============================================================
// MAIN APP COMPONENT
// ============================================================
export default function App() {
	const [deviceMode, setDeviceMode] = useState("app");
	const [activePage, setActivePage] = useState("tujuan_kamu");
	const [departureOffset, setDepartureOffset] = useState("sekarang");
	const [isRushHour, setIsRushHour] = useState(false);
	const [alertConfig, setAlertConfig] = useState({
		show: false,
		type: "heavy",
		msg: "",
		advice: "",
	});

	useEffect(() => {
		if (alertConfig.show) {
			const timer = setTimeout(
				() => setAlertConfig((prev) => ({ ...prev, show: false })),
				5000,
			);
			return () => clearTimeout(timer);
		}
	}, [alertConfig.show]);

	// 2. MENGGUNAKAN useMemo AGAR TIDAK RE-RENDER BERULANG KALI
	const offsetMin = useMemo(
		() => (departureOffset === "sekarang" ? 0 : parseInt(departureOffset)),
		[departureOffset],
	);

	const data1 = useMemo(
		() =>
			initialRoutes.map((bus) => ({
				...bus,
				eta: bus.etaBase + offsetMin + (isRushHour ? 8 : 0),
				crowd: crowdStatus(bus.status, isRushHour, offsetMin),
				recTime: addMinToTimeStr(bus.firstHalteDeparture, offsetMin - 5),
			})),
		[offsetMin, isRushHour],
	);

	const data2 = useMemo(
		() =>
			journeySteps.map((step) => {
				if (step.type !== "bus") return step;
				const crowd = crowdStatus(step.status, isRushHour, offsetMin);
				const duration =
					step.durationBase + (isRushHour ? 10 : 0) + Math.floor(offsetMin / 4);
				const recTime = addMinToTimeStr(step.baseDeparture, offsetMin - 5);
				return { ...step, crowd, duration, recTime };
			}),
		[offsetMin, isRushHour],
	);

	const data3 = useMemo(
		() =>
			halteArrivals.map((bus) => {
				const eta = bus.etaBase + offsetMin + (isRushHour ? 5 : 0);
				const jarak =
					(bus.jarakBase + offsetMin * 0.3 + (isRushHour ? 0.2 : 0)).toFixed(
						1,
					) + " km";
				const crowd = crowdStatus(bus.status, isRushHour, offsetMin);
				const d = new Date(Date.now() + eta * 60000);
				const clockTime = d
					.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
					.replace(".", ":");
				return { ...bus, eta, jarak, crowd, clockTime };
			}),
		[offsetMin, isRushHour],
	);

	const data4 = useMemo(
		() => ({
			...detailBusData,
			crowd: crowdStatus(detailBusData.status, isRushHour, 0),
			jarak: isRushHour
				? (detailBusData.jarakBase - 0.1).toFixed(1) + " km"
				: detailBusData.jarakBase.toFixed(1) + " km",
		}),
		[isRushHour],
	);

	const TransportStrip = () => (
		<div className="flex items-center gap-0.5 px-4 py-3 shrink-0">
			{[0, 1, 2, 3, 4, 5, 6].map((i) => {
				if (i % 2 === 1)
					return (
						<span key={i} className="text-[#3a5a7a] text-sm mx-0.5">
							›
						</span>
					);
				return [0, 4, 6].includes(i) ? (
					<WalkIcon key={i} size={20} />
				) : (
					<BusFrontlessIcon key={i} size={20} />
				);
			})}
		</div>
	);
	const PageHeader = ({ title }) => (
		<div className="flex items-center gap-3 px-4 pt-14 pb-4 shrink-0">
			<button className="w-10 h-10 rounded-full bg-[#1c2d45] flex items-center justify-center flex-shrink-0">
				<BackIcon />
			</button>
			<h1 className="text-lg font-bold text-white">{title}</h1>
		</div>
	);
	const Handle = () => (
		<div className="w-12 h-1 bg-[#3a5070] rounded-full mx-auto mb-3 shrink-0" />
	);

	return (
		<div
			className="min-h-screen flex flex-col items-center justify-center p-4 relative font-sans transition-colors duration-700 ease-in-out"
			style={{ background: deviceMode === "app" ? "#ffffff" : "#0a1624" }}
		>
			<div className="absolute top-6 left-1/2 -translate-x-1/2 flex bg-[#1c2d45] p-1.5 rounded-full shadow-2xl border border-[#2a3f5e] z-[100]">
				<button
					onClick={() => setDeviceMode("app")}
					className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${deviceMode === "app" ? "bg-[#1d73e8] text-white shadow-md" : "text-[#7a9bbf] hover:text-white"}`}
				>
					Mode Aplikasi
				</button>
				<button
					onClick={() => setDeviceMode("tv")}
					className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${deviceMode === "tv" ? "bg-[#1d73e8] text-white shadow-md" : "text-[#7a9bbf] hover:text-white"}`}
				>
					Mode TV Halte
				</button>
			</div>

			{deviceMode === "tv" ? (
				<div className="w-full mt-16 animate-fade-in-up">
					<TVDisplay />
				</div>
			) : (
				<div
					className="relative w-full max-w-[390px] flex flex-col overflow-hidden mt-16 mb-24 animate-fade-in-up"
					style={{
						height: 800,
						background: "#0b1629",
						borderRadius: "2.5rem",
						border: "10px solid #06101a",
						boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
					}}
				>
					<div className="absolute top-3 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
						<div
							className={`pointer-events-auto transition-all duration-700 transform origin-top shadow-2xl overflow-hidden ${alertConfig.show ? `w-full opacity-100 scale-100 rounded-[24px] p-4 ${alertConfig.type === "heavy" ? "bg-[#C92C27]" : "bg-[#D46121]"}` : "w-[120px] h-[32px] opacity-100 scale-100 rounded-full p-0 bg-black"}`}
							style={{
								transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
							}}
						>
							{alertConfig.show && (
								<div className="animate-fade-in">
									<div className="flex items-center gap-2.5 mb-3">
										<div className="bg-white/20 p-1.5 rounded-full">
											<svg
												width="16"
												height="16"
												viewBox="0 0 24 24"
												fill="none"
												stroke="white"
												strokeWidth="3"
												strokeLinecap="round"
											>
												<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
												<line x1="12" y1="9" x2="12" y2="13" />
												<line x1="12" y1="17" x2="12.01" y2="17" />
											</svg>
										</div>
										<span className="text-white font-black text-[11px] tracking-widest uppercase">
											{alertConfig.type === "heavy"
												? "GANGGUAN BERAT"
												: "GANGGUAN RINGAN"}
										</span>
									</div>

									<p className="text-white text-[13px] font-bold leading-tight mb-3">
										{alertConfig.msg}
									</p>

									<div className="bg-[#0b1629]/40 backdrop-blur-md rounded-xl p-3 border-l-[3px] border-[#4da3f5]">
										<span className="text-[#4da3f5] text-[9px] font-black uppercase tracking-widest block mb-1 flex items-center gap-1">
											<svg
												width="10"
												height="10"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="3"
											>
												<circle cx="12" cy="12" r="10" />
												<path d="M12 16v-4" />
												<path d="M12 8h.01" />
											</svg>
											Stand by Me Advice
										</span>
										<span className="text-white text-[12px] font-semibold leading-snug">
											{alertConfig.advice}
										</span>
									</div>
								</div>
							)}
						</div>
					</div>
					{activePage === "tujuan_kamu" && (
						<div className="flex-1 flex flex-col overflow-hidden">
							<PageHeader title="Tujuan Kamu" />
							<div className="px-4 pb-4 shrink-0 space-y-2">
								<div className="flex items-center gap-2">
									<div className="flex-1 bg-[#1c2d45] rounded-xl px-4 py-3 flex items-center gap-3">
										<svg
											width="15"
											height="15"
											viewBox="0 0 24 24"
											fill="none"
											stroke="#7a9bbf"
											strokeWidth="2"
										>
											<circle cx="12" cy="10" r="3" />
											<path d="M12 2a8 8 0 010 16c-4.4 0-8-5.4-8-8a8 8 0 018-8z" />
										</svg>
										<span className="text-[#8fa8c4] text-sm">Blok M</span>
									</div>
									<button className="w-9 h-9 rounded-full bg-[#1c2d45] flex items-center justify-center flex-shrink-0">
										<svg
											width="15"
											height="15"
											viewBox="0 0 24 24"
											fill="none"
											stroke="white"
											strokeWidth="2.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<line x1="12" y1="3" x2="12" y2="21" />
											<polyline points="9 6 12 3 15 6" />
											<polyline points="9 18 12 21 15 18" />
										</svg>
									</button>
								</div>
								<div className="flex items-center gap-2">
									<div className="flex-1 bg-[#1e3050] rounded-xl px-4 py-3 flex items-center gap-3">
										<svg
											width="15"
											height="15"
											viewBox="0 0 24 24"
											fill="none"
											stroke="#7a9bbf"
											strokeWidth="2"
											strokeLinecap="round"
										>
											<circle cx="12" cy="12" r="3" />
											<line x1="12" y1="2" x2="12" y2="6" />
											<line x1="12" y1="18" x2="12" y2="22" />
											<line x1="2" y1="12" x2="6" y2="12" />
											<line x1="18" y1="12" x2="22" y2="12" />
										</svg>
										<span className="text-white font-semibold text-sm">
											Kota
										</span>
									</div>
									<button className="w-9 h-9 rounded-full bg-[#1c2d45] flex items-center justify-center flex-shrink-0">
										<svg
											width="15"
											height="15"
											viewBox="0 0 24 24"
											fill="none"
											stroke="white"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
										</svg>
									</button>
								</div>
								<DepartureBar
									value={departureOffset}
									onChange={setDepartureOffset}
								/>
							</div>
							<Divider />
							<div className="flex items-center gap-3 px-4 py-3 shrink-0">
								<div className="bg-[#1d73e8] text-white text-sm font-semibold px-5 py-2 rounded-full">
									Rute Tersedia
								</div>
							</div>
							<div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
								{data1.map((bus) => (
									<div
										key={bus.id}
										className="bg-[#132236] rounded-2xl p-4 shadow-sm"
									>
										<div className="flex justify-between mb-1">
											<span className="text-[#7a9bbf] text-[11px] font-bold uppercase tracking-wider">
												Rek. Keberangkatan
											</span>
											<span className="text-[#7a9bbf] text-[11px]">
												Perjalanan
											</span>
										</div>
										<div className="flex items-center justify-between mb-3">
											<span className="text-white font-extrabold text-xl">
												{bus.recTime}
											</span>
											<div className="flex items-center gap-1.5">
												<WalkIcon size={18} />
												<BusFrontlessIcon size={18} />
												<div className="w-5 h-5 rounded-full bg-[#C92C27] flex items-center justify-center text-white text-[9px] font-black">
													{bus.koridor}
												</div>
												<WalkIcon size={18} />
												<span className="text-[#7a9bbf] text-sm tracking-widest">
													···
												</span>
											</div>
										</div>
										<Divider />
										<div className="pt-3 flex items-center justify-between">
											<div className="border-l-[3px] border-[#2ec07a] pl-3">
												<span className="text-[#2ec07a] text-[9px] font-black uppercase tracking-widest block mb-0.5">
													Lama Perjalanan
												</span>
												<div className="flex items-baseline gap-1">
													<span className="text-white font-extrabold text-2xl tracking-tight leading-none">
														{bus.eta}
													</span>
													<span className="text-white font-bold text-sm">
														menit
													</span>
												</div>
											</div>
											<CrowdBusIcon crowd={bus.crowd} />
										</div>
										<div className="flex items-center gap-2 mt-3">
											<div className="bg-[#1c2d45] text-[#cce0f5] text-xs font-medium rounded-full px-3 py-1.5">
												Rp 3.500
											</div>
											<div className="bg-[#1c2d45] text-[#cce0f5] text-xs font-medium rounded-full px-3 py-1.5">
												25.0 km
											</div>
											{bus.id === "1" && (
												<div className="bg-[#e6b800] text-[#1a1000] text-xs font-black rounded-full px-3 py-1.5">
													Tercepat
												</div>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					)}
					{activePage === "tujuan_2" && (
						<div className="flex-1 flex flex-col overflow-hidden">
							<PageHeader title="Rencana Perjalanan" />
							<Handle />
							<div className="px-4 pb-3 shrink-0">
								<div className="text-white font-extrabold text-[18px] mb-3">
									Lokasi Saya - Ancol
								</div>
								<div className="flex gap-2 mb-3">
									<div className="bg-[#1c2d45] text-[#cce0f5] rounded-full px-4 py-2 flex items-center gap-2 text-sm">
										<svg
											width="13"
											height="13"
											viewBox="0 0 24 24"
											fill="none"
											stroke="#7ab8f5"
											strokeWidth="2"
											strokeLinecap="round"
										>
											<circle cx="12" cy="12" r="10" />
											<polyline points="12 6 12 12 16 14" />
										</svg>
										2 jam 56 menit
									</div>
									<div className="bg-[#1c2d45] text-[#cce0f5] rounded-full px-4 py-2 text-sm">
										Rp 3.500
									</div>
								</div>
								<button className="w-full bg-[#1d73e8] text-white font-bold rounded-full py-3 flex items-center justify-center gap-2 text-sm">
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="white"
										strokeWidth="2"
										strokeLinecap="round"
									>
										<path d="M2 9a3 3 0 010-6h20a3 3 0 010 6" />
										<path d="M2 15a3 3 0 000 6h20a3 3 0 000-6" />
										<line x1="2" y1="12" x2="22" y2="12" />
									</svg>
									Beli Tiket
								</button>
							</div>
							<Divider />
							<TransportStrip />
							<Divider />
							<div className="px-4 pt-3 pb-1 shrink-0">
								<DepartureBar
									value={departureOffset}
									onChange={setDepartureOffset}
								/>
							</div>
							<div className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
								{data2.map((step) => {
									if (step.type === "walk")
										return (
											<div
												key={step.id}
												className="flex items-start gap-3 py-3 border-b border-[#1a2d44]"
											>
												<div className="flex flex-col items-center gap-1 w-6 pt-0.5 shrink-0">
													<div className="w-2 h-2 rounded-full bg-[#3a5070]" />
													<WalkIcon size={18} />
													<div className="w-1.5 h-1.5 rounded-full bg-[#3a5070]" />
												</div>
												<div className="flex-1">
													<div className="text-white text-sm font-semibold">
														{step.label}
													</div>
													<div className="text-[#7a9bbf] text-xs mt-0.5">
														{step.sub}
													</div>
												</div>
												<ChevronDown />
											</div>
										);
									if (step.type === "bus")
										return (
											<div key={step.id} className="border-b border-[#1a2d44]">
												<div className="flex gap-3 pt-3">
													<div className="flex flex-col items-center w-6 shrink-0">
														<div className="w-3.5 h-3.5 rounded-full bg-[#D46121] border-2 border-[#D46121] z-10" />
														<div className="w-0.5 flex-1 bg-[#D46121] min-h-[24px]" />
													</div>
													<div className="flex-1 pb-2">
														<div className="text-[#e6a020] text-[10px] font-black uppercase tracking-widest">
															Start
														</div>
														<div className="text-white font-bold text-[15px] mb-2">
															{step.startStation}
														</div>
														<div className="flex items-center gap-2 mb-3">
															<div className="w-6 h-6 rounded bg-[#D46121] flex items-center justify-center text-white text-[10px] font-black">
																{step.koridor}
															</div>
															<span className="text-[#4da3f5] text-sm font-semibold">
																{step.rute}
															</span>
														</div>
														<div className="bg-[#1c2d45] rounded-xl p-3 flex items-center justify-between mb-2">
															<div className="border-l-[3px] border-[#2ec07a] pl-3">
																<span className="text-[#2ec07a] text-[9px] font-black uppercase tracking-widest block mb-0.5">
																	Rek. Keberangkatan
																</span>
																<span className="text-white font-extrabold text-xl tracking-tight">
																	{step.recTime}
																</span>
															</div>
															<CrowdBusIcon crowd={step.crowd} />
														</div>
													</div>
												</div>
												<div className="flex items-center justify-between pl-9 pb-2 pt-0">
													<span className="text-[#7a9bbf] text-xs">
														{step.duration} menit &nbsp;({step.dist})
													</span>
													<ChevronDown />
												</div>
												<div className="flex gap-3 pb-3">
													<div className="flex flex-col items-center w-6 shrink-0">
														<div className="w-3.5 h-3.5 rounded-full bg-[#D46121]" />
													</div>
													<div className="flex-1">
														<div className="text-[#e05a30] text-[10px] font-black uppercase tracking-widest">
															Exit
														</div>
														<div className="text-white font-bold text-[15px]">
															{step.exitStation}
														</div>
													</div>
												</div>
											</div>
										);
									return null;
								})}
							</div>
						</div>
					)}
					{activePage === "tujuan_3" && (
						<div className="flex-1 flex flex-col overflow-hidden">
							<PageHeader title="Detail Halte" />
							<Handle />
							<Divider />
							<div className="flex-1 overflow-y-auto px-4 pb-6">
								<div className="pt-4">
									<div className="flex items-start justify-between mb-1">
										<h2 className="text-white font-extrabold text-xl">
											Kedatangan Bus
										</h2>
										<span className="text-[#4da3f5] text-xs font-semibold flex items-center gap-1 pt-1">
											<svg
												width="12"
												height="12"
												viewBox="0 0 24 24"
												fill="none"
												stroke="#4da3f5"
												strokeWidth="2"
											>
												<circle cx="12" cy="12" r="10" />
												<line x1="12" y1="8" x2="12" y2="8.5" />
												<line x1="12" y1="11" x2="12" y2="16" />
											</svg>
											Panduan Waktu
										</span>
									</div>
									<p className="text-[#7a9bbf] text-xs leading-relaxed mb-4">
										Waktu kedatangan bus dapat bervariasi tergantung pada
										kondisi lalu lintas, kondisi bus, dan koneksi internet.
									</p>
									<div className="mb-4">
										<DepartureBar
											value={departureOffset}
											onChange={setDepartureOffset}
										/>
									</div>
									<div
										className="rounded-2xl overflow-hidden"
										style={{ background: "#132236" }}
									>
										{data3.map((bus, i) => (
											<div
												key={bus.id}
												className={`p-4 ${i < data3.length - 1 ? "border-b border-[#1e3554]" : ""}`}
											>
												<div className="flex items-center justify-between mb-3">
													<div className="flex items-center gap-2">
														<BusFrontlessIcon size={18} />
														<div className="w-6 h-6 rounded bg-[#C92C27] flex items-center justify-center text-white text-[10px] font-black">
															{bus.koridor}
														</div>
														<div
															className="rounded px-2 py-0.5 text-white text-[10px] font-bold"
															style={{ background: "#C92C27" }}
														>
															{bus.plat}
														</div>
													</div>
													<span className="text-[#2ec07a] text-[11px] font-bold">
														Perkiraan Kedatangan
													</span>
												</div>
												<div className="flex items-center justify-between mb-3">
													<div className="flex items-center gap-3">
														<div className="w-8 h-8 rounded-full bg-[#1e3554] flex items-center justify-center shrink-0">
															<svg
																width="13"
																height="13"
																viewBox="0 0 24 24"
																fill="none"
																stroke="#7ab8f5"
																strokeWidth="2.5"
																strokeLinecap="round"
															>
																<polyline points="23 4 23 10 17 10" />
																<path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
															</svg>
														</div>
														<div>
															<div className="inline-block bg-[#1e3554] text-[#cce0f5] text-[10px] font-medium rounded px-2 py-0.5 mb-1">
																Tujuan Akhir
															</div>
															<div className="text-white font-bold text-sm">
																{bus.rute}
															</div>
														</div>
													</div>
													<div className="text-right">
														<div className="flex items-baseline gap-1 justify-end">
															<span className="text-[#2ec07a] font-black text-[26px] leading-none">
																{bus.eta}
															</span>
															<span className="text-[#2ec07a] font-bold text-sm">
																min
															</span>
														</div>
														<div className="text-[#7a9bbf] text-xs mt-0.5">
															{bus.clockTime}
														</div>
													</div>
												</div>
												<JarakStatusRow jarak={bus.jarak} crowd={bus.crowd} />
											</div>
										))}
									</div>
								</div>
								<Divider my="my-5" />
								<h2 className="text-white font-extrabold text-xl mb-3">
									Fasilitas
								</h2>
								<div
									className="rounded-2xl px-4 py-5 text-center text-[#7a9bbf] font-medium mb-5"
									style={{ background: "#132236" }}
								>
									No Data
								</div>
								<Divider my="my-5" />
								<h2 className="text-white font-extrabold text-xl mb-3">
									Layanan Bus BRT
								</h2>
								<div>
									{halteLayanan.map((l, i) => (
										<div
											key={i}
											className="flex items-center gap-4 py-3 border-b border-[#1a2d44] last:border-b-0"
										>
											<div
												className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0"
												style={{ background: l.bg }}
											>
												{l.koridor}
											</div>
											<span className="text-[#cce0f5] text-sm">{l.rute}</span>
										</div>
									))}
								</div>
							</div>
						</div>
					)}
					{activePage === "tujuan_4" && (
						<div className="flex-1 flex flex-col overflow-hidden relative">
							<TransjakartaLiveMap />
							<div className="absolute top-0 left-0 right-0 flex items-center gap-3 px-4 pt-14 pb-4 z-20">
								<button
									className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
									style={{ background: "rgba(11,22,41,0.85)" }}
								>
									<BackIcon />
								</button>
								<h1 className="text-lg font-bold text-white">Detail Bus</h1>
							</div>
							<div
								className="absolute top-[112px] left-4 z-20 rounded-full px-4 py-2 flex items-center gap-2"
								style={{ background: "rgba(11,22,41,0.85)" }}
							>
								<div className="w-2.5 h-2.5 rounded-full bg-[#2ec07a]" />
								<span className="text-white text-sm font-semibold">
									Data Bus Masuk
								</span>
							</div>
							<button
								className="absolute right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center"
								style={{
									bottom: "calc(46% + 12px)",
									background: "rgba(11,22,41,0.85)",
								}}
							>
								<svg
									width="15"
									height="15"
									viewBox="0 0 24 24"
									fill="none"
									stroke="white"
									strokeWidth="2"
									strokeLinecap="round"
								>
									<circle cx="12" cy="12" r="3" />
									<line x1="12" y1="2" x2="12" y2="6" />
									<line x1="12" y1="18" x2="12" y2="22" />
									<line x1="2" y1="12" x2="6" y2="12" />
									<line x1="18" y1="12" x2="22" y2="12" />
								</svg>
							</button>
							<div
								className="absolute bottom-0 left-0 right-0 z-20 flex flex-col rounded-t-3xl"
								style={{ height: "46%", background: "#0b1629" }}
							>
								<Handle />
								<div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-full bg-[#C92C27] flex items-center justify-center text-white font-black text-base shrink-0">
											{data4.koridor}
										</div>
										<div className="bg-[#C92C27] text-white text-sm font-bold rounded-xl px-4 py-2">
											{data4.plat}
										</div>
									</div>
									<div className="flex gap-3">
										<div
											className="flex-1 rounded-2xl p-3"
											style={{ background: "#132236" }}
										>
											<div className="text-[#7a9bbf] text-[10px] mb-1">
												Tipe
											</div>
											<div className="text-white font-extrabold text-base">
												BRT
											</div>
										</div>
										<div
											className="flex-1 rounded-2xl p-3"
											style={{ background: "#132236" }}
										>
											<div className="text-[#7a9bbf] text-[10px] mb-1">
												Tujuan Akhir
											</div>
											<div className="text-white font-extrabold text-sm uppercase">
												{data4.rute}
											</div>
										</div>
									</div>
									<div className="bg-[#1c2d45] rounded-xl px-4 py-3 flex items-center justify-between">
										<span className="text-[#7a9bbf] text-xs font-semibold uppercase tracking-wider">
											Waktu Keberangkatan
										</span>
										<span className="text-white font-black text-xl">
											{data4.fixedRecommendation}
										</span>
									</div>
									<JarakStatusRow jarak={data4.jarak} crowd={data4.crowd} />
									<div>
										<h3 className="text-white font-extrabold text-base mb-1">
											Kedatangan Bus
										</h3>
										<p className="text-[#7a9bbf] text-[11px] mb-2 leading-relaxed">
											Waktu kedatangan bus dapat bervariasi tergantung kondisi
											lalu lintas dan koneksi internet.
										</p>
										<div
											className="rounded-2xl p-4 flex items-center justify-between"
											style={{ background: "#132236" }}
										>
											<div className="flex items-center gap-3">
												<BusFrontlessIcon size={24} />
												<span className="text-white font-bold text-sm">
													Kampung Rambutan
												</span>
											</div>
											<div className="text-right">
												<div className="text-[#2ec07a] text-[11px] font-bold mb-1">
													Perkiraan Kedatangan
												</div>
												<div className="flex items-baseline gap-1 justify-end">
													<span className="text-white font-black text-2xl leading-none">
														4
													</span>
													<span className="text-white font-bold text-sm">
														min
													</span>
												</div>
												<div className="text-[#7a9bbf] text-xs">01:22</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			)}

			{deviceMode === "app" && (
				<div
					className="fixed bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2.5 p-2.5 rounded-full z-50 animate-fade-in-up"
					style={{
						background: "rgba(11,22,41,0.96)",
						border: "1px solid #1c2d45",
						backdropFilter: "blur(12px)",
						boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
					}}
				>
					<div className="flex bg-[#162030] p-1 rounded-full gap-0.5">
						{[
							["tujuan_kamu", "1. Beranda"],
							["tujuan_2", "2. Rencana"],
							["tujuan_3", "3. Halte"],
							["tujuan_4", "4. Bus"],
						].map(([page, label]) => (
							<button
								key={page}
								onClick={() => setActivePage(page)}
								className="px-3 py-2 text-xs font-black rounded-full transition-all"
								style={{
									background: activePage === page ? "#1d73e8" : "transparent",
									color: activePage === page ? "white" : "#7a9bbf",
								}}
							>
								{label}
							</button>
						))}
					</div>
					<div className="w-px h-5 bg-[#1c2d45]" />
					<button
						onClick={() => setIsRushHour((r) => !r)}
						className="px-4 py-2 rounded-full text-xs font-black transition-all"
						style={{
							background: isRushHour ? "#e05a30" : "#162030",
							color: isRushHour ? "white" : "#7a9bbf",
						}}
					>
						{isRushHour ? "Jam Sibuk ON" : "Jam Sibuk"}
					</button>
					<div className="w-px h-5 bg-[#1c2d45]" />
					<div className="flex gap-2">
						<button
							onClick={() =>
								setAlertConfig({
									show: true,
									type: "light",
									msg: "Kepadatan luar biasa di Harmoni karena perbaikan jalan.",
									advice:
										"Estimasi perjalanan terhambat +15 menit. Tetap di jalur, bus sedang mengurai kemacetan.",
								})
							}
							className="px-3 py-2 rounded-full text-[10px] font-black transition-all bg-[#D46121] text-white hover:scale-105"
						>
							Alert Ringan
						</button>
						<button
							onClick={() =>
								setAlertConfig({
									show: true,
									type: "heavy",
									msg: "Demonstrasi di wilayah Monas. Bus Koridor 1 dialihkan via Pejagalan.",
									advice:
										"Bus skip 3 halte. Gunakan MRT dari Bundaran HI sebagai alternatif tercepat.",
								})
							}
							className="px-3 py-2 rounded-full text-[10px] font-black transition-all bg-[#C92C27] text-white hover:scale-105"
						>
							Alert Berat
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
