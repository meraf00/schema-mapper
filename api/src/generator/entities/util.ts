export const stringify = (options: { [key: string]: any }): string | null => {
  const code = [];

  for (let key in options) {
    code.push(`${key}: ${options[key]}`);
  }

  if (code.length > 0) {
    return `{ ${code.join(', ')} }`;
  }
};
