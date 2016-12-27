"use strict";
/// <reference path="../../node_modules/@types/xrm/index.d.ts" />

var Malam;
(function (Malam) {
    var Weizman;
    (function (Weizman) {
        var Pledge = (function () {
            function Pledge() {

            }


            //--Pledge.onload function
            Pledge.onLoad = function () {
                //debugger;
                var pageId = Xrm.Page.data.entity.getId().replace("{", "").replace("}", "");

                Pledge.checkHirarchy(pageId);
                Pledge.showTabs();
                
            };
            //==Pledge.onload function
            


            Pledge.showTabs = function () {
                //debugger;

                var newSum = Xrm.Page.getAttribute("new_sum").getValue(); //Xrm.Page.data.entity.getValue("new_type");
                var newDate = Xrm.Page.getAttribute("new_date").getValue();
                var newNumberofpayments = Xrm.Page.getAttribute("new_numberofpayments").getValue();

                if (newSum && newDate && newNumberofpayments) {
                    if (newSum != "" && newDate != "" && newNumberofpayments != "") {
                        
                        Xrm.Page.getControl("new_sum").getParent().setVisible(false);

                        //Xrm.Page.getControl("tab_5_section_2").setVisible(false);
                        //Xrm.Page.ui.tabs.get("tab_5").sections.forEach(function (section, sectionIndex) {
                        //    if (section.getName() == "tab_5_section_2") {
                        //        section.setVisible(false);
                        //    }
                        //});

                    }
                }
            }


            Pledge.checkHirarchy = function (pageId) {

                //debugger;
                //https: / /weizmanndev.crm4.dynamics.com/api/data/v8.1/opportunities?$select=_new_parentpledge_value,new_pledgeid&$filter=new_pledgeid eq '75E581C6-DCAF-E611-80E5-C4346BAC7E3C' and _new_parentpledge_value ne null or _new_parentpledge_value eq 75E581C6-DCAF-E611-80E5-C4346BAC7E3C
                var columnSet = "?$select=_new_parentpledge_value,opportunityid&$filter=opportunityid eq " + pageId + " and  _new_parentpledge_value ne null or _new_parentpledge_value eq " + pageId;
                Malam.CrmWebAPI.retrieveMultiple("opportunities", columnSet, function (data) {

                    var isFound = false;
                    if (data.value[0]) {
                        isFound = true;
                    }
                                        
                    Xrm.Page.getControl("new_totalplannedpayments").setVisible(isFound);
                    Xrm.Page.getControl("new_totalactualpayments").setVisible(isFound);
                    Xrm.Page.getControl("new_totalunpaidbalance").setVisible(isFound);

                    
                    Xrm.Page.getControl("new_actualpayments").setVisible(!isFound);
                    Xrm.Page.getControl("new_plannedpayments").setVisible(!isFound);
                    Xrm.Page.getControl("new_unpaidbalance").setVisible(!isFound);

                    
                }, function (e) { debugger; }, true);
            }





            return Pledge;
        }());
        Weizman.Pledge = Pledge;
    })(Weizman = Malam.Weizman || (Malam.Weizman = {}));
})(Malam || (Malam = {}));




