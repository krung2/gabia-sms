import { AxiosError } from "axios";

export class CustomAxiosError extends Error {
	name: string = 'Data transfer Error';
	message: string;
	stack?: string;

	constructor(e: AxiosError) {
		super('customAxiosError');
		this.name = 'Data transfer Error';

		if (e.response === undefined) {
			this.name = 'Network Error';
			this.message = 'Please check Network';
			return;
		}

		if (e.response.status >= 500) {
			this.name = `${e.response.status}`;
			this.message = e.response.statusText
			return;
		}

		if (e.response.data !== undefined) {
			this.name = e.response.data.code;
			this.message = e.response.data.message;
			return;
		}

		this.message = `{ ${e.response?.status} } ${e.response.statusText}`;
	}
}