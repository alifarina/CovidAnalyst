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
formData = returnJSONHttpData()
#print('got httpdata')
print(formData)
reqMethod = os.environ['REQUEST_METHOD'].lower()
containsAuth = False
if('HTTP_X_AUTH' in os.environ):
    containsAuth = True

if(containsAuth):
    loginMdp = os.environ['HTTP_X_AUTH'].split(':')            
else:
    loginMdp = None


def insertRecord(Patient_Id,Breathlessness,Fever,Loss_Of_Taste_Smell,Dry_Cough,Sore_Throat,Oxygen_Level,Heart_Rate,Blood_Pressure,Temperature,Date_Created):
    success = False
    error = ""
    try:
        with connection.cursor() as cursor:
            sql = "INSERT INTO Patient_Daily_Record(Patient_Id,Breathlessness,Fever,Loss_Of_Taste_Smell,Dry_Cough,Sore_Throat,Oxygen_Level,Heart_Rate,Blood_Pressure,Temperature,Date_Created) VALUES('{0}','{1}','{2}'),'{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}')".format(Patient_Id,Breathlessness,Fever,Loss_Of_Taste_Smell,Dry_Cough,Sore_Throat,Oxygen_Level,Heart_Rate,Blood_Pressure,Temperature,Date_Created)
            cursor.execute(sql)
        connection.commit()
        success = True
    except e:
        error = e
        print("error",e)
    return success,error


def addPatientRecord():
    try:
        if(reqMethod == 'post'):
            if(formData):
                if (('Breathlessness' in formData) and ('Fever' in formData) and ('Loss_Of_Taste_Smell' in formData)
                and ('Dry_Cough' in formData) and ('Sore_Throat' in formData) and ('Oxygen_Level' in formData) and ('Heart_Rate' in formData)
                and ('Blood_Pressure' in formData)and ('Temperature' in formData)and ('Date_Created' in formData)):
                    Breathlessness = formData['Breathlessness']
                    Fever = formData['Fever']
                    Loss_Of_Taste_Smell = formData['Loss_Of_Taste_Smell']
                    Dry_Cough = formData['Dry_Cough']
                    Sore_Throat = formData['Sore_Throat']
                    Oxygen_Level = formData['Oxygen_Level']
                    Heart_Rate = formData['Heart_Rate']
                    Blood_Pressure = formData['Blood_Pressure']
                    Temperature = formData['Temperature']
                    Date_Created = formData['Date_Created']
                    udsucess, uderror = insertRecord(Breathlessness, Fever, Loss_Of_Taste_Smell, Dry_Cough, Sore_Throat, Oxygen_Level, Heart_Rate, Blood_Pressure, Temperature, Date_Created)
                    print('succes',udsucess)
                    if(udsucess):
                        finalResult["success"]=True
                        finalResult["message"]='Record inserted successfully'
                        print(json.dumps(finalResult))
                    else:
                        finalResult["success"]=False                        
                        print(json.dumps(finalResult))   
                else:
                    finalResult["success"]=False
                    finalResult["error"]='Invalid Data Object'
                    print(json.dumps(finalResult))
            else:
                    finalResult["success"]=False
                    finalResult["error"]='Invalid Data Object'
                    print(json.dumps(finalResult))
    except e:
        print(e)


addPatientRecord();