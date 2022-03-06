import type { hourCurrentData } from "../utils/exports";
import styles from "../styles/DataCard.module.css";
import moment, { now } from "moment";

type hourlyData = {
	data: hourCurrentData;
};

export const DataCard = ({ data }: hourlyData) => {
	return (
		<div className={styles.card}>
			<h2>{data.weather[0].main}</h2>
			<p>{data.weather[0].description}</p>
			<p>{data.temp} celsius</p>
			<p>feels like {data.feels_like} celsius</p>
			<p>{moment.unix(data.dt).fromNow()}</p>
			<p>{moment.unix(data.dt).format("llll")}</p>
		</div>
	);
};
