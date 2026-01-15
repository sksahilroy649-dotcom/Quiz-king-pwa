export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

export interface Quiz {
  id: string;
  name: string;
  category: 'gk' | 'sports' | 'science';
  questions: Question[];
}

// GK (General Knowledge) questions pool
const gkQuestions: Question[] = [
  { id: 1, question: 'भारत की राजधानी क्या है?', options: ['मुंबई', 'दिल्ली', 'कोलकाता', 'चेन्नई'], correct: 1 },
  { id: 2, question: 'सूर्य किस दिशा में उगता है?', options: ['पश्चिम', 'उत्तर', 'पूर्व', 'दक्षिण'], correct: 2 },
  { id: 3, question: 'एक साल में कितने महीने होते हैं?', options: ['10', '11', '12', '13'], correct: 2 },
  { id: 4, question: 'हमारे शरीर में कितनी हड्डियाँ होती हैं?', options: ['206', '306', '106', '256'], correct: 0 },
  { id: 5, question: 'पानी का रासायनिक सूत्र क्या है?', options: ['CO2', 'H2O', 'O2', 'NaCl'], correct: 1 },
  { id: 6, question: 'भारत का राष्ट्रीय पक्षी कौन सा है?', options: ['कौआ', 'मोर', 'तोता', 'कबूतर'], correct: 1 },
  { id: 7, question: 'चाँद पर पहला कदम किसने रखा?', options: ['युरी गागरिन', 'नील आर्मस्ट्रांग', 'बज़ एल्ड्रिन', 'माइकल कॉलिन्स'], correct: 1 },
  { id: 8, question: 'विश्व का सबसे बड़ा महाद्वीप कौन सा है?', options: ['अफ्रीका', 'यूरोप', 'एशिया', 'ऑस्ट्रेलिया'], correct: 2 },
  { id: 9, question: 'गंगा नदी कहाँ से निकलती है?', options: ['हिमालय', 'विंध्य', 'अरावली', 'सतपुड़ा'], correct: 0 },
  { id: 10, question: 'भारत का सबसे छोटा राज्य कौन सा है?', options: ['गोवा', 'सिक्किम', 'त्रिपुरा', 'मणिपुर'], correct: 0 },
  { id: 11, question: 'ताजमहल किस शहर में है?', options: ['दिल्ली', 'जयपुर', 'आगरा', 'लखनऊ'], correct: 2 },
  { id: 12, question: 'भारत का राष्ट्रीय फूल कौन सा है?', options: ['गुलाब', 'कमल', 'गेंदा', 'चमेली'], correct: 1 },
  // Day 2
  { id: 13, question: 'भारत का सबसे बड़ा राज्य कौन सा है?', options: ['मध्य प्रदेश', 'राजस्थान', 'उत्तर प्रदेश', 'महाराष्ट्र'], correct: 1 },
  { id: 14, question: 'हिंदी दिवस कब मनाया जाता है?', options: ['14 सितंबर', '15 अगस्त', '26 जनवरी', '2 अक्टूबर'], correct: 0 },
  { id: 15, question: 'भारत के पहले प्रधानमंत्री कौन थे?', options: ['महात्मा गांधी', 'जवाहरलाल नेहरू', 'सरदार पटेल', 'राजेंद्र प्रसाद'], correct: 1 },
  { id: 16, question: 'गणतंत्र दिवस कब मनाया जाता है?', options: ['15 अगस्त', '26 जनवरी', '2 अक्टूबर', '14 नवंबर'], correct: 1 },
  { id: 17, question: 'भारत की सबसे लंबी नदी कौन सी है?', options: ['गंगा', 'यमुना', 'ब्रह्मपुत्र', 'गोदावरी'], correct: 0 },
  { id: 18, question: 'महात्मा गांधी का जन्म कब हुआ?', options: ['1869', '1879', '1889', '1859'], correct: 0 },
  { id: 19, question: 'भारत का राष्ट्रीय पशु कौन सा है?', options: ['हाथी', 'शेर', 'बाघ', 'हिरण'], correct: 2 },
  { id: 20, question: 'भारत में कितने राज्य हैं?', options: ['28', '29', '30', '31'], correct: 0 },
  { id: 21, question: 'इंडिया गेट कहाँ है?', options: ['मुंबई', 'कोलकाता', 'दिल्ली', 'चेन्नई'], correct: 2 },
  { id: 22, question: 'लाल किला किसने बनवाया?', options: ['अकबर', 'शाहजहाँ', 'औरंगजेब', 'जहांगीर'], correct: 1 },
  { id: 23, question: 'भारत को आजादी कब मिली?', options: ['1945', '1946', '1947', '1948'], correct: 2 },
  { id: 24, question: 'भारत का संविधान कब लागू हुआ?', options: ['1947', '1950', '1952', '1955'], correct: 1 },
  // Day 3
  { id: 25, question: 'बॉलीवुड किस शहर में है?', options: ['दिल्ली', 'मुंबई', 'कोलकाता', 'चेन्नई'], correct: 1 },
  { id: 26, question: 'दीवाली किस महीने में आती है?', options: ['सितंबर', 'अक्टूबर-नवंबर', 'दिसंबर', 'जनवरी'], correct: 1 },
  { id: 27, question: 'होली का त्योहार कब मनाया जाता है?', options: ['मार्च', 'अप्रैल', 'मई', 'जून'], correct: 0 },
  { id: 28, question: 'भारत का राष्ट्रीय गान क्या है?', options: ['वंदे मातरम', 'जन गण मन', 'सारे जहां से अच्छा', 'ऐ मेरे वतन के लोगों'], correct: 1 },
  { id: 29, question: 'भारत का राष्ट्रीय गीत क्या है?', options: ['जन गण मन', 'वंदे मातरम', 'सारे जहां से अच्छा', 'ऐ मेरे वतन के लोगों'], correct: 1 },
  { id: 30, question: 'कुतुब मीनार कहाँ है?', options: ['आगरा', 'जयपुर', 'दिल्ली', 'लखनऊ'], correct: 2 },
  { id: 31, question: 'हवा महल कहाँ है?', options: ['दिल्ली', 'जयपुर', 'आगरा', 'उदयपुर'], correct: 1 },
  { id: 32, question: 'गेटवे ऑफ इंडिया कहाँ है?', options: ['दिल्ली', 'कोलकाता', 'मुंबई', 'चेन्नई'], correct: 2 },
  { id: 33, question: 'चारमीनार कहाँ है?', options: ['हैदराबाद', 'बैंगलोर', 'चेन्नई', 'मुंबई'], correct: 0 },
  { id: 34, question: 'सप्ताह में कितने दिन होते हैं?', options: ['5', '6', '7', '8'], correct: 2 },
  { id: 35, question: 'भारत के पहले राष्ट्रपति कौन थे?', options: ['जवाहरलाल नेहरू', 'राजेंद्र प्रसाद', 'सर्वपल्ली राधाकृष्णन', 'जाकिर हुसैन'], correct: 1 },
  { id: 36, question: 'भारत की मुद्रा क्या है?', options: ['डॉलर', 'रुपया', 'यूरो', 'पाउंड'], correct: 1 },
];

