export interface IShortMessage {

  phone: string;
  callback: string;
  message: string;
  refkey?: string;
  is_foreign?: 'Y';
}