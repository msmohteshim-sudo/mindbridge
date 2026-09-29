export interface Translations {
  selectLanguage: string;
  selectLanguageHeader: string;
  welcomeBack: string;
  patientMode: string;
  caregiverSupport: string;
  doctorPortal: string;
  beginSession: string;
  home: string;
  activities: string;
  games: string;
  myMemories: string;
  voiceCompanion: string;
  settings: string;
  languageLabel: string;
}

export const translations: Record<string, Translations> = {
  en: {
    selectLanguage: 'Select Language',
    selectLanguageHeader: 'Select Language / Choose your preferred language',
    welcomeBack: 'Good morning!',
    patientMode: 'Patient Mode',
    caregiverSupport: 'Caregiver Support',
    doctorPortal: 'Doctor Portal',
    beginSession: "Begin Today's Session",
    home: 'Home',
    activities: 'Activities',
    games: 'Games',
    myMemories: 'My Memories',
    voiceCompanion: 'Voice Companion',
    settings: 'Settings',
    languageLabel: 'Language',
  },
  hi: {
    selectLanguage: 'भाषा का चयन करें',
    selectLanguageHeader: 'Select Language / भाषा का चयन करें',
    welcomeBack: 'शुभ प्रभात!',
    patientMode: 'मरीज़ मोड',
    caregiverSupport: 'देखभालकर्ता मोड',
    doctorPortal: 'चिकित्सक पोर्टल',
    beginSession: 'आज का सत्र शुरू करें',
    home: 'मुख्य पृष्ठ',
    activities: 'गतिविधियाँ',
    games: 'खेल',
    myMemories: 'मेरी यादें',
    voiceCompanion: 'वॉइस सहायक',
    settings: 'सेटिंग्स',
    languageLabel: 'भाषा',
  },
  mr: {
    selectLanguage: 'भाषा निवडा',
    selectLanguageHeader: 'Select Language / भाषा निवडा',
    welcomeBack: 'शुभ प्रभात!',
    patientMode: 'रुग्ण मोड',
    caregiverSupport: 'काळजीवाहू मोड',
    doctorPortal: 'डॉक्टर पोर्टल',
    beginSession: 'आजचे सत्र सुरू करा',
    home: 'मुख्य पृष्ठ',
    activities: 'उपक्रम',
    games: 'खेळ',
    myMemories: 'माझ्या आठवणी',
    voiceCompanion: 'व्हॉइस साथी',
    settings: 'सेटिंग्ज',
    languageLabel: 'भाषा',
  },
  as: {
    selectLanguage: 'ভাষা বাছক',
    selectLanguageHeader: 'Select Language / ভাষা বাছক',
    welcomeBack: 'সুপ্রভাত!',
    patientMode: 'ৰোগী ম’ড',
    caregiverSupport: 'যত্নলোৱা ব্যক্তি ম’ড',
    doctorPortal: 'চিকিৎসক পৰ্টেল',
    beginSession: 'আজিৰ সত্ৰ আৰম্ভ কৰক',
    home: 'মুখ্য পৃষ্ঠা',
    activities: 'কাৰ্যসূচী',
    games: 'খেলসমূহ',
    myMemories: 'মোৰ স্মৃতিসমূহ',
    voiceCompanion: 'ভইচ সংগী',
    settings: 'ছেটিংছ',
    languageLabel: 'ভাষা',
  },
  mni: {
    selectLanguage: 'লোন খাংবিয়ু',
    selectLanguageHeader: 'Select Language / লোন খাংবিয়ু',
    welcomeBack: 'য়াইফবা নুমিৎ!',
    patientMode: 'অনাবা মোড',
    caregiverSupport: 'য়োকখাইবগী মোড',
    doctorPortal: 'ডাক্তারগী পোর্তাল',
    beginSession: 'ঙসিগী সেসন হৌবিয়ু',
    home: 'য়ুম',
    activities: 'থৌরমশিং',
    games: 'শেলানশিং',
    myMemories: 'ঐগী নিংশিংবাশিং',
    voiceCompanion: 'খোঞ্জেলী পাংবাপা',
    settings: 'সেতিংশিং',
    languageLabel: 'লোন',
  },
  brx: {
    selectLanguage: 'राव सायखनाय',
    selectLanguageHeader: 'Select Language / राव सायखनाय',
    welcomeBack: 'गाहाम फुंबिलि!',
    patientMode: 'नाजाग्रा मोड',
    caregiverSupport: 'सामलायग्रा मोड',
    doctorPortal: 'डाक्टर पोथार',
    beginSession: 'दिनैनि हाबाफारि जागाय',
    home: 'न',
    activities: 'हाबाफारिफोर',
    games: 'गेमफोर',
    myMemories: 'आंनि गोसोखांथिनायफोर',
    voiceCompanion: 'राव मददगिरि',
    settings: 'सेतिंसफोर',
    languageLabel: 'राव',
  },
};

export function getTranslation(langCode: string, key: keyof Translations): string {
  const lang = translations[langCode] || translations.en;
  return lang[key] || translations.en[key] || key;
}
