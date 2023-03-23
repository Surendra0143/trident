sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/m/MessageToast'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, Filter, FilterOperator, MessageToast) {
        "use strict";

        return Controller.extend("com.sap.rcp.zqmreworkconfirm.controller.View1", {
            onInit: function () {

            },
            onToPage2: function () {
                var plant = this.getView().byId("id_plant").getValue();
                var lotNum = this.getView().byId("id_lotNum").getValue();
                this.getOwnerComponent().getRouter().navTo("RouteView2", {
                    Param1: window.encodeURIComponent(plant),
                    Param2: window.encodeURIComponent(lotNum)
                });
            },
            onPlantValidation: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/initial_f4Set", {
                    success: function (oData) {
                        var oPlantDetails = new sap.ui.model.json.JSONModel();
                        oPlantDetails.setData(oData.results);
                        that.getView().setModel(oPlantDetails, "PlantDetails");
                        if (!that._PlantDialog) {
                            that._PlantDialog = Fragment.load({
                                id: that.getView().getId(),
                                name: "com.sap.rcp.zqmreworkconfirm.Fragments.PlantDialog",
                                controller: that
                            }).then(function (oDialog) {
                                that.getView().addDependent(oDialog);
                                return oDialog;
                            });
                        }
                        that._PlantDialog.then(function (oDialog) {
                            oDialog.open();
                        });
                    },
                    error: function (oResp) {
                        var data = oResp;
                    }
                });
            },
            onPlantSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Plant", FilterOperator.Contains, sValue);
                oEvent.getSource().getBinding("items").filter([oFilter]);
            },
            onPlantClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
                if (!oSelectedItem) {
                    return;
                }
                this.byId("id_plant").setValue(oSelectedItem.getTitle());
            },
            onCancel: function () {
                this.getView().byId("id_plant").setValue("");
                this.getView().byId("id_lotNum").setValue("");
            },
            onPlantValidation1: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var Plant = this.getView().byId("id_plant").getValue();
                var filter1 = new sap.ui.model.Filter({
                    path: "Plant",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: Plant
                });
                oModel.read("/initial_f4Set", {
                    filters: [filter1],
                    success: function (oData) {
                        that.getView().byId("_IDGenButton1").setEnabled(true);
                        var data = oData;
                    },
                    error: function (oResp) {
                        that.getView().byId("_IDGenButton1").setEnabled(false);
                        that.Error = "X";
                        that.Msg = JSON.parse(oResp.responseText).error.message.value;
                        MessageToast.show(that.Msg);
                    }
                });
            },
            onLotValidation: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var Plant = this.getView().byId("id_plant").getValue();
                var LotNum = this.getView().byId("id_lotNum").getValue();
                var filter1 = new sap.ui.model.Filter({
                    path: "Plant",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: Plant
                });
                var filter2 = new sap.ui.model.Filter({
                    path: "Lotno",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: LotNum
                });
                oModel.read("/initial_f4Set", {
                    filters: [filter1, filter2],
                    success: function (oData) {
                        that.getView().byId("_IDGenButton1").setEnabled(true);
                        var data = oData;
                    },
                    error: function (oResp) {
                        that.getView().byId("_IDGenButton1").setEnabled(false);
                        MessageToast.show(that.Msg);
                    }
                });
            }
        });
    });
