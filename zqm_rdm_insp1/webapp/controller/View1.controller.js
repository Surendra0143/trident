sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, Filter, FilterOperator, MessageBox, JSONModel) {
        "use strict";

        return Controller.extend("rdm.insp.zqmrdminsp1.controller.View1", {
            onInit: function () {
                var Arr = [{
                    "visible": "",
                    "enabled": "",
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
                }, {
                    "visible": "",
                    "enabled": "",
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
                    "visible": "",
                    "enabled": "X",
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
                }, {
                    "visible": "X",
                    "enabled": "",
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
            },
            onValRound: function (oEvent) {
                var val = oEvent.getParameter("value");
                var data = this.getView().getModel("formModel").getData();
                if (val !== "") {
                    data.ActLen = parseFloat(val).toFixed(2);
                }
            },
            onInputChange: function (oEvent) {
                var sPath = oEvent.getSource().getParent().getBindingContext("AllViewModel").getPath().replace("/", "");
                var data = this.getView().getModel("AllViewModel").getData()[sPath];
                var data2 = this.getView().getModel("AllViewModel").getData()["2"];
                var Arr = [];
                var Arr1 = [];
                Arr.push(data.ACT1, data.ACT2, data.ACT3, data.ACT4, data.ACT5, data.ACT6, data.ACT7, data.ACT8, data.ACT9, data.ACT10);
                for (var v = 0; v < Arr.length; v++) {
                    if (Arr[v] !== "") {
                        Arr1.push(Arr[v]);
                    }
                }
                var sum = 0;//Initial value hast to be 0
                for (let i = 0; i < Arr1.length; i++) {
                    var number = parseFloat(Arr1[i]);//Convert to numbers with parseFloat
                    sum += number;//Sum the numbers
                }
                // data.Avg = sum / Arr1.length;
                data.Min = Math.min.apply(null, Arr1);
                data.Max = Math.max.apply(null, Arr1);
                var Avg = sum / Arr1.length;
                data.Avg = Math.round((Avg + Number.EPSILON) * 100) / 100;
                var firstVal = Avg - data.Val;
                var secondVal = firstVal / data.Val * 100;
                data.Deviation = Math.round((secondVal + Number.EPSILON) * 100) / 100;
                var twg = this.getView().byId("_IDGenInput18").getValue();
                if (twg === "") {
                    twg = 0;
                }
                if (sPath === "3") {
                    var Arr2 = [];
                    if (Arr[0] !== "") {
                        data2.ACT1 = Arr[0] - twg;
                        Arr2[0] = data2.ACT1;
                    }
                    if (Arr[1] !== "") {
                        data2.ACT2 = Arr[1] - twg;
                        Arr2[1] = data2.ACT2;
                    }
                    if (Arr[2] !== "") {
                        data2.ACT3 = Arr[2] - twg;
                        Arr2[2] = data2.ACT3;
                    }
                    if (Arr[3] !== "") {
                        data2.ACT4 = Arr[3] - twg;
                        Arr2[3] = data2.ACT4;
                    }
                    if (Arr[4] !== "") {
                        data2.ACT5 = Arr[4] - twg;
                        Arr2[4] = data2.ACT5;
                    }
                    if (Arr[5] !== "") {
                        data2.ACT6 = Arr[5] - twg;
                        Arr2[5] = data2.ACT6;
                    }
                    if (Arr[6] !== "") {
                        data2.ACT7 = Arr[6] - twg;
                        Arr2[6] = data2.ACT7;
                    }
                    if (Arr[7] !== "") {
                        data2.ACT8 = Arr[7] - twg;
                        Arr2[7] = data2.ACT8;
                    }
                    if (Arr[8] !== "") {
                        data2.ACT9 = Arr[8] - twg;
                        Arr2[8] = data2.ACT9;
                    }
                    if (Arr[9] !== "") {
                        data2.ACT10 = Arr[9] - twg;
                        Arr2[9] = data2.ACT10;
                    }
                    var Arr3 = [];
                    for (var v = 0; v < Object.keys(Arr2).length; v++) {
                        Arr3.push(Arr2[Object.keys(Arr2)[v]]);
                    }
                    data2.Min = Math.min.apply(Math, Arr3);
                    data2.Max = Math.max.apply(Math, Arr3);
                    var sum = Arr2.reduce((a, b) => a + b, 0);
                    var Avg = sum / Object.keys(Arr2).length;
                    data2.Avg = Math.round((Avg + Number.EPSILON) * 100) / 100;

                    var firstVal = Avg - data2.Val;
                    var secondVal = firstVal / data2.Val * 100;
                    data2.Deviation = Math.round((secondVal + Number.EPSILON) * 100) / 100;
                }
            },
            onLotPress: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var LotNum = this.getView().byId("_IDGenInput1").getValue();
                var filter1 = new sap.ui.model.Filter({
                    path: "Lotno",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: LotNum
                });
                oModel.read("/RIFSet", {
                    filters: [filter1],
                    success: function (oData) {
                        var oLotDetails = new sap.ui.model.json.JSONModel();
                        oLotDetails.setData(oData.results);
                        that.getView().setModel(oLotDetails, "LotDetails");
                        if (!that._MaterialDialog) {
                            that._MaterialDialog = Fragment.load({
                                id: that.getView().getId(),
                                name: "rdm.insp.zqmrdminsp1.Fragments.MaterialDialog",
                                controller: that
                            }).then(function (oDialog) {
                                that.getView().addDependent(oDialog);
                                return oDialog;
                            });
                        }
                        that._MaterialDialog.then(function (oDialog) {
                            oDialog.open();
                        });
                    },
                    error: function (oResp) {
                        MessageBox.error(JSON.parse(oResp.responseText).error.message.value);
                    }
                });
            },
            onMaterialSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("FpiMatnr", FilterOperator.Contains, sValue);
                oEvent.getSource().getBinding("items").filter([oFilter]);
            },
            onMaterialClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
                if (!oSelectedItem) {
                    return;
                }
                this.byId("_IDGenInput2").setValue(oSelectedItem.getTitle());
                this.matDesc = oSelectedItem.getDescription();
                this.MatDetails(oSelectedItem.getTitle());
                // this.byId("_IDGenInput23").setValue(oSelectedItem.getDescription().replace(/^0+/, ''));
                // this.onAfterSel();
            },
            MatDetails: function (Material) {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var LotNum = this.getView().byId("_IDGenInput1").getValue();
                var filter2 = new sap.ui.model.Filter({
                    path: "FpiMatnr",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: Material
                });
                var filter1 = new sap.ui.model.Filter({
                    path: "Lotno",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: LotNum
                });
                oModel.read("/RIFSet", {
                    filters: [filter1, filter2],
                    success: function (oData) {
                        that.getView().byId("_IDGenDatePicker1").setDateValue(new Date(oData.results[0].Zdate));
                        var data = that.getView().getModel("AllViewModel").getData();
                        data[0].Val = oData.results[0].StdLen;
                        data[1].Val = oData.results[0].StdWdth;
                        data[2].Val = oData.results[0].StdWeight;
                        that.getView().getModel("AllViewModel").refresh();
                    },
                    error: function (oResp) {
                        MessageBox.error(JSON.parse(oResp.responseText).error.message.value);
                    }
                });
            },
            // onGetData: function () {
            //     this.MatDetails();
            // },
            onSave: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var lotNo = this.getView().byId("_IDGenInput1").getValue();
                var lotDate = this.getView().byId("_IDGenDatePicker1").getValue();
                var Material = this.getView().byId("_IDGenInput2").getValue();
                var trimsWeight = this.getView().byId("_IDGenInput18").getValue();
                var Remarks = this.getView().byId("_IDGenInput19").getValue();
                var RHPercent = this.getView().byId("_IDGenInput20").getValue();
                var allActs = this.getView().getModel("AllViewModel").getData();
                if (allActs[0].ACT1 === "" || allActs[0].ACT2 === "" || allActs[0].ACT3 === "" || allActs[0].ACT4 === "" || allActs[0].ACT5 === "") {
                    MessageBox.warning("Please fill the first five Lengths");
                    return;
                }
                if (allActs[0].ACT6 === "") {
                    allActs[0].ACT6 = "0.00"
                }
                if (allActs[0].ACT7 === "") {
                    allActs[0].ACT7 = "0.00"
                }
                if (allActs[0].ACT8 === "") {
                    allActs[0].ACT8 = "0.00"
                }
                if (allActs[0].ACT9 === "") {
                    allActs[0].ACT9 = "0.00"
                }
                if (allActs[0].ACT10 === "") {
                    allActs[0].ACT10 = "0.00"
                }
                if (allActs[1].ACT1 === "" || allActs[1].ACT2 === "" || allActs[1].ACT3 === "" || allActs[1].ACT4 === "" || allActs[1].ACT5 === "") {
                    MessageBox.warning("Please fill the first five Widths");
                    return;
                }
                if (allActs[1].ACT6 === "") {
                    allActs[1].ACT6 = "0.00"
                }
                if (allActs[1].ACT7 === "") {
                    allActs[1].ACT7 = "0.00"
                }
                if (allActs[1].ACT8 === "") {
                    allActs[1].ACT8 = "0.00"
                }
                if (allActs[1].ACT9 === "") {
                    allActs[1].ACT9 = "0.00"
                }
                if (allActs[1].ACT10 === "") {
                    allActs[1].ACT10 = "0.00"
                }
                if (allActs[3].ACT1 === "" || allActs[3].ACT2 === "" || allActs[3].ACT3 === "" || allActs[3].ACT4 === "" || allActs[3].ACT5 === "") {
                    MessageBox.warning("Please fill the first five Weights");
                    return;
                }
                if (allActs[3].ACT6 === "") {
                    allActs[3].ACT6 = "0.00"
                }
                if (allActs[3].ACT7 === "") {
                    allActs[3].ACT7 = "0.00"
                }
                if (allActs[3].ACT8 === "") {
                    allActs[3].ACT8 = "0.00"
                }
                if (allActs[3].ACT9 === "") {
                    allActs[3].ACT9 = "0.00"
                }
                if (allActs[3].ACT10 === "") {
                    allActs[3].ACT10 = "0.00"
                }
                if ((allActs[0].Deviation).toString() === "Infinity") {
                    MessageBox.warning("Length deviation should not be a Infinity");
                    return;
                }
                if ((allActs[1].Deviation).toString() === "Infinity") {
                    MessageBox.warning("Width deviation should not be a Infinity");
                    return;
                }
                if ((allActs[2].Deviation).toString() === "Infinity") {
                    MessageBox.warning("Weight deviation should not be a Infinity");
                    return;
                }
                var payload = {
                    "d": {
                        "ZlotNo": lotNo,
                        "Zdate": lotDate,
                        "Zmatnr": Material,
                        "Zmaktx": this.matDesc,
                        "Salesorder": "",
                        "Salesitem": "000000",
                        "Zlength": allActs[0].Val,
                        "ZlengthAct1": allActs[0].ACT1,
                        "ZlengthAct2": allActs[0].ACT2,
                        "ZlengthAct3": allActs[0].ACT3,
                        "ZlengthAct4": allActs[0].ACT4,
                        "ZlengthAct5": allActs[0].ACT5,
                        "ZlengthAct6": allActs[0].ACT6,
                        "ZlengthAct7": allActs[0].ACT7,
                        "ZlengthAct8": allActs[0].ACT8,
                        "ZlengthAct9": allActs[0].ACT9,
                        "ZlengthAct10": allActs[0].ACT10,
                        "Zwidth": allActs[1].Val,
                        "ZwidthAct1": allActs[1].ACT1,
                        "ZwidthAct2": allActs[1].ACT2,
                        "ZwidthAct3": allActs[1].ACT3,
                        "ZwidthAct4": allActs[1].ACT4,
                        "ZwidthAct5": allActs[1].ACT5,
                        "ZwidthAct6": allActs[1].ACT6,
                        "ZwidthAct7": allActs[1].ACT7,
                        "ZwidthAct8": allActs[1].ACT8,
                        "ZwidthAct9": allActs[1].ACT9,
                        "ZwidthAct10": allActs[1].ACT10,
                        "Zweigth": allActs[2].Val,
                        "ZweigthAct1": (allActs[2].ACT1).toString(),
                        "ZweigthAct2": (allActs[2].ACT2).toString(),
                        "ZweigthAct3": (allActs[2].ACT3).toString(),
                        "ZweigthAct4": (allActs[2].ACT4).toString(),
                        "ZweigthAct5": (allActs[2].ACT5).toString(),
                        "ZweigthAct6": (allActs[2].ACT6).toString(),
                        "ZweigthAct7": (allActs[2].ACT7).toString(),
                        "ZweigthAct8": (allActs[2].ACT8).toString(),
                        "ZweigthAct9": (allActs[2].ACT9).toString(),
                        "ZweigthAct10": (allActs[2].ACT10).toString(),
                        "ZweigthWithTrims1": allActs[3].ACT1,
                        "ZweigthWithTrims2": allActs[3].ACT2,
                        "ZweigthWithTrims3": allActs[3].ACT3,
                        "ZweigthWithTrims4": allActs[3].ACT4,
                        "ZweigthWithTrims5": allActs[3].ACT5,
                        "ZweigthWithTrims6": allActs[3].ACT6,
                        "ZweigthWithTrims7": allActs[3].ACT7,
                        "ZweigthWithTrims8": allActs[3].ACT8,
                        "ZweigthWithTrims9": allActs[3].ACT9,
                        "ZweigthWithTrims10": allActs[3].ACT10,
                        "ZlengthMin": (allActs[0].Min).toString(),
                        "ZlengthMax": (allActs[0].Max).toString(),
                        "ZlengthAvg": (allActs[0].Avg).toString(),
                        "ZlengthDeviation": (allActs[0].Deviation).toString(),
                        "ZwidthMin": (allActs[1].Min).toString(),
                        "ZwidthMax": (allActs[1].Max).toString(),
                        "ZwidthAvg": (allActs[1].Avg).toString(),
                        "ZwidthDeviation": (allActs[1].Deviation).toString(),
                        "ZweigthMin": (allActs[2].Min).toString(),
                        "ZweigthMax": (allActs[2].Max).toString(),
                        "ZweigthAvg": (allActs[2].Avg).toString(),
                        "ZweigthDeviation": (allActs[2].Deviation).toString(),
                        "ZweigthWTrimsMin": (allActs[3].Min).toString(),
                        "ZweigthWTrimsMax": (allActs[3].Max).toString(),
                        "ZweigthWTrimsAvg": (allActs[3].Avg).toString(),
                        "ZtrimsWeigth": trimsWeight,
                        "Zremark": Remarks,
                        "ZrhPercent": RHPercent
                    }

                }
                oModel.create("/RIF_SSet", payload, {
                    success: function (oData) {
                        MessageBox.success("Random inspection lot no: " + oData.Prueflos + " is generated");
                    },
                    error: function (oResp) {
                        MessageBox.error(JSON.parse(oResp.responseText).error.message.value);
                    }
                });
            }
        });
    });
