import CryptoJS from "crypto-js";

export const uintArrayToBase64 = (arr: Uint8Array) => {
  return Buffer.from(arr).toString("base64");
};

export const encryptAES = (data: string, password: string) => {
  const initializationVector = new Uint8Array(128);
  window.crypto.getRandomValues(initializationVector);

  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Base64.parse(data),
    password,
    { iv: CryptoJS.enc.Base64.parse(uintArrayToBase64(initializationVector)) }
  );

  const ct = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  const iv = encrypted.iv.toString(CryptoJS.enc.Hex);
  const s = encrypted.salt.toString(CryptoJS.enc.Hex);

  // 2 Bytes - 4 len
  const saltLength = s.length.toString(16).padStart(4, "0");
  // 2 Bytes - 4 len
  const ivLength = iv.length.toString(16).padStart(4, "0");

  const encryptedData = ivLength + saltLength + iv + s + ct;

  return encryptedData;
};

export const decryptAES = (data: string, password: string) => {
  let offset = 0;
  const ivLength = parseInt(data.slice(offset, offset + 4), 16);
  offset += 4;
  const saltLength = parseInt(data.slice(offset, offset + 4), 16);
  offset += 4;

  const iv = data.slice(offset, offset + ivLength);
  offset += ivLength;
  const salt = data.slice(offset, offset + saltLength);
  offset += saltLength;

  const ct = data.slice(offset);

  const encrypted = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(ct),
    iv: CryptoJS.enc.Hex.parse(iv),
    salt: CryptoJS.enc.Hex.parse(salt),
  });

  const decrypted = CryptoJS.AES.decrypt(encrypted, password);

  return decrypted.toString(CryptoJS.enc.Base64);
};
