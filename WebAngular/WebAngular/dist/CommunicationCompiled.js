"use strict";
var Malam = window.Malam || {};
Malam.CrmWebAPI = Malam.CrmWebAPI || {
    __namespace: true,
    baseUrl: ''
};
(function () {

    this.create = function (entitySetName, entity, successCallback, errorCallback, async) {
        /// <summary>Create a new entity</summary>
        /// <param name="entitySetName" type="String">The name of the entity set for the entity you want to create.</param>
        /// <param name="entity" type="Object">An object with the properties for the entity you want to create.</param>       
        /// <param name="successCallback" type="Delegate">a callback function that called on success.</param>       
        /// <param name="errorCallback" type="Delegate">a callback function that called on error.</param>       
        /// <param name="async" type="Boolian">a boolian object for the request if it is asynchronous or not. Default is true.</param>       
        if (!isString(entitySetName))
            throw new Error("Malam.CrmWebAPI.create entitySetName parameter must be a string.");

        if (isNullOrUndefined(entity))
            throw new Error("Malam.CrmWebAPI.create entity parameter must not be null or undefined.");

        if (entitySetName.slice(-1) != "s")
            entitySetName = entitySetName + "s";

        var successCheck = function (req) { return (req.status == 204); }

        return DoRequest("POST", encodeURI(getWebAPIPath() + entitySetName), entity, successCallback, errorCallback, successCheck, async);

    };
    //this.activateCustomAction = function (actionName, entitySetName, entityId, actionParams) {
    //    var result = null;
    //    debugger;
    //    //set OData end-point
    //    var ODataEndpoint = getContext().getClientUrl() + "/api/data/v8.0/";
    //    //define request
    //    var req = new XMLHttpRequest();
    //    var query = entitySetName + "(" + entityId + ")/Microsoft.Dynamics.CRM." + actionName;
    //    var req = new XMLHttpRequest();
    //    req.open("POST", ODataEndpoint + query, false);
    //    req.setRequestHeader("Accept", "application/json");
    //    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    //    req.setRequestHeader("OData-MaxVersion", "4.0");
    //    req.setRequestHeader("OData-Version", "4.0");
    //    req.onreadystatechange = function () {
    //        if (this.readyState == 4) {
    //            req.onreadystatechange = null;
    //            //handle success
    //            if (this.status == 200) {
    //                result = JSON.parse(this.response);
    //            }
    //                //handle failure
    //            else {
    //                var error = JSON.parse(this.response).error;
    //                alert(error.message);
    //            }
    //        }
    //    };
    //    if (actionParams != null)
    //        req.send(window.JSON.stringify(actionParams));
    //    else
    //        req.send();
    //    return result;
    //},
    this.retrieve = function (id, entitySetName, select, expand, successCallback, errorCallback, async, getFormattedValues) {
        /// <summary>Retrieve a record</summary>
        /// <param name="id" type="Guid">The guid of the entity you want to retrieve.</param>
        /// <param name="entitySetName" type="String">The type for the entity you want to retrieve.</param>       
        /// <param name="select" type="String">The select fields to retrieve.</param>       
        /// <param name="expand" type="String">The expand fields to retrieve.</param>       
        /// <param name="successCallback" type="Delegate">a callback function that called on success.</param>       
        /// <param name="errorCallback" type="Delegate">a callback function that called on error.</param>       
        /// <param name="async" type="Boolian">Optional, a boolian object for the request if it is asynchronous or not. Default is true.</param>       
        /// <param name="getFormattedValues" type="Boolian">Optional, Set to true if you want to retrieve formatted values.</param>       
        if (!isString(entitySetName))
            throw new Error("Malam.CrmWebAPI.retrieve entitySetName parameter must be a string.");

        if (!isString(id))
            throw new Error("Malam.CrmWebAPI.retrieve id parameter must be a string.");

        if (!isNull(select) && !isString(select))
            throw new Error("Malam.CrmWebAPI.retrieve select parameter must be a string.");

        if (!isNull(expand) && !isString(expand))
            throw new Error("Malam.CrmWebAPI.retrieve expand parameter must be a string.");

        if (entitySetName.slice(-1) != "s")
            entitySetName = entitySetName + "s";

        id = id.replace('{', '').replace('}', '');

        var systemQueryOptions = "";
        if (select != null || expand != null) {
            systemQueryOptions = "?";
            if (select != null) {
                var selectString = "$select=" + select;
                //if (expand != null) {
                //    selectString = selectString + "," + expand;
                //}
                systemQueryOptions = systemQueryOptions + selectString;
            }
            if (expand != null) {
                systemQueryOptions = systemQueryOptions + "&$expand=" + expand;
            }
        }

        var successCheck = function (req) { return (req.status == 200); }

        return DoRequest("GET", encodeURI(getWebAPIPath() + entitySetName + "(" + id + ")" + systemQueryOptions), null, successCallback, errorCallback, successCheck, async, getFormattedValues);
    },
    this.update = function (id, entity, entitySetName, successCallback, errorCallback, async) {
        /// <summary>Update a record</summary>
        /// <param name="id" type="Guid">The guid of the entity you want to update.</param>
        /// <param name="entity" type="Object">An object with the properties for the entity you want to create.</param>       
        /// <param name="entitySetName" type="String">The type for the entity you want to update.</param>       
        /// <param name="successCallback" type="Delegate">a callback function that called on success.</param>       
        /// <param name="errorCallback" type="Delegate">a callback function that called on error.</param>       
        /// <param name="async" type="Boolian">a boolian object for the request if it is asynchronous or not. Default is true.</param>       

        if (!isString(id))
            throw new Error("Malam.CrmWebAPI.update id parameter must be a string.");

        if (!isString(entitySetName))
            throw new Error("Malam.CrmWebAPI.update entitySetName parameter must be a string.");

        if (isNullOrUndefined(entity))
            throw new Error("Malam.CrmWebAPI.update entity parameter must not be null or undefined.");

        if (entitySetName.slice(-1) != "s")
            entitySetName = entitySetName + "s";

        id = id.replace('{', '').replace('}', '');

        var successCheck = function (req) { return (req.status == 204 || req.status == 1223); }

        return DoRequest("PATCH", encodeURI(getWebAPIPath() + entitySetName + "(" + id + ")"), entity,
            successCallback, errorCallback, successCheck, async);

        //var req = new XMLHttpRequest();
        //req.open("PATCH", encodeURI(this._WebAPIPath() + type + "(" + id + ")"), true);
        //req.setRequestHeader("Accept", "application/json");
        //req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        //req.setRequestHeader("OData-MaxVersion", "4.0");
        //req.setRequestHeader("OData-Version", "4.0");
        //req.onreadystatechange = function () {
        //    if (this.readyState == 4 /* complete */) {
        //        req.onreadystatechange = null;
        //        if (this.status == 204 || this.status == 1223) {
        //            successCallback();
        //        }
        //        else {
        //            errorCallback(this.CrmSdk.WEBAPI._errorHandler(this));
        //        }
        //    }
        //};
        //req.send(JSON.stringify(object));
    }

    this.delete = function (id, entitySetName, successCallback, errorCallback, async) {
        /// <summary>Delete a record</summary>
        /// <param name="id" type="Guid">The guid of the entity you want to update.</param>
        /// <param name="entity" type="Object">An object with the properties for the entity you want to create.</param>       
        /// <param name="entitySetName" type="String">The type for the entity you want to update.</param>       
        /// <param name="successCallback" type="Delegate">a callback function that called on success.</param>       
        /// <param name="errorCallback" type="Delegate">a callback function that called on error.</param>       
        /// <param name="async" type="Boolian">a boolian object for the request if it is asynchronous or not. Default is true.</param>       

        if (!isString(id))
            throw new Error("Malam.CrmWebAPI.delete id parameter must be a string.");

        if (!isString(entitySetName))
            throw new Error("Malam.CrmWebAPI.delete entitySetName parameter must be a string.");

        if (entitySetName.slice(-1) != "s")
            entitySetName = entitySetName + "s";

        id = id.replace('{', '').replace('}', '');

        var successCheck = function (req) { return (req.status == 204); }

        return DoRequest("DELETE", encodeURI(getWebAPIPath() + entitySetName + "(" + id + ")"), entity, successCallback, errorCallback, successCheck, async);

        //var req = new XMLHttpRequest();
        //req.open("DELETE", encodeURI(this._WebAPIPath() + type + "(" + id + ")", true));
        //req.setRequestHeader("Accept", "application/json");
        //req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        //req.setRequestHeader("OData-MaxVersion", "4.0");
        //req.setRequestHeader("OData-Version", "4.0");
        //req.onreadystatechange = function () {
        //    if (this.readyState == 4 /* complete */) {
        //        req.onreadystatechange = null;
        //        if (this.status == 204) {
        //            successCallback();
        //        }
        //        else {
        //            errorCallback(this.CrmSdk.WEBAPI._errorHandler(this));
        //        }
        //    }
        //};
        //req.send();
    },

    this.retrieveMultiple = function (entitySetName, options, successCallback, errorCallback, async) {
        /// <summary>Retrieve mutiple record</summary>
        /// <param name="entitySetName" type="String">The type for the entity you want to retrieve.</param>       
        /// <param name="options" type="String">The options you want to retrieve.</param>       
        /// <param name="successCallback" type="Delegate">a callback function that called on success.</param>       
        /// <param name="errorCallback" type="Delegate">a callback function that called on error.</param>       
        /// <param name="async" type="Boolian">a boolian object for the request if it is asynchronous or not. Default is true.</param>       

        if (!isString(entitySetName))
            throw new Error("Malam.CrmWebAPI.retrieveMultiple entitySetName parameter must be a string.");

        if (!isNull(options) && !isString(options))
            throw new Error("Malam.CrmWebAPI.retrieveMultiple options parameter must be a string.");

        if (entitySetName.slice(-1) != "s")
            entitySetName = entitySetName + "s";

        var optionsString;
        if (options != null) {
            if (options.charAt(0) != "?") {
                optionsString = "?" + options;
            }
            else {
                optionsString = options;
            }
        }

        var successCheck = function (req) { return (req.status == 200); }

        return DoRequest("GET", getWebAPIPath() + entitySetName + optionsString, null, successCallback, errorCallback, successCheck, async);
    }



    
    this.fetchXml = function (entity ,fetch, successCallback, errorCallback, async) {

        //debugger;

        /// <summary>Retrieve mutiple record</summary>
        /// <param name="entitySetName" type="String">The type for the entity you want to retrieve.</param>       
        /// <param name="options" type="String">The options you want to retrieve.</param>       
        /// <param name="successCallback" type="Delegate">a callback function that called on success.</param>       
        /// <param name="errorCallback" type="Delegate">a callback function that called on error.</param>       
        /// <param name="async" type="Boolian">a boolian object for the request if it is asynchronous or not. Default is true.</param>       
        fetch = encodeURI(fetch);
        if (!isString(fetch))
            throw new Error("Malam.CrmWebAPI.fetchXml fetch parameter must be a string.");

        var successCheck = function (req) { return (req.status == 200); }

        return DoRequest("GET", getWebAPIPath() + entity + "fetchXml="+fetch, null, successCallback, errorCallback, successCheck, async);
    }
    




    this.retrieveEntityMetadataId = function (schemaName, successCallback, errorCallback, async) {
        /// <summary>Retrieve Entity Metadata Id</summary>
        /// <param name="schemaName" type="String">The schema name of the entity you want to retrieve.</param>       
        /// <param name="successCallback" type="Delegate">a callback function that called on success.</param>       
        /// <param name="errorCallback" type="Delegate">a callback function that called on error.</param>       
        /// <param name="async" type="Boolian">a boolian object for the request if it is asynchronous or not. Default is true.</param>       

        if (!isString(schemaName))
            throw new Error("Malam.CrmWebAPI.retrieveEntityMetadataId schemaName parameter must be a string.");

        var options = "?$select=DisplayName&$filter=SchemaName eq '" + schemaName + "'";

        var entitySetName = 'EntityDefinitions';

        var successCheck = function (req) { return (req.status == 200); }

        return DoRequest("GET", getWebAPIPath() + entitySetName + options, null, successCallback, errorCallback, successCheck, async);
    }

    this.retrieveAttributeMetadata = function (entitySchemaName, attributeSelect, attributeFilter, successCallback, errorCallback, async) {
        /// <summary>Retrieve Attribute Metadata</summary>
        /// <param name="entitySchemaName" type="String">The schema name of the entity you want to retrieve.</param>       
        /// <param name="attributeSelect" type="String">The select query for the attributes you want to retrieve.</param>       
        /// <param name="attributeFilter" type="String">The filter query for the attributes you want to retrieve.</param>       
        /// <param name="successCallback" type="Delegate">a callback function that called on success.</param>       
        /// <param name="errorCallback" type="Delegate">a callback function that called on error.</param>       
        /// <param name="async" type="Boolian">a boolian object for the request if it is asynchronous or not. Default is true.</param>       

        if (!isString(entitySchemaName))
            throw new Error("Malam.CrmWebAPI.retrieveAttributeMetadata entitySchemaName parameter must be a string.");

        if (!isString(attributeSelect))
            throw new Error("Malam.CrmWebAPI.retrieveAttributeMetadata attributeSelect parameter must be a string.");

        if (!isString(attributeFilter))
            throw new Error("Malam.CrmWebAPI.retrieveAttributeMetadata attributeFilter parameter must be a string.");

        var options = '?$select=DisplayName&$filter=SchemaName eq ' + entitySchemaName +
            '&$expand=Attributes($select=' + attributeSelect + '$filter=' + attributeFilter;

        var entitySetName = 'EntityDefinitions';

        var successCheck = function (req) { return (req.status == 200); }

        return DoRequest("GET", getWebAPIPath() + entitySetName + options, null, successCallback, errorCallback, successCheck, async);
    }

    this.retrieveAttributeExtendedMetadata = function (entityMetadataId, attributeType, options, successCallback, errorCallback, async) {
        /// <summary>Retrieve Attribute Metadata</summary>
        /// <param name="entityMetadataId" type="String">The metadata guid of the entity you want to retrieve.</param>       
        /// <param name="attributeType" type="String">The specific type for the attribute you want to retrieve. 
        /// (Like Picklist, Money ... see https://msdn.microsoft.com/en-us/library/mt608106.aspx )</param>       
        /// <param name="options" type="String">The filter query for the attributes you want to retrieve.</param>       
        /// <param name="successCallback" type="Delegate">a callback function that called on success.</param>       
        /// <param name="errorCallback" type="Delegate">a callback function that called on error.</param>       
        /// <param name="async" type="Boolian">a boolian object for the request if it is asynchronous or not. Default is true.</param>       

        if (!isString(entityMetadataId))
            throw new Error("Malam.CrmWebAPI.retrieveAttributeExtendedMetadata entityMetadataId parameter must be a string.");

        if (!isString(attributeType))
            throw new Error("Malam.CrmWebAPI.retrieveAttributeExtendedMetadata attributeType parameter must be a string.");

        if (!isString(options))
            throw new Error("Malam.CrmWebAPI.retrieveAttributeExtendedMetadata options parameter must be a string.");

        var optionsString = '';
        if (options != null) {
            if (options.charAt(0) != "?") {
                optionsString = "?" + options;
            }
            else {
                optionsString = options;
            }
        }

        var entitySetName = 'EntityDefinitions';

        var successCheck = function (req) { return (req.status == 200); }

        return DoRequest("GET", getWebAPIPath() + entitySetName +'('+entityMetadataId+ 
            ')/Attributes/Microsoft.Dynamics.CRM.' + attributeType + 'AttributeMetadata' + optionsString, null, successCallback, errorCallback, successCheck, async);
    }

    this.ExecuteAction = function (entitySetName, entityId, actionName, actionInputParams, successCallback, errorCallback, async) {
        /// <summary>Retrieve mutiple record</summary>
        /// <param name="entitySetName" type="String">The type for the entity you want to retrieve.</param>       
        /// <param name="options" type="String">The options you want to retrieve.</param>       
        /// <param name="successCallback" type="Delegate">a callback function that called on success.</param>       
        /// <param name="errorCallback" type="Delegate">a callback function that called on error.</param>       
        /// <param name="async" type="Boolian">a boolian object for the request if it is asynchronous or not. Default is true.</param>       

        if (!isString(entitySetName))
            throw new Error("Malam.CrmWebAPI.ExecuteAction entitySetName parameter must be a string.");

        if (!isString(actionName))
            throw new Error("Malam.CrmWebAPI.ExecuteAction actionName parameter must be a string.");



        var successCheck = function (req) { return (req.status == 200 || req.status == 204); }

        return DoRequest("POST", encodeURI(getWebAPIPath() + entitySetName + "(" + entityId + ")/Microsoft.Dynamics.CRM." + actionName), actionInputParams, successCallback, errorCallback, successCheck, async);
    }


    //Internal supporting functions
    this.GetClientUrl = function () {
        //Get the organization URL
        if (typeof GetGlobalContext == "function" &&
            typeof GetGlobalContext().getClientUrl == "function") {
            return GetGlobalContext().getClientUrl();
        }
        else {
            //If GetGlobalContext is not defined check for Xrm.Page.context;
            if (typeof Xrm != "undefined" &&
                typeof Xrm.Page != "undefined" &&
                typeof Xrm.Page.context != "undefined" &&
                typeof Xrm.Page.context.getClientUrl == "function") {
                try {
                    return Xrm.Page.context.getClientUrl();
                } catch (e) {
                    throw new Error("Xrm.Page.context.getClientUrl is not available.");
                }
            }
            else { throw new Error("Context is not available."); }
        }
    }
    function getWebAPIPath() {
        return Malam.CrmWebAPI.GetClientUrl() + "/api/data/v8.1/";
    }
    function DoRequest(method, url, obj, successCallback, errorCallback, successCheck, async, getFormattedValues) {

        //debugger;

        async = async == null ? true : async;

        var req = new XMLHttpRequest();
        req.open(method, url, async);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        if (getFormattedValues)
            req.setRequestHeader("Prefer", 'odata.include-annotations="OData.Community.Display.V1.FormattedValue"');

        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (successCheck(this)) {
                    var data = "";
                    if (this.response != "")
                        data = JSON.parse(this.response, this.dateReviver);
                    if (successCallback)
                        successCallback(data);
                }
                else {
                    if (errorCallback)
                        errorCallback(Malam.CrmWebAPI.errorHandler(req.response));
                }
            }
        };

        if (obj != null)
            req.send(JSON.stringify(obj));
        else
            req.send();
    }

    //Internal validation functions
    function isString(obj) {
        if (typeof obj === "string") {
            return true;
        }
        return false;

    }
    function isNull(obj) {
        if (obj === null)
        { return true; }
        return false;
    }
    function isUndefined(obj) {
        if (typeof obj === "undefined") {
            return true;
        }
        return false;
    }
    function isFunction(obj) {
        if (typeof obj === "function") {
            return true;
        }
        return false;
    }
    function isNullOrUndefined(obj) {
        if (isNull(obj) || isUndefined(obj)) {
            return true;
        }
        return false;
    }
    function isFunctionOrNull(obj) {
        if (isNull(obj))
        { return true; }
        if (isFunction(obj))
        { return true; }
        return false;
    }

    // This function is called when an error callback parses the JSON response.
    // It is a public function because the error callback occurs in the onreadystatechange 
    // event handler and an internal function wouldn’t be in scope.
    this.errorHandler = function (resp) {
        try {
            return JSON.parse(resp).error;
        } catch (e) {
            return new Error("Unexpected Error")
        }
    }

    this.dateReviver = function (key, value) {
        var a;
        if (typeof value === 'string') {
            a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
            if (a) {
                return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
            }
        }
        return value;
    }

}).call(Malam.CrmWebAPI);


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




