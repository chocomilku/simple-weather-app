import type { dailyCurrentData } from "../utils/exports";
import styles from "../styles/DataCard.module.scss";
import moment from "moment";

type hourlyData = {
	data: dailyCurrentData;
};

export const DataCardDaily = ({ data }: hourlyData) => {
	return (
		<div className={styles.card}>
			<h2>{data.weather[0].main}</h2>
			<p>{data.weather[0].description}</p>
			<p>
				{data.temp.min} celsius - {data.temp.max}
			</p>
			<p>{moment.unix(data.dt).fromNow()}</p>
			<p>{moment.unix(data.dt).format("llll")}</p>
		</div>
	);
};
