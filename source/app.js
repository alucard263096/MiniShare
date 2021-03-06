//app.js
import { MemberApi } from "apis/member.api";
import { WechatApi } from "apis/wechat.api";
import { GroupApi } from "apis/group.api"; 
import { ApiConfig } from "apis/apiconfig.js";
import { AppBase } from "app/AppBase.js";
App({
  onLaunch: function (options) {
    // 展示本地存储能力
    console.log("on app launch");
    console.log(options);
    
  },
  onShow: function (options) {
    // Do something when show.
    console.log("on app show");
    console.log(options);
    this.globalData.goout=false;
    if (options.scene == 1044&&options.isSticky==false) {
      console.log("openin1033");
      wx.getShareInfo({
        shareTicket: options.shareTicket,
        success: function (res) {
          console.log("res");
          console.log(res);
          wx.login({
            withCredentials: true,
            success: function (loginres) {
              //{ code: loginres.code, grant_type: "authorization_code" }

              var encryptedData = res.encryptedData;
              var iv = res.iv;
              var wechatapi = new WechatApi();
              res.code = loginres.code;
              res.grant_type = "authorization_code";

              wechatapi.decrypteddata(res, data => {
                if (data.code == 0) {
                  AppBase.UserInfo.openid = data.return.openid;
                  ApiConfig.SetToken(data.return.openid);
                  var openGId = data.return.openGId;
                  console.log("openg");
                  console.log(openGId);
                  var groupapi = new GroupApi();
                  groupapi.join({ opengid: openGId }, data => {
                    wx.navigateTo({
                      url: "/pages/group/group?id="+data.return,
                    })
                  });
                }

              });

            }
          })
        }
      })
    } else if (options.scene == 1007){
      this.globalData.goout=true;
      wx.redirectTo({
        url: '/pages/index/index',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      });
    }else{
    }
  },
  globalData: {
    userInfo: null,
    goout:false
  }
})