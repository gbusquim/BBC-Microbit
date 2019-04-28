from django.shortcuts import render
from django.http import HttpResponse
import serial
import random


serialPort = serial.Serial('com3',115200,timeout=0.25)
serialPort.close()
# Create your views here

def home(request):
    return render(request,'inicial.html')

def iFrame(request):
    #if serialPort.isOpen
    return render(request,'iFrame.html')

def ComSerial(request):
    global serialPort
    #serialPort = serial.Serial('com3',115200,timeout=1)
    return render(request,'home.html')

def trataRequest(request):
    valor = ''
    if not serialPort.isOpen():
        serialPort.open()
        valor = serialPort.read(4).decode("utf-8")
    #a = random.randint(1,101)
        print(valor)
        serialPort.close()
    return HttpResponse(valor)

def fechaPorta(request):
    #serialPort.close()
    print(serialPort.isOpen())
    return HttpResponse(1)


#Verifica se a porta esta aberta
#serialPort.isOpen()

#Le da porta -> passa numero de bytes a serem lidos como parametro


#print(valor.decode("utf-8"))




#serialPort.open()




#serialPort.close()
