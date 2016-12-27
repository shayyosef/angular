"use strict";
/// <reference path="../../node_modules/@types/xrm/index.d.ts" />

var Malam;
(function (Malam) {
    var Weizman;
    (function (Weizman) {
        var WireTransmission = (function () {
            function WireTransmission() {

            }

            //--WireTransmission.onload function
            WireTransmission.onLoad = function () {
                //debugger;
                //var pageId = Xrm.Page.data.entity.getId().replace("{", "").replace("}", "");

                WireTransmission.checkSumDollar();
            };
            //==WireTransmission.onload function
            

            WireTransmission.checkSumDollar = function () {

                //debugger;

                var sumdollar                   = Xrm.Page.getAttribute("new_sumdollar").getValue();
                var relatedpaymentssumdollar    = Xrm.Page.getAttribute("new_relatedpaymentssumdollar").getValue();

                if (!sumdollar) { sumdollar = 0; }

                if(sumdollar != relatedpaymentssumdollar)
                {
                    Xrm.Page.ui.setFormNotification("Total Receipt Sum as updated from Tafnit , Does not equal Payments Sum in Wire Transmission!", "WARNING");
                }
            }

            return WireTransmission;
        }());
        Weizman.WireTransmission = WireTransmission;
    })(Weizman = Malam.Weizman || (Malam.Weizman = {}));
})(Malam || (Malam = {}));




