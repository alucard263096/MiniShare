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
    //options.album_id = 32;
    //options.group_id = 480;
    this.Base.Page = this;
    super.onLoad(options);
    this.Base.setMyData({ list:{name:"",photos:[]}, inmgr: false, selectids:[] });
  }
  onShow() {
    var that = this;
    super.onShow();

    var api = new GroupApi();
    api.allphotos({ album_id: this.Base.options.album_id,group_id:this.Base.options.group_id }, data => {
      that.Base.setMyData({ list: data, selectids: [] });
    });
  }
  uploadPhotos() {
    wx.navigateTo({
      url: '/pages/albumupload/albumupload?album_id=' + this.Base.options.album_id + "&group_id=" + this.Base.options.group_id,
    })
  } 
  changeToMgr(){
    this.Base.setMyData({ inmgr: true });
  }
  cancelMgr() {
    this.Base.setMyData({ inmgr: false });
  }
  selectImage(e){
    var selectids=[];
    var id=e.currentTarget.id;
    var list = this.Base.getMyData().list;
    for(var i=0;i<list.photos.length;i++){
      for (var j = 0; j < list.photos[i].photos.length;j++){
        if (list.photos[i].photos[j].id==id ){
          list.photos[i].photos[j].selected = list.photos[i].photos[j].selected==true?false:true;;
        }
        if (list.photos[i].photos[j].selected==true){
          selectids.push(list.photos[i].photos[j].id);
        }
      }
    }
    this.Base.setMyData({ list: list, selectids: selectids });
  }
  deletePhoto(){
    var selectids = this.Base.getMyData().selectids;
    if(selectids.length==0){
      this.Base.info("请至少选择一张照片");
      return;
    }
    var str=selectids.join(",");
    var that=this;
    
    var api = new AlbumApi();
    wx.showModal({
      title: '提示',
      content: '确定删除选中的照片？',
      success(e){
        if(e.confirm){
          api.deletephoto({ ids: str }, data => {
            that.onShow();
          });
        }
      }
    })
  }
  move(){
    var ids=[];
    var list = this.Base.getMyData().list;
    var data = this.Base.getMyData();
    for (var i = 0; i < list.photos.length; i++) {
      for (var j = 0; j < list.photos[i].photos.length; j++) {
        if (list.photos[i].photos[j].selected == true) {
          ids.push(list.photos[i].photos[j].id);
        }
      }
    }
    wx.navigateTo({
      url: '/pages/albumselect/albumselect?group_id='+this.Base.options.group_id+"&photoids="+ids.join(","),
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    });
    this.Base.setMyData({ inmgr: false });
  }
  download(){
    var list = this.Base.getMyData().list;
    var data = this.Base.getMyData();
    for (var i = 0; i < list.photos.length; i++) {
      for (var j = 0; j < list.photos[i].photos.length; j++) {
        if (list.photos[i].photos[j].selected == true) {
          var url = data.uploadpath + "album/" + list.photos[i].photos[j].photo;

          wx.downloadFile({
            url: url, //仅为示例，并非真实的资源
            success: function (res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              if (res.statusCode === 200) {
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success() {
                      wx.showToast({
                        title: '已保存到本地',
						icon: 'none'
                      })
                    },
                    fail(resd) {
                      wx.showToast({
                        title: '下载失败，请授权后重新下载',
						icon: 'none'
                      })
                    }
                  });
              }
            },
            fail(res) {
              console.log(res);
            }
          })
          
        }
      }
    }
  }
}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad;
body.onShow = page.onShow;
body.changeDescription = page.changeDescription; 
body.chooseImage = page.chooseImage;
body.uploadToAlbum = page.uploadToAlbum; 
body.uploadPhotos = page.uploadPhotos; 
body.changeToMgr = page.changeToMgr; 
body.cancelMgr = page.cancelMgr; 
body.selectImage = page.selectImage; 
body.deletePhoto = page.deletePhoto;
body.download = page.download;
body.move = page.move;

Page(body)