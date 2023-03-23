sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.sap.ri.zqmrdminsp.controller.View1", {
            onInit: function () {
                var Arr = [{
                    "enabled":"",
                    "PerStrd": "LENGTH",
                    "Val": "0.00",
                    "UOM": "cm",
                    "ACT1": "",
                    "ACT2": "",
                    "ACT3": "",
                    "ACT4": "",
                    "ACT5": "",
                    "ACT6": "",
                    "ACT7": "",
                    "ACT8": "",
                    "ACT9": "",
                    "ACT10": "",
                    "Min": "0.0",
                    "Max": "0.0",
                    "Avg": "0.00",
                    "Deviation": "0.00"
                },{
                    "enabled":"",
                    "PerStrd": "WIDTH",
                    "Val": "0.00",
                    "UOM": "cm",
                    "ACT1": "",
                    "ACT2": "",
                    "ACT3": "",
                    "ACT4": "",
                    "ACT5": "",
                    "ACT6": "",
                    "ACT7": "",
                    "ACT8": "",
                    "ACT9": "",
                    "ACT10": "",
                    "Min": "0.0",
                    "Max": "0.0",
                    "Avg": "0.00",
                    "Deviation": "0.00"
                },
                {
                    "enabled":"X",
                    "PerStrd": "WEIGHT",
                    "Val": "0.00",
                    "UOM": "gms",
                    "ACT1": "0.0",
                    "ACT2": "0.0",
                    "ACT3": "0.0",
                    "ACT4": "0.0",
                    "ACT5": "0.0",
                    "ACT6": "0.0",
                    "ACT7": "0.0",
                    "ACT8": "0.0",
                    "ACT9": "0.0",
                    "ACT10": "0.0",
                    "Min": "0.0",
                    "Max": "0.0",
                    "Avg": "0.00",
                    "Deviation": "0.00"
                },{
                    "enabled":"",
                    "PerStrd": "WEIGHT WITH TRIMS",
                    "Val": "",
                    "UOM": "gms",
                    "ACT1": "",
                    "ACT2": "",
                    "ACT3": "",
                    "ACT4": "",
                    "ACT5": "",
                    "ACT6": "",
                    "ACT7": "",
                    "ACT8": "",
                    "ACT9": "",
                    "ACT10": "",
                    "Min": "0.0",
                    "Max": "0.0",
                    "Avg": "0.00",
                    "Deviation": ""
                }];
                var oAllViewModel = new sap.ui.model.json.JSONModel();
                oAllViewModel.setData(Arr);
                this.getView().setModel(oAllViewModel, "AllViewModel");
            }
        });
    });
