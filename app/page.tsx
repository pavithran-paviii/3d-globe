"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Globe, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Import Mapbox CSS
import "mapbox-gl/dist/mapbox-gl.css";

// Types
interface Founder {
  id: number;
  name: string;
  country: string;
  city: string;
  coordinates: [number, number]; // [longitude, latitude]
  website: string;
  twitter: string;
  shareUrl: string;
}

type FoundersByCountry = Record<string, Founder[]>;

// Fixed founder data with correct coordinates [longitude, latitude]
const foundersData: Founder[] = [
  {
    id: 1,
    name: "John Smith",
    country: "Canada",
    city: "Toronto",
    coordinates: [-79.3832, 43.6532], // Toronto, Canada
    website: "https://johnsmith.com",
    twitter: "@johnsmith",
    shareUrl: "https://founders.com/johnsmith",
  },
  {
    id: 2,
    name: "Priya Sharma",
    country: "India",
    city: "Mumbai",
    coordinates: [72.8777, 19.076], // Mumbai, India - Fixed coordinates
    website: "https://priyasharma.com",
    twitter: "@priyasharma",
    shareUrl: "https://founders.com/priyasharma",
  },
  {
    id: 3,
    name: "Alex Johnson",
    country: "United States",
    city: "San Francisco",
    coordinates: [-122.4194, 37.7749], // San Francisco, USA
    website: "https://alexjohnson.com",
    twitter: "@alexjohnson",
    shareUrl: "https://founders.com/alexjohnson",
  },
  {
    id: 4,
    name: "Maria Garcia",
    country: "Spain",
    city: "Madrid",
    coordinates: [-3.7038, 40.4168], // Madrid, Spain
    website: "https://mariagarcia.com",
    twitter: "@mariagarcia",
    shareUrl: "https://founders.com/mariagarcia",
  },
  {
    id: 5,
    name: "Chen Wei",
    country: "China",
    city: "Shanghai",
    coordinates: [121.4737, 31.2304], // Shanghai, China
    website: "https://chenwei.com",
    twitter: "@chenwei",
    shareUrl: "https://founders.com/chenwei",
  },
  {
    id: 6,
    name: "Sarah Wilson",
    country: "United Kingdom",
    city: "London",
    coordinates: [-0.1276, 51.5074], // London, UK
    website: "https://sarahwilson.com",
    twitter: "@sarahwilson",
    shareUrl: "https://founders.com/sarahwilson",
  },
  {
    id: 7,
    name: "Ahmed Hassan",
    country: "Egypt",
    city: "Cairo",
    coordinates: [31.2357, 30.0444], // Cairo, Egypt
    website: "https://ahmedhassan.com",
    twitter: "@ahmedhassan",
    shareUrl: "https://founders.com/ahmedhassan",
  },
  {
    id: 8,
    name: "Lucas Silva",
    country: "Brazil",
    city: "São Paulo",
    coordinates: [-46.6333, -23.5505], // São Paulo, Brazil
    website: "https://lucassilva.com",
    twitter: "@lucassilva",
    shareUrl: "https://founders.com/lucassilva",
  },
  {
    id: 9,
    name: "Emma Brown",
    country: "Australia",
    city: "Sydney",
    coordinates: [151.2093, -33.8688], // Sydney, Australia
    website: "https://emmabrown.com",
    twitter: "@emmabrown",
    shareUrl: "https://founders.com/emmabrown",
  },
  {
    id: 10,
    name: "Yuki Tanaka",
    country: "Japan",
    city: "Tokyo",
    coordinates: [139.6917, 35.6895], // Tokyo, Japan
    website: "https://yukitanaka.com",
    twitter: "@yukitanaka",
    shareUrl: "https://founders.com/yukitanaka",
  },
  {
    id: 11,
    name: "Shorupan Pirakaspathy",
    country: "India",
    city: "Hyderabad",
    coordinates: [78.4867, 17.385], // Mumbai, India - Fixed coordinates
    website: "https://priyasharma.com",
    twitter: "@priyasharma",
    shareUrl: "https://founders.com/priyasharma",
  },
];

