import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type Data = {
	message: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	try {
		res.status(200).json(await api());
	} catch (error) {
		res.status(500).json({ error });
	}
}

type s = {
	[key: string]: string;
};

const api = async (): Promise<s> => {
	const result = await axios.get(
		`${process.env.BASE_API}?lat=14.53&lon=120.98&exclude=${process.env.APICONFIG_EXCLUDE}&units=${process.env.APICONFIG_UNITS}&lang=${process.env.APICONFIG_LANG}&appid=${process.env.KEY}`
	);
	return result.data;
};
