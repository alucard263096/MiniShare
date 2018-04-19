// pages/vote/vote.js
import { AppBase } from "../../app/AppBase";
import { VoteApi } from "../../apis/vote.api.js";
import { NoticeApi } from "../../apis/notice.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    options.group_id = 2;
    options.title = "咫尺之星投票";
    this.Base.Page = this;
    super.onLoad(options);

    this.Base.setMyData({ title: options.title, startdate: AppBase.Util.getNowDateFormat(), starttime: "00:00:00", enddate: AppBase.Util.getNextDateFormat(), endtime: "00:00:00", questions: [{ question: "", options: [{ str: "", photo: "" }, { str: "", photo: "" }]}]});
    
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
    questions.push({ question: "", options: [{ str: "", photo: "" }, { str: "", photo: "" }] });

    this.Base.setMyData({ questions: questions });
  }
  bindStartDateChange(e){

    this.Base.setMyData({ startdate: e.detail.value });
  }
  bindStartTimeChange(e) {

    this.Base.setMyData({ starttime: e.detail.value });
  }
  bindEndDateChange(e) {

    this.Base.setMyData({ enddate: e.detail.value });
  }
  bindEndTimeChange(e) {
    this.Base.setMyData({ endtime: e.detail.value });
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
    voteapi.create({startdate:startdate,enddate:enddate,questions:JSON.stringify(),group_id:this.Base.options.group_id},(ret)=>{
      if(ret.code=="0"){
        
      }
    });
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


Page(body)