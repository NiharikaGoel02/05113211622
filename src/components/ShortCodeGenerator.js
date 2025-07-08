export const generateShortcode = (existingCodes, length = 6) => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  do {
    code = Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
  } while (existingCodes.includes(code));
  return code;
};
