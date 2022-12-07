import fs from 'fs'

var settings = undefined as any
export default function getSecSettings() {
  if (!settings) {
    try {
        const data = fs.readFileSync('settings.json',{encoding:'utf8', flag:'r'});
        settings = JSON.parse(data);
    } catch {
        settings = {
            "JWT_ACCESS_TOKEN_SECRET": "CiHbNFoNGhFZjybkKRQidWRnJdKjdfgcHRTT58jvNTbjaBKCKBwpyCL2LBHsXq77dPHBtmHxuJZCfcnB5S3Mzg4fDmxfC8CEEdq",
            "JWT_REFRESH_TOKEN_SECRET": "N3ozby3DqjT7Zoe94jk4i8p3iedfgpUG9qrRaGzpyEGdHjb9hmEfZmfCgif3jepjk5ECHsfxzEkv53mxexMQoFSyta3oL76Fsr2",
            "JWT_URL_TOKEN_SECRET": "gdQD3NPk38HTvw5T3B2CzrPyRCdJkpdf8NcM4Dg3wucFoqGp8GGB5Dm84nauFaTTyjkWH58mqJKLK6j6pKheFZ8h7j6NNK3uuG",
            "ADMIN_USER": "admin",
            "ADMIN_PASSWORD": "password"
          
          }
        console.log("WARNING: You should create security tokens for your installation")
    }
  }
  return settings
}