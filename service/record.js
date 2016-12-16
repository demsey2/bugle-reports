var Sql = require('./sql.js');
var Utils = require('./utils.js');
var Sdk = require('../sdk/newnrg-reporter-sdk.js')


var requiredFields = ['program_id', 'custodian', 'contributor', 'item_id', 'action', 'overall_start'];
//var otherFields = ['id', 'text_value', 'number_value', 'timestamp'];

exports.test = function(req, res) {
    var q = req.body.q;
    Sql.Crate.execute ("select * from tweets where text like ? and retweeted=? limit 1", [q, false])
    	.success (function (data){
    		Utils.handleResponse(null, data, res, null);
    	});
}

exports.post = function(req, res) {
	var dataType = req.params.dataType;
	var record = req.body;
	var validation = Sql.validateRecord(record, requiredFields);
	if (validation.valid) {
		
		Sql.Crate.insert(dataType, validation.record)
			.success((data)=>{
				Utils.handleResponse(null, validation.record, res);
			})
			.error((err)=>{
				Utils.handleResponse(err, null, res, 500);
			});
	}
	else {
		Utils.handleResponse("Invalid record", validation, res, 400);
	}

}
