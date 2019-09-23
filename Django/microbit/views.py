from django.shortcuts import render
from django.http import HttpResponse 
from django.views.decorators.csrf import csrf_protect
import serial
import random


serialPort = serial.Serial('com3',115200,timeout = 0.8)
serialPort.close()
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
    if not serialPort.isOpen():
        serialPort.open()
        valor = serialPort.read(1).decode("utf-8")
        print(valor)
        serialPort.close()
    return HttpResponse(valor)

def EscreveRequest(request):
    if not serialPort.isOpen():
        serialPort.open()
    valor = request.POST.get("message")
    print(valor)
    serialPort.write(valor.encode('utf-8'))
    serialPort.close()
    return HttpResponse("success")


def fechaPorta(request):
    print(serialPort.isOpen())
    return HttpResponse(1)


