sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "com/trident/weste/project1/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Fragment, Filter, FilterOperator, MessageBox, formatter) {
        "use strict";

        return Controller.extend("com.trident.weste.project1.controller.View1", {
            formatter: formatter,
            onInit: function () {
                var oShiftModel = new sap.ui.model.json.JSONModel();
                var data = {
                    "Shifts": [
                        {
                            "Shift": "A"
                        },
                        {
                            "Shift": "B"
                        },
                        {
                            "Shift": "C"
                        }
                    ]
                }
                oShiftModel.setData(data.Shifts);
                this.getView().setModel(oShiftModel, "oShiftModel");
                this.byId("DP3").setDateValue(new Date());
            },
            onPlant: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    that = this;
                var oModel = this.getOwnerComponent().getModel();
                var busy = new sap.m.BusyDialog();
                busy.open();
                oModel.read("/GetPlantValuehelpSet", {
                    success: function (oRetrievedResult) {
                        var PlantModel = new sap.ui.model.json.JSONModel();
                        PlantModel.setData(oRetrievedResult.results);
                        that.getView().setModel(PlantModel, "PlantModel");
                        busy.close();
                        if (!that.PlantDialog) {
                            that.PlantDialog = Fragment.load({
                                id: that.getView().getId(),
                                name: "com.trident.weste.project1.Fragments.Plant",
                                controller: that
                            }).then(function (oDialog) {
                                that.getView().addDependent(oDialog);
                                return oDialog;
                            });
                        }
                        that.PlantDialog.then(function (oDialog) {
                            // Create a filter for the binding
                            // oDialog.getBinding("items").filter([new Filter("Werks", FilterOperator.Contains, sInputValue), new Filter("Name1", FilterOperator.Contains, sInputValue)]);
                            // Open ValueHelpDialog filtered by the input's value
                            oDialog.open(sInputValue);
                        });
                    },
                    error: function (oError) {
                        busy.close();
                        MessageBox.error(oError.responseText);
                    }
                });
            },
            onValueHelpSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Werks", FilterOperator.Contains, sValue);
                // var oFilter1 = new Filter("Name1", FilterOperator.Contains, sValue);

                oEvent.getSource().getBinding("items").filter([oFilter]);
            },
            onValueHelpClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
                this.Plant = oSelectedItem.getTitle();
                if (!oSelectedItem) {
                    return;
                }
                this.byId("id_Plant").setValue(oSelectedItem.getTitle());
                this.byId("id_Plant").setDescription(oSelectedItem.getDescription());
            },
            onSectionCode: function (oEvent) {
                var sPlant = this.getView().byId("id_Plant").getValue();
                if (sPlant === ""||sPlant===undefined) {
                    sap.m.MessageToast.show("Please enter the Plant"), {
                        duration: 3000,
                        width: "15rem"
                    };
                    return
                }
                var filter1 = new sap.ui.model.Filter({
                    path: "Plant",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: this.Plant //"T311"
                });
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var busy = new sap.m.BusyDialog();
                busy.open();
                oModel.read("/SectionValuehelpSet", {
                    filters: [filter1],
                    success: function (oRetrievedResult) {
                        var secCodeModel = new sap.ui.model.json.JSONModel();
                        secCodeModel.setData(oRetrievedResult.results);
                        that.getView().setModel(secCodeModel, "secCodeModel");
                        busy.close();
                        if (!that.SectionCodeDialog) {
                            that.SectionCodeDialog = Fragment.load({
                                id: that.getView().getId(),
                                name: "com.trident.weste.project1.Fragments.SectionCode",
                                controller: that
                            }).then(function (oDialog) {
                                that.getView().addDependent(oDialog);
                                return oDialog;
                            });
                        }
                        that.SectionCodeDialog.then(function (oDialog) {
                            // Create a filter for the binding
                            // oDialog.getBinding("items").filter([new Filter("Werks", FilterOperator.Contains, sInputValue), new Filter("Name1", FilterOperator.Contains, sInputValue)]);
                            // Open ValueHelpDialog filtered by the input's value
                            oDialog.open();
                        });
                    },
                    error: function (oError) {
                        busy.close();
                        MessageBox.error(oError.responseText);
                    }
                });
            },
            onSecCodeSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("SectionCode", FilterOperator.Contains, sValue);
                oEvent.getSource().getBinding("items").filter([oFilter]);
            },
            onSecCodeClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
                this.secCode = oSelectedItem.getTitle();
                if (!oSelectedItem) {
                    return;
                }
                this.byId("id_sectionCode").setValue(oSelectedItem.getTitle());
                this.byId("id_sectionCode").setDescription(oSelectedItem.getDescription());
            },
            onPress: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var shift = this.getView().byId("id_Shift").getSelectedKey();
                var date = this.getView().byId("DP3").getValue();
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "yyyy-MM-dd"
                });
                var oDate = dateFormat.format(new Date(date), true);
                var filter1 = new sap.ui.model.Filter({
                    path: "Plant",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: this.Plant //"T311"
                });
                var filter2 = new sap.ui.model.Filter({
                    path: "Shift",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: shift //"A"
                });
                var filter3 = new sap.ui.model.Filter({
                    path: "SectionCode",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: this.secCode
                });
                var filter4 = new sap.ui.model.Filter({
                    path: "Date",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: oDate // + "T00:00:00" //"2022-11-23T00:00:00"
                });
                var sPlant = this.getView().byId("id_Plant").getValue();
                if (sPlant === ""||sPlant===undefined) {
                    sap.m.MessageToast.show("Please enter the Plant");
                    return
                }
                var sShift = this.getView().byId("id_Shift").getSelectedKey();
                if (sShift === ""||sShift===undefined) {
                    sap.m.MessageToast.show("Please enter the Shift");
                    return
                }
                var sectCode = this.getView().byId("id_sectionCode").getValue();
                if (sectCode === ""||sectCode===undefined) {
                    sap.m.MessageToast.show("Please enter the Section Code");
                    return
                }
                                var busy = new sap.m.BusyDialog();
                busy.open();
                oModel.read("/WasteBookingDetailsSet", {
                    filters: [filter1, filter2, filter3, filter4],
                    success: function (oRetrievedResult) {
                        var DetailModel = new sap.ui.model.json.JSONModel();
                        DetailModel.setData(oRetrievedResult.results);
                        that.getView().setModel(DetailModel, "DetailModel");
                        busy.close();
                    },
                    error: function (oError) {
                        busy.close();
                        var errtext = JSON.parse(oError.responseText).error.innererror.errordetails;
                        if (errtext === undefined) {
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                            return;
                        }
                        var msg = "";
                        for (var i = 0; i < errtext.length; i++) {
                            var msgd = JSON.parse(oError.responseText).error.innererror.errordetails[i];
                            var errmsg = msgd.message;
                            msg += errmsg + "\n";
                        }
                        MessageBox.error(msg);
                    }
                });
            },
            onOrderDetails: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var oSelectedIndeces = this.getView().byId("idOrderDetialsTable").getSelectedIndices();
                this.Arr = [];
                for (var i = 0; i < oSelectedIndeces.length; i++) {
                    var sPath = this.getView().byId("idOrderDetialsTable").getSelectedIndices()[i];
                    var obj = this.getView().getModel("DetailModel").getData()[sPath];
                    obj.OrdDtlButton = "X";
                    this.Arr.push(obj);
                }
                var payload = {
                    "Material": "CHINDI",
                    "WasteBookingDetailsSet": this.Arr
                }
                var busy = new sap.m.BusyDialog();
                busy.open();
                oModel.create("/WasteBookingHeaderSet", payload, {
                    success: function (oRetrievedResult) {
                        var OrderDetailModel = new sap.ui.model.json.JSONModel();
                        OrderDetailModel.setData(oRetrievedResult.WasteBookingDetailsSet.results);
                        that.getView().setModel(OrderDetailModel, "OrderDetailModel");
                        busy.close();
                    },
                    error: function (oError) {
                        busy.close();
                        // if (oError.responseText !== "") {
                        //     MessageBox.error(oError.responseText);
                        // } else {
                        var errtext = JSON.parse(oError.responseText).error.innererror.errordetails;
                        if (errtext === undefined) {
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                            return;
                        }
                        var msg = "";
                        for (var i = 0; i < errtext.length; i++) {
                            var msgd = JSON.parse(oError.responseText).error.innererror.errordetails[i];
                            var errmsg = msgd.message;
                            msg += errmsg + "\n";
                        }
                        MessageBox.error(msg);
                        // }
                    }
                });
            },
            onPostDetails: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var data = this.getView().getModel("OrderDetailModel").getData();
                this.Arr = [];
                for (var i = 0; i < data.length; i++) {
                    var obj = this.getView().getModel("OrderDetailModel").getData()[i];
                    obj.PostButton = "X";
                    this.Arr.push(obj);
                }
                var payload = {
                    "Material": "CHINDI",
                    "WasteBookingDetailsSet": this.Arr
                }
                var busy = new sap.m.BusyDialog();
                busy.open();
                oModel.create("/WasteBookingHeaderSet", payload, {
                    success: function (oRetrievedResult) {
                        var errmsg = "";
                        for (var i = 0; i < oRetrievedResult.WasteBookingDetailsSet.results.length; i++) {
                            var data = oRetrievedResult.WasteBookingDetailsSet.results[i];
                            if (data.MegType === "E") {
                                errmsg += "Error:" + data.Message + "\n";
                            }
                            if (data.MegType === "S") {
                                errmsg += "Success:" + data.Message + "\n";
                            }
                            // MessageBox.information();
                        }
                        if (errmsg !== "") {
                            // MessageBox.information(errmsg);
                            that.errglb = errmsg;
                        }
                        if (!that._oMDialog) {
                            that._oMDialog = sap.ui.xmlfragment(that.getView().getId(), "com.trident.weste.project1.Fragments.Message", that);
                            // read the data from backend and set it to the dialog through model
                            //if you use global model no need to set the model
                            // that._oMDialog.setModel(oRetrievedResult.WasteBookingDetailsSet.results);
                            that.getView().addDependent(that._oMDialog);
                        }
                        that._oMDialog.open();

                        var LogModel = new sap.ui.model.json.JSONModel();
                        LogModel.setData(oRetrievedResult.WasteBookingDetailsSet.results);
                        that.getView().setModel(LogModel, "LogModel");
                        busy.close();
                    },
                    error: function (oError) {
                        busy.close();
                        var errtext = JSON.parse(oError.responseText).error.innererror.errordetails;
                        if (errtext === undefined) {
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                            return;
                        }
                        var msg = "";
                        for (var i = 0; i < errtext.length; i++) {
                            var msgd = JSON.parse(oError.responseText).error.innererror.errordetails[i];
                            var errmsg = msgd.message;
                            msg += errmsg + "\n";
                        }
                        MessageBox.error(msg);
                    }
                });
            },
            closeDialog: function () {
                this._oMDialog.close();
            },
            onLogPress: function () {
                MessageBox.information(this.errglb);
            },
            filterGlobally: function (oEvent) {
                var sQuery = oEvent.getParameter("query");

                // build filter array
                var aFilter = [];

                if (sQuery) {
                    aFilter.push(new Filter("Material", FilterOperator.Contains, sQuery));
                }
                // filter binding
                var oTable = this.byId("idOrderDetialsTable");
                var oBinding = oTable.getBinding("rows");
                oBinding.filter(aFilter);
            },
        });
    });
