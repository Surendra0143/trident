/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comsaprdminspect/zqm_rdm_inspect/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
