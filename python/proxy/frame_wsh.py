#!/usr/bin/python

from mod_pywebsocket import msgutil
import json
import re
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
            print 'wuh-oh'
            raise e
        pixels = [decode_pixel(p) for p in json.loads(message)]
        send_to_atmel(pixels);

def decode_pixel(pixel):
    match = re.search('rgb\((\d+), (\d+), (\d+)\)', pixel)
    return match.group(1, 2, 3)

def send_to_atmel(pixels):
    message = ""
    for i in range(0, len(pixels)):
        if ((i % 16) == 0):
            message = ""
        message += "PIXEL["
        message += "i" + str(i);
        message += 'R' + pixels[i][0]
        message += 'G' + pixels[i][1]
        message += 'B' + pixels[i][2]
        message += "]\n"
        if ((i % 16) == 15 || i == len(pixels) - 1):
            atmel.send(message)
            print message
