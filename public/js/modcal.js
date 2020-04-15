exports.cong = function(a, b) {
    return a + b;
}
exports.tru = function(a, b) {
    return a - b;
}
exports.nhan = function(a, b) {
    return a * b;
}
exports.chia = function(a, b) {
    if (b != 0) {
        return a / b;
    }
    return "lỗi không chia hết cho 0";
}
exports.pt2 = function(a, b, c) {
    if (a == 0) {
        if (b == 0) {
            return ("Phương trình vô nghiệm !!!");
        } else {
            return ("Phương trình có 1 nghiệm: " + "x = " + (-c / b));
        }
        return;
    }
    var delta = b * b - 4 * a * c;
    var x1;
    var x2;
    if (delta > 0) {
        x1 = ((-b + Math.sqrt(delta)) / (2 * a));
        x2 = ((-b - Math.sqrt(delta)) / (2 * a));
        return ("Phương trình có 2 nghiệm là: " + "x1 = " + x1 + " và x2 = " + x2);
    } else if (delta == 0) {
        x1 = (-b / (a * 2));
        return ("Phương trình có nghiệm kép: " + "x = " + x1);
    } else {
        return ("Phương trình vô nghiệm !!!");

    }
    return;
}