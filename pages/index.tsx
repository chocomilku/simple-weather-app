import { useEffect, useState } from "react";
import { coordinates, nmStruct, owmStruct } from "../utils/exports";

const Home = () => {
	// stores the data from the api in this useState hook
	const [weatherData, setWeatherData] = useState<owmStruct>();

	// stores a specified coordinates in this useState hook. the whole application depends on this
	const [coords, setCoords] = useState<coordinates>();

	// to stop navigation api asking for location and request to the backend api EVERY SECOND. my precious api, account, IP will be banned lmao. the purpose of this useState hook is to ask the location only once.
	const [geoOK, setGeoOK] = useState<boolean>(false);

	// reverse geocoding data
	const [location, setLocation] = useState<nmStruct>();

	// fetches data from the api and sets it to the useState hook above
	useEffect(() => {
		const fetchData = async () => {
			// checks if the geoOK useState hook is false. if true, get location from browser. this mechanism is here to stop asking location every second.
			if (!geoOK) {
				navigator.geolocation.getCurrentPosition((pos) => {
					setCoords({
						lat: pos.coords.latitude,
						lon: pos.coords.longitude,
					});
				});
				setGeoOK(true);
			}

			// fetches data from the backend and sets it to the weatherData useState hook
			if (coords) {
				const res = await fetch(`/api?lat=${coords.lat}&lon=${coords.lon}`);
				const data = await res.json();
				setWeatherData(data);

				// fetches location name from coordinates. API provided by Nominatim
				const nominatim = await fetch(
					`https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lon}&format=json&zoom=10`
				);
				const nmData = await nominatim.json();
				setLocation(nmData);
			}
		};
		fetchData().catch(console.error);
	}, [coords]);
	return (
		<>
			{/* conditional if something error happened to the useState hook like if it returned nothing*/}
			{!weatherData || !weatherData.current ? (
				<>
					<h1>data doko??!! give meeee now! 🔫</h1>
					<p>Geolocation may not be supported or disabled.</p>
				</>
			) : (
				<>
					<h1>{weatherData.current.weather[0].main}</h1>
					{/* handle undefined location */}
					{!location ? (
						""
					) : (
						<h2>{`${location?.address.village + ", "}${
							location?.address.state + ", "
						}${
							location?.address.region + ", "
						}${location?.address.country_code.toUpperCase()}`}</h2>
					)}
					<p>{weatherData.current.weather[0].description}</p>
					<p>{weatherData.current.temp} celsius</p>
					<p>feels like {weatherData.current.feels_like} celsius</p>
					thinking emoji
				</>
			)}
		</>
	);
};

export default Home;
