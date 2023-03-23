/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(function () {
	"use strict";

	var Constants = {
		functionImportNames: {
			createSummaryReport: "/C_SummaryReportRootTPCreate_smr_rpt",
			generateSummaryReport: "/C_SummaryReportReportTPGenerate_report",
			getFile: "/C_SummaryReportRootTPGetFile",
			checkSummaryReportStatus: "/C_SummaryReportRootTPCheckStatus"
		},
		responseMessageSeverities: {
			Error: "error",
			Warning: "warning"
		},
		summaryReportStatus: {
			New: "01",
			GenerationScheduled: "02",
			GenerationFinished: "04"
		},
		subLocationFilter: "LocHasChildLocationsSelected"
	};

	return Object.freeze(Constants);
});