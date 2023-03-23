/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comsapri/zqm_rdm_insp/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
