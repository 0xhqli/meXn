//mkModel start
//model template
const modelFile=(model)=>{
    return(
`const mongoose = require('mongoose');
const ${model[0].toUpperCase()+model.substring(1)}Schema = new mongoose.Schema({
    //Add model attributes here
});
const ${model[0].toUpperCase()+model.substring(1)} = mongoose.model('${model[0].toUpperCase()+model.substring(1)}', ${model[0].toUpperCase()+model.substring(1)}Schema);
module.exports = ${model[0].toUpperCase()+model.substring(1)};`)
}

//controller template
const controllerFile=(model)=>{
    return (
`const ${model[0].toUpperCase()+model.substring(1)} = require('../models/${model}.model');

module.exports.findAll${model[0].toUpperCase()+model.substring(1)}s = (req, res) => {
    ${model[0].toUpperCase()+model.substring(1)}.find()
        .then(allDa${model[0].toUpperCase()+model.substring(1)}s => res.json({ ${model}s: allDa${model[0].toUpperCase()+model.substring(1)}s }))
        .catch(err => res.json({ message: 'Something went wrong', error: err }));
};

module.exports.findOneSingle${model[0].toUpperCase()+model.substring(1)} = (req, res) => {
    ${model[0].toUpperCase()+model.substring(1)}.findOne({ _id: req.params.id })
        .then(oneSingle${model[0].toUpperCase()+model.substring(1)} => res.json({ ${model}s: oneSingle${model[0].toUpperCase()+model.substring(1)} }))
        .catch(err => res.json({ message: 'Something went wrong', error: err }));
}

module.exports.createNew${model[0].toUpperCase()+model.substring(1)} = (req, res) => {
    console.log(req.body)
    ${model[0].toUpperCase()+model.substring(1)}.create(req.body)
        .then(newlyCreated${model[0].toUpperCase()+model.substring(1)} => res.json({ ${model}: newlyCreated${model[0].toUpperCase()+model.substring(1)} }))
        .catch(err => res.json({ message: 'Something went wrong', error: err }));
}

module.exports.updateExisting${model[0].toUpperCase()+model.substring(1)} = (req, res) => {
    ${model[0].toUpperCase()+model.substring(1)}.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true, runValidators: true }
    )
        .then(updated${model[0].toUpperCase()+model.substring(1)} => res.json({ ${model}: updated${model[0].toUpperCase()+model.substring(1)} }))
        .catch(err => res.json({ message: 'Something went wrong', error: err }));
}

module.exports.deleteAnExisting${model[0].toUpperCase()+model.substring(1)} = (req, res) => {
    ${model[0].toUpperCase()+model.substring(1)}.deleteOne({ _id: req.params.id })
        .then(result => res.json({ result: result }))
        .catch(err => res.json({ message: 'Something went wrong', error: err }));
}`)
}

//route template
const routeFile=(model)=>{
    return (
`const ${model[0].toUpperCase()+model.substring(1)}Controller = require('../controllers/${model}.controller'); 
module.exports = app => {
    app.get('/api/${model}s', ${model[0].toUpperCase()+model.substring(1)}Controller.findAll${model[0].toUpperCase()+model.substring(1)}s);
    app.get('/api/${model}s/:id', ${model[0].toUpperCase()+model.substring(1)}Controller.findOneSingle${model[0].toUpperCase()+model.substring(1)});
    app.put('/api/${model}s/:id', ${model[0].toUpperCase()+model.substring(1)}Controller.updateExisting${model[0].toUpperCase()+model.substring(1)});
    app.post('/api/${model}s', ${model[0].toUpperCase()+model.substring(1)}Controller.createNew${model[0].toUpperCase()+model.substring(1)});
    app.delete('/api/${model}s/:id', ${model[0].toUpperCase()+model.substring(1)}Controller.deleteAnExisting${model[0].toUpperCase()+model.substring(1)});
}`)
}

//Make New Model
const newModel = (modelName)=>{
    let fs = require('fs');
    let model=modelName.toLowerCase()
    fs.writeFileSync(`models/${model}.model.js`, modelFile(model), function (err) {
        if (err) throw err;
        console.log('Saved!');
    }); 
    fs.writeFileSync(`controllers/${model}.controller.js`, controllerFile(model), function (err) {
        if (err) throw err;
        console.log('Saved!');
    }); 
    fs.writeFileSync(`routes/${model}.routes.js`, routeFile(model), function (err) {
        if (err) throw err;
        console.log('Saved!');
    }); 
}
const createModels= (modells, dbname)=>{
    var fs = require('fs')
    fs.readFile('server.js', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        let newroutesstring="//routes end"
        // forloop to check for errors and issues
        for(let x of modells){
            if (x.length===0){
                throw new Error("Model Names cannot be empty")
            }
            if(!isNaN(x[0])){
                throw new Error('Numbers cannot be the first letter in a model name')
            }
            if (x.includes(" ")){
                throw new Error("Model Name cannot include spaces")
            }
            if (x.includes("$")){
                throw new Error("Model Name cannot include $")
            }
            if (x.includes("\0")){
                throw new Error("Model Name cannot include null chars")
            }
            if (x.length+dbname.length>=120){
                throw new Error("Model Name is too long.")
            }
            if (x.includes("system.")){
                throw new Error("'system.*' names are reserved for internal use by MongoDB")
            }
            if(data.includes(`require("./routes/${x.toLowerCase()}.routes")(app)`)){
                throw new Error(`model ${x} already exists`)
            }
            if(newroutesstring.includes(`require("./routes/${x.toLowerCase()}.routes")(app)`)){
                throw new Error(`model ${x} cannot be created twice`)
            }
            else{
                newroutesstring=`require("./routes/${x.toLowerCase()}.routes")(app)\n${newroutesstring}`
            }
        }
        // for loops seperated so all checks are done first before writing a single file to prevent cleanup in case of a bad input
        for(let x of modells){
            newModel(x)
        }
        var result = data.replace(/\/\/routes end/g, newroutesstring);
        console.log(result)
        fs.writeFileSync('server.js', result, 'utf8', function (errw) {
            if (errw) return console.log(errw);
            console.log('Success!');
        });
    });
}