// Sports questions pool
const sportsQuestions: Question[] = [
  { id: 1, question: 'क्रिकेट में एक ओवर में कितनी गेंदें होती हैं?', options: ['4', '5', '6', '8'], correct: 2 },
  { id: 2, question: 'भारत ने पहला क्रिकेट वर्ल्ड कप कब जीता?', options: ['1983', '1987', '2011', '2007'], correct: 0 },
  { id: 3, question: 'फुटबॉल में एक टीम में कितने खिलाड़ी होते हैं?', options: ['9', '10', '11', '12'], correct: 2 },
  { id: 4, question: 'ओलंपिक खेल कितने साल में होते हैं?', options: ['2', '3', '4', '5'], correct: 2 },
  { id: 5, question: 'सचिन तेंदुलकर ने कितने वर्ल्ड कप खेले?', options: ['5', '6', '7', '8'], correct: 1 },
  { id: 6, question: 'बैडमिंटन में शटलकॉक में कितने पंख होते हैं?', options: ['14', '16', '18', '20'], correct: 1 },
  { id: 7, question: 'हॉकी में भारत ने कितने ओलंपिक गोल्ड जीते?', options: ['6', '7', '8', '9'], correct: 2 },
  { id: 8, question: 'IPL की शुरुआत किस साल हुई?', options: ['2007', '2008', '2009', '2010'], correct: 1 },
  { id: 9, question: 'टेनिस के ग्रैंड स्लैम कितने होते हैं?', options: ['3', '4', '5', '6'], correct: 1 },
  { id: 10, question: 'भारत का राष्ट्रीय खेल कौन सा है?', options: ['क्रिकेट', 'हॉकी', 'फुटबॉल', 'कबड्डी'], correct: 1 },
  { id: 11, question: 'विराट कोहली किस टीम से खेलते हैं IPL में?', options: ['MI', 'CSK', 'RCB', 'KKR'], correct: 2 },
  { id: 12, question: 'FIFA वर्ल्ड कप कितने साल में होता है?', options: ['2', '3', '4', '5'], correct: 2 },
  // Day 2
  { id: 13, question: 'क्रिकेट पिच की लंबाई कितनी होती है?', options: ['20 गज', '22 गज', '24 गज', '26 गज'], correct: 1 },
  { id: 14, question: 'टेस्ट क्रिकेट में एक पारी में कितने विकेट होते हैं?', options: ['8', '9', '10', '11'], correct: 2 },
  { id: 15, question: 'मैराथन दौड़ कितने किलोमीटर की होती है?', options: ['40.195 km', '42.195 km', '44.195 km', '46.195 km'], correct: 1 },
  { id: 16, question: 'वॉलीबॉल में एक टीम में कितने खिलाड़ी होते हैं?', options: ['4', '5', '6', '7'], correct: 2 },
  { id: 17, question: 'बास्केटबॉल में एक टीम में कितने खिलाड़ी होते हैं?', options: ['4', '5', '6', '7'], correct: 1 },
  { id: 18, question: 'कबड्डी में एक टीम में कितने खिलाड़ी होते हैं?', options: ['5', '6', '7', '8'], correct: 2 },
  { id: 19, question: 'खो-खो में एक टीम में कितने खिलाड़ी होते हैं?', options: ['7', '8', '9', '10'], correct: 2 },
  { id: 20, question: 'टेबल टेनिस में बॉल का वजन कितना होता है?', options: ['2.5 ग्राम', '2.7 ग्राम', '3.0 ग्राम', '3.5 ग्राम'], correct: 1 },
  { id: 21, question: 'MS धोनी का जर्सी नंबर क्या है?', options: ['5', '7', '10', '18'], correct: 1 },
  { id: 22, question: 'रोहित शर्मा का जर्सी नंबर क्या है?', options: ['7', '18', '45', '63'], correct: 2 },
  { id: 23, question: 'भारत ने T20 वर्ल्ड कप पहली बार कब जीता?', options: ['2007', '2009', '2011', '2013'], correct: 0 },
  { id: 24, question: 'किस खिलाड़ी को God of Cricket कहते हैं?', options: ['विराट कोहली', 'सचिन तेंदुलकर', 'MS धोनी', 'रोहित शर्मा'], correct: 1 },
  // Day 3
  { id: 25, question: 'पीवी सिंधु किस खेल से जुड़ी हैं?', options: ['टेनिस', 'बैडमिंटन', 'टेबल टेनिस', 'स्क्वैश'], correct: 1 },
  { id: 26, question: 'नीरज चोपड़ा किस खेल से जुड़े हैं?', options: ['शॉट पुट', 'डिस्कस थ्रो', 'जेवलिन थ्रो', 'हाई जंप'], correct: 2 },
  { id: 27, question: 'मैरी कॉम किस खेल से जुड़ी हैं?', options: ['कुश्ती', 'बॉक्सिंग', 'जूडो', 'कराटे'], correct: 1 },
  { id: 28, question: 'सानिया मिर्ज़ा किस खेल से जुड़ी हैं?', options: ['बैडमिंटन', 'टेनिस', 'टेबल टेनिस', 'स्क्वैश'], correct: 1 },
  { id: 29, question: 'मिल्खा सिंह को क्या कहा जाता था?', options: ['फ्लाइंग सिख', 'गोल्डन बॉय', 'स्प्रिंट किंग', 'रेस मास्टर'], correct: 0 },
  { id: 30, question: 'ध्यानचंद किस खेल से जुड़े थे?', options: ['क्रिकेट', 'फुटबॉल', 'हॉकी', 'कबड्डी'], correct: 2 },
  { id: 31, question: 'भारत ने 2011 वर्ल्ड कप का फाइनल किसके खिलाफ जीता?', options: ['पाकिस्तान', 'ऑस्ट्रेलिया', 'श्रीलंका', 'इंग्लैंड'], correct: 2 },
  { id: 32, question: 'IPL में सबसे ज्यादा बार चैंपियन कौन सी टीम है?', options: ['MI', 'CSK', 'KKR', 'RCB'], correct: 0 },
  { id: 33, question: 'क्रिकेट में LBW का फुल फॉर्म क्या है?', options: ['Left Before Wicket', 'Leg Before Wicket', 'Leg Behind Wicket', 'Left Behind Wicket'], correct: 1 },
  { id: 34, question: 'बॉक्सिंग में कितने राउंड होते हैं?', options: ['8', '10', '12', '15'], correct: 2 },
  { id: 35, question: 'ओलंपिक में कितने रंग के रिंग होते हैं?', options: ['4', '5', '6', '7'], correct: 1 },
  { id: 36, question: 'विंबलडन किस खेल से जुड़ा है?', options: ['गोल्फ', 'टेनिस', 'क्रिकेट', 'फुटबॉल'], correct: 1 },
];

