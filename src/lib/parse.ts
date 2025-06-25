export function parseStringfy(value: { [key: string]: string }) {
  return JSON.parse(JSON.stringify(value));
}
