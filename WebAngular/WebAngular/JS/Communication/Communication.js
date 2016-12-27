"use strict";
/// <reference path="../../node_modules/@types/xrm/index.d.ts" />

var Malam;
(function (Malam) {
    var Weizman;
    (function (Weizman) {
        var Communication = (function () {

            function Communication() {
            }

            //--Communication.onload function
            Communication.onLoad = function () {
                //debugger;

                Communication.enmType =
                {
                    "Letter": 100000010,
                    "Biography": 100000009,
                    "Report": 100000008,
                    "BoardMeeting": 100000007,
                    "Visit": 100000006,
                    "PROPOSAL": 100000005,
                    "MAGAZINE": 1,
                    "NEWSLETTER": 2,
                    "BOOKLET": 3,
                    "BROCHURE": 100000000,
                    "LEAVEBEHiND": 100000001,
                    "BANNERSTORIES": 100000002,
                    "WEBSITE": 100000003,
                    "OTHER": 100000004
                }

                var pageId = Xrm.Page.data.entity.getId().replace("{", "").replace("}", "");

                Communication.showTabs();
            };
            //==Communication.onload function
            
            
            ////--watcherParentId
            ////debugger;
            //Communication.watcherParentId = function (pageId) {
            //    //debugger;
            //    var parentIdFunc = function (pageId) {
            //        Communication.checkHirarchy(pageId);
            //    }

            //    Xrm.Page.data.entity.attributes.get("parentCommunicationid").addOnChange(parentIdFunc(pageId));
            //}
            ////==watcherParentId
            

            //-- hide tabs, depands on "new_type" value
            Communication.showTabs = function () {
                //debugger;
                                
                var newType = Xrm.Page.getAttribute("casetypecode").getValue(); //Xrm.Page.data.entity.getValue("new_type");
                
                if (newType) {
                    switch (newType * 1) {

                        case Communication.enmType.Letter:
                        case Communication.enmType.Biography:
                        case Communication.enmType.Report:
                        case Communication.enmType.MAGAZINE:
                        case Communication.enmType.NEWSLETTER:
                        case Communication.enmType.BOOKLET:
                        case Communication.enmType.BROCHURE:
                        case Communication.enmType.LEAVEBEHiND:
                        case Communication.enmType.BANNERSTORIES:
                        case Communication.enmType.WEBSITE:
                        case Communication.enmType.OTHER:
                            Xrm.Page.ui.tabs.get("tab_10").setVisible(false); 
                            Xrm.Page.ui.tabs.get("tab_13").setVisible(false); 
                            Xrm.Page.ui.tabs.get("tab_14").setVisible(false); 
                            Xrm.Page.ui.tabs.get("tab_15").setVisible(false); 
                            break;

                        case Communication.enmType.BoardMeeting:
                            Xrm.Page.ui.tabs.get("tab_10").setVisible(true);
                            Xrm.Page.ui.tabs.get("tab_13").setVisible(false); 
                            Xrm.Page.ui.tabs.get("tab_14").setVisible(true); 
                            Xrm.Page.ui.tabs.get("tab_15").setVisible(false); 
                            break;

                        case Communication.enmType.Visit:
                            Xrm.Page.ui.tabs.get("tab_10").setVisible(false); 
                            Xrm.Page.ui.tabs.get("tab_13").setVisible(true); 
                            Xrm.Page.ui.tabs.get("tab_14").setVisible(false); 
                            Xrm.Page.ui.tabs.get("tab_15").setVisible(true); 
                            break;

                        case Communication.enmType.PROPOSAL:
                            Xrm.Page.ui.tabs.get("tab_10").setVisible(true);
                            Xrm.Page.ui.tabs.get("tab_13").setVisible(false); 
                            Xrm.Page.ui.tabs.get("tab_14").setVisible(false); 
                            Xrm.Page.ui.tabs.get("tab_15").setVisible(false); 
                            break;

                        default:

                    }
                }
            }
            //==hide tabs, depands on "new_type" value


            return Communication;
        }());
        Weizman.Communication = Communication;
    })(Weizman = Malam.Weizman || (Malam.Weizman = {}));
})(Malam || (Malam = {}));




