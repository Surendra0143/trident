sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/m/MessageToast',
    "sap/ui/core/routing/History",
    "sap/m/MessageBox",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, Filter, FilterOperator, MessageToast, History, MessageBox) {
        "use strict";

        return Controller.extend("com.sap.rcp.zqmreworkconfirm.controller.View2", {
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteView2").attachPatternMatched(this._onObjectMatched, this);
                var initData = new sap.ui.model.json.JSONModel();
                this.Arr = [];
                var obj = {
                    "RforR": "",
                    "totalR": "",
                    "balQty": "",
                    "confQty": "",
                    "workCenter": "",
                    "wcDesc": "",
                    "teamNo": ""
                };
                this.Arr.push(obj);
                initData.setData(this.Arr);
                this.getView().setModel(initData, "initData");
                var oDateModel = new sap.ui.model.json.JSONModel({
                    dDefaultDate: new Date()
                });
                this.getView().setModel(oDateModel, "view");
            },
            _onObjectMatched: function (oEvent) {
                this.getView().bindElement({ path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").Param1) });
                this.plant = oEvent.getParameter("arguments").Param1;
                this.lotNum = oEvent.getParameter("arguments").Param2;
                this.getView().byId("id_pllant2").setValue(this.plant);
                this.getView().byId("id_lotNum2").setValue(this.lotNum);
                this.onRefresh();
            },
            onBack: function () {
                this.getOwnerComponent().getRouter().navTo("RouteView1", null, true);
                location.reload();
                // var sPreviousHash = History.getInstance().getPreviousHash();
                // //The history contains a previous entry
                // if (sPreviousHash !== undefined) {
                //     window.history.go(-1);
                // } else {
                //     // There is no history!
                //     // replace the current hash with page 1 (will not add an history entry)
                //     this.getOwnerComponent().getRouter().navTo("RouteView1", null, true);
                // }
            },
            onSave: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var tbl = this.getView().getModel("initData").getData();
                var ReworkProOrd = this.getView().byId("id_pllant21").getValue();
                var SuperVisor = this.getView().byId("id_supervisor").getValue();
                var BalReworkOQ = this.getView().byId("_IDGenInput21").getValue();
                var modelLength = this.getView().getModel("initData").getData().length;
                var mtrlCode = this.getView().byId("id_material").getValue();
                var newVal = 0;
                for (var i = 0; i < modelLength; i++) {
                    var totalReject = this.getView().getModel("initData").getData()[i].totalR;
                    newVal += parseInt(totalReject);
                    var reasonForReject = this.getView().getModel("initData").getData()[i].RforR;
                    var workCtr = this.getView().getModel("initData").getData()[i].workCenter;
                    var teamNo = this.getView().getModel("initData").getData()[i].teamNo;
                    if (reasonForReject === "") {
                        sap.m.MessageToast.show("Please enter the Reason for Rejection");
                        return;
                    }
                    if (totalReject === "") {
                        sap.m.MessageToast.show("Please enter the Total Rejection");
                        return;
                    }
                    if (workCtr === "") {
                        sap.m.MessageToast.show("Please enter the Work Center");
                        return;
                    }
                    if (teamNo === "") {
                        sap.m.MessageToast.show("Please enter the Team No");
                        return;
                    }
                }
                if (newVal > parseInt(BalReworkOQ)) {
                    sap.m.MessageToast.show("Over delivery is not permitted");
                    return;
                }
                if (mtrlCode === "") {
                    sap.m.MessageToast.show("Please enter the Material Code");
                    return;
                }
                if (SuperVisor === "") {
                    sap.m.MessageToast.show("Please enter the SuperVisor");
                    return;
                }
                if (this.getView().getModel("AfterMatDetails") === undefined) {
                    return;
                } else {
                    var SData = this.getView().getModel("AfterMatDetails").getData();
                }
                var results = [];
                var date = this.getView().byId("idDatePicker").getDateValue().toISOString().split('T')[0];
                for (var v = 0; v < tbl.length; v++) {
                    if (tbl[v].totalR === "") {
                        tbl[v].totalR = "0.00";
                    }
                    var obj = {
                        "ReasonRejection": tbl[v].RforR,
                        "ReworkProdOrd": ReworkProOrd,
                        "TotalRejectionPcs": tbl[v].totalR,
                        "WorkCenter": tbl[v].workCenter,
                        "TeamNo": tbl[v].teamNo,
                        "ProductionDate": date,
                        "Shift": SData.Shift,
                        "Customer": SData.Customer,
                        "ProgramName": SData.ProgramName,
                        "Supervisor": SuperVisor
                    }
                    results.push(obj);
                }
                var payload = {
                    "d": {
                        "Plant": "",
                        "Lotno": "",
                        "Message": "",
                        "MsgTyp": "",
                        "save_nav": {
                            "results": results
                        }
                    }
                }
                // saveSet
                oModel.create("/initial_f4Set", payload, {
                    success: function (oData) {
                        MessageBox.success(oData.Message);
                        that.onRefresh();
                        // that.getView().byId("id_pllant2").setValue("");
                        // that.getView().byId("id_lotNum2").setValue("");
                    },
                    error: function (oResp) {
                        MessageBox.error(JSON.parse(oResp.responseText).error.message.value);
                    }
                });
            },
            onAdd: function () {
                var obj = {
                    "RforR": "",
                    "totalR": "",
                    "balQty": "",
                    "confQty": "",
                    "workCenter": "",
                    "wcDesc": "",
                    "teamNo": ""
                };
                this.Arr.push(obj);
                this.getView().getModel("initData").refresh();
            },
            onDelete: function (oEvent) {
                var sPath = oEvent.getSource().getParent().getBindingContext("initData").sPath.replace("/", "");
                var data = this.getView().getModel("initData").getData();
                if (data.length === 1) {
                    MessageToast.show("Atleast one record should be there");
                    return;
                } else {
                    this.getView().getModel("initData").getData().splice(sPath, 1);
                    this.getView().getModel("initData").refresh();
                }
            },
            onSupervisor: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/Supervisior_F4Set", {
                    success: function (oData) {
                        var oSupervisorDetails = new sap.ui.model.json.JSONModel();
                        oSupervisorDetails.setData(oData.results);
                        that.getView().setModel(oSupervisorDetails, "SupervisorDetails");
                        if (!that._SupervisorDialog) {
                            that._SupervisorDialog = Fragment.load({
                                id: that.getView().getId(),
                                name: "com.sap.rcp.zqmreworkconfirm.Fragments.SupervisorDialog",
                                controller: that
                            }).then(function (oDialog) {
                                that.getView().addDependent(oDialog);
                                return oDialog;
                            });
                        }
                        that._SupervisorDialog.then(function (oDialog) {
                            oDialog.open();
                        });
                    },
                    error: function (oResp) {
                        MessageToast.show(JSON.parse(oResp.responseText).error.message.value);
                    }
                });
            },
            onSupervisorSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Material", FilterOperator.Contains, sValue);
                oEvent.getSource().getBinding("items").filter([oFilter]);
            },
            onSupervisorClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
                if (!oSelectedItem) {
                    return;
                }
                this.byId("id_supervisor").setValue(oSelectedItem.getTitle());
                this.byId("id_supervisor").setDescription(oSelectedItem.getDescription());
                // this.SupervisorId = oSelectedItem.getTitle();
            },
            onMaterial: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var filter1 = new sap.ui.model.Filter({
                    path: "Plant",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: this.plant
                });
                var filter2 = new sap.ui.model.Filter({
                    path: "Lotno",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: this.lotNum
                });
                oModel.read("/CSPSet", {
                    filters: [filter1, filter2],
                    success: function (oData) {
                        var oMaterialDetails = new sap.ui.model.json.JSONModel();
                        oMaterialDetails.setData(oData.results);
                        that.getView().setModel(oMaterialDetails, "MaterialDetails");
                        if (!that._MaterialDialog) {
                            that._MaterialDialog = Fragment.load({
                                id: that.getView().getId(),
                                name: "com.sap.rcp.zqmreworkconfirm.Fragments.MaterialDialog",
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
                        MessageToast.show(JSON.parse(oResp.responseText).error.message.value);
                    }
                });
            },
            onMaterialSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Material", FilterOperator.Contains, sValue);
                oEvent.getSource().getBinding("items").filter([oFilter]);
            },
            onMaterialClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
                if (!oSelectedItem) {
                    return;
                }

                var data = this.getView().getModel("MaterialDetails").getData();
                for (var v = 0; v < data.length; v++) {
                    if (oSelectedItem.getTitle() === data[v].Material) {
                        var oOtherDetails = new sap.ui.model.json.JSONModel();
                        oOtherDetails.setData(data[v]);
                        this.getView().setModel(oOtherDetails, "OtherDetails");
                    }
                };
                this.byId("id_material").setValue(oSelectedItem.getTitle());
                this.afterSelectMaterial(oSelectedItem.getTitle());
            },
            afterSelectMaterial: function (oVal) {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var filter1 = new sap.ui.model.Filter({
                    path: "Plant",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: this.plant
                });
                var filter2 = new sap.ui.model.Filter({
                    path: "Lotno",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: this.lotNum
                });
                var filter3 = new sap.ui.model.Filter({
                    path: "Material",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: oVal
                });
                oModel.read("/CSPSet", {
                    filters: [filter1, filter2, filter3],
                    success: function (oData) {
                        var oAfterMatDetails = new sap.ui.model.json.JSONModel();
                        oAfterMatDetails.setData(oData.results[0]);
                        that.getView().setModel(oAfterMatDetails, "AfterMatDetails");
                    },
                    error: function (oResp) {
                        MessageToast.show(JSON.parse(oResp.responseText).error.message.value);
                    }
                });
            },
            onProdOrder: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var filter1 = new sap.ui.model.Filter({
                    path: "Plant",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: this.plant
                });
                var filter2 = new sap.ui.model.Filter({
                    path: "Lotno",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: this.lotNum
                });
                oModel.read("/Rework_orderSet", {
                    filters: [filter1, filter2],
                    success: function (oData) {
                        var oProdOrdDetails = new sap.ui.model.json.JSONModel();
                        oProdOrdDetails.setData(oData.results);
                        that.getView().setModel(oProdOrdDetails, "ProdOrdDetails");
                        if (!that._ProdOrdDialog) {
                            that._ProdOrdDialog = Fragment.load({
                                id: that.getView().getId(),
                                name: "com.sap.rcp.zqmreworkconfirm.Fragments.ProdOrdDialog",
                                controller: that
                            }).then(function (oDialog) {
                                that.getView().addDependent(oDialog);
                                return oDialog;
                            });
                        }
                        that._ProdOrdDialog.then(function (oDialog) {
                            oDialog.open();
                        });
                    },
                    error: function (oResp) {
                        MessageToast.show(JSON.parse(oResp.responseText).error.message.value);
                    }
                });
            },
            onProdOrdSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("OrderNo", FilterOperator.Contains, sValue);
                oEvent.getSource().getBinding("items").filter([oFilter]);
            },
            onProdOrdClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
                if (!oSelectedItem) {
                    return;
                }
                this.byId("id_pllant21").setValue(oSelectedItem.getTitle());
                this.onConfProdOrd(oSelectedItem.getTitle());
            },
            onReasonFR: function (oEvent) {
                var that = this;
                this.sPath = oEvent.getSource().getParent().getBindingContext("initData").sPath.replace("/", "");
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/Item_detailsSet", {
                    success: function (oData) {
                        var oReaFrRejcn = new sap.ui.model.json.JSONModel();
                        oReaFrRejcn.setData(oData.results);
                        that.getView().setModel(oReaFrRejcn, "ReaFrRejcn");
                        if (!that._RforRejDialog) {
                            that._RforRejDialog = Fragment.load({
                                id: that.getView().getId(),
                                name: "com.sap.rcp.zqmreworkconfirm.Fragments.RforRejDialog",
                                controller: that
                            }).then(function (oDialog) {
                                that.getView().addDependent(oDialog);
                                return oDialog;
                            });
                        }
                        that._RforRejDialog.then(function (oDialog) {
                            oDialog.open();
                        });
                    },
                    error: function (oResp) {
                        MessageToast.show(JSON.parse(oResp.responseText).error.message.value);
                    }
                });
            },
            onRforRSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("ReasonRejection", FilterOperator.Contains, sValue);
                oEvent.getSource().getBinding("items").filter([oFilter]);
            },
            onRforRClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (!oSelectedItem) {
                    return;
                }
                this.getView().getModel("initData").getData()[this.sPath].RforR = oSelectedItem.getDescription();
                this.getView().getModel("initData").refresh();
            },
            onWorkCenter: function (oEvent) {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                this.sPath1 = oEvent.getSource().getParent().getBindingContext("initData").sPath.replace("/", "");
                var filter1 = new sap.ui.model.Filter({
                    path: "Plant",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: this.plant
                });
                oModel.read("/Item_detailsSet", {
                    filters: [filter1],
                    success: function (oData) {
                        var oWorkCenter = new sap.ui.model.json.JSONModel();
                        oWorkCenter.setData(oData.results);
                        that.getView().setModel(oWorkCenter, "WorkCenter");
                        if (!that._WorkCtrDialog) {
                            that._WorkCtrDialog = Fragment.load({
                                id: that.getView().getId(),
                                name: "com.sap.rcp.zqmreworkconfirm.Fragments.WorkCtrDialog",
                                controller: that
                            }).then(function (oDialog) {
                                that.getView().addDependent(oDialog);
                                return oDialog;
                            });
                        }
                        that._WorkCtrDialog.then(function (oDialog) {
                            oDialog.open();
                        });
                    },
                    error: function (oResp) {
                        MessageToast.show(JSON.parse(oResp.responseText).error.message.value);
                    }
                });
            },
            onWorkCtrSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("WorkCenter", FilterOperator.Contains, sValue);
                oEvent.getSource().getBinding("items").filter([oFilter]);
            },
            onWorkCtrClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (!oSelectedItem) {
                    return;
                }
                this.getView().getModel("initData").getData()[this.sPath1].workCenter = oSelectedItem.getTitle();
                this.onWorkCtrDesc(oSelectedItem.getTitle());
            },

            onWorkCtrDesc: function (oVal) {
                // Item_detailsSet?$filter=(WorkCenter eq 'T01CW003')
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var filter1 = new sap.ui.model.Filter({
                    path: "WorkCenter",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: oVal
                });
                oModel.read("/Item_detailsSet", {
                    filters: [filter1],
                    success: function (oData) {
                        var oWorkCtrDesc = new sap.ui.model.json.JSONModel();
                        oWorkCtrDesc.setData(oData.results);
                        that.getView().setModel(oWorkCtrDesc, "WorkCtrDesc");
                        that.getView().getModel("initData").getData()[that.sPath1].wcDesc = oData.results[0].WorkCenterDesc;
                        that.getView().getModel("initData").refresh();
                    },
                    error: function (oResp) {
                        MessageToast.show(JSON.parse(oResp.responseText).error.message.value);
                    }
                });
            },
            onTeamNo: function (oEvent) {
                var that = this;
                this.sPath2 = oEvent.getSource().getParent().getBindingContext("initData").sPath.replace("/", "");
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/Item_detailsSet", {
                    success: function (oData) {
                        var oTeamNo = new sap.ui.model.json.JSONModel();
                        oTeamNo.setData(oData.results);
                        that.getView().setModel(oTeamNo, "TeamNo");
                        if (!that._TeamNoDialog) {
                            that._TeamNoDialog = Fragment.load({
                                id: that.getView().getId(),
                                name: "com.sap.rcp.zqmreworkconfirm.Fragments.TeamNoDialog",
                                controller: that
                            }).then(function (oDialog) {
                                that.getView().addDependent(oDialog);
                                return oDialog;
                            });
                        }
                        that._TeamNoDialog.then(function (oDialog) {
                            oDialog.open();
                        });
                    },
                    error: function (oResp) {
                        MessageToast.show(JSON.parse(oResp.responseText).error.message.value);
                    }
                });
            },
            onTeamNoSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("TeamNo", FilterOperator.Contains, sValue);
                oEvent.getSource().getBinding("items").filter([oFilter]);
            },
            onTeamNoClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (!oSelectedItem) {
                    return;
                }
                this.getView().getModel("initData").getData()[this.sPath2].teamNo = oSelectedItem.getTitle();
                this.getView().getModel("initData").refresh();
            },
            onConfProdOrd: function (oValue) {
                // '000000400020'
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var filter1 = new sap.ui.model.Filter({
                    path: "ReworkProdOrd",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: oValue
                });

                oModel.read("/Rework_orderSet", {
                    filters: [filter1],
                    success: function (oData) {
                        var oreProdOrdDetails = new sap.ui.model.json.JSONModel();
                        oreProdOrdDetails.setData(oData.results[0]);
                        that.getView().setModel(oreProdOrdDetails, "reProdOrdDetails");

                    },
                    error: function (oResp) {
                        MessageToast.show(JSON.parse(oResp.responseText).error.message.value);
                    }
                });
            },
            onAmountCalculate: function (oEvent) {
                var sPath = oEvent.getSource().getParent().getBindingContext("initData").sPath.replace("/", "");
                var val = oEvent.getParameter("value");
                var BalReworkOQ = this.getView().byId("_IDGenInput21").getValue();
                var oMData = this.getView().getModel("initData").getData();
                if (BalReworkOQ !== "") {
                    if (sPath === "0") {
                        oMData[sPath].balQty = BalReworkOQ - val;
                    } else {
                        oMData[sPath].totalR = val;
                        this.getView().getModel("initData").refresh();
                        var newVal = 0;
                        for (var v = 0; v < oMData.length; v++) {
                            if (oMData[v].totalR !== "") {
                                newVal += parseInt(oMData[v].totalR);
                            }
                        }
                        oMData[sPath].balQty = BalReworkOQ - newVal;
                    }
                }
                this.getView().getModel("initData").refresh();
            },
            onRefresh: function () {
                this.getView().byId("id_material").setValue("");
                this.getView().byId("id_supervisor").setValue("");
                if (this.getView().getModel("AfterMatDetails") !== undefined) {
                    this.getView().getModel("AfterMatDetails").setData("");
                }
                this.getView().byId("id_pllant21").setValue("");
                this.getView().byId("id_supervisor").setDescription("");
                if (this.getView().getModel("reProdOrdDetails") !== undefined) {
                    this.getView().getModel("reProdOrdDetails").setData("");
                }
                this.Arr = [];
                var obj = {
                    "RforR": "",
                    "totalR": "",
                    "balQty": "",
                    "confQty": "",
                    "workCenter": "",
                    "wcDesc": "",
                    "teamNo": ""
                };
                this.Arr.push(obj);
                if (this.getView().getModel("initData") !== undefined) {
                    this.getView().getModel("initData").setData(this.Arr);
                    this.getView().getModel("initData").refresh();
                }
            }
        });
    });
