var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');


var siteSchema = mongoose.Schema({
  title: String,
  visits: {
    type: Number, 
    default: 0
  },
  url: String,
  link: String,
  base_url: String,
  code: String
});

var hashPass = function(url){
  var shasum = crypto.createHash('sha1');
  shasum.update(url);
  return shasum.digest('hex').slice(0, 5);
}

siteSchema.pre('save', function (next) {
  this.code = hashPass(this.url);
  next();
})

var Link = mongoose.model('Link', siteSchema);

module.exports = Link;





// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function(){
//     this.on('creating', function(model, attrs, options){
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });
