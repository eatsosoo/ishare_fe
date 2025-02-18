export function convertStringToArray(commaSeparatedString: string): string[] {
  return commaSeparatedString.split(',').map((item) => item.trim());
}

export function convertArrayToString(array: string[]): string {
  return array.join(',');
}

export function getLeftValue(value: string): string {
  return value.split(' ')[0];
}

export function getRightValue(value: string): string {
  return value.split(' ')[0];
}
