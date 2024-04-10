import moment from 'moment';
import {sortObject} from '../config/utils';
import qs from 'qs';
import crypto from 'crypto';

export const CONFIG_VNPAY = {
  vnp_TmnCode: 'L70J00E6',
  vnp_HashSecret: 'HPHVFPPQBJKKPYSOMTWHAJEKPZMKKCAQ',
  vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  vnp_Api: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
  vnp_ReturnUrl: 'http://localhost:3000/ReturnPage',
  vnp_Version: '2.1.0',
  vnp_Command: 'pay',
  vnp_Locale: 'vn',
  vnp_CurrCode: 'VND',
  ip_Addr: '127.0.0.1',
};

export async function genUrlVnPay(
  amount_money: string,
  ip: string,
): Promise<string> {
  const now = new Date();
  const createDate = moment(now).format('YYYYMMDDHHmmss');
  const ip_Addr = ip;
  const tmnCode = CONFIG_VNPAY.vnp_TmnCode;
  const secretKey = CONFIG_VNPAY.vnp_HashSecret;
  let vnpUrl = CONFIG_VNPAY.vnp_Url;
  // trang tro ve sau khi thanh toan
  const returnUrl = CONFIG_VNPAY.vnp_ReturnUrl;
  const orderId = moment(now).format('DDHHmmss');
  const amount = parseInt(amount_money, 10) || 0;
  const locale = CONFIG_VNPAY.vnp_Locale;
  const currCode = CONFIG_VNPAY.vnp_CurrCode;
  let vnp_Params: Record<string, any> = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ip_Addr;
  vnp_Params['vnp_CreateDate'] = createDate;
  vnp_Params = sortObject(vnp_Params);
  const signData = qs.stringify(vnp_Params, {encode: false});
  let hmac = crypto.createHmac('sha512', secretKey);
  let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + qs.stringify(vnp_Params, {encode: false});

  return vnpUrl;
}