// Science questions pool
const scienceQuestions: Question[] = [
  { id: 1, question: 'पृथ्वी का एक चक्कर कितने दिन में पूरा होता है?', options: ['365', '366', '360', '364'], correct: 0 },
  { id: 2, question: 'बिजली का आविष्कार किसने किया?', options: ['न्यूटन', 'एडिसन', 'फ्रैंकलिन', 'टेस्ला'], correct: 2 },
  { id: 3, question: 'सबसे हल्की गैस कौन सी है?', options: ['ऑक्सीजन', 'नाइट्रोजन', 'हाइड्रोजन', 'हीलियम'], correct: 2 },
  { id: 4, question: 'प्रकाश की गति कितनी है?', options: ['3 लाख km/s', '3 करोड़ km/s', '3 हजार km/s', '30 लाख km/s'], correct: 0 },
  { id: 5, question: 'DNA का पूरा नाम क्या है?', options: ['डायरेक्ट न्यूक्लिक एसिड', 'डीऑक्सीराइबोन्यूक्लिक एसिड', 'डायनामिक न्यूक्लिक एसिड', 'डबल न्यूक्लिक एसिड'], correct: 1 },
  { id: 6, question: 'कंप्यूटर का दिमाग क्या कहलाता है?', options: ['RAM', 'ROM', 'CPU', 'Hard Disk'], correct: 2 },
  { id: 7, question: 'विटामिन C किस फल में ज्यादा होता है?', options: ['सेब', 'केला', 'संतरा', 'अंगूर'], correct: 2 },
  { id: 8, question: 'चुंबक किसे आकर्षित करता है?', options: ['लकड़ी', 'प्लास्टिक', 'लोहा', 'कागज'], correct: 2 },
  { id: 9, question: 'मोबाइल फोन का आविष्कार किसने किया?', options: ['स्टीव जॉब्स', 'मार्टिन कूपर', 'बिल गेट्स', 'एलन मस्क'], correct: 1 },
  { id: 10, question: 'सोलर सिस्टम में कितने ग्रह हैं?', options: ['7', '8', '9', '10'], correct: 1 },
  { id: 11, question: 'इंसान के शरीर में सबसे बड़ा अंग कौन सा है?', options: ['दिल', 'दिमाग', 'त्वचा', 'लीवर'], correct: 2 },
  { id: 12, question: 'प्रकाश संश्लेषण में कौन सी गैस निकलती है?', options: ['कार्बन डाइऑक्साइड', 'ऑक्सीजन', 'नाइट्रोजन', 'हाइड्रोजन'], correct: 1 },
  // Day 2
  { id: 13, question: 'पौधे किस गैस को अवशोषित करते हैं?', options: ['ऑक्सीजन', 'कार्बन डाइऑक्साइड', 'नाइट्रोजन', 'हाइड्रोजन'], correct: 1 },
  { id: 14, question: 'न्यूटन का पहला नियम किससे संबंधित है?', options: ['गति', 'जड़त्व', 'गुरुत्वाकर्षण', 'बल'], correct: 1 },
  { id: 15, question: 'ध्वनि की गति कितनी है?', options: ['343 m/s', '300 m/s', '400 m/s', '500 m/s'], correct: 0 },
  { id: 16, question: 'परमाणु का केंद्र क्या कहलाता है?', options: ['इलेक्ट्रॉन', 'प्रोटॉन', 'न्यूक्लियस', 'न्यूट्रॉन'], correct: 2 },
  { id: 17, question: 'आवर्त सारणी में कितने तत्व हैं?', options: ['108', '118', '128', '98'], correct: 1 },
  { id: 18, question: 'सोने का रासायनिक प्रतीक क्या है?', options: ['Ag', 'Au', 'Cu', 'Fe'], correct: 1 },
  { id: 19, question: 'चांदी का रासायनिक प्रतीक क्या है?', options: ['Ag', 'Au', 'Cu', 'Si'], correct: 0 },
  { id: 20, question: 'पानी किस तापमान पर उबलता है?', options: ['90°C', '95°C', '100°C', '105°C'], correct: 2 },
  { id: 21, question: 'बर्फ किस तापमान पर पिघलता है?', options: ['-5°C', '0°C', '5°C', '10°C'], correct: 1 },
  { id: 22, question: 'हमारे शरीर में सबसे कठोर पदार्थ क्या है?', options: ['हड्डी', 'नाखून', 'दांत का इनेमल', 'बाल'], correct: 2 },
  { id: 23, question: 'मनुष्य के दिल में कितने कक्ष होते हैं?', options: ['2', '3', '4', '5'], correct: 2 },
  { id: 24, question: 'रक्त का रंग लाल क्यों होता है?', options: ['लोहा', 'हीमोग्लोबिन', 'प्रोटीन', 'कैल्शियम'], correct: 1 },
  // Day 3
  { id: 25, question: 'मनुष्य के मुंह में कितने दांत होते हैं?', options: ['28', '30', '32', '34'], correct: 2 },
  { id: 26, question: 'मनुष्य के शरीर में सबसे बड़ी ग्रंथि कौन सी है?', options: ['थायरॉइड', 'पैंक्रियाज', 'लीवर', 'किडनी'], correct: 2 },
  { id: 27, question: 'विटामिन D का सबसे अच्छा स्रोत क्या है?', options: ['दूध', 'सूर्य की रोशनी', 'अंडा', 'मछली'], correct: 1 },
  { id: 28, question: 'आयरन की कमी से कौन सी बीमारी होती है?', options: ['मधुमेह', 'एनीमिया', 'गठिया', 'अस्थमा'], correct: 1 },
  { id: 29, question: 'बल्ब का आविष्कार किसने किया?', options: ['न्यूटन', 'एडिसन', 'फ्रैंकलिन', 'टेस्ला'], correct: 1 },
  { id: 30, question: 'टेलीफोन का आविष्कार किसने किया?', options: ['एडिसन', 'बेल', 'मार्कोनी', 'फ्रैंकलिन'], correct: 1 },
  { id: 31, question: 'रेडियो का आविष्कार किसने किया?', options: ['एडिसन', 'बेल', 'मार्कोनी', 'टेस्ला'], correct: 2 },
  { id: 32, question: 'पृथ्वी की सूर्य से दूरी कितनी है?', options: ['15 करोड़ km', '10 करोड़ km', '20 करोड़ km', '25 करोड़ km'], correct: 0 },
  { id: 33, question: 'चंद्रमा पृथ्वी का चक्कर कितने दिन में लगाता है?', options: ['27 दिन', '28 दिन', '29 दिन', '30 दिन'], correct: 0 },
  { id: 34, question: 'सबसे बड़ा ग्रह कौन सा है?', options: ['शनि', 'बृहस्पति', 'यूरेनस', 'नेप्चून'], correct: 1 },
  { id: 35, question: 'सबसे छोटा ग्रह कौन सा है?', options: ['बुध', 'मंगल', 'प्लूटो', 'शुक्र'], correct: 0 },
  { id: 36, question: 'लाल ग्रह किसे कहते हैं?', options: ['बुध', 'मंगल', 'शुक्र', 'बृहस्पति'], correct: 1 },
];

