import { useEffect, useState } from "react";
import { coordinates, owmStruct } from "../utils/exports";

const Home = () => {
	// stores the data from the api in this useState hook
	const [weatherData, setWeatherData] = useState<owmStruct>();
	const [coords, setCoords] = useState<coordinates>();

	useEffect(() => {
		navigator.geolocation.getCurrentPosition((pos) => {
			setCoords({
				lat: pos.coords.latitude,
				lon: pos.coords.longitude,
			});
		});
		console.log(coords);
	}, [coords]);

	// fetches data from the api and sets it to the useState hook above
	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch(`/api?lat=24&lon=34`);
			const data = await res.json();
			setWeatherData(data);
		};
		fetchData().catch(console.error);
	}, []);
	return (
		<>
			{/* conditional if something error happened to the useState hook like if it returned nothing*/}
			{!weatherData ? (
				<h1>data doko</h1>
			) : (
				<>
					<h1>{weatherData.current.weather[0].main}</h1>
					<p>{weatherData.current.weather[0].description}</p>
					<p>{weatherData.current.temp} celsius</p>
					<p>feels like {weatherData.current.feels_like} celsius</p>
					thinking emoji
					{console.log(weatherData)}
				</>
			)}
		</>
	);
};

export default Home;
