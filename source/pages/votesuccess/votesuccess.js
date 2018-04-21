// pages/notify/notify.js
import { AppBase } from "../../app/AppBase";
import { PostApi } from "../../apis/post.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.group_id=1;
    this.Base.Page = this;
    super.onLoad(options);
    this.Base.setMyData({ post_id: options.post_id });

    var that = this;
  }

  onShow() {
    var that = this;
    super.onShow();

  }
  gotoPost(){
    wx.navigateTo({
      url: '/pages/post/post?id=' + this.Base.options.post_id,
    })
  }
}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad; 
body.onShow = page.onShow;
body.gotoPost = page.gotoPost;
Page(body)