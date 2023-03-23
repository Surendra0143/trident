/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"rdminsp/zqm_rdm_insp1/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
