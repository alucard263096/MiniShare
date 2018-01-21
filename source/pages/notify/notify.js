// pages/notify/notify.js
import { AppBase } from "../../app/AppBase";
import { PostApi } from "../../apis/post.api.js";
import { NoticeApi } from "../../apis/notice.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.group_id=1;
    this.Base.Page = this;
    super.onLoad(options);
    this.Base.setMyData({  title: "", description: "", group_id: options.group_id });
  }
  onShow() {
    var that = this;
    super.onShow();
  }
  titleChange(e) {
    this.Base.setMyData({ title: e.detail.value });
  }
  descriptionChange(e) {
    this.Base.setMyData({ description: e.detail.value });
  }

  sendNotice(e) {
    var formId = e.detail.formId;

    //this.Base.info(formId);
    //return;

    var data = this.Base.getMyData();
    console.log(data);
    var title = data.title;
    var description = data.description;
    if (title.trim() == "") {
      wx.showToast({
        icon: "none",
        title: '请输入通知标题',
      });
      return;
    }
    if (description.trim() == "") {
      wx.showToast({
        icon: "none",
        title: '请输入通知内容',
      });
      return;
    }
    

    var group_id = data.group_id;
    var postapi = new PostApi();
    var json = {
      group_id: group_id,
      title: title,
      description: data.description
    };
    var that = this;
    postapi.notify(json, data => {
      if (data.code != "0") {
        that.Base.error(data.return);
      } else {
        
        wx.navigateTo({
          url: '/pages/post/post?id=' + data.return,
        })
      }
    });
  }

}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad;
body.onShow = page.onShow;
body.titleChange = page.titleChange;
body.descriptionChange = page.descriptionChange;
body.sendNotice = page.sendNotice; 
Page(body)