var nodegit = require('nodegit');
var fetch = require('./fetch');

module.exports = function(repo) {
	var local;

	return fetch(repo).then(function() {
		console.log('fetch successfull, attempting to get current branch');
		return repo.getCurrentBranch();
	}).then(function(localResult) {
		console.log('succesfully retrieved branch. Attempting to get upstream branch');
		local = localResult;
		return nodegit.Branch.upstream(local);
	}).then(function(remote) {
		console.log('successfully retrieved upstream branch. Attempting merge');
		return repo.mergeBranches(local, remote);
	});
}