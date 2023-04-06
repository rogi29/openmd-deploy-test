export const stringToArray = (value: string) =>
  value.split(',').map((element) => element.trimStart());
