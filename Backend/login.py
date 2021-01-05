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
#print(formData)
reqMethod = os.environ['REQUEST_METHOD'].lower()
containsAuth = False
if('HTTP_X_AUTH' in os.environ):
    containsAuth = True

if(containsAuth):
    loginMdp = os.environ['HTTP_X_AUTH'].split(':')            
else:
    loginMdp = None



def searchUser(username,password,logintype):
    with connection.cursor() as cursor:
        #print("in execute sql")
        clauseWhere="WHERE Username='{0}' AND Password=PASSWORD('{1}') AND Usertype='{2}'".format(username,password,logintype)
        sql = "SELECT User_Id FROM `User_Access` "+clauseWhere                       
        #print(sql)
        cursor.execute(sql)
        result = cursor.fetchall()
        if(len(result)>0):
            return [_["User_Id"] for _ in result][0]
        else:
            return None


def authenticateLogin():
    try:
        if(reqMethod == 'post'):
            if(formData):
                if(('username' in formData) and ('password' in formData) and ('loginTypeSelected' in formData)):
                    username = formData['username']
                    password = formData['password']
                    usertype = formData['loginTypeSelected']
                    uId =searchUser(username,password,usertype.lower())
                    if(uId):
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
    except e:
        print(e)


authenticateLogin()