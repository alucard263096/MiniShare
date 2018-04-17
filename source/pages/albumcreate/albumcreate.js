// pages/forcopy/forcopy.js
import { AppBase } from "../../app/AppBase";
import {AlbumApi} from "../../apis/album.api";
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.groud_id=5;
    if(options.id==undefined){
      options.id=0;
    }
    this.Base.Page = this;
    super.onLoad(options);
    var api = new AlbumApi();
    api.catlist({},(cats)=>{
      this.Base.setMyData({cats:cats});
    });
    this.Base.setMyData({ cover: "", name:""});
  }
  onShow() {
    var that = this;
    super.onShow();
  }
  changeName(e){
    console.log(e);
    var val=e.detail.value;
    this.Base.setMyData({ name: val });
  }
  changeLabel(e){
    var id=e.currentTarget.id;
    var cats = this.Base.getMyData().cats;
    for(var i=0;i<cats.length;i++){
      if(cats[i].id==id){
        cats[i].active=true;
      }else{
        cats[i].active=false;
      }
    }
    this.Base.setMyData({ cats: cats });
  }
  changeCover(){
    this.Base.uploadImage("album",(ret)=>{

      this.Base.setMyData({ cover: ret });
    },1);
  }
  createAlbum(){
    var cat_id=0;
    var cats = this.Base.getMyData().cats;
    for (var i = 0; i < cats.length; i++) {
      if (cats[i].active == true) {
        cat_id = cats[i].id;
      }
    }
    var name = this.Base.getMyData().name.trim();
    var cover = this.Base.getMyData().cover;
    if(name==""){
      this.Base.info("请输入相册名称");
      return;
    }
    var json={cat_id:cat_id,name:name,cover:cover,group_id:this.Base.options.group_id,primary_id:this.Base.options.id};
    var api = new AlbumApi();
    api.create(json,(ret)=>{
      if(ret.code==0){
        
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