/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comsapfirstpiece/zqm_first_piece/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
