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

def returnHttpData():
    try:
        formData = cgi.FieldStorage()
        #print(formData)
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


def getQueryString():
    qs=os.environ['QUERY_STRING']
    if(len(qs)>0):
        return qs
    else:
        return None

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
#print(formData)
reqMethod = os.environ['REQUEST_METHOD'].lower()
containsAuth = False
if('HTTP_X_AUTH' in os.environ):
    containsAuth = True

if(containsAuth):
    loginMdp = os.environ['HTTP_X_AUTH'].split(':')            
else:
    loginMdp = None

#print('got auth info')
def createLogin(username,password,usertype):
    success = False
    error = ""
    uId = str(uuid.uuid4())
    try:
        with connection.cursor() as cursor:
            sql = "INSERT INTO User_Access(Username,Usertype,Password,User_Id) VALUES('{0}','{1}',PASSWORD('{2}'),'{3}')".format(username,usertype,password,uId)
            cursor.execute(sql)
        connection.commit()
        success = True
    except e:
        error = e
    return success,error,uId

def registerUserDetails(name,sex,age,location,bgroup,uId,loginTypeSelected):
    success = False
    error = ""
    tableName = "Patient_Info" if loginTypeSelected.lower() == "patient" else "GP_Info"
    idColumn = "Patient_Id" if loginTypeSelected.lower() == "patient" else "GP_Id"
    try:
        with connection.cursor() as cursor:
            sql = "INSERT INTO {0}({1},Name,Sex,Age,Location,Blood_Group) VALUES('{2}','{3}','{4}',{5},'{6}','{7}')".format(tableName,idColumn,uId,name,sex,age,location,bgroup)
            cursor.execute(sql)
        connection.commit()
        success = True
    except e:
        error = e
    return success,error

def getregisterUserDetails():
    dta=returnHttpData();    
    if(dta):
        id=dta["id"]
        loginTypeSelected=dta["loginType"]
        tableName = "Patient_Info" if loginTypeSelected.lower() == "patient" else "GP_Info"
        idColumn = "Patient_Id" if loginTypeSelected.lower() == "patient" else "GP_Id"
        with connection.cursor() as cursor:
            #print("in execute sql")
            clauseWhere="WHERE {0}='{1}'".format(idColumn,id)
            sql = "SELECT * FROM `{0}` ".format(tableName)+clauseWhere                       
            #print(sql)
            cursor.execute(sql)
            result = cursor.fetchall()
            if(len(result)>0):
                return idColumn,result[0]
            else:
                return None
    else:
        return None

    


def registerUser():
    try:
        if(reqMethod == 'post'):         
            if(formData):
                #print('in form data')                
                if(('username' in formData) and ('password' in formData) and ('loginTypeSelected' in formData) and ('name' in formData) and ('sex' in formData) and ('age' in formData) and ('location' in formData) and ('bloodGroup' in formData)):                    
                    username = formData['username']
                    password = formData['password']
                    usertype = formData['loginTypeSelected']
                    usucess,uerror,uId = createLogin(username,password,usertype)

                    name = formData['name']
                    sex = formData['sex']
                    age = formData['age']
                    location = formData['location']
                    bloodGroup = formData['bloodGroup']
                    udsucess,uderror = registerUserDetails(name,sex,age,location,bloodGroup,uId,usertype)                    
                    if(usucess and udsucess):
                        finalResult["success"]=True
                        finalResult["id"]=uId
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
        elif(reqMethod == 'get'):
            idColumn,data=getregisterUserDetails()
            if(data):
                finalResult["success"]=True
                finalResult["id"]=data[idColumn]
                finalResult["age"]=data["Age"]
                finalResult["location"]=data["Location"]
                finalResult["sex"]=data["Sex"]
                finalResult["bloodGroup"]=data["Blood_Group"]
                finalResult["name"]=data["Name"]
            print(json.dumps(finalResult))
    except e:
        print(e)


registerUser()





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
