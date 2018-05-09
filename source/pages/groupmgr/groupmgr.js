// pages/group/group.js
import { AppBase } from "../../app/AppBase";
import { GroupApi } from "../../apis/group.api.js";
import { PostApi } from "../../apis/post.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }

  onLoad(options) {
    this.Base.Page = this;
    //options.id = 483;
    super.onLoad(options);
    this.Base.setMyData({ list: [] });
  }

  onShow() {
    var that = this;
    super.onShow();
    var groupapi = new GroupApi();
    groupapi.detail({ id: this.Base.options.id }, data => {
      that.Base.setMyData({ info: data });
    });
  }
  transManage(e){
    var dataset=e.currentTarget.dataset;
    var member_id = dataset.member_id;
    var openid = dataset.openid;

    var that = this;

    var groupapi = new GroupApi();
    groupapi.trans({ newmgr_id: member_id }, data => {
      if(data.code==0){

        var data = that.Base.getMyData();
        var info = data.info;
        info.adminmember_id = member_id;
        info.adminmember_id_name = openid;
        that.Base.setMyData({ info: info });
      }
    });



  }
  groupnameFocus(e){
    console.log(e);
    this.Base.setMyData({ group_nameonfocus:true});
  }
  groupnameBlur(e) {
    console.log(e);
    this.Base.setMyData({ group_nameonfocus: false });
  }
  groupnameChange(e){
    var info=this.Base.getMyData().info;
    info.group_name=e.detail.value;
    var groupapi = new GroupApi();

    groupapi.changename({ id: info.id, name: info.group_name }, data => {
      if (data.code == 0) {
      }
    },false);

    this.Base.setMyData({ info: info });
  }
  membernameChange(e) {
    var info = this.Base.getMyData().info;
    info.member_name = e.detail.value;
    var groupapi = new GroupApi();

    groupapi.changemembername({ id: info.id, name: info.member_name }, data => {
      if (data.code == 0) {
      }
    }, false);

    this.Base.setMyData({ info: info });
  }
  exitGroup(){
    var that=this;
    wx.showModal({
      title: '提示',
      content: '是否确定退出群空间？',
      success(e){
        if(e.confirm){
          var groupapi = new GroupApi();

          groupapi.quit({ id: that.Base.options.id }, data => {
            if (data.code == 0) {
              wx.redirectTo({
                url: '/pages/index/index',
              })
            }
          }, false);
        }
      }
    })
  }
}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad;
body.onShow = page.onShow; 
body.transManage = page.transManage; 
body.groupnameFocus = page.groupnameFocus; 
body.groupnameBlur = page.groupnameBlur;
body.groupnameChange = page.groupnameChange;
body.membernameChange = page.membernameChange;
body.exitGroup = page.exitGroup;

Page(body)