export function userFriendlyName(camelCaseString: string) {
  let result = '';
  if (camelCaseString.length === 0) return result;
  result += camelCaseString.charAt(0).toLocaleUpperCase();
  let lastWasLower = false;
  for (let i = 1; i < camelCaseString.length; i++) {
    const curChar = camelCaseString.charAt(i);
    const isLower = curChar === curChar.toLocaleLowerCase();
    const isUpper = curChar === curChar.toLocaleUpperCase();
    if (isUpper && lastWasLower) result += ' ';
    result += curChar;
    lastWasLower = isLower;
  }
  return result;
}
