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

	// store search bar input
	const [search, setSearch] = useState<string>("");

	// prevent reload on submit
	const handleSubmit = (event: any): void => {
		event.preventDefault();

		if (isNumber(search)) {
			let goods;
			goods = search.split(",");
			if (goods.length == 1) {
				goods = search.split(" ");
			}
			const valueCoords = goods.map((item) => {
				return item.replace(/\s/g, "");
			});
			console.log(valueCoords);

			setCoords({
				lat: parseInt(valueCoords[0]),
				lon: parseInt(valueCoords[1]),
			});
		}
	};

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
					`https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lon}&format=json&zoom=10&addressdetails=1&extratags=0&namedetails=0`
				);
				const nmData = await nominatim.json();
				console.log(nmData);
				setLocation(nmData);
			}
		};
		fetchData().catch(console.error);
	}, [coords, geoOK]);
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
						<h2>
							{locationCheck(location.display_name, location.address?.postcode)}
						</h2>
					)}
					<p>{weatherData.current.weather[0].description}</p>
					<p>{weatherData.current.temp} celsius</p>
					<p>feels like {weatherData.current.feels_like} celsius</p>
					<form onSubmit={handleSubmit}>
						<label>
							<p>Search Location</p>
							<input
								type="text"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
							<button type="submit">Search</button>
							<p>
								{search}: coordinates? {}
								{search == undefined ? "" : isNumber(search) + ""}
							</p>
						</label>
					</form>
				</>
			)}
		</>
	);
};

export default Home;

/**
 * checks the string if its a number.
 * the function omits commas so checking coordinates with commas in them doesn't return a false positive
 * @param thing parameter to check
 * @returns true if its a number, false if anything else
 */
const isNumber = (thing: string): boolean => {
	const theThing = thing.split(/[ \.,]+/g).join("");
	if (Math.abs(theThing.length) == 0) return false;
	const check: boolean = !isNaN(+theThing);
	return check;
};

/**
 * removes postcode if it exists
 * @param name string to be shown
 * @param postcode number object to be omitted
 * @returns string that is passed with checks
 */

const locationCheck = (name: string, postcode?: number): string => {
	if (!postcode) return name;
	return name.replace(postcode + ", ", "");
};
