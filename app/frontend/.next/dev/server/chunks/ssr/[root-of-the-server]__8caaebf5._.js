module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/components/AnimatedGlobe.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AnimatedGlobe
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
function AnimatedGlobe() {
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const animationRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])();
    const rotationRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const dotsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const connectionsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        // Set canvas size
        const resizeCanvas = ()=>{
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.45;
        // Initialize dots
        const initializeDots = ()=>{
            const dots = [];
            const numDots = 25;
            for(let i = 0; i < numDots; i++){
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const x = centerX + radius * Math.sin(phi) * Math.cos(theta);
                const y = centerY + radius * Math.sin(phi) * Math.sin(theta);
                dots.push({
                    x,
                    y,
                    scale: 0,
                    opacity: 0,
                    popProgress: 0,
                    active: i === 0,
                    activationTime: i === 0 ? 0 : -1
                });
            }
            return dots;
        };
        dotsRef.current = initializeDots();
        const networkStartTime = Date.now();
        // Animation loop
        const animate = ()=>{
            ctx.clearRect(0, 0, width, height);
            // Rotate globe forwards
            rotationRef.current -= 0.002;
            // Draw globe atmospheric glow
            const atmosphericGlow = ctx.createRadialGradient(centerX, centerY, radius * 0.7, centerX, centerY, radius * 1.5);
            atmosphericGlow.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
            atmosphericGlow.addColorStop(0.4, 'rgba(16, 185, 129, 0.15)');
            atmosphericGlow.addColorStop(0.7, 'rgba(16, 185, 129, 0.08)');
            atmosphericGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');
            ctx.fillStyle = atmosphericGlow;
            ctx.fillRect(0, 0, width, height);
            // Draw continent-like glow patches
            const continentGlows = [
                {
                    x: 0.2,
                    y: 0.3,
                    size: 0.25
                },
                {
                    x: -0.15,
                    y: 0.25,
                    size: 0.2
                },
                {
                    x: 0.1,
                    y: -0.2,
                    size: 0.3
                },
                {
                    x: 0.4,
                    y: 0.15,
                    size: 0.22
                },
                {
                    x: -0.35,
                    y: -0.35,
                    size: 0.18
                }
            ];
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotationRef.current);
            continentGlows.forEach(({ x, y, size })=>{
                const glowX = x * radius;
                const glowY = y * radius;
                const glowRadius = size * radius;
                const continentGlow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowRadius);
                continentGlow.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
                continentGlow.addColorStop(0.5, 'rgba(16, 185, 129, 0.2)');
                continentGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');
                ctx.fillStyle = continentGlow;
                ctx.beginPath();
                ctx.arc(glowX, glowY, glowRadius, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.restore();
            // Draw globe outline with rotating effect
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotationRef.current);
            // Outer glow
            const outerGlow = ctx.createRadialGradient(0, 0, radius * 0.9, 0, 0, radius * 1.1);
            outerGlow.addColorStop(0, 'rgba(16, 185, 129, 0)');
            outerGlow.addColorStop(0.8, 'rgba(16, 185, 129, 0.3)');
            outerGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');
            ctx.fillStyle = outerGlow;
            ctx.beginPath();
            ctx.arc(0, 0, radius * 1.1, 0, Math.PI * 2);
            ctx.fill();
            // Globe circle
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.stroke();
            // Draw latitude lines
            for(let i = 1; i < 5; i++){
                const y = radius * 2 * i / 5 - radius;
                const lineRadius = Math.sqrt(radius * radius - y * y);
                ctx.strokeStyle = `rgba(16, 185, 129, ${0.15 - i * 0.02})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.ellipse(0, y, lineRadius, lineRadius * 0.3, 0, 0, Math.PI * 2);
                ctx.stroke();
            }
            // Draw longitude lines
            for(let i = 0; i < 6; i++){
                const angle = Math.PI / 3 * i;
                ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.ellipse(0, 0, radius * Math.abs(Math.cos(angle)), radius, angle, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.restore();
            // Update and draw dots
            const currentTime = Date.now();
            dotsRef.current.forEach((dot, index)=>{
                // Rotate dots with globe (forwards)
                const dx = dot.x - centerX;
                const dy = dot.y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) - 0.002;
                dot.x = centerX + Math.cos(angle) * distance;
                dot.y = centerY + Math.sin(angle) * distance;
                if (dot.active) {
                    // Pop animation for active dots
                    dot.popProgress += 0.05;
                    const popCycle = Math.sin(dot.popProgress) * 0.5 + 0.5;
                    dot.scale = 0.8 + popCycle * 0.4;
                    dot.opacity = 0.8 + popCycle * 0.2;
                    // Draw active dot glow
                    const dotGlow = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, 20 * dot.scale);
                    dotGlow.addColorStop(0, `rgba(16, 185, 129, ${dot.opacity})`);
                    dotGlow.addColorStop(0.5, `rgba(16, 185, 129, ${dot.opacity * 0.5})`);
                    dotGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');
                    ctx.fillStyle = dotGlow;
                    ctx.beginPath();
                    ctx.arc(dot.x, dot.y, 20 * dot.scale, 0, Math.PI * 2);
                    ctx.fill();
                    // Draw active dot
                    ctx.fillStyle = `rgba(16, 185, 129, ${dot.opacity})`;
                    ctx.beginPath();
                    ctx.arc(dot.x, dot.y, 5 * dot.scale, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Inactive dots are dim
                    dot.scale = 0.3;
                    dot.opacity = 0.2;
                    // Draw inactive dot
                    ctx.fillStyle = `rgba(100, 116, 139, ${dot.opacity})`;
                    ctx.beginPath();
                    ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            // Create new connections from active dots to nearby inactive dots
            const activeDots = dotsRef.current.map((dot, index)=>({
                    dot,
                    index
                })).filter(({ dot })=>dot.active);
            activeDots.forEach(({ dot: activeDot, index: activeIndex })=>{
                // Randomly create connections from this active dot
                if (Math.random() < 0.03) {
                    // Find nearby inactive dots
                    const inactiveDots = dotsRef.current.map((dot, index)=>({
                            dot,
                            index
                        })).filter(({ dot, index })=>!dot.active && index !== activeIndex).map(({ dot, index })=>{
                        const dx = dot.x - activeDot.x;
                        const dy = dot.y - activeDot.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        return {
                            dot,
                            index,
                            distance
                        };
                    }).sort((a, b)=>a.distance - b.distance).slice(0, 5); // Get 5 closest dots
                    if (inactiveDots.length > 0) {
                        const target = inactiveDots[Math.floor(Math.random() * inactiveDots.length)];
                        // Check if connection doesn't already exist
                        const connectionExists = connectionsRef.current.some((conn)=>conn.fromIndex === activeIndex && conn.toIndex === target.index);
                        if (!connectionExists) {
                            connectionsRef.current.push({
                                from: {
                                    x: activeDot.x,
                                    y: activeDot.y
                                },
                                to: {
                                    x: target.dot.x,
                                    y: target.dot.y
                                },
                                progress: 0,
                                fromIndex: activeIndex,
                                toIndex: target.index
                            });
                        }
                    }
                }
            });
            // Update and draw connections
            connectionsRef.current = connectionsRef.current.filter((connection)=>{
                connection.progress += 0.015;
                if (connection.progress >= 1) {
                    // Activate the target dot when connection completes
                    const targetDot = dotsRef.current[connection.toIndex];
                    if (!targetDot.active) {
                        targetDot.active = true;
                        targetDot.activationTime = currentTime;
                    }
                    return false;
                }
                const currentX = connection.from.x + (connection.to.x - connection.from.x) * connection.progress;
                const currentY = connection.from.y + (connection.to.y - connection.from.y) * connection.progress;
                // Draw connection line with gradient
                const gradient = ctx.createLinearGradient(connection.from.x, connection.from.y, currentX, currentY);
                gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
                gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.6)');
                gradient.addColorStop(1, 'rgba(16, 185, 129, 0.9)');
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.shadowColor = 'rgba(16, 185, 129, 0.5)';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.moveTo(connection.from.x, connection.from.y);
                ctx.lineTo(currentX, currentY);
                ctx.stroke();
                ctx.shadowBlur = 0;
                // Draw moving particle with glow
                const particleGlow = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 8);
                particleGlow.addColorStop(0, 'rgba(16, 185, 129, 1)');
                particleGlow.addColorStop(0.5, 'rgba(16, 185, 129, 0.6)');
                particleGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');
                ctx.fillStyle = particleGlow;
                ctx.beginPath();
                ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
                ctx.fill();
                // Draw particle core
                ctx.fillStyle = 'rgba(16, 185, 129, 1)';
                ctx.beginPath();
                ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
                ctx.fill();
                return true;
            });
            animationRef.current = requestAnimationFrame(animate);
        };
        animate();
        return ()=>{
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
        ref: canvasRef,
        className: "w-full h-full",
        style: {
            width: '100%',
            height: '100%'
        }
    }, void 0, false, {
        fileName: "[project]/components/AnimatedGlobe.tsx",
        lineNumber: 334,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/components/CitySelector.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CitySelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$combobox$2f$combobox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@headlessui/react/dist/components/combobox/combobox.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const cities = [
    {
        id: 1,
        name: 'Atlanta, GA',
        state: 'Georgia',
        slug: 'atlanta',
        coords: [
            -84.388,
            33.749
        ]
    },
    // ...existing cities...
    {
        id: 2,
        name: 'Madison County, FL',
        state: 'Florida',
        slug: 'madison-county-fl',
        coords: [
            -83.4446,
            30.4694
        ]
    },
    {
        id: 3,
        name: 'New York, NY',
        state: 'New York',
        slug: 'new-york',
        coords: [
            -74.006,
            40.7128
        ]
    },
    {
        id: 4,
        name: 'Los Angeles, CA',
        state: 'California',
        slug: 'los-angeles',
        coords: [
            -118.2437,
            34.0522
        ]
    },
    {
        id: 5,
        name: 'Chicago, IL',
        state: 'Illinois',
        slug: 'chicago',
        coords: [
            -87.6298,
            41.8781
        ]
    },
    {
        id: 6,
        name: 'Houston, TX',
        state: 'Texas',
        slug: 'houston',
        coords: [
            -95.3698,
            29.7604
        ]
    },
    {
        id: 7,
        name: 'Phoenix, AZ',
        state: 'Arizona',
        slug: 'phoenix',
        coords: [
            -112.074,
            33.4484
        ]
    },
    {
        id: 8,
        name: 'Philadelphia, PA',
        state: 'Pennsylvania',
        slug: 'philadelphia',
        coords: [
            -75.1652,
            39.9526
        ]
    },
    {
        id: 9,
        name: 'San Antonio, TX',
        state: 'Texas',
        slug: 'san-antonio',
        coords: [
            -98.4936,
            29.4241
        ]
    },
    {
        id: 10,
        name: 'San Diego, CA',
        state: 'California',
        slug: 'san-diego',
        coords: [
            -117.1611,
            32.7157
        ]
    },
    {
        id: 11,
        name: 'Dallas, TX',
        state: 'Texas',
        slug: 'dallas',
        coords: [
            -96.797,
            32.7767
        ]
    }
];
function CitySelector() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [selectedCity, setSelectedCity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const filteredCities = query === '' ? cities : cities.filter((city)=>{
        return city.name.toLowerCase().includes(query.toLowerCase());
    });
    const handleCitySelect = (city)=>{
        setSelectedCity(city);
    };
    const handleGoToDashboard = ()=>{
        if (selectedCity) {
            // Store city data in localStorage for the dashboard
            localStorage.setItem('selectedCity', JSON.stringify(selectedCity));
            // Navigate to dashboard
            router.push(`/dashboard/${selectedCity.slug}`);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$combobox$2f$combobox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Combobox"], {
                value: selectedCity,
                onChange: handleCitySelect,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-gray-400 mb-2",
                            children: "Search for your city and enter"
                        }, void 0, false, {
                            fileName: "[project]/components/CitySelector.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$combobox$2f$combobox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Combobox"].Input, {
                            className: "w-full rounded-xl border-2 border-gray-700 bg-gray-900/80 backdrop-blur-md py-4 pl-6 pr-12 text-lg font-medium text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                            placeholder: "Type city name...",
                            displayValue: (city)=>city?.name ?? '',
                            onChange: (event)=>setQuery(event.target.value)
                        }, void 0, false, {
                            fileName: "[project]/components/CitySelector.tsx",
                            lineNumber: 56,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$combobox$2f$combobox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Combobox"].Button, {
                            className: "absolute inset-y-0 right-0 flex items-center pr-4 top-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "h-5 w-5 text-gray-400",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M19 9l-7 7-7-7"
                                }, void 0, false, {
                                    fileName: "[project]/components/CitySelector.tsx",
                                    lineNumber: 69,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/CitySelector.tsx",
                                lineNumber: 63,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/CitySelector.tsx",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$combobox$2f$combobox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Combobox"].Options, {
                            className: "absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-gray-900 backdrop-blur-md border border-gray-800 py-2 shadow-2xl focus:outline-none",
                            children: filteredCities.length === 0 && query !== '' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative cursor-default select-none px-6 py-3 text-gray-400",
                                children: "No cities found."
                            }, void 0, false, {
                                fileName: "[project]/components/CitySelector.tsx",
                                lineNumber: 80,
                                columnNumber: 15
                            }, this) : filteredCities.map((city)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$combobox$2f$combobox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Combobox"].Option, {
                                    value: city,
                                    className: ({ active })=>`relative cursor-pointer select-none py-3 pl-6 pr-4 transition-colors ${active ? 'bg-blue-500/20 text-white' : 'text-gray-300'}`,
                                    children: ({ selected, active })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `block font-medium ${selected ? 'font-semibold text-white' : ''}`,
                                                            children: city.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CitySelector.tsx",
                                                            lineNumber: 97,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `block text-sm ${active ? 'text-blue-300' : 'text-gray-500'}`,
                                                            children: city.state
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CitySelector.tsx",
                                                            lineNumber: 100,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CitySelector.tsx",
                                                    lineNumber: 96,
                                                    columnNumber: 23
                                                }, this),
                                                selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "h-5 w-5 text-blue-400",
                                                    fill: "currentColor",
                                                    viewBox: "0 0 20 20",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        fillRule: "evenodd",
                                                        d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                                                        clipRule: "evenodd"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CitySelector.tsx",
                                                        lineNumber: 114,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CitySelector.tsx",
                                                    lineNumber: 109,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CitySelector.tsx",
                                            lineNumber: 95,
                                            columnNumber: 21
                                        }, this)
                                }, city.id, false, {
                                    fileName: "[project]/components/CitySelector.tsx",
                                    lineNumber: 85,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/CitySelector.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/CitySelector.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/CitySelector.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleGoToDashboard,
                disabled: !selectedCity,
                className: `w-full py-4 px-6 rounded-xl font-semibold text-lg text-white transition-all duration-300 ${selectedCity ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30' : 'bg-gray-800 opacity-50 cursor-not-allowed'}`,
                children: selectedCity ? `Explore ${selectedCity.name} →` : 'Select a city to continue'
            }, void 0, false, {
                fileName: "[project]/components/CitySelector.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/CitySelector.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8caaebf5._.js.map