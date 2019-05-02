import { Color } from './color';

function getCoordinatesFromMouseEvent(event: MouseEvent): { x: number, y: number } {
  return {
    x: event.offsetX,
    y: event.offsetY,
  };
}

function getCoordinatesFromTouchEvent(event: TouchEvent): { x: number, y: number } {
  const target = event.target as HTMLCanvasElement;
  const { left, top } = target.getBoundingClientRect();
  const { pageX, pageY } = event.targetTouches[0];
  return {
    x: pageX - left,
    y: pageY - top,
  };
}

interface Options {
  canvas: HTMLCanvasElement;
  imageSrc: string;
  onColorChange: (color: Color) => void;
  changeOnRelease?: boolean;
}

export default class ColorPicker {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null = null;
  private promiseForImage: Promise<HTMLImageElement>;
  private onColorChange: (color: Color) => void;
  private dragging: boolean = false;
  private changeOnRelease: boolean = false;

  private addEventListeners() {
    // Window events
    window.addEventListener('resize', () => this.drawCanvas());

    // Mouse events
    this.canvas.addEventListener('mousedown', (event) => {
      this.dragging = true;
      if (!this.changeOnRelease) {
        this.changeColor(getCoordinatesFromMouseEvent(event));
      }
    });
    this.canvas.addEventListener('mousemove', (event) => {
      if (this.dragging && !this.changeOnRelease) {
        this.changeColor(getCoordinatesFromMouseEvent(event));
      }
    });
    this.canvas.addEventListener('mouseup', (event) => {
      if (this.changeOnRelease) {
        this.changeColor(getCoordinatesFromMouseEvent(event));
      }
      this.dragging = false;
    });

    // Touch events
    this.canvas.addEventListener('touchstart', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.dragging = true;
      if (!this.changeOnRelease && event.targetTouches.length) {
        this.changeColor(getCoordinatesFromTouchEvent(event));
      }
    });
    this.canvas.addEventListener('touchmove', (event) => {
      event.stopPropagation();
      if (this.dragging && !this.changeOnRelease && event.targetTouches.length) {
        this.changeColor(getCoordinatesFromTouchEvent(event));
      }
    });
    this.canvas.addEventListener('touchcancel', () => {
      this.dragging = false;
    });
    this.canvas.addEventListener('touchend', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (this.changeOnRelease && event.targetTouches.length) {
        this.changeColor(getCoordinatesFromTouchEvent(event));
      }
      this.dragging = false;
    });
  }

  public async drawCanvas(): Promise<void> {
    const parent = this.canvas.parentElement;
    if (!parent) {
      throw new Error('Could not find parent element');
    }
    const size = Math.min(parent.offsetHeight, parent.offsetWidth);
    this.canvas.width = size - 30;
    this.canvas.height = size - 30;
    this.context = this.canvas.getContext('2d');
    if (this.context) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const image = await this.promiseForImage;
      this.context.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    }
  }

  private changeColor({ x, y }: { x: number, y: number }): void {
    if (this.context) {
      const colorData = this.context.getImageData(x, y, 1, 1).data;
      this.onColorChange({
        red: colorData[0],
        green: colorData[1],
        blue: colorData[2],
      });
    }
  }

  public constructor({ canvas, imageSrc, onColorChange, changeOnRelease }: Options) {
    this.canvas = canvas;
    this.promiseForImage = new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        resolve(image);
      };
      image.onerror = () => {
        reject(`Could not load ${imageSrc}`);
      };
      image.src = imageSrc;
    });
    this.onColorChange = onColorChange;
    this.changeOnRelease = !!changeOnRelease;
    this.drawCanvas();
    this.addEventListeners();
  }

  public setChangeOnRelease(changeOnRelease: boolean) {
    this.changeOnRelease = changeOnRelease;
  }
}
