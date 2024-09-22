import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { Link } from "expo-router";
import { Loader } from "@googlemaps/js-api-loader";

export default function HomeScreen() {
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);

    useEffect(() => {
        // Get user's location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
            },
            (error) => {
                console.error("Error getting user location: ", error);
                // Fallback to a default location if user denies permission
                setUserLocation({ lat: -23.161, lng: -45.794 });
            }
        );
    }, []);

    useEffect(() => {
        if (userLocation) {
            const loader = new Loader({
                apiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Replace with your API key
                version: "weekly",
            });

            loader.load().then(() => {
                const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
                    center: userLocation,
                    zoom: 12,
                });
            });
        }
    }, [userLocation]);

    return (
        <>
            <div id="map" style={{ height: "90vh", width: "100%" }}></div>
            <tr className="navbar" style={{ backgroundColor: "#f2f2f2", textAlign:"center"}}>
                <th style={{ backgroundColor: "#f2f2f2", textAlign:"center", width:"33vw", border: "1px solid rgb(160 160 160)"}}>
                    <Link href="/" style={{ color: "#066E3A", alignContent:"center",textAlign:"center"}}>
                        <h1>Voltar</h1>
                    </Link>
                </th>
                <th style={{color: "#066E3A", backgroundColor: "#f2f2f2", textAlign:"center", width:"34vw", border: "1px solid rgb(160 160 160)"}}>
                    <h2>Opções</h2>
                </th>
                <th style={{color: "#066E3A", backgroundColor: "#f2f2f2", textAlign:"center", width:"33vw", border: "1px solid rgb(160 160 160)"}}>
                    <h2>Ações</h2>
                </th>
            </tr>
        </>
    );
}
