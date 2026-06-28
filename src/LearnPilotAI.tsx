import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE ────────────────────────────────────────────────
const SUPABASE_URL = "https://yccmepjsepinbxkgvfjg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljY21lcGpzZXBpbmJ4a2d2ZmpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzNDE3NTYsImV4cCI6MjA5NzkxNzc1Nn0.BpkASHBWc2ADJpIa1CzRieQ39M8MOXYCfos_VB90gNY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── CONSTANTS & DATA ────────────────────────────────────────
const LESSONS = {
  python: [
    // ── BEGINNER ──
    { id: "py1", title: "1. Değişkenler & Veri Tipleri", topic: "basics", xp: 50, difficulty: "beginner", description: "int, float, str, bool ve değişken tanımlama",
      content: ["Değişkenler bilgiyi saklar: isim = 'Ali'", "int: tam sayı (5, -3), float: ondalık (3.14)", "str: metin ('merhaba'), bool: True/False", "type() fonksiyonu veri tipini söyler", "Birden fazla atama: a, b = 3, 7"],
      exercise: { prompt: "ad='Ali', yas=25, boy=1.75, ogrenci=True değişkenlerini tanımla. Her birini print ile yazdır.", starter: "# 4 değişken tanımla\n\n# Hepsini yazdır\n", solution: "ad='Ali'\nyas=25\nboy=1.75\nogrenci=True\nprint(ad)\nprint(yas)\nprint(boy)\nprint(ogrenci)", tests: ["Ali","25","1.75","True"] }},

    { id: "py2", title: "2. Sayısal İşlemler", topic: "basics", xp: 50, difficulty: "beginner", description: "Aritmetik operatörler ve matematiksel işlemler",
      content: ["+ toplama, - çıkarma, * çarpma, / bölme", "// tam bölme, % mod (kalan), ** üs alma", "10 // 3 = 3, 10 % 3 = 1, 2 ** 8 = 256", "İşlem önceliği: ** → * / // % → + -", "round(3.14159, 2) → 3.14"],
      exercise: { prompt: "a=17, b=5 tanımla. Toplamını, farkını, çarpımını, tam bölümünü ve kalanını ayrı ayrı yazdır.", starter: "a = 17\nb = 5\n# İşlemleri yap\n", solution: "a=17\nb=5\nprint(a+b)\nprint(a-b)\nprint(a*b)\nprint(a//b)\nprint(a%b)", tests: ["22","12","85","3","2"] }},

    { id: "py3", title: "3. String İşlemleri", topic: "strings", xp: 60, difficulty: "beginner", description: "Metin birleştirme, uzunluk ve string metodları",
      content: ["String birleştirme: 'Merhaba' + ' Dünya'", "len('python') → 6", "upper(), lower(), strip() metodları", "f-string: f'Adım {isim}, yaşım {yas}'", "split() metni parçalara ayırır"],
      exercise: { prompt: "isim='python' değişkenini büyük harfle, uzunluğuyla ve 'Dil: python' şeklinde f-string ile yazdır.", starter: "isim = 'python'\n# Büyük harf\n# Uzunluk\n# f-string\n", solution: "isim='python'\nprint(isim.upper())\nprint(len(isim))\nprint(f'Dil: {isim}')", tests: ["PYTHON","6","Dil: python"] }},

    { id: "py4", title: "4. Kullanıcıdan Girdi (input)", topic: "basics", xp: 60, difficulty: "beginner", description: "input() ve tip dönüşümleri",
      content: ["input() kullanıcıdan metin alır", "Her zaman string döndürür!", "int('5') → 5, float('3.14') → 3.14", "str(42) → '42' (sayıyı stringe çevirir)", "try/except hatalı girdiyi yakalar"],
      exercise: { prompt: "sayi = 7 tanımla ve int olduğunu doğrula. Karesini ve küpünü yazdır.", starter: "sayi = 7\n# Karesini yazdır\n# Küpünü yazdır\n", solution: "sayi=7\nprint(sayi**2)\nprint(sayi**3)", tests: ["49","343"] }},

    { id: "py5", title: "5. Koşullar (if/elif/else)", topic: "control-flow", xp: 75, difficulty: "beginner", description: "Karar yapıları ve karşılaştırma operatörleri",
      content: ["if koşul True ise çalışır", "elif alternatif koşul kontrol eder", "else hiçbiri uymadığında çalışır", "==, !=, <, >, <=, >= karşılaştırır", "and, or, not mantıksal operatörler"],
      exercise: { prompt: "puan=75 için: 90+ 'A', 80+ 'B', 70+ 'C', 60+ 'D', altı 'F' harf notu yazdır.", starter: "puan = 75\n# Harf notunu belirle\n", solution: "puan=75\nif puan>=90:\n    print('A')\nelif puan>=80:\n    print('B')\nelif puan>=70:\n    print('C')\nelif puan>=60:\n    print('D')\nelse:\n    print('F')", tests: ["C"] }},

    { id: "py6", title: "6. for Döngüsü", topic: "loops", xp: 75, difficulty: "beginner", description: "for döngüsü ve range() fonksiyonu",
      content: ["for eleman in koleksiyon: yapısı", "range(5) → 0,1,2,3,4", "range(1,6) → 1,2,3,4,5", "range(0,10,2) → 0,2,4,6,8 (adım=2)", "enumerate() index ve değeri birlikte verir"],
      exercise: { prompt: "1'den 10'a kadar olan çift sayıları yazdır (range ile).", starter: "# Çift sayıları yazdır\n", solution: "for i in range(2,11,2):\n    print(i)", tests: ["2","4","6","8","10"] }},

    { id: "py7", title: "7. while Döngüsü", topic: "loops", xp: 75, difficulty: "beginner", description: "while döngüsü, break ve continue",
      content: ["while koşul True olduğu sürece çalışır", "break döngüden çıkar", "continue o turu atlar, devam eder", "Sonsuz döngü: while True: ... break", "Sayaç ile kontrollü döngü yaygındır"],
      exercise: { prompt: "1'den başla, while ile 2'nin katlarını yazdır. 32'ye ulaşınca dur.", starter: "sayi = 1\n# while döngüsü\n", solution: "sayi=1\nwhile sayi<=32:\n    print(sayi)\n    sayi*=2", tests: ["1","2","4","8","16","32"] }},

    { id: "py8", title: "8. Fonksiyon Temelleri", topic: "functions", xp: 100, difficulty: "beginner", description: "def, parametreler ve return",
      content: ["def fonksiyon_adi(param): ile tanımlanır", "return değer döndürür", "Parametresiz fonksiyon da olabilir", "Varsayılan parametre: def f(x=10):", "Fonksiyon çağrısı: sonuc = fonksiyon_adi(5)"],
      exercise: { prompt: "'selamla' adında, isim parametresi alan ve 'Merhaba, [isim]!' yazdıran fonksiyon yaz. 'Ahmet' ile çağır.", starter: "# Fonksiyonu tanımla\n\n# Çağır\n", solution: "def selamla(isim):\n    print(f'Merhaba, {isim}!')\n\nselamla('Ahmet')", tests: ["Merhaba, Ahmet!"] }},

    // ── INTERMEDIATE ──
    { id: "py9", title: "9. Fonksiyon: Return & Kapsam", topic: "functions", xp: 100, difficulty: "intermediate", description: "Birden fazla return, local/global değişken",
      content: ["Fonksiyon birden fazla değer döndürebilir: return a, b", "Local değişken sadece fonksiyon içinde geçerli", "Global değişken her yerden erişilebilir", "global anahtar kelimesi ile global değişken değiştirilebilir", "İç içe fonksiyon (nested) mümkündür"],
      exercise: { prompt: "min ve max değer döndüren 'min_max(liste)' fonksiyonu yaz. [3,1,7,2,9,4] ile test et.", starter: "def min_max(liste):\n    # min ve max döndür\n    pass\n\nsonuc = min_max([3,1,7,2,9,4])\nprint(sonuc[0])\nprint(sonuc[1])", solution: "def min_max(liste):\n    return min(liste), max(liste)\n\nsonuc = min_max([3,1,7,2,9,4])\nprint(sonuc[0])\nprint(sonuc[1])", tests: ["1","9"] }},

    { id: "py10", title: "10. Listeler Derinlemesine", topic: "data-structures", xp: 100, difficulty: "intermediate", description: "Liste metodları, dilimleme ve list comprehension",
      content: ["append(), insert(), remove(), pop() metodları", "Dilimleme: liste[1:4], liste[::-1] (ters)", "sort() sıralar, sorted() yeni liste döndürür", "List comprehension: [x**2 for x in range(5)]", "in operatörü: 'elma' in meyveler → True"],
      exercise: { prompt: "[5,2,8,1,9,3] listesini sırala ve tersine çevir. Her iki sonucu da yazdır.", starter: "sayilar = [5,2,8,1,9,3]\n# Sırala ve yazdır\n# Tersine çevir ve yazdır\n", solution: "sayilar=[5,2,8,1,9,3]\nsayilar.sort()\nprint(sayilar)\nsayilar.reverse()\nprint(sayilar)", tests: ["1","9"] }},

    { id: "py11", title: "11. Sözlükler (dict)", topic: "data-structures", xp: 110, difficulty: "intermediate", description: "Anahtar-değer çiftleri ve dict metodları",
      content: ["Sözlük: {anahtar: deger} yapısı", "Erişim: sozluk['anahtar']", "keys(), values(), items() metodları", "get() güvenli erişim sağlar (KeyError yok)", "dict.update() ile güncelleme yapılır"],
      exercise: { prompt: "ogrenci = {'ad':'Ali','not':85,'ders':'Python'} sözlüğü oluştur. Her anahtar-değer çiftini yazdır.", starter: "# Sözlük oluştur\n\n# Yazdır\n", solution: "ogrenci={'ad':'Ali','not':85,'ders':'Python'}\nfor k,v in ogrenci.items():\n    print(f'{k}: {v}')", tests: ["ad: Ali","not: 85","ders: Python"] }},

    { id: "py12", title: "12. Tuple & Set", topic: "data-structures", xp: 110, difficulty: "intermediate", description: "Değiştirilemez tuple ve benzersiz set",
      content: ["Tuple: (1,2,3) — değiştirilemez", "Set: {1,2,3} — tekrarsız koleksiyon", "set otomatik tekrar elemanları siler", "Küme işlemleri: union, intersection, difference", "Tuple unpacking: a, b, c = (1, 2, 3)"],
      exercise: { prompt: "[1,2,2,3,3,3,4] listesindeki tekrar eden elemanları set ile kaldır ve sonucu yazdır.", starter: "sayilar = [1,2,2,3,3,3,4]\n# Set kullan\n", solution: "sayilar=[1,2,2,3,3,3,4]\ntekrarsiz=sorted(set(sayilar))\nfor s in tekrarsiz:\n    print(s)", tests: ["1","2","3","4"] }},

    { id: "py13", title: "13. Hata Yönetimi (try/except)", topic: "error-handling", xp: 125, difficulty: "intermediate", description: "try, except, finally ile hata yakalama",
      content: ["try bloğu hataya yatkın kodu çalıştırır", "except hatayı yakalar ve işler", "finally her zaman çalışır (hata olsa da olmasa da)", "ValueError, TypeError, ZeroDivisionError yaygın hatalar", "raise ile kendi hatan fırlatılabilir"],
      exercise: { prompt: "Sıfıra bölme hatasını yakala. 10/0 işlemini dene, hata çıkarsa 'Sıfıra bölme hatası!' yazdır.", starter: "# try/except kullan\n", solution: "try:\n    print(10/0)\nexcept ZeroDivisionError:\n    print('Sıfıra bölme hatası!')", tests: ["Sıfıra bölme hatası!"] }},

    { id: "py14", title: "14. Dosya İşlemleri", topic: "file-io", xp: 125, difficulty: "intermediate", description: "Dosya okuma, yazma ve with bloğu",
      content: ["open('dosya.txt', 'r') okuma, 'w' yazma", "with open() as f: güvenli açma yolu", "f.read() tümünü, f.readline() satır okur", "f.write() dosyaya yazar", "'a' modu dosyaya ekleme yapar"],
      exercise: { prompt: "mesajlar listesini döngüyle yazdır: ['Satır 1','Satır 2','Satır 3']", starter: "mesajlar = ['Satır 1', 'Satır 2', 'Satır 3']\n# Her mesajı yazdır\n", solution: "mesajlar=['Satır 1','Satır 2','Satır 3']\nfor m in mesajlar:\n    print(m)", tests: ["Satır 1","Satır 2","Satır 3"] }},

    // ── ADVANCED ──
    { id: "py15", title: "15. OOP: Sınıflar & Nesneler", topic: "oop", xp: 150, difficulty: "advanced", description: "class, __init__, metodlar ve self",
      content: ["class ile sınıf tanımlanır", "__init__ constructor (başlatıcı) metodudur", "self nesnenin kendisini temsil eder", "Metod: sınıf içinde tanımlı fonksiyon", "Nesne oluşturma: nesne = Sinif(parametre)"],
      exercise: { prompt: "Araba sınıfı yaz: marka ve hiz özelliği, hizlan() metodu hızı 10 artırsın. BMW nesnesi oluştur, 3 kez hızlan, hızı yazdır.", starter: "class Araba:\n    def __init__(self, marka):\n        # hiz = 0\n        pass\n    \n    def hizlan(self):\n        # hizi artir\n        pass\n\naraba = Araba('BMW')\n# 3 kez hizlan\n# Hizi yazdir\n", solution: "class Araba:\n    def __init__(self,marka):\n        self.marka=marka\n        self.hiz=0\n    def hizlan(self):\n        self.hiz+=10\n\naraba=Araba('BMW')\naraba.hizlan()\naraba.hizlan()\naraba.hizlan()\nprint(araba.hiz)", tests: ["30"] }},
  ],

  javascript: [
    // ── BEGINNER ──
    { id: "js1", title: "1. Değişkenler & Veri Tipleri", topic: "basics", xp: 50, difficulty: "beginner", description: "var, let, const ve JS veri tipleri",
      content: ["let: değiştirilebilir değişken (modern)", "const: sabit değişken (değiştirilemez)", "var: eski yöntem, kullanmaktan kaçın", "typeof operatörü tipi söyler", "undefined: atanmamış değer, null: boş değer"],
      exercise: { prompt: "isim (const), yas (let), aktif (const) değişkenleri tanımla. Hepsini console.log ile yazdır.", starter: "// Değişkenleri tanımla\n\n// Yazdır\n", solution: "const isim='Ali';\nlet yas=25;\nconst aktif=true;\nconsole.log(isim);\nconsole.log(yas);\nconsole.log(aktif);", tests: ["Ali","25","true"] }},

    { id: "js2", title: "2. String Metodları", topic: "strings", xp: 60, difficulty: "beginner", description: "Template literal ve string metodları",
      content: ["Template literal: `Merhaba ${isim}`", "length, toUpperCase(), toLowerCase()", "trim() boşlukları temizler", "includes() içerip içermediğini kontrol eder", "split() ve join() dönüşüm metodları"],
      exercise: { prompt: "metin='  javascript  ' değişkenini trim yap, büyük harfe çevir ve uzunluğunu yazdır.", starter: "let metin = '  javascript  ';\n// trim\n// büyük harf\n// uzunluk\n", solution: "let metin='  javascript  ';\nlet temiz=metin.trim();\nconsole.log(temiz);\nconsole.log(temiz.toUpperCase());\nconsole.log(temiz.length);", tests: ["javascript","JAVASCRIPT","10"] }},

    { id: "js3", title: "3. Sayısal İşlemler & Math", topic: "basics", xp: 60, difficulty: "beginner", description: "Aritmetik operatörler ve Math nesnesi",
      content: ["+ - * / % ** operatörleri", "Math.round(), Math.floor(), Math.ceil()", "Math.max(), Math.min(), Math.abs()", "Math.random() 0-1 arası sayı üretir", "parseInt() ve parseFloat() dönüşümleri"],
      exercise: { prompt: "Math kullanarak: 2'nin 10. kuvvetini, 7.8'in tavanını ve -5'in mutlak değerini yazdır.", starter: "// Math işlemleri\n", solution: "console.log(Math.pow(2,10));\nconsole.log(Math.ceil(7.8));\nconsole.log(Math.abs(-5));", tests: ["1024","8","5"] }},

    { id: "js4", title: "4. Koşullar & Mantıksal Operatörler", topic: "control-flow", xp: 75, difficulty: "beginner", description: "if/else, ternary ve switch",
      content: ["if/else if/else koşul yapısı", "Ternary: koşul ? doğru : yanlış", "switch/case çoklu seçim için", "&& (ve), || (veya), ! (değil)", "=== katı eşitlik (tip de kontrol eder)"],
      exercise: { prompt: "not=88 için ternary operatörle: 70+ ise 'Geçti', değilse 'Kaldı' yazdır.", starter: "const not = 88;\n// Ternary kullan\n", solution: "const not=88;\nconsole.log(not>=70 ? 'Geçti' : 'Kaldı');", tests: ["Geçti"] }},

    { id: "js5", title: "5. for & while Döngüleri", topic: "loops", xp: 75, difficulty: "beginner", description: "for, while, for...of döngüleri",
      content: ["for(let i=0; i<5; i++) klasik döngü", "while(koşul) koşul doğruyken çalışır", "for...of dizi elemanlarını dolaşır", "break döngüden çıkar, continue atlar", "do...while en az bir kez çalışır"],
      exercise: { prompt: "for döngüsüyle 1'den 5'e kadar sayıların toplamını hesapla ve yazdır.", starter: "let toplam = 0;\n// for döngüsü\n\nconsole.log(toplam);", solution: "let toplam=0;\nfor(let i=1;i<=5;i++){\n  toplam+=i;\n}\nconsole.log(toplam);", tests: ["15"] }},

    { id: "js6", title: "6. Fonksiyon Temelleri", topic: "functions", xp: 100, difficulty: "beginner", description: "function, arrow function ve varsayılan parametre",
      content: ["function isim(param){ return; } klasik", "Arrow: const f = (x) => x * 2", "Tek satır arrow: return gereksiz", "Varsayılan parametre: (x = 10)", "Fonksiyon ifadesi vs fonksiyon bildirimi"],
      exercise: { prompt: "Arrow function ile iki sayının büyüğünü döndüren 'buyuk' fonksiyonu yaz. (8, 13) ile test et.", starter: "// Arrow function tanımla\nconst buyuk = \n\nconsole.log(buyuk(8, 13));", solution: "const buyuk=(a,b)=>a>b?a:b;\nconsole.log(buyuk(8,13));", tests: ["13"] }},

    { id: "js7", title: "7. Diziler (Arrays) Temelleri", topic: "data-structures", xp: 100, difficulty: "beginner", description: "Dizi oluşturma, erişim ve temel metodlar",
      content: ["Dizi: const arr = [1, 2, 3]", "Erişim: arr[0] → ilk eleman", "push() sona ekler, pop() sondan siler", "unshift() başa ekler, shift() baştan siler", "length dizinin uzunluğunu verir"],
      exercise: { prompt: "[10,20,30] dizisine 40 ekle, başına 0 ekle. Sonuç dizisini ve uzunluğunu yazdır.", starter: "let dizi = [10, 20, 30];\n// 40 ekle\n// 0 başa ekle\nconsole.log(dizi);\nconsole.log(dizi.length);", solution: "let dizi=[10,20,30];\ndizi.push(40);\ndizi.unshift(0);\nconsole.log(dizi);\nconsole.log(dizi.length);", tests: ["0","5"] }},

    // ── INTERMEDIATE ──
    { id: "js8", title: "8. Dizi Metodları (map/filter/reduce)", topic: "data-structures", xp: 110, difficulty: "intermediate", description: "Fonksiyonel dizi metodları",
      content: ["map() her elemanı dönüştürür, yeni dizi döner", "filter() koşula uyanları döner", "reduce() diziyi tek değere indirger", "find() ilk eşleşeni döner", "every() ve some() boolean döner"],
      exercise: { prompt: "[1,2,3,4,5,6,7,8] dizisinden çift sayıları filtrele ve her birinin karesini al. Sonucu yazdır.", starter: "const sayilar = [1,2,3,4,5,6,7,8];\n// filter ve map kullan\n", solution: "const sayilar=[1,2,3,4,5,6,7,8];\nconst sonuc=sayilar.filter(x=>x%2===0).map(x=>x*x);\nconsole.log(sonuc);", tests: ["4","16","36","64"] }},

    { id: "js9", title: "9. Nesneler (Objects)", topic: "data-structures", xp: 110, difficulty: "intermediate", description: "Object oluşturma, erişim ve metodlar",
      content: ["Nesne: const obj = { key: value }", "Nokta notasyonu: obj.key", "Köşeli parantez: obj['key']", "Object.keys(), Object.values(), Object.entries()", "Spread operatörü: {...obj, yeniKey: deger}"],
      exercise: { prompt: "kitap = {baslik:'JS Öğren', yazar:'Ali', sayfa:300} nesnesi oluştur. Her özelliği 'baslik: JS Öğren' formatında yazdır.", starter: "const kitap = {baslik:'JS Öğren', yazar:'Ali', sayfa:300};\n// for...in veya Object.entries\n", solution: "const kitap={baslik:'JS Öğren',yazar:'Ali',sayfa:300};\nObject.entries(kitap).forEach(([k,v])=>console.log(`${k}: ${v}`));", tests: ["baslik: JS Öğren","yazar: Ali","sayfa: 300"] }},

    { id: "js10", title: "10. Destructuring & Spread", topic: "modern-js", xp: 120, difficulty: "intermediate", description: "ES6+ destructuring, spread ve rest",
      content: ["Array destructuring: const [a,b] = [1,2]", "Object destructuring: const {isim,yas} = nesne", "Rest parametresi: function f(...args)", "Spread: [...dizi1, ...dizi2] birleştirir", "Default değer: const {x=10} = nesne"],
      exercise: { prompt: "const kisi = {ad:'Zeynep', yas:28, sehir:'İstanbul'} nesnesini destructuring ile al ve template literal ile 'Zeynep, 28 yaşında, İstanbul' yazdır.", starter: "const kisi = {ad:'Zeynep', yas:28, sehir:'İstanbul'};\n// Destructuring\n\n// Template literal\n", solution: "const kisi={ad:'Zeynep',yas:28,sehir:'İstanbul'};\nconst {ad,yas,sehir}=kisi;\nconsole.log(`${ad}, ${yas} yaşında, ${sehir}`);", tests: ["Zeynep, 28 yaşında, İstanbul"] }},

    { id: "js11", title: "11. Promise & async/await", topic: "async", xp: 130, difficulty: "intermediate", description: "Asenkron programlama temelleri",
      content: ["Promise: asenkron işlem temsili", ".then() başarı, .catch() hata yakalar", "async fonksiyon Promise döndürür", "await Promise tamamlanana kadar bekler", "try/catch ile hata yönetimi yapılır"],
      exercise: { prompt: "Aşağıdaki diziyi sıralayıp karesini alan kodu tamamla: sayilar=[3,1,4,1,5,9]", starter: "const sayilar = [3,1,4,1,5,9];\nconst sirali = [...new Set(sayilar)].sort((a,b)=>a-b);\n// Her elemanın karesini yazdır\n", solution: "const sayilar=[3,1,4,1,5,9];\nconst sirali=[...new Set(sayilar)].sort((a,b)=>a-b);\nsirali.forEach(x=>console.log(x*x));", tests: ["1","9","16","25","81"] }},

    { id: "js12", title: "12. Hata Yönetimi", topic: "error-handling", xp: 120, difficulty: "intermediate", description: "try/catch/finally ve hata fırlatma",
      content: ["try: hata çıkabilecek kod", "catch(e): hatayı yakala, e.message ile mesaj al", "finally: her zaman çalışır", "throw new Error('mesaj') hata fırlat", "TypeError, RangeError, ReferenceError yaygın"],
      exercise: { prompt: "JSON.parse ile geçersiz string parse etmeyi dene. Hata çıkarsa 'JSON hatası: [mesaj]' yazdır.", starter: "const yanlisMeyin = 'bu json degil';\n// try/catch\n", solution: "const yanlisMetin='bu json degil';\ntry{\n  JSON.parse(yanlisMetin);\n}catch(e){\n  console.log('JSON hatası: '+e.message);\n}", tests: ["JSON hatası"] }},

    // ── ADVANCED ──
    { id: "js13", title: "13. Closure & Scope", topic: "advanced-functions", xp: 140, difficulty: "advanced", description: "Kapanışlar ve değişken kapsamı",
      content: ["Scope: değişkenin erişilebilir olduğu alan", "Global, function ve block scope", "Closure: iç fonksiyon dış değişkene erişir", "let ve const block scope, var function scope", "Closure ile private değişken oluşturulabilir"],
      exercise: { prompt: "Her çağrıda 1 artan sayaç fonksiyonu yaz (closure ile). 3 kez çağır ve sonuçları yazdır.", starter: "function sayacOlustur() {\n  // closure\n}\nconst sayac = sayacOlustur();\nconsole.log(sayac());\nconsole.log(sayac());\nconsole.log(sayac());", solution: "function sayacOlustur(){\n  let n=0;\n  return ()=>++n;\n}\nconst sayac=sayacOlustur();\nconsole.log(sayac());\nconsole.log(sayac());\nconsole.log(sayac());", tests: ["1","2","3"] }},

    { id: "js14", title: "14. Prototype & Class", topic: "oop", xp: 150, difficulty: "advanced", description: "ES6 class, constructor, inheritance",
      content: ["class ile modern OOP", "constructor() başlatıcı metoddur", "extends ile miras alma", "super() üst sınıf constructor'ı çağırır", "static metodlar nesne değil sınıfa aittir"],
      exercise: { prompt: "Hayvan class'ı (isim, ses), Kopek extends Hayvan (havla() → '[isim] dedi: [ses]') yaz. 'Rex' ile test et.", starter: "class Hayvan {\n  constructor(isim, ses) {\n    // ...\n  }\n}\n\nclass Kopek extends Hayvan {\n  havla() {\n    // ...\n  }\n}\n\nconst kopek = new Kopek('Rex', 'Hav');\nconsole.log(kopek.havla());", solution: "class Hayvan{\n  constructor(isim,ses){\n    this.isim=isim;\n    this.ses=ses;\n  }\n}\nclass Kopek extends Hayvan{\n  havla(){\n    return `${this.isim} dedi: ${this.ses}`;\n  }\n}\nconst kopek=new Kopek('Rex','Hav');\nconsole.log(kopek.havla());", tests: ["Rex dedi: Hav"] }},

    { id: "js15", title: "15. Modüller & İleri Kavramlar", topic: "advanced", xp: 150, difficulty: "advanced", description: "Modül sistemi, iteratörler ve generator",
      content: ["export ile dışa, import ile içe aktarım", "default export vs named export", "Generator: function* ve yield", "Iterator protokolü: next() metodu", "Symbol, WeakMap, WeakSet ileri veri yapıları"],
      exercise: { prompt: "Generator fonksiyon ile Fibonacci dizisinin ilk 6 terimini üret ve yazdır (0,1,1,2,3,5).", starter: "function* fibonacci() {\n  // generator yaz\n}\n\nconst fib = fibonacci();\nfor(let i=0; i<6; i++){\n  console.log(fib.next().value);\n}", solution: "function* fibonacci(){\n  let a=0,b=1;\n  while(true){\n    yield a;\n    [a,b]=[b,a+b];\n  }\n}\nconst fib=fibonacci();\nfor(let i=0;i<6;i++){\n  console.log(fib.next().value);\n}", tests: ["0","1","1","2","3","5"] }},
  ]
};

