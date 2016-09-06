var assert = require('assert');
var Promise = require('nodegit-promise');
var NodeGit = require('nodegit');

module.exports = function(repo) {
  var treeOid;
  var index;

  console.log("attempting to open index");
  return repo.openIndex().then(function(indexResult) {
    index = indexResult;
    index.read(1);
    var paths = [];

    console.log("Open successful. Attempting to get paths using Status.foreach");
    return NodeGit.Status.foreach(repo, function(path) {
      paths.push(path);
    }).then(function() {
      return Promise.resolve(paths);
    });

  }).then(function(paths) {
    console.log("Successfully retrieved paths. Attempting to add index paths");
    return index.addAll(paths);

  }).then(function() {
    console.log("Successfully added paths. Attempting to write tree");
    index.write();
    return index.writeTree();

  }).then(function(treeOidResult) {
    console.log("successfully wrote tree. Attempting to get head commit");
    treeOid = treeOidResult;
    return repo.getHeadCommit();

  }).then(function(parent) {
    console.log("successfully retrieved head commit. Attempting to create commit");
    var sig = repo.defaultSignature();
    return repo.createCommit('HEAD', sig, sig, "Gidiot auto-commit", treeOid, [parent]);

  }).then(function(commit) {
    console.log("Successfully created commit.");
    return commit;
  });
}