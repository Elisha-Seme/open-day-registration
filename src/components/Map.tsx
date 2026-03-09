"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";

// Fix for Leaflet icon issue in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapProps {
    center: [number, number];
    zoom?: number;
}

export default function Map({ center, zoom = 16 }: MapProps) {
    return (
        <div className="h-full w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner">
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={center}>
                    <Popup>
                        <div className="text-center font-bold">
                            Manga House <br />
                            <span className="text-xs font-normal text-slate-500">Kiambere Road, Upper Hill</span>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