// Get questions for a specific day
export const getQuestionsForDay = (category: 'gk' | 'sports' | 'science', dayOffset: number = 0): Question[] => {
  let questions: Question[];
  switch (category) {
    case 'gk':
      questions = gkQuestions;
      break;
    case 'sports':
      questions = sportsQuestions;
      break;
    case 'science':
      questions = scienceQuestions;
      break;
    default:
      questions = gkQuestions;
  }
  
  const questionsPerDay = 12;
  const totalDays = Math.ceil(questions.length / questionsPerDay);
  
  // Calculate which day's questions to show (cycles through available questions)
  const dayIndex = dayOffset % totalDays;
  const startIndex = dayIndex * questionsPerDay;
  
  return questions.slice(startIndex, startIndex + questionsPerDay);
};

// Function to get today's date as a number for seeding
export const getTodayOffset = (): number => {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export const quizzes: Quiz[] = [
  {
    id: 'gk',
    name: 'GK Quiz - सामान्य ज्ञान',
    category: 'gk',
    questions: getQuestionsForDay('gk', getTodayOffset()),
  },
  {
    id: 'sports',
    name: 'Sports Quiz - खेल',
    category: 'sports',
    questions: getQuestionsForDay('sports', getTodayOffset()),
  },
  {
    id: 'science',
    name: 'Science Quiz - विज्ञान',
    category: 'science',
    questions: getQuestionsForDay('science', getTodayOffset()),
  },
];

// Daily limits - 36 total correct answers across all quizzes
export const DAILY_CORRECT_LIMIT = 36;

// Keys for localStorage
export const getDailyQuizKey = (quizId: string): string => {
  const today = new Date().toISOString().split('T')[0];
  return `quiz_played_${quizId}_${today}`;
};

export const getQuizProgressKey = (quizId: string): string => {
  const today = new Date().toISOString().split('T')[0];
  return `quiz_progress_${quizId}_${today}`;
};

export const getDailyCorrectKey = (): string => {
  const today = new Date().toISOString().split('T')[0];
  return `quiz_daily_correct_${today}`;
};

// Get remaining correct answers for today
export const getRemainingCorrectAnswers = (): number => {
  const key = getDailyCorrectKey();
  const usedCorrect = parseInt(localStorage.getItem(key) || '0', 10);
  return Math.max(0, DAILY_CORRECT_LIMIT - usedCorrect);
};

// Increment correct answer count
export const incrementCorrectCount = (): void => {
  const key = getDailyCorrectKey();
  const current = parseInt(localStorage.getItem(key) || '0', 10);
  localStorage.setItem(key, (current + 1).toString());
};

// Get total correct answers used today
export const getTodayCorrectCount = (): number => {
  const key = getDailyCorrectKey();
  return parseInt(localStorage.getItem(key) || '0', 10);
};

// Check if user can play quiz (has remaining correct answers and quiz not fully completed)
export const canPlayQuiz = (quizId: string): boolean => {
  const key = getDailyQuizKey(quizId);
  const played = localStorage.getItem(key);
  // Can play if not completed and has remaining correct answers
  return !played && getRemainingCorrectAnswers() > 0;
};

// Check if daily limit is reached
export const isDailyLimitReached = (): boolean => {
  return getRemainingCorrectAnswers() <= 0;
};

// Mark quiz as completed for today
export const markQuizPlayed = (quizId: string): void => {
  const key = getDailyQuizKey(quizId);
  localStorage.setItem(key, 'true');
  // Clear progress when quiz is completed
  const progressKey = getQuizProgressKey(quizId);
  localStorage.removeItem(progressKey);
};

// Save quiz progress
export interface QuizProgress {
  currentQuestion: number;
  score: number;
  totalEarned: number;
  answeredQuestions: number[]; // indices of answered questions
}

export const saveQuizProgress = (quizId: string, progress: QuizProgress): void => {
  const key = getQuizProgressKey(quizId);
  localStorage.setItem(key, JSON.stringify(progress));
};

export const getQuizProgress = (quizId: string): QuizProgress | null => {
  const key = getQuizProgressKey(quizId);
  const data = localStorage.getItem(key);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return null;
};

export const clearQuizProgress = (quizId: string): void => {
  const key = getQuizProgressKey(quizId);
  localStorage.removeItem(key);
};
