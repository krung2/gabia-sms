import qs from "querystring";
import { AxiosRequestConfig } from "axios";
import { IShortMessage } from "../types/send/SMS.types";
import { ILongMessage } from "../types/send/LMS.types";

export const initSMSToken = (): AxiosRequestConfig => ({
	method: 'POST',
	url: '/oauth/token',
	data: qs.stringify({ grant_type: 'client_credentials' }),
});

export const sendShortSMS = (data: IShortMessage): AxiosRequestConfig => ({
	method: 'POST',
	url: '/api/send/sms',
	data: qs.stringify({ ...data })
	// data: qs.stringify({ phone: data.phone, callback: data.callback, message: data.message, refkey: data.refkey, is_foreign: data.is_foreign }),
})

export const sendLMS = (data: ILongMessage): AxiosRequestConfig => ({
	method: 'POST',
	url: '/api/send/lms',
	data: qs.stringify({ ...data })
})