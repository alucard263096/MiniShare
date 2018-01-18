// pages/album/album.js
import { AppBase } from "../../app/AppBase";
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.id=5;
    this.Base.Page = this;
    super.onLoad(options);
    this.Base.setMyData({
      tabs: ["共同回忆", "我的回忆"],
      activeIndex: 0,
      sliderOffset: 0,
      sliderLeft: 0,
      t1: 0,
      t2: 0
    });
  }
  onShow() {
    var that = this;
    super.onShow();
  }

  tabClick(e) {
    this.Base.setMyData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad;
body.onShow = page.onShow;
body.tabClick = page.tabClick;
Page(body)