var Canvas = require('./lib/canvas');

var canvas = new Canvas(),
    input = process.stdin;
input.on('readable', function() {
    setInterval(function() {
        var data = input.read(1024);
        if (!data) return;

        var lines = data.toString('utf-8').split('\n');
        lines.forEach(function(line) {
            canvas.write(line);
        });
    }, 500);
});