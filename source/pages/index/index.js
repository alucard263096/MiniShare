//index.js
import { AppBase } from "../../app/AppBase";
import {BannerApi} from "../../apis/banner.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.id=5;
    this.Base.Page = this;
    super.onLoad(options);
    this.Base.setMyData({activetab:0});
    var bannerApi = new BannerApi();
    bannerApi.home({},data=>{
      console.log(data);
      this.Base.setMyData({ homebanner:data });
    });
  }
  onShow() {
    var that = this;
    super.onShow();
  }
}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad;
body.onShow = page.onShow;
Page(body)