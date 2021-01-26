#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json,sys
import os
import cgi
import pymysql
import uuid

print("Content-Type: application/json; charset=utf-8")
print("Access-Control-Allow-Origin: *")
print('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization, cache-control, content-type, expires, pragma')
print()
#print('Access-Control-Allow-Origin: *\n')
##print('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization, cache-control, content-type, expires, pragma\n')
##print('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, PATCH, OPTIONS\n')
#print('Content-type: application/json\n')
#print()
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
            #print(formData)
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
if (reqMethod == 'post'):
    formData = returnJSONHttpData()
else :
    formData = returnHttpGetData()

# print(formData)
containsAuth = False
if('HTTP_X_AUTH' in os.environ):
    containsAuth = True

if(containsAuth):
    loginMdp = os.environ['HTTP_X_AUTH'].split(':')            
else:
    loginMdp = None


def insertRecord(Patient_Id,Breathlessness,Fever,Loss_Of_Taste_Smell,Dry_Cough,Sore_Throat,Oxygen_Level,Heart_Rate,Blood_Pressure,Temperature,Date_Created,inContactWithCovidPositivePatient):
    success = False
    error = ""
    try:
        with connection.cursor() as cursor:
            sql = "INSERT INTO Patient_Daily_Record(Patient_Id,Breathlessness,Fever,Loss_Of_Taste_Smell,Dry_Cough,Sore_Throat,Oxygen_Level,Heart_Rate,Blood_Pressure,Temperature,Date_Created,Contact_With_Covid_Positive_Patient) VALUES('{0}',{1},{2},{3},{4},{5},'{6}','{7}','{8}','{9}','{10}',{11})".format(Patient_Id,Breathlessness,Fever,Loss_Of_Taste_Smell,Dry_Cough,Sore_Throat,Oxygen_Level,Heart_Rate,Blood_Pressure,Temperature,Date_Created,inContactWithCovidPositivePatient)
            #print(sql)
            cursor.execute(sql)
        connection.commit()
        success = True
    except e:
        error = e
        print("error",e)
    return success,error

def selectRecords(patient_id):
    error = ""
    result = ""
    try:
        with connection.cursor() as cursor:
            sql = "Select * from Patient_Daily_Record where Patient_Id  = '"+patient_id+"' order by Date_Created desc" 
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
                if (('patientId' in formData) and ('hasBreathlessness' in formData) and ('hasFever' in formData) and ('hasLossOfTasteSmell' in formData)
                and ('hasDryCough' in formData) and ('hasSoreThroat' in formData) and ('oxygenLevel' in formData) and ('heartRate' in formData)
                and ('bloodPressure' in formData) and ('temperature' in formData) and ('dateCreated' in formData)and ('inContactWithCovidPositivePatient' in formData)):
                    Breathlessness = formData['hasBreathlessness']
                    Fever = formData['hasFever']
                    Loss_Of_Taste_Smell = formData['hasLossOfTasteSmell']
                    Dry_Cough = formData['hasDryCough']
                    Sore_Throat = formData['hasSoreThroat']
                    Oxygen_Level = formData['oxygenLevel']
                    Heart_Rate = formData['heartRate']
                    Blood_Pressure = formData['bloodPressure']
                    Temperature = formData['temperature']
                    Date_Created = formData['dateCreated']
                    isInContact = formData['inContactWithCovidPositivePatient']
                    Patient_Id = formData['patientId']
                    udsucess, uderror = insertRecord(Patient_Id, Breathlessness, Fever, Loss_Of_Taste_Smell,
                     Dry_Cough, Sore_Throat, Oxygen_Level, Heart_Rate, Blood_Pressure, Temperature, Date_Created,isInContact)
                    #print('record inserted',udsucess)
                    if(udsucess):
                        finalResult = {}
                        finalResult["success"]=True
                        finalResult["message"]='Record inserted successfully'
                        #print(finalResult)
                        print(json.dumps(finalResult))
                    else:
                        finalResult = {}
                        finalResult["success"]=False                        
                        print(json.dumps(finalResult))   
                else:
                    finalResult = {}
                    finalResult["success"]=False
                    finalResult["error"]='Invalid Data Object'
                    print(json.dumps(finalResult))
            
            else:
                finalResult = {}
                finalResult["success"]=False
                finalResult["error"]='Invalid Data Object'
                print(json.dumps(finalResult))
        elif (reqMethod == 'get'):
            result,error = selectRecords(formData['id'])                    
            if (result != ""):
                lit = [];
                for res in result:
                    finalResult = {}
                    finalResult["patientId"] = res['Patient_Id']
                    finalResult["hasBreathlessness"]=int.from_bytes(res['Breathlessness'], "big")
                    finalResult["hasFever"] = int.from_bytes(res['Fever'], "big")
                    finalResult["hasLossOfTasteSmell"] = int.from_bytes(res['Loss_Of_Taste_Smell'], "big")
                    finalResult["hasDryCough"] = int.from_bytes(res['Dry_Cough'], "big")
                    finalResult["hasSoreThroat"] = int.from_bytes(res['Sore_Throat'], "big")
                    finalResult["oxygenLevel"] = res['Oxygen_Level']
                    finalResult["heartRate"] = res['Heart_Rate']
                    finalResult["bloodPressure"] = res['Blood_Pressure']
                    finalResult["temperature"] = res['Temperature']
                    finalResult["dateCreated"] = res['Date_Created']
                    finalResult["inContactWithCovidPositivePatient"] = int.from_bytes(res['Contact_With_Covid_Positive_Patient'], "big")
                    lit.append(finalResult)
                    # print(lit)
                print(json.dumps(lit))
    except e:
        print(e)


addPatientRecord();