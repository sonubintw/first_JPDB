var jpdbToken = "90932304|-31949271334879400|90954182";
var jpdbBase = "http://api.login2explore.com:5577";
var jpdbIml = "/api/iml";
var jpdbName = "online_tester";
var jpdbRel = "internship";
var jpdbIrl = "/api/irl";



$("#schRollNo").focus();

function validateAndGetFormData() {
    var schRollNoVar = $("#schRollNo").val();
    if (schRollNoVar === "") {
        alert("student Roll no is required");
        //focus select the active element in the current document.
        $("#schRollNo").focus();
        return "";
    }
    var schNameVar = $("#schFullName").val();
    if (schNameVar === "") {
        alert("Name is Required ");
        $("#schFullName").focus();
        return "";
    }

    var schBirthDateVar = $('#schBirthDate').val();
    if (schBirthDateVar === "") {
        alert("Birth is Required ");
        $('#schBirthDate').focus();
        return "";
    }


    var schAddressVar = $("#schAddress").val();
    if (schAddressVar === "") {
        alert("Employee deduction amount is Required Value");
        $("#schAddress").focus();
        return "";
    }
    var schEnrollVar = $("#schEnroll").val();
    if (schEnrollVar === "") {
        alert("Employee deduction amount is Required Value");
        $("#schEnroll").focus();
        return "";
    }


    var jsonStrObj = {
        Id: schRollNoVar,
        Name: schNameVar,
        BirthDate: schBirthDateVar,
        Address: schAddressVar,
        EnrollDate: schEnrollVar
    }
    $("#empSave").prop('disabled', true)

    return JSON.stringify(jsonStrObj);
}
//output from above function is 
/* 
"empId": "schNameVar",
"empName": "schNameVar",
"empSalary": "schBirthDate",
"empDeduction": "schAddress",
*/
//json formated data


function getEmpIdAsJsonObj() {
    var schRollNoVar = $('#schRollNo').val();
    // var empId = 1;
    var JsonStr = {
        "Id": `${schRollNoVar}`
        //try using without template literal 
    };
    return JSON.stringify(JsonStr);
}

function saveRecNO2LS(jsonObj) {
    var livevData = JSON.parse(jsonObj.data);
    localStorage.setItem('Rec_No_Mkc', livevData.rec_no)
}
//this parameter is comming from getEmp()
function fillData(jsonObj) {
    saveRecNO2LS(jsonObj);
    var dataFromJPDB = JSON.parse(jsonObj.data).record;
    $('#schFullName').val(dataFromJPDB.Name);
    $("#schBirthDate").val(dataFromJPDB.BirthDate);
    $('#schAddress').val(dataFromJPDB.Address);
    $('#schEnroll').val(dataFromJPDB.EnrollDate)
}


function resetForm() {
    $("#schRollNo").val("")
    $("#schFullName").val("");
    $("#schBirthDate").val("");
    $('#schAddress').val("");
    $("#schEnroll").val("")
    $("#empSave").prop('disabled', true)
    $("#empChange").prop('disabled', true)
    $("#empReset").prop('disabled', true)
    $("#schRollNo").focus();
}


// This method is used to create PUT Json request.
function createPUTRequest(jsonObj) {

    var putRequest = "{\n"
        + "\"token\" : \""
        + jpdbToken
        + "\","
        + "\"dbName\": \""
        + jpdbName
        + "\",\n" + "\"cmd\" : \"PUT\",\n"
        + "\"rel\" : \""
        + jpdbRel + "\","
        + "\"jsonStr\": \n"
        + jsonObj
        + "\n"
        + "}";
    return putRequest;
}
// this function is used to execute the command using jQuery.post() it send data to the server
// using a HTTP POST request
function executeCommand(reqString, jpdbBase, jpdbIml) {
    var jsonObj;
    var url = jpdbBase + jpdbIml;
    //just declaring the variable
    // jQuery.post( url [, data ] [, success ] [, dataType ] )
    $.post(url, reqString, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        var dataJsonObj = result.responseText;
        //convert json into javascript string
        jsonObj = JSON.parse(dataJsonObj);
    });
    return jsonObj;
}


