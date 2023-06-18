var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var path = require("path");
var collegeData = require("./modules/collegeData.js");  //importing collegeData.js module.
var app = express();

// setup a 'route' to listen on the default url path
app.get("/students", (req, res) => {
    collegeData.getAllStudents()
    .then((students)=>{
        if(req.query.course){
            return collegeData.getStudentsByCourse(parseInt(req.query.course));
        }
        else{
            return students;
        }
    })
    .then((filteredStudents)=>{
        if(filteredStudents.length===0){
            res.status(404).json({message:"No results"});
        } else{
            res.json(filteredStudents)
        }
    })
    .catch((err)=> {
        res.status(500).json({error:err});
    });
    
});
app.get("/tas", (req,res)=>{
    collegeData.getTAs()
        .then((tas) => {
        if(tas.length === 0){
            res.json({message:"no results"});
        } else{

            res.json(tas);
    }
})
        .catch((error) =>{
        res.json({message : "no results"});
    });

});
app.get("/courses",(req,res) =>{
    collegeData.getCourses()
    .then(courses => {
        res.json(courses);
    })
    .catch(() => {
        res.json({ message : "no results"});
    });
});
app.get("/student/:num", (req,res) =>{
    const studentNum = req.params.num;
    collegeData.getStudentByNum(studentNum)
    .then(student => {
        res.json(student);
    })
    .catch(() => {
        res.json({message : "no results"});
    });
    
});
app.get ("/", (req,res) =>{
    const filePath = path.join(__dirname,"views","home.html");
    res.sendFile(filePath);
});
app.get("/about", (req,res) =>{
    const filePath = path.join(__dirname,"views","about.html");
    res.sendFile(filePath);
});
app.get("/htmlDemo", (req,res) =>{
    const filePath = path.join(__dirname,"views","htmlDemo.html");
    res.sendFile(filePath);
});

app.use((req,res) =>{
    res.status(404).send("Page Not Found");
});

// setup http server to listen on HTTP_PORT
collegeData.initialize()
.then(() =>{
    app.listen(HTTP_PORT,()=>{console.log("Server listening on port:"+HTTP_PORT)
});
})
.catch((err) => {
    console.error("Error initializin data.",err);
});
