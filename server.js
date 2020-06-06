var express = require('express'),
    transaction = require('./routes/transactions');

var app = express();




app.configure(function () {
    app.use(express.logger('dev'));     
    app.use(express.bodyParser());
});

app.get('/transactions', transaction.findAll);

//one has to be turned off either findbyID or findbytransactionId
// app.get('/transactions/:id', transaction.findById);

app.get('/transactions/:TransactionId', transaction.findByTransactionId);

app.post('/transactions', transaction.addtransaction);
app.put('/transactions/:id', transaction.updatetransaction);
app.delete('/transactions/:id', transaction.deletetransaction);

// app.listen(3000);
app.listen(process.env.PORT);
console.log('Listening on port 3000...');