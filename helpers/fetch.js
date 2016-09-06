var nodegit = require("nodegit");

module.exports = function(repo) {
	console.log('attempting fetchAll');
	return repo.fetchAll({
		callbacks: {
			credentials: function(url, userName) {
				return nodegit.Cred.sshKeyFromAgent(userName);
			},
			certificateCheck: function() {
				return 1;
			}
		}
	});
}