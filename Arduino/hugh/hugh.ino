#include <Adafruit_NeoPixel.h>
#include <Bridge.h>
#include <Console.h>

#define N_PIXELS 150
#define LED_PIN 13
#define DEBUG true
#define debug(X) if (DEBUG) Console.print(X)
#define debugln(X) if (DEBUG) Console.println(X)
#define FRAME_RATE 200

Adafruit_NeoPixel strip(N_PIXELS, LED_PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  // Initialize the LED strip
  strip.begin();
  uint32_t red = strip.Color(0, 255, 0);
  for (uint8_t i = 0; i < N_PIXELS; i++) {
    strip.setPixelColor(i, red);
  }
  strip.show();

  // Wait for linux boot to complete
  Serial1.begin(115200);
  do {
    while (Serial1.available() > 0) {
      Serial1.read();
    }
    delay(1000);
  } while (Serial1.available() > 0);

  // Initialize console
  Bridge.begin();
  Console.begin();
  while (!Console);
  debugln("You're connected to the Console!!!!");
}

String mode = "RAINBOW";
void loop() {
  if (Console.available()) {
    processConsole();
  }
  else if (mode == "RAINBOW") {
    rainbow();
  }
  delay(1000 / FRAME_RATE);
}

void processConsole() {
  String command = Console.readStringUntil(' ');
  debugln("Got command " + command);
  if (command == "rainbow") {
    startRainbow();
    Console.readStringUntil('\n');
    return;
  }

  int r = Console.parseInt();
  int g = Console.parseInt();
  int b = Console.parseInt();
  if (command == "all") {
    showAll(r, g, b);
  }
  else if (command == "cascade") {
    cascade(r, g, b);
  }
  Console.readStringUntil('\n');
}

void startRainbow() {
  mode = "RAINBOW";
  debugln("Entering the rainbow");
  rainbow();
}

void showAll(int r, int g, int b) {
  mode = "INTERACTIVE";
  debug("Set all pixels to rgb(");
  debug(r); debug(","); debug(g); debug(","); debug(b);
  debugln(")");
  uint32_t color = strip.Color(g, r, b);
  for (int i = 0; i < N_PIXELS; i++) {
    strip.setPixelColor(i, color);
  }
  strip.show();
}

void cascade(int r, int g, int b) {
  mode = "INTERACTIVE";
  debug("Cascade rgb(");
  debug(r); debug(","); debug(g); debug(","); debug(b);
  debugln(")");
  uint32_t color = strip.Color(g, r, b);
  for (int i = N_PIXELS - 1; i > 0; i--) {
    strip.setPixelColor(i, strip.getPixelColor(i - 1));
  }
  strip.setPixelColor(0, color);
  strip.show();
}

void rainbow() {
  static long firstPixelHue = 0;
  for (int i = 0; i < N_PIXELS; i++) { // For each pixel in strip...
    // Offset pixel hue by an amount to make one full revolution of the
    // color wheel (range of 65536) along the length of the strip
    // (strip.numPixels() steps):
    int pixelHue = firstPixelHue + (i * 65536L / N_PIXELS);
    // strip.ColorHSV() can take 1 or 3 arguments: a hue (0 to 65535) or
    // optionally add saturation and value (brightness) (each 0 to 255).
    // Here we're using just the single-argument hue variant. The result
    // is passed through strip.gamma32() to provide 'truer' colors
    // before assigning to each pixel:
    strip.setPixelColor(i, strip.gamma32(strip.ColorHSV(pixelHue)));
  }
  strip.show();
  firstPixelHue = (firstPixelHue + 256) % (5 * 65536);
}
