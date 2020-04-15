var modcal = require('./modcal');
var a = 2,
    b = 1;
c = -10;
console.log("- " + a + " + " + b + " = " + modcal.cong(a, b));
console.log("- " + a + " - " + b + " = " + modcal.tru(a, b));
console.log("- " + a + " * " + b + " = " + modcal.nhan(a, b));
console.log("- " + a + " / " + b + " = " + modcal.chia(a, b));
console.log("- " + a + "x*2" + " + " + b + "x" + " + " + c + " có: ");
console.log(modcal.pt2(a, b, c));