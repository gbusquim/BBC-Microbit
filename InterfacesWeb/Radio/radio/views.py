from django.shortcuts import render
from django.http import HttpResponse 
from django.views.decorators.csrf import csrf_protect
import serial
import random
import os


serialPort = serial.Serial("com3",115200,timeout = 1)

# Create your views here.

def HomeRadio(request):
   
    return render(request,'home.html')

def EscreveRequest(request):

    valor = request.POST.get("message")
    print(valor)

    serialPort.write(valor.encode('utf-8'))

    return HttpResponse("success")

def trataRequest(request):
    valor = ''
    valor = serialPort.read(50).decode("utf-8")
    return HttpResponse(valor)
