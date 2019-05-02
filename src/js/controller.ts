import * as ColorUtils from './color';

export enum MODE {
  CHOOSE,
  CASCADE,
  PALETTE,
  CASCADE_PALLETTE,
  RAINBOW,
}

type Command = 'rainbow' | 'all' | 'cascade';
export interface Payload {
  command: Command;
  color?: ColorUtils.Color;
}

export const MODE_OPTIONS = [
  {
    name: 'Rainbow',
    value: MODE.RAINBOW,
  },
  {
    name: 'Choose a Color',
    value: MODE.CHOOSE,
  },
  {
    name: 'Cascade a Color',
    value: MODE.CASCADE,
  },
  {
    name: 'Choose a Palette',
    value: MODE.PALETTE,
  },
  {
    name: 'Cascade a Palette',
    value: MODE.CASCADE_PALLETTE,
  },
];

interface Options {
  deltaMs: number;
  nSteps: number;
}
export default class Controller {
  public palette: ColorUtils.Color[] = [];
  private currentColor?: ColorUtils.Color;
  private mode: MODE = MODE.CHOOSE;
  private deltaMs: number;
  private intervalId?: number;
  private nSteps: number;
  private previousPayload?: Payload;

  private startPaletteShift(): void {
    if (this.intervalId) {
      return;
    }

    if (this.palette.length < 1) {
      this.currentColor = {
        red: 0,
        green: 0,
        blue: 0,
      };
    }
    else if (this.palette.length === 1) {
      this.currentColor = this.palette[0];
    }
    else {
      let startIndex = 0;
      let nextIndex = 1;
      let increment = 1;
      let colors = ColorUtils.interpolateColors(this.palette[startIndex], this.palette[nextIndex], this.nSteps);
      let stepIndex = 0;
      this.currentColor = colors[stepIndex++];
      this.intervalId = window.setInterval(() => {
        if (stepIndex >= this.nSteps) {
          startIndex += increment;
          nextIndex += increment;
          if (nextIndex >= this.palette.length) {
            nextIndex = startIndex - 1;
            increment = -1;
          }
          else if (nextIndex < 0) {
            nextIndex = startIndex + 1;
            increment = 1;
          }
          colors = ColorUtils.interpolateColors(this.palette[startIndex], this.palette[nextIndex], this.nSteps);
          stepIndex = 0;
        }
        this.currentColor = colors[stepIndex++];
      }, this.deltaMs);
    }
  }
  
  public constructor({ deltaMs, nSteps }: Options) {
    this.deltaMs = deltaMs;
    this.nSteps = nSteps;
    this.mode = MODE.RAINBOW;
    this.currentColor = {
      red: 0,
      green: 0,
      blue: 0,
    };
  }

  public handleColorChange(color: ColorUtils.Color): void {
    switch (this.mode) {
      case MODE.CHOOSE:
      case MODE.CASCADE: {
        this.currentColor = color;
        break;
      }
      case MODE.PALETTE:
      case MODE.CASCADE_PALLETTE: {
        if (!ColorUtils.equals(color, this.palette.slice(-1)[0])) {
          this.palette.push(color);
          this.startPaletteShift();
        }
        break;
      }
      case MODE.RAINBOW: {
        break;
      }
      default: {
        throw new Error(`Unknown mode: ${this.mode}`);
      }
    }
  }

  public setMode(mode: MODE): void {
    if (this.mode !== mode) {
      if (
        mode === MODE.PALETTE
        || mode === MODE.CASCADE_PALLETTE
      ) {
        this.clearPalette();
      }
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
      this.mode = mode;
    }
  }

  public getMode(): MODE {
    return this.mode;
  }

  public clearPalette() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
    this.palette = [];
  }

  public getPayload(): Payload | undefined {
    let payload: Payload | undefined;
    switch (this.mode) {
      case MODE.RAINBOW:
        payload = {
          command: 'rainbow',
        };
        break;
      case MODE.CHOOSE:
      case MODE.CASCADE:
        payload = {
          command: (this.mode === MODE.CHOOSE) ? 'all' : 'cascade',
          color: this.currentColor,
        };
        break;
      case MODE.PALETTE:
      case MODE.CASCADE_PALLETTE:
        payload = {
          command: (this.mode === MODE.PALETTE) ? 'all' : 'cascade',
          color: this.currentColor,
        };
        break;
      default:
        // no-op
    }

    if (
      this.previousPayload && payload
      && this.previousPayload.command === payload.command
      && ColorUtils.equals(this.previousPayload.color, payload.color)
    ) {
      return undefined;
    }
    
    this.previousPayload = payload;
    return payload;
  }
}
