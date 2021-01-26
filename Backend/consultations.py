#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json,sys
import os
import cgi
import pymysql
import uuid

print("Content-Type: application/json; charset=utf-8")
print("Access-Control-Allow-Origin: *")
print("Access-Control-Allow-Methods: GET, PUT, DELETE, POST")
print('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization, cache-control, content-type, expires, pragma')
print()

def returnHttpGetData():
    formData = cgi.FieldStorage()
    httpData = {}
    httpDataKeys = []
    httpDataKeys = list(formData)
    for key in httpDataKeys:
        httpData[key] = (formData[key].value)
    return httpData

def returnJSONHttpData():
    try:
        jsonObject=sys.stdin.read()
        #print(jsonObject)
        if(len(jsonObject)>0):
            formData = json.loads(jsonObject)
            #(formData)
            if(formData):           
                return formData
            else:
                return None
        else:
            return None
    except e:
        print(e)

connection = pymysql.connect(host='localhost',
user='sev5204e_11',
password='Qey59C2y',
db='sev5204e_11',
charset='utf8mb4',
port=3306,
cursorclass=pymysql.cursors.DictCursor)
#print('dbconnection made')
finalResult = {}

#print('got httpdata')
reqMethod = os.environ['REQUEST_METHOD'].lower()
if (reqMethod == 'get'):
    formData = returnHttpGetData()
else :
    formData = returnJSONHttpData()

# print(formData)
containsAuth = False
if('HTTP_X_AUTH' in os.environ):
    containsAuth = True

if(containsAuth):
    loginMdp = os.environ['HTTP_X_AUTH'].split(':')            
else:
    loginMdp = None


def insertRecord(Patient_Id,GP_Id):
    success = False
    error = ""
    try:
        with connection.cursor() as cursor:
            sql = "INSERT INTO Consultations(Patient_Id,GP_Id) VALUES('{0}','{1}')".format(Patient_Id,GP_Id)
            cursor.execute(sql)
        connection.commit()
        success = True
    except e:
        error = e
        print("error",e)
    return success, error

def deleteRecord(Patient_Id,GP_Id):
    success = False
    error = ""
    try:
        with connection.cursor() as cursor:
            sql = "Delete from Consultations where GP_Id  = '"+GP_Id+"' and Patient_Id = '"+Patient_Id+"'" 
            cursor.execute(sql)
        connection.commit()
        success = True
    except e:
        error = e
        print("error",e)
    return success, error

def updateRecordByGP(Patient_Id,GP_Id,isTestReq,text):
    success = False
    error = ""
    try:
        with connection.cursor() as cursor:
            sql="update Consultations set IsCovidTestRequired = {0},Consultation_Text = '{1}' where GP_Id  = '{2}' and Patient_Id = '{3}'".format(isTestReq,text,GP_Id,Patient_Id)
            # sql = "update Consultations set IsCovidTestRequired = "+isTestReq+",Consultation_Text = '"+text+"' where GP_Id  = '"+GP_Id+"' and Patient_Id = '"+Patient_Id+"'" 
            cursor.execute(sql)
        connection.commit()
        success = True
    except e:
        error = e
        print("error",e)
    return success, error
    
def checkIfAlreadyThere(Patient_Id,GP_Id):
    error = ""
    result = ""
    try:
        with connection.cursor() as cursor:
            sql = "Select count(GP_Id) from Consultations where GP_Id  = '"+GP_Id+"' and Patient_Id = '"+Patient_Id+"'" 
            cursor.execute(sql)
            result = cursor.fetchall()
        connection.commit()
    except e:
        error = e
        print("error",e)
    return result,error

def selectRecordsByGP(GP_Id):
    error = ""
    result = ""
    try:
        with connection.cursor() as cursor:
            sql = "Select * from Consultations where GP_Id  = '"+GP_Id+"' " 
            cursor.execute(sql)
            result = cursor.fetchall()
        connection.commit()
        
    except e:
        error = e
    return result, error

def selectRecordsByGPAndPatientID(GP_Id,Patient_Id):
    error = ""
    result = ""
    try:
        with connection.cursor() as cursor:
            sql = "Select * from Consultations where GP_Id  = '"+GP_Id+"' AND Patient_Id = '"+Patient_Id+"'" 
            cursor.execute(sql)
            result = cursor.fetchall()
        connection.commit()
        
    except e:
        error = e
    return result, error

def selectRecordsByPatient(Patient_Id):
    error = ""
    result = ""
    try:
        with connection.cursor() as cursor:
            sql = "Select * from Consultations where Patient_Id  = '"+Patient_Id+"' " 
            cursor.execute(sql)
            result = cursor.fetchall()
        connection.commit()
        
    except e:
        error = e
    return result, error

