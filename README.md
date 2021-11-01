# KOSBD-steganography

## Návod (basic flow):

- Obrázek uživatel načte tím, že jej zvolí buď pomocí tlačítka _SELECT IMAGE_, nebo přetažením souboru do vyznačené _drag-n-drop_ oblasti.
- **Zakódování textu**:
  - Do zvoleného obrázku lze zakódovat libovolný text (je použito utf-8 kódování), který uživatel napíše do textového pole pod obrázkem.
  - Uživatel potvrzuje tlačítkem _ENCODE_, což informaci do obrázku zakóduje a následně upravený obrázek uloží na uživatelovo PC (obyčejně do **Stažených souborů**, soubor je pojmenován stejně jako originální, ale s předponou _encoded_).
- **Dekódování textu**:
  - _pozn._ Program algoritmicky nezjišťuje, zda obrázek obsahuje zakódovanou zprávu, či nikoli. Uživatel musí určit, zda dekódovaná zpráva dává smysl.
  - Uživatel potvrzuje dekódování tlačítkem _DECODE_.
  - V textové oblasti pod obrázkem se objeví dekódovaný text.

# Princip zakódování textu do obrázku:

Jelikož se snažíme o co nejmenší narušení vzhledu obrázku, je třeba vymyslet šetrný způsob, jak informaci zakódovat. To, že je informace zakódována v binárním tvaru, nám umožňuje vymyslet jednoduché pravidlo, podle kterého dokážeme konkrétní bit zakódovat i dekódovat.
Nabízí se možnost pracovat se **sudými** a **lichými** čísly. Řekněme, že sudé číslo pro nás bude reprezentovat bit _0_ a liché bit _1_. Na základě tohoto pravidla již není problém _reprezentovat_ bit v konkrétní číselné hodnotě v obrázku. Mějme například hodnotu kanálu RGB 200 0 41. Pokud bychom použili zmíněné pravidlo, tak z tohoto pixelu přečteme bitovou sekvenci _001_. Znamená to, že k vložení bitu do čísla, nám stačí dané číslo změnit pouze o _1_, respektive občas jej vůbec měnit nemusíme. Takto dokážeme zakódovat binární reprezentaci zprávy do obrázku.
Ovšem k dekódování zprávy nám chybí znalost o její délce. Nechceme dekódovat celý _velký_ obrázek, když zpráva se nachází např. v prvních 100 pixelech. To znamená, že do obrázku zakódujeme také informaci o její délce. Tato informace se bude vždy nacházet na začátku obrázku a _její_ délku zjistíme tak, že vezmeme celkový počet pixelů ( 3(kanály) x výška x šířka obrázku, tato informace je nám vždy známa), a toto číslo vyjádříme binárně. Následně stačí vzít délku tohoto binárního čísla a do tohoto rozsahu vložit informaci o velikosti zakódované zprávy.
Pomocí výše zmíněných pravidel jsme schopni zakódovat zprávu. Možným vylepšením tohoto programu by mohlo být přidání sekvence znaků, podle kterých bychom byli schopni identifikovat, který obrázek zprávu obsahuje, a který ne. V tuhle chvíli je možné _dekódovat_ jakýkoli obrázek a je na uživateli aby poznal, zda je dekódovaný text pouze náhodným pomícháním znaků, či se jedná o plnohodnotnou zprávu.

## Dokumentace zásadních funkcí v programu

funkce _encodeMessageLengthToImg_ se stará o zakódování informace o délce zprávy do obrázku.

- **vstup:** obrazové data, délka zprávy v binárním tvaru
- **výstup:** null

```
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
```

funkce _decodeMessageLengthFromImg_ se stará o dekódování informace o délce zprávy z obrázku.

- **vstup:** obrazové data
- **výstup:** délka zakódovaného textu

```
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
```

funkce _encodeMessageToImg_ se stará o zakódování textu do obrázku.

- **vstup:** obrazové data, zpráva v binárním tvaru
- **výstup:** null

```
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
```

funkce _decodeMessageFromImg_ se stará o dekódování textu z obrázku.

- **vstup:** obrazové data, délka zprávy v binárním tvaru
- **výstup:** dekódovaná zpráva v binárním tvaru

```
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
```

funkce _encodeMessage_ se stará o zakódování textu.

- **vstup:** zpráva, kódovací formát (utf-8)
- **výstup:** zakódovaná zpráva v binárním tvaru

```
    function encodeMessage(message, encodingFormat) {
      const encoder = new TextEncoder(encodingFormat);
      const view = encoder.encode(message);

      var binaryStr = toBinaryStr(view);

      return binaryStr;
    }
```

funkce _decodeMessage_ se stará o dekódování textu.

- **vstup:** zakódovaná zpráva, kódovací formát (utf-8)
- **výstup:** dekódovaná zpráva

```
    function decodeMessage(encodedMsg, encodingFormat) {
      const decoder = new TextDecoder(encodingFormat);
      return decoder.decode(encodedMsg);
    }
```

funkce _applyOddEvenRule_ se stará o aplikaci pravidla zakódování bitu do sudého/lichého čísla.

- **vstup:** vstupní bit (0/1), vstupní celé číslo (0 - 255)
- **výstup:** hodnota (-1, 0, +1), kterou přičteme k vstupnímu celému číslu pro zakódování bitu

```
    function applyOddEvenRule(source, target) {
      if (source == 0) {
        if (target % 2 == 0) return 0;
        else return target - 1 < 0 ? +1 : -1;
      } else {
        if (target % 2 != 0) return 0;
        else return target - 1 < 0 ? +1 : -1;
      }
    }
```

funkce _getBitByOddEvenRule_ se stará o získání bitu z čísla na základě pravidla s lichými/sudými čísly.

- **vstup:** číslo (0 - 255)
- **výstup:** bit 0/1

```
    function getBitByOddEvenRule(target) {
      if (target % 2 == 0) return 0;
      else return 1;
    }
```
