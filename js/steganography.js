// EVEN NUMBER = 0
// ODD NUMBER = 1
const watermark = "KOSBD2021";

function encode(imgData, message, encodingFormat, status) {
  if (imgData.width < 3) {
    status.textContent = "Error: The image width is too small.";
    return;
  }

  if (imgData.height < 3) {
    status.textContent = "Error: The image height is too small.";
    return;
  }

  var totalRGBPixels = imgData.width * imgData.height * 3;
  var binaryLength = Number(totalRGBPixels).toString(2).length;

  var encodedMsgInBinary = encodeMessage(message, encodingFormat);
  var encodedWatermarkInBinary = encodeMessage(watermark, encodingFormat);

  encodeWatermarkToImg(imgData, watermark);

  encodeMessageLengthToImg(imgData, encodedMsgInBinary.length);

  encodeMessageToImg(imgData, encodedMsgInBinary);

  return true;
}

function decode(imgData, encodingFormat, progressBar) {
  var binaryMsgLen = decodeMessageLengthFromImg(imgData);

  var decodedMsgFromImgInBinary = decodeMessageFromImg(imgData, binaryMsgLen);

  var decodedMsg = decodeMessage(
    toUint8Array(decodedMsgFromImgInBinary),
    encodingFormat
  );
  return decodedMsg;
}

function encodeWatermarkToImg(imgData, wMark) {}

function encodeMessageLengthToImg(imgData, msgLengthBinary) {
  var totalRGBPixels = imgData.width * imgData.height * 3;
  var binaryLength = Number(totalRGBPixels).toString(2).length;

  var msgLength = Number(msgLengthBinary).toString(2);
  var binaryLengthPadding = binaryPadding(binaryLength);

  msgLength = binaryLengthPadding.substr(msgLength.length) + msgLength;

  var offset = 0;
  var counter = 1;

  for (let i = 0; i < msgLength.length; i++) {
    imgData.data[i + offset] += applyOddEvenRule(
      parseInt(msgLength.charAt(i)),
      imgData.data[i + offset]
    );
    if (counter % 3 == 0) offset++;
    counter++;
  }
}

function decodeMessageLengthFromImg(imgData) {
  var totalRGBPixels = imgData.width * imgData.height * 3;
  var binaryLength = Number(totalRGBPixels).toString(2).length;

  var msgLengthBinary = "";

  var offset = 0;
  var counter = 1;

  for (let i = 0; i < binaryLength; i++) {
    msgLengthBinary = msgLengthBinary.concat(
      getBitByOddEvenRule(imgData.data[i + offset]).toString()
    );
    if (counter % 3 == 0) offset++;
    counter++;
  }

  return parseInt(msgLengthBinary, 2);
}

function encodeMessageToImg(imgData, binaryMsg) {
  var totalRGBPixels = imgData.width * imgData.height * 3;
  var binaryLength = Number(totalRGBPixels).toString(2).length;
  binaryLength += Math.floor(binaryLength / 3);

  var start =
    binaryLength % 4 == 0 ? binaryLength : binaryLength + (binaryLength % 4);

  var offset = 0;
  var counter = 1;

  for (let i = start; i < binaryMsg.length + start; i++) {
    imgData.data[i + offset] += applyOddEvenRule(
      parseInt(binaryMsg.charAt(i - start)),
      imgData.data[i + offset]
    );
    if (counter % 3 == 0) offset++;
    counter++;
  }
}

function decodeMessageFromImg(imgData, binaryMsgLength) {
  var totalRGBPixels = imgData.width * imgData.height * 3;
  var binaryLength = Number(totalRGBPixels).toString(2).length;
  binaryLength += Math.floor(binaryLength / 3);

  var start =
    binaryLength % 4 == 0 ? binaryLength : binaryLength + (binaryLength % 4);

  var decodedMsgInBinary = "";

  var offset = 0;
  var counter = 1;

  for (let i = start; i < binaryMsgLength + start; i++) {
    decodedMsgInBinary = decodedMsgInBinary.concat(
      getBitByOddEvenRule(imgData.data[i + offset]).toString()
    );
    if (counter % 3 == 0) offset++;
    counter++;
  }

  return decodedMsgInBinary;
}

function encodeMessage(message, encodingFormat) {
  const encoder = new TextEncoder(encodingFormat);
  const view = encoder.encode(message);

  var binaryStr = toBinaryStr(view);

  return binaryStr;
}

function decodeMessage(encodedMsg, encodingFormat) {
  const decoder = new TextDecoder(encodingFormat);
  return decoder.decode(encodedMsg);
}

function toBinaryStr(input) {
  var ret = "";

  input.forEach((element) => {
    var n = Number(element).toString(2);
    n = "00000000".substr(n.length) + n;
    ret = ret.concat(n);
  });

  return ret;
}

function toUint8Array(binary) {
  var bytes = binary.length / 8;
  ret = new Uint8Array(bytes);

  for (let i = 0; i < bytes; i++) {
    var binaryStr = binary.substring(i * 8, i * 8 + 8);
    var digit = parseInt(binaryStr, 2);
    ret[i] = digit;
  }

  return ret;
}

function binaryPadding(length) {
  var ret = "";
  for (let i = 0; i < length; i++) {
    ret = ret.concat("0");
  }
  return ret;
}

function applyOddEvenRule(source, target) {
  if (source == 0) {
    if (target % 2 == 0) return 0;
    else return target - 1 < 0 ? +1 : -1;
  } else {
    if (target % 2 != 0) return 0;
    else return target - 1 < 0 ? +1 : -1;
  }
}

function getBitByOddEvenRule(target) {
  if (target % 2 == 0) return 0;
  else return 1;
}
