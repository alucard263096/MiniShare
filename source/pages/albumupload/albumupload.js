// pages/forcopy/forcopy.js
import { AppBase } from "../../app/AppBase";
import { AlbumApi } from "../../apis/album.api.js";
import { GroupApi } from "../../apis/group.api.js";
import { PostApi } from "../../apis/post.api.js";
import { NoticeApi } from "../../apis/notice.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.id=5;
    //options.album_id = 70;
    //options.group_id = 1;
    this.Base.Page = this;
    super.onLoad(options);
    this.Base.setMyData({ photos: [], description:""});
  }
  onShow() {
    var that = this;
    super.onShow();

    if (this.Base.options.album_id > 0) {
      var albumapi = new AlbumApi();
      albumapi.detail({ group_id: this.Base.options.group_id, id: this.Base.options.album_id }, data => {
        that.Base.setMyData({ info: data });
        wx.setNavigationBarTitle({
          title: data.name,
        })
      });

 
    }

  }
  changeDescription(e){
    var value=e.detail.value;
    this.Base.setMyData({ description: value});
  } 
  chooseImage() {
    var that = this;
    this.Base.uploadImage("album", function (photo) {
      var photos = that.Base.getMyData().photos;
      photos.push(photo);
      that.Base.setMyData({ photos: photos });
    });
  }
  uploadToAlbum(e) {
    console.log(e);
    var formId = e.detail.formId;
    var that = this;
    var data = this.Base.getMyData();
    var photos = data.photos;
    if (photos.length <= 0) {
      this.Base.info("请至少选择一张图片上传");
      return;
    }
    var group_id = this.Base.options.group_id;
    var album_id = this.Base.options.album_id;
    var json = {
      album_id: album_id,
      group_id: group_id,
      description: data.description,
      photos: photos.join(",")
    };
    var albumApi = new AlbumApi();
    albumApi.uploadphoto(json, data => {
      if (data.code == "0") {

        var noticeApi = new NoticeApi();
        noticeApi.uploadphoto({ group_id: group_id, post_id: data.return, formid: formId }, () => {
          wx.navigateBack({

          })});

        // wx.navigateTo({
        //   url: '/pages/back/post?id=' + data.return,
        //   success: function (res) { },
        //   fail: function (res) { },
        //   complete: function (res) { },
        // });
      } else {
        that.Base.error("系统繁忙，请稍后重试");
      }
    });
  }
}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad;
body.onShow = page.onShow;
body.changeDescription = page.changeDescription;
body.chooseImage = page.chooseImage;
body.uploadToAlbum = page.uploadToAlbum;

Page(body)