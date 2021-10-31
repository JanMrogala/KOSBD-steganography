// EVEN NUMBER = 0
// ODD NUMBER = 1

function encode(imgData, message, encodingFormat, progressBar) {
  var encodedMsgInBinary = encodeMessage(message, encodingFormat);

  encodeMessageLengthToImg(imgData, encodedMsgInBinary.length);

  encodeMessageToImg(imgData, encodedMsgInBinary);
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

// function addWatermark(imgData, watermarkTxt) {}

function encodeMessageLengthToImg(imgData, msgLengthBinary) {
  var totalRGBPixels = imgData.width * imgData.height * 3;
  var binaryLength = Number(totalRGBPixels).toString(2).length;

  var msgLength = Number(msgLengthBinary).toString(2);
  var binaryLengthPadding = binaryPadding(binaryLength);

  msgLength = binaryLengthPadding.substr(msgLength.length) + msgLength;

  console.log("msgLength", msgLength, parseInt(msgLength, 2), msgLength.length);

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

  console.log(
    "decodeMessageLengthFromImg",
    msgLengthBinary,
    parseInt(msgLengthBinary, 2),
    msgLengthBinary.length
  );

  return parseInt(msgLengthBinary, 2);
}

function encodeMessageToImg(imgData, binaryMsg) {
  var totalRGBPixels = imgData.width * imgData.height * 3;
  var binaryLength = Number(totalRGBPixels).toString(2).length;
  binaryLength += Math.floor(binaryLength / 3);

  console.log("encode starting index", binaryLength);

  //TODO: encoding must start knowing where alpha channel is, same with decoding

  var offset = 0;
  var counter = 1;

  for (let i = 0; i < binaryMsg.length; i++) {
    imgData.data[i + binaryLength + offset] += applyOddEvenRule(
      parseInt(binaryMsg.charAt(i)),
      imgData.data[i + binaryLength + offset]
    );
    if (counter % 3 == 0) offset++;
    counter++;
  }
}

function decodeMessageFromImg(imgData, binaryMsgLength) {
  var totalRGBPixels = imgData.width * imgData.height * 3;
  var binaryLength = Number(totalRGBPixels).toString(2).length;
  binaryLength += Math.floor(binaryLength / 3);

  var decodedMsgInBinary = "";

  console.log("binaryMsgLength", binaryMsgLength);

  var offset = 0;
  var counter = 1;

  for (let i = binaryLength; i < binaryMsgLength + binaryLength; i++) {
    decodedMsgInBinary = decodedMsgInBinary.concat(
      getBitByOddEvenRule(imgData.data[i + offset]).toString()
    );
    if (counter % 3 == 0) offset++;
    counter++;
  }
  console.log("decoded msg length", decodedMsgInBinary.length);
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
