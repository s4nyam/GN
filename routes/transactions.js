var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('transactiondb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'transactiondb' database");
        db.collection('transactions', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'transactions' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving transaction: ' + id);
    db.collection('transactions', function(err, collection) {
        collection.findOne({'_id':new mongo.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('transactions', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};



exports.findByTransactionId = function(req, res) {
    var TransactionId = req.params.TransactionId;
    db.collection('transactions', function(err, collection) {
        collection.find({'TransactionId':TransactionId}).toArray(function(err, items) {
            res.send(items);
        });
    });
};








//EXTRA FUNCTIONALITIES
exports.addtransaction = function(req, res) {
    var transaction = req.body;
    console.log('Adding transaction: ' + JSON.stringify(transaction));
    db.collection('transactions', function(err, collection) {
        collection.insert(transaction, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updatetransaction = function(req, res) {
    var id = req.params.id;
    var transaction = req.body;
    console.log('Updating transaction: ' + id);
    console.log(JSON.stringify(transaction));
    db.collection('transactions', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, transaction, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating transaction: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(transaction);
            }
        });
    });
}

exports.deletetransaction = function(req, res) {
    var id = req.params.id;
    console.log('Deleting transaction: ' + id);
    db.collection('transactions', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}


//sample data

var populateDB = function() {

    var transactions = [
    {
        TransactionId:"172",
        targetAccount: "178347861376",
        sourceAccount: "136471361389",
        time: "2018-03-09T12:34:00Z",
        category: "eating_out",
        amount: "-50"
    },
    {
        TransactionId:"192",
        targetAccount: "136471361389",
        sourceAccount: "178347861376",
        time: "2019-03-10T12:34:00Z",
        category: "salary",
        amount: "200"
    }];

    db.collection('transactions', function(err, collection) {
        collection.insert(transactions, {safe:true}, function(err, result) {});
    });

};