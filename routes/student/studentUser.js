var express = require('express');
var router = express.Router();
var studentUserModel=require('../../modules/studentUser');
var teacherModel=require('../../modules/teacher');
var adminUserModel=require('../../modules/adminUser');
var totalAdminClass=require('../../modules/totalAdminClass');

var bodyParser = require('body-parser');
var path = require('path');

var bcrypt =require('bcryptjs');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
const { check, validationResult } = require('express-validator');
router.use(express.static(__dirname+"./public/"));

function checkStudent_Email(req,res,next){
  var email=req.body.email;
  var checkEmail=studentUserModel.findOne({email:email});
  checkEmail.exec((err,data)=>{
  if(err) throw err;
  if(data){
    return res.send({redirectTo:"Email Already Exit!"});
  }
 next();
  });
}
function checkTeacher_Email(req,res,next){
  var email=req.body.email;
  var checkEmail=teacherModel.findOne({email:email});
  checkEmail.exec((err,data)=>{
  if(err) throw err;
  if(data){
    return res.send({redirectTo:"Email Already Exit!"});
  }
 next();
  });
}
function checkAdmin_Email(req,res,next){
  var email=req.body.email;
  var checkEmail=adminUserModel.findOne({email:email});
  checkEmail.exec((err,data)=>{
  if(err) throw err;
  if(data){
    return res.send({redirectTo:"Email Already Exit!"});
  }
 next();
  });
}
function checkStudent_Id(req,res,next){
  var school_key = req.session.school_session_key;
  var student_id = req.body.student_id;
  var checkEmail=studentUserModel.findOne({student_id:student_id,school_key:school_key});
  checkEmail.exec((err,data)=>{
  if(err) throw err;
  if(data){
    return res.send({redirectTo:"Student Id Already Exit!"});
  }
 next();
  });
}

function checkStudent_Count(req,res,next){
  var school_key = req.session.school_session_key;
  var check=adminUserModel.findOne({school_key:school_key});
  check.exec((err,data)=>{
    var student_count = data.student_count;
  var check=studentUserModel.find({school_key:school_key}).countDocuments();
  check.exec((err,dacCount)=>{
  if(student_count==dacCount){
    return res.send({redirectTo:"Student's Limit Already Use,Please Upgrade Your Plan!"});
  }
 next();
  });
  });
}

function checkConfirmPass(req,res,next){
  var password=req.body.password;
  var confpassword=req.body.confpassword;
  if(password !=confpassword){
    return res.send({redirectTo:"Password not matched!"});
  }
  next();
}

router.get('/', function(req, res,) {
  var totalClass=totalAdminClass.find({});
  totalClass.exec((err,data)=>{
    if(err) throw err;
    res.render('./student/studentUserClass', { title: 'Student-User Details',records:data});
  });
});

router.get('/:id', function(req, res,) {
    var class_name=req.params.id;
    res.render('./student/studentUser', { title: 'TechBista Solutions',});
    
  router.post('/'+class_name+'/post',checkStudent_Email,checkTeacher_Email,checkAdmin_Email,checkConfirmPass,checkStudent_Id,checkStudent_Count,function(req, res,) {
    var school_key = req.session.school_session_key;
    var student_name=req.body.student_name;
    var email=req.body.email; 
    var student_id = req.body.student_id;
    var password=req.body.password;
    var status="disabled";
    password =bcrypt.hashSync(req.body.password,10); 
      var userDetails=new studentUserModel({
        school_key:school_key,
        student_name:student_name,
        email:email,
        class_name:class_name,
        student_id:student_id,
        password:password,
        status:status,
      });
      userDetails.save((err,doc)=>{
        if(err) throw err;
        res.send({redirectTo:"Student-User Details Inserted Successfully!"});
      }); 
    
  });
});

module.exports = router;