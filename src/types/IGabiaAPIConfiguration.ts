export interface IGabiaAPIConfiguration {

	baseURL: string;
	resolveWithFullResponse: boolean;
	headers: {
		Authorization: any;
		"Content-Type": string;
	},
	json: true;
}