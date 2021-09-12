export interface IGetAccessToken {

	access_token: string,
	refresh_token: string,
	expires_in: number,
	scope: string,
	create_on: string,
	is_expires: string,
	token_type: string,
	code: string
}

export interface IDefaultRes {

	code: string;
	message: string;
	data: {
		BEFORE_SMS_QTY: string,
		AFTER_SMS_QTY: string,
		INSERT_ID: number,
	}
}

export interface IDefaultResData {
	BEFORE_SMS_QTY: string,
	AFTER_SMS_QTY: string,
	INSERT_ID: number,
}