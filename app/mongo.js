var mongoose = require('mongoose');
var mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/shortly_grunt';
mongoose.connect(mongoURI);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('connected to database');
});

module.exports = db;


//tree

/*

var child = new Schema({ name: String });
var schema = new Schema({ name: String, age: Number, children: [child] });
var Tree = mongoose.model('Tree', schema);

// setting schema options
new Schema({ name: String }, { _id: false, autoIndex: false })

var Users = mongoose.model('USERS', users);
*/