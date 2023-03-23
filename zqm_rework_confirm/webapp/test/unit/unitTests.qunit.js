/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comsaprcp/zqm_rework_confirm/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