//mkModel end
const mkModelFileRuntime=(db)=>{
    return (
`let dbn='${db}'
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
readline.question('Models to add seperated by spaces:', input => {
    var modellst=input.split(" ").map((v)=>v.trim()).filter((v)=>v.length!==0)
    console.log(modellst)
    readline.close();
    createModels(modellst,dbn)
});`)
}

const configFile=(db)=>{
    return (
`const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/${db}', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Established a connection to the database'))
    .catch(err => console.log('Something went wrong when connecting to the database ', err));`)
}

const serverFile=()=>{
    return (
`const express = require('express');
const cors = require('cors');
const app = express();
require("./config/mongoose.config");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
    
//routes begin
//routes end
    
app.listen(8000, () => console.log("The server is all fired up on port 8000"));`)
}



const mkFileStructure=()=>{
    let fs = require('fs');
    fs.mkdirSync('server')
    process.chdir('server')
    fs.mkdirSync('config')
    fs.mkdirSync('controllers')
    fs.mkdirSync('models')
    fs.mkdirSync('routes')
}
// mkFileStructure()
const modelsInputScrub=(modells,dbname)=>{
    let newroutesstring="//routes end"
    for(let x of modells){
        if (x.length===0){
            throw new Error("Model Names cannot be empty")
        }
        if(!isNaN(x[0])){
            throw new Error('Numbers cannot be the first letter in a model name')
        }
        if (x.includes(" ")){
            throw new Error("Model Name cannot include spaces")
        }
        if (x.includes("$")){
            throw new Error("Model Name cannot include $")
        }
        if (x.includes("\0")){
            throw new Error("Model Name cannot include null chars")
        }
        if (x.length+dbname.length>=120){
            throw new Error("Model Name is too long.")
        }
        if (x.includes("system.")){
            throw new Error("'system.*' names are reserved for internal use by MongoDB")
        }
        if(newroutesstring.includes(`require("./routes/${x.toLowerCase()}.routes")(app)`)){
            throw new Error(`model ${x} cannot be created twice`)
        }
        else{
            newroutesstring=`require("./routes/${x.toLowerCase()}.routes")(app)\n${newroutesstring}`
        }
    }
}
const dbNameScrub=(x)=>{
    if (x.length===0){
        throw new Error("DB Name cannot be empty")
    }
    else if (x.length>63){
        throw new Error("DB Name cannot be more than 63 chars long")
    }
    if (x.includes("\0")){
        throw new Error("DB Name cannot include null chars")
    }
    if (x.includes("/")){
        throw new Error("DB Name cannot include /")
    }
    if (x.includes("\\")){
        throw new Error("DB Name cannot include \\")
    }
    if (x.includes(".")){
        throw new Error("DB Name cannot include .")
    }
    if (x.includes('"')){
        throw new Error('DB Name cannot include "')
    }
    if (x.includes("$")){
        throw new Error("DB Name cannot include $")
    }
    if (x.includes("*")){
        throw new Error("DB Name cannot include *")
    }
    if (x.includes("<")){
        throw new Error("DB Name cannot include <")
    }
    if (x.includes(">")){
        throw new Error("DB Name cannot include >")
    }
    if (x.includes(":")){
        throw new Error("DB Name cannot include :")
    }
    if (x.includes("|")){
        throw new Error("DB Name cannot include |")
    }
    if (x.includes("?")){
        throw new Error("DB Name cannot include ?")
    }
}

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
readline.question('DB name:', DBinput => {
    var DBname=DBinput.trim()
    readline.question('Models to add seperated by spaces:', input => {
        var modellst=input.split(" ").map((v)=>v.trim()).filter((v)=>v.length!==0)
        readline.close();
        console.log(DBname)
        console.log(modellst)
        dbNameScrub(DBname)
        modelsInputScrub(modellst,DBname)
        mkFileStructure()
        let fs = require('fs');
        fs.writeFileSync(`config/mongoose.config.js`, configFile(DBname), function (err) {
            if (err) throw err;
            console.log('Saved!');
        }); 
        fs.writeFileSync(`server.js`, serverFile(), function (err) {
            if (err) throw err;
            console.log('Saved!');
        }); 
        let serversc=`${fs.readFileSync('../meXn.js',{encoding:'utf8'}).split('//mkModel end')[0]}\n\n${mkModelFileRuntime(DBname)}\n\n//mkModel end`
        console.log(serversc)
        fs.writeFileSync(`mkModels.js`, serversc, function (err) {
            if (err) throw err;
            console.log('Saved!');
        }); 
        createModels(modellst,DBname)
        const { execSync } = require("child_process");
        const ini= execSync("npm init --y",{encoding:'utf8'});
        console.log(ini)
        const mongoo = execSync("npm install --save mongoose",{encoding:'utf8'});
        console.log(mongoo)
        const expr = execSync("npm install --save express",{encoding:'utf8'});
        console.log(expr)
        const co = execSync("npm install --save cors",{encoding:'utf8'});
        console.log(co)
    });
});