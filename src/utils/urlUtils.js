export const generateShortcode = (existing) => {
  let code;
  do {
    code = Math.random().toString(36).substring(2, 8); // generates 6-character shortcode
  } while (existing.includes(code));
  return code;
};
