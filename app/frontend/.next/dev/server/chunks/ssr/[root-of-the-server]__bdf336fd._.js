module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/lib/mapbox-config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
const MAPBOX_CONFIG = {
    accessToken: ("TURBOPACK compile-time value", "pk.eyJ1Ijoid2NpYTAxM3R3ZSIsImEiOiJjbWh6cGs4eTcwYzZ5MmtvZ3dwazkyanE1In0.TRUv2-43Kzchqrn57tWzKQ") || process.env.NEXT_PUBLIC_MAPBOX || '',
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
}),
"[project]/components/USMapBackground.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>USMapBackground
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mapbox-gl/dist/mapbox-gl.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mapbox$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mapbox-config.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function USMapBackground() {
    const mapContainer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!mapContainer.current || map.current) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].accessToken = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mapbox$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAPBOX_CONFIG"].accessToken;
        map.current = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [
                -98.5795,
                39.8283
            ],
            zoom: 3.5,
            pitch: 45,
            bearing: 0,
            interactive: false,
            attributionControl: false
        });
        // Disable zoom controls
        map.current.scrollZoom.disable();
        map.current.boxZoom.disable();
        map.current.dragRotate.disable();
        map.current.dragPan.disable();
        map.current.keyboard.disable();
        map.current.doubleClickZoom.disable();
        map.current.touchZoomRotate.disable();
        return ()=>{
            map.current?.remove();
            map.current = null;
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute inset-0 w-full h-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: mapContainer,
                className: "w-full h-full opacity-40"
            }, void 0, false, {
                fileName: "[project]/components/USMapBackground.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 backdrop-blur-xl",
                style: {
                    backdropFilter: 'blur(12px)'
                }
            }, void 0, false, {
                fileName: "[project]/components/USMapBackground.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/USMapBackground.tsx",
        lineNumber: 44,
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
    {
        id: 2,
        name: 'New York, NY',
        state: 'New York',
        slug: 'new-york',
        coords: [
            -74.006,
            40.7128
        ]
    },
    {
        id: 3,
        name: 'Los Angeles, CA',
        state: 'California',
        slug: 'los-angeles',
        coords: [
            -118.2437,
            34.0522
        ]
    },
    {
        id: 4,
        name: 'Chicago, IL',
        state: 'Illinois',
        slug: 'chicago',
        coords: [
            -87.6298,
            41.8781
        ]
    },
    {
        id: 5,
        name: 'Houston, TX',
        state: 'Texas',
        slug: 'houston',
        coords: [
            -95.3698,
            29.7604
        ]
    },
    {
        id: 6,
        name: 'Phoenix, AZ',
        state: 'Arizona',
        slug: 'phoenix',
        coords: [
            -112.074,
            33.4484
        ]
    },
    {
        id: 7,
        name: 'Philadelphia, PA',
        state: 'Pennsylvania',
        slug: 'philadelphia',
        coords: [
            -75.1652,
            39.9526
        ]
    },
    {
        id: 8,
        name: 'San Antonio, TX',
        state: 'Texas',
        slug: 'san-antonio',
        coords: [
            -98.4936,
            29.4241
        ]
    },
    {
        id: 9,
        name: 'San Diego, CA',
        state: 'California',
        slug: 'san-diego',
        coords: [
            -117.1611,
            32.7157
        ]
    },
    {
        id: 10,
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$combobox$2f$combobox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Combobox"].Input, {
                            className: "w-full rounded-xl border-2 border-gray-700 bg-gray-900/80 backdrop-blur-md py-4 pl-6 pr-12 text-lg font-medium text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                            placeholder: "Search for your city...",
                            displayValue: (city)=>city?.name ?? '',
                            onChange: (event)=>setQuery(event.target.value)
                        }, void 0, false, {
                            fileName: "[project]/components/CitySelector.tsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$combobox$2f$combobox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Combobox"].Button, {
                            className: "absolute inset-y-0 right-0 flex items-center pr-4",
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
                                    lineNumber: 64,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/CitySelector.tsx",
                                lineNumber: 58,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/CitySelector.tsx",
                            lineNumber: 57,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$combobox$2f$combobox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Combobox"].Options, {
                            className: "absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-gray-900 backdrop-blur-md border border-gray-800 py-2 shadow-2xl focus:outline-none",
                            children: filteredCities.length === 0 && query !== '' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative cursor-default select-none px-6 py-3 text-gray-400",
                                children: "No cities found."
                            }, void 0, false, {
                                fileName: "[project]/components/CitySelector.tsx",
                                lineNumber: 75,
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
                                                            lineNumber: 92,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `block text-sm ${active ? 'text-blue-300' : 'text-gray-500'}`,
                                                            children: city.state
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CitySelector.tsx",
                                                            lineNumber: 95,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CitySelector.tsx",
                                                    lineNumber: 91,
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
                                                        lineNumber: 109,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CitySelector.tsx",
                                                    lineNumber: 104,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CitySelector.tsx",
                                            lineNumber: 90,
                                            columnNumber: 21
                                        }, this)
                                }, city.id, false, {
                                    fileName: "[project]/components/CitySelector.tsx",
                                    lineNumber: 80,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/CitySelector.tsx",
                            lineNumber: 73,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/CitySelector.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/CitySelector.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleGoToDashboard,
                disabled: !selectedCity,
                className: `w-full py-4 px-6 rounded-xl font-semibold text-lg text-white transition-all duration-300 ${selectedCity ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30' : 'bg-gray-800 opacity-50 cursor-not-allowed'}`,
                children: selectedCity ? `Explore ${selectedCity.name} →` : 'Select a city to continue'
            }, void 0, false, {
                fileName: "[project]/components/CitySelector.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/CitySelector.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__bdf336fd._.js.map