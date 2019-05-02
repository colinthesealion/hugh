#include <Bridge.h>
#include <FileIO.h>
#include <YunClient.h>
#include <YunServer.h>
#include <Adafruit_NeoPixel.h>

#define NPIXELS 150
#define LED_PIN 2
#define PORT 12345
#define FRAMERATE 30
#define DEBUG false

Adafruit_NeoPixel strip(NPIXELS, LED_PIN, NEO_GRB + NEO_KHZ800);

static char Colors[4] = "RGB";
String CurrentMode = "RAINBOW";
String PreviousMode = CurrentMode;
uint16_t ModeIndex = 0;

YunServer server(PORT);

void setup () {
	// Start up serial communication
	Serial.begin(115200);
  
	// Start up bridge communication
	Bridge.begin();

	// Start up filesystem
	if (DEBUG) {
		FileSystem.begin();
	}

	// Start up YunServver
	server.listenOnLocalhost();
	server.begin();

	// Start up light strip
	strip.begin();
	strip.show();        

	// Start the python proxy server for relaying from internet via atheros to atmel
	//Process p;
	//p.runShellCommandAsynchronously("PYTHONPATH=/mnt/sda1/pywebsocket-read-only/src/ /mnt/sda1/bin/hughproxy.sh | /mnt/sda1/colorize.py -f red >> /mnt/sda1/hugh.log");
}
  
void loop () {
	// Check for new clients
	YunClient client = server.accept();

	// While connected to the client...
	if (client && client.connected()) {
		Log("Connected to a client");
		//client.setTimeout(5);
		while (client && client.connected()) {
			// If there is incoming data from the client...
			if (client.available()) {
				// Switch to listen mode
				if (CurrentMode != "LISTEN") {
					PreviousMode = CurrentMode;
					CurrentMode = "LISTEN";
				}

				// Check for command in message
				String message = client.readStringUntil('[');
				if (message == "PIXEL") {
					Log("got pixel");
          
					// Get the pixel
					uint8_t i;
					if (client.read() == 'i') {
						i = client.parseInt();
					}
					uint8_t rgb[3];
					boolean fullpixel = true;
					for (uint8_t j = 0; j < 3 && client.available(); j++) {
						if (client.read() == Colors[j]) {
							rgb[j] = client.parseInt();
						}
						else {
							fullpixel = false;
							break;
						}
					}
          
					if (fullpixel) {
						// Set pixel i to color (r, g, b)
						Log(String(i) + " " + String(rgb[0]) + " " + String(rgb[1]) + " " + String(rgb[2]));
						strip.setPixelColor(i++, strip.Color(rgb[0], rgb[1], rgb[2]));
					}
          
					if (i == NPIXELS) {
						strip.show();
					}
				}
				else if (message == "MODE") {
					PreviousMode = CurrentMode;
					ModeIndex = 0;
					CurrentMode = client.readStringUntil(']');
				}
				else {
					Log(message);
				}
      
				// Clear out any remaining characters from the message
				message = client.readStringUntil('\n');
			}
			else {
				ExecuteOneFrameOfCurrentMode();
			}
		}
  
		// Stop communicating with disconnected client
		client.stop();
	}
	else {
		// There is no connected client, we wait a second for a new client
		// In the meantime, execute a few frames of the current mode
    
		// We don't have a client, and thus there is nothing to listen to
		// So if the current mode is LISTEN, we switch to the previous mode
		if (CurrentMode == "LISTEN") {
			CurrentMode = PreviousMode;
			ModeIndex = 0;
		}
    
		// Execute 1 second worth of frames
		for (int i = 0; i < FRAMERATE; i++) {
			ExecuteOneFrameOfCurrentMode();
		}
	}
}

// As the name implies, execute one frame
void ExecuteOneFrameOfCurrentMode() {
	if (CurrentMode == "LISTEN") {
		// No-op
	}
	else {
		if (CurrentMode == "RAINBOW") {
			Rainbow();
		}
		// TODO: Other options
		else {
			// TODO: Tell the user that they sent an invalid mode
		}
		strip.show();
  
		// Increment the index
		ModeIndex++;
	}
  
	// And wait
	delay(1000 / FRAMERATE);
}

// Cycles through the 384 colors of the wheel
void Rainbow() {
	for (uint16_t i = 0; i < NPIXELS; i++) {
		strip.setPixelColor(i, Wheel((i + ModeIndex) % 384));
	}
}

// Input a value 0 to 384, get a color value
// Colors are a transition r - g - b - back to r
uint32_t  Wheel(uint16_t p) {
	byte r, g, b;
	switch (p / 128) {
	case 0:
		r = 127 - p % 128;
		g = p % 128;
		b = 0;
		break;
	case 1:
		r = 0;
		g = 127 - p % 128;
		b = p % 128;
		break;
	case 2:
		r = p % 128;
		g = 0;
		b = 127 - p % 128;
		break;
	}
  
	return strip.Color(r, g, b);
}

void Log(String message) {
	if (DEBUG) {
		Process p;
		p.runShellCommandAsynchronously("/bin/echo " + message + " | /mnt/sda1/colorize.py -f blue >> /mnt/sda1/hugh.log");
	}
}
