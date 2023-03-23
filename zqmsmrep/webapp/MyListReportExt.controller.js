sap.ui.define([], function() {
    return {
        onCreateSummaryReportPress: function (oEvent) {
            this._getSelectFormDialog().open();
        },
        //  _getSelectFormDialog: function () {
		// 	if (this._oSelectFormDialog === undefined) {
		// 		// instantiate the fragment with the dialog if not already done
		// 		this._oSelectFormDialog = sap.ui.xmlfragment("ehs.inc.smr_rpt.generates1.ext.fragment.CreateSummaryReportDialog", this);
		// 		this.getView().addDependent(this._oSelectFormDialog);
		// 	}

		// 	return this._oSelectFormDialog;
		// }    
    }
  })