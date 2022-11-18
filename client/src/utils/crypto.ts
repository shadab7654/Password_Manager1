import pbkdf2 from "pbkdf2";
import hkdf from "futoin-hkdf";
import { uintArrayToBase64, encryptAES, decryptAES } from "./encrypt";

const HASH_COUNT = 100000;

export const generateMasterKeys = (email: string, password: string) => {
  return new Promise<{
    masterKey: string;
    streatchedMasterKey: string;
    masterPasswordHash: string;
  }>((resolve, reject) => {
    pbkdf2.pbkdf2(password, email, HASH_COUNT, 256, "sha256", (error, key) => {
      if (error) {
        return reject(error);
      }

      const masterKey = key.toString("base64");

      const derivedKey = hkdf(key, 512, { salt: email, hash: "SHA-256" });
      const streatchedMasterKey = derivedKey.toString("base64");

      pbkdf2.pbkdf2(masterKey, password, 1, 256, "sha256", (error, key) => {
        if (error) {
          return reject(error);
        }

        resolve({
          masterKey,
          masterPasswordHash: key.toString("base64"),
          streatchedMasterKey,
        });
      });
    });
  });
};

export const generateProtectedSymmetricKey = (streatchedMasterKey: string) => {
  const symmetricKey = new Uint8Array(512);
  window.crypto.getRandomValues(symmetricKey);

  return encryptAES(uintArrayToBase64(symmetricKey), streatchedMasterKey);
};

export const decodeProtectedSymmetricKey = (
  protectedSymmetricKey: string,
  streatchedMasterKey: string
) => {
  const decrypted = decryptAES(protectedSymmetricKey, streatchedMasterKey);

  return decrypted;
};

export const encryptVault = (data: any[], password: string) => {
  const encodedData = Buffer.from(JSON.stringify(data), "utf-8").toString(
    "base64"
  );

  return encryptAES(encodedData, password);
};

export const decryptVault = (data: string, password: string) => {
  const encodedData = decryptAES(data, password);
  return JSON.parse(Buffer.from(encodedData, "base64").toString("utf-8"));
};
