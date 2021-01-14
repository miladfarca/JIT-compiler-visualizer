const { json } = require('express');
var express = require('express');
var app = express();

// api
app.get('/:type/:expression', function (req, res) {
    const { exec } = require('child_process');
    var flags = "";
    var type = req.params.type;
    if (type == "tokens") {
        flags = "--print-tokens --no-output";
    }
    else if (type == "ast") {
        flags = "--print-ast-json --no-output";
    }
    else if (type == "registers") {
        flags = "--print-reg-alloc --no-output";
    }
    else if (type == "x64") {
        flags = "--print-code --no-output";
    }
    var expression = Buffer.from(req.params.expression, 'base64').toString();
    exec('../arith-compiler/calc ' + flags + ' --inline "' + expression + "\"", (err, stdout, stderr) => {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.status(200).json(stdout);
        }
    });
});

// console.log("// this is going to host the api of JIT compiler %s")
var server = app.listen(8100, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Listening at http://%s:%s", host, port)
})