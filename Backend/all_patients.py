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

def returnHttpGetData():
    try:
        #print('returnHttpData')
        formData = cgi.FieldStorage()
        # print(formData)
        if(formData):
            httpData = {}
            httpDataKeys = []
            httpDataKeys = list(formData)
            for key in httpDataKeys:
                httpData[key] = (formData[key].value)
            #print(httpData)
            return httpData
        else:
            return None
    except e:
        print(e)

def returnJSONHttpData():
    try:
        #print('returnHttpData')
        jsonObject=sys.stdin.read()
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
# print('dbconnection made')

reqMethod = os.environ['REQUEST_METHOD'].lower()
# print('got reqmethod',reqMethod)

if (reqMethod == 'get'):
    formData = returnHttpGetData()
else:
    formData = returnJSONHttpData()
# print('got httpdata')
# print(formData)
reqMethod = os.environ['REQUEST_METHOD'].lower()
containsAuth = False
if('HTTP_X_AUTH' in os.environ):
    containsAuth = True

if(containsAuth):
    loginMdp = os.environ['HTTP_X_AUTH'].split(':')            
else:
    loginMdp = None



def selectAllPatients():
    error = ""
    result = ""
    try:
        with connection.cursor() as cursor:
            sql = "Select * from Patient_Info as P inner join Patient_Health_Info as I on P.Patient_Id = I.Patient_Id"
            cursor.execute(sql)
            result = cursor.fetchall()
        connection.commit()
        
    except e:
        error = e
    return result,error

def selectPatientHealthInfoByPatientId(Patient_ID):
    error = ""
    result = ""
    try:
        with connection.cursor() as cursor:
            sql = "Select * from Patient_Health_Info where Patient_Id='"+Patient_ID+"'"
            #print(sql)
            cursor.execute(sql)
            result = cursor.fetchall()
        connection.commit()
        
    except e:
        error = e
    return result,error

def selectAllPatientsWithConsultation(GP_ID):
    error = ""
    result = ""
    try:
        with connection.cursor() as cursor:
            sql = "Select * from Patient_Info as P inner join Patient_Health_Info as I on P.Patient_Id = I.Patient_Id inner join Consultations as C on C.Patient_Id=I.Patient_Id where C.GP_Id='"+GP_ID+"'"
            #print(sql)
            cursor.execute(sql)
            result = cursor.fetchall()
        connection.commit()
        
    except e:
        error = e
    return result,error

def insertIntoPatientProfile(Patient_ID,Hypertension,Diabetes,Cardiovascular_Disease,Chronic_Respiratory_Disease,Registered_On):
    success = False
    error = ""
    try:
        with connection.cursor() as cursor:
            sql = "INSERT INTO Patient_Health_Info(Patient_Id,Hypertension,Diabetes,Cardiovascular_Disease,Chronic_Respiratory_Disease,Registered_On) VALUES('{0}',{1},{2},{3},{4},'{5}')".format(Patient_ID,Hypertension,Diabetes,Cardiovascular_Disease,Chronic_Respiratory_Disease,Registered_On)
            #print(sql)
            cursor.execute(sql)
        connection.commit()
        success = True
    except e:
        error = e
        print("error",e)
    return success, error

def updateIntoPatientProfile(Patient_ID,Hypertension,Diabetes,Cardiovascular_Disease,Chronic_Respiratory_Disease):    
    #print('in updateIntoPatientProfile')
    success = False
    error = ""
    try:
        with connection.cursor() as cursor:
            sql="update Patient_Health_Info set Hypertension = {0},Diabetes = {1},Cardiovascular_Disease = {2},Chronic_Respiratory_Disease = {3} where Patient_Id  = '{4}'".format(Hypertension,Diabetes,Cardiovascular_Disease,Chronic_Respiratory_Disease,Patient_ID)            
            #print(sql)
            cursor.execute(sql)
        connection.commit()
        success = True
    except e:
        error = e
        print("error",e)
    return success, error

def insertOrUpdatePatientProfileById(Patient_ID,Hypertension,Diabetes,Cardiovascular_Disease,Chronic_Respiratory_Disease,Registered_On):
    result,error = selectPatientHealthInfoByPatientId(formData['patientId'])  
    #print('in insertorupdate')
    if(result):
        if(len(result)>0):
            #print('in update')
            result,error = updateIntoPatientProfile(Patient_ID,Hypertension,Diabetes,Cardiovascular_Disease,Chronic_Respiratory_Disease)
            if (result):
                finalResult={}
                finalResult["success"]=True                
                finalResult["message"]='Profile Updated successfully'
                print(json.dumps(finalResult))
            else:
                finalResult={}
                finalResult["success"]=False
                print(json.dumps(finalResult))
    elif(error):
        finalResult={}
        finalResult["success"]=False
        print(json.dumps(finalResult))
    else:
        #print('in insert')
        result,error = insertIntoPatientProfile(Patient_ID,Hypertension,Diabetes,Cardiovascular_Disease,Chronic_Respiratory_Disease,Registered_On)
        if (result):
            finalResult={}
            finalResult["success"]=True                
            finalResult["message"]='Profile Inserted successfully'
            print(json.dumps(finalResult))
        else:
            finalResult={}
            finalResult["success"]=False
            print(json.dumps(finalResult))





