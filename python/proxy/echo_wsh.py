from mod_pywebsocket import msgutil
import time

GOODBYEMESSAGE = 'Goodbye'

def web_socket_do_extra_handshake(request):
    print 'Connected.'
    pass  # Always accept.

def web_socket_transfer_data(request):
    while True:
        time.sleep(1)
        try:
            line = msgutil.receive_message(request)
        except Exception, e:
            raise e
        msgutil.send_message(request, line)
        if line == GOODBYEMESSAGE:
            return
