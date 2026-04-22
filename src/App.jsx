import React, { useState } from "react";

// ICONS
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

const TransjakartaLiveMap = () => {
	React.useEffect(() => {
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

			const routeCoords = [
				[-6.17, 106.822],
				[-6.1754, 106.8272],
				[-6.184, 106.823],
				[-6.195, 106.8225],
			];
			L.polyline(routeCoords, {
				color: "#C92C27",
				weight: 5,
				opacity: 0.9,
			}).addTo(mapInstance);

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
		} else {
			initializeMap();
		}

		return () => {
			if (mapInstance) {
				mapInstance.remove();
			}
		};
	}, []);

	return (
		<div id="tj-real-map" className="absolute inset-0 z-0 bg-[#0a1624]"></div>
	);
};

// DATA
const initialRoutes = [
	{
		id: "1",
		koridor: "1",
		rute: "Blok M - Kota",
		etaBase: 40,
		status: "Sedang",
		firstHalteDeparture: "17:53",
	},
	{
		id: "2",
		koridor: "1",
		rute: "Blok M - Kota",
		etaBase: 50,
		status: "Kosong",
		firstHalteDeparture: "18:08",
	},
];

const journeySteps = [
	{
		id: "w2",
		type: "walk",
		label: "Berjalan Ke Kampung Melayu",
		sub: "(17 m)",
	},
	{
		id: "b2",
		type: "bus",
		startStation: "Kampung Melayu",
		exitStation: "Ancol",
		koridor: "5",
		rute: "Kampung Melayu - Ancol",
		durationBase: 28,
		dist: "6.0 km",
		baseDeparture: "14:00",
		status: "Kosong",
	},
];

const halteArrivals = [
	{
		id: "h1",
		koridor: "1",
		rute: "Blok M",
		plat: "B 7001 SGA",
		tipe: "Bus Gandeng",
		etaBase: 3,
		jarakBase: 1.2,
		status: "Sedang",
	},
	{
		id: "h2",
		koridor: "1",
		rute: "Kota",
		plat: "B 7455 TGB",
		tipe: "Bus Engkel",
		etaBase: 12,
		jarakBase: 4.5,
		status: "Kosong",
	},
	{
		id: "h3",
		koridor: "1",
		rute: "Blok M",
		plat: "B 7022 SGA",
		tipe: "Bus Gandeng",
		etaBase: 24,
		jarakBase: 8.1,
		status: "Kosong",
	},
];

const halteLayanan = [
	{ koridor: "1", rute: "Blok M - Kota", bg: "#C92C27" },
	{ koridor: "1A", rute: "Blok M - Kota via Monumen Nasional", bg: "#C92C27" },
	{ koridor: "2", rute: "Harmoni - Pulogadung", bg: "#1d5cb8" },
];

const detailBusData = {
	koridor: "1",
	rute: "Blok M",
	plat: "B 7001 SGA",
	tipe: "Bus Gandeng",
	jarakBase: 1.2,
	status: "Sedang",
	fixedRecommendation: "13:11",
	speed: "32 km/h",
	temp: "22°C",
	stops: [
		{ name: "Kota", passed: true, time: "12:50" },
		{ name: "Glodok", passed: true, time: "12:55" },
		{ name: "Olimo", passed: true, time: "13:02" },
		{ name: "Mangga Besar", passed: false, time: "13:10", isCurrent: true },
		{ name: "Sawah Besar", passed: false, time: "13:16" },
		{ name: "Harmoni", passed: false, time: "13:22" },
	],
};

// HELPERS
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

// SHARED SUBCOMPONENTS
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

