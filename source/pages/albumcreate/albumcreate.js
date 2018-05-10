// pages/forcopy/forcopy.js
import { AppBase } from "../../app/AppBase";
import {AlbumApi} from "../../apis/album.api";
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.groud_id=5;
    //if (options.id==undefined){
    //  options.id=0;
    //}
    this.Base.Page = this;
    super.onLoad(options);
    this.Base.setMyData({ cover: "", name: "", cat_id: 0,cats:[]});
  }
  onShow() {
    var that = this;
    super.onShow();
    var api = new AlbumApi();
    api.catlist({}, (cats) => {
      this.Base.setMyData({ cats: cats });
    });
    if (this.Base.options.id > 0) {
      var albumapi = new AlbumApi();
      albumapi.detail({ group_id: this.Base.options.group_id, id: this.Base.options.id }, data => {
        that.Base.setMyData({ cover:data.cover,name:data.name,cat_id:data.cat_id });
      });
    }
  }
  changeName(e){
    console.log(e);
    var val=e.detail.value;
    this.Base.setMyData({ name: val });
  }
  changeLabel(e){
    var cat_id=e.currentTarget.id;
    var cats = this.Base.getMyData().cats;
    for(var i=0;i<cats.length;i++){
      if (cats[i].id == cat_id) {
        this.Base.setMyData({ cat_id: cat_id,name:cats[i].name,cover:cats[i].cover });
        break;
      }
    }
  }
  changeCover(){
    this.Base.uploadImage("album",(ret)=>{

      this.Base.setMyData({ cover: ret });
    },1);
  }
  createAlbum(){
    
    var name = this.Base.getMyData().name.trim();
    var cover = this.Base.getMyData().cover;
    var cat_id = this.Base.getMyData().cat_id;
    if(name==""){
      this.Base.info("请输入相册名称");
      return;
    }
    var json = { cat_id: cat_id, name: name, cover: cover, group_id: this.Base.options.group_id};
    if(this.Base.options.id!=undefined){
      json.primary_id=this.Base.options.id
    }
    var api = new AlbumApi();
    api.create(json,(ret)=>{
      if(ret.code==0){
        wx.navigateBack({
          
        })
      }
    });
  }
}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad;
body.onShow = page.onShow;
body.changeName = page.changeName; 
body.changeLabel = page.changeLabel; 
body.changeCover = page.changeCover; 
body.createAlbum = page.createAlbum;
Page(body)