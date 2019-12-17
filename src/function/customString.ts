export function generateRandomString(length = 72) {
  const characters = '12345679ACDEFGHJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let token = '';
  for(let i = 0; i < length; i++) {
    token += characters[Math.floor(Math.random() * (characters.length - 1))];
  }

  return token;
}