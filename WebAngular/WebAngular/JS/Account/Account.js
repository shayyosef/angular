"use strict";
/// <reference path="../../node_modules/@types/xrm/index.d.ts" />

var Malam;
(function (Malam) {
    var Weizman;
    (function (Weizman) {
        var Account = (function () {
            function Account() {
                
            }

            //--Account.onload function
            Account.onLoad = function () {
                //debugger;
                var pageId = Xrm.Page.data.entity.getId().replace("{", "").replace("}", "");
                
                Account.enmType =
                {
                    "Prospect":     100000001,
                    "Dignitary":    100000002,
                    "Contact":      100000003
                }


                Account.getAccountPhone(pageId);
                Account.showTabs();
                Account.checkHirarchy(pageId);
                Account.watcherParentId(pageId);
            };
            //==Account.onload function



            
            //--watcherParentId
            //debugger;
            Account.watcherParentId = function (pageId) {
                //debugger;
                var parentIdFunc = function (pageId) {
                    Account.checkHirarchy(pageId);
                }

                Xrm.Page.data.entity.attributes.get("parentaccountid").addOnChange(parentIdFunc(pageId));
            }
            //==watcherParentId


            //--check if record is connect to current record
            Account.checkHirarchy = function (pageId)
            {
                //debugger;
                var columnSet = "?$select=accountid,_parentaccountid_value&$filter=accountid eq  " + pageId + "  and  _parentaccountid_value ne null or _parentaccountid_value eq  " + pageId + " ";
                Malam.CrmWebAPI.retrieveMultiple("accounts", columnSet, function (data) {

                    var isFound = false;
                    if (data.value[0]) {
                        isFound = true;
                    }
                            
                    Xrm.Page.getControl("new_parentpledges").setVisible(isFound);
                    Xrm.Page.getControl("new_parenttotalamountpaid").setVisible(isFound);
                    Xrm.Page.getControl("new_familybalanceunpaid").setVisible(isFound);
                                                
                    Xrm.Page.getControl("new_totalplannedpayments").setVisible(!isFound);
                    Xrm.Page.getControl("new_total").setVisible(!isFound);
                    Xrm.Page.getControl("new_unpaidbalance").setVisible(!isFound);
                    Xrm.Page.getControl("new_totalgiving").setVisible(!isFound);
                    
                }, function (e) { debugger; }, true);
            }

            
            
            //==check if record is connect to current record

            //-- replace phone number to phone new
            Account.getAccountPhone = function (pageId) {
                var columnSet = "?$select=_new_donorid_value,new_name,new_phone,new_priority&$filter=_new_donorid_value eq " + pageId + " and  new_priority eq '1' ";
                Malam.CrmWebAPI.retrieveMultiple("new_telephoneses", columnSet, function (data) {

                    if (data.value[0]) {

                        var newPhone = data.value[0].new_phone;
                        var nameValue = Xrm.Page.getAttribute("address1_name").getValue();
                        Xrm.Page.getAttribute("address1_name").setValue(newPhone);
                        Xrm.Page.data.entity.attributes.get("address1_name").setSubmitMode("never");
                    }
                }, function (e) { debugger; }, true);
            }
            //-- replace phone number to phone new



            //-- hide tabs, depands on "new_type" value
            Account.showTabs = function() {
                //debugger;
                var newType = Xrm.Page.getAttribute("new_type").getValue(); //Xrm.Page.data.entity.getValue("new_type");

                if (newType) {
                    switch (newType * 1) {

                        case Account.enmType.Prospect: 
                            Xrm.Page.ui.tabs.get("tab_9").setVisible(false);
                            Xrm.Page.ui.tabs.get("tab_14").setVisible(false);

                            Xrm.Page.ui.tabs.get("tab_6").setVisible(true);
                            Xrm.Page.ui.tabs.get("tab_7").setVisible(true);
                            Xrm.Page.ui.tabs.get("tab_17").setVisible(true);
                            break;

                        case Account.enmType.Dignitary: 
                            Xrm.Page.ui.tabs.get("tab_7").setVisible(false);
                            Xrm.Page.ui.tabs.get("tab_9").setVisible(false);
                            Xrm.Page.ui.tabs.get("tab_14").setVisible(false);
                            Xrm.Page.ui.tabs.get("tab_17").setVisible(false);

                            Xrm.Page.ui.tabs.get("tab_6").setVisible(true);
                            break;

                        case Account.enmType.Contact: 
                            Xrm.Page.ui.tabs.get("tab_6").setVisible(false);
                            Xrm.Page.ui.tabs.get("tab_7").setVisible(false);
                            Xrm.Page.ui.tabs.get("tab_9").setVisible(false);
                            Xrm.Page.ui.tabs.get("tab_14").setVisible(false);
                            Xrm.Page.ui.tabs.get("tab_17").setVisible(false);
                            break;

                        default:
                    }
                }


                //--  if TEAM = "CONFIDENTIAL  INFO ROLE", show tab_8
                //debugger;
                var sEntity = 'teams?';
                var sXml = '';
                sXml += '<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="true">';
                sXml += '<entity name="team">';
                sXml += '<filter type="and">';
                sXml += '<condition attribute="name" operator="eq" value="CONFIDENTIAL  INFO ROLE" />';
                sXml += '</filter>';
                sXml += '<link-entity name="teammembership" from="teamid" to="teamid" visible="false" intersect="true">';
                sXml += '<link-entity name="systemuser" from="systemuserid" to="systemuserid" alias="ad" >';
                sXml += '<attribute name="systemuserid" />';
                sXml += '<attribute name="domainname" />';
                sXml += '<attribute name="fullname" />';
                sXml += '</link-entity>';
                sXml += '</link-entity>';
                sXml += '</entity>';
                sXml += '</fetch>';

                Malam.CrmWebAPI.fetchXml(sEntity, sXml, function (data) {

                    if (data.value[0]) {

                        //debugger;
                        for (var i = 1; i < data.value.length; i++) {
                            if (data.value[i].ad_x002e_systemuserid.toLowerCase() == Xrm.Page.context.getUserId().toLowerCase().replace("{", "").replace("}", "")) {
                                Xrm.Page.ui.tabs.get("tab_9").setVisible(true);
                            }
                        }

                    }
                }, function (e) { debugger; }, true);
                //==if TEAM = "CONFIDENTIAL  INFO ROLE", show tab_8

            }
            //==hide tabs, depands on "new_type" value

            return Account;
        }());
        Weizman.Account = Account;
    })(Weizman = Malam.Weizman || (Malam.Weizman = {}));
})(Malam || (Malam = {}));




