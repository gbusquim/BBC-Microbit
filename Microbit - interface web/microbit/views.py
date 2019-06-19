from django.shortcuts import render
from django.http import HttpResponse
import serial
import random


serialPort = None
# Create your views here.
def home(request):
    global serialPort
    serialPort = serial.Serial('com3',115200,timeout=1)
    return render(request,'microbit/home.html')

def trataRequest(request):
    valor = serialPort.read(1).decode("utf-8")
    #a = random.randint(1,101)
    print(valor)
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