// MAIN APP
export default function App() {
	const [activePage, setActivePage] = useState("tujuan_kamu");
	const [departureOffset, setDepartureOffset] = useState("sekarang");
	const [isRushHour, setIsRushHour] = useState(false);

	const offsetMin =
		departureOffset === "sekarang" ? 0 : parseInt(departureOffset);

	const data1 = initialRoutes.map((bus) => ({
		...bus,
		eta: bus.etaBase + offsetMin + (isRushHour ? 8 : 0),
		crowd: crowdStatus(bus.status, isRushHour, offsetMin),
		recTime: addMinToTimeStr(bus.firstHalteDeparture, offsetMin - 5),
	}));

	const data2 = journeySteps.map((step) => {
		if (step.type !== "bus") return step;
		const crowd = crowdStatus(step.status, isRushHour, offsetMin);
		const duration =
			step.durationBase + (isRushHour ? 10 : 0) + Math.floor(offsetMin / 4);
		const recTime = addMinToTimeStr(step.baseDeparture, offsetMin - 5);
		return { ...step, crowd, duration, recTime };
	});

	const data3 = halteArrivals.map((bus) => {
		const eta = bus.etaBase + offsetMin + (isRushHour ? 5 : 0);
		const jarak =
			(bus.jarakBase + offsetMin * 0.3 + (isRushHour ? 0.2 : 0)).toFixed(1) +
			" km";
		const crowd = crowdStatus(bus.status, isRushHour, offsetMin);
		const d = new Date(Date.now() + eta * 60000);
		const clockTime = d
			.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
			.replace(".", ":");
		return { ...bus, eta, jarak, crowd, clockTime };
	});

	const data4 = {
		...detailBusData,
		crowd: crowdStatus(detailBusData.status, isRushHour, 0),
		jarak: isRushHour
			? (detailBusData.jarakBase - 0.1).toFixed(1) + " km"
			: detailBusData.jarakBase.toFixed(1) + " km",
	};

	const TransportStrip = () => (
		<div className="flex items-center gap-0.5 px-4 py-3 shrink-0">
			{[0, 1, 2, 3, 4, 5, 6].map((i) => {
				if (i % 2 === 1)
					return (
						<span key={i} className="text-[#3a5a7a] text-sm mx-0.5">
							›
						</span>
					);
				const isWalk = [0, 4, 6].includes(i);
				return isWalk ? (
					<WalkIcon key={i} size={20} />
				) : (
					<BusFrontlessIcon key={i} size={20} />
				);
			})}
		</div>
	);

	const PageHeader = ({ title }) => (
		<div className="flex items-center gap-3 px-4 py-4 shrink-0">
			<button className="w-10 h-10 rounded-full bg-[#1c2d45] flex items-center justify-center flex-shrink-0">
				<BackIcon />
			</button>
			<h1 className="text-lg font-bold text-white">{title}</h1>
		</div>
	);

	const Handle = () => (
		<div className="w-12 h-1 bg-[#3a5070] rounded-full mx-auto mb-3 shrink-0" />
	);

	// RENDER
	return (
		<div
			className="min-h-screen flex items-center justify-center p-4 pb-28 font-sans"
			style={{ background: "#f0f8ff" }}
		>
			<div
				className="relative w-full max-w-[390px] flex flex-col overflow-hidden"
				style={{
					height: 800,
					background: "#0b1629",
					borderRadius: "2.5rem",
					border: "10px solid #06101a",
					boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
				}}
			>
				{/* PAGE 1: TUJUAN KAMU */}
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
									<span className="text-white font-semibold text-sm">Kota</span>
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

				{/* PAGE 2: RENCANA PERJALANAN */}
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
													<div className="text-[#D46121] text-[10px] font-black uppercase tracking-widest">
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

				{/* PAGE 3: DETAIL HALTE */}
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
									Waktu kedatangan bus dapat bervariasi tergantung pada kondisi
									lalu lintas, kondisi bus, dan koneksi internet.
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

				{/* PAGE 4: DETAIL BUS */}
				{activePage === "tujuan_4" && (
					<div className="flex-1 flex flex-col overflow-hidden relative">
						<TransjakartaLiveMap />

						<div className="absolute top-0 left-0 right-0 flex items-center gap-3 px-4 py-4 z-20">
							<button
								className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
								style={{ background: "rgba(11,22,41,0.85)" }}
							>
								<BackIcon />
							</button>
							<h1 className="text-lg font-bold text-white">Detail Bus</h1>
						</div>

						<div
							className="absolute top-[68px] left-4 z-20 rounded-full px-4 py-2 flex items-center gap-2"
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
										<div className="text-[#7a9bbf] text-[10px] mb-1">Tipe</div>
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

			{/* PROTOTYPE DOCK */}
			<div
				className="fixed bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2.5 p-2.5 rounded-full z-50"
				style={{
					background: "rgba(11,22,41,0.96)",
					border: "1px solid #1c2d45",
					backdropFilter: "blur(12px)",
					boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
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
					{isRushHour ? "🛑 Jam Sibuk ON" : "⏱️ Jam Sibuk"}
				</button>
			</div>
		</div>
	);
}
