import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import type { owmStruct } from "../../utils/exports";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<owmStruct>
) {
	/**
	 * get method query
	 * @returns object containing parsed query from the url
	 */
	const params: queryStruct = req.query;
	try {
		res.status(200).json(await api(params.lat, params.lon));
	} catch (err: any) {
		res.status(err.response.status).json(err.response.data);
	}
}

/**
 * api proxy from open weather map
 * @param lat latitude of the specified location
 * @param lon longitude of the specified location
 * @returns json containing all weather information with modifiers from the `.env` file
 */
const api = async (lat?: number, lon?: number): Promise<owmStruct> => {
	const result = await axios.get(
		`${process.env.BASE_API}?${lat ? `lat=${lat}` : ""}&${
			lon ? `lon=${lon}` : ""
		}&exclude=${process.env.APICONFIG_EXCLUDE}&units=${
			process.env.APICONFIG_UNITS
		}&lang=${process.env.APICONFIG_LANG}&appid=${process.env.KEY}`
	);
	return result.data;
};

interface queryStruct {
	lat?: number;
	lon?: number;
}
