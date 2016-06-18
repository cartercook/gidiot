var nodegit = require('nodegit');

module.exports = function(path) {
	/*
	var repo;

	nodegit.Repository.open(path).then(function(repoResult) {
		repo = repoResult; //promote beyond local scope
		console.log('opened repo');
		var paths = [];
		return nodegit.Status.foreach(repo, function(path) {
			paths.push(path); //use git status to find all changed files
		}).then(function() {  
			return promise.resolve(paths); //feed paths to the next .then() in the chain
		});
	}).then(function(paths) {
		console.log('paths: '+paths);
		var sig = repo.defaultSignature();
		console.log('sig: '+sig);
		return repo.createCommitOnHead(paths, sig, sig, 'gidiot autocommit');
	}).then(function() {
		console.log('commit successful');
	});
	*/
	
	//https://gitter.im/nodegit/nodegit/archives/2015/03/18
	var treeOid;
	var index;

	nodegit.Repository.open(path).then(function(repoResult) {
		repo = repoResult;
		console.log('opened repo');
		return repo.refreshIndex();
	}).then(function(indexResult) {
		console.log('opened index');
		index = indexResult;
		index.read(1);
		var paths = [];
		return nodegit.Status.foreach(repo, function(path) {
			paths.push(path);
		}).then(function() {
			return promise.resolve(paths);
		});
	}).then(function(paths) {
		return index.addAll(paths);
	}).then(function() {
		console.log('added paths');
		index.write();
		return index.writeTree();
	}).then(function(treeOidResult) {
		console.log('wrote tree');
		treeOid = treeOidResult;
		return repo.getHeadCommit();
	}).then(function(parent) {
		console.log('got head commit');
		var sig = repo.defaultSignature();
		return repo.createCommit(
			'HEAD',
			sig,
			sig,
			'gidiot autocommit',
			treeOid,
			[parent]
		);
	}).then(function() {
		console('commit successful');
	});
	
}