// Ticker messages
const tickerMessages: string[] = [
  "John from Canada joined",
  "Priya from India became a supporter",
  "Alex from United States started a project",
  "Maria from Spain shared an update",
  "Chen from China launched their startup",
  "Sarah from United Kingdom joined the community",
];

// Group founders by country
const foundersByCountry: FoundersByCountry = foundersData.reduce(
  (acc, founder) => {
    if (!acc[founder.country]) {
      acc[founder.country] = [];
    }
    acc[founder.country].push(founder);
    return acc;
  },
  {} as FoundersByCountry
);

export default function GlobeFounders() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [currentTicker, setCurrentTicker] = useState<number>(0);
  const [hasValidToken, setHasValidToken] = useState<boolean>(true);
  const [mapInitError, setMapInitError] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  // Function to validate coordinates
  const validateCoordinates = (
    coords: [number, number],
    name: string
  ): boolean => {
    const [lng, lat] = coords;
    const isValid = lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
    if (!isValid) {
      console.error(`Invalid coordinates for ${name}: [${lng}, ${lat}]`);
    }
    return isValid;
  };

  // Initialize map
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    // Check for valid token
    if (!token || token === "YOUR_MAPBOX_ACCESS_TOKEN" || token.length < 10) {
      setHasValidToken(false);
      setMapInitError("Invalid or missing Mapbox token");
      return;
    }

    mapboxgl.accessToken = token;

    if (!mapContainer.current || map.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        projection: { name: "globe" },
        center: [20, 20], // Changed to better center the globe
        zoom: 1.5,
        pitch: 0,
        bearing: 0,
      });

      // Handle map errors
      map.current.on("error", (e: any) => {
        console.error("Mapbox error:", e);
        if (e?.error?.message) {
          setMapInitError(e.error.message);
          setHasValidToken(false);
        }
      });

      // Wait for map to be fully loaded
      map.current.on("load", () => {
        if (!map.current) return;

        console.log("Map loaded, adding atmosphere and markers...");

        // Add atmosphere for globe
        map.current.setFog({
          color: "rgb(186, 210, 235)",
          "high-color": "rgb(36, 92, 223)",
          "horizon-blend": 0.02,
          "space-color": "rgb(11, 11, 25)",
          "star-intensity": 0.6,
        });

        // Clear existing markers
        markers.current.forEach((marker) => marker.remove());
        markers.current = [];

        // Add founders as markers
        foundersData.forEach((founder) => {
          // Validate coordinates before adding marker
          if (!validateCoordinates(founder.coordinates, founder.name)) {
            console.warn(`Skipping ${founder.name} due to invalid coordinates`);
            return;
          }

          console.log(
            `Adding marker for ${founder.name} at [${founder.coordinates[0]}, ${founder.coordinates[1]}]`
          );

          // Create marker element with better styling
          const el = document.createElement("div");
          el.className = "custom-marker";
          el.style.cssText = `
            width: 16px;
            height: 16px;
            background: linear-gradient(45deg, #000000, #e8b622);
            border: 2px solid #fbbf24;
            border-radius: 50%;
            box-shadow: 0 0 15px rgba(251, 191, 36, 0.6);
            cursor: pointer;
            transition: all 0.3s ease;
            position: absolute;
            top:0,
            z-index: 1;
          `;

          // const el = document.createElement("div");
          // el.className = "custom-marker";
          // el.style.width = "24px";
          // el.style.height = "24px";
          // el.style.backgroundColor = "blue";
          // el.style.borderRadius = "50%";

          // Add hover effect
          // el.addEventListener("mouseenter", () => {
          //   el.style.transform = "scale(1.4)";
          //   el.style.boxShadow = "0 0 25px rgba(251, 191, 36, 0.8)";
          //   el.style.zIndex = "2";
          // });

          // el.addEventListener("mouseleave", () => {
          //   el.style.transform = "scale(1)";
          //   el.style.boxShadow = "0 0 15px rgba(251, 191, 36, 0.6)";
          //   el.style.zIndex = "1";
          // });

          try {
            // Create marker with explicit positioning
            const marker = new mapboxgl.Marker({
              element: el,
              anchor: "center",
            })
              .setLngLat(founder.coordinates)
              .addTo(map.current!);

            markers.current.push(marker);

            // Create popup
            const popup = new mapboxgl.Popup({
              offset: 25,
              closeButton: true,
              closeOnClick: true,
              maxWidth: "300px",
            }).setHTML(`
              <div style="padding: 16px; background: #1f2937; color: #fff; border-radius: 12px; min-width: 240px; font-family: system-ui, -apple-system, sans-serif;">
                <h3 style="font-size: 1.1rem; font-weight: 600; margin: 0 0 8px 0; color: #f9fafb;">${
                  founder.name
                }</h3>
                <div style="font-size: 0.9rem; color: #9ca3af; margin-bottom: 12px;">${
                  founder.city
                }, ${founder.country}</div>
                <div style="font-size: 0.8rem; color: #6b7280; margin-bottom: 12px;">
                  Coordinates: ${founder.coordinates[1].toFixed(
                    4
                  )}, ${founder.coordinates[0].toFixed(4)}
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  <a href="${
                    founder.website
                  }" target="_blank" rel="noopener noreferrer" style="color: #60a5fa; text-decoration: none; font-size: 0.85rem; display: flex; align-items: center; gap: 6px;">
                    <span>🌐</span> Website
                  </a>
                  <a href="https://twitter.com/${founder.twitter.replace(
                    "@",
                    ""
                  )}" target="_blank" rel="noopener noreferrer" style="color: #60a5fa; text-decoration: none; font-size: 0.85rem; display: flex; align-items: center; gap: 6px;">
                    <span>🐦</span> ${founder.twitter}
                  </a>
                  <a href="${
                    founder.shareUrl
                  }" target="_blank" rel="noopener noreferrer" style="color: #60a5fa; text-decoration: none; font-size: 0.85rem; display: flex; align-items: center; gap: 6px;">
                    <span>🔗</span> Share Profile
                  </a>
                </div>
              </div>
            `);

            // Add click event for popup
            el.addEventListener("click", (e) => {
              e.stopPropagation();
              popup.setLngLat(founder.coordinates).addTo(map.current!);
            });

            console.log(`Successfully added marker for ${founder.name}`);
          } catch (error) {
            console.error(`Error adding marker for ${founder.name}:`, error);
          }
        });

        setIsMapLoaded(true);
        console.log(`Total markers added: ${markers.current.length}`);
      });

      // Debug map events
      map.current.on("styledata", () => {
        console.log("Style data loaded");
      });

      map.current.on("sourcedata", () => {
        console.log("Source data loaded");
      });
    } catch (err: any) {
      console.error("Map initialization error:", err);
      setMapInitError(err.message);
      setHasValidToken(false);
    }

    // Cleanup
    return () => {
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Ticker animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTicker((prev) => (prev + 1) % tickerMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Handle country selection
  const handleCountryClick = (country: string) => {
    if (!map.current || !isMapLoaded) return;

    setSelectedCountry(country);
    const founders = foundersByCountry[country];

    if (founders && founders.length > 0) {
      if (founders.length === 1) {
        // If only one founder, fly to their location
        map.current.flyTo({
          center: founders[0].coordinates,
          zoom: 6,
          duration: 1500,
        });
      } else {
        // If multiple founders, fit bounds
        const bounds = new mapboxgl.LngLatBounds();
        founders.forEach((founder) => {
          bounds.extend(founder.coordinates);
        });

        map.current.fitBounds(bounds, {
          padding: 100,
          duration: 1500,
          maxZoom: 8,
        });
      }
    }
  };

  if (!hasValidToken) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-900 text-white p-8 text-center space-y-4">
        <Globe className="w-14 h-14 text-blue-500" />
        <h1 className="text-2xl font-bold">Mapbox Token Required</h1>
        <p className="text-sm text-gray-400 max-w-md">
          To view the interactive globe, you need to provide a valid{" "}
          <code className="mx-1 px-2 py-1 bg-gray-800 rounded text-xs">
            NEXT_PUBLIC_MAPBOX_TOKEN
          </code>{" "}
          in your environment variables.
        </p>
        {mapInitError && (
          <p className="text-red-400 text-sm mt-2">Error: {mapInitError}</p>
        )}
        <a
          href="https://docs.mapbox.com/api/overview/#access-tokens-and-token-scopes"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline hover:text-blue-300 text-sm"
        >
          Get Mapbox Token →
        </a>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-gray-900 text-white overflow-hidden">
      {/* Ticker Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-blue-600 to-purple-600 h-10 flex items-center overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="mx-4 text-sm font-medium">
            🌟 {tickerMessages[currentTicker]} · Welcome to the global founder
            community!
          </span>
        </div>
      </div>

      {/* Sidebar */}
      <div className="absolute left-0 top-10 bottom-0 w-80 bg-gray-800/90 backdrop-blur-sm border-r border-gray-700 z-10 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-bold">Global Founders</h1>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Users className="w-4 h-4" />
              <span>{foundersData.length} founders worldwide</span>
            </div>
            {!isMapLoaded && (
              <div className="text-xs text-yellow-400">Loading map...</div>
            )}
            {isMapLoaded && (
              <div className="text-xs text-green-400">
                Map loaded with {markers.current.length} markers
              </div>
            )}
          </div>

          <div className="space-y-2">
            {Object.entries(foundersByCountry)
              .sort(([, a], [, b]) => b.length - a.length)
              .map(([country, founders]) => (
                <Card
                  key={country}
                  className={`p-3 cursor-pointer transition-all duration-200 border-gray-600 hover:border-blue-500 hover:bg-gray-700/50 ${
                    selectedCountry === country
                      ? "bg-blue-600/20 border-blue-500"
                      : "bg-gray-700/30"
                  }`}
                  onClick={() => handleCountryClick(country)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{country}</span>
                    <Badge
                      variant="secondary"
                      className="bg-blue-600/20 text-blue-300 border-blue-500/30"
                    >
                      {founders.length}
                    </Badge>
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    {founders
                      .slice(0, 2)
                      .map((f) => f.name)
                      .join(", ")}
                    {founders.length > 2 && ` +${founders.length - 2} more`}
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div
        ref={mapContainer}
        className="absolute top-10 left-80 right-0 bottom-0"
        style={{
          width: "calc(100vw - 320px)",
          height: "calc(100vh - 40px)",
        }}
      />

      {/* Add Me Button */}
      <Button
        className="fixed top-16 right-6 z-20 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
        onClick={() => alert("Add Me functionality coming soon!")}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Me
      </Button>

      {/* Mobile Responsive Overlay */}
      <div className="md:hidden absolute inset-0 bg-gray-900 flex items-center justify-center z-30">
        <div className="text-center p-6">
          <Globe className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Global Founders</h2>
          <p className="text-gray-400 mb-4">
            This experience is optimized for desktop. Please view on a larger
            screen for the full interactive globe.
          </p>
          <div className="space-y-2">
            <div className="text-sm text-gray-300">
              <strong>{foundersData.length}</strong> founders from{" "}
              <strong>{Object.keys(foundersByCountry).length}</strong> countries
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }

        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-marquee {
          animation: marquee 15s linear infinite;
        }

        .founder-marker {
          animation: pulse 2s infinite;
        }

        .mapboxgl-popup-content {
          background: #1f2937 !important;
          color: white !important;
          border-radius: 8px !important;
          padding: 0 !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5) !important;
        }

        .mapboxgl-popup-tip {
          border-top-color: #1f2937 !important;
        }

        .mapboxgl-popup-close-button {
          color: #9ca3af !important;
          font-size: 18px !important;
          padding: 8px !important;
        }

        .mapboxgl-popup-close-button:hover {
          color: #f9fafb !important;
          background: rgba(75, 85, 99, 0.5) !important;
        }
      `}</style>
    </div>
  );
}
