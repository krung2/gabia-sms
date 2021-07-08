import axios, { AxiosInstance } from "axios";
import { Base64 } from "js-base64";
import { initSMSToken } from "./modules/gabia-service";
import { IGabiaAPIConfiguration } from "./types/IGabiaAPIConfiguration";
import { IGetAccessToken } from "./types/IGabiaResponse";

const gabiaAPIConfiguration: IGabiaAPIConfiguration = {
	baseURL: 'https://sms.gabia.com/',
	resolveWithFullResponse: true,
	headers: {
		Authorization: '',
		"Content-Type": 'application/x-www-form-urlencoded',
	},
	json: true,
}

/**
 * @description Gabia SMS util
 */
class GabiaSMS {
	private $axios: AxiosInstance;
	private gabiaId: string;
	private API_KEY: string;
	private gabiaToken: string;

	/**
	 * 
	 * @param gabiaId ID used by the Gabia sms service
	 * @param apiKey Apikey issued by gabiaSMS service.
	 */
	constructor(gabiaId: string, apiKey: string) {

		this.gabiaId = gabiaId;
		this.API_KEY = apiKey;
		this.$axios = axios.create();
		this.gabiaToken = '';
	}

	private async call<T>(options: Object): Promise<T> {
		return this.$axios(options).then(res => res.data);
	}


	private async getAccesstoken(): Promise<void> {
		const attestationTool: string = this._base64KeyEncode(this.API_KEY);
		this.$axios = axios.create(this._baseConfig(attestationTool));

		const data: IGetAccessToken = await this.call<any>(initSMSToken());

		if (data.token_type === 'Y') {

			throw new Error('만료된 APIKEY입니다');
		}

		this.gabiaToken = data.access_token;
		this.$axios = axios.create(
			this._baseConfig(
				this._base64KeyEncode(this.gabiaToken)
			)
		);
	}

	private _base64KeyEncode(key: string): string {

		return 'Basic ' + Base64.encode(`${this.gabiaId}:`);
	}

	private _baseConfig(attestationTool: string): IGabiaAPIConfiguration {
		return {
			...gabiaAPIConfiguration,
			headers: {
				Authorization: attestationTool,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		};
	};
}

export = (gabiaId: string, apiKey: string): GabiaSMS => new GabiaSMS(gabiaId, apiKey);