var fs = require('fs');

module.exports = function zipFolder(folderToZip, destination, callback) {
    var archiver = require('archiver'),
        output = fs.createWriteStream(destination),
        archive = archiver.create('zip', {});

<<<<<<< HEAD
    // CASE: always ask for the real path, because the target folder could be a symlink
    fs.realpath(folderToZip, function (err, realpath) {
        if (err) {
            return callback(err);
        }
=======
    // If folder to zip is a symlink, we want to get the target
    // of the link and zip that instead of zipping the symlink
    if (fs.lstatSync(folderToZip).isSymbolicLink()) {
        folderToZip = fs.realpathSync(folderToZip);
    }

    output.on('close', function () {
        callback(null, archive.pointer());
    });
>>>>>>> c16a58cf6836bab5075e5869d1f7b9a656ac18c9

        output.on('close', function () {
            callback(null, archive.pointer());
        });

        archive.on('error', function (err) {
            callback(err, null);
        });

        archive.directory(realpath, '/');
        archive.pipe(output);
        archive.finalize();
    });
};
