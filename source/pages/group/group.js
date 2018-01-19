// pages/group/group.js
import { AppBase } from "../../app/AppBase";
import { GroupApi } from "../../apis/group.api.js";
import { PostApi } from "../../apis/post.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }

  onLoad(options) {
    options.id=12;
    this.Base.Page = this;
    super.onLoad(options);
    this.Base.setMyData({list:[]});
  }

  onShow() {
    var that = this;
    super.onShow();
    var groupapi=new GroupApi();
    groupapi.detail({id:this.Base.options.id},data=>{
      that.Base.setMyData({info:data});
    });
    var postApi = new PostApi();
    var data=this.Base.getMyData();
    var json={
      group_id: this.Base.options.id,
      update_lasttime:data.newgettime,
      gettype:"new"
    };
    if (data.newgettime==undefined){
      json.update_lasttime = "";
      json.gettype = "";
    }
    
    postApi.list(json,
      data => {
        var list = this.Base.getMyData().list;
        for(i=0;i<list.length;i++){
          data.push(list[0]);
        }
        if(data.length>0){
          that.Base.setMyData({ list: data, newgettime: data[0].updated_date,lastgettime:data[data.length-1].updated_date });
        }
      });
  }

  gotoAlbum(){
    wx.navigateTo({
      url: '/pages/album/album?group_id='+this.Base.options.id,
    })
  }

}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad; 
body.onShow = page.onShow;
body.gotoAlbum = page.gotoAlbum;
Page(body)