// var esprima = require('esprima');
var fs = require('fs');
var spawn = require('child_process').spawn;

module.exports = (indexPath, text) => {
  fs.open(indexPath, 'a', 666, (e, id) => {
    fs.write(id, text + '\n', null, 'utf8', () => {
      var sortProcess = spawn('sort', [indexPath]);
      sortProcess.stdout.setEncoding('utf8');
      sortProcess.stdout.on('data', data => {
        fs.writeFile(indexPath, data, null, err => {
          if (err) {
            throw err;
          }
          console.log('file sorted and saved');
        });
      });
    });
  });
};
