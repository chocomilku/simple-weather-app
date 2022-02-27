import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import type { owmStruct } from "../../utils/exports";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<owmStruct>
) {
	try {
		res.status(200).json(await api());
	} catch (err: any) {
		res.status(err.response.status).json(err.response.data);
	}
}

const api = async (): Promise<owmStruct> => {
	const result = await axios.get(
		`${process.env.BASE_API}?lat=14.53&lon=120.98&exclude=${process.env.APICONFIG_EXCLUDE}&units=${process.env.APICONFIG_UNITS}&lang=${process.env.APICONFIG_LANG}&appid=${process.env.KEY}`
	);
	return result.data;
};
