import { useEffect, useState } from "react";
import { coordinates, nmStruct, owmStruct } from "../utils/exports";
import moment from "moment";
import { DataCard } from "../components/DataCard";
import styles from "../styles/Home.module.css";

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

	const [stringLocation, setStringLocation] = useState<boolean>(false);

	// stores error message
	const [errorMessage, setErrorMessage] = useState<string>("");

	// prevent reload on submit and "submits" results and sometimes process it to a useState hook
	const handleSubmit = async (event: any): Promise<void> => {
		event.preventDefault();

		if (isNumber(search)) {
			// checks if the query received is separated by a comma or a space.
			// to detect, check if the length of the array is 1. if its true, it means that the query is separated by spaces instead of a comma.
			let goods;
			goods = search.split(",");
			if (goods.length == 1) {
				goods = search.split(" ");
			}

			// removes extra whitespace for each item in the array of coordinates
			const valueCoords = goods.map((item) => {
				return item.replace(/\s/g, "");
			});

			setCoords({
				lat: parseInt(valueCoords[0]),
				lon: parseInt(valueCoords[1]),
			});
		} else {
			setStringLocation(true);
		}
	};

	// fetches data from the api and sets it to the useState hook above
	useEffect(() => {
		const fetchData = async () => {
			// checks if the geoOK useState hook is false. if false, get location from browser. this mechanism is here to stop asking location every second.
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
				setLocation(nmData);
			}
		};

		const fetchLocation = async () => {
			// searches location coordinates via nominatim.
			if (stringLocation) {
				try {
					console.log("yes");
					const res = await fetch(
						`https://nominatim.openstreetmap.org/search?format=json&q=${search}`
					);
					const data = await res.json();
					const final: coordinates = data[0];
					setErrorMessage("");
					setCoords({
						lat: final.lat,
						lon: final.lon,
					});
				} catch (e) {
					setErrorMessage("No results found.");
				}
				setStringLocation(false);
			}
		};

		fetchData().catch(console.error);
		fetchLocation().catch(console.error);
	}, [coords, geoOK, stringLocation]);

	return (
		<>
			{errorMessage && (
				<>
					<style jsx>
						{`
							p {
								color: red;
								position: absolute;
								top: 0;
								left: 0;
								font-size: 2rem;
							}
						`}
					</style>
					<p>{errorMessage}</p>
				</>
			)}
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
					<p>{`Last Updated at ${moment
						.unix(weatherData.current.dt)
						.format("llll")}`}</p>
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
						</label>
					</form>
					<button
						onClick={() => {
							setGeoOK(!geoOK);
						}}>
						Use Current Location
					</button>
					<div className={styles.cardContainer}>
						{weatherData.hourly.map((hour, i) => {
							return <DataCard data={hour} key={i} />;
						})}
					</div>
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
