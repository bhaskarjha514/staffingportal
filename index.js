const express = require('express')
const jsForce = require('jsforce')
var cors = require("cors");
const path = require('path');
require('dotenv').config()
const app = express()


app.use(express.json())
app.use(cors());
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, './Client/build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, './Client/build/index.html'));
});

const {SF_LOGIN_URL, SF_USERNAME, SF_PASSWORD, SF_TOKEN} = process.env
const PORT = process.env.PORT||3001

const conn = new jsForce.Connection({
    loginUrl:SF_LOGIN_URL
})

app.set('conn',conn)

conn.login(SF_USERNAME,SF_PASSWORD+SF_TOKEN,(err,userInfo)=>{
    if(err) console.error(err)
    else console.log(`User Id: ${userInfo.id} OrgId: ${userInfo.organizationId}`)
})

// ROUTES
const contactRoutes = require('./routes/contact')
const accountRoutes = require('./routes/account')


app.get('/accounts',(req,res)=>{
    conn.query("SELECT Id, Name From Account",(err,result)=>{
        if(err) res.status(400).json({
            msg: 'Fail!',
            error: err
        })
        else{
            res.status(200).json({
                total_records: result.totalSize,
                records: result.records
            })
        }
    })
})


app.use('/contact',contactRoutes)
//app.use('/account',accountRoutes)

app.post('/createUser',async(req,res,next)=>{
   
    const userType = req.body.userType
    const email = req.body.email
    const profilePic = req.body.profilePic
    const uid = req.body.uid
    const username = req.body.username

    try {
        if(userType==="candidate"){
            let firstName = username.toString().split(" ")[0]
            let lastName = username.toString().split(" ")[1]

            console.log(`FirstName: ${firstName} LastName: ${lastName}`)

            let contact = {FirstName:firstName,LastName:lastName,Email:email,Fid__c:uid,FProfilePic__c:profilePic}
            await conn.sobject('Contact').create(contact,{ allowRecursive: true },function(err, rets) {
                if(rets){
                    res.status(200).json({'status':true,'result':rets})
                }else{
                    res.status(400).json({'status':false,'Error':err})
                }
              })
           
        }else{
            let account = {Name:username,Email__c:email,Fid__c:uid,FProfilePic__c:profilePic}
             await conn.sobject('Account').create(account,{ allowRecursive: true },function(err, rets) {
                if(rets){
                    res.status(200).json({'status':true,'result':rets})
                }else{
                    res.status(400).json({'status':false,'error':err})
                }
              })
        }
    } catch (error) {
        console.error(error)
        res.status(400).json({'status':false,'error':error})
    }
})

app.listen(PORT, () => { console.log(`Server running at http://localhost:` + PORT) })
