// pages/group/group.js
import { AppBase } from "../../app/AppBase";
import { GroupApi } from "../../apis/group.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);
  }
  onShow() {
    var that = this;
    super.onShow();
    var groupapi=new GroupApi();
    groupapi.detail({id:this.Base.options.id},data=>{
      that.Base.setMyData({info:data});
    });
  }
}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad;
body.onShow = page.onShow;
Page(body)