
"use strict";

var Malam;
(function (Malam) {
    var Weizman;
    (function (Weizman) {
        var StudentRibbon = (function () {
            function StudentRibbon() {
            }

            StudentRibbon.DigitNum = function (number, digit) {
                number = number + "";
                var res = number + "";
                if (number == null || number == "" || number.length == digit) return res;

                if (number.length < digit) //Month, Day, Hour, Minutes, Seconds
                    for (var i = number.length; i < digit; i++)
                        res = "0" + res;
                return res;
            }

            //-- check if record exist. if not, create. if yes, get the fields year and check if the botton has been pressed at the last hour.
            StudentRibbon.canExecuteMatch = function (callback) {
                //debugger;

                var sEntity = 'new_matchwfs?';
                var sXml = '';

                sXml += '<fetch count="50" >';
                sXml += '<entity name="new_matchwf" >';
                sXml += '<attribute name="statecode" />';
                sXml += '<attribute name="new_year" />';
                sXml += '<attribute name="new_name" />';
                sXml += '<attribute name="new_matchwfid" />';
                sXml += '<attribute name="modifiedby" />';
                sXml += '<attribute name="statuscodename" />';
                sXml += '<attribute name="modifiedon" />';
                sXml += '<attribute name="createdbyname" />';
                sXml += '<attribute name="createdon" />';
                sXml += '<attribute name="ownerid" />';
                sXml += '<filter>';
                sXml += '<condition attribute="new_year" operator="eq" value="2016" />';
                sXml += '</filter>';
                sXml += '</entity>';
                sXml += '</fetch>';

                Malam.CrmWebAPI.fetchXml(sEntity, sXml, function (data) {
                    callback(data); 
                }, function (e) { debugger; callback(null, e); }, false);
            }
            //== check if record exist. if not, create. if yes, get the fields year and check if the botton has been pressed at the last hour.


            //--create new matchWF record
            StudentRibbon.createRecord = function (callback) {
                //debugger;

                var columnSet = {};
                var d = new Date();
                var datetext =
                    d.getFullYear() + "" +
                    StudentRibbon.DigitNum((d.getMonth() + 1), 2) + "" +
                    StudentRibbon.DigitNum(d.getDate(), 2) + "" +
                    StudentRibbon.DigitNum(d.getHours(), 2) + "" +
                    StudentRibbon.DigitNum(d.getMinutes(), 2) + "" +
                    StudentRibbon.DigitNum(d.getSeconds(), 2);

                columnSet.new_name = datetext;
                columnSet.new_year = d.getFullYear();
                
                Malam.CrmWebAPI.create("new_matchwfs", columnSet, function (data) {
                    callback("Match #" + datetext + " created.");
                });
            };
            //==create new matchWF record

            //--update "new_matchwfs" record
            StudentRibbon.updateRecord = function (id, callback) {
                //debugger;

                var columnSet = {};
                var d = new Date();
                var datetext =
                    d.getFullYear() + "" +
                    StudentRibbon.DigitNum((d.getMonth() + 1), 2) + "" +
                    StudentRibbon.DigitNum(d.getDate(), 2) + "" +
                    StudentRibbon.DigitNum(d.getHours(), 2) + "" +
                    StudentRibbon.DigitNum(d.getMinutes(), 2) + "" +
                    StudentRibbon.DigitNum(d.getSeconds(), 2);

                columnSet.new_name = datetext;
                columnSet.new_year = d.getFullYear();

                //Example: update = function (id, entity, entitySetName, successCallback, errorCallback, async)
                Malam.CrmWebAPI.update(id, columnSet,"new_matchwfs", function (data) {
                    callback("Match #" + id + " updated.");
                });
            };
            //==update "new_matchwfs" record

            StudentRibbon.Match = function () {
                //debugger;
                //Xrm.Utility.alertDialog('Message on alert dialog2',  function() { }); 
                StudentRibbon.canExecuteMatch(function (cbMatchWFs, ee) {
                    //debugger;

                    if (cbMatchWFs == null || cbMatchWFs.value.length == 0)     //create new record
                    {
                        Xrm.Utility.confirmDialog("Would you like to activate the match process?", function () {

                        StudentRibbon.createRecord(function (cb, ee) {
                            alert(cb);
                        });
                                                        

                        }, function (e) { debugger; }, true);
                    }
                    else if (cbMatchWFs.value.length == 1) {                 //get values and compare if it not preesed at last hour
                        //debugger;
                        var year = cbMatchWFs.value[0].new_year;
                        var modifiedon = Date.parse(cbMatchWFs.value[0].modifiedon);
                        var currentDateTime = Date.parse(new Date().toLocaleString());
                        var matchwfid = cbMatchWFs.value[0].new_matchwfid

                        //TODO: befor uploading to production, change from 1 minute (60000) to 1 hour (3600000). 
                        if ((modifiedon + 60000) > currentDateTime)   //3600000 = 1 Hour, 60000 = 1 Minute
                        {
                            Xrm.Utility.alertDialog("You need to wait 1 hour befor trying to macth again.", function () { return false; });
                        }
                        else
                        {
                            //debugger;
                            StudentRibbon.updateRecord(matchwfid, function (cb) {      //update & start wf
                                Xrm.Utility.alertDialog(cb, function () { return false; });
                            });
                            alert("start wf here.. ");
                        }
                    }
                    else if (cbMatchWFs.value.length > 1) {  //countOfRecords
                        Xrm.Utility.alertDialog('Error:\nFound more then one record.', function () { return false; });
                        return;
                    }
                }, function () { });
            };
            return StudentRibbon;
        }());
        Weizman.StudentRibbon = StudentRibbon;
    })(Weizman = Malam.Weizman || (Malam.Weizman = {}));
})(Malam || (Malam = {}));