def getAllGps():
    error = ""
    result = ""
    try:
        with connection.cursor() as cursor:
            sql = "Select GP_Id,name,sex,age,location from GP_Info" 
            cursor.execute(sql)
            result = cursor.fetchall()
        connection.commit()
        
    except e:
        error = e
    return result, error
    
def addPatientRecord():
    try:
        if(reqMethod == 'post'):
            if(formData):
                if (('patientId' in formData) and ('gpId' in formData) and ('isActive' in formData)):
                    isActive = formData['isActive']
                    GP_Id = formData['gpId']
                    Patient_Id = formData['patientId']
                    if (isActive == 0): # want to delete
                        resultDel, errDel = deleteRecord(Patient_Id, GP_Id)
                        if (resultDel):
                            finalResult={}
                            finalResult["success"]=True
                            finalResult["gpId"]=GP_Id
                            finalResult["message"]='Record deleted successfully'
                            print(json.dumps(finalResult))
                    else:
                        udsucess, uderror = insertRecord(Patient_Id, GP_Id)
                        if (udsucess):
                            finalResult={}
                            finalResult["success"]=True
                            finalResult["gpId"]=GP_Id
                            finalResult["message"]='Record inserted successfully'
                            print(json.dumps(finalResult))
                        else:
                            finalResult={}
                            finalResult["success"]=False
                            finalResult["gpId"]=GP_Id
                            print(json.dumps(finalResult))
                else:
                    finalResult={}
                    finalResult["success"]=False
                    finalResult["error"]='Invalid Data Object'
                    print(json.dumps(finalResult))
            
            else:
                finalResult={}
                finalResult["success"]=False
                finalResult["error"]='Invalid Data Object'
                print(json.dumps(finalResult))
        elif (reqMethod == 'get'):
            if (formData['key'] == 'allGp'): #key='allGp'
                result, error = getAllGps()
                if (result != ""):
                    lit = [];
                    for res in result:
                        finalResult = {}
                        finalResult["id"] = res['GP_Id']
                        finalResult["name"]=res['name']
                        finalResult["age"]=res['age']
                        finalResult["sex"]=res['sex']
                        finalResult["location"]=res['location']
                        lit.append(finalResult)
                        # print(lit)
                    print(json.dumps(lit))
            elif(formData['key'] == 'allGpbyPid'):
                result,error = selectRecordsByPatient(formData['value'])   # key=allGpbyPid&value='id'                 
                if (result != ""):
                    lit = [];
                    for res in result:
                        finalResult = {}
                        finalResult["patientId"] = res['Patient_Id']                        
                        finalResult["gpId"] = res['GP_Id']
                        finalResult["consultationText"]=res['Consultation_Text']
                        finalResult["isCovidTestRequired"]=res['IsCovidTestRequired']
                        lit.append(finalResult)
                        # print(lit)
                    print(json.dumps(lit))
            elif(formData['key'] == 'patientByGPandPatient'):
                result,error = selectRecordsByGPAndPatientID(formData['gpId'],formData['patientId'])   # key=allGpbyGid&value='id'                 
                if (result != ""):
                    lit = [];
                    for res in result:
                        finalResult = {}
                        finalResult["patientId"] = res['Patient_Id']                        
                        finalResult["gpId"] = res['GP_Id']
                        finalResult["consultationText"]=res['Consultation_Text']
                        finalResult["isCovidTestRequired"]=res['IsCovidTestRequired']
                        lit.append(finalResult)
                        # print(lit)
                    print(json.dumps(lit))
        elif (reqMethod == 'put'):
            if (('patientId' in formData) and ('gpId' in formData) and ('isCovidTestRequired' in formData)
            and ('consultationText' in formData)):
                GP_Id = formData['gpId']
                Patient_Id = formData['patientId']
                IsCovidTestRequired = formData['isCovidTestRequired']
                Consultation_Text = formData['consultationText']
                updateSucc, updateErr = updateRecordByGP(Patient_Id, GP_Id, IsCovidTestRequired,Consultation_Text)
                if (updateSucc):
                    finalResult={}
                    finalResult["success"]=True
                    finalResult["message"]='Record updated successfully'
                    print(json.dumps(finalResult))
                else:
                    finalResult={}
                    finalResult["success"]=False                        
                    print(json.dumps(finalResult)) 
            else:
                finalResult={}
                finalResult["success"]=False
                finalResult["error"]='Invalid Data Object'
                print(json.dumps(finalResult))

    except e:
        print(e)


addPatientRecord();