import { AxiosRequestConfig } from "axios";
import qs from "querystring";

export const initSMSToken = (): AxiosRequestConfig => ({
	method: 'POST',
	url: '/oauth/token',
	data: qs.stringify({ grant_type: 'client_credentials' }),
});