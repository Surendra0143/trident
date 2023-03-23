sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, Fragment, Filter, FilterOperator, JSONModel) {
        "use strict";

        return Controller.extend("com.sap.firstpiece.zqmfirstpiece.controller.View1", {
            onInit: function () {
                var myDate = new Date();
                this.getView().byId("_IDGenDatePicker1").setDateValue(myDate);
                var shiftData = [{ "shift": "A" }, { "shift": "B" }, { "shift": "C" }];
                var oShiftModel = new sap.ui.model.json.JSONModel(shiftData);
                this.getView().setModel(oShiftModel, "ShiftModel");
                var crow4Data = [{ "crowding4": "Ok" }, { "crowding4": "Not Ok" }];
                var oCrow4Model = new sap.ui.model.json.JSONModel(crow4Data);
                this.getView().setModel(oCrow4Model, "Crow4Model");
                var rsltApvlData = [{ "resultApproval": "Yes" }, { "resultApproval": "No" }];
                var oResltApvlModel = new sap.ui.model.json.JSONModel(rsltApvlData);
                this.getView().setModel(oResltApvlModel, "ResltApvlModel");
                var oformModel = new sap.ui.model.json.JSONModel();
                var obj = {
                    "Prueflos": "",
                    "FpiPlant": "",
                    "Lotno": "",
                    "FpiVbeln": "",
                    "Zdate": "",
                    "FpiVbelp": "",
                    "FpiMatnr": "",
                    "Shift": "",
                    "FpiCustomer": "",
                    "Prgrm": "",
                    "StdWeight": "",
                    "Thread": "",
                    "Arbpl": "",
                    "StdLen": "",
                    "OthIns": "",
                    "StdWdth": "",
                    "ActWeight": "",
                    "ActLen": "",
                    "ActWdth": "",
                    "Shade": "",
                    "Fold": "",
                    "TrimPlcmnt": "",
                    "OperCode": "",
                    "ApprBy": "",
                    "Machine": "",
                    "Crowd4Crnr": "",
                    "Rslt": "",
                    "Zremark": "",
                    "Ktextlos": ""
                }
                oformModel.setData(obj);
                this.getView().setModel(oformModel, "formModel");
            },
            onSave: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                if (this.getView().byId("_IDGenInput1").getValue() === "") {
                    MessageBox.alert("Please enter the Lot No");
                    return;
                }
                if (this.getView().byId("_IDGenInput3").getValue() === "") {
                    MessageBox.alert("Please enter the Plant");
                    return;
                }
                if (this.getView().byId("_IDGenSelect1").getSelectedItem() === null) {
                    MessageBox.alert("Please enter the Shift");
                    return;
                }
                if (this.getView().byId("_IDGenInput6").getValue() === "") {
                    MessageBox.alert("Please enter the Thread No");
                    return;
                }
                if (this.getView().byId("_IDGenInput7").getValue() === "") {
                    MessageBox.alert("Please enter the Work Center");
                    return;
                }
                if (this.getView().byId("_IDGenInput31").getValue() === "") {
                    MessageBox.alert("Please enter the Other Instructions");
                    return;
                }
                if (this.getView().byId("_IDGenInput8").getValue() === "") {
                    MessageBox.alert("Please enter the Sales Order");
                    return;
                }
                if (this.getView().byId("_IDGenInput13").getValue() === "") {
                    MessageBox.alert("Please enter the Actual Weight");
                    return;
                }
                if (this.getView().byId("_IDGenInput14").getValue() === "") {
                    MessageBox.alert("Please enter the Actual Size");
                    return;
                }
                if (this.getView().byId("id_serialNoI").getValue() === "") {
                    MessageBox.alert("Please enter the Serial No");
                    return;
                }
                if (this.getView().byId("_IDGenInput15").getValue() === "") {
                    MessageBox.alert("Please enter the Fold");
                    return;
                }
                if (this.getView().byId("_IDGenInput16").getValue() === "") {
                    MessageBox.alert("Please enter the Trim Placement");
                    return;
                }
                if (this.getView().byId("_IDGenInput17").getValue() === "") {
                    MessageBox.alert("Please enter the Operator Leader Code");
                    return;
                }
                if (this.getView().byId("_IDGenInput18").getValue() === "") {
                    MessageBox.alert("Please enter the Approved by QA Code");
                    return;
                }if (this.getView().byId("_IDGenInput19").getValue() === "") {
                    MessageBox.alert("Please enter the Machine No");
                    return;
                }if (this.getView().byId("_IDGenSelect2").getSelectedItem() === null) {
                    MessageBox.alert("Please enter the Crowding at 4 Corner");
                    return;
                }if (this.getView().byId("_IDGenSelect3").getSelectedItem() === null) {
                    MessageBox.alert("Please enter the Result Approved");
                    return;
                }if (this.getView().byId("id_remarksI").getValue() === "") {
                    MessageBox.alert("Please enter the Remarks");
                    return;
                }
                var data = this.getView().getModel("formModel").getData();
                var aData = this.getView().getModel("AfterSelModel").getData();
                var shift = this.getView().byId("_IDGenSelect1").getSelectedKey();
                var CrowdCrnr = this.getView().byId("_IDGenSelect2").getSelectedKey();
                var Rslt = this.getView().byId("_IDGenSelect3").getSelectedKey();
                var date = this.getView().byId("_IDGenDatePicker1").getValue();
                if (data.ActWeight === "") {
                    data.ActWeight = "0.000"
                }
                if (data.ActLen === "") {
                    data.ActLen = "0.000"
                }
                if (data.ActWdth === "") {
                    data.ActWdth = "0.000"
                }
                var payload = {
                    "Prueflos": "",
                    "FpiPlant": aData.FpiPlant,
                    "Lotno": data.Lotno,
                    "FpiVbeln": data.FpiVbeln,
                    "Zdate": date,
                    "FpiVbelp": data.FpiVbelp,
                    "FpiMatnr": "",
                    "Shift": shift,
                    "FpiCustomer": aData.FpiCustomer,
                    "Prgrm": aData.Prgrm,
                    "StdWeight": aData.StdWeight,
                    "Thread": data.Thread,
                    "Arbpl": data.Arbpl,
                    "StdLen": aData.StdLen,
                    "OthIns": data.OthIns,
                    "StdWdth": aData.StdWdth,
                    "ActWeight": data.ActWeight,
                    "ActLen": data.ActLen,
                    "ActWdth": data.ActWdth,
                    "Shade": aData.Shade,
                    "Fold": data.Fold,
                    "TrimPlcmnt": data.TrimPlcmnt,
                    "OperCode": data.OperCode,
                    "ApprBy": data.ApprBy,
                    "Machine": data.Machine,
                    "Crowd4Crnr": CrowdCrnr,
                    "Rslt": Rslt,
                    "Zremark": data.Zremark,
                    "Ktextlos": data.Ktextlos
                };
                var busy = new sap.m.BusyDialog();
                busy.open();
                oModel.create("/FPISet", payload, {
                    success: function (oRetrievedResult) {
                        var PlantModel = new sap.ui.model.json.JSONModel();
                        PlantModel.setData(oRetrievedResult.results);
                        that.getView().setModel(PlantModel, "PlantModel");
                        busy.close();
                        MessageBox.success("Do you want to print the PDF - " + oRetrievedResult.Prueflos, {
                            actions: [MessageBox.Action.OK, MessageBox.Action.CLOSE],
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (sAction) {
                                if (sAction === "OK") {
                                    var sURL = that.getOwnerComponent().getModel().sServiceUrl + "/PDFSet('" + oRetrievedResult.Prueflos + "')/$value";
                                    window.open(sURL, "_self");//_blank
                                }
                            }
                        });
                    },
                    error: function (oError) {
                        busy.close();
                        MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                    }
                });
            },
            onLenChange: function (oEvent) {
                var val = oEvent.getParameter("value");
                var data = this.getView().getModel("formModel").getData();
                if (val !== "") {
                    data.ActLen = parseFloat(val).toFixed(2);
                }
            },
            onWdthChange: function (oEvent) {
                var val = oEvent.getParameter("value");
                var data = this.getView().getModel("formModel").getData();
                if (val !== "") {
                    data.ActWdth = parseFloat(val).toFixed(2);
                }
            },
            onWeightChange: function (oEvent) {
                var val = oEvent.getParameter("value");
                var data = this.getView().getModel("formModel").getData();
                if (val !== "") {
                    data.ActWeight = parseFloat(val).toFixed(2);
                }
            },
            onQACode: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/codeby_F4Set", {
                    success: function (oData) {
                        var oQACode = new sap.ui.model.json.JSONModel();
                        oQACode.setData(oData.results);
                        that.getView().setModel(oQACode, "QACode");
                        if (!that._oQACodeDialog) {
                            that._oQACodeDialog = Fragment.load({
                                id: that.getView().getId(),
                                name: "com.sap.firstpiece.zqmfirstpiece.Fragments.QACodeDialog",
                                controller: that
                            }).then(function (oDialog) {
                                that.getView().addDependent(oDialog);
                                return oDialog;
                            });
                        }
                        that._oQACodeDialog.then(function (oDialog) {
                            // Create a filter for the binding
                            oDialog.open();
                        });
                    },
                    error: function (oResp) {
                        var data = oResp;
                    }
                });
            },
            onQACodeSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Username", FilterOperator.Contains, sValue);
                oEvent.getSource().getBinding("items").filter([oFilter]);
            },
            onQACodeClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
                if (!oSelectedItem) {
                    return;
                }
                this.byId("_IDGenInput18").setValue(oSelectedItem.getTitle());
                // this.byId("_IDGenInput23").setValue(oSelectedItem.getDescription().replace(/^0+/, ''));
                // this.onAfterSel();
            },
            onOprLeaderCode: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/codeby_F4Set", {
                    success: function (oData) {
                        var oOprLeaderCode = new sap.ui.model.json.JSONModel();
                        oOprLeaderCode.setData(oData.results);
                        that.getView().setModel(oOprLeaderCode, "OprLeaderCode");
                        if (!that._OprLeaderCodeialog) {
                            that._OprLeaderCodeialog = Fragment.load({
                                id: that.getView().getId(),
                                name: "com.sap.firstpiece.zqmfirstpiece.Fragments.OprLeaderCodeDialog",
                                controller: that
                            }).then(function (oDialog) {
                                that.getView().addDependent(oDialog);
                                return oDialog;
                            });
                        }
                        that._OprLeaderCodeialog.then(function (oDialog) {
                            // Create a filter for the binding
                            oDialog.open();
                        });
                    },
                    error: function (oResp) {
                        var data = oResp;
                    }
                });
            },
            onOprLeaderCodeSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Username", FilterOperator.Contains, sValue);
                oEvent.getSource().getBinding("items").filter([oFilter]);
            },
            onOprLeaderCodeClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
                if (!oSelectedItem) {
                    return;
                }
                this.byId("_IDGenInput17").setValue(oSelectedItem.getTitle());
                // this.byId("_IDGenInput23").setValue(oSelectedItem.getDescription().replace(/^0+/, ''));
                // this.onAfterSel();
            },
            onSalesOrder: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var LotNum = this.getView().byId("_IDGenInput1").getValue();
                if (LotNum === "") {
                    sap.m.MessageToast.show("Please enter the Lot Number");
                    return;
                }
                var filter1 = new sap.ui.model.Filter({
                    path: "Lotno",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: LotNum
                });
                oModel.read("/FPI_F4Set", {
                    filters: [filter1],
                    success: function (oData) {
                        var oSalesOrderModel = new sap.ui.model.json.JSONModel();
                        oSalesOrderModel.setData(oData.results);
                        that.getView().setModel(oSalesOrderModel, "SalesOrderModel");
                        if (!that._pValueHelpDialog) {
                            that._pValueHelpDialog = Fragment.load({
                                id: that.getView().getId(),
                                name: "com.sap.firstpiece.zqmfirstpiece.Fragments.SalesOrdeDialog",
                                controller: that
                            }).then(function (oDialog) {
                                that.getView().addDependent(oDialog);
                                return oDialog;
                            });
                        }
                        that._pValueHelpDialog.then(function (oDialog) {
                            // Create a filter for the binding
                            oDialog.open();
                        });
                    },
                    error: function (oResp) {
                        var data = oResp;
                    }
                });
            },
            onSOValueHelpSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Salesorder", FilterOperator.Contains, sValue);
                oEvent.getSource().getBinding("items").filter([oFilter]);
            },

            onSOValueHelpClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
                if (!oSelectedItem) {
                    return;
                }
                this.SalesOrder = oSelectedItem.getTitle();
                this.SalesOrderI = oSelectedItem.getDescription();
                this.byId("_IDGenInput8").setValue(oSelectedItem.getTitle());
                this.byId("_IDGenInput23").setValue(oSelectedItem.getDescription().replace(/^0+/, ''));
                this.onAfterSel();
            },
            onLotNum: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var LotNum = this.getView().byId("_IDGenInput1").getValue();
                this.onPlant();
                var filter1 = new sap.ui.model.Filter({
                    path: "Lotno",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: LotNum
                });
                oModel.read("/FPISet", {
                    filters: [filter1],
                    success: function (oData) {
                        var oLotNumModel = new sap.ui.model.json.JSONModel();
                        oData.results[0].FpiPlant = that.Plant;
                        oData.results[0].StdLen = parseFloat(oData.results[0].StdLen).toFixed(2);
                        oData.results[0].StdWdth = parseFloat(oData.results[0].StdWdth).toFixed(2);
                        oData.results[0].StdWeight = parseFloat(oData.results[0].StdWeight).toFixed(2);
                        oLotNumModel.setData(oData.results[0]);
                        that.getView().setModel(oLotNumModel, "AfterSelModel");
                    },
                    error: function (oResp) {
                        var data = oResp;
                    }
                });
            },
            onPlant: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var LotNum = this.getView().byId("_IDGenInput1").getValue();
                var filter1 = new sap.ui.model.Filter({
                    path: "Lotno",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: LotNum
                });
                oModel.read("/FPISet", {
                    filters: [filter1],
                    success: function (oData) {
                        that.Plant = oData.results[0].FpiPlant;
                        // var oPlantModel = new sap.ui.model.json.JSONModel();
                        // oPlantModel.setData(oData.results[0].FpiPlant);
                        // that.getView().setModel(oPlantModel, "PlantModel");
                    },
                    error: function (oResp) {
                        var data = oResp;
                    }
                });
            },
            onPlantValueHelpSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Arbpl", FilterOperator.Contains, sValue);
                oEvent.getSource().getBinding("items").filter([oFilter]);
            },

            onPlantValueHelpClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
                if (!oSelectedItem) {
                    return;
                }
                this.byId("_IDGenInput7").setValue(oSelectedItem.getTitle());
            },
            onWorkCenter: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var LotNum = this.getView().byId("_IDGenInput3").getValue();
                var filter1 = new sap.ui.model.Filter({
                    path: "Plant",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: LotNum
                });
                oModel.read("/WC_F4Set", {
                    filters: [filter1],
                    success: function (oData) {
                        var oWCModel = new sap.ui.model.json.JSONModel();
                        oWCModel.setData(oData.results);
                        that.getView().setModel(oWCModel, "WCModel");
                        if (!that._WCValueHelpDialog) {
                            that._WCValueHelpDialog = Fragment.load({
                                id: that.getView().getId(),
                                name: "com.sap.firstpiece.zqmfirstpiece.Fragments.WCDialog",
                                controller: that
                            }).then(function (oDialog) {
                                that.getView().addDependent(oDialog);
                                return oDialog;
                            });
                        }
                        that._WCValueHelpDialog.then(function (oDialog) {
                            // Create a filter for the binding
                            oDialog.open();
                        });
                    },
                    error: function (oResp) {
                        var data = oResp;
                    }
                });
            },
            onWCValueHelpSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Arbpl", FilterOperator.Contains, sValue);
                oEvent.getSource().getBinding("items").filter([oFilter]);
            },

            onWCValueHelpClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
                if (!oSelectedItem) {
                    return;
                }
                this.byId("_IDGenInput7").setValue(oSelectedItem.getTitle());
                this.byId("_IDGenInput7").setDescription(oSelectedItem.getDescription());
            },
            onAfterSel: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var filter1 = new sap.ui.model.Filter({
                    path: "FpiVbeln",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: this.SalesOrder
                });
                var filter2 = new sap.ui.model.Filter({
                    path: "FpiVbelp",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: this.SalesOrderI
                });
                oModel.read("/FPISet", {
                    filters: [filter1, filter2],
                    success: function (oData) {
                        var oAfterSelModel = new sap.ui.model.json.JSONModel();
                        oData.results[0].FpiPlant = that.Plant;
                        oAfterSelModel.setData(oData.results[0]);
                        that.getView().setModel(oAfterSelModel, "AfterSelModel");
                    },
                    error: function (oResp) {
                        var data = oResp;
                    }
                });
            },
            onPrintAnotherLot: function (oEvent) {
                var oView = this.getView();
                // create dialog lazily
                if (!this.byId("openDialog")) {
                    // load asynchronous XML fragment
                    Fragment.load({
                        id: oView.getId(),
                        name: "com.sap.firstpiece.zqmfirstpiece.Fragments.PrintLot",
                        controller: this
                    }).then(function (oDialog) {
                        // connect dialog to the root view 
                        //of this component (models, lifecycle)
                        oView.addDependent(oDialog);
                        oDialog.open();
                    });
                } else {
                    this.byId("openDialog").open();
                }
            },
            closeDialog: function () {
                var sURL = this.getOwnerComponent().getModel().sServiceUrl + "/PDFSet('" + 890000000083 + "')/$value";
                window.open(sURL, "_blank");
                this.byId("openDialog").close();
            }
        });
    });
