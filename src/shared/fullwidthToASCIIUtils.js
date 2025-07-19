// Convert fullwidth and halfwidth characters to their equivalent basic Latin forms
function fullwidthToASCII(input) {

    return input
    .replace(/[\uff01-\uff5e]/g,fullwidthChar => String.fromCharCode(fullwidthChar.charCodeAt(0) - 0xfee0))
    .replace(/\u3000/g, '\u0020');

}
module.exports = { fullwidthToASCII };
