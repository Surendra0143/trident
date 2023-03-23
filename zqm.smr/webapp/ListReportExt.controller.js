/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/m/MultiInput",
	"zqm/smr/Constants",
	"zqm/smr/Utils",
	"ehs/fnd/task/reuselib/Util", // the Location hierarchical value help control is in the Task Def library
	"sap/ui/core/LocaleData",
	"sap/ui/core/format/DateFormat"
], function (Controller, Filter, MultiInput, Constants, Utils, TaskUtil, LocaleData, DateFormat) {
	"use strict";

	var oListReportExtController = {

		Utils: Utils,
		TaskUtil: TaskUtil,

		onInit: function () {
			this._oView = this.getView();
			this._oLocale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();
			this._oLocaleData = LocaleData.getInstance(this._oLocale);
			this._sLocalDateFormat = this._oLocaleData.getDatePattern("medium");
			this._oDateFormat = DateFormat.getDateInstance({ pattern: this._sLocalDateFormat });
		},

		_getSelectFormDialog: function () {
			if (this._oSelectFormDialog === undefined) {
				// instantiate the fragment with the dialog if not already done
				this._oSelectFormDialog = sap.ui.xmlfragment("zqm.smr.CreateSummaryReportDialog", this);
				this.getView().addDependent(this._oSelectFormDialog);
			}

			return this._oSelectFormDialog;
		},

		// Handler for pressing the Create summary report button in the List report main page
		onCreateSummaryReportPress: function (oEvent) {
			this._getSelectFormDialog().open();
		},

		// Handler for pressing the Cancel button in the Select form dialog
		onPressCancelSelectFormDialog: function (oEvent) {
			this._getSelectFormDialog().close();
		},

		// Handler when a form type from the Select Form dialog is clicked
		onSelectFormDialog: function (oEvent) {
			var oBindingContext = oEvent.getParameter("listItem").getBindingContext();
			var sFormName = oBindingContext.getProperty("EHSFormName");

			this._getSelectFormDialog().close();
			this._getSelectFormDialog().destroy();
			this._oSelectFormDialog = undefined;

			// Call the function import/BO action for creating new instance of the Summary report
			this._callCreateSummaryReportFunctionImport(sFormName, oBindingContext)
				.then(
					function (oCreatedSumRepRoot) {
						var sSumRepRootKey = oCreatedSumRepRoot.SummaryReportRootUUID;

						// Navigate to the created instance
						this._navigateToObjectPage(sSumRepRootKey);
					}.bind(this));
		},

		// Executing the function import/BO action which creates Summary Report ROOT and REPORT instances
		_callCreateSummaryReportFunctionImport: function (sFormName, oBindingContext) {

			return this.extensionAPI.securedExecution(function () {
				return new Promise(function (fnResolve, fnReject) {
					// Invoking the BO action. The API method returns a promise so we need to handle it.
					this.extensionAPI.invokeActions(Constants.functionImportNames.createSummaryReport, oBindingContext)
						.then(
							function (aResponses) {
								var aMessages = aResponses[0].response.context.getMessages();
								if (aMessages.length === 0) {
									var oSummaryReportRoot = aResponses[0].response.data;

									// Successful execution of the action so we need to resolve the promise and send the created Summary report root object to the caller
									fnResolve(oSummaryReportRoot);
								} else {
									// In case there are any messages raised we need to reject the promise. They will be displayed by the MessageManager.
									fnReject();
								}
							},
							function (aErrors) {
								// The flag for failed static action is TRUE or an internal error was raised. 
								// The messages raised by the action will be picked by the MessageManager and will be displayed.
								fnReject();
							}
						);
				}.bind(this));
			}.bind(this));
		},

		// Navigate to summary report object page with a given root UUID
		_navigateToObjectPage: function (sSumRepRootKey) {
			var oNavigationController = this.extensionAPI.getNavigationController(),
				sSmrRepRootPath = "/C_SummaryReportRootTP(SummaryReportRootUUID=guid'" + sSumRepRootKey + "',IsActiveEntity=false)",
				oBindingContext = new sap.ui.model.Context(this.getView().getModel(), sSmrRepRootPath);

			oNavigationController.navigateInternal(oBindingContext);
		},

		onReportingPeriodSelection: function (oEvent) {
			var bValid = oEvent.getParameter("valid");
			var oEventSource = oEvent.getSource();

			if (bValid) {
				oEventSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEventSource.setValueState(sap.ui.core.ValueState.Error);
				var sFormattedCurrentDate = this._oDateFormat.format(new Date());
				oEventSource.setValueStateText(this.Utils.getText("invalidDate", this._oView, sFormattedCurrentDate));
			}
		},

		onBeforeRebindTableExtension: function (oEvent) {

			// Filtering the results based on the entered dates
			var oBindingParams = oEvent.getParameter("bindingParams");
			oBindingParams.parameters = oBindingParams.parameters || {};

			var oDateRangeSelection = this.getView().byId("dateRangeSelection");
			var oStartDate = oDateRangeSelection.getDateValue(); // Start date entered by the user
			var oEndDate = oDateRangeSelection.getSecondDateValue(); // End date entered by the user

			if (oStartDate !== null && oEndDate !== null) {

				// Converting the input dates to local date with time
				var oLocalStartDate = this._getLocalDate(oStartDate);
				var oLocalEndDate = this._getLocalDate(oEndDate);

				// If the entered period is 05.03 - 20.03 the filter will return all entries with end date on or after 05.03
				var oBeforeRangeEndDateFilter = new Filter("EHSReportToDate", "GE", oLocalStartDate);

				// If the entered period is 05.03 - 20.03 the filter will return all entries with start date before or on 20.03
				var oAfterRangeStartDateFilter = new Filter("EHSReportFromDate", "LE", oLocalEndDate);

				oBindingParams.filters.push(oBeforeRangeEndDateFilter, oAfterRangeStartDateFilter);
			}
		},

		_getLocalDate: function (oDate) {
			if (oDate instanceof Date) {
				return new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
			} else {
				return null;
			}
		},

		onFileNameClick: function (oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext();
			this.Utils.onFileNameClick(this.extensionAPI, oBindingContext);
		},

		onInitSmartFilterBarExtension: function (oEvent) {
			// Change attached function to the ValueHelpRequest event based on the user device type
			if (!sap.ui.Device.system.phone) {
				var oSmartFilterBar = oEvent.getSource();
				var oLocationMultiInput = oSmartFilterBar.getControlByKey("EHSLocationUUID");
				var aValueHelpRequestFunctions = oLocationMultiInput["mEventRegistry"]["valueHelpRequest"];

				oLocationMultiInput.detachValueHelpRequest(aValueHelpRequestFunctions[1]["fFunction"]);

				oLocationMultiInput.attachValueHelpRequest(function () {
					this.onLocationValueHelpRequest(oLocationMultiInput);
				}.bind(this));
			}

			var oFilterData = {};
			oFilterData[Constants.subLocationFilter] = "true";

			oSmartFilterBar.setFilterData(oFilterData);

		},

		// On press location hierarchy F4 help
		onLocationValueHelpRequest: function (oLocationControl) {
			var aLocationTokens;

			if (oLocationControl instanceof MultiInput) {
				aLocationTokens = oLocationControl.getTokens();

				this.TaskUtil.openLocationValueHelpDialog(this.oView, aLocationTokens, false);
			}
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

	sap.ui.controller("zqm.smr.ListReportExt", oListReportExtController);
	return Controller.extend("zqm.smr.ListReportExt", oListReportExtController);
});