const BADGES = [
  { id: "first_lesson", name: "İlk Adım", emoji: "🎯", desc: "İlk dersi tamamla", condition: (s) => s.completedLessons.length >= 1 },
  { id: "streak3", name: "Ateşli", emoji: "🔥", desc: "3 günlük seri yap", condition: (s) => s.streak >= 3 },
  { id: "xp100", name: "XP Avcısı", emoji: "⚡", desc: "100 XP kazan", condition: (s) => s.xp >= 100 },
  { id: "xp500", name: "Güç Merkezi", emoji: "💪", desc: "500 XP kazan", condition: (s) => s.xp >= 500 },
  { id: "py_master", name: "Python Ustası", emoji: "🐍", desc: "Tüm Python derslerini bitir", condition: (s) => LESSONS.python.every(l => s.completedLessons.includes(l.id)) },
  { id: "js_master", name: "JS Ustası", emoji: "✨", desc: "Tüm JS derslerini bitir", condition: (s) => LESSONS.javascript.every(l => s.completedLessons.includes(l.id)) },
];

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1500, 2500];
const DAILY_LIMIT = 10; // Günlük AI mesaj limiti — istediğin zaman değiştir!
const getLevel = (xp) => LEVEL_THRESHOLDS.findIndex((t, i) => xp < (LEVEL_THRESHOLDS[i + 1] || Infinity));

