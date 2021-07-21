# gabia-sms

## \*\* caution \*\*

> This module is not officially supported by Gabia

>this module is developing now. it can be unstable.

<br/>

> this library is based on <a href="https://sms.gabia.com/admin/api/">official gabiaSMS api guide</a>

<br/>

## before use this module <br />

1. Sign Up for <a href="http://sms.gabia.com">gabiaSMS</a> Service

2. Register SendingIP

      -> <a href="http://sms.gabia.com/admin">gabiaSMS admin</a> -> default setting -> setting sending IP

3. Register Outgoing Information

      -> <a href="http://sms.gabia.com/settings">gabiaSMS setting</a> -> register outgoing information

## using module <br /><br />

### create module
  ```ts
  const gabiaId: string = 'id used in gabiaSMS';
  const gabiaAPIKEY: string = 'APIKEY issued by gabiaSMS';
  const gabiaRef: string = 'Any unique string to find your result of send after';

  const gabiaSMSLib = gabiaSMS(gabiaId, gabiaAPIKEY, gabiaRef);
  ```

### using SMS Service
  ```ts
  const senderNum: string = '00011112222';
  const receiverNum: string = '00011112222';
  const message: string = 'test1234'; // Can't be an empty string. ''
                                      // Don't go over 90 byte.
                                      // if bigger than 90 byte, message will
                                      // send slice

  const res: Promise<IDefaultResData> =
    gabiaSMSLib.sendSMS(senderNum, receiverNum, message);
  ```

### using LMS Service
  ```ts
  const senderNum: string = '00011112222';
  const receiverNum: string = '00011112222';
  const message: string = 'test1234'; // Can't be an empty string. ''
  const subject: string = 'LMS test subject';

  const res: Promise<IDefaultResData> = await gabiaSMSLib.sendLMS(
    senderNum,
    receiverNum,
    message,
    subject
  );
  ```