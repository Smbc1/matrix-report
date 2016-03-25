/**
 * Created by Dmitriy Mozgovoy on 25.03.16
 * @link https://github.com/Unterdrucker
 */
var util = require('util');

function Canvas() {
    this.stdout = process.stdout;
    this.lines = [];
    this.horizontal = false;

    this.init();
    setInterval(this.flush.bind(this), RATE);
}

const RATE = 100;
const SEQUENCIES = {
    CLEAR: '\x1b[2J',
    MOVE_TO: '\x1b[%d;%dH'
};

/**
 * Write line ftom top to bottom
 * @param {String} message
 * @param {Number} row
 * @param {Number} col
 */
Canvas.prototype.write = function(message, row, col) {
    if (!row && !col) {
        var randomized = this.randomizePosition(message);
        row = randomized[0];
        col = randomized[1];
    }
    var msgBuffer = [];

    while (message.length % this.rows > 0) {
        message += ' ';
    }

    for (var i in message) {
        if (row >= this.rows) row -= this.rows;
        msgBuffer.push(this.getMoveCaretCode(row++, col) + message[i]);
    }

    this.lines.push(msgBuffer);
};

Canvas.prototype.getMoveCaretCode = function(row, col) {
    if (this.horizontal) return util.format(SEQUENCIES.MOVE_TO, col, row);
    return util.format(SEQUENCIES.MOVE_TO, row, col);
};

Canvas.prototype.randomizePosition = function(message) {
    return [
        Math.round(Math.random() * Math.max(0, this.rows - message.length)),
        Math.round(Math.random() * this.cols)
    ];
};

Canvas.prototype.flush = function() {
    var printBuffer = [];
    this.lines.forEach(function(buffer) {
        printBuffer.push(buffer.shift());
    });

    this.stdout.write(printBuffer.join(''));
};

Canvas.prototype.init = function() {
    this.rows = this.horizontal ? this.stdout.columns : this.stdout.rows;
    this.cols = this.horizontal ? this.stdout.rows : this.stdout.columns;
    this.stdout.write(SEQUENCIES.CLEAR);
};

exports = module.exports = Canvas;