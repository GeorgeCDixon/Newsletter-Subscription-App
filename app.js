const express =require("express");
const bodyParser=require("body-parser");
const request =require("request");
const client = require("@mailchimp/mailchimp_marketing");
const https =require("https");


const app=express();

//Getting static folders
app.use(express.static("public"));

//Using bodyparser
app.use(bodyParser.urlencoded({extended:true}));

//Showing signup.html as root
app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html");
});


//Assigning to posted inputs to variable
app.post("/", function(req,res){
    const firstName= req.body.firstName;
    const lastName =req.body.lastName;
    const email = req.body.email;

    //passing posted data to mailchimp API
    const data ={
        members:[{
            email_address: email,
            status:"subscribed",
            merge_fields:{
                FNAME:firstName,
                LNAME:lastName
            }
        }]
    };

    const jsonData =JSON.stringify(data);

    const url='https://us21.api.mailchimp.com/3.0/lists/5885bd7970';

    const option={
        method:"POST",
        auth:"george1:1b9f4ef434ce64ab8c9357716d17244d-us21"
    }


    const request = https.request(url, option, function(response){

        if(response.statusCode ===200){
           res.sendFile(__dirname+"/success.html");
        }
        else{

            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        })

    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req,res){
    res.redirect("/")
});



app.listen(process.env.PORT || 3000, function(){
    console.log("App running in Port 3000");
});

//API Key
//1b9f4ef434ce64ab8c9357716d17244d-us21

//Audience unique id / list id 5885bd7970
