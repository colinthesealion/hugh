import telnetlib
import time
import random

print "Connecting..."
arduino = telnetlib.Telnet(host='localhost', port=6571)
print "\tconnected"
print arduino.read_eager()
arduino.write("all 0 0 255\n")
print arduino.read_eager()
time.sleep(5)

for i in range(0,150):
  arduino.write("cascade ")
  for j in range(0, 3):
    arduino.write(str(random.randint(0, 256)))
    arduino.write(" ")
  arduino.write("\n")
  print arduino.read_eager()
  time.sleep(0.2)

print arduino.read_eager()
arduino.write("rainbow \n")
print arduino.read_eager()
arduino.close()
