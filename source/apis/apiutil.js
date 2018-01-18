import { ApiConfig } from 'apiconfig.js';

export class ApiUtil {

  static HtmlDecode(str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");

    s = s.replace("\"/alucard263096/hss/upload/", "\"" + ApiConfig.GetUploadPath());
    return s;
  }

  static Toast(toastCtrl, msg) {
    let toast = toastCtrl.create({
      message: msg
    });
    toast.present();
  }

  static FormatDateTime(val) {
    return val.getFullYear() + "-" + (val.getMonth() + 1) + "-" + val.getDate() +
      " " + val.getHours() + ":" + val.getMinutes() + ":" + val.getSeconds();
  }

  static IsMobileNo(str) {

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    return myreg.test(str);
  }
  static FormatPercent(val) {
    val = val * 100.0;
    return val.toFixed(2) + '%';
  }
  static FormatPrice(val) {
    val = val * 1.0;
    return val.toFixed(2);
  }
  static FormatNumber(val, digits) {
    val = val * 1.0;
    return val.toFixed(digits);
  }
  static FormatDate(val) {
    return val.substr(0, 10);
  }
  static Storage = null;

  
  static Datetime_str(timespan) {
    var now = new Date().getTime() / 1000;
    timespan = now - timespan;
    if(timespan<0){
      return "你好，未来人";
    }
    if (timespan>365*24*3600){
      return (timespan / (365 * 24 * 3600)).toFixed(0)+"年前";
    } else if (timespan > 30 * 24 * 3600) {
      return (timespan / (30 * 24 * 3600)).toFixed(0) + "月前";
    } else if (timespan >  24 * 3600) {
      return (timespan / (24 * 3600)).toFixed(0) + "天前";
    } else if (timespan >  3600) {
      return (timespan / 3600).toFixed(0) + "小时前";
    } else if (timespan > 60) {
      return (timespan / 60).toFixed(0) + "分钟前";
    } else if (timespan) {
      return (timespan).toFixed(0) + "秒前";
    }
    return "你好，未来人";
  } 
}