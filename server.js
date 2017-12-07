var express     = require('express');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var cors        = require('cors');

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

//CNX mLab
var promise = mongoose.connect('mongodb://cstg:cstg@ds031975.mlab.com:31975/rico', {
    useMongoClient: true,
});

// definition du schema de données
var customerSchema = new mongoose.Schema({
    sid: String,
    serial:String,
    contract: String,
    fin:String
});

var customerModel = mongoose.model('customer',customerSchema);

// Routes
app.get('/', function (req, res){
    res.send('no no no')
})

app.get('/date', function(req, res){
    var date = new Date();
    res.send(date)
});

app.get('/customer/all', function (req, res){
    customerModel.find({}, function (err, custs){
        if(err){
            console.log(err);
            res.send('KO');
        } else {
            res.send(custs);
        }
    })
})

app.get('/customer/:id', function (req, res){
    var id = req.params.id;
    customerModel.find({sid:id}, function(err,cust){
        if (err){
            console.log(err);
            res.send('ko')
        } else {
            res.send(cust);
        }
    })    
})

app.post('/add', function (req, res){
    var cust = req.body;
    console.log(cust);
    var custAdd = new customerModel();
    custAdd.sid   = req.body.rowId
    custAdd.fin     = req.body.fin
    custAdd.contract= req.body.contract
    custAdd.serial  = req.body.serial
    custAdd.save(function (err){
        if (err){
            console.log(err)
            res.send(err);
        } else {
            res.send('customer added')
        }
    })
})

app.post('/customer/:id', function(req, res){
    var obj = req.body;
    var id = req.params.id
    console.log(obj)
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods','POST');
    if (obj){
        customerModel.update({_id:id},obj, function(err){
            if (err){
                console.log(err);
            }
        });
    }
    res.send('ok')
});

app.get('/customer/serial/:serial', function (req, res){
    var serial = req.params.serial
    customerModel.findOne({serial:serial}, function (err, cust){
        if (err){
            console.log(err)
            res.send(err)
        } else {
            res.send(cust)
        }
    })
});

// Delete cust
app.delete('/customer/delete/:id', function (req, res){
    var id = req.params.id;
    if (id) {
        customerModel.findByIdAndRemove(id,function(err,cust){
            if (err) {
                console.log(err);
                return
            } else {
                res.sendStatus(202);
            }
        })
    }
})

app.listen(1340);
console.log("===========================================");
console.log("* Le serveur est lancé sur le port : 1340 *");
console.log("===========================================");