
export interface IMultimediaMessage {

  phone: string;
  callback: string;
  message: string;
  refkey?: string;
  subject: string;
  img_cnt: number;
  images0?: File;
  images1?: File;
  images2?: File;
}