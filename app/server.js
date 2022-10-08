var express = require('express');
var app = express();

app.use(express.static('build'));
app.get('*', function(req, res) {
    res.sendfile('./build/index.html');
});

app.listen(5000);