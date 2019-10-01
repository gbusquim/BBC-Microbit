from django.shortcuts import render
from django.http import HttpResponse 
from django.views.decorators.csrf import csrf_protect
import serial
import random


serialPort = serial.Serial('com3',115200,timeout = 0.8)
isWriting = False
#serialPort.close()
# Create your views here

def Home(request):
    return render(request,'jogo.html')

def Terminal(request):
    return render(request,'inicial.html')

def iFrame(request):
    return render(request,'iFrame.html')

def ComSerial(request):
    global serialPort
    return render(request,'home.html')

def trataRequest(request):
    valor = ''
    #if not serialPort.isOpen():
        #serialPort.open()
    if isWriting == False:
        valor = serialPort.read(1).decode("utf-8")
        print(valor)
    #serialPort.close()
    return HttpResponse(valor)

def EscreveRequest(request):
    global isWriting
    #if not serialPort.isOpen():
       # serialPort.open()
    isWriting = True
    valor = request.POST.get("message")
    print(valor)
    serialPort.write(valor.encode('utf-8'))
    #serialPort.close()
    isWriting = False
    return HttpResponse("success")


def fechaPorta(request):
    print(serialPort.isOpen())
    return HttpResponse(1)