function saveEmployeeData() {
    //checking data before sending it to server
    var jsonStr = validateAndGetFormData();
    if (jsonStr === "") {
        return "";
    }
    //function call with argument as formdata
    var putReqStr = createPUTRequest(validateAndGetFormData())


    alert(putReqStr);
    console.log(putReqStr);

    jQuery.ajaxSetup({ async: false });
    //putReqStr is the data from form 

    var resultObjFromJPDB = executeCommand(putReqStr, "http://api.login2explore.com:5577", "/api/iml");

    alert(JSON.stringify(resultObjFromJPDB));

    //result we are getting from server
    // console.log(resultObjFromJPDB)

    jQuery.ajaxSetup({ async: true });
    resetForm();

    // function dataFromServer() {
    //     console.log(resultObjFromJPDB)
    //     let x = resultObjFromJPDB;
    //     let y = JSON.parse(x.data)
    //     console.log(y['rec_no'][0])
    // }
    // dataFromServer()
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function createGET_BY_KEYRequest(token, dbname, relationName, jsonObjStr) {

    var value1 = "{\n"
        + "\"token\" : \""
        + token
        + "\",\n" + "\"cmd\" : \"GET_BY_KEY\",\n"
        + "\"dbName\": \""
        + dbname
        + "\",\n"
        + "\"rel\" : \""
        + relationName
        + "\",\n"
        + "\"jsonStr\":\n"
        + jsonObjStr
        + "\n"
        + "}";
    return value1;
}
/////////////////////////////////////////////////////////////////////////////////////////////////
function executeCommandAtGivenBaseUrl(reqString, dbBaseUrl, apiEndPointUrl) {
    var url = dbBaseUrl + apiEndPointUrl;
    var jsonObj;
    $.post(url, reqString, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        var dataJsonObj = result.responseText;
        jsonObj = JSON.parse(dataJsonObj);
    });
    return jsonObj;
}

/////////////////////////////////////////////////////////////////////////////////////////////
function getEmp() {
    var empIdJsonObj = getEmpIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(jpdbToken, jpdbName, jpdbRel, empIdJsonObj)
    jQuery.ajaxSetup({ async: false });
    //putReqStr is the data from form

    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBase, jpdbIrl);
    jQuery.ajaxSetup({ async: true });
    if (resJsonObj.status === 400) {
        alert("data not found kindly create a new data to save in DB")
        $("#empSave").prop("disabled", false)
        $("#empReset").prop("disabled", false)
        $("#schFullName").focus();
    }
    else if (resJsonObj.status === 200) {
        //argument is response from server
        $("#schRollNo").prop("disabled", false)
        fillData(resJsonObj);
        $("#empChange").prop("disabled", false)
        $("#empReset").prop("disabled", false)
        $("#schFullName").focus();
    }

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//update request
function createUPDATERecordRequest(token, jsonObj, dbName, relName, recNo) {
    var req = "{\n"
        + "\"token\" : \""
        + token
        + "\","
        + "\"dbName\": \""
        + dbName
        + "\",\n" + "\"cmd\" : \"UPDATE\",\n"
        + "\"rel\" : \""
        + relName
        + "\",\n"
        + "\"jsonStr\":{ \""
        + recNo
        + "\":\n"
        + jsonObj
        + "\n"
        + "}}";
    return req;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function executeCommandAtGivenBaseUrl(reqString, dbBaseUrl, apiEndPointUrl) {
    var url = dbBaseUrl + apiEndPointUrl;
    var jsonObj;
    $.post(url, reqString, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        var dataJsonObj = result.responseText;
        jsonObj = JSON.parse(dataJsonObj);
    });
    return jsonObj;
}

function changeData() {
    //fix here
    var jsonChg = validateAndGetFormData();
    $("#empChange").prop("disabled", false);
    var keyFromLs = localStorage.getItem("Rec_No_Mkc")
    var requestUpdate = createUPDATERecordRequest(jpdbToken, jsonChg, jpdbName, jpdbRel, keyFromLs)
    jQuery.ajaxSetup({ async: false });
    var resJsonObjOfUpdate = executeCommandAtGivenBaseUrl(requestUpdate, jpdbBase, jpdbIml)
    jQuery.ajaxSetup({ async: true });
    // console.log(resJsonObj);
    resetForm();
    // $("#schRollNo").focus
    if (resJsonObjOfUpdate.status === 400) {
        alert(resJsonObj.status + " oops")

    }
    else if (resJsonObjOfUpdate.status === 200) {
        alert("data has been updated")
    }

}


