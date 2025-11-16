(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/AnimatedGlobe.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AnimatedGlobe
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function AnimatedGlobe() {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const animationRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    const rotationRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const dotsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const connectionsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AnimatedGlobe.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            // Set canvas size
            const resizeCanvas = {
                "AnimatedGlobe.useEffect.resizeCanvas": ()=>{
                    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
                    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
                    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
                }
            }["AnimatedGlobe.useEffect.resizeCanvas"];
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            const width = canvas.offsetWidth;
            const height = canvas.offsetHeight;
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) * 0.45;
            // Initialize dots
            const initializeDots = {
                "AnimatedGlobe.useEffect.initializeDots": ()=>{
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
                }
            }["AnimatedGlobe.useEffect.initializeDots"];
            dotsRef.current = initializeDots();
            const networkStartTime = Date.now();
            // Animation loop
            const animate = {
                "AnimatedGlobe.useEffect.animate": ()=>{
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
                    continentGlows.forEach({
                        "AnimatedGlobe.useEffect.animate": ({ x, y, size })=>{
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
                        }
                    }["AnimatedGlobe.useEffect.animate"]);
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
                    dotsRef.current.forEach({
                        "AnimatedGlobe.useEffect.animate": (dot, index)=>{
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
                        }
                    }["AnimatedGlobe.useEffect.animate"]);
                    // Create new connections from active dots to nearby inactive dots
                    const activeDots = dotsRef.current.map({
                        "AnimatedGlobe.useEffect.animate.activeDots": (dot, index)=>({
                                dot,
                                index
                            })
                    }["AnimatedGlobe.useEffect.animate.activeDots"]).filter({
                        "AnimatedGlobe.useEffect.animate.activeDots": ({ dot })=>dot.active
                    }["AnimatedGlobe.useEffect.animate.activeDots"]);
                    activeDots.forEach({
                        "AnimatedGlobe.useEffect.animate": ({ dot: activeDot, index: activeIndex })=>{
                            // Randomly create connections from this active dot
                            if (Math.random() < 0.03) {
                                // Find nearby inactive dots
                                const inactiveDots = dotsRef.current.map({
                                    "AnimatedGlobe.useEffect.animate.inactiveDots": (dot, index)=>({
                                            dot,
                                            index
                                        })
                                }["AnimatedGlobe.useEffect.animate.inactiveDots"]).filter({
                                    "AnimatedGlobe.useEffect.animate.inactiveDots": ({ dot, index })=>!dot.active && index !== activeIndex
                                }["AnimatedGlobe.useEffect.animate.inactiveDots"]).map({
                                    "AnimatedGlobe.useEffect.animate.inactiveDots": ({ dot, index })=>{
                                        const dx = dot.x - activeDot.x;
                                        const dy = dot.y - activeDot.y;
                                        const distance = Math.sqrt(dx * dx + dy * dy);
                                        return {
                                            dot,
                                            index,
                                            distance
                                        };
                                    }
                                }["AnimatedGlobe.useEffect.animate.inactiveDots"]).sort({
                                    "AnimatedGlobe.useEffect.animate.inactiveDots": (a, b)=>a.distance - b.distance
                                }["AnimatedGlobe.useEffect.animate.inactiveDots"]).slice(0, 5); // Get 5 closest dots
                                if (inactiveDots.length > 0) {
                                    const target = inactiveDots[Math.floor(Math.random() * inactiveDots.length)];
                                    // Check if connection doesn't already exist
                                    const connectionExists = connectionsRef.current.some({
                                        "AnimatedGlobe.useEffect.animate.connectionExists": (conn)=>conn.fromIndex === activeIndex && conn.toIndex === target.index
                                    }["AnimatedGlobe.useEffect.animate.connectionExists"]);
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
                        }
                    }["AnimatedGlobe.useEffect.animate"]);
                    // Update and draw connections
                    connectionsRef.current = connectionsRef.current.filter({
                        "AnimatedGlobe.useEffect.animate": (connection)=>{
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
                        }
                    }["AnimatedGlobe.useEffect.animate"]);
                    animationRef.current = requestAnimationFrame(animate);
                }
            }["AnimatedGlobe.useEffect.animate"];
            animate();
            return ({
                "AnimatedGlobe.useEffect": ()=>{
                    window.removeEventListener('resize', resizeCanvas);
                    if (animationRef.current) {
                        cancelAnimationFrame(animationRef.current);
                    }
                }
            })["AnimatedGlobe.useEffect"];
        }
    }["AnimatedGlobe.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
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
_s(AnimatedGlobe, "JNXBIWS7GHwZeYOpAhZG2cRb/rM=");
_c = AnimatedGlobe;
var _c;
__turbopack_context__.k.register(_c, "AnimatedGlobe");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/CitySelector.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CitySelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$combobox$2f$combobox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@headlessui/react/dist/components/combobox/combobox.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// US States data
const states = [
    {
        id: 1,
        name: 'Alabama',
        slug: 'alabama',
        coords: [
            -86.9023,
            32.3182
        ],
        type: 'state'
    },
    {
        id: 2,
        name: 'Alaska',
        slug: 'alaska',
        coords: [
            -152.4044,
            61.3707
        ],
        type: 'state'
    },
    {
        id: 3,
        name: 'Arizona',
        slug: 'arizona',
        coords: [
            -111.0937,
            33.7298
        ],
        type: 'state'
    },
    {
        id: 4,
        name: 'Arkansas',
        slug: 'arkansas',
        coords: [
            -92.3731,
            34.9697
        ],
        type: 'state'
    },
    {
        id: 5,
        name: 'California',
        slug: 'california',
        coords: [
            -119.4179,
            36.7783
        ],
        type: 'state'
    },
    {
        id: 6,
        name: 'Colorado',
        slug: 'colorado',
        coords: [
            -105.7821,
            39.5501
        ],
        type: 'state'
    },
    {
        id: 7,
        name: 'Connecticut',
        slug: 'connecticut',
        coords: [
            -72.7554,
            41.5978
        ],
        type: 'state'
    },
    {
        id: 8,
        name: 'Delaware',
        slug: 'delaware',
        coords: [
            -75.5071,
            39.3185
        ],
        type: 'state'
    },
    {
        id: 9,
        name: 'Florida',
        slug: 'florida',
        coords: [
            -81.5158,
            27.7663
        ],
        type: 'state'
    },
    {
        id: 10,
        name: 'Georgia',
        slug: 'georgia',
        coords: [
            -83.5007,
            32.9866
        ],
        type: 'state'
    },
    {
        id: 11,
        name: 'Hawaii',
        slug: 'hawaii',
        coords: [
            -157.4983,
            21.0943
        ],
        type: 'state'
    },
    {
        id: 12,
        name: 'Idaho',
        slug: 'idaho',
        coords: [
            -114.4788,
            44.2405
        ],
        type: 'state'
    },
    {
        id: 13,
        name: 'Illinois',
        slug: 'illinois',
        coords: [
            -88.9937,
            40.3495
        ],
        type: 'state'
    },
    {
        id: 14,
        name: 'Indiana',
        slug: 'indiana',
        coords: [
            -86.2816,
            39.8494
        ],
        type: 'state'
    },
    {
        id: 15,
        name: 'Iowa',
        slug: 'iowa',
        coords: [
            -93.0977,
            42.0115
        ],
        type: 'state'
    },
    {
        id: 16,
        name: 'Kansas',
        slug: 'kansas',
        coords: [
            -96.7265,
            38.5266
        ],
        type: 'state'
    },
    {
        id: 17,
        name: 'Kentucky',
        slug: 'kentucky',
        coords: [
            -84.6701,
            37.6681
        ],
        type: 'state'
    },
    {
        id: 18,
        name: 'Louisiana',
        slug: 'louisiana',
        coords: [
            -91.8749,
            31.1695
        ],
        type: 'state'
    },
    {
        id: 19,
        name: 'Maine',
        slug: 'maine',
        coords: [
            -69.3819,
            44.6939
        ],
        type: 'state'
    },
    {
        id: 20,
        name: 'Maryland',
        slug: 'maryland',
        coords: [
            -76.6413,
            39.0639
        ],
        type: 'state'
    },
    {
        id: 21,
        name: 'Massachusetts',
        slug: 'massachusetts',
        coords: [
            -71.5301,
            42.2302
        ],
        type: 'state'
    },
    {
        id: 22,
        name: 'Michigan',
        slug: 'michigan',
        coords: [
            -84.5361,
            43.3266
        ],
        type: 'state'
    },
    {
        id: 23,
        name: 'Minnesota',
        slug: 'minnesota',
        coords: [
            -93.9196,
            45.6945
        ],
        type: 'state'
    },
    {
        id: 24,
        name: 'Mississippi',
        slug: 'mississippi',
        coords: [
            -89.6787,
            32.7416
        ],
        type: 'state'
    },
    {
        id: 25,
        name: 'Missouri',
        slug: 'missouri',
        coords: [
            -92.2896,
            38.4561
        ],
        type: 'state'
    },
    {
        id: 26,
        name: 'Montana',
        slug: 'montana',
        coords: [
            -110.3626,
            46.9219
        ],
        type: 'state'
    },
    {
        id: 27,
        name: 'Nebraska',
        slug: 'nebraska',
        coords: [
            -99.9018,
            41.1254
        ],
        type: 'state'
    },
    {
        id: 28,
        name: 'Nevada',
        slug: 'nevada',
        coords: [
            -117.0554,
            38.3135
        ],
        type: 'state'
    },
    {
        id: 29,
        name: 'New Hampshire',
        slug: 'new-hampshire',
        coords: [
            -71.5639,
            43.4525
        ],
        type: 'state'
    },
    {
        id: 30,
        name: 'New Jersey',
        slug: 'new-jersey',
        coords: [
            -74.5210,
            40.2989
        ],
        type: 'state'
    },
    {
        id: 31,
        name: 'New Mexico',
        slug: 'new-mexico',
        coords: [
            -106.2371,
            34.8405
        ],
        type: 'state'
    },
    {
        id: 32,
        name: 'New York',
        slug: 'new-york-state',
        coords: [
            -74.2179,
            42.1657
        ],
        type: 'state'
    },
    {
        id: 33,
        name: 'North Carolina',
        slug: 'north-carolina',
        coords: [
            -79.8431,
            35.6301
        ],
        type: 'state'
    },
    {
        id: 34,
        name: 'North Dakota',
        slug: 'north-dakota',
        coords: [
            -99.7840,
            47.5289
        ],
        type: 'state'
    },
    {
        id: 35,
        name: 'Ohio',
        slug: 'ohio',
        coords: [
            -82.7755,
            40.3888
        ],
        type: 'state'
    },
    {
        id: 36,
        name: 'Oklahoma',
        slug: 'oklahoma',
        coords: [
            -96.9289,
            35.5653
        ],
        type: 'state'
    },
    {
        id: 37,
        name: 'Oregon',
        slug: 'oregon',
        coords: [
            -122.0709,
            44.5720
        ],
        type: 'state'
    },
    {
        id: 38,
        name: 'Pennsylvania',
        slug: 'pennsylvania',
        coords: [
            -77.1945,
            40.5908
        ],
        type: 'state'
    },
    {
        id: 39,
        name: 'Rhode Island',
        slug: 'rhode-island',
        coords: [
            -71.5118,
            41.6809
        ],
        type: 'state'
    },
    {
        id: 40,
        name: 'South Carolina',
        slug: 'south-carolina',
        coords: [
            -80.9066,
            33.8569
        ],
        type: 'state'
    },
    {
        id: 41,
        name: 'South Dakota',
        slug: 'south-dakota',
        coords: [
            -99.4388,
            44.2998
        ],
        type: 'state'
    },
    {
        id: 42,
        name: 'Tennessee',
        slug: 'tennessee',
        coords: [
            -86.6923,
            35.7478
        ],
        type: 'state'
    },
    {
        id: 43,
        name: 'Texas',
        slug: 'texas',
        coords: [
            -97.5631,
            31.0545
        ],
        type: 'state'
    },
    {
        id: 44,
        name: 'Utah',
        slug: 'utah',
        coords: [
            -111.8910,
            40.1500
        ],
        type: 'state'
    },
    {
        id: 45,
        name: 'Vermont',
        slug: 'vermont',
        coords: [
            -72.7107,
            44.0459
        ],
        type: 'state'
    },
    {
        id: 46,
        name: 'Virginia',
        slug: 'virginia',
        coords: [
            -78.1690,
            37.7693
        ],
        type: 'state'
    },
    {
        id: 47,
        name: 'Washington',
        slug: 'washington',
        coords: [
            -121.4905,
            47.4009
        ],
        type: 'state'
    },
    {
        id: 48,
        name: 'West Virginia',
        slug: 'west-virginia',
        coords: [
            -80.9545,
            38.4912
        ],
        type: 'state'
    },
    {
        id: 49,
        name: 'Wisconsin',
        slug: 'wisconsin',
        coords: [
            -89.6165,
            44.2685
        ],
        type: 'state'
    },
    {
        id: 50,
        name: 'Wyoming',
        slug: 'wyoming',
        coords: [
            -107.3025,
            42.7559
        ],
        type: 'state'
    }
];
// Cities data
const cities = [
    {
        id: 51,
        name: 'Atlanta',
        state: 'Georgia',
        slug: 'atlanta',
        coords: [
            -84.388,
            33.749
        ],
        type: 'city'
    },
    {
        id: 52,
        name: 'Madison County',
        state: 'Florida',
        slug: 'madison-county-fl',
        coords: [
            -83.4446,
            30.4694
        ],
        type: 'city'
    },
    {
        id: 53,
        name: 'New York',
        state: 'New York',
        slug: 'new-york',
        coords: [
            -74.006,
            40.7128
        ],
        type: 'city'
    },
    {
        id: 54,
        name: 'Los Angeles',
        state: 'California',
        slug: 'los-angeles',
        coords: [
            -118.2437,
            34.0522
        ],
        type: 'city'
    },
    {
        id: 55,
        name: 'Chicago',
        state: 'Illinois',
        slug: 'chicago',
        coords: [
            -87.6298,
            41.8781
        ],
        type: 'city'
    },
    {
        id: 56,
        name: 'Houston',
        state: 'Texas',
        slug: 'houston',
        coords: [
            -95.3698,
            29.7604
        ],
        type: 'city'
    },
    {
        id: 57,
        name: 'Phoenix',
        state: 'Arizona',
        slug: 'phoenix',
        coords: [
            -112.074,
            33.4484
        ],
        type: 'city'
    },
    {
        id: 58,
        name: 'Philadelphia',
        state: 'Pennsylvania',
        slug: 'philadelphia',
        coords: [
            -75.1652,
            39.9526
        ],
        type: 'city'
    },
    {
        id: 59,
        name: 'San Antonio',
        state: 'Texas',
        slug: 'san-antonio',
        coords: [
            -98.4936,
            29.4241
        ],
        type: 'city'
    },
    {
        id: 60,
        name: 'San Diego',
        state: 'California',
        slug: 'san-diego',
        coords: [
            -117.1611,
            32.7157
        ],
        type: 'city'
    },
    {
        id: 61,
        name: 'Dallas',
        state: 'Texas',
        slug: 'dallas',
        coords: [
            -96.797,
            32.7767
        ],
        type: 'city'
    }
];
function CitySelector() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [selectedLocation, setSelectedLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Combine states and cities into one searchable list
    const allLocations = [
        ...states,
        ...cities
    ];
    const filteredLocations = query === '' ? allLocations : allLocations.filter((location)=>{
        return location.name.toLowerCase().includes(query.toLowerCase());
    });
    const handleLocationSelect = (location)=>{
        setSelectedLocation(location);
    };
    const handleGoToDashboard = ()=>{
        if (selectedLocation) {
            // Store location data in localStorage for the dashboard
            localStorage.setItem('selectedCity', JSON.stringify(selectedLocation));
            // Navigate to dashboard
            router.push(`/dashboard/${selectedLocation.slug}`);
        }
    };
    const getDisplayName = (location)=>{
        if (!location) return '';
        if (location.type === 'city') {
            return `${location.name}, ${location.state}`;
        }
        return location.name;
    };
    const getSubtext = (location)=>{
        if (location.type === 'state') {
            return 'State';
        }
        return location.state;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$combobox$2f$combobox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Combobox"], {
                value: selectedLocation,
                onChange: handleLocationSelect,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-gray-400 mb-2",
                            children: "Search for your city or state"
                        }, void 0, false, {
                            fileName: "[project]/components/CitySelector.tsx",
                            lineNumber: 127,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$combobox$2f$combobox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Combobox"].Input, {
                            className: "w-full rounded-xl border-2 border-gray-700 bg-gray-900/80 backdrop-blur-md py-4 pl-6 pr-12 text-lg font-medium text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                            placeholder: "Type city or state name...",
                            displayValue: (location)=>getDisplayName(location),
                            onChange: (event)=>setQuery(event.target.value)
                        }, void 0, false, {
                            fileName: "[project]/components/CitySelector.tsx",
                            lineNumber: 130,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$combobox$2f$combobox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Combobox"].Button, {
                            className: "absolute inset-y-0 right-0 flex items-center pr-4 top-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "h-5 w-5 text-gray-400",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M19 9l-7 7-7-7"
                                }, void 0, false, {
                                    fileName: "[project]/components/CitySelector.tsx",
                                    lineNumber: 143,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/CitySelector.tsx",
                                lineNumber: 137,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/CitySelector.tsx",
                            lineNumber: 136,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$combobox$2f$combobox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Combobox"].Options, {
                            className: "absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-gray-900 backdrop-blur-md border border-gray-800 py-2 shadow-2xl focus:outline-none",
                            children: filteredLocations.length === 0 && query !== '' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative cursor-default select-none px-6 py-3 text-gray-400",
                                children: "No locations found."
                            }, void 0, false, {
                                fileName: "[project]/components/CitySelector.tsx",
                                lineNumber: 154,
                                columnNumber: 15
                            }, this) : filteredLocations.map((location)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$combobox$2f$combobox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Combobox"].Option, {
                                    value: location,
                                    className: ({ active })=>`relative cursor-pointer select-none py-3 pl-6 pr-4 transition-colors ${active ? 'bg-blue-500/20 text-white' : 'text-gray-300'}`,
                                    children: ({ selected, active })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `block font-medium ${selected ? 'font-semibold text-white' : ''}`,
                                                            children: location.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CitySelector.tsx",
                                                            lineNumber: 171,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `block text-sm ${active ? 'text-blue-300' : 'text-gray-500'}`,
                                                            children: getSubtext(location)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CitySelector.tsx",
                                                            lineNumber: 174,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CitySelector.tsx",
                                                    lineNumber: 170,
                                                    columnNumber: 23
                                                }, this),
                                                selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "h-5 w-5 text-blue-400",
                                                    fill: "currentColor",
                                                    viewBox: "0 0 20 20",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        fillRule: "evenodd",
                                                        d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                                                        clipRule: "evenodd"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CitySelector.tsx",
                                                        lineNumber: 188,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CitySelector.tsx",
                                                    lineNumber: 183,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CitySelector.tsx",
                                            lineNumber: 169,
                                            columnNumber: 21
                                        }, this)
                                }, location.id, false, {
                                    fileName: "[project]/components/CitySelector.tsx",
                                    lineNumber: 159,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/CitySelector.tsx",
                            lineNumber: 152,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/CitySelector.tsx",
                    lineNumber: 126,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/CitySelector.tsx",
                lineNumber: 125,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleGoToDashboard,
                disabled: !selectedLocation,
                className: `w-full py-4 px-6 rounded-xl font-semibold text-lg text-white transition-all duration-300 ${selectedLocation ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30' : 'bg-gray-800 opacity-50 cursor-not-allowed'}`,
                children: selectedLocation ? `Explore ${selectedLocation.name} →` : 'Select a location to continue'
            }, void 0, false, {
                fileName: "[project]/components/CitySelector.tsx",
                lineNumber: 205,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/CitySelector.tsx",
        lineNumber: 124,
        columnNumber: 5
    }, this);
}
_s(CitySelector, "ZVYEEoGutrwxK0ayxatha8LuD34=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = CitySelector;
var _c;
__turbopack_context__.k.register(_c, "CitySelector");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_285fd067._.js.map