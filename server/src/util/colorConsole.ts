const logCyan = (x: any) => console.log('\x1b[36m%s\x1b[0m', x);
const logGreen = (x: any) => console.log('\x1b[32m%s\x1b[0m', x);
const logRed = (x: any) => console.log('\x1b[31m%s\x1b[0m', x);
const logBlue = (x: any) => console.log('\x1b[34m%s\x1b[0m', x);

export {
  logCyan,
  logGreen,
  logRed,
  logBlue
}