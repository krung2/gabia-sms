import axios, { AxiosInstance } from "axios";
import { Base64 } from "js-base64";
import { CustomAxiosError } from "./error";
import { initSMSToken, sendLMS, sendShortSMS, sendMMS } from "./modules/gabia-service";
import { IGabiaAPIConfiguration } from "./types/IGabiaAPIConfiguration";
import { IDefaultRes, IDefaultResData, IGetAccessToken } from "./types/IGabiaResponse";

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
  private refKEY: string;
  private gabiaToken: string;

  /**
   * 
   * @param gabiaId ID used by the Gabia sms service
   * @param apiKey Apikey issued by gabiaSMS service
   * @param refKey refKey issued by gabiaSMS service
   */
  constructor(gabiaId: string, apiKey: string, refKey: string) {

    this.gabiaId = gabiaId;
    this.API_KEY = apiKey;
    this.refKEY = refKey;
    this.$axios = axios.create();
    this.gabiaToken = '';
  }

  private async call<T>(options: Object): Promise<T> {
    return this.$axios(options).then(res => res.data);
  }

  private async getAccesstoken(): Promise<void> {
    this.$axios = axios.create(
      this._baseConfig(
        this._base64KeyEncode(this.API_KEY)
      )
    );

    try {
      const data: IGetAccessToken = await this.call<IGetAccessToken>(initSMSToken());

      if (data === undefined) {

        throw new Error('axios통신 중 오류 발생');
      }

      if (data.token_type === 'Y') {

        throw new Error('만료된 APIKEY입니다');
      }

      this.gabiaToken = data.access_token;
      this.$axios = axios.create(
        this._baseConfig(
          this._base64KeyEncode(this.gabiaToken)
        )
      );
    } catch (err) {
      throw new CustomAxiosError(err);
    }
  }

  /**
   * @description 단문 메시지 전송 (1건이 차감됩니다)
   * @param phone 받는 사람의 전화번호
   * @param callback 보내는 사람의 전화번호
   * @param message 메시지
   * @param isForeign 국제 번호로 문자 발송을 원하는 경우, 해당 값을 Y로 넣어 주세요. 국제 문자 발송은 단문(SMS)만 지원하며, 발송 시 6건이 차감됩니다.
   */
  public async sendSMS(
    phone: string,
    callback: string,
    message: string,
    isForeign?: 'Y'
  ): Promise<IDefaultResData> {
    if (message === '') {
      throw new Error('Please check the message.');
    }

    await this.getAccesstoken();
    try {
      return (await this.call<IDefaultRes>(sendShortSMS({
        phone,
        callback,
        message,
        refkey: this.refKEY,
        is_foreign: isForeign,
      }))).data;
    } catch (err) {
      throw new CustomAxiosError(err);
    }
  }

  /**
   * @description 장문 메시지 전송 (3건이 차감됩니다)
   * @param phone 받는 사람의 전화번호
   * @param callback 보내는 사람의 전화번호
   * @param message 메시지
   * @param subject LMS의 제목이 되는 메시지
   */
  public async sendLMS(
    phone: string,
    callback: string,
    message: string,
    subject: string,
  ): Promise<IDefaultResData> {
    if (message === '') {
      throw new Error('Please check the message.');
    }

    await this.getAccesstoken();
    try {
      return (await this.call<IDefaultRes>(sendLMS({
        phone,
        callback,
        message,
        refkey: this.refKEY,
        subject,
      }))).data;
    } catch (err) {
      throw new CustomAxiosError(err)
    }
  }

  public async sendMMS(
    phone: string,
    callback: string,
    message: string,
    subject: string,
    images: File[],
  ): Promise<IDefaultResData> {
    if (message === '') {
      throw new Error('Please check the message.');
    }

    await this.getAccesstoken();

    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('callback', callback);
    formData.append('message', message);
    formData.append('subject', subject);
    formData.append('refkey', this.refKEY);
    formData.append('img_cnt', String(images.length));
    for (const [index, value] of images.entries()) {
      formData.append(`images${index}`, value);
    }

    try {
      return (await this.call<IDefaultRes>(sendMMS(formData))).data;
    } catch (err) {
      throw new CustomAxiosError(err);
    }
  }

  private _base64KeyEncode(key: string): string {

    return 'Basic ' + Base64.encode(`${this.gabiaId}:${key}`);
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

export default GabiaSMS;