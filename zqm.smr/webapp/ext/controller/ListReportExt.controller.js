/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/m/MultiInput",
], function (Controller, Filter, MultiInput) {
	"use strict";

	var oListReportExtController = {

		

		onInit: function () {
			this._oView = this.getView();
		},

		_getSelectFormDialog: function () {
			if (this._oSelectFormDialog === undefined) {
				// instantiate the fragment with the dialog if not already done
				this._oSelectFormDialog = sap.ui.xmlfragment("zqm.smr.webapp.ext.fragment.CreateSummaryReportDialog", this);
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

				onBeforeRebindTableExtension: function (oEvent) {

			// Filtering the results based on the entered dates
			var oBindingParams = oEvent.getParameter("bindingParams");
			oBindingParams.parameters = oBindingParams.parameters || {};
		}
	};

	sap.ui.controller("zqm.smr.ext.controller.ListReportExt", oListReportExtController);
	return Controller.extend("zqm.smr.ext.controller.ListReportExt", oListReportExtController);
});