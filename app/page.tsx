"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Globe, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Dummy founder data
const foundersData = [
  {
    id: 1,
    name: "John Smith",
    country: "Canada",
    city: "Toronto",
    coordinates: [-79.3832, 43.6532],
    website: "https://johnsmith.com",
    twitter: "@johnsmith",
    shareUrl: "https://founders.com/johnsmith",
  },
  {
    id: 2,
    name: "Priya Sharma",
    country: "India",
    city: "Mumbai",
    coordinates: [72.8777, 19.076],
    website: "https://priyasharma.com",
    twitter: "@priyasharma",
    shareUrl: "https://founders.com/priyasharma",
  },
  {
    id: 3,
    name: "Alex Johnson",
    country: "United States",
    city: "San Francisco",
    coordinates: [-122.4194, 37.7749],
    website: "https://alexjohnson.com",
    twitter: "@alexjohnson",
    shareUrl: "https://founders.com/alexjohnson",
  },
  {
    id: 4,
    name: "Maria Garcia",
    country: "Spain",
    city: "Madrid",
    coordinates: [-3.7038, 40.4168],
    website: "https://mariagarcia.com",
    twitter: "@mariagarcia",
    shareUrl: "https://founders.com/mariagarcia",
  },
  {
    id: 5,
    name: "Chen Wei",
    country: "China",
    city: "Shanghai",
    coordinates: [121.4737, 31.2304],
    website: "https://chenwei.com",
    twitter: "@chenwei",
    shareUrl: "https://founders.com/chenwei",
  },
  {
    id: 6,
    name: "Sarah Wilson",
    country: "United Kingdom",
    city: "London",
    coordinates: [-0.1276, 51.5074],
    website: "https://sarahwilson.com",
    twitter: "@sarahwilson",
    shareUrl: "https://founders.com/sarahwilson",
  },
  {
    id: 7,
    name: "Ahmed Hassan",
    country: "Egypt",
    city: "Cairo",
    coordinates: [31.2357, 30.0444],
    website: "https://ahmedhassan.com",
    twitter: "@ahmedhassan",
    shareUrl: "https://founders.com/ahmedhassan",
  },
  {
    id: 8,
    name: "Lucas Silva",
    country: "Brazil",
    city: "São Paulo",
    coordinates: [-46.6333, -23.5505],
    website: "https://lucassilva.com",
    twitter: "@lucassilva",
    shareUrl: "https://founders.com/lucassilva",
  },
  {
    id: 9,
    name: "Emma Brown",
    country: "Australia",
    city: "Sydney",
    coordinates: [151.2093, -33.8688],
    website: "https://emmabrown.com",
    twitter: "@emmabrown",
    shareUrl: "https://founders.com/emmabrown",
  },
  {
    id: 10,
    name: "Yuki Tanaka",
    country: "Japan",
    city: "Tokyo",
    coordinates: [139.6917, 35.6895],
    website: "https://yukitanaka.com",
    twitter: "@yukitanaka",
    shareUrl: "https://founders.com/yukitanaka",
  },
  {
    id: 11,
    name: "Pierre Dubois",
    country: "France",
    city: "Paris",
    coordinates: [2.3522, 48.8566],
    website: "https://pierredubois.com",
    twitter: "@pierredubois",
    shareUrl: "https://founders.com/pierredubois",
  },
  {
    id: 12,
    name: "Anna Kowalski",
    country: "Poland",
    city: "Warsaw",
    coordinates: [21.0122, 52.2297],
    website: "https://annakowalski.com",
    twitter: "@annakowalski",
    shareUrl: "https://founders.com/annakowalski",
  },
  {
    id: 13,
    name: "Carlos Rodriguez",
    country: "Mexico",
    city: "Mexico City",
    coordinates: [-99.1332, 19.4326],
    website: "https://carlosrodriguez.com",
    twitter: "@carlosrodriguez",
    shareUrl: "https://founders.com/carlosrodriguez",
  },
  {
    id: 14,
    name: "Fatima Al-Zahra",
    country: "Morocco",
    city: "Casablanca",
    coordinates: [-7.5898, 33.5731],
    website: "https://fatimaalzahra.com",
    twitter: "@fatimaalzahra",
    shareUrl: "https://founders.com/fatimaalzahra",
  },
  {
    id: 15,
    name: "Olaf Andersen",
    country: "Norway",
    city: "Oslo",
    coordinates: [10.7522, 59.9139],
    website: "https://olafandersen.com",
    twitter: "@olafandersen",
    shareUrl: "https://founders.com/olafandersen",
  },
];

// Ticker messages
const tickerMessages = [
  "John from Canada joined",
  "Priya from India became a supporter",
  "Alex from United States started a project",
  "Maria from Spain shared an update",
  "Chen from China launched their startup",
  "Sarah from United Kingdom joined the community",
];

// Group founders by country
const foundersByCountry = foundersData.reduce((acc, founder) => {
  if (!acc[founder.country]) {
    acc[founder.country] = [];
  }
  acc[founder.country].push(founder);
  return acc;
}, {} as Record<string, typeof foundersData>);

export default function GlobeFounders() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [currentTicker, setCurrentTicker] = useState(0);
  const [hasValidToken, setHasValidToken] = useState(true);
  const [mapInitError, setMapInitError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    // Reject obviously invalid / missing tokens
    if (!token || token === "YOUR_MAPBOX_ACCESS_TOKEN") {
      setHasValidToken(false);
      return;
    }

    mapboxgl.accessToken = token;

    if (!mapContainer.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        projection: "globe",
        center: [0, 20],
        zoom: 1.5,
        pitch: 0,
        bearing: 0,
      });

      // Catch Mapbox runtime errors (e.g. bad scopes)
      map.current.on("error", (e) => {
        if (e && (e as any).error && (e as any).error.message) {
          setMapInitError((e as any).error.message as string);
          setHasValidToken(false);
        }
      });

      map.current.on("load", () => {
        if (!map.current) return;

        // Add atmosphere
        map.current.setFog({
          color: "rgb(186, 210, 235)",
          "high-color": "rgb(36, 92, 223)",
          "horizon-blend": 0.02,
          "space-color": "rgb(11, 11, 25)",
          "star-intensity": 0.6,
        });

        // Add founders as markers
        foundersData.forEach((founder) => {
          console.log(
            "Placing marker for",
            founder.name,
            "at",
            founder.coordinates
          );
          const el = document.createElement("div");
          el.className = "founder-marker";
          el.style.cssText = `
          width: 20px;
          height: 20px;
          background: red;
          border: 3px solid yellow;
          border-radius: 50%;
          box-shadow: 0 0 20px yellow;
          animation: pulse 2s infinite;
          cursor: pointer;
          z-index: 9999;
        `;

          const marker = new mapboxgl.Marker(el)
            .setLngLat(founder.coordinates as [number, number])
            .addTo(map.current!);

          // Add popup on click
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 16px; background: #18181b; color: #fff; border-radius: 12px; min-width: 240px; box-shadow: 0 4px 24px #000a; font-family: inherit;">
              <h3 style="font-size: 1.2rem; font-weight: bold; margin-bottom: 0.5rem;">${
                founder.name
              }</h3>
              <div style="font-size: 0.95rem; color: #a3a3a3; margin-bottom: 0.5rem;">${
                founder.city
              }, ${founder.country}</div>
              <div style="margin-bottom: 0.5rem;">
                <span style='display: flex; align-items: center; gap: 6px; margin-bottom: 4px;'><span style='font-size:1rem;'>🌐</span> <a href='${
                  founder.website
                }' target='_blank' style='color:#60a5fa; text-decoration:underline;'>${
            founder.website
          }</a></span>
                <span style='display: flex; align-items: center; gap: 6px; margin-bottom: 4px;'><span style='font-size:1rem;'>🐦</span> <a href='https://twitter.com/${founder.twitter.replace(
                  "@",
                  ""
                )}' target='_blank' style='color:#60a5fa; text-decoration:underline;'>${
            founder.twitter
          }</a></span>
                <span style='display: flex; align-items: center; gap: 6px;'><span style='font-size:1rem;'>🔗</span> <a href='${
                  founder.shareUrl
                }' target='_blank' style='color:#60a5fa; text-decoration:underline;'>Share profile</a></span>
              </div>
            </div>
          `);

          marker.getElement().addEventListener("click", () => {
            popup
              .setLngLat(founder.coordinates as [number, number])
              .addTo(map.current!);
          });
        });
      });
    } catch (err: any) {
      setMapInitError(err.message);
      setHasValidToken(false);
    }

    return () => {
      map.current?.remove();
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
    if (!map.current) return;

    setSelectedCountry(country);
    const founders = foundersByCountry[country];
    if (founders.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      founders.forEach((founder) => {
        bounds.extend(founder.coordinates as [number, number]);
      });

      map.current.fitBounds(bounds, {
        padding: 100,
        duration: 1500,
      });
    }
  };

  if (!hasValidToken) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-900 text-white p-8 text-center space-y-4">
        <Globe className="w-14 h-14 text-blue-500" />
        <h1 className="text-2xl font-bold">Mapbox token required</h1>
        <p className="text-sm text-gray-400 max-w-md">
          To preview the interactive globe you must provide a valid
          <code className="mx-1 px-1 py-0.5 bg-gray-800 rounded">
            NEXT_PUBLIC_MAPBOX_TOKEN
          </code>
          in your environment variables. <br />
          {mapInitError && (
            <span className="block mt-2 text-red-400">
              Error: {mapInitError}
            </span>
          )}
        </p>
        <a
          href="https://docs.mapbox.com/api/overview/#access-tokens-and-token-scopes"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline hover:text-blue-300 text-sm"
        >
          Mapbox documentation
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
        id="mapbox-globe"
        className="!absolute top-10 left-80 right-0 bottom-0"
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

        .mapboxgl-popup-content {
          background: rgb(17 24 39) !important;
          color: white !important;
          border-radius: 8px !important;
          padding: 0 !important;
        }

        .mapboxgl-popup-tip {
          border-top-color: rgb(17 24 39) !important;
        }
      `}</style>
    </div>
  );
}
