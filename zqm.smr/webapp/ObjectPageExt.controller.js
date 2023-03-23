/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "zqm/smr/Constants",
    "zqm/smr/Utils",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/Input",
    "ehs/fnd/task/reuselib/Util",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text"
], function (Controller, Constants, Utils, MessageToast, MessageBox, Input, TaskUtil, Dialog, Button, Text) {
    "use strict";

    var oObjectPageExtClass = {
        Utils: Utils,
        MessageToast: MessageToast,
        MessageBox: MessageBox,
        TaskUtil: TaskUtil,

        onInit: function () {
            this._oView = this.getView();

            if (!sap.ui.Device.system.phone) {
                var sLocationUUIDFieldId =
                    "zqm.smr::sap.suite.ui.generic.template.ObjectPage.view.Details::C_SummaryReportRootTP--ReportCriteriaFieldsReportNode::EHSLocationUUID::Field";

                var oLocationSmartField = this._oView.byId(sLocationUUIDFieldId);
                oLocationSmartField.attachInnerControlsCreated(null, this.locationInputCreated, this);
            }
        },

        onGeneratePress: function (oEvent) {
            var oBindingContext = this.getView().getBindingContext();
            var oSummaryReport = oBindingContext.getObject();

            if (oSummaryReport.SummaryReportRootStatus === Constants.summaryReportStatus.GenerationFinished) {
                this._oDialog = this._getDialog("confirmRegenerateDialogTitle", "confirmRegenerateDialogText", sap.ui.core.ValueState.Warning, sap.m
                    .DialogType.Message);

                var oBeginButton = new Button({
                    type: sap.m.ButtonType.Emphasized,
                    text: this.Utils.getText("generateReport", this._oView),
                    press: function () {
                        this._oDialog.close();
                        this._callGenerateSummaryReportFunctionImport(oBindingContext);
                    }.bind(this)
                });

                this._oDialog.setBeginButton(oBeginButton);

                var oEndButton = new Button({
                    text: this.Utils.getText("cancelBtn", this._oView),
                    press: function () {
                        this._oDialog.close();
                    }.bind(this)
                });

                this._oDialog.setEndButton(oEndButton);
                this._oDialog.open();

            } else if (oSummaryReport.SummaryReportRootStatus === Constants.summaryReportStatus.GenerationScheduled) {
                this._oDialog = this._getDialog("generationSchedAlreadyDialogTitle", "generationSchedAlreadyDialogText", sap.ui.core.ValueState.Error,
                    sap.m.DialogType.Message);

                oEndButton = new Button({
                    type: sap.m.ButtonType.Emphasized,
                    text: this.Utils.getText("okBtn", this._oView),
                    press: function () {
                        this._oDialog.close();
                    }.bind(this)
                });

                this._oDialog.setEndButton(oEndButton);
                this._oDialog.open();

            } else {
                this._callGenerateSummaryReportFunctionImport(oBindingContext);
            }
        },

        _getDialog: function (titleTextKey, contentTextKey, state, type) {
            var oDialog = new Dialog({
                title: this.Utils.getText(titleTextKey, this._oView),
                type: type,
                state: state,
                content: new Text({
                    text: this.Utils.getText(contentTextKey, this._oView)
                }),
                afterClose: function () {
                    oDialog.destroy();
                }
            });

            return oDialog;
        },

        _callGenerateSummaryReportFunctionImport: function (oBindingContext) {
            var oDateFromField = this.byId(
                "zqm.smr::sap.suite.ui.generic.template.ObjectPage.view.Details::C_SummaryReportRootTP--ReportCriteriaFieldsReportNode::EHSReportFromDate::Field"
            );
            var bEditActionControl = oDateFromField.getBindingContext().getObject("Generate_report_ac");

            // if user does not have rights for edit -> show error message and do not generate the report
            // there is also check in the backend
            if (this._hasEditRights(bEditActionControl)) {
                var sMsg = this.Utils.getText("generateReportStarted", this._oView);
                this.MessageToast.show(sMsg, {
                    duration: 5000
                });

                var oModel = this._oView.getModel();

                this.extensionAPI.securedExecution(function () {
                    return new Promise(function (fnResolve, fnReject) {
                        var sSummaryReportReportUUID = oBindingContext.getObject("SummaryReportReportUUID");
                        oModel.callFunction(Constants.functionImportNames.generateSummaryReport, {
                            method: "POST",
                            urlParameters: {
                                SummaryReportReportUUID: sSummaryReportReportUUID,
                                IsActiveEntity: true
                            },
                            success: function (oGenSmrRptData, oGenSmrRptResponse) {
                                oModel.refresh();
                                fnResolve(oGenSmrRptData, oGenSmrRptResponse);
                            },
                            error: function (oGenSmrRptErrorResponse) {
                                fnReject(oGenSmrRptErrorResponse);
                            }
                        });
                    });
                }, {
                    busy: {
                        set: false,
                        check: false
                    }
                })
                    .then(function (oGenSmrRptData, oGenSmrRptResponse) {
                        return new Promise(function (fnResolve, fnReject) {
                            var sSummaryReportRootUUID = oBindingContext.getObject("SummaryReportRootUUID");

                            oModel.callFunction(Constants.functionImportNames.checkSummaryReportStatus, {
                                method: "GET",
                                urlParameters: {
                                    SummaryReportRootUUID: sSummaryReportRootUUID
                                },
                                success: function (oCheckSmrRptStatusData, oCheckSmrRptStatusResponse) {
                                    oModel.refresh();
                                    fnResolve(oCheckSmrRptStatusData, oCheckSmrRptStatusResponse);
                                },
                                error: function (oCheckStatusResponseError) {
                                    fnReject(oCheckStatusResponseError);
                                }
                            });
                        });
                    })
                    .catch(function (oResponseError) {
                        this.extensionAPI.securedExecution(function () {

                            var aMessages = JSON.parse(oResponseError.responseText).error.innererror.errordetails;
                            var oMessageManager = sap.ui.getCore().getMessageManager();

                            // Fill the messages in the message manager
                            aMessages.forEach(function (oMsg) {
                                var oMessage = new sap.ui.core.message.Message({
                                    message: oMsg.message,
                                    persistent: true, // make message transient because only transient messages can be showed on the List Report
                                    type: Utils.getMessageType(oMsg.severity)
                                });

                                oMessageManager.addMessages(oMessage);
                            });
                        });
                    }.bind(this));
            }
        },

        _hasEditRights: function (bEditActionControl) {
            if (bEditActionControl === false) {
                this.MessageBox.error(
                    this.Utils.getText("notAuthorized", this._oView), {
                    actions: [sap.m.MessageBox.Action.OK]
                });
            }
            return bEditActionControl;
        },

        onFileNameClick: function (oEvent) {
            var oBindingContext = oEvent.getSource().getBindingContext();
            this.Utils.onFileNameClick(this.extensionAPI, oBindingContext);
        },

        locationInputCreated: function (oEvent) {
            var aParameters = oEvent.getParameters();

            for (var i = 0; i < aParameters.length; i++) {
                if (aParameters[i] instanceof Input) {
                    var aValueHelpRequestFunctions = aParameters[i]["mEventRegistry"]["valueHelpRequest"];

                    aParameters[i].detachValueHelpRequest(aValueHelpRequestFunctions[0]["fFunction"]);

                    aParameters[i].attachValueHelpRequest(null, this.onLocationValueHelpRequest, this);

                    break;
                }
            }
        },

        updateLocationInputValue: function (sNewKey) {
            var oLocationInput = this._oView.byId(
                "zqm.smr::sap.suite.ui.generic.template.ObjectPage.view.Details::C_SummaryReportRootTP--ReportCriteriaFieldsReportNode::EHSLocationUUID::Field-input"
            );
            oLocationInput.setValue(sNewKey);
            oLocationInput.fireChange({
                value: sNewKey,
                validated: true
            });
            oLocationInput.setBusy(false);
        },

        // On press location hierarchy F4 help
        onLocationValueHelpRequest: function () {
            var sPath = this._oView.getBindingContext().getPath() + "/to_SummaryReportReportTP";
            this.TaskUtil.openLocationValueHelpDialogSingleSelect(this.oView, true, sPath);
        },

        // Destroy location hierarchy F4 help as an object in order to support navigation between different Apps
        // The value help view is not automatically destroyed on exit of the app. We destroy it so we don't get duplicate ids when we navigate back to the app.
        onExit: function () {
            	var oLocationValueHelpView = this.TaskUtil._oLocationValueHelpView;
            	var oLocationValueHelpViewSingleSelect = this.TaskUtil._oLocationValueHelpViewSingleSelect;

            	if (oLocationValueHelpView) {
            		oLocationValueHelpView.destroy(true);
            		this.TaskUtil._oLocationValueHelpView = undefined;
            	}

            	if (oLocationValueHelpViewSingleSelect) {
            		oLocationValueHelpViewSingleSelect.destroy(true);
            		this.TaskUtil._oLocationValueHelpViewSingleSelect = undefined;
            	}
        }
    };

    sap.ui.controller("zqm.smr.ObjectPageExt", oObjectPageExtClass);
    return Controller.extend("zqm.smr.ObjectPageExt", oObjectPageExtClass);
});