def executeQuery():
    try:
        if(reqMethod == 'post'):            
            if(formData):
                if (('patientId' in formData) and ('hasHypertension' in formData) and ('hasDiabetes' in formData) and ('hasCardiovascularDisease' in formData) and ('hasChronicRespiratoryDisease' in formData)):
                    Patient_ID=formData["patientId"]
                    Hypertension=formData["hasHypertension"]
                    Diabetes=formData["hasDiabetes"]
                    Cardiovascular_Disease=formData["hasCardiovascularDisease"]
                    Chronic_Respiratory_Disease=formData["hasChronicRespiratoryDisease"]
                    Registered_On=formData["registeredOn"]
                    insertOrUpdatePatientProfileById(Patient_ID,Hypertension,Diabetes,Cardiovascular_Disease,Chronic_Respiratory_Disease,Registered_On)
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

        elif(reqMethod == 'get'):
            #print('in get')
            if(formData):
                #print('in form data')
                if (formData['key'] == 'patientprofile'):
                    result,error =selectPatientHealthInfoByPatientId(formData['patientId'])
                    lit = [];
                    for res in result:
                        finalResult = {}
                        finalResult["patientId"] = res['Patient_Id']                        
                        finalResult["hasHypertension"] = int.from_bytes(res['Hypertension'],"big")
                        finalResult["hasDiabetes"] = int.from_bytes(res['Diabetes'],"big")
                        finalResult["hasCardiovascularDisease"] = int.from_bytes(res['Cardiovascular_Disease'],"big")
                        finalResult["hasChronicRespiratoryDisease"] = int.from_bytes(res['Chronic_Respiratory_Disease'],"big")                        
                        lit.append(finalResult)
                        # print(lit)
                    print(json.dumps(lit))

                elif (formData['key'] == 'patientsWithConsultation'):
                    result,error = selectAllPatientsWithConsultation(formData['gpId'])                                   
                    lit = [];
                    for res in result:
                        finalResult = {}
                        finalResult["patientId"] = res['Patient_Id']
                        finalResult["name"]=res['Name']
                        finalResult["hasHypertension"] = int.from_bytes(res['Hypertension'],"big")
                        finalResult["hasDiabetes"] = int.from_bytes(res['Diabetes'],"big")
                        finalResult["hasCardiovascularDisease"] = int.from_bytes(res['Cardiovascular_Disease'],"big")
                        finalResult["hasChronicRespiratoryDisease"] = int.from_bytes(res['Chronic_Respiratory_Disease'],"big")
                        finalResult["registeredOn"] = res['Registered_On']
                        finalResult["age"] = res['Age']
                        finalResult["sex"] = res['Sex']
                        finalResult["bloodGroup"] = res['Blood_Group']
                        lit.append(finalResult)
                        # print(lit)
                    print(json.dumps(lit))
                else:
                    finalResult = {}
                    finalResult["success"]=False                        
                    print(json.dumps(finalResult))
            else:
                #print('in non formdata')
                result,error = selectAllPatients()
                #print('in select query')
                lit = [];
                for res in result:
                    finalResult = {}
                    finalResult["patientId"] = res['Patient_Id']
                    finalResult["name"]=res['Name']
                    finalResult["hasHypertension"] = int.from_bytes(res['Hypertension'],"big")
                    finalResult["hasDiabetes"] = int.from_bytes(res['Diabetes'],"big")
                    finalResult["hasCardiovascularDisease"] = int.from_bytes(res['Cardiovascular_Disease'],"big")
                    finalResult["hasChronicRespiratoryDisease"] = int.from_bytes(res['Chronic_Respiratory_Disease'],"big")
                    finalResult["registeredOn"] = res['Registered_On']
                    finalResult["age"] = res['Age']
                    finalResult["sex"] = res['Sex']
                    finalResult["bloodGroup"] = res['Blood_Group']
                    lit.append(finalResult)
                    # print(lit)
                print(json.dumps(lit))
                                                                         
        else:
            finalResult = {}
            finalResult["success"]=False
            finalResult["error"]='Invalid Data Object'
            print(json.dumps(finalResult))
    except e:
        print(e)


executeQuery()





# for all the data of message table
# with connection.cursor() as cursor:
#     sql2 = "SELECT * FROM `messages` WHERE `dest` = '"+recipient+"'"
#     cursor.execute(sql)
#     result = cursor.fetchall()
#     print(result)
#     connection.close()

#resources = {'men' : 'Hello men !!', 'girls' : 'Hello girls !!', 
#              'birds' : 'Hello birds !!', 
#              'http-accept' : os.environ['HTTP_ACCEPT'],
#              'Request-method': os.environ['REQUEST_METHOD']}
              
#messages = [{'dest': 'men', 'text': 'Hello men !'}, {'dest': 'women', 'text': 'Hello women !'},
#              {'dest':'girls', 'text':'Hello girls !'}]


#formdata = returnHttpData()
#value=resources[formdata['dest']]
#json_resource = json.dumps(result)

#print(json_resource)
