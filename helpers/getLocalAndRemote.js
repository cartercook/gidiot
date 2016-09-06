var assert = require('assert');
var Promise = require('nodegit-promise');
var nodegit = require('nodegit');

//get local and remote branches
module.exports = function(repo) {
	console.log('attempting to get current branch');
	return repo.getCurrentBranch().then(function(local) {
	
		console.log('succesfully retrieved branch. Attempting to get upstream branch');
		return Promise.all([local, nodegit.Branch.upstream(local)]);
	
	}).then(function(branches) {
		assert(branches[0], "local Ref is undefined");
        assert(branches[1], "remote Ref is undefined");
		console.log('succesfully retrieved upstream. Attempting to get heads');
		return Promise.all([repo.getBranchCommit(branches[0]), repo.getBranchCommit(branches[1])]);
	
	}).then(function(branches) {
		assert(branches[0], "local head is undefined");
        assert(branches[1], "remote head is undefined");
        console.log("succesfully retrieved heads");
        return branches;
	});
}