/*********************************************************************************
*  WEB700 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: LAVANYA SASIKALA Student ID: 156621211 Date: 17/06/2023
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var path = require("path");
var collegeData = require("./modules/collegeData.js");  //importing collegeData.js module.
var app = express();

// setup a 'route' to listen on the default url path
app.get("/students", (req, res) => {
    // Retrieving all students
    collegeData.getAllStudents()
    .then((students)=>{
        if(req.query.course){
            //If query parameter course is provide, filter student sby course.
            return collegeData.getStudentsByCourse(parseInt(req.query.course));
        }
        else{
            //If no query parameter, return all students
            return students;
        }
    })
    .then((filteredStudents)=>{
        if(filteredStudents.length===0){
            //If no data found, return statu scode 404 and the message "No results found".
            res.status(404).json({message:"No results found"});
        } else{
            res.json(filteredStudents)
        }
    })
    .catch((err)=> {
        //If an error occured, return status code 500 and the error message
        res.status(500).json({error:err});
    });
    
});
app.get("/tas", (req,res)=>{
    collegeData.getTAs()
    //Retrieve all teaching assistants
        .then((tas) => {
        if(tas.length === 0){
            //If No TAs found, return the message No results.
            res.json({message:"no results"});
        } else{
            //Return TAs

            res.json(tas);
    }
})
        .catch((error) =>{
            //If an error occured, return the message no results
        res.json({message : "no results"});
    });

});
app.get("/courses",(req,res) =>{
    collegeData.getCourses()
    //Retrieve courses
    .then(courses => {
        //Return the courses
        res.json(courses);
    })
    .catch(() => {
        //If an error occurs, return the error message.
        res.json({ message : "no results"});
    });
});
app.get("/student/:num", (req,res) =>{
    const studentNum = req.params.num;
    //retrieve the student number from the request and gte the student by the number.
    collegeData.getStudentByNum(studentNum)
    .then(student => {
        //Return the student number.
        res.json(student);
    })
    .catch(() => {
        //If error, return a message.
        res.json({message : "no results"});
    });
    
});
app.get ("/", (req,res) =>{
    const filePath = path.join(__dirname,"views","home.html");  //File path for home.html
    res.sendFile(filePath);
});
app.get("/about", (req,res) =>{
    const filePath = path.join(__dirname,"views","about.html");   //File path for about.html
    res.sendFile(filePath);
});
app.get("/htmlDemo", (req,res) =>{
    const filePath = path.join(__dirname,"views","htmlDemo.html");  //File path for htmlDemo.html
    res.sendFile(filePath);
});

app.use((req,res) =>{
    res.status(404).send("Page Not Found");    //Message if there is no matching routes
});

// setup http server to listen on HTTP_PORT
collegeData.initialize()
.then(() =>{
    app.listen(HTTP_PORT,()=>{console.log("Server listening on port:"+HTTP_PORT)
});
})
.catch((err) => {

    console.error("Error initializin data.",err);   //Message to dispaly if the data initialization fails.
});
