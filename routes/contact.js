const express = require('express')
const router = express.Router()


router.post('/hasFilledBasicDetails',async(req,res)=>{
    console.log(JSON.stringify(req.body))
    const data = req.body.uid
    const conn = req.app.get('conn')
   
    conn.sobject("Contact").find({Fid__c:data}).limit(1).execute(function(err, records) {
        if (err) { return console.error(err); }
        if(records[0].Total_Experience__c===null){
            console.log('EXperience is null')
            res.status(200).json({status:false,msg:"Fill Basic Activity"})
        }else{
            console.log('Has record')
            res.status(200).json({status:true,empStatus:records[0].Employed_Status__c})
        }
      });
})
router.get('/getPicklistValues', async (req, res) => {
    const conn = req.app.get('conn');

    let contactFields = ["Total_Experience__c", "Qualification__c"]
    let roleField = ["Role__c"]
    let data = [{ Obj: 'Contact', fList: contactFields },{obj:'Candidate_Experience__c',fList:roleField}]
    let body = { data: data }

    conn.apex.post("/getPicklistVal/", body, function (err, result) {
        if (err) { return console.error(err)}
        console.log(result)
        res.status(200).json({'res':result.toString()})
    });
})


router.post('/saveBasicDetails', async (req, res) => {
    const conn = req.app.get('conn');
    const data = {
        uid:req.body.uid,
        experience:req.body.experience,
        qualification:req.body.qualification,
        empStatus:req.body.empStatus,
        collegeOrCompanyName:req.body.collegeOrCompanyName
    }
    console.log("DataFrom REact "+JSON.stringify(data))

    conn.sobject("Contact").find({Fid__c:data.uid}).limit(1).execute(function(err, records) {
        if (err) { return console.error(err); }
        if(data.empStatus==='true'){
            records[0].Employed_Status__c = true
            records[0].Company_Name__c = data.collegeOrCompanyName
            records[0].College_Name__c = ''

        }else{
            records[0].Employed_Status__c = false
            records[0].College_Name__c = data.collegeOrCompanyName
            records[0].Company_Name__c = ''
        }
        records[0].Total_Experience__c = data.experience
        records[0].Qualification__c = data.qualification

        conn.sobject("Contact").update({
            Id:records[0].Id,
            Employed_Status__c:records[0].Employed_Status__c,
            Company_Name__c:records[0].Company_Name__c,
            College_Name__c:records[0].College_Name__c,
            Total_Experience__c:records[0].Total_Experience__c,
            Qualification__c:records[0].Qualification__c
            
        }, function(err, ret) {
          if (err || !ret.success) { res.status(200).json({status:false,msg:ret.toString()}) }
          res.status(200).json({status:true,res:ret.toString()})
        });
      });
})

router.post('/createExperience',async(req,res)=>{
    const conn = req.app.get('conn');
    const data = {
        uid:req.body.uid,
        companyName:req.body.companyName,
        startDate:req.body.startDate,
        endDate:req.body.endDate,
        role:req.body.role,
        responsibility:req.body.responsibility
    }
    console.log("SENDING FROM REWACT "+JSON.stringify(data))
    conn.sobject("Contact").find({Fid__c:data.uid}).limit(1).execute(function(err, records) {
        if (err) { return console.error(err); }
        let contact_exp = {Contact__c:records[0].Id,Start_Date__c:Date.parse(data.startDate),End_Date__c:Date.parse(data.endDate),Role__c:data.role,Responsibilty__c:data.responsibility}
        conn.sobject('Candidate_Experience__c').create(contact_exp,{ allowRecursive: true },function(err, rets) {
            if(rets){
                console.log(rets.toString())
                res.status(200).json({'status':true,'result':rets.toString()})
            }else{
                console.log(err.toString())
                res.status(400).json({'status':false,'Error':err})
            }
        })
      });
})

router.post('/saveDocuments',async(req,res)=>{
    const conn = req.app.get('conn');
    const data = {
        uid:req.body.uid,
        resumeUrl:req.body.resumeUrl,
        cvUrl:req.body.cvUrl
    }
    conn.sobject("Contact").find({Fid__c:data.uid}).limit(1).execute(function(err, records) {
        if (err) { return console.error(err); }
        records[0].Resume_URL__c = data.resumeUrl
        records[0].CV_URL__c = data.cvUrl

        conn.sobject("Contact").update({
            Id:records[0].Id,
            Resume_URL__c:records[0].Resume_URL__c,
            CV_URL__c:records[0].CV_URL__c
        }, function(err, ret) {
          if (err || !ret.success) { res.status(200).json({status:false,msg:ret.toString()}) }
          res.status(200).json({status:true,res:ret.toString()})
        });
      });
})

module.exports = router;