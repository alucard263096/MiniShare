// pages/albumdetail/albumdetail.js
import { AppBase } from "../../app/AppBase";
import { AlbumApi } from "../../apis/album.api.js";
import { GroupApi } from "../../apis/group.api.js";
import { PostApi } from "../../apis/post.api.js";


class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.id = 32;
    //options.group_id = 480;
    this.Base.Page = this;

    if (options.id != undefined) {
      this.Base.setMyData({ "album_id": options.id });
    } else {
      this.Base.setMyData({ "album_id": "0" });
      options.id = 0;
    }
    if (options.group_id != undefined) {
      this.Base.setMyData({ "group_id": options.group_id });
    } else {
      this.Base.setMyData({ "group_id": "0" });
      options.group_id = 0;
    }

    super.onLoad(options);
    this.Base.setMyData({ list: [], showtitlenow: false, inchangename:false });
  }
  onShow() {
    var that = this;
    super.onShow();

    var albumapi = new AlbumApi();
    albumapi.detail({ group_id: this.Base.options.group_id, id: this.Base.options.id }, data => {
      that.Base.setMyData({ info: data });
      wx.setNavigationBarTitle({
        title: data.name,
      })
    });

    var postApi = new PostApi();
    var data = this.Base.getMyData();
    var json = {
      album_id: this.Base.options.id,
      group_id:this.Base.options.group_id,
      operation: "P"
    };
    postApi.list(json, (data) => {
      var ret = [];
      for (var i = 0; i < data.length; i++) {
        data[i]["updated_date_split"] = AppBase.Util.Datetime2(Number(data[i]["updated_date_span"]));

        data[i]["updated_date_span"] = AppBase.Util.Datetime_str(Number(data[i]["updated_date_span"]));
        if(data[i].photos.length>0){
          ret.push(data[i]);
        }
      }
      

      that.Base.setMyData({ list: ret });
    });
  }
  uploadPhoto() {
    wx.navigateTo({
      url: '/pages/upload/upload?choosetype=photo&album_id=' + this.Base.options.id + "&group_id=" + this.Base.options.group_id,
    })
  }
  viewPhotos(e) {
    var photos = this.Base.getMyData().info.photos;
    var current = e.currentTarget.id;
    var nphotos = [];
    for (let i in photos) {
      for (var j = 0; j < photos[i]["photos"].length; j++) {
        nphotos.push(photos[i]["photos"][j]["photo"]);
      }
    }
    this.Base.viewGallary("album", nphotos, current);
  }
  changeAlbumName() {
    //wx.navigateTo({
    //  url: '/pages/albumcreate/albumcreate?id=' + this.Base.options.id + "&group_id=" + this.Base.options.group_id,
    //})
    var info=this.Base.getMyData().info;
    this.Base.setMyData({ inchangename: true, albumtitle: info.name});
  }
  uploadPhotos() {
    wx.navigateTo({
      url: '/pages/albumupload/albumupload?album_id=' + this.Base.options.id + "&group_id=" + this.Base.options.group_id,
    })
  }
  gotoPhotos() {
    wx.navigateTo({
      url: '/pages/albumphoto/albumphoto?album_id=' + this.Base.options.id + "&group_id=" + this.Base.options.group_id,
    })
  }
  deletePost(e) {
    var that = this;
    var id = e.currentTarget.id;
    var postApi = new PostApi();

    wx.showModal({
      title: '提示',
      content: '确定删除相片？',
      success(e) {
        if (e.confirm) {

          postApi.adelete({ idlist: id },
            data => {
              var data = [];
              var list = that.Base.getMyData().list;
              for (var i = 0; i < list.length; i++) {
                if (list[i].id != id) {
                  data.push(list[i]);
                }
              }
              that.Base.setMyData({ list: data });
            });
        }
      }
    })

  }

  likePost(e) {
    var that = this;
    var id = e.currentTarget.id;
    var postApi = new PostApi();
    postApi.like({ post_id: id }, ret => {
      if (ret.code == 0) {
        var list = that.Base.getMyData().list;
        for (var i = 0; i < list.length; i++) {
          if (id == list[i].id) {
            list[i].like = ret.return;
            break;
          }
        }
        that.Base.setMyData({ list: list });
      }
    });
  }
  cancelChange(){
    this.Base.setMyData({ inchangename: false});
  }
  confirmChange() {
    var albumtitle = this.Base.getMyData().albumtitle;
    var info = this.Base.getMyData().info;
    if(albumtitle.trim()==""){
      wx.showToast({
        title: '相册名称不能为空',
        icon:"none"
      });
      return;
    }
    var albumapi=new AlbumApi();
    albumapi.rename({album_id:info.id,name:albumtitle},()=>{},false);
    info.name=albumtitle;
    this.Base.setMyData({ inchangename: false,info:info });
  }
  inputAlbumTitle(e){
    this.Base.setMyData({ albumtitle:e.detail.value });
  }
}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad;
body.onShow = page.onShow;
body.uploadPhoto = page.uploadPhoto;
body.viewPhotos = page.viewPhotos;
body.changeAlbumName = page.changeAlbumName;
body.uploadPhotos = page.uploadPhotos;
body.gotoPhotos = page.gotoPhotos;
body.deletePost = page.deletePost; 
body.likePost = page.likePost; 
body.scrollevent = page.scrollevent; 
body.inputAlbumTitle = page.inputAlbumTitle;
body.cancelChange = page.cancelChange; 
body.confirmChange = page.confirmChange;
body.inputAlbumTitle = page.inputAlbumTitle;

Page(body)