export interface Color {
  red: number;
  green: number;
  blue: number;
  alpha?: number;
}

export function toString(color: Color): string {
  if (
    Object.prototype.hasOwnProperty.call(color, 'alpha')
    && color.alpha !== undefined
  ) {
    return `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
  }
  else {
    return `rgb(${color.red}, ${color.green}, ${color.blue})`;
  }
}

export function reduce(
  reducer: (reduction: number, channel: number) => number,
  initialColor: Color,
  ...colors: Color[]
): Color {
  const color = colors.reduce(
    (reduction, color) => {
      reduction.red = reducer(reduction.red, color.red);
      reduction.green = reducer(reduction.green, color.green);
      reduction.blue = reducer(reduction.blue, color.blue);
      if (
        reduction.hasOwnProperty('alpha')
        || color.hasOwnProperty('alpha')
      ) {
        reduction.alpha = reducer(
          reduction.alpha || 0,
          color.alpha || 0
        );
      }
      return reduction;
    },
    initialColor
  );
  return color;
}

export function interpolateColor(start: Color, end: Color, factor: number): Color {
  return reduce(
    (reduction, channel) => 
      Math.round(reduction + factor * (channel - reduction)),
    { ...start },
    { ...end }
  );
}

export function interpolateColors(start: Color, end: Color, nSteps: number): Color[] {
  const stepFactor = 1 / (nSteps - 1);
  const colors = [];

  for(let i = 0; i < nSteps; i++) {
    colors.push(interpolateColor(start, end, stepFactor * i));
  }

  return colors;
}

type Direction = 'down' | 'up' | 'left' | 'right';
export function toLinearGradient(direction: Direction, colors: Color[]) {
  const colorStrings = colors.map(toString);
  if (direction !== 'down') {
    colorStrings.unshift(`to  ${direction}`);
  }
  return `linear-gradient(${colorStrings.join(',')})`;
}

export function equals(color1?: Color, color2?: Color): boolean {
  if (!color1 && !color2) {
    return true;
  }
  else if (!color1) {
    return false
  }
  else if (!color2) {
    return false;
  }
  else if (color1.red !== color2.red) {
    return false;
  }
  else if (color1.green !== color2.green) {
    return false;
  }
  else if (color1.blue !== color2.blue) {
    return false;
  }
  else if (
    Object.prototype.hasOwnProperty.call(color1, 'alpha')
    && Object.prototype.hasOwnProperty.call(color2, 'alpha')
    && color1.alpha !== color2.alpha
  ) {
    return false;
  }
  else {
    return true;
  }
}
