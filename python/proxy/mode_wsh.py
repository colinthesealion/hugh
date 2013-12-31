#!/usr/bin/python

from mod_pywebsocket import msgutil
import socket

PORT = 12345

class Atmel:
    """A class for communicating with the atmel chip on the arduino yun."""
    def __init__(self):
        self.client = socket.socket()
        self.client.connect(('', PORT))
    def send(self, message):
        self.client.send(message)

atmel = Atmel();

def web_socket_do_extra_handshake(request):
    print 'Connected.'
    pass  # Always accept.

def web_socket_transfer_data(request):
    # Listen for data and pass on to atmel
    while True:
        try:
            message = msgutil.receive_message(request)
        except Exception, e:
            print 'Foi com os porcos'
            raise e
        message = "MODE[" + message + "]\n"
        atmel.send(message)
        print message
        
