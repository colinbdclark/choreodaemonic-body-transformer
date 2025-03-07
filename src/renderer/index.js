let x = [], y = [], z = [];

for (let i = 0; i < 33; i++) {
    x[i] = y[i] = z[i] = 0.0;
}

osc.onMessage((event, message) => {
    let axis;
    let idForAxis = message.address.charAt(
        message.address.length - 1);
;

    switch (message.address) {
        case "/pose/0/x":
            axis = x;
            break;
        case "/pose/0/y":
            axis = y;
            break;
        default:
            axis = z;
            break;
    }

    for (let i = 0; i < message.args.length; i++) {
        let value = message.args[i].value;
        let valueStr = isNaN(value) ? "----" :
            value.toFixed(2);

        axis[i] = "<td>" + valueStr+"</td>";
    }


    let row = document.getElementById(idForAxis);
    row.innerHTML = axis.join(" ");
});
