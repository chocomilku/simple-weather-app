import type { GetServerSideProps } from "next";
import { owmStruct } from "../utils/exports";

const Home = ({ data }: { data: owmStruct }) => {
	console.log(data);
	return (
		<>
			<h1>{data.current.weather[0].main}</h1>
		</>
	);
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
	let baseUrl;
	if (process.env.NODE_ENV === "development") {
		baseUrl = process.env.API_DEV;
	} else {
		baseUrl = process.env.API_PROD;
	}
	const res = await fetch(`${baseUrl}/api?lat=24&lon=34`);
	const data = await res.json();
	return {
		props: {
			data,
		},
	};
};
