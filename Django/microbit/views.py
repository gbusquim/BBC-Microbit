from django.shortcuts import render
from django.http import HttpResponse 
from django.views.decorators.csrf import csrf_protect
import serial
import random


serialPort = serial.Serial('com3',115200,timeout = 0.6)
serialPort.close()
# Create your views here

def Home(request):
    return render(request,'jogo.html')

def Terminal(request):
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
        valor = serialPort.read(1).decode("utf-8")
        #valor = serialPort.read(4).decode("utf-8")
    #a = random.randint(1,101)
        print(valor)
        serialPort.close()
    return HttpResponse(valor)

def EscreveRequest(request):
    if not serialPort.isOpen():
        serialPort.open()
    valor = request.POST.get("message")
    serialPort.write(valor.encode('utf-8'))
#a = random.randint(1,101)
    serialPort.close()
    return HttpResponse("success")


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
