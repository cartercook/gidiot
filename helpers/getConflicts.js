var nodegit = require('nodegit');

module.exports = function(repo, index) {
	console.log('Attempting to write tree');
	var last = {path:null}; //used to get rid of duplicate entries
	var files = []; //the paths of conflicted files
	index.entries().forEach(function(entry) {
		if (nodegit.Index.entryIsConflict(entry) && entry.path != last.path) {
			files.push(entry.path);
		}
		last = entry;
	});
	return index.writeTree().then(function(tree) {
		console.log('successfully wrote tree. Attempting to log conflict files');
		files.forEach(function(path) {
			tree.entryByPath(path).then(function(entry) {
				return entry.getBlob();
			}).then(function(blob) {
				consol.log(blob.toString());
			});
		});
	});