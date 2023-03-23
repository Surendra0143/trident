sap.ui.define(["com/trident/weste/project1/model/formatter"], function () {
    "use strict";
    return {
        onMsgFormat: function (sStatus) {
            if (sStatus === "E") {
                return "Error";
            }
            else {
                return "Success";
            }
        }
    };
});