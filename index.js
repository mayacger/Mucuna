// Generated by CoffeeScript 1.6.3
(function() {
  var base, combo, compress, errorLogs, fileHelper, filesCode, fs, path, setUserSets, usrConfig;

  fs = require('fs');

  path = require('path');

  fileHelper = require('./lib/file');

  combo = require('./lib/combo');

  compress = require('./lib/compress');

  base = {
    cwd: './',
    cfg: 'config.js'
  };

  errorLogs = {
    error: 0,
    warning: 0
  };

  usrConfig = null;

  filesCode = {};

  setUserSets = function(path) {
    var data;
    data = fs.readFileSync(path, 'utf-8');
    usrConfig = JSON.parse(data);
  };

  exports.compile = function(cwd, file) {
    var cb, comboArr, filePath, files, output, _i, _len;
    base.cwd = cwd || cwd.replace('\\', '/');
    base.cfg = file || base.cfg;
    setUserSets("" + base.cwd + "/" + base.cfg);
    filePath = "" + base.cwd + "/" + usrConfig.static_path;
    output = "" + base.cwd + "/output/" + usrConfig.static_path;
    files = fileHelper.getAllFiles(filePath);
    fileHelper.mkdirSync(output);
    comboArr = [];
    files.forEach(function(item) {
      var fNum, fileBaseName, fileType, folder, itemArr, newFolders, oldPath;
      itemArr = item.split("" + usrConfig.static_path);
      oldPath = "" + usrConfig.static_path + itemArr[1];
      fNum = itemArr[1].lastIndexOf('/');
      folder = itemArr[1].substring(0, fNum);
      fileType = path.extname(item);
      fileBaseName = path.basename(item);
      newFolders = "" + output + folder;
      fileHelper.mkdirSync(newFolders, function(e) {
        var code, minCode, newFile, opts;
        if (e) {
          console.log(e);
        } else {
          if (itemArr[1].indexOf(usrConfig.combo_file) === -1) {
            newFile = "" + newFolders + "/" + fileBaseName;
            minCode = compress(oldPath, newFile, fileType);
            if (minCode) {
              fileHelper.writeFile(newFile, minCode);
              filesCode[newFile] = minCode;
            }
            console.log(minCode);
          } else {
            try {
              code = fs.readFileSync(oldPath, "utf8");
              opts = {
                folder: newFolders,
                codes: code,
                type: fileType,
                name: fileBaseName
              };
              comboArr.push(opts);
            } catch (_error) {
              e = _error;
              console.log(e);
            }
          }
        }
      });
    });
    console.log(filesCode);
    for (_i = 0, _len = comboArr.length; _i < _len; _i++) {
      cb = comboArr[_i];
      combo(cb, filesCode);
    }
  };

}).call(this);
