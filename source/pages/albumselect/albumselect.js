// pages/album/album.js
import { AppBase } from "../../app/AppBase";
import { GroupApi } from "../../apis/group.api.js";
import { AlbumApi } from "../../apis/album.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.group_id = 484;
    //options.photoids = "1,2,3";
    this.Base.Page = this;
    super.onLoad(options);
    this.Base.setMyData({ group_id: options.group_id, photoids: options.photoids });
  }
  onShow() {
    var that = this;
    super.onShow();
    var albumapi = new AlbumApi();
    albumapi.list({ group_id: this.Base.options.group_id, photoids: this.Base.options.photoids }, data => {
      that.Base.setMyData({ myalbum: data });
    });

    var groupapi = new GroupApi();
    groupapi.detail({ id: this.Base.options.group_id }, data => {

      that.Base.setMyData({ group: data });
    });

  }
  selectMove(e){
    var id=e.currentTarget.id;
    var api = new AlbumApi();
    var photoids = this.Base.getMyData().photoids;
    console.log(photoids);
    api.movephoto({ album_id: id, photoids: photoids},(ret)=>{
      if(ret.code==0){
        wx.showToast({
          title: '移动成功',
        })
        wx.navigateBack({
          
        });
        
      }else{

        wx.showToast({
          title: '移动失败，请联系管理员',
          icon:"none"
        })
      }
    })
  }
}
var page = new Content();
var body = page.generateBodyJson(); 
body.onLoad = page.onLoad;
body.onShow = page.onShow;
body.selectMove = page.selectMove;
Page(body)