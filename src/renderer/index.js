let x = [], y = [], z = [];

function cellForValue(oscArg) {
    let value = oscArg.value;
    let valueString = isNaN(value) ? "----" : value.toFixed(2);
    return "<td>" + valueString + "</td>"
}

osc.onBundle((event, bundle) => {
    // Only read the first pose.
    let poseMessage = bundle.packets[0];
    let xChildren = "";
    let yChildren = "";
    let zChildren = "";

    for (let i = 0; i < poseMessage.args.length; i++) {
        let keypoint = poseMessage.args[i];
        xChildren += cellForValue(keypoint[0]);
        yChildren += cellForValue(keypoint[1]);
        zChildren += cellForValue(keypoint[2])
    }

    document.getElementById("x").innerHTML = xChildren;
    document.getElementById("y").innerHTML = yChildren;
    document.getElementById("z").innerHTML = zChildren;
});
