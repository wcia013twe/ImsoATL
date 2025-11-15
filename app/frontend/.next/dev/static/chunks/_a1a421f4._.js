(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/DashboardHeader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function DashboardHeader({ onToggleChat, onToggleRecommendations, cityName }) {
    _s();
    const [darkMode, setDarkMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const toggleDarkMode = ()=>{
        setDarkMode(!darkMode);
    // You can add actual dark mode toggle logic here
    };
    const handleExport = (format)=>{
        console.log(`Exporting as ${format}...`);
    // Export logic will be implemented later
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "fixed top-0 left-0 right-0 z-50 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between px-6 py-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onToggleChat,
                            className: "flex items-center gap-2 px-4 py-2 rounded-lg bg-civic-blue text-white font-semibold hover:bg-civic-blue-600 transition-colors",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-5 h-5",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                    }, void 0, false, {
                                        fileName: "[project]/components/DashboardHeader.tsx",
                                        lineNumber: 36,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/DashboardHeader.tsx",
                                    lineNumber: 35,
                                    columnNumber: 13
                                }, this),
                                "Atlas"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/DashboardHeader.tsx",
                            lineNumber: 31,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-foreground",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold text-lg",
                                    children: cityName || 'Select a City'
                                }, void 0, false, {
                                    fileName: "[project]/components/DashboardHeader.tsx",
                                    lineNumber: 42,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-muted ml-2",
                                    children: "• WiFi Planning Dashboard"
                                }, void 0, false, {
                                    fileName: "[project]/components/DashboardHeader.tsx",
                                    lineNumber: 43,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/DashboardHeader.tsx",
                            lineNumber: 41,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/DashboardHeader.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        onToggleRecommendations && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onToggleRecommendations,
                            className: "flex items-center gap-2 px-4 py-2 rounded-lg bg-civic-green text-white font-semibold hover:bg-civic-green-600 transition-colors",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-5 h-5",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        }, void 0, false, {
                                            fileName: "[project]/components/DashboardHeader.tsx",
                                            lineNumber: 56,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        }, void 0, false, {
                                            fileName: "[project]/components/DashboardHeader.tsx",
                                            lineNumber: 57,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/DashboardHeader.tsx",
                                    lineNumber: 55,
                                    columnNumber: 15
                                }, this),
                                "Sites"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/DashboardHeader.tsx",
                            lineNumber: 51,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 mr-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm text-muted font-medium mr-2",
                                    children: "Export:"
                                }, void 0, false, {
                                    fileName: "[project]/components/DashboardHeader.tsx",
                                    lineNumber: 65,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleExport('pdf'),
                                    className: "px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-surface-hover transition-colors",
                                    children: "PDF"
                                }, void 0, false, {
                                    fileName: "[project]/components/DashboardHeader.tsx",
                                    lineNumber: 66,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleExport('csv'),
                                    className: "px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-surface-hover transition-colors",
                                    children: "CSV"
                                }, void 0, false, {
                                    fileName: "[project]/components/DashboardHeader.tsx",
                                    lineNumber: 72,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleExport('kml'),
                                    className: "px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-surface-hover transition-colors",
                                    children: "KML"
                                }, void 0, false, {
                                    fileName: "[project]/components/DashboardHeader.tsx",
                                    lineNumber: 78,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/DashboardHeader.tsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: toggleDarkMode,
                            className: "p-2 rounded-lg border border-border hover:bg-surface-hover transition-colors",
                            "aria-label": "Toggle dark mode",
                            children: darkMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-5 h-5 text-foreground",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                }, void 0, false, {
                                    fileName: "[project]/components/DashboardHeader.tsx",
                                    lineNumber: 94,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/DashboardHeader.tsx",
                                lineNumber: 93,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-5 h-5 text-foreground",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                }, void 0, false, {
                                    fileName: "[project]/components/DashboardHeader.tsx",
                                    lineNumber: 98,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/DashboardHeader.tsx",
                                lineNumber: 97,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/DashboardHeader.tsx",
                            lineNumber: 87,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/DashboardHeader.tsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/DashboardHeader.tsx",
            lineNumber: 28,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/DashboardHeader.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_s(DashboardHeader, "U9cQrERlY+h8pHe8i/lj95QawrI=");
_c = DashboardHeader;
var _c;
__turbopack_context__.k.register(_c, "DashboardHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ChatSidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const WEBSOCKET_URL = 'ws://localhost:8000/ws/chat';
const STORAGE_KEY = 'atlas-chat-messages';
const getInitialMessages = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Convert timestamp strings back to Date objects
            const messagesWithDates = parsed.map((msg)=>({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }));
            return messagesWithDates.length > 0 ? messagesWithDates : getDefaultMessages();
        }
    } catch (error) {
        console.error('Error loading chat messages:', error);
    }
    return getDefaultMessages();
};
const getDefaultMessages = ()=>[
        {
            id: '1',
            role: 'assistant',
            content: "Hi! I'm your WiFi planning assistant powered by multi-agent AI. I analyze Census demographics, FCC broadband data, and civic assets to recommend optimal deployment sites. Ask me anything!",
            timestamp: new Date()
        }
    ];
function ChatSidebar({ isOpen, onClose, cityName, onRecommendationsReceived }) {
    _s();
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(getInitialMessages);
    const [inputValue, setInputValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isProcessing, setIsProcessing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showSuggestions, setShowSuggestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [typingStep, setTypingStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const wsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const typingTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const suggestions = [
        "Where should we deploy WiFi for underserved students?",
        "Which areas have the worst broadband coverage gaps?",
        "Show me high-poverty neighborhoods without internet access",
        "Find the best sites near libraries and community centers"
    ];
    const scrollToBottom = ()=>{
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatSidebar.useEffect": ()=>{
            scrollToBottom();
        }
    }["ChatSidebar.useEffect"], [
        messages,
        typingStep
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatSidebar.useEffect": ()=>{
            if (isOpen && inputRef.current) {
                inputRef.current.focus();
            }
        }
    }["ChatSidebar.useEffect"], [
        isOpen
    ]);
    // Persist messages to localStorage whenever they change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatSidebar.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
                } catch (error) {
                    console.error('Error saving chat messages:', error);
                }
            }
        }
    }["ChatSidebar.useEffect"], [
        messages
    ]);
    const connectWebSocket = (userMessage)=>{
        const ws = new WebSocket(WEBSOCKET_URL);
        wsRef.current = ws;
        const processingMessageId = `processing-${Date.now()}`;
        ws.onopen = ()=>{
            console.log('WebSocket connected');
            // Create ONE processing message that will accumulate all steps
            const thinkingMessage = {
                id: processingMessageId,
                role: 'assistant',
                content: '🤔 Analyzing your request...',
                timestamp: new Date(),
                type: 'processing',
                agentSteps: [] // Initialize empty array for accumulation
            };
            setMessages((prev)=>[
                    ...prev,
                    thinkingMessage
                ]);
            // Send user message to backend
            ws.send(JSON.stringify({
                message: userMessage,
                city: cityName || 'Atlanta'
            }));
        };
        ws.onmessage = (event)=>{
            const data = JSON.parse(event.data);
            if (data.type === 'agent_step') {
                const agentStep = {
                    agent: data.agent || '',
                    action: data.action || '',
                    status: data.status || 'in_progress',
                    data: data.data
                };
                // UPDATE the existing processing message by accumulating steps
                setMessages((prev)=>prev.map((msg)=>{
                        if (msg.id === processingMessageId) {
                            const existingSteps = msg.agentSteps || [];
                            return {
                                ...msg,
                                agentSteps: [
                                    ...existingSteps,
                                    agentStep
                                ],
                                content: `processing-${Date.now()}`,
                                timestamp: new Date() // Update timestamp to force re-render
                            };
                        }
                        return msg;
                    }));
                // Show typing indicator for current agent
                setTypingStep({
                    agent: agentStep.agent,
                    action: agentStep.action,
                    status: agentStep.status
                });
            } else if (data.type === 'final_response') {
                // Clear typing indicator
                setTypingStep(null);
                // Replace processing message with final response
                setMessages((prev)=>prev.map((msg)=>msg.id === processingMessageId ? {
                            ...msg,
                            content: data.explanation || 'Analysis complete.',
                            type: 'final_response',
                            deploymentPlan: data.deployment_plan
                        } : msg));
                setIsProcessing(false);
                // Notify parent component of recommendations
                if (data.deployment_plan && onRecommendationsReceived) {
                    onRecommendationsReceived(data.deployment_plan);
                }
                ws.close();
            } else if (data.type === 'error') {
                // Clear typing indicator
                setTypingStep(null);
                // Replace processing message with error
                setMessages((prev)=>prev.map((msg)=>msg.id === processingMessageId ? {
                            ...msg,
                            content: `⚠️ Error: ${data.message || 'An error occurred'}`,
                            type: 'error'
                        } : msg));
                setIsProcessing(false);
                ws.close();
            }
        };
        ws.onerror = (error)=>{
            console.error('WebSocket error:', error);
            setTypingStep(null);
            const errorMessage = {
                id: Date.now().toString(),
                role: 'assistant',
                content: '⚠️ Connection error. Please make sure the backend server is running on port 8000.',
                timestamp: new Date(),
                type: 'error'
            };
            setMessages((prev)=>[
                    ...prev,
                    errorMessage
                ]);
            setIsProcessing(false);
        };
        ws.onclose = ()=>{
            console.log('WebSocket disconnected');
            wsRef.current = null;
        };
    };
    const handleSendMessage = async (text)=>{
        const messageText = text || inputValue.trim();
        if (!messageText || isProcessing) return;
        // Add user message
        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText,
            timestamp: new Date()
        };
        setMessages((prev)=>[
                ...prev,
                userMessage
            ]);
        setInputValue('');
        setShowSuggestions(false);
        setIsProcessing(true);
        // Connect to WebSocket and send message
        connectWebSocket(messageText);
    };
    const handleKeyPress = (e)=>{
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    const handleClearConversation = ()=>{
        if (confirm('Are you sure you want to clear the conversation history?')) {
            const defaultMessages = getDefaultMessages();
            setMessages(defaultMessages);
            setShowSuggestions(true);
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    };
    const getAgentIcon = (agentName)=>{
        if (agentName.includes('Query Parser')) return '🔍';
        if (agentName.includes('Census')) return '📊';
        if (agentName.includes('FCC')) return '📡';
        if (agentName.includes('Assets')) return '🏛️';
        if (agentName.includes('Synthesis')) return '🧠';
        if (agentName.includes('Ranking')) return '⚖️';
        if (agentName.includes('Explainer')) return '✨';
        return '🤖';
    };
    const isOrchestratorThinking = (step)=>{
        return step.agent.includes('Orchestrator') && step.status === 'completed';
    };
    const isProcessRunning = (step)=>{
        return step.status === 'in_progress' && !step.agent.includes('Orchestrator');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `fixed top-0 left-0 h-full w-[32rem] bg-surface border-r border-border z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col h-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between px-6 py-4 border-b border-border",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-2 h-2 rounded-full bg-civic-green animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ChatSidebar.tsx",
                                        lineNumber: 284,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-lg font-semibold text-foreground",
                                        children: "Multi-Agent AI Assistant"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ChatSidebar.tsx",
                                        lineNumber: 285,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ChatSidebar.tsx",
                                lineNumber: 283,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleClearConversation,
                                        className: "p-1 rounded-lg hover:bg-surface-hover transition-colors text-muted hover:text-foreground",
                                        title: "Clear conversation",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-5 h-5",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ChatSidebar.tsx",
                                                lineNumber: 294,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ChatSidebar.tsx",
                                            lineNumber: 293,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/ChatSidebar.tsx",
                                        lineNumber: 288,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: onClose,
                                        className: "p-1 rounded-lg hover:bg-surface-hover transition-colors text-muted hover:text-foreground",
                                        title: "Close chat",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-5 h-5",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M6 18L18 6M6 6l12 12"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ChatSidebar.tsx",
                                                lineNumber: 303,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ChatSidebar.tsx",
                                            lineNumber: 302,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/ChatSidebar.tsx",
                                        lineNumber: 297,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ChatSidebar.tsx",
                                lineNumber: 287,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ChatSidebar.tsx",
                        lineNumber: 282,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto px-6 py-4 space-y-4",
                        children: [
                            messages.map((message)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `max-w-[90%] rounded-2xl px-4 py-3 ${message.role === 'user' ? 'bg-civic-blue text-white' : message.type === 'agent_step' ? 'bg-surface-hover border border-border' : 'bg-surface-hover text-foreground border border-border'}`,
                                        children: [
                                            message.type === 'processing' && message.agentSteps && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "font-semibold text-muted mb-2",
                                                        children: "🤔 Analyzing your request..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ChatSidebar.tsx",
                                                        lineNumber: 328,
                                                        columnNumber: 23
                                                    }, this),
                                                    message.agentSteps.map((step, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start gap-2 pl-2 border-l-2 border-civic-blue/30",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "flex-shrink-0 mt-0.5",
                                                                    children: getAgentIcon(step.agent)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ChatSidebar.tsx",
                                                                    lineNumber: 331,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "font-semibold text-foreground flex items-center gap-2",
                                                                            children: [
                                                                                step.agent,
                                                                                step.status === 'in_progress' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                    className: "w-3 h-3 animate-spin text-civic-blue",
                                                                                    xmlns: "http://www.w3.org/2000/svg",
                                                                                    fill: "none",
                                                                                    viewBox: "0 0 24 24",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                                            className: "opacity-25",
                                                                                            cx: "12",
                                                                                            cy: "12",
                                                                                            r: "10",
                                                                                            stroke: "currentColor",
                                                                                            strokeWidth: "4"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/ChatSidebar.tsx",
                                                                                            lineNumber: 337,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                            className: "opacity-75",
                                                                                            fill: "currentColor",
                                                                                            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/ChatSidebar.tsx",
                                                                                            lineNumber: 338,
                                                                                            columnNumber: 35
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/ChatSidebar.tsx",
                                                                                    lineNumber: 336,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                step.status === 'completed' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-civic-green",
                                                                                    children: "✓"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/ChatSidebar.tsx",
                                                                                    lineNumber: 342,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/ChatSidebar.tsx",
                                                                            lineNumber: 333,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-accent mt-0.5",
                                                                            children: step.action
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ChatSidebar.tsx",
                                                                            lineNumber: 345,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/ChatSidebar.tsx",
                                                                    lineNumber: 332,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, idx, true, {
                                                            fileName: "[project]/components/ChatSidebar.tsx",
                                                            lineNumber: 330,
                                                            columnNumber: 25
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ChatSidebar.tsx",
                                                lineNumber: 327,
                                                columnNumber: 21
                                            }, this),
                                            message.type === 'agent_step' && message.agentSteps?.[0] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs flex items-start gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "flex-shrink-0 mt-0.5",
                                                        children: getAgentIcon(message.agentSteps[0].agent)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ChatSidebar.tsx",
                                                        lineNumber: 355,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "font-semibold text-foreground flex items-center gap-2",
                                                                children: [
                                                                    message.agentSteps[0].agent,
                                                                    isProcessRunning(message.agentSteps[0]) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        className: "w-3 h-3 animate-spin text-civic-blue",
                                                                        xmlns: "http://www.w3.org/2000/svg",
                                                                        fill: "none",
                                                                        viewBox: "0 0 24 24",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                                className: "opacity-25",
                                                                                cx: "12",
                                                                                cy: "12",
                                                                                r: "10",
                                                                                stroke: "currentColor",
                                                                                strokeWidth: "4"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ChatSidebar.tsx",
                                                                                lineNumber: 361,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                className: "opacity-75",
                                                                                fill: "currentColor",
                                                                                d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ChatSidebar.tsx",
                                                                                lineNumber: 362,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/ChatSidebar.tsx",
                                                                        lineNumber: 360,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    message.agentSteps[0].status === 'completed' && !isOrchestratorThinking(message.agentSteps[0]) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-civic-green",
                                                                        children: "✓"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ChatSidebar.tsx",
                                                                        lineNumber: 366,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ChatSidebar.tsx",
                                                                lineNumber: 357,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-accent mt-1",
                                                                children: [
                                                                    message.content,
                                                                    isOrchestratorThinking(message.agentSteps[0]) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "inline-flex ml-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "animate-[bounce_1s_infinite_0ms]",
                                                                                children: "."
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ChatSidebar.tsx",
                                                                                lineNumber: 373,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "animate-[bounce_1s_infinite_200ms]",
                                                                                children: "."
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ChatSidebar.tsx",
                                                                                lineNumber: 374,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "animate-[bounce_1s_infinite_400ms]",
                                                                                children: "."
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ChatSidebar.tsx",
                                                                                lineNumber: 375,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/ChatSidebar.tsx",
                                                                        lineNumber: 372,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ChatSidebar.tsx",
                                                                lineNumber: 369,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ChatSidebar.tsx",
                                                        lineNumber: 356,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ChatSidebar.tsx",
                                                lineNumber: 354,
                                                columnNumber: 21
                                            }, this),
                                            message.type !== "agent_step" && message.type !== "processing" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm leading-relaxed whitespace-pre-wrap",
                                                        children: message.content
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ChatSidebar.tsx",
                                                        lineNumber: 386,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `text-xs mt-2 block ${message.role === 'user' ? 'text-white/70' : 'text-muted'}`,
                                                        children: message.timestamp.toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ChatSidebar.tsx",
                                                        lineNumber: 388,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ChatSidebar.tsx",
                                        lineNumber: 316,
                                        columnNumber: 17
                                    }, this)
                                }, message.id, false, {
                                    fileName: "[project]/components/ChatSidebar.tsx",
                                    lineNumber: 312,
                                    columnNumber: 15
                                }, this)),
                            isProcessing && typingStep && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-start",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "max-w-[90%] bg-surface-hover border border-border rounded-2xl px-4 py-3",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs flex items-start gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex-shrink-0 mt-0.5",
                                                children: getAgentIcon(typingStep.agent)
                                            }, void 0, false, {
                                                fileName: "[project]/components/ChatSidebar.tsx",
                                                lineNumber: 404,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "font-semibold text-foreground",
                                                        children: typingStep.agent
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ChatSidebar.tsx",
                                                        lineNumber: 406,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-accent mt-1",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "inline-flex gap-0.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "animate-[bounce_1s_infinite_0ms]",
                                                                    children: "."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ChatSidebar.tsx",
                                                                    lineNumber: 409,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "animate-[bounce_1s_infinite_200ms]",
                                                                    children: "."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ChatSidebar.tsx",
                                                                    lineNumber: 410,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "animate-[bounce_1s_infinite_400ms]",
                                                                    children: "."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ChatSidebar.tsx",
                                                                    lineNumber: 411,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/ChatSidebar.tsx",
                                                            lineNumber: 408,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ChatSidebar.tsx",
                                                        lineNumber: 407,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ChatSidebar.tsx",
                                                lineNumber: 405,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ChatSidebar.tsx",
                                        lineNumber: 403,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ChatSidebar.tsx",
                                    lineNumber: 402,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/ChatSidebar.tsx",
                                lineNumber: 401,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: messagesEndRef
                            }, void 0, false, {
                                fileName: "[project]/components/ChatSidebar.tsx",
                                lineNumber: 420,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ChatSidebar.tsx",
                        lineNumber: 310,
                        columnNumber: 11
                    }, this),
                    showSuggestions && messages.length === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-6 pb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs font-semibold text-muted uppercase tracking-wider mb-3",
                                children: "Suggested Questions"
                            }, void 0, false, {
                                fileName: "[project]/components/ChatSidebar.tsx",
                                lineNumber: 426,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: suggestions.map((suggestion, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleSendMessage(suggestion),
                                        className: "w-full text-left px-3 py-2 rounded-lg border border-border text-sm text-accent hover:bg-surface-hover hover:text-foreground transition-colors",
                                        children: suggestion
                                    }, index, false, {
                                        fileName: "[project]/components/ChatSidebar.tsx",
                                        lineNumber: 431,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/ChatSidebar.tsx",
                                lineNumber: 429,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ChatSidebar.tsx",
                        lineNumber: 425,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-6 py-4 border-t border-border",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    ref: inputRef,
                                    type: "text",
                                    value: inputValue,
                                    onChange: (e)=>setInputValue(e.target.value),
                                    onKeyPress: handleKeyPress,
                                    placeholder: "Ask me about WiFi deployment...",
                                    disabled: isProcessing,
                                    className: "flex-1 px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-civic-blue focus:border-transparent disabled:opacity-50"
                                }, void 0, false, {
                                    fileName: "[project]/components/ChatSidebar.tsx",
                                    lineNumber: 446,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleSendMessage(),
                                    disabled: !inputValue.trim() || isProcessing,
                                    className: "px-4 py-3 rounded-xl bg-civic-blue text-white font-semibold hover:bg-civic-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-5 h-5",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ChatSidebar.tsx",
                                            lineNumber: 462,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/ChatSidebar.tsx",
                                        lineNumber: 461,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ChatSidebar.tsx",
                                    lineNumber: 456,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ChatSidebar.tsx",
                            lineNumber: 445,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ChatSidebar.tsx",
                        lineNumber: 444,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ChatSidebar.tsx",
                lineNumber: 280,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/ChatSidebar.tsx",
            lineNumber: 275,
            columnNumber: 7
        }, this)
    }, void 0, false);
}
_s(ChatSidebar, "nAo3fS5CVW/jWfBsYzE6RRNvtk8=");
_c = ChatSidebar;
var _c;
__turbopack_context__.k.register(_c, "ChatSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/mapbox-config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mapbox Configuration
 * Layer definitions, styles, and data sources
 */ __turbopack_context__.s([
    "LAYER_GROUPS",
    ()=>LAYER_GROUPS,
    "MAPBOX_CONFIG",
    ()=>MAPBOX_CONFIG,
    "MAP_LAYERS",
    ()=>MAP_LAYERS
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const MAPBOX_CONFIG = {
    accessToken: ("TURBOPACK compile-time value", "pk.eyJ1Ijoid2NpYTAxM3R3ZSIsImEiOiJjbWh6cGs4eTcwYzZ5MmtvZ3dwazkyanE1In0.TRUv2-43Kzchqrn57tWzKQ") || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_MAPBOX || '',
    defaultStyle: 'mapbox://styles/mapbox/light-v11',
    atlantaCenter: {
        lng: -84.388,
        lat: 33.749,
        zoom: 10.5
    }
};
const MAP_LAYERS = {
    // Atlanta city boundary
    atlantaBoundary: {
        id: 'atlanta-boundary',
        type: 'line',
        source: 'atlanta-boundary',
        paint: {
            'line-color': '#2691FF',
            'line-width': 3,
            'line-opacity': 0.8
        }
    },
    // Census heat map - poverty rate
    censusPoverty: {
        id: 'census-poverty',
        type: 'fill',
        source: 'census-poverty',
        paint: {
            'fill-color': [
                'interpolate',
                [
                    'linear'
                ],
                [
                    'get',
                    'poverty_rate'
                ],
                0,
                '#E8F8F3',
                10,
                '#A3E3CF',
                20,
                '#47C79F',
                30,
                '#19B987',
                40,
                '#0F6F51'
            ],
            'fill-opacity': 0.6
        }
    },
    // Census heat map - internet access
    censusInternet: {
        id: 'census-internet',
        type: 'fill',
        source: 'census-internet',
        paint: {
            'fill-color': [
                'interpolate',
                [
                    'linear'
                ],
                [
                    'get',
                    'no_internet_pct'
                ],
                0,
                '#E8F4FF',
                10,
                '#A8D3FF',
                20,
                '#51A7FF',
                30,
                '#2691FF',
                40,
                '#0058B3'
            ],
            'fill-opacity': 0.6
        }
    },
    // FCC broadband coverage
    fccBroadband: {
        id: 'fcc-broadband',
        type: 'fill',
        source: 'fcc-broadband',
        paint: {
            'fill-color': [
                'match',
                [
                    'get',
                    'has_coverage'
                ],
                true,
                '#19B987',
                false,
                '#FFB84D',
                '#6B7280'
            ],
            'fill-opacity': 0.4
        }
    },
    // Local assets - libraries
    libraries: {
        id: 'libraries',
        type: 'circle',
        source: 'libraries',
        paint: {
            'circle-radius': 8,
            'circle-color': '#7C3AED',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#FFFFFF'
        }
    },
    // Local assets - community centers
    communityCenters: {
        id: 'community-centers',
        type: 'circle',
        source: 'community-centers',
        paint: {
            'circle-radius': 8,
            'circle-color': '#DC2626',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#FFFFFF'
        }
    },
    // Local assets - transit stops
    transitStops: {
        id: 'transit-stops',
        type: 'circle',
        source: 'transit-stops',
        paint: {
            'circle-radius': 6,
            'circle-color': '#7DBDFF',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#FFFFFF'
        }
    },
    // Candidate WiFi sites
    candidateSites: {
        id: 'candidate-sites',
        type: 'circle',
        source: 'candidate-sites',
        paint: {
            'circle-radius': 12,
            'circle-color': '#2691FF',
            'circle-stroke-width': 3,
            'circle-stroke-color': '#FFFFFF'
        }
    },
    // Existing WiFi coverage
    existingWifi: {
        id: 'existing-wifi',
        type: 'circle',
        source: 'existing-wifi',
        paint: {
            'circle-radius': 10,
            'circle-color': '#6B7280',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#FFFFFF',
            'circle-opacity': 0.7
        }
    }
};
const LAYER_GROUPS = {
    'Census Data': [
        'census-poverty',
        'census-internet'
    ],
    'FCC Coverage': [
        'fcc-broadband'
    ],
    'Local Assets': [
        'libraries',
        'community-centers',
        'transit-stops'
    ],
    'WiFi Sites': [
        'candidate-sites',
        'existing-wifi'
    ],
    'Boundaries': [
        'atlanta-boundary'
    ]
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/MapLayerControl.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MapLayerControl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function MapLayerControl({ layers, activeLayers, onToggle }) {
    _s();
    const [isExpanded, setIsExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute top-4 right-4 bg-surface rounded-lg shadow-lg max-w-xs z-10 border border-border",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between px-4 py-3 border-b border-border",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-sm font-semibold text-foreground",
                        children: "Map Layers"
                    }, void 0, false, {
                        fileName: "[project]/components/MapLayerControl.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setIsExpanded(!isExpanded),
                        className: "p-1 rounded-lg hover:bg-surface-hover transition-colors text-muted hover:text-foreground",
                        title: isExpanded ? 'Hide map key' : 'Show map key',
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: `w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`,
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M19 9l-7 7-7-7"
                            }, void 0, false, {
                                fileName: "[project]/components/MapLayerControl.tsx",
                                lineNumber: 39,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/MapLayerControl.tsx",
                            lineNumber: 33,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/MapLayerControl.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/MapLayerControl.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 space-y-2",
                children: layers.map((layer)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onToggle(layer.id),
                        className: "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-surface-hover",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-4 h-4 rounded shrink-0 border-2",
                                style: {
                                    backgroundColor: activeLayers.includes(layer.id) ? layer.color : 'transparent',
                                    borderColor: layer.color
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/MapLayerControl.tsx",
                                lineNumber: 53,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 text-left",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm font-medium text-foreground",
                                        children: layer.label
                                    }, void 0, false, {
                                        fileName: "[project]/components/MapLayerControl.tsx",
                                        lineNumber: 61,
                                        columnNumber: 17
                                    }, this),
                                    layer.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-muted",
                                        children: layer.description
                                    }, void 0, false, {
                                        fileName: "[project]/components/MapLayerControl.tsx",
                                        lineNumber: 63,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/MapLayerControl.tsx",
                                lineNumber: 60,
                                columnNumber: 15
                            }, this)
                        ]
                    }, layer.id, true, {
                        fileName: "[project]/components/MapLayerControl.tsx",
                        lineNumber: 48,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/MapLayerControl.tsx",
                lineNumber: 46,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/MapLayerControl.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_s(MapLayerControl, "MzqrZ0LJxgqPa6EOF1Vxw0pgYA4=");
_c = MapLayerControl;
var _c;
__turbopack_context__.k.register(_c, "MapLayerControl");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/InteractiveMap.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>InteractiveMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mapbox-gl/dist/mapbox-gl.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mapbox$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mapbox-config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MapLayerControl$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/MapLayerControl.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
// Mock data sources - replace with real data in backend integration
const MOCK_DATA = {
    atlantaBoundary: {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        [
                            [
                                -84.55,
                                33.65
                            ],
                            [
                                -84.55,
                                33.89
                            ],
                            [
                                -84.29,
                                33.89
                            ],
                            [
                                -84.29,
                                33.65
                            ],
                            [
                                -84.55,
                                33.65
                            ]
                        ]
                    ]
                },
                properties: {}
            }
        ]
    },
    libraries: {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [
                        -84.408,
                        33.749
                    ]
                },
                properties: {
                    name: "Central Library",
                    type: "library"
                }
            },
            {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [
                        -84.428,
                        33.738
                    ]
                },
                properties: {
                    name: "Southwest Library",
                    type: "library"
                }
            }
        ]
    },
    candidateSites: {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [
                        -84.408,
                        33.755
                    ]
                },
                properties: {
                    name: "Candidate Site 1",
                    reach: 2200,
                    equityScore: 9.2
                }
            }
        ]
    }
};
const LAYER_CONFIG = [
    {
        id: "city-boundary",
        label: "City Boundary",
        color: "#2691FF"
    },
    {
        id: "census-poverty",
        label: "Poverty Rate",
        color: "#19B987",
        description: "Census tract poverty data"
    },
    {
        id: "census-internet",
        label: "Internet Access",
        color: "#2691FF",
        description: "Households without internet"
    },
    {
        id: "fcc-broadband",
        label: "FCC Coverage",
        color: "#FFB84D",
        description: "Federal broadband data"
    },
    {
        id: "libraries",
        label: "Libraries",
        color: "#7C3AED"
    },
    {
        id: "community-centers",
        label: "Community Centers",
        color: "#DC2626"
    },
    {
        id: "transit-stops",
        label: "Transit Stops",
        color: "#7DBDFF"
    },
    {
        id: "candidate-sites",
        label: "Candidate Sites",
        color: "#2691FF"
    },
    {
        id: "existing-wifi",
        label: "Existing WiFi",
        color: "#6B7280"
    }
];
function InteractiveMap({ cityCenter, cityName, citySlug, recommendations, mapRefProp }) {
    _s();
    const mapContainer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [activeLayers, setActiveLayers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        "city-boundary",
        "libraries",
        "candidate-sites"
    ]);
    const [mapLoaded, setMapLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [siteCoordinates, setSiteCoordinates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Use provided city coordinates or default to Atlanta
    const mapCenter = cityCenter || [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mapbox$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MAPBOX_CONFIG"].atlantaCenter.lng,
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mapbox$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MAPBOX_CONFIG"].atlantaCenter.lat
    ];
    const mapZoom = cityCenter ? 11.5 : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mapbox$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MAPBOX_CONFIG"].atlantaCenter.zoom;
    const boundarySlug = citySlug || "atlanta";
    // Expose methods via ref
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InteractiveMap.useEffect": ()=>{
            if (mapRefProp) {
                mapRefProp.current = {
                    showRecommendations: ({
                        "InteractiveMap.useEffect": (plan)=>{
                            // Handle showing recommendations
                            console.log('Show recommendations:', plan);
                        }
                    })["InteractiveMap.useEffect"],
                    centerOnSite: ({
                        "InteractiveMap.useEffect": (siteIndex)=>{
                            if (siteCoordinates[siteIndex] && map.current && recommendations) {
                                const coords = siteCoordinates[siteIndex];
                                const site = recommendations.recommended_sites[siteIndex];
                                // Fly to the site location
                                map.current.flyTo({
                                    center: coords,
                                    zoom: 14,
                                    duration: 1000,
                                    essential: true
                                });
                                // Open popup after a short delay to ensure map has centered
                                setTimeout({
                                    "InteractiveMap.useEffect": ()=>{
                                        if (!map.current) return;
                                        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Popup().setLngLat(coords).setHTML(`
                  <div style="font-family: system-ui; padding: 4px;">
                    <strong style="color: #1f2937; font-size: 14px;">${site.name || `Site ${siteIndex + 1}`}</strong><br/>
                    <div style="margin-top: 8px; font-size: 12px; color: #6b7280;">
                      <div><strong>Score:</strong> ${site.composite_score}/100</div>
                      <div><strong>Poverty Rate:</strong> ${site.poverty_rate}%</div>
                      <div><strong>No Internet:</strong> ${site.no_internet_pct}%</div>
                      <div><strong>Priority:</strong> ${site.recommendation_tier}</div>
                    </div>
                  </div>
                `).addTo(map.current);
                                    }
                                }["InteractiveMap.useEffect"], 500);
                            }
                        }
                    })["InteractiveMap.useEffect"]
                };
            }
        }
    }["InteractiveMap.useEffect"], [
        mapRefProp,
        siteCoordinates,
        recommendations
    ]);
    // Initialize map
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InteractiveMap.useEffect": ()=>{
            if (!mapContainer.current || map.current) return;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].accessToken = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mapbox$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MAPBOX_CONFIG"].accessToken;
            map.current = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Map({
                container: mapContainer.current,
                style: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mapbox$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MAPBOX_CONFIG"].defaultStyle,
                center: mapCenter,
                zoom: mapZoom
            });
            map.current.on("load", {
                "InteractiveMap.useEffect": ()=>{
                    if (!map.current) return;
                    // Load pre-generated city boundary
                    fetch(`/data/cities/${boundarySlug}.json`).then({
                        "InteractiveMap.useEffect": (response)=>response.json()
                    }["InteractiveMap.useEffect"]).then({
                        "InteractiveMap.useEffect": (cityBoundary)=>{
                            if (!map.current) return;
                            console.log(`Loaded pre-generated ${boundarySlug} boundary`);
                            // Add city boundary source with pre-processed boundary
                            map.current.addSource("city-boundary", {
                                type: "geojson",
                                data: {
                                    type: "FeatureCollection",
                                    features: [
                                        cityBoundary
                                    ]
                                }
                            });
                            // Add the clean outer boundary layer
                            map.current.addLayer({
                                id: "city-boundary",
                                type: "line",
                                source: "city-boundary",
                                paint: {
                                    "line-color": "#2691FF",
                                    "line-width": 3,
                                    "line-opacity": 0.8
                                }
                            });
                            // Auto-zoom map to fit city boundary perfectly
                            const bounds = cityBoundary.properties.bounds;
                            if (bounds && bounds.length === 2) {
                                console.log(`Fitting map to ${boundarySlug} bounds:`, bounds);
                                map.current.fitBounds(bounds, {
                                    padding: 50,
                                    duration: 1000,
                                    maxZoom: 11.5
                                });
                            }
                            console.log(`${boundarySlug} boundary displayed successfully`);
                        }
                    }["InteractiveMap.useEffect"]).catch({
                        "InteractiveMap.useEffect": (error)=>{
                            console.error(`Error loading ${boundarySlug} boundary:`, error);
                            // Fallback to mock data if boundary file fails to load
                            if (map.current) {
                                map.current.addSource("city-boundary", {
                                    type: "geojson",
                                    data: MOCK_DATA.atlantaBoundary
                                });
                                map.current.addLayer({
                                    id: "city-boundary",
                                    type: "line",
                                    source: "city-boundary",
                                    paint: {
                                        "line-color": "#2691FF",
                                        "line-width": 3,
                                        "line-opacity": 0.8
                                    }
                                });
                            }
                        }
                    }["InteractiveMap.useEffect"]);
                    // Add other data sources
                    map.current.addSource("libraries", {
                        type: "geojson",
                        data: MOCK_DATA.libraries
                    });
                    map.current.addSource("candidate-sites", {
                        type: "geojson",
                        data: MOCK_DATA.candidateSites
                    });
                    // Add other layers
                    map.current.addLayer(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mapbox$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MAP_LAYERS"].libraries);
                    map.current.addLayer(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mapbox$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MAP_LAYERS"].candidateSites);
                    // Add click handlers for popups with centering
                    map.current.on("click", "libraries", {
                        "InteractiveMap.useEffect": (e)=>{
                            if (!map.current || !e.features || !e.features[0]) return;
                            const feature = e.features[0];
                            // Center map on clicked point
                            map.current.flyTo({
                                center: e.lngLat,
                                zoom: 14,
                                duration: 1000,
                                essential: true
                            });
                            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Popup().setLngLat(e.lngLat).setHTML(`<strong>${feature.properties?.name}</strong><br/>Type: Library`).addTo(map.current);
                        }
                    }["InteractiveMap.useEffect"]);
                    map.current.on("click", "candidate-sites", {
                        "InteractiveMap.useEffect": (e)=>{
                            if (!map.current || !e.features || !e.features[0]) return;
                            const feature = e.features[0];
                            // Center map on clicked point
                            map.current.flyTo({
                                center: e.lngLat,
                                zoom: 14,
                                duration: 1000,
                                essential: true
                            });
                            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Popup().setLngLat(e.lngLat).setHTML(`
            <strong>${feature.properties?.name}</strong><br/>
            Reach: ${feature.properties?.reach} residents<br/>
            Equity Score: ${feature.properties?.equityScore}
          `).addTo(map.current);
                        }
                    }["InteractiveMap.useEffect"]);
                    // Change cursor on hover
                    map.current.on("mouseenter", "libraries", {
                        "InteractiveMap.useEffect": ()=>{
                            if (map.current) map.current.getCanvas().style.cursor = "pointer";
                        }
                    }["InteractiveMap.useEffect"]);
                    map.current.on("mouseleave", "libraries", {
                        "InteractiveMap.useEffect": ()=>{
                            if (map.current) map.current.getCanvas().style.cursor = "";
                        }
                    }["InteractiveMap.useEffect"]);
                    setMapLoaded(true);
                }
            }["InteractiveMap.useEffect"]);
            return ({
                "InteractiveMap.useEffect": ()=>{
                    map.current?.remove();
                    map.current = null;
                }
            })["InteractiveMap.useEffect"];
        }
    }["InteractiveMap.useEffect"], [
        mapCenter,
        mapZoom
    ]);
    // Display recommendations when received
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InteractiveMap.useEffect": ()=>{
            if (!map.current || !mapLoaded || !recommendations) return;
            // Convert recommendations to GeoJSON features
            // Use city center as base with offsets for different sites
            const centerLng = cityCenter?.[0] || -84.388;
            const centerLat = cityCenter?.[1] || 33.749;
            // Store site coordinates for later reference
            const coordinates = [];
            const recommendedFeatures = recommendations.recommended_sites.map({
                "InteractiveMap.useEffect.recommendedFeatures": (site, index)=>{
                    const coords = [
                        centerLng + (index % 3 - 1) * 0.05,
                        centerLat + (Math.floor(index / 3) - 1) * 0.05
                    ];
                    coordinates.push(coords);
                    return {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: coords
                        },
                        properties: {
                            name: site.name || `Site ${index + 1}`,
                            composite_score: site.composite_score,
                            poverty_rate: site.poverty_rate,
                            no_internet_pct: site.no_internet_pct,
                            recommendation_tier: site.recommendation_tier
                        }
                    };
                }
            }["InteractiveMap.useEffect.recommendedFeatures"]);
            // Update state with site coordinates
            setSiteCoordinates(coordinates);
            const recommendationsGeoJSON = {
                type: "FeatureCollection",
                features: recommendedFeatures
            };
            // Add or update recommendations layer
            if (map.current.getSource("ai-recommendations")) {
                map.current.getSource("ai-recommendations").setData(recommendationsGeoJSON);
            } else {
                map.current.addSource("ai-recommendations", {
                    type: "geojson",
                    data: recommendationsGeoJSON
                });
                map.current.addLayer({
                    id: "ai-recommendations",
                    type: "circle",
                    source: "ai-recommendations",
                    paint: {
                        "circle-radius": 10,
                        "circle-color": [
                            "match",
                            [
                                "get",
                                "recommendation_tier"
                            ],
                            "top_priority",
                            "#DC2626",
                            "high_priority",
                            "#F59E0B",
                            "medium_priority",
                            "#3B82F6",
                            "#6B7280"
                        ],
                        "circle-stroke-width": 2,
                        "circle-stroke-color": "#fff"
                    }
                });
                // Add popup on click and center map
                map.current.on("click", "ai-recommendations", {
                    "InteractiveMap.useEffect": (e)=>{
                        if (!map.current || !e.features || !e.features[0]) return;
                        const feature = e.features[0];
                        const props = feature.properties;
                        // Center map on clicked point with smooth animation
                        map.current.flyTo({
                            center: e.lngLat,
                            zoom: 14,
                            duration: 1000,
                            essential: true
                        });
                        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Popup().setLngLat(e.lngLat).setHTML(`
            <div style="font-family: system-ui; padding: 4px;">
              <strong style="color: #1f2937; font-size: 14px;">${props?.name}</strong><br/>
              <div style="margin-top: 8px; font-size: 12px; color: #6b7280;">
                <div><strong>Score:</strong> ${props?.composite_score}/100</div>
                <div><strong>Poverty Rate:</strong> ${props?.poverty_rate}%</div>
                <div><strong>No Internet:</strong> ${props?.no_internet_pct}%</div>
                <div><strong>Priority:</strong> ${props?.recommendation_tier}</div>
              </div>
            </div>
          `).addTo(map.current);
                    }
                }["InteractiveMap.useEffect"]);
                map.current.on("mouseenter", "ai-recommendations", {
                    "InteractiveMap.useEffect": ()=>{
                        if (map.current) map.current.getCanvas().style.cursor = "pointer";
                    }
                }["InteractiveMap.useEffect"]);
                map.current.on("mouseleave", "ai-recommendations", {
                    "InteractiveMap.useEffect": ()=>{
                        if (map.current) map.current.getCanvas().style.cursor = "";
                    }
                }["InteractiveMap.useEffect"]);
            }
            // Enable the layer in active layers
            if (!activeLayers.includes("ai-recommendations")) {
                setActiveLayers({
                    "InteractiveMap.useEffect": (prev)=>[
                            ...prev,
                            "ai-recommendations"
                        ]
                }["InteractiveMap.useEffect"]);
            }
        }
    }["InteractiveMap.useEffect"], [
        recommendations,
        mapLoaded
    ]);
    // Toggle layer visibility
    const toggleLayer = (layerId)=>{
        if (!map.current || !mapLoaded) return;
        setActiveLayers((prev)=>{
            const isActive = prev.includes(layerId);
            const newLayers = isActive ? prev.filter((id)=>id !== layerId) : [
                ...prev,
                layerId
            ];
            // Update map layer visibility
            if (map.current?.getLayer(layerId)) {
                map.current.setLayoutProperty(layerId, "visibility", isActive ? "none" : "visible");
            }
            return newLayers;
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "w-full py-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto px-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "civic-card relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-semibold text-foreground mb-4",
                        children: cityName ? `${cityName} WiFi Network Map` : "Interactive Site Map"
                    }, void 0, false, {
                        fileName: "[project]/components/InteractiveMap.tsx",
                        lineNumber: 478,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative w-full rounded-lg overflow-hidden",
                        style: {
                            height: "600px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: mapContainer,
                                style: {
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    width: "100%",
                                    height: "100%"
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/InteractiveMap.tsx",
                                lineNumber: 487,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MapLayerControl$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                layers: LAYER_CONFIG,
                                activeLayers: activeLayers,
                                onToggle: toggleLayer
                            }, void 0, false, {
                                fileName: "[project]/components/InteractiveMap.tsx",
                                lineNumber: 501,
                                columnNumber: 13
                            }, this),
                            !__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mapbox$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MAPBOX_CONFIG"].accessToken && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-white p-6 rounded-lg max-w-md text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-medium text-gray-900 mb-2",
                                            children: "Mapbox API Key Required"
                                        }, void 0, false, {
                                            fileName: "[project]/components/InteractiveMap.tsx",
                                            lineNumber: 511,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-600",
                                            children: "Add NEXT_PUBLIC_MAPBOX_TOKEN to .env.local"
                                        }, void 0, false, {
                                            fileName: "[project]/components/InteractiveMap.tsx",
                                            lineNumber: 514,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/InteractiveMap.tsx",
                                    lineNumber: 510,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/InteractiveMap.tsx",
                                lineNumber: 509,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/InteractiveMap.tsx",
                        lineNumber: 483,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 grid grid-cols-3 gap-4 text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-medium text-foreground mb-2",
                                        children: "Census Data"
                                    }, void 0, false, {
                                        fileName: "[project]/components/InteractiveMap.tsx",
                                        lineNumber: 525,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-4 h-4 rounded bg-[#19B987]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/InteractiveMap.tsx",
                                                        lineNumber: 528,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-accent",
                                                        children: "High Poverty"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/InteractiveMap.tsx",
                                                        lineNumber: 529,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/InteractiveMap.tsx",
                                                lineNumber: 527,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-4 h-4 rounded bg-[#2691FF]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/InteractiveMap.tsx",
                                                        lineNumber: 532,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-accent",
                                                        children: "Low Internet Access"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/InteractiveMap.tsx",
                                                        lineNumber: 533,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/InteractiveMap.tsx",
                                                lineNumber: 531,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/InteractiveMap.tsx",
                                        lineNumber: 526,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/InteractiveMap.tsx",
                                lineNumber: 524,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-medium text-foreground mb-2",
                                        children: "Local Assets"
                                    }, void 0, false, {
                                        fileName: "[project]/components/InteractiveMap.tsx",
                                        lineNumber: 538,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-4 h-4 rounded-full bg-[#7C3AED]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/InteractiveMap.tsx",
                                                        lineNumber: 541,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-accent",
                                                        children: "Libraries"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/InteractiveMap.tsx",
                                                        lineNumber: 542,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/InteractiveMap.tsx",
                                                lineNumber: 540,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-4 h-4 rounded-full bg-[#DC2626]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/InteractiveMap.tsx",
                                                        lineNumber: 545,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-accent",
                                                        children: "Community Centers"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/InteractiveMap.tsx",
                                                        lineNumber: 546,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/InteractiveMap.tsx",
                                                lineNumber: 544,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-4 h-4 rounded-full bg-[#7DBDFF]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/InteractiveMap.tsx",
                                                        lineNumber: 549,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-accent",
                                                        children: "Transit Stops"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/InteractiveMap.tsx",
                                                        lineNumber: 550,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/InteractiveMap.tsx",
                                                lineNumber: 548,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/InteractiveMap.tsx",
                                        lineNumber: 539,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/InteractiveMap.tsx",
                                lineNumber: 537,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-medium text-foreground mb-2",
                                        children: "WiFi Sites"
                                    }, void 0, false, {
                                        fileName: "[project]/components/InteractiveMap.tsx",
                                        lineNumber: 555,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-4 h-4 rounded-full bg-[#2691FF]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/InteractiveMap.tsx",
                                                        lineNumber: 558,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-accent",
                                                        children: "Candidate Sites"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/InteractiveMap.tsx",
                                                        lineNumber: 559,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/InteractiveMap.tsx",
                                                lineNumber: 557,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-4 h-4 rounded-full bg-[#6B7280]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/InteractiveMap.tsx",
                                                        lineNumber: 562,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-accent",
                                                        children: "Existing WiFi"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/InteractiveMap.tsx",
                                                        lineNumber: 563,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/InteractiveMap.tsx",
                                                lineNumber: 561,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/InteractiveMap.tsx",
                                        lineNumber: 556,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/InteractiveMap.tsx",
                                lineNumber: 554,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/InteractiveMap.tsx",
                        lineNumber: 523,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/InteractiveMap.tsx",
                lineNumber: 477,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/InteractiveMap.tsx",
            lineNumber: 476,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/InteractiveMap.tsx",
        lineNumber: 475,
        columnNumber: 5
    }, this);
}
_s(InteractiveMap, "SWLgc+Q9Va5Qf6Lm/YSnWc3hFfY=");
_c = InteractiveMap;
var _c;
__turbopack_context__.k.register(_c, "InteractiveMap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/SiteCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SiteCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
// Priority tier configuration
const tierConfig = {
    top_priority: {
        label: 'Critical',
        color: '#ef4444',
        textColor: 'text-red-500'
    },
    high_priority: {
        label: 'High',
        color: '#f59e0b',
        textColor: 'text-amber-500'
    },
    medium_priority: {
        label: 'Medium',
        color: '#3b82f6',
        textColor: 'text-blue-500'
    },
    low_priority: {
        label: 'Low',
        color: '#6b7280',
        textColor: 'text-gray-500'
    }
};
// Generate reasoning bullets from site metrics
function generateReasoning(site) {
    const reasons = [];
    if (site.poverty_rate && site.poverty_rate > 20) {
        reasons.push(`High poverty area (${site.poverty_rate.toFixed(1)}% below poverty line)`);
    }
    if (site.no_internet_pct && site.no_internet_pct > 15) {
        reasons.push(`Significant digital divide (${site.no_internet_pct.toFixed(1)}% without internet)`);
    }
    if (site.nearby_anchor_count && site.nearby_anchor_count > 0) {
        reasons.push(`${site.nearby_anchor_count} nearby civic asset${site.nearby_anchor_count > 1 ? 's' : ''} for deployment`);
    }
    if (site.composite_score >= 80) {
        reasons.push('Critical need - immediate deployment recommended');
    }
    if (site.student_population && site.student_population > 0) {
        reasons.push(`Serves ${site.student_population.toLocaleString()} students`);
    }
    // Fallback if no specific reasons
    if (reasons.length === 0) {
        reasons.push('Meets multiple deployment criteria');
    }
    return reasons;
}
// Determine icon based on nearby anchors
function getIcon(site) {
    if (site.nearest_library) return '📚';
    if (site.nearest_community_center) return '🏛️';
    if (site.nearby_anchors && site.nearby_anchors.length > 0) {
        const firstAsset = site.nearby_anchors[0];
        if (firstAsset.type === 'library') return '📚';
        if (firstAsset.type === 'community_center') return '🏛️';
        if (firstAsset.type === 'school') return '🏫';
        if (firstAsset.type === 'transit') return '🚇';
    }
    return '📍'; // Default location pin
}
function SiteCard({ rank, site, onClick }) {
    const tier = tierConfig[site.recommendation_tier] || tierConfig.low_priority;
    const reasoning = generateReasoning(site);
    const icon = getIcon(site);
    const displayName = site.name || `Census Tract ${site.tract_id}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `civic-card border-l-4 ${onClick ? 'cursor-pointer hover:bg-surface-hover transition-colors' : ''}`,
        style: {
            borderLeftColor: tier.color
        },
        onClick: onClick,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-start gap-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm",
                    style: {
                        backgroundColor: tier.color
                    },
                    children: rank
                }, void 0, false, {
                    fileName: "[project]/components/SiteCard.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-base font-semibold text-foreground",
                                            children: displayName
                                        }, void 0, false, {
                                            fileName: "[project]/components/SiteCard.tsx",
                                            lineNumber: 104,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 mt-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `text-xs font-medium px-2 py-0.5 rounded ${tier.textColor}`,
                                                    style: {
                                                        backgroundColor: `${tier.color}20`
                                                    },
                                                    children: [
                                                        tier.label,
                                                        " Priority"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/SiteCard.tsx",
                                                    lineNumber: 106,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs text-muted",
                                                    children: [
                                                        "Tract ",
                                                        site.tract_id
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/SiteCard.tsx",
                                                    lineNumber: 112,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/SiteCard.tsx",
                                            lineNumber: 105,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/SiteCard.tsx",
                                    lineNumber: 103,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-2xl",
                                    children: icon
                                }, void 0, false, {
                                    fileName: "[project]/components/SiteCard.tsx",
                                    lineNumber: 117,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/SiteCard.tsx",
                            lineNumber: 102,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-3 mt-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-lg font-semibold text-civic-green",
                                            children: site.total_population?.toLocaleString() || '0'
                                        }, void 0, false, {
                                            fileName: "[project]/components/SiteCard.tsx",
                                            lineNumber: 123,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-accent",
                                            children: "People Helped"
                                        }, void 0, false, {
                                            fileName: "[project]/components/SiteCard.tsx",
                                            lineNumber: 126,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/SiteCard.tsx",
                                    lineNumber: 122,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-lg font-semibold text-civic-blue",
                                            children: site.composite_score?.toFixed(1) || '0.0'
                                        }, void 0, false, {
                                            fileName: "[project]/components/SiteCard.tsx",
                                            lineNumber: 129,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-accent",
                                            children: "Score"
                                        }, void 0, false, {
                                            fileName: "[project]/components/SiteCard.tsx",
                                            lineNumber: 132,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/SiteCard.tsx",
                                    lineNumber: 128,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/SiteCard.tsx",
                            lineNumber: 121,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-3 pt-3 border-t border-border",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-medium text-muted uppercase tracking-wider mb-2",
                                    children: "Why this site?"
                                }, void 0, false, {
                                    fileName: "[project]/components/SiteCard.tsx",
                                    lineNumber: 138,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-1",
                                    children: reasoning.slice(0, 3).map((reason, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "text-xs text-accent flex gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-civic-green flex-shrink-0",
                                                    children: "✓"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/SiteCard.tsx",
                                                    lineNumber: 144,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: reason
                                                }, void 0, false, {
                                                    fileName: "[project]/components/SiteCard.tsx",
                                                    lineNumber: 145,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, idx, true, {
                                            fileName: "[project]/components/SiteCard.tsx",
                                            lineNumber: 143,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/SiteCard.tsx",
                                    lineNumber: 141,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/SiteCard.tsx",
                            lineNumber: 137,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/SiteCard.tsx",
                    lineNumber: 101,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/SiteCard.tsx",
            lineNumber: 91,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/SiteCard.tsx",
        lineNumber: 86,
        columnNumber: 5
    }, this);
}
_c = SiteCard;
var _c;
__turbopack_context__.k.register(_c, "SiteCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/RecommendationsSidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RecommendationsSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SiteCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/SiteCard.tsx [app-client] (ecmascript)");
'use client';
;
;
function RecommendationsSidebar({ isOpen, onClose, deploymentPlan, onSiteClick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/30 z-30 lg:hidden",
                onClick: onClose
            }, void 0, false, {
                fileName: "[project]/components/RecommendationsSidebar.tsx",
                lineNumber: 23,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `fixed top-0 right-0 h-full w-96 bg-surface border-l border-border z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col h-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-6 py-4 border-b border-border",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-lg font-semibold text-foreground",
                                                children: "WiFi Deployment Sites"
                                            }, void 0, false, {
                                                fileName: "[project]/components/RecommendationsSidebar.tsx",
                                                lineNumber: 40,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-accent",
                                                children: [
                                                    deploymentPlan?.recommended_sites_count || 0,
                                                    " sites recommended"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/RecommendationsSidebar.tsx",
                                                lineNumber: 43,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/RecommendationsSidebar.tsx",
                                        lineNumber: 39,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: onClose,
                                        className: "p-1 rounded-lg hover:bg-surface-hover transition-colors text-muted hover:text-foreground",
                                        title: "Close recommendations",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-5 h-5",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M6 18L18 6M6 6l12 12"
                                            }, void 0, false, {
                                                fileName: "[project]/components/RecommendationsSidebar.tsx",
                                                lineNumber: 53,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/RecommendationsSidebar.tsx",
                                            lineNumber: 52,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/RecommendationsSidebar.tsx",
                                        lineNumber: 47,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/RecommendationsSidebar.tsx",
                                lineNumber: 38,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/RecommendationsSidebar.tsx",
                            lineNumber: 37,
                            columnNumber: 11
                        }, this),
                        deploymentPlan ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-6 py-4 border-b border-border bg-surface-hover",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-xs font-semibold text-muted uppercase tracking-wider mb-3",
                                            children: "Projected Impact"
                                        }, void 0, false, {
                                            fileName: "[project]/components/RecommendationsSidebar.tsx",
                                            lineNumber: 64,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-2 gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-2xl font-bold text-civic-green",
                                                            children: deploymentPlan.projected_impact.total_population_served?.toLocaleString() || '0'
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/RecommendationsSidebar.tsx",
                                                            lineNumber: 69,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-xs text-accent mt-1",
                                                            children: "People Reached"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/RecommendationsSidebar.tsx",
                                                            lineNumber: 72,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/RecommendationsSidebar.tsx",
                                                    lineNumber: 68,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-2xl font-bold text-civic-blue",
                                                            children: deploymentPlan.projected_impact.households_without_internet_served?.toLocaleString() || '0'
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/RecommendationsSidebar.tsx",
                                                            lineNumber: 75,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-xs text-accent mt-1",
                                                            children: "Households Connected"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/RecommendationsSidebar.tsx",
                                                            lineNumber: 78,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/RecommendationsSidebar.tsx",
                                                    lineNumber: 74,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/RecommendationsSidebar.tsx",
                                            lineNumber: 67,
                                            columnNumber: 17
                                        }, this),
                                        deploymentPlan.projected_impact.residents_in_poverty_served && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-3 pt-3 border-t border-border",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xl font-bold",
                                                    style: {
                                                        color: 'var(--civic-green)'
                                                    },
                                                    children: deploymentPlan.projected_impact.residents_in_poverty_served.toLocaleString()
                                                }, void 0, false, {
                                                    fileName: "[project]/components/RecommendationsSidebar.tsx",
                                                    lineNumber: 83,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-accent mt-1",
                                                    children: "Residents in Poverty Served"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/RecommendationsSidebar.tsx",
                                                    lineNumber: 86,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/RecommendationsSidebar.tsx",
                                            lineNumber: 82,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/RecommendationsSidebar.tsx",
                                    lineNumber: 63,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 overflow-y-auto px-6 py-4 space-y-3",
                                    children: deploymentPlan.recommended_sites.map((site, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SiteCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            site: site,
                                            rank: index + 1,
                                            onClick: onSiteClick ? ()=>onSiteClick(index) : undefined
                                        }, site.tract_id, false, {
                                            fileName: "[project]/components/RecommendationsSidebar.tsx",
                                            lineNumber: 94,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/RecommendationsSidebar.tsx",
                                    lineNumber: 92,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true) : /* Empty State */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 flex items-center justify-center px-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-4xl mb-3",
                                        children: "📊"
                                    }, void 0, false, {
                                        fileName: "[project]/components/RecommendationsSidebar.tsx",
                                        lineNumber: 107,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-foreground font-medium",
                                        children: "No recommendations yet"
                                    }, void 0, false, {
                                        fileName: "[project]/components/RecommendationsSidebar.tsx",
                                        lineNumber: 108,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-accent text-sm mt-2",
                                        children: "Ask the AI assistant about WiFi deployment to see ranked sites"
                                    }, void 0, false, {
                                        fileName: "[project]/components/RecommendationsSidebar.tsx",
                                        lineNumber: 109,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/RecommendationsSidebar.tsx",
                                lineNumber: 106,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/RecommendationsSidebar.tsx",
                            lineNumber: 105,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/RecommendationsSidebar.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/RecommendationsSidebar.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_c = RecommendationsSidebar;
var _c;
__turbopack_context__.k.register(_c, "RecommendationsSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dashboard/[city]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DashboardHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ChatSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ChatSidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$InteractiveMap$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/InteractiveMap.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RecommendationsSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/RecommendationsSidebar.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
// Mock recommendations for Madison County
const MOCK_MADISON_RECOMMENDATIONS = {
    recommended_sites: [
        {
            name: "Madison County Courthouse Area",
            composite_score: 92.5,
            poverty_rate: 28.3,
            no_internet_pct: 35.2,
            recommendation_tier: "top_priority",
            tract_id: "12079001100"
        },
        {
            name: "Downtown Madison",
            composite_score: 88.7,
            poverty_rate: 24.1,
            no_internet_pct: 31.8,
            recommendation_tier: "top_priority",
            tract_id: "12079001200"
        },
        {
            name: "Lee Elementary School Area",
            composite_score: 85.2,
            poverty_rate: 32.5,
            no_internet_pct: 38.4,
            recommendation_tier: "high_priority",
            tract_id: "12079001300"
        },
        {
            name: "Greenville Community",
            composite_score: 82.1,
            poverty_rate: 26.9,
            no_internet_pct: 29.7,
            recommendation_tier: "high_priority",
            tract_id: "12079001400"
        },
        {
            name: "Pinetta Area",
            composite_score: 78.4,
            poverty_rate: 22.3,
            no_internet_pct: 27.1,
            recommendation_tier: "medium_priority",
            tract_id: "12079001500"
        }
    ],
    recommended_sites_count: 5,
    total_cost: 450000,
    total_reach: 12500,
    equity_score: 87.3,
    projected_impact: {
        total_population_served: 12500,
        households_without_internet_served: 4200,
        residents_in_poverty_served: 3500
    }
};
function DashboardPage({ params }) {
    _s();
    const [cityData, setCityData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isChatOpen, setIsChatOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isRecommendationsOpen, setIsRecommendationsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [recommendations, setRecommendations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardPage.useEffect": ()=>{
            // Retrieve city data from localStorage
            const storedCity = localStorage.getItem('selectedCity');
            if (storedCity) {
                const city = JSON.parse(storedCity);
                setCityData(city);
                // Load mock recommendations for Madison County
                if (city.slug === 'madison-county-fl') {
                    setRecommendations(MOCK_MADISON_RECOMMENDATIONS);
                }
            }
        }
    }["DashboardPage.useEffect"], []);
    const handleRecommendationsReceived = (plan)=>{
        setRecommendations(plan);
        setIsRecommendationsOpen(true); // Auto-open recommendations sidebar
        // Notify map component to show recommendations
        if (mapRef.current && mapRef.current.showRecommendations) {
            mapRef.current.showRecommendations(plan);
        }
    };
    const handleSiteClick = (siteIndex)=>{
        // Center map on the clicked site
        if (mapRef.current && mapRef.current.centerOnSite) {
            mapRef.current.centerOnSite(siteIndex);
        }
    };
    if (!cityData) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-background flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-foreground",
                children: "Loading dashboard..."
            }, void 0, false, {
                fileName: "[project]/app/dashboard/[city]/page.tsx",
                lineNumber: 118,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/dashboard/[city]/page.tsx",
            lineNumber: 117,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-background flex",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ChatSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isChatOpen,
                onClose: ()=>setIsChatOpen(false),
                cityName: cityData.name,
                onRecommendationsReceived: handleRecommendationsReceived
            }, void 0, false, {
                fileName: "[project]/app/dashboard/[city]/page.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RecommendationsSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isRecommendationsOpen,
                onClose: ()=>setIsRecommendationsOpen(false),
                deploymentPlan: recommendations,
                onSiteClick: handleSiteClick
            }, void 0, false, {
                fileName: "[project]/app/dashboard/[city]/page.tsx",
                lineNumber: 134,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onToggleChat: ()=>setIsChatOpen(!isChatOpen),
                onToggleRecommendations: ()=>setIsRecommendationsOpen(!isRecommendationsOpen),
                cityName: cityData.name
            }, void 0, false, {
                fileName: "[project]/app/dashboard/[city]/page.tsx",
                lineNumber: 142,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `flex-1 transition-all duration-300 pt-[73px] ${isChatOpen ? 'ml-[32rem]' : 'ml-0'} ${isRecommendationsOpen ? 'mr-96' : 'mr-0'}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$InteractiveMap$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        cityCenter: cityData.coords,
                        cityName: cityData.name,
                        citySlug: cityData.slug,
                        recommendations: recommendations,
                        mapRefProp: mapRef
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/[city]/page.tsx",
                        lineNumber: 158,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/dashboard/[city]/page.tsx",
                    lineNumber: 156,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/[city]/page.tsx",
                lineNumber: 149,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/[city]/page.tsx",
        lineNumber: 124,
        columnNumber: 5
    }, this);
}
_s(DashboardPage, "If254ZdRXxLpHI1rFbniw+n+B9A=");
_c = DashboardPage;
var _c;
__turbopack_context__.k.register(_c, "DashboardPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_a1a421f4._.js.map