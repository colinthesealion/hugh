import Arduino from './arduino';
import ColorPicker from './color-picker';
import Controller, { MODE, MODE_OPTIONS, Payload } from './controller';
import * as ColorUtils from './color';

let arduino: Arduino;

function paintRainbow() {
  delete document.body.style.background;
  document.body.style.backgroundImage = ColorUtils.toLinearGradient('down', [
    { red: 255, green:   0, blue:   0 }, // R
    { red: 255, green: 165, blue:   0 }, // O
    { red: 255, green: 255, blue:   0 }, // Y
    { red:   0, green: 255, blue:   0 }, // G
    { red:   0, green:   0, blue: 255 }, // B
    { red: 128, green:   0, blue: 128 }, // P
    { red: 199, green:  21, blue: 133 }, // V
  ]);
}

paintRainbow();

try {
  arduino = new Arduino({
    server: 'hugh.local',
    port: 9998,
    endpoint: 'console',
  });
}
catch (e) {
  console.error('Could not connect to arduino');
}

const deltaMs = 200;

const controller = new Controller({
  deltaMs,
  nSteps: 20,
});

const canvasBlock: HTMLCanvasElement | null = document.querySelector('#color-block');
const canvasStrip: HTMLCanvasElement | null = document.querySelector('#color-strip');
if (!canvasBlock || !canvasStrip) {
  throw new Error('Cannot find canvas in the document');
}
const colorPicker = new ColorPicker({
  canvasBlock,
  canvasStrip,
  imageSrc: 'images/colorwheel3.png',
  onColorChange: (color) => {
    controller.handleColorChange(color);
    if (
      (
        controller.getMode() === MODE.PALETTE
        || controller.getMode() === MODE.CASCADE_PALLETTE
      )
      && controller.palette.length > 1
    ) {
        delete document.body.style.background;
        document.body.style.backgroundImage = ColorUtils.toLinearGradient('down', controller.palette);
    }
    else if (controller.getMode() !== MODE.RAINBOW) {
      delete document.body.style.backgroundImage;
      document.body.style.background = ColorUtils.toString(color);
    }
  },
});

const clearPalette: HTMLDivElement | null = document.querySelector('#clear-palette');
if (clearPalette) {
  clearPalette.addEventListener('click', () => {
    controller.clearPalette();
    delete document.body.style.backgroundImage;
    document.body.style.background = 'black';
  });
}

const dropdownMenu = document.querySelector('.dropdown-menu');
if (dropdownMenu) {
  MODE_OPTIONS.forEach((option) => {
    const menuItem = document.createElement('a');
    menuItem.className = 'dropdown-item';
    menuItem.href = '#';
    menuItem.innerText = option.name;
    menuItem.addEventListener('click', () => {
      controller.setMode(option.value);
      if (option.value === MODE.RAINBOW) {
        paintRainbow();
      }
      else {
        document.body.style.background = 'black';
      }
      if (clearPalette) {
        clearPalette.style.display = (option.value === MODE.PALETTE || option.value === MODE.CASCADE_PALLETTE)
          ? 'block'
          : 'none';
      }
      /*
      colorPicker.setChangeOnRelease(
        option.value === MODE.PALETTE
        || option.value === MODE.CASCADE_PALLETTE
      );
      */
      colorPicker.drawCanvas();
    });
    dropdownMenu.appendChild(menuItem);
  });
}

setInterval(() => {
  colorPicker; // to keep it from getting garbage collected
  const payload = controller.getPayload();
  if (payload) {
    if (arduino && arduino.isAvailable()) {
      arduino.sendData(JSON.stringify(payload));
    }
    else {
      console.log(payload);
    }
  }
}, deltaMs);