function getDailyUsage() {
  try {
    const today = new Date().toDateString();
    const stored = localStorage.getItem("lp_ai_usage");
    if (!stored) return { date: today, count: 0 };
    const data = JSON.parse(stored);
    if (data.date !== today) return { date: today, count: 0 };
    return data;
  } catch { return { date: new Date().toDateString(), count: 0 }; }
}

function incrementDailyUsage() {
  try {
    const usage = getDailyUsage();
    usage.count += 1;
    localStorage.setItem("lp_ai_usage", JSON.stringify(usage));
    return usage.count;
  } catch { return 1; }
}

// ─── STYLES ──────────────────────────────────────────────────
const S = {
  app: { minHeight: "100vh", width: "100vw", maxWidth: "100%", background: "#0a0a0f", color: "#e2e8f0", fontFamily: "'Inter', system-ui, sans-serif", display: "flex", flexDirection: "column", margin: 0, padding: 0, boxSizing: "border-box" },
  nav: { background: "#0d0d14", borderBottom: "1px solid #1e1e2e", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, position: "sticky", top: 0, zIndex: 100 },
  navLogo: { fontSize: 18, fontWeight: 800, background: "linear-gradient(135deg, #7c3aed, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  navTabs: { display: "flex", gap: 4 },
  navTab: (active) => ({ padding: "6px 14px", borderRadius: 8, border: "none", background: active ? "#1e1e3a" : "transparent", color: active ? "#a78bfa" : "#64748b", cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all 0.15s" }),
  navRight: { display: "flex", gap: 12, alignItems: "center" },
  xpBadge: { background: "#1e1e2e", border: "1px solid #2d2d4e", borderRadius: 20, padding: "4px 12px", fontSize: 13, color: "#a78bfa", fontWeight: 600 },
  main: { flex: 1, padding: "24px", width: "100%", boxSizing: "border-box" },
  card: { background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 12, padding: 20 },
  h2: { fontSize: 22, fontWeight: 700, marginBottom: 16, color: "#f1f5f9" },
  h3: { fontSize: 16, fontWeight: 600, marginBottom: 8, color: "#e2e8f0" },
  btn: (variant = "primary") => ({
    padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all 0.15s",
    ...(variant === "primary" ? { background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "#fff" } :
      variant === "success" ? { background: "#059669", color: "#fff" } :
      variant === "danger" ? { background: "#dc2626", color: "#fff" } :
      { background: "#1e1e2e", color: "#a78bfa", border: "1px solid #2d2d4e" })
  }),
  input: { background: "#0d0d14", border: "1px solid #2d2d4e", borderRadius: 8, padding: "10px 14px", color: "#e2e8f0", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box" },
  tag: (color) => ({ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600 }),
  progress: (pct, color = "#7c3aed") => ({
    outer: { background: "#1e1e2e", borderRadius: 99, height: 8, overflow: "hidden" },
    inner: { width: `${pct}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.5s ease" }
  }),
};

// ─── COMPONENTS ──────────────────────────────────────────────

function StatCard({ label, value, sub, color = "#7c3aed" }) {
  return (
    <div style={{ ...S.card, textAlign: "center", flex: 1 }}>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function XPBar({ xp }) {
  const level = getLevel(xp);
  const lo = LEVEL_THRESHOLDS[level] || 0;
  const hi = LEVEL_THRESHOLDS[level + 1] || lo + 500;
  const pct = Math.round(((xp - lo) / (hi - lo)) * 100);
  const p = S.progress(pct);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b", marginBottom: 6 }}>
        <span>Seviye {level} → {level + 1}</span>
        <span>{xp - lo} / {hi - lo} XP</span>
      </div>
      <div style={p.outer}><div style={p.inner} /></div>
    </div>
  );
}
// ─── PROGRESS CHARTS ─────────────────────────────────────────
function ProgressCharts({ state }) {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("progress")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: true });
      setProgressData(data || []);
      setLoading(false);
    }
    fetchProgress();
  }, []);

  if (loading) return null;

  // Günlük ders sayısı
  const dailyMap = {};
  progressData.forEach(p => {
    const day = new Date(p.completed_at).toLocaleDateString("tr-TR", { month: "short", day: "numeric" });
    dailyMap[day] = (dailyMap[day] || 0) + 1;
  });
  const dailyLabels = Object.keys(dailyMap).slice(-7);
  const dailyValues = dailyLabels.map(d => dailyMap[d]);

  // Dile göre dağılım
  const langMap = {};
  progressData.forEach(p => {
    langMap[p.language] = (langMap[p.language] || 0) + 1;
  });
  const langTotal = Object.values(langMap).reduce((a, b) => a + b, 0);

  const barMax = Math.max(...dailyValues, 1);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
      {/* Çizgi Grafik - Günlük */}
      <div style={S.card}>
        <h3 style={S.h3}>📈 Günlük Tamamlanan Ders</h3>
        {dailyLabels.length === 0 ? (
          <p style={{ color: "#64748b", fontSize: 13 }}>Henüz tamamlanan ders yok.</p>
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100, marginBottom: 8 }}>
              {dailyLabels.map((day, i) => (
                <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 10, color: "#a78bfa", fontWeight: 700 }}>{dailyValues[i]}</span>
                  <div style={{
                    width: "100%",
                    height: `${(dailyValues[i] / barMax) * 80}px`,
                    background: "linear-gradient(180deg, #7c3aed, #06b6d4)",
                    borderRadius: "4px 4px 0 0",
                    minHeight: 4
                  }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {dailyLabels.map(day => (
                <div key={day} style={{ flex: 1, fontSize: 9, color: "#64748b", textAlign: "center" }}>{day}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pasta Grafik - Dile Göre */}
      <div style={S.card}>
        <h3 style={S.h3}>🍩 Dile Göre Dağılım</h3>
        {langTotal === 0 ? (
          <p style={{ color: "#64748b", fontSize: 13 }}>Henüz tamamlanan ders yok.</p>
        ) : (
          <div>
            {Object.entries(langMap).map(([lang, count]) => {
              const pct = Math.round((count / langTotal) * 100);
              const color = lang === "python" ? "#7c3aed" : "#06b6d4";
              const emoji = lang === "python" ? "🐍" : "✨";
              return (
                <div key={lang} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                    <span style={{ color: "#e2e8f0" }}>{emoji} {lang === "python" ? "Python" : "JavaScript"}</span>
                    <span style={{ color, fontWeight: 700 }}>{count} ders ({pct}%)</span>
                  </div>
                  <div style={S.progress(pct, color).outer}>
                    <div style={S.progress(pct, color).inner} />
                  </div>
                </div>
              );
            })}
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 8, textAlign: "center" }}>
              Toplam {langTotal} ders tamamlandı
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// ─── DASHBOARD ───────────────────────────────────────────────
function Dashboard({ state }) {
  const { xp, streak, completedLessons, weakTopics } = state;
  const level = getLevel(xp);
  const earnedBadges = BADGES.filter(b => b.condition(state));
  const totalLessons = Object.values(LESSONS).flat().length;
  const pct = Math.round((completedLessons.length / totalLessons) * 100);

  return (
  <div>
    <h2 style={S.h2}>📊 Kontrol Paneli</h2>
    <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
      <StatCard label="Toplam XP" value={xp} color="#a78bfa" />
      <StatCard label="Seviye" value={`Lv.${level}`} color="#06b6d4" />
      <StatCard label="Günlük Seri" value={`${streak} 🔥`} color="#f59e0b" />
      <StatCard label="Tamamlanan" value={`${completedLessons.length}/${totalLessons}`} color="#10b981" />
    </div>
    <ProgressCharts state={state} />
    
      <div style={{ ...S.card, marginBottom: 16 }}>
        <h3 style={S.h3}>XP İlerlemesi</h3>
        <XPBar xp={xp} />
        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b", marginBottom: 6 }}>
            <span>Genel İlerleme</span><span>{pct}%</span>
          </div>
          <div style={S.progress(pct, "#10b981").outer}><div style={S.progress(pct, "#10b981").inner} /></div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={S.card}>
          <h3 style={S.h3}>🏅 Rozetler</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {BADGES.map(b => {
              const earned = b.condition(state);
              return (
                <div key={b.id} title={b.desc} style={{ padding: "6px 12px", borderRadius: 20, background: earned ? "#1e1e3a" : "#0d0d14", border: `1px solid ${earned ? "#7c3aed" : "#1e1e2e"}`, fontSize: 13, color: earned ? "#a78bfa" : "#374151", opacity: earned ? 1 : 0.4 }}>
                  {b.emoji} {b.name}
                </div>
              );
            })}
          </div>
        </div>
        <div style={S.card}>
          <h3 style={S.h3}>⚠️ Zayıf Konular</h3>
          {weakTopics.length === 0
            ? <p style={{ color: "#64748b", fontSize: 13 }}>Henüz zayıf konu yok. Harika! 🎉</p>
            : weakTopics.map(t => <div key={t} style={{ ...S.tag("#f59e0b"), display: "inline-block", marginRight: 6, marginBottom: 6 }}>{t}</div>)
          }
        </div>
      </div>
      <div style={S.card}>
        <h3 style={S.h3}>📚 Tamamlanan Dersler</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {Object.values(LESSONS).flat().map(l => (
            <div key={l.id} style={{ padding: "4px 10px", borderRadius: 6, background: completedLessons.includes(l.id) ? "#052e16" : "#0d0d14", border: `1px solid ${completedLessons.includes(l.id) ? "#10b981" : "#1e1e2e"}`, fontSize: 12, color: completedLessons.includes(l.id) ? "#10b981" : "#374151" }}>
              {completedLessons.includes(l.id) ? "✅" : "⬜"} {l.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CODE MENTOR ─────────────────────────────────────────────
function CodeMentor() {
  const [lang, setLang] = useState("javascript");
  const [code, setCode] = useState("// Kodunu buraya yaz\nconsole.log('Merhaba Dünya!');");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const [pyLoading, setPyLoading] = useState(false);

  const run = async () => {
    if (lang === "python") {
      setPyLoading(true);
      setOutput("");
      setError("");
      const result = await runPythonReal(code);
      setPyLoading(false);
      setOutput(result.output);
      setError(result.error || "");
      if (result.error) analyzeError(result.error);
    } else {
      const result = runJS(code);
      setOutput(result.output);
      setError(result.error || "");
      if (result.error) analyzeError(result.error);
    }
  };

  const analyzeError = async (err) => {
    setLoading(true);
    setAnalysis("");
    const sys = `Sen bir kod mentor asistanısın. Türkçe, kısa ve net cevap ver.
Hataları basitçe açıkla ve 2 farklı çözüm öner. Emoji kullan.`;
    const msgs = [{ role: "user", content: `Dil: ${lang}\nKod:\n${code}\nHata: ${err}\n\nHatayı açıkla ve 2 çözüm öner.` }];
    try {
      await callClaude(msgs, sys, (t) => setAnalysis(t));
    } catch { setAnalysis("API bağlantısı kurulamadı."); }
    setLoading(false);
  };

  const analyzeManual = async () => {
    setLoading(true);
    setAnalysis("");
    const sys = `Sen bir kod mentor asistanısın. Türkçe, kısa ve net cevap ver.
Kodu incele, potansiyel sorunları ve iyileştirme önerilerini belirt.`;
    const msgs = [{ role: "user", content: `Dil: ${lang}\nKod:\n${code}\n\nBu kodu incele ve geri bildirim ver.` }];
    try {
      await callClaude(msgs, sys, (t) => setAnalysis(t));
    } catch { setAnalysis("API bağlantısı kurulamadı."); }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={S.h2}>🔍 Kod Mentor</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["javascript", "python"].map(l => (
          <button key={l} onClick={() => { setLang(l); setCode(l === "python" ? "# Python kodunu buraya yaz\nprint('Merhaba Dünya!')" : "// JS kodunu buraya yaz\nconsole.log('Merhaba Dünya!');"); setOutput(""); setError(""); setAnalysis(""); }} style={S.navTab(lang === l)}>
            {l === "python" ? "🐍 Python" : "✨ JavaScript"}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div style={{ ...S.card, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <h3 style={{ ...S.h3, margin: 0 }}>✏️ Editör</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={analyzeManual} disabled={loading} style={S.btn("outline")}>🔍 Analiz Et</button>
                <button onClick={run} disabled={pyLoading} style={S.btn("success")}>{pyLoading ? "⏳ Çalışıyor..." : "▶ Çalıştır"}</button>
              </div>
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              style={{ ...S.input, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, minHeight: 240, resize: "vertical", lineHeight: 1.6 }}
            />
          </div>
        </div>
        <div>
          <div style={{ ...S.card, marginBottom: 12 }}>
            <h3 style={S.h3}>🖥️ Çıktı</h3>
            {error
              ? <div style={{ background: "#1a0a0a", border: "1px solid #dc262644", borderRadius: 8, padding: 12, fontSize: 13, color: "#f87171", fontFamily: "monospace", minHeight: 60 }}>❌ {error}</div>
              : output
                ? <div style={{ background: "#0a0a0f", border: "1px solid #1e1e2e", borderRadius: 8, padding: 12, fontSize: 13, color: "#86efac", fontFamily: "monospace", whiteSpace: "pre", minHeight: 60 }}>{output}</div>
                : <div style={{ color: "#374151", fontSize: 13, padding: 12 }}>Kod çalıştırılmadı.</div>
            }
          </div>
          <div style={S.card}>
            <h3 style={S.h3}>🤖 AI Mentor Analizi</h3>
            {loading && <div style={{ color: "#7c3aed", fontSize: 13 }}>Analiz ediliyor●●●</div>}
            {analysis
              ? <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{analysis}</div>
              : !loading && <div style={{ color: "#374151", fontSize: 13 }}>Kodu çalıştır veya "Analiz Et"e bas.</div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LEARNING PATH ───────────────────────────────────────────
function LearningPath({ state, onNavigate }) {
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setPath(null);
    const sys = `Sen bir öğrenme yolu oluşturuculusun. SADECE JSON döndür, başka hiçbir şey yazma.
Format:
{"weekly_goal":"...", "daily_tasks":["...","...","...","...","...","...","..."], "focus_topics":["...","...","..."], "advice":"..."}`;
    const msgs = [{ role: "user", content: `Öğrenci bilgileri:
- Seviye: ${state.level}
- XP: ${state.xp}
- Tamamlanan ders: ${state.completedLessons.length}
- Zayıf konular: ${state.weakTopics.join(", ") || "yok"}

Bu öğrenci için 1 haftalık kişisel öğrenme yolu oluştur. Türkçe.` }];
    try {
      let raw = "";
      await callClaude(msgs, sys, (t) => { raw = t; });
      const clean = raw.replace(/```json|```/g, "").trim();
      setPath(JSON.parse(clean));
    } catch { setPath({ weekly_goal: "Temel programlama kavramlarını pekiştir", daily_tasks: ["Python değişkenleri tekrarla", "if/else alıştırması yap", "for döngüsü egzersizi", "Fonksiyon yaz", "Liste işlemleri", "Mini proje yap", "Öğrendiklerini gözden geçir"], focus_topics: ["Değişkenler", "Döngüler", "Fonksiyonlar"], advice: "Her gün düzenli çalış ve egzersizleri atlamadan yap." }); }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={S.h2}>🗺️ Öğrenme Yolu</h2>
      <div style={{ ...S.card, marginBottom: 16, textAlign: "center" }}>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 16 }}>AI, senin seviyene ve zayıf noktalarına göre kişisel bir haftalık plan oluşturur.</p>
        <button onClick={generate} disabled={loading} style={S.btn()}>
          {loading ? "⏳ Oluşturuluyor..." : "✨ Kişisel Yol Oluştur"}
        </button>
      </div>
      {path && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ ...S.card, border: "1px solid #7c3aed44" }}>
            <h3 style={{ ...S.h3, color: "#a78bfa" }}>🎯 Haftalık Hedef</h3>
            <p style={{ fontSize: 15, color: "#e2e8f0" }}>{path.weekly_goal}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={S.card}>
              <h3 style={S.h3}>📅 Günlük Görevler</h3>
              {path.daily_tasks.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < path.daily_tasks.length - 1 ? "1px solid #1e1e2e" : "none" }}>
                  <span style={{ color: "#7c3aed", fontWeight: 700, flexShrink: 0 }}>G{i + 1}</span>
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>{t}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ ...S.card, marginBottom: 12 }}>
                <h3 style={S.h3}>🎯 Odak Konuları</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {path.focus_topics.map(t => <span key={t} style={S.tag("#06b6d4")}>{t}</span>)}
                </div>
              </div>
              <div style={{ ...S.card, border: "1px solid #f59e0b44" }}>
                <h3 style={{ ...S.h3, color: "#fbbf24" }}>💡 Tavsiye</h3>
                <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{path.advice}</p>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <button onClick={() => onNavigate("lessons")} style={S.btn()}>Derslere Git →</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ONBOARDING ──────────────────────────────────────────────
function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState("");
  const [style, setStyle] = useState("");

  const levels = [
    { id: "beginner", label: "Yeni Başlayan", emoji: "🌱", desc: "Hiç kod yazmadım" },
    { id: "intermediate", label: "Orta Seviye", emoji: "⚡", desc: "Temel bilgim var" },
    { id: "advanced", label: "İleri Seviye", emoji: "🔥", desc: "Deneyimliyim" },
  ];
  const styles = [
    { id: "visual", label: "Görsel Öğrenen", emoji: "👁️", desc: "Örneklerle öğrenirim" },
    { id: "practice", label: "Pratik Yapan", emoji: "💻", desc: "Yaparak öğrenirim" },
    { id: "theory", label: "Teorik", emoji: "📚", desc: "Önce mantığı anlarım" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 500, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🚀</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #7c3aed, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 }}>LearnPilot AI</h1>
        <p style={{ color: "#64748b", marginBottom: 32 }}>AI destekli kişisel programlama öğretmeni</p>

        {step === 0 && (
          <div>
            <h2 style={{ ...S.h2, marginBottom: 20 }}>Seviyeni seç</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {levels.map(l => (
                <button key={l.id} onClick={() => setLevel(l.id)}
                  style={{ padding: "14px 20px", borderRadius: 10, border: `2px solid ${level === l.id ? "#7c3aed" : "#1e1e2e"}`, background: level === l.id ? "#1e1e3a" : "#0d0d14", color: "#e2e8f0", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                  <span style={{ fontSize: 24 }}>{l.emoji}</span>
                  <div><div style={{ fontWeight: 600 }}>{l.label}</div><div style={{ fontSize: 12, color: "#64748b" }}>{l.desc}</div></div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} disabled={!level} style={S.btn()}>Devam →</button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 style={{ ...S.h2, marginBottom: 20 }}>Öğrenme tarzın?</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {styles.map(s => (
                <button key={s.id} onClick={() => setStyle(s.id)}
                  style={{ padding: "14px 20px", borderRadius: 10, border: `2px solid ${style === s.id ? "#06b6d4" : "#1e1e2e"}`, background: style === s.id ? "#0e2830" : "#0d0d14", color: "#e2e8f0", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                  <span style={{ fontSize: 24 }}>{s.emoji}</span>
                  <div><div style={{ fontWeight: 600 }}>{s.label}</div><div style={{ fontSize: 12, color: "#64748b" }}>{s.desc}</div></div>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button onClick={() => setStep(0)} style={S.btn("outline")}>← Geri</button>
              <button onClick={() => onDone(level, style)} disabled={!style} style={S.btn()}>Başla! 🚀</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function PlanScreen({ level, learningStyle, onDone }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const levelLabels = {
    beginner: { label: "Yeni Başlayan", emoji: "🌱", color: "#10b981" },
    intermediate: { label: "Orta Seviye", emoji: "⚡", color: "#f59e0b" },
    advanced: { label: "İleri Seviye", emoji: "🔥", color: "#ef4444" },
  };
  const styleLabels = {
    visual: "Görsel Öğrenen",
    practice: "Pratik Yapan",
    theory: "Teorik",
  };

  const lv = levelLabels[level] || levelLabels.beginner;

  useEffect(() => {
    generatePlan();
  }, []);

  const generatePlan = async () => {
    setLoading(true);
    setError(false);
    setPlan(null);

    const sys = `Sen bir programlama eğitim uzmanısın. SADECE JSON döndür, başka hiçbir şey yazma. Markdown veya açıklama ekleme.
Format (tam olarak bu yapıda):
{
  "weekly_goal": "...",
  "weekly_summary": "...",
  "days": [
    { "day": "Pazartesi", "focus": "...", "tasks": ["...", "..."], "duration": "30 dk" },
    { "day": "Salı",      "focus": "...", "tasks": ["...", "..."], "duration": "30 dk" },
    { "day": "Çarşamba",  "focus": "...", "tasks": ["...", "..."], "duration": "45 dk" },
    { "day": "Perşembe",  "focus": "...", "tasks": ["...", "..."], "duration": "30 dk" },
    { "day": "Cuma",      "focus": "...", "tasks": ["...", "..."], "duration": "45 dk" },
    { "day": "Cumartesi", "focus": "...", "tasks": ["...", "...", "..."], "duration": "60 dk" },
    { "day": "Pazar",     "focus": "...", "tasks": ["...", "..."], "duration": "20 dk" }
  ],
  "focus_topics": ["...", "...", "..."],
  "first_lesson": "...",
  "motivation": "..."
}`;

    const levelContext = {
      beginner: "Hiç programlama bilmiyorlar. Python ile başlamalılar. Değişkenler, print, temel işlemler, if/else, for döngüsü konularına odaklan. Çok basit görevler ver.",
      intermediate: "Temel programlama bilgileri var. Fonksiyonlar, listeler, sözlükler, hata yönetimi konularını pekiştirmeye odaklan. Orta zorlukta görevler.",
      advanced: "Deneyimli programcı. OOP, dosya işlemleri, async, modüller gibi ileri konulara odaklan. Proje bazlı görevler ver.",
    };
    const styleContext = {
      visual: "Görsel öğreniyor: örnekler ve adım adım açıklamalar öner.",
      practice: "Yaparak öğreniyor: bol egzersiz ve mini projeler öner.",
      theory: "Teorik öğreniyor: kavramsal açıklamalar ve mantık soruları öner.",
    };

    const msgs = [{
      role: "user",
      content: `Öğrenci seviyesi: ${level} (${levelContext[level]})
Öğrenme tarzı: ${learningStyle} (${styleContext[learningStyle]})

Bu öğrenci için 1 haftalık kişisel programlama planı oluştur. Türkçe yaz. Her görev somut ve yapılabilir olsun.`
    }];

    try {
      let raw = "";
      await callClaude(msgs, sys, (t) => { raw = t; });
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setPlan(parsed);
    } catch {
      // Fallback plan
      const fallbacks = {
        beginner: {
          weekly_goal: "Python'a giriş yap ve temel kavramları öğren",
          weekly_summary: "Bu hafta programlamaya ilk adımını atıyorsun. Adım adım, sabırla ilerle.",
          days: [
            { day: "Pazartesi", focus: "Değişkenler & Print", tasks: ["py1 dersini aç ve oku", "print() ile kendi adını yazdır"], duration: "30 dk" },
            { day: "Salı", focus: "Sayısal İşlemler", tasks: ["py2 dersini tamamla", "Hesap makinesi kodu yaz"], duration: "30 dk" },
            { day: "Çarşamba", focus: "String İşlemleri", tasks: ["py3 dersini bitir", "Kendi adını büyük harfle yazdır"], duration: "45 dk" },
            { day: "Perşembe", focus: "Koşullar", tasks: ["py5 dersini oku", "Not hesaplama kodu yaz"], duration: "30 dk" },
            { day: "Cuma", focus: "Döngüler", tasks: ["py6 dersini tamamla", "1-100 arası sayıları yazdır"], duration: "45 dk" },
            { day: "Cumartesi", focus: "Mini Proje", tasks: ["Öğrendiklerini kullan", "Basit bir quiz programı yaz", "AI Tutor'a sor"], duration: "60 dk" },
            { day: "Pazar", focus: "Tekrar", tasks: ["Hataları gözden geçir", "Sonraki haftayı planla"], duration: "20 dk" },
          ],
          focus_topics: ["Değişkenler", "Koşullar", "Döngüler"],
          first_lesson: "Değişkenler & Veri Tipleri",
          motivation: "Her uzman birer zamanlar başlangıç noktasındaydı. Bugün attığın adım, yarının temeli!",
        },
        intermediate: {
          weekly_goal: "Fonksiyonlar ve veri yapılarında ustalaş",
          weekly_summary: "Bu hafta Python'un güçlü özelliklerini keşfedeceksin.",
          days: [
            { day: "Pazartesi", focus: "Fonksiyonlar", tasks: ["py8 ve py9 derslerini oku", "3 farklı fonksiyon yaz"], duration: "30 dk" },
            { day: "Salı", focus: "Listeler", tasks: ["py10 dersini tamamla", "List comprehension egzersizi"], duration: "30 dk" },
            { day: "Çarşamba", focus: "Sözlükler", tasks: ["py11 dersini bitir", "Adres defteri kodu yaz"], duration: "45 dk" },
            { day: "Perşembe", focus: "Hata Yönetimi", tasks: ["py13 dersini oku", "try/except egzersizi yap"], duration: "30 dk" },
            { day: "Cuma", focus: "JS Temelleri", tasks: ["js1 ve js6 derslerini aç", "Arrow function yaz"], duration: "45 dk" },
            { day: "Cumartesi", focus: "Proje", tasks: ["Öğrenci not sistemi yaz", "Dict ve listeler kullan", "Hata yönetimi ekle"], duration: "60 dk" },
            { day: "Pazar", focus: "Tekrar", tasks: ["Projeyi gözden geçir", "AI Tutor'dan feedback al"], duration: "20 dk" },
          ],
          focus_topics: ["Fonksiyonlar", "Veri Yapıları", "Hata Yönetimi"],
          first_lesson: "Fonksiyon Temelleri",
          motivation: "Temel bilgilerin var — şimdi onları gerçek projelere dönüştür!",
        },
        advanced: {
          weekly_goal: "OOP ve ileri JavaScript kavramlarını pekiştir",
          weekly_summary: "Bu hafta yazılım mimarisi odaklı çalışacaksın.",
          days: [
            { day: "Pazartesi", focus: "Python OOP", tasks: ["py15 dersini oku", "Kendi class'ını tasarla"], duration: "45 dk" },
            { day: "Salı", focus: "JS Closure", tasks: ["js13 dersini bitir", "3 farklı closure yaz"], duration: "30 dk" },
            { day: "Çarşamba", focus: "JS Class & Miras", tasks: ["js14 tamamla", "Hayvan hiyerarşisi kur"], duration: "45 dk" },
            { day: "Perşembe", focus: "Async/Generator", tasks: ["js11 ve js15 oku", "Generator ile Fibonacci"], duration: "30 dk" },
            { day: "Cuma", focus: "Hata & Refactor", tasks: ["Mevcut kodlarını gözden geçir", "Hata yönetimi ekle"], duration: "45 dk" },
            { day: "Cumartesi", focus: "Büyük Proje", tasks: ["OOP ile mini kütüphane sistemi yaz", "Hata yönetimi ile sardır", "Test et"], duration: "90 dk" },
            { day: "Pazar", focus: "Kod İncelemesi", tasks: ["Kod Mentor ile analiz et", "İyileştirmeler yap"], duration: "30 dk" },
          ],
          focus_topics: ["OOP", "Closure", "Generator"],
          first_lesson: "OOP: Sınıflar & Nesneler",
          motivation: "Gerçek usta sürekli öğrenir. Bu haftaki hedefin: sadece kod yazmak değil, güzel kod yazmak!",
        },
      };
      setPlan(fallbacks[level] || fallbacks.beginner);
    }
    setLoading(false);
  };

  const dayColors = ["#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#64748b"];

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0f", color: "#e2e8f0",
      fontFamily: "'Inter', system-ui, sans-serif", padding: "24px",
      boxSizing: "border-box",
    }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>📋</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, background: "linear-gradient(135deg, #7c3aed, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
            Kişisel Planın Hazırlanıyor
          </h1>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
            <span style={{ background: lv.color + "22", color: lv.color, border: `1px solid ${lv.color}44`, borderRadius: 20, padding: "4px 14px", fontSize: 13, fontWeight: 600 }}>
              {lv.emoji} {lv.label}
            </span>
            <span style={{ background: "#06b6d422", color: "#06b6d4", border: "1px solid #06b6d444", borderRadius: 20, padding: "4px 14px", fontSize: 13, fontWeight: 600 }}>
              {styleLabels[learningStyle]}
            </span>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>⏳</div>
            <p style={{ color: "#64748b", fontSize: 15 }}>AI senin için özel plan hazırlıyor...</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: "50%", background: "#7c3aed",
                  animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
            <style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }`}</style>
          </div>
        )}

        {/* Plan */}
        {!loading && plan && (
          <div>
            {/* Haftalık Hedef */}
            <div style={{ background: "#0d0d14", border: "1px solid #7c3aed44", borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 24 }}>🎯</span>
                <div>
                  <div style={{ fontSize: 12, color: "#7c3aed", fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>HAFTALIK HEDEF</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", marginBottom: 6 }}>{plan.weekly_goal}</div>
                  {plan.weekly_summary && <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{plan.weekly_summary}</div>}
                </div>
              </div>
            </div>

            {/* Günlük Program */}
            <div style={{ background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                📅 7 Günlük Program
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {plan.days.map((day, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 12, alignItems: "flex-start",
                    padding: "12px 14px", borderRadius: 10,
                    background: "#0a0a0f", border: `1px solid ${dayColors[i]}22`,
                    borderLeft: `3px solid ${dayColors[i]}`,
                  }}>
                    <div style={{ flexShrink: 0, minWidth: 90 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: dayColors[i] }}>{day.day}</div>
                      <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>⏱ {day.duration}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#cbd5e1", marginBottom: 4 }}>{day.focus}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {day.tasks.map((task, j) => (
                          <div key={j} style={{ fontSize: 12, color: "#64748b", display: "flex", gap: 6, alignItems: "flex-start" }}>
                            <span style={{ color: dayColors[i], flexShrink: 0, marginTop: 1 }}>›</span>
                            {task}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alt Bilgiler */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div style={{ background: "#0d0d14", border: "1px solid #06b6d444", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, color: "#06b6d4", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>ODAK KONULARI</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {plan.focus_topics.map(t => (
                    <span key={t} style={{ background: "#06b6d422", color: "#06b6d4", border: "1px solid #06b6d444", borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ background: "#0d0d14", border: "1px solid #f59e0b44", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, color: "#f59e0b", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>💡 MOTİVASYON</div>
                <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{plan.motivation}</div>
              </div>
            </div>

            {/* İlk Ders Önerisi */}
            {plan.first_lesson && (
              <div style={{ background: "#1e1e3a", border: "1px solid #7c3aed44", borderRadius: 12, padding: 16, marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>🚀</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: "#a78bfa", fontWeight: 700, marginBottom: 2 }}>BUGÜN BAŞLA</div>
                  <div style={{ fontSize: 14, color: "#e2e8f0", fontWeight: 600 }}>{plan.first_lesson}</div>
                </div>
              </div>
            )}

            {/* Butonlar */}
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={generatePlan} style={{
                padding: "10px 20px", borderRadius: 8, border: "1px solid #2d2d4e",
                background: "#1e1e2e", color: "#a78bfa", cursor: "pointer",
                fontSize: 13, fontWeight: 600,
              }}>
                🔄 Yeniden Oluştur
              </button>
              <button onClick={onDone} style={{
                padding: "12px 32px", borderRadius: 8, border: "none",
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                color: "#fff", cursor: "pointer", fontSize: 15, fontWeight: 700,
              }}>
                Platforma Gir! 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default LearnPilotAI;
