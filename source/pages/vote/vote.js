// pages/vote/vote.js
import { AppBase } from "../../app/AppBase";
import { VoteApi } from "../../apis/vote.api.js";
import { NoticeApi } from "../../apis/notice.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.group_id = 480;
    if(options.title!=undefined){
      options.title = JSON.parse(options.title);
    }
   //options.title = "咫尺之星投票";
    this.Base.Page = this;
    super.onLoad(options);

    var d=new Date();
    var h=d.getHours();
    h = h > 9 ? h.toString() : "0" + h.toString();
    var m = d.getMinutes();
    m = m > 9 ? m.toString() : "0" + m.toString();

    this.Base.setMyData({
      votetitle:"",
      hiddenmodalput:options.title!=undefined,
      title: options.title, nowformat: AppBase.Util.getNowDateFormat(), startdate: AppBase.Util.getNowDateFormat(), starttime: h + ":" + m, enddate: AppBase.Util.getNextDateFormat(), endtime: h + ":" + m, 
      noname: "N", remarkinfo: "N", onlygroup: "N", 
      remarkinfoname: "Y",
      remarkinfomobile: "Y",
      remarkinfoemail: "N",
      remarkinfoaddress: "N",
      votetypearray: ["单选","多选"],
    questions: [{ question: "",votetype:0, options: [{ str: "", photo: "" }, { str: "", photo: "" }]}]});
    
  }
  onShow() {
    var that = this;
    super.onShow();
  }
  changeQuestion(e){
    var question=e.detail.value;
    var id=e.currentTarget.id;
    var questions = this.Base.getMyData().questions;
    questions[id].question=question;
    this.Base.setMyData({questions:questions});
  }
  votetypeChange(e) {
    var gtg = e.detail.value;
    var id = e.currentTarget.id;
    var questions = this.Base.getMyData().questions;
    questions[id].votetype = gtg;
    this.Base.setMyData({ questions: questions });
  } 
  changeOption(e){
    var str = e.detail.value;
    var id = e.currentTarget.id;
    id=id.split("_");
    var i = Number(id[0]);
    var j = Number(id[1]);

    var questions = this.Base.getMyData().questions;
    questions[i].options[j].str = str;
    this.Base.setMyData({ questions: questions });
  }
  minusOpt(e){
    var id = e.currentTarget.id;
    id = id.split("_");
    var i = Number(id[0]);
    var j = Number(id[1]);
    var questions = this.Base.getMyData().questions;

    var c=[];
    for (var jj = 0; jj < questions[i].options.length;jj++){
      if(jj!=j){
        c.push(questions[i].options[jj]);
      }
    }
    questions[i].options = c;
    this.Base.setMyData({ questions: questions });
  }
  addOpt(e){
    var id = e.currentTarget.id;
    var questions = this.Base.getMyData().questions;
    questions[id].options.push({ str: "", photo: "" });

    this.Base.setMyData({ questions: questions });
  }
  addPhoto(e){
    var id = e.currentTarget.id;
    id = id.split("_");
    var i = Number(id[0]);
    var j = Number(id[1]);
    var questions = this.Base.getMyData().questions;

    this.Base.uploadImage("vote",(ret)=>{
      questions[i].options[j].photo = ret;
      this.Base.setMyData({ questions: questions });
    },1);
  }

  cutQuestion(e){

    var id = e.currentTarget.id;
    var questions = this.Base.getMyData().questions;
    //questions[id].options.push({ str: "", photo: "" });
    var c=[];
    for(var i=0;i<questions.length;i++){
      if(i!=id){
        c.push(questions[i]);
      }
    }
    this.Base.setMyData({ questions: c });
    
  }
  addQuestion(){
    var questions = this.Base.getMyData().questions;
    questions.push({ question: "",votetype:"0", options: [{ str: "", photo: "" }, { str: "", photo: "" }] });

    this.Base.setMyData({ questions: questions });
  }
  bindStartDateChange(e){
    this.Base.setMyData({ startdate: e.detail.value });
    this.refixDateTime();
  }
  bindStartTimeChange(e) {

    this.Base.setMyData({ starttime: e.detail.value });
    this.refixDateTime();
  }
  refixDateTime(){
    var d = new Date();
    var h = d.getHours();
    h = h > 9 ? h.toString() : "0" + h.toString();
    var m = d.getMinutes();
    m = m > 9 ? m.toString() : "0" + m.toString();


    var sd = this.Base.getMyData().startdate + " " + this.Base.getMyData().starttime;
    var ed = this.Base.getMyData().enddate + " " + this.Base.getMyData().endtime;
    
    sd = AppBase.Util.StrToDate(sd+":00");
    ed = AppBase.Util.StrToDate(ed + ":00");
    var now=new Date();
    console.log(sd.getTime());
    console.log(now.getTime());
    if(sd.getTime()<now.getTime()){
      this.Base.setMyData({ startdate: AppBase.Util.getNowDateFormat(), starttime: h + ":" + m});
    }
    if (ed.getTime() < sd.getTime()) {
      this.Base.setMyData({ enddate: this.Base.getMyData().startdate, endtime: this.Base.getMyData().starttime });
    }
  }
  bindEndDateChange(e) {

    this.Base.setMyData({ enddate: e.detail.value });
    this.refixDateTime();
  }
  bindEndTimeChange(e) {
    this.Base.setMyData({ endtime: e.detail.value });
    this.refixDateTime();
  }
  sendVote(e){

    var startdate = this.Base.getMyData().startdate + " " + this.Base.getMyData().starttime;
    var enddate = this.Base.getMyData().enddate + " " + this.Base.getMyData().endtime;
    if (AppBase.Util.StrToDate(startdate).getTime() >= AppBase.Util.StrToDate(enddate).getTime()) {

      this.Base.info("开始时间不能大于结束时间");
      return;
    }

    var questions = this.Base.getMyData().questions;
    if(questions.length==0){
      this.Base.info("请至少设置一个题目");
      return;
    }
    for(var i=0;i<questions.length;i++){
      if(questions[i].question.trim()==""){
        this.Base.info("第"+(i+1)+"题的题目不能为空");
        return;
      }
      var actopt = 0;
      for (var j = 0; j < questions[i].options.length; j++) {
        if (questions[i].options[j].str.trim() != "" || questions[i].options[j].photo.trim() != "") {
          actopt++;
        }
      }
      if (actopt    <=1){
        this.Base.info("第" + (i + 1) +"题至少设置两个选项");
        return;
      }
    }
    var voteapi = new VoteApi();
    voteapi.create({
      startdate: startdate, enddate: enddate, questions: JSON.stringify(questions), group_id: this.Base.options.group_id,
      noname: this.Base.getMyData().noname, remarkinfo: this.Base.getMyData().remarkinfo, onlygroup: this.Base.getMyData().onlygroup,
      remarkinfoname: this.Base.getMyData().remarkinfoname,
      remarkinfomobile: this.Base.getMyData().remarkinfomobile,
      remarkinfoemail: this.Base.getMyData().remarkinfoemail,
      remarkinfoaddress: this.Base.getMyData().remarkinfoaddress  ,
      title: this.Base.getMyData().title},(ret)=>{
      if(ret.code=="0"){
        wx.redirectTo({
          url: '/pages/post/post?id='+ret.return,
        })
      }else{
        this.Base.info("发起失败，请联系管理员");
      }
    });
  }
  onlygroupChange(e){
    console.log(e);
    this.Base.setMyData({ onlygroup: this.Base.getMyData().onlygroup=="Y"?"N":"Y"});
  }
  nonameChange(e) {
    console.log(e);
    this.Base.setMyData({ noname: this.Base.getMyData().noname == "Y" ? "N" : "Y" });
  }
  remarkinfoChange(e) {
    console.log(e);
    this.Base.setMyData({ remarkinfo: this.Base.getMyData().remarkinfo == "Y" ? "N" : "Y" });
  }
  remarkinfonameChange(e) {
    console.log(e);
    this.Base.setMyData({ remarkinfoname: this.Base.getMyData().remarkinfoname == "Y" ? "N" : "Y" });
  }
  remarkinfomobileChange(e) {
    console.log(e);
    this.Base.setMyData({ remarkinfomobile: this.Base.getMyData().remarkinfomobile == "Y" ? "N" : "Y" });
  }
  remarkinfoemailChange(e) {
    console.log(e);
    this.Base.setMyData({ remarkinfoemail: this.Base.getMyData().remarkinfoemail == "Y" ? "N" : "Y" });
  }
  remarkinfoaddressChange(e) {
    console.log(e);
    this.Base.setMyData({ remarkinfoaddress: this.Base.getMyData().remarkinfoaddress == "Y" ? "N" : "Y" });
  }


  cancelCreate() {
    this.Base.setMyData({ hiddenmodalput: true });
    wx.navigateBack({
      
    })
  }
  confirmCreate() {
    var title = this.Base.getMyData().votetitle;
    if (title.trim() == "") {
      wx.showToast({
        title: '标题不能为空',
						icon: 'none'
      })
      return;
    }
    this.Base.setMyData({ hiddenmodalput: true,title:title });
    
  }
  inputVotetitle(e) {
    var name = e.detail.value;
    this.Base.setMyData({ votetitle: name });
  }
}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad; 
body.onShow = page.onShow; 
body.changeQuestion = page.changeQuestion; 
body.changeOption = page.changeOption;
body.minusOpt = page.minusOpt; 
body.addOpt = page.addOpt; 
body.addPhoto = page.addPhoto; 
body.cutQuestion = page.cutQuestion;
body.addQuestion = page.addQuestion;
body.bindStartDateChange = page.bindStartDateChange;
body.bindStartTimeChange = page.bindStartTimeChange; 
body.bindEndDateChange = page.bindEndDateChange;
body.bindEndTimeChange = page.bindEndTimeChange;
body.sendVote = page.sendVote;
body.onlygroupChange = page.onlygroupChange; 
body.nonameChange = page.nonameChange; 
body.remarkinfoChange = page.remarkinfoChange;
body.votetypeChange = page.votetypeChange;

body.remarkinfonameChange = page.remarkinfonameChange;
body.remarkinfomobileChange = page.remarkinfomobileChange; 
body.remarkinfoemailChange = page.remarkinfoemailChange;
body.remarkinfoaddressChange = page.remarkinfoaddressChange;
body.refixDateTime = page.refixDateTime;

body.cancelCreate = page.cancelCreate;
body.confirmCreate = page.confirmCreate;
body.inputVotetitle = page.inputVotetitle;

Page(body)