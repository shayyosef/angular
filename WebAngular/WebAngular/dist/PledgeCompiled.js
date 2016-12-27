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




