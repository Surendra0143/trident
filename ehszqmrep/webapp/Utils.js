/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"./Constants",
	"sap/ui/core/util/File"
], function(Constants, File) {
	"use strict";

	var Utils = {
		File: File,

		onFileNameClick: function (extensionAPI, oBindingContext) {
			
			return extensionAPI.securedExecution(function () {
				return new Promise(function (fnResolve, fnReject) {
					   extensionAPI.invokeActions(Constants.functionImportNames.getFile, oBindingContext) // the action's parameters will be filled by the Binding context values
						.then(function (aResponses) {
								var fileContentArrBuff = this._toArrayBuffer(atob(aResponses[0].response.data.Content)),
									sFileName = aResponses[0].response.data.FileName,
									sMIMECode = aResponses[0].response.data.MimeCode,
									aFileNameParts = sFileName.split("."),
									sFileNameNoExt = aFileNameParts[0],
									sFileExtension = aFileNameParts[1];

								this.File.save(fileContentArrBuff, sFileNameNoExt, sFileExtension, sMIMECode);
								fnResolve();

							}.bind(this),
							function (aErrors) {
								fnReject();
							});
				}.bind(this));
			}.bind(this));
		},

		_toArrayBuffer: function (sContent) {
			var inputLength = sContent.length;
			var arrayBuffer = new ArrayBuffer(inputLength);
			var uint8Array = new Uint8Array(arrayBuffer);

			for (var i = 0; i <= inputLength; i++) {
				uint8Array[i] = sContent.charCodeAt(i) & 0xFF;
			}

			return arrayBuffer;
		},
		
		getMessageType: function (sSeverity) {
			switch (sSeverity) {

			case Constants.responseMessageSeverities.Error:
				return sap.ui.core.MessageType.Error;

			case Constants.responseMessageSeverities.Warning:
				return sap.ui.core.MessageType.Warning;

			default:
				return null;
			}
		},
		
		getText: function (sTextKey, oView, sParam) {
			if (this._oResourceBundle === undefined) {
				this._oResourceBundle = oView.getModel("i18n").getResourceBundle();
			}

			var sText = this._oResourceBundle.getText(sTextKey, sParam);
			return sText;
		}
	};

	return Utils;
  
}, /* bExport= */ true);