export const base64StringtoFile = (base64String: string, filename: string) => {
  let arr = base64String.split(",");
  let mime = "";
  if (arr && arr.length > 0) {
    let m = arr[0].match(/:(.*?);/);
    if (m) {
      mime = m[1];
    }
  }

  let bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const cropAndConvertToBase64 = (
  pixelCrop: any,
  imageFile: HTMLImageElement | null
) => {

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");

  if (imageFile !== null) {
    const scaleX = imageFile.naturalWidth / imageFile.width;
    const scaleY = imageFile.naturalHeight / imageFile.height;
    ctx &&
      ctx.drawImage(
        imageFile,
        pixelCrop.x * scaleX,
        pixelCrop.y * scaleY,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
  }

  // As Base64 string
  return canvas.toDataURL("image/jpeg");
};
