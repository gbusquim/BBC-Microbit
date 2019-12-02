from django.shortcuts import render
from django.http import HttpResponse 
from django.views.decorators.csrf import csrf_protect
import serial
import random
import os


serialPort = serial.Serial("com3",115200,timeout = 0.8)
isWriting = False

# Create your views here
def Home(request):
   
    return render(request,'jogo.html')



def trataRequest(request):
    valor = ''
    if isWriting == False:
        valor = serialPort.read(1).decode("utf-8")
    return HttpResponse(valor)

def EscreveRequest(request):
    global isWriting
    isWriting = True
    valor = request.POST.get("message")
    serialPort.write(valor.encode('utf-8'))
    isWriting = False
    return HttpResponse("success")





