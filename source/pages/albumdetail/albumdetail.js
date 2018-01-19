// pages/albumdetail/albumdetail.js
import { AppBase } from "../../app/AppBase";
import { AlbumApi } from "../../apis/album.api.js";


class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.id = 12;
    //options.group_id = 1;
    this.Base.Page = this;
    super.onLoad(options);
  }
  onShow() {
    var that = this;
    super.onShow();

    var albumapi = new AlbumApi();
    albumapi.detail({ group_id: this.Base.options.group_id,id:this.Base.options.id }, data => {
      that.Base.setMyData({ info: data });
      wx.setNavigationBarTitle({
        title: data.name,
      })
    });
  }
  uploadPhoto(){
    wx.navigateTo({
      url: '/pages/upload/upload?choosetype=photo&album_id=' + this.Base.options.id + "&group_id=" + this.Base.options.group_id,
    })
  }
}
var page = new Content();
var body = page.generateBodyJson(); 
body.onLoad = page.onLoad;
body.onShow = page.onShow;
body.uploadPhoto = page.uploadPhoto;

Page(body)