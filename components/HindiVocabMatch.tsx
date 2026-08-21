'use client';

import React, { useState, useEffect } from 'react';
import { unlockAudio } from '../lib/audio';

interface VocabItem {
  emoji: string;
  hindiName: string;
  hindiPhonetic: string;
  englishWord: string;
  category: string;
}

// 200 Core Foundational Words across 10 Categories
const VOCAB_DATABASE_200: VocabItem[] = [
  // 1. फल व मेवे (Fruits & Nuts - 20)
  { emoji: '🍎', hindiName: 'सेब', hindiPhonetic: 'Seb', englishWord: 'APPLE', category: 'फल (Fruits)' },
  { emoji: '🥭', hindiName: 'आम', hindiPhonetic: 'Aam', englishWord: 'MANGO', category: 'फल (Fruits)' },
  { emoji: '🍌', hindiName: 'केला', hindiPhonetic: 'Kela', englishWord: 'BANANA', category: 'फल (Fruits)' },
  { emoji: '🍇', hindiName: 'अंगूर', hindiPhonetic: 'Angoor', englishWord: 'GRAPES', category: 'फल (Fruits)' },
  { emoji: '🍊', hindiName: 'संतरा', hindiPhonetic: 'Santara', englishWord: 'ORANGE', category: 'फल (Fruits)' },
  { emoji: '🍉', hindiName: 'तरबूज', hindiPhonetic: 'Tarbooj', englishWord: 'WATERMELON', category: 'फल (Fruits)' },
  { emoji: '🍍', hindiName: 'अनानास', hindiPhonetic: 'Ananaas', englishWord: 'PINEAPPLE', category: 'फल (Fruits)' },
  { emoji: '🍓', hindiName: 'स्ट्रॉबेरी', hindiPhonetic: 'Strawberry', englishWord: 'STRAWBERRY', category: 'फल (Fruits)' },
  { emoji: '🍈', hindiName: 'पपीता', hindiPhonetic: 'Papeeta', englishWord: 'PAPAYA', category: 'फल (Fruits)' },
  { emoji: '🥥', hindiName: 'नारियल', hindiPhonetic: 'Nariyal', englishWord: 'COCONUT', category: 'फल (Fruits)' },
  { emoji: '🍒', hindiName: 'चेरी', hindiPhonetic: 'Cherry', englishWord: 'CHERRY', category: 'फल (Fruits)' },
  { emoji: '🍑', hindiName: 'आड़ू', hindiPhonetic: 'Aadoo', englishWord: 'PEACH', category: 'फल (Fruits)' },
  { emoji: '🍐', hindiName: 'नाशपाती', hindiPhonetic: 'Nashpati', englishWord: 'PEAR', category: 'फल (Fruits)' },
  { emoji: '🍋', hindiName: 'नींबू', hindiPhonetic: 'Nimbu', englishWord: 'LEMON', category: 'फल (Fruits)' },
  { emoji: '🥝', hindiName: 'कीवी', hindiPhonetic: 'Kiwi', englishWord: 'KIWI', category: 'फल (Fruits)' },
  { emoji: '🥑', hindiName: 'मक्खन फल', hindiPhonetic: 'Avocado', englishWord: 'AVOCADO', category: 'फल (Fruits)' },
  { emoji: '🥜', hindiName: 'मूंगफली', hindiPhonetic: 'Moongfali', englishWord: 'PEANUT', category: 'फल (Fruits)' },
  { emoji: '🌰', hindiName: 'अखरोट', hindiPhonetic: 'Akhrot', englishWord: 'WALNUT', category: 'फल (Fruits)' },
  { emoji: '🍈', hindiName: 'खरबूजा', hindiPhonetic: 'Kharbooja', englishWord: 'MELON', category: 'फल (Fruits)' },
  { emoji: '🫐', hindiName: 'जामुन', hindiPhonetic: 'Jamun', englishWord: 'BERRY', category: 'फल (Fruits)' },

  // 2. सब्जियां (Vegetables - 20)
  { emoji: '🥔', hindiName: 'आलू', hindiPhonetic: 'Aaloo', englishWord: 'POTATO', category: 'सब्जियां (Vegetables)' },
  { emoji: '🍅', hindiName: 'टमाटर', hindiPhonetic: 'Tamatar', englishWord: 'TOMATO', category: 'सब्जियां (Vegetables)' },
  { emoji: '🧅', hindiName: 'प्याज', hindiPhonetic: 'Pyaaz', englishWord: 'ONION', category: 'सब्जियां (Vegetables)' },
  { emoji: '🥕', hindiName: 'गाजर', hindiPhonetic: 'Gajar', englishWord: 'CARROT', category: 'सब्जियां (Vegetables)' },
  { emoji: '🧄', hindiName: 'लहसुन', hindiPhonetic: 'Lahsun', englishWord: 'GARLIC', category: 'सब्जियां (Vegetables)' },
  { emoji: '🥒', hindiName: 'खीरा', hindiPhonetic: 'Kheera', englishWord: 'CUCUMBER', category: 'सब्जियां (Vegetables)' },
  { emoji: '🥦', hindiName: 'गोभी', hindiPhonetic: 'Gobhi', englishWord: 'BROCCOLI', category: 'सब्जियां (Vegetables)' },
  { emoji: '🌽', hindiName: 'मक्का / भुट्टा', hindiPhonetic: 'Bhutta', englishWord: 'CORN', category: 'सब्जियां (Vegetables)' },
  { emoji: '🫑', hindiName: 'शिमला मिर्च', hindiPhonetic: 'Shimla Mirch', englishWord: 'CAPSICUM', category: 'सब्जियां (Vegetables)' },
  { emoji: '🥬', hindiName: 'पालक', hindiPhonetic: 'Paalak', englishWord: 'SPINACH', category: 'सब्जियां (Vegetables)' },
  { emoji: '🍆', hindiName: 'बैंगन', hindiPhonetic: 'Baingan', englishWord: 'BRINJAL', category: 'सब्जियां (Vegetables)' },
  { emoji: '🫛', hindiName: 'मटर', hindiPhonetic: 'Matar', englishWord: 'PEAS', category: 'सब्जियां (Vegetables)' },
  { emoji: '🌶️', hindiName: 'मिर्च', hindiPhonetic: 'Mirch', englishWord: 'CHILLI', category: 'सब्जियां (Vegetables)' },
  { emoji: '🫚', hindiName: 'अदरक', hindiPhonetic: 'Adrak', englishWord: 'GINGER', category: 'सब्जियां (Vegetables)' },
  { emoji: '🎃', hindiName: 'कद्दू', hindiPhonetic: 'Kaddu', englishWord: 'PUMPKIN', category: 'सब्जियां (Vegetables)' },
  { emoji: '🍄', hindiName: 'कुकुरमुत्ता', hindiPhonetic: 'Kukurmutta', englishWord: 'MUSHROOM', category: 'सब्जियां (Vegetables)' },
  { emoji: '🥗', hindiName: 'सलाद', hindiPhonetic: 'Salaad', englishWord: 'SALAD', category: 'सब्जियां (Vegetables)' },
  { emoji: '🌿', hindiName: 'पुदीना / धनिया', hindiPhonetic: 'Pudina', englishWord: 'HERB', category: 'सब्जियां (Vegetables)' },
  { emoji: '🍠', hindiName: 'शकरकंद', hindiPhonetic: 'Shakarkand', englishWord: 'SWEET POTATO', category: 'सब्जियां (Vegetables)' },
  { emoji: '🫒', hindiName: 'जैतून', hindiPhonetic: 'Jaitoon', englishWord: 'OLIVE', category: 'सब्जियां (Vegetables)' },

  // 3. जानवर (Animals - 20)
  { emoji: '🐶', hindiName: 'कुत्ता', hindiPhonetic: 'Kutta', englishWord: 'DOG', category: 'जानवर (Animals)' },
  { emoji: '🐱', hindiName: 'बिल्ली', hindiPhonetic: 'Billi', englishWord: 'CAT', category: 'जानवर (Animals)' },
  { emoji: '🐘', hindiName: 'हाथी', hindiPhonetic: 'Haathi', englishWord: 'ELEPHANT', category: 'जानवर (Animals)' },
  { emoji: '🦁', hindiName: 'शेर', hindiPhonetic: 'Sher', englishWord: 'LION', category: 'जानवर (Animals)' },
  { emoji: '🐯', hindiName: 'बाघ', hindiPhonetic: 'Baagh', englishWord: 'TIGER', category: 'जानवर (Animals)' },
  { emoji: '🐵', hindiName: 'बंदर', hindiPhonetic: 'Bandar', englishWord: 'MONKEY', category: 'जानवर (Animals)' },
  { emoji: '🐴', hindiName: 'घोड़ा', hindiPhonetic: 'Ghoda', englishWord: 'HORSE', category: 'जानवर (Animals)' },
  { emoji: '🐮', hindiName: 'गाय', hindiPhonetic: 'Gaay', englishWord: 'COW', category: 'जानवर (Animals)' },
  { emoji: '🐑', hindiName: 'भेड़', hindiPhonetic: 'Bhed', englishWord: 'SHEEP', category: 'जानवर (Animals)' },
  { emoji: '🐐', hindiName: 'बकरी', hindiPhonetic: 'Bakri', englishWord: 'GOAT', category: 'जानवर (Animals)' },
  { emoji: '🐰', hindiName: 'खरगोश', hindiPhonetic: 'Khargosh', englishWord: 'RABBIT', category: 'जानवर (Animals)' },
  { emoji: '🐻', hindiName: 'भालू', hindiPhonetic: 'Bhaalu', englishWord: 'BEAR', category: 'जानवर (Animals)' },
  { emoji: '🦒', hindiName: 'जिराफ़', hindiPhonetic: 'Giraffe', englishWord: 'GIRAFFE', category: 'जानवर (Animals)' },
  { emoji: '🦓', hindiName: 'ज़ेबरा', hindiPhonetic: 'Zebra', englishWord: 'ZEBRA', category: 'जानवर (Animals)' },
  { emoji: '🐪', hindiName: 'ऊँट', hindiPhonetic: 'Oont', englishWord: 'CAMEL', category: 'जानवर (Animals)' },
  { emoji: '🦌', hindiName: 'हिरण', hindiPhonetic: 'Hiran', englishWord: 'DEER', category: 'जानवर (Animals)' },
  { emoji: '🦊', hindiName: 'लोमड़ी', hindiPhonetic: 'Lomdi', englishWord: 'FOX', category: 'जानवर (Animals)' },
  { emoji: '🐷', hindiName: 'सुअर', hindiPhonetic: 'Suar', englishWord: 'PIG', category: 'जानवर (Animals)' },
  { emoji: '🐭', hindiName: 'चूहा', hindiPhonetic: 'Chooha', englishWord: 'MOUSE', category: 'जानवर (Animals)' },
  { emoji: '🐸', hindiName: 'मेंढक', hindiPhonetic: 'Mendhak', englishWord: 'FROG', category: 'जानवर (Animals)' },

  // 4. पक्षी व कीट (Birds & Insects - 20)
  { emoji: '🦜', hindiName: 'तोता', hindiPhonetic: 'Tota', englishWord: 'PARROT', category: 'पक्षी (Birds)' },
  { emoji: '🦚', hindiName: 'मोर', hindiPhonetic: 'Mor', englishWord: 'PEACOCK', category: 'पक्षी (Birds)' },
  { emoji: '🦅', hindiName: 'चील / बाज़', hindiPhonetic: 'Cheel', englishWord: 'EAGLE', category: 'पक्षी (Birds)' },
  { emoji: '🦉', hindiName: 'उल्लू', hindiPhonetic: 'Ullu', englishWord: 'OWL', category: 'पक्षी (Birds)' },
  { emoji: '🦆', hindiName: 'बत्तख', hindiPhonetic: 'Batthakh', englishWord: 'DUCK', category: 'पक्षी (Birds)' },
  { emoji: '🐦', hindiName: 'चिड़िया', hindiPhonetic: 'Chidiya', englishWord: 'SPARROW', category: 'पक्षी (Birds)' },
  { emoji: '🕊️', hindiName: 'कबूतर', hindiPhonetic: 'Kabootar', englishWord: 'PIGEON', category: 'पक्षी (Birds)' },
  { emoji: '🦢', hindiName: 'हंस', hindiPhonetic: 'Hans', englishWord: 'SWAN', category: 'पक्षी (Birds)' },
  { emoji: '🐧', hindiName: 'पेंगुइन', hindiPhonetic: 'Penguin', englishWord: 'PENGUIN', category: 'पक्षी (Birds)' },
  { emoji: '🐔', hindiName: 'मुर्गी', hindiPhonetic: 'Murgi', englishWord: 'HEN', category: 'पक्षी (Birds)' },
  { emoji: '🐓', hindiName: 'मुर्गा', hindiPhonetic: 'Murga', englishWord: 'ROOSTER', category: 'पक्षी (Birds)' },
  { emoji: '🦋', hindiName: 'तितली', hindiPhonetic: 'Titli', englishWord: 'BUTTERFLY', category: 'कीट (Insects)' },
  { emoji: '🐝', hindiName: 'मधुमक्खी', hindiPhonetic: 'Madhumakkhi', englishWord: 'BEE', category: 'कीट (Insects)' },
  { emoji: '🐜', hindiName: 'चींटी', hindiPhonetic: 'Cheenti', englishWord: 'ANT', category: 'कीट (Insects)' },
  { emoji: '🕷️', hindiName: 'मकड़ी', hindiPhonetic: 'Makdi', englishWord: 'SPIDER', category: 'कीट (Insects)' },
  { emoji: '🪲', hindiName: 'भृंग / कीड़ा', hindiPhonetic: 'Keeda', englishWord: 'BEETLE', category: 'कीट (Insects)' },
  { emoji: '🦟', hindiName: 'मच्छर', hindiPhonetic: 'Machhar', englishWord: 'MOSQUITO', category: 'कीट (Insects)' },
  { emoji: '🪰', hindiName: 'मक्खी', hindiPhonetic: 'Makkhi', englishWord: 'FLY', category: 'कीट (Insects)' },
  { emoji: '🐌', hindiName: 'घोंघा', hindiPhonetic: 'Ghongha', englishWord: 'SNAIL', category: 'कीट (Insects)' },
  { emoji: '🐛', hindiName: 'इल्ली', hindiPhonetic: 'Illi', englishWord: 'CATERPILLAR', category: 'कीट (Insects)' },

  // 5. शरीर के अंग (Body Parts - 20)
  { emoji: '👁️', hindiName: 'आँख', hindiPhonetic: 'Aankh', englishWord: 'EYE', category: 'शरीर के अंग (Body Parts)' },
  { emoji: '👂', hindiName: 'कान', hindiPhonetic: 'Kaan', englishWord: 'EAR', category: 'शरीर के अंग (Body Parts)' },
  { emoji: '👃', hindiName: 'नाक', hindiPhonetic: 'Naak', englishWord: 'NOSE', category: 'शरीर के अंग (Body Parts)' },
  { emoji: '👄', hindiName: 'मुँह / होंठ', hindiPhonetic: 'Munh', englishWord: 'MOUTH', category: 'शरीर के अंग (Body Parts)' },
  { emoji: '🦷', hindiName: 'दाँत', hindiPhonetic: 'Daant', englishWord: 'TOOTH', category: 'शरीर के अंग (Body Parts)' },
  { emoji: '👅', hindiName: 'जीभ', hindiPhonetic: 'Jeebh', englishWord: 'TONGUE', category: 'शरीर के अंग (Body Parts)' },
  { emoji: '✋', hindiName: 'हाथ', hindiPhonetic: 'Haath', englishWord: 'HAND', category: 'शरीर के अंग (Body Parts)' },
  { emoji: '🦶', hindiName: 'पैर', hindiPhonetic: 'Pair', englishWord: 'FOOT', category: 'शरीर के अंग (Body Parts)' },
  { emoji: '🦵', hindiName: 'टाँग', hindiPhonetic: 'Taang', englishWord: 'LEG', category: 'शरीर के अंग (Body Parts)' },
  { emoji: '💪', hindiName: 'बाँह / भुजा', hindiPhonetic: 'Baahn', englishWord: 'ARM', category: 'शरीर के अंग (Body Parts)' },
  { emoji: '🧠', hindiName: 'दिमाग', hindiPhonetic: 'Dimaag', englishWord: 'BRAIN', category: 'शरीर के अंग (Body Parts)' },
  { emoji: '🫀', hindiName: 'दिल', hindiPhonetic: 'Dil', englishWord: 'HEART', category: 'शरीर के अंग (Body Parts)' },
  { emoji: '🦲', hindiName: 'सिर', hindiPhonetic: 'Sir', englishWord: 'HEAD', category: 'शरीर के अंग (Body Parts)' },
  { emoji: '💇', hindiName: 'बाल', hindiPhonetic: 'Baal', englishWord: 'HAIR', category: 'शरीर के अंग (Body Parts)' },
  { emoji: '💅', hindiName: 'नाखून', hindiPhonetic: 'Naakhoon', englishWord: 'NAIL', category: 'शरीर के अंग (Body Parts)' },
  { emoji: '🦴', hindiName: 'हड्डी', hindiPhonetic: 'Haddi', englishWord: 'BONE', category: 'शरीर के अंग (Body Parts)' },
  { emoji: '🫁', hindiName: 'फेफड़े', hindiPhonetic: 'Fefde', englishWord: 'LUNGS', category: 'शरीर के अंग (Body Parts)' },
  { emoji: '🧔', hindiName: 'चेहरा', hindiPhonetic: 'Chehra', englishWord: 'FACE', category: 'शरीर के अंग (Body Parts)' },
  { emoji: '🖐️', hindiName: 'उंगली', hindiPhonetic: 'Ungli', englishWord: 'FINGER', category: 'शरीर के अंग (Body Parts)' },
  { emoji: '👍', hindiName: 'अंगूठा', hindiPhonetic: 'Angootha', englishWord: 'THUMB', category: 'शरीर के अंग (Body Parts)' },

  // 6. स्कूल व पढ़ाई (School & Stationery - 20)
  { emoji: '📖', hindiName: 'किताब', hindiPhonetic: 'Kitaab', englishWord: 'BOOK', category: 'स्कूल (School)' },
  { emoji: '✏️', hindiName: 'पेंसिल', hindiPhonetic: 'Pencil', englishWord: 'PENCIL', category: 'स्कूल (School)' },
  { emoji: '🖊️', hindiName: 'कलम', hindiPhonetic: 'Kalam', englishWord: 'PEN', category: 'स्कूल (School)' },
  { emoji: '🎒', hindiName: 'बस्ता / बैग', hindiPhonetic: 'Basta', englishWord: 'BAG', category: 'स्कूल (School)' },
  { emoji: '📏', hindiName: 'पटरी / स्केल', hindiPhonetic: 'Scale', englishWord: 'RULER', category: 'स्कूल (School)' },
  { emoji: '✂️', hindiName: 'कैंची', hindiPhonetic: 'Kainchi', englishWord: 'SCISSORS', category: 'स्कूल (School)' },
  { emoji: '🪑', hindiName: 'कुर्सी', hindiPhonetic: 'Kursi', englishWord: 'CHAIR', category: 'स्कूल (School)' },
  { emoji: '🪵', hindiName: 'मेज़', hindiPhonetic: 'Mez', englishWord: 'TABLE', category: 'स्कूल (School)' },
  { emoji: '🏫', hindiName: 'विद्यालय / स्कूल', hindiPhonetic: 'School', englishWord: 'SCHOOL', category: 'स्कूल (School)' },
  { emoji: '👩‍🏫', hindiName: 'अध्यापिका / शिक्षक', hindiPhonetic: 'Shikshak', englishWord: 'TEACHER', category: 'स्कूल (School)' },
  { emoji: '🧑‍🎓', hindiName: 'छात्र / विद्यार्थी', hindiPhonetic: 'Chhatra', englishWord: 'STUDENT', category: 'स्कूल (School)' },
  { emoji: '🖍️', hindiName: 'रंगीन मोमबत्ती', hindiPhonetic: 'Crayon', englishWord: 'CRAYON', category: 'स्कूल (School)' },
  { emoji: '📝', hindiName: 'कागज़ / पर्चा', hindiPhonetic: 'Kagaz', englishWord: 'PAPER', category: 'स्कूल (School)' },
  { emoji: '🧴', hindiName: 'गोंद', hindiPhonetic: 'Gond', englishWord: 'GLUE', category: 'स्कूल (School)' },
  { emoji: '💻', hindiName: 'कंप्यूटर', hindiPhonetic: 'Computer', englishWord: 'COMPUTER', category: 'स्कूल (School)' },
  { emoji: '🔔', hindiName: 'घंटी', hindiPhonetic: 'Ghanti', englishWord: 'BELL', category: 'स्कूल (School)' },
  { emoji: '🎨', hindiName: 'रंग पैलेट', hindiPhonetic: 'Paint', englishWord: 'PAINT', category: 'स्कूल (School)' },
  { emoji: '📐', hindiName: 'त्रिभुज स्केल', hindiPhonetic: 'Triangle Ruler', englishWord: 'SET SQUARE', category: 'स्कूल (School)' },
  { emoji: '🗂️', hindiName: 'फ़ाइल', hindiPhonetic: 'File', englishWord: 'FOLDER', category: 'स्कूल (School)' },
  { emoji: '⏰', hindiName: 'घड़ी', hindiPhonetic: 'Ghadi', englishWord: 'CLOCK', category: 'स्कूल (School)' },

  // 7. घर व रसोई (Home & Kitchen - 20)
  { emoji: '🏠', hindiName: 'घर', hindiPhonetic: 'Ghar', englishWord: 'HOUSE', category: 'घर (Home)' },
  { emoji: '🚪', hindiName: 'दरवाजा', hindiPhonetic: 'Darwaza', englishWord: 'DOOR', category: 'घर (Home)' },
  { emoji: '🪟', hindiName: 'खिड़की', hindiPhonetic: 'Khidki', englishWord: 'WINDOW', category: 'घर (Home)' },
  { emoji: '🛏️', hindiName: 'बिस्तर / पलंग', hindiPhonetic: 'Bistar', englishWord: 'BED', category: 'घर (Home)' },
  { emoji: '🛋️', hindiName: 'सोफा', hindiPhonetic: 'Sofa', englishWord: 'SOFA', category: 'घर (Home)' },
  { emoji: '🍽️', hindiName: 'थाली', hindiPhonetic: 'Thaali', englishWord: 'PLATE', category: 'रसोई (Kitchen)' },
  { emoji: '🥄', hindiName: 'चम्मच', hindiPhonetic: 'Chammach', englishWord: 'SPOON', category: 'रसोई (Kitchen)' },
  { emoji: '🍴', hindiName: 'काँटा', hindiPhonetic: 'Kaanta', englishWord: 'FORK', category: 'रसोई (Kitchen)' },
  { emoji: '🔪', hindiName: 'चाकू', hindiPhonetic: 'Chaaku', englishWord: 'KNIFE', category: 'रसोई (Kitchen)' },
  { emoji: '☕', hindiName: 'कप', hindiPhonetic: 'Cup', englishWord: 'CUP', category: 'रसोई (Kitchen)' },
  { emoji: '🥛', hindiName: 'गिलास / दूध', hindiPhonetic: 'Gilaas', englishWord: 'GLASS', category: 'रसोई (Kitchen)' },
  { emoji: '🫖', hindiName: 'केतली', hindiPhonetic: 'Ketli', englishWord: 'KETTLE', category: 'रसोई (Kitchen)' },
  { emoji: '🪥', hindiName: 'टूथब्रश', hindiPhonetic: 'Toothbrush', englishWord: 'BRUSH', category: 'घर (Home)' },
  { emoji: '🧼', hindiName: 'साबुन', hindiPhonetic: 'Saabun', englishWord: 'SOAP', category: 'घर (Home)' },
  { emoji: '🚿', hindiName: 'फुहारा', hindiPhonetic: 'Fuhara', englishWord: 'SHOWER', category: 'घर (Home)' },
  { emoji: '🔑', hindiName: 'चाबी', hindiPhonetic: 'Chaabi', englishWord: 'KEY', category: 'घर (Home)' },
  { emoji: '🔒', hindiName: 'ताला', hindiPhonetic: 'Taala', englishWord: 'LOCK', category: 'घर (Home)' },
  { emoji: '🕯️', hindiName: 'मोमबत्ती', hindiPhonetic: 'Mombatti', englishWord: 'CANDLE', category: 'घर (Home)' },
  { emoji: '💡', hindiName: 'बल्ब / लैंप', hindiPhonetic: 'Bulb', englishWord: 'LAMP', category: 'घर (Home)' },
  { emoji: '🪞', hindiName: 'आईना / शीशा', hindiPhonetic: 'Aaina', englishWord: 'MIRROR', category: 'घर (Home)' },

  // 8. वाहन व यातायात (Vehicles & Transport - 20)
  { emoji: '🚗', hindiName: 'कार / गाड़ी', hindiPhonetic: 'Gaadi', englishWord: 'CAR', category: 'वाहन (Vehicles)' },
  { emoji: '🚌', hindiName: 'बस', hindiPhonetic: 'Bus', englishWord: 'BUS', category: 'वाहन (Vehicles)' },
  { emoji: '🚲', hindiName: 'साइकिल', hindiPhonetic: 'Cycle', englishWord: 'BICYCLE', category: 'वाहन (Vehicles)' },
  { emoji: '🛵', hindiName: 'स्कूटर', hindiPhonetic: 'Scooter', englishWord: 'SCOOTER', category: 'वाहन (Vehicles)' },
  { emoji: '🏍️', hindiName: 'मोटरसाइकिल', hindiPhonetic: 'Motorcycle', englishWord: 'MOTORBIKE', category: 'वाहन (Vehicles)' },
  { emoji: '🚂', hindiName: 'रेलगाड़ी', hindiPhonetic: 'Railgaadi', englishWord: 'TRAIN', category: 'वाहन (Vehicles)' },
  { emoji: '✈️', hindiName: 'हवाई जहाज', hindiPhonetic: 'Hawai Jahaz', englishWord: 'AIRPLANE', category: 'वाहन (Vehicles)' },
  { emoji: '🚁', hindiName: 'हेलिकॉप्टर', hindiPhonetic: 'Helicopter', englishWord: 'HELICOPTER', category: 'वाहन (Vehicles)' },
  { emoji: '⛵', hindiName: 'नाव', hindiPhonetic: 'Naav', englishWord: 'BOAT', category: 'वाहन (Vehicles)' },
  { emoji: '🚢', hindiName: 'पानी का जहाज', hindiPhonetic: 'Jahaz', englishWord: 'SHIP', category: 'वाहन (Vehicles)' },
  { emoji: '🚀', hindiName: 'रॉकेट', hindiPhonetic: 'Rocket', englishWord: 'ROCKET', category: 'वाहन (Vehicles)' },
  { emoji: '🚑', hindiName: 'एंबुलेंस / रोगी वाहन', hindiPhonetic: 'Ambulance', englishWord: 'AMBULANCE', category: 'वाहन (Vehicles)' },
  { emoji: '🚒', hindiName: 'दमकल गाड़ी', hindiPhonetic: 'Damkal', englishWord: 'FIRE TRUCK', category: 'वाहन (Vehicles)' },
  { emoji: '🚓', hindiName: 'पुलिस गाड़ी', hindiPhonetic: 'Police Gaadi', englishWord: 'POLICE CAR', category: 'वाहन (Vehicles)' },
  { emoji: '🚜', hindiName: 'ट्रैक्टर', hindiPhonetic: 'Tractor', englishWord: 'TRACTOR', category: 'वाहन (Vehicles)' },
  { emoji: '🛺', hindiName: 'ऑटो रिक्शा', hindiPhonetic: 'Auto', englishWord: 'RICKSHAW', category: 'वाहन (Vehicles)' },
  { emoji: '🚚', hindiName: 'ट्रक', hindiPhonetic: 'Truck', englishWord: 'TRUCK', category: 'वाहन (Vehicles)' },
  { emoji: '🛞', hindiName: 'पहिया', hindiPhonetic: 'Pahiya', englishWord: 'WHEEL', category: 'वाहन (Vehicles)' },
  { emoji: '🚦', hindiName: 'ट्रैफ़िक लाइट', hindiPhonetic: 'Traffic Light', englishWord: 'TRAFFIC LIGHT', category: 'वाहन (Vehicles)' },
  { emoji: '⛽', hindiName: 'पेट्रोल पंप', hindiPhonetic: 'Petrol', englishWord: 'FUEL', category: 'वाहन (Vehicles)' },

  // 9. प्रकृति, मौसम व अंतरिक्ष (Nature & Space - 20)
  { emoji: '☀️', hindiName: 'सूरज', hindiPhonetic: 'Sooraj', englishWord: 'SUN', category: 'प्रकृति (Nature)' },
  { emoji: '🌙', hindiName: 'चाँद', hindiPhonetic: 'Chaand', englishWord: 'MOON', category: 'प्रकृति (Nature)' },
  { emoji: '⭐', hindiName: 'तारा', hindiPhonetic: 'Taara', englishWord: 'STAR', category: 'प्रकृति (Nature)' },
  { emoji: '☁️', hindiName: 'बादल', hindiPhonetic: 'Baadal', englishWord: 'CLOUD', category: 'प्रकृति (Nature)' },
  { emoji: '🌧️', hindiName: 'बारिश', hindiPhonetic: 'Baarish', englishWord: 'RAIN', category: 'प्रकृति (Nature)' },
  { emoji: '🌈', hindiName: 'इंद्रधनुष', hindiPhonetic: 'Indradhanush', englishWord: 'RAINBOW', category: 'प्रकृति (Nature)' },
  { emoji: '🌳', hindiName: 'पेड़', hindiPhonetic: 'Ped', englishWord: 'TREE', category: 'प्रकृति (Nature)' },
  { emoji: '🍃', hindiName: 'पत्ता', hindiPhonetic: 'Patta', englishWord: 'LEAF', category: 'प्रकृति (Nature)' },
  { emoji: '🌸', hindiName: 'फूल', hindiPhonetic: 'Phool', englishWord: 'FLOWER', category: 'प्रकृति (Nature)' },
  { emoji: '⛰️', hindiName: 'पहाड़', hindiPhonetic: 'Pahaad', englishWord: 'MOUNTAIN', category: 'प्रकृति (Nature)' },
  { emoji: '🌊', hindiName: 'समुद्र / लहर', hindiPhonetic: 'Samudra', englishWord: 'WAVE', category: 'प्रकृति (Nature)' },
  { emoji: '🔥', hindiName: 'आग', hindiPhonetic: 'Aag', englishWord: 'FIRE', category: 'प्रकृति (Nature)' },
  { emoji: '💧', hindiName: 'पानी की बूँद', hindiPhonetic: 'Boond', englishWord: 'WATER', category: 'प्रकृति (Nature)' },
  { emoji: '❄️', hindiName: 'बर्फ़', hindiPhonetic: 'Barf', englishWord: 'SNOW', category: 'प्रकृति (Nature)' },
  { emoji: '💨', hindiName: 'हवा', hindiPhonetic: 'Hawa', englishWord: 'WIND', category: 'प्रकृति (Nature)' },
  { emoji: '🌍', hindiName: 'पृथ्वी / धरती', hindiPhonetic: 'Dharti', englishWord: 'EARTH', category: 'प्रकृति (Nature)' },
  { emoji: '⚡', hindiName: 'बिजली', hindiPhonetic: 'Bijli', englishWord: 'LIGHTNING', category: 'प्रकृति (Nature)' },
  { emoji: '🏝️', hindiName: 'द्वीप / टापू', hindiPhonetic: 'Taapu', englishWord: 'ISLAND', category: 'प्रकृति (Nature)' },
  { emoji: '🪴', hindiName: 'पौधा', hindiPhonetic: 'Paudha', englishWord: 'PLANT', category: 'प्रकृति (Nature)' },
  { emoji: '🌾', hindiName: 'खेत / घास', hindiPhonetic: 'Ghaas', englishWord: 'GRASS', category: 'प्रकृति (Nature)' },

  // 10. कपड़े, रंग व खिलौने (Clothes, Colors & Toys - 20)
  { emoji: '👕', hindiName: 'कमीज / टी-शर्ट', hindiPhonetic: 'Kameez', englishWord: 'SHIRT', category: 'कपड़े (Clothes)' },
  { emoji: '👖', hindiName: 'पतलून / पैंट', hindiPhonetic: 'Paint', englishWord: 'PANTS', category: 'कपड़े (Clothes)' },
  { emoji: '👗', hindiName: 'फ़्रॉक / पोशाक', hindiPhonetic: 'Frock', englishWord: 'DRESS', category: 'कपड़े (Clothes)' },
  { emoji: '🧢', hindiName: 'टोपी', hindiPhonetic: 'Topi', englishWord: 'CAP', category: 'कपड़े (Clothes)' },
  { emoji: '🧦', hindiName: 'मोज़े', hindiPhonetic: 'Moze', englishWord: 'SOCKS', category: 'कपड़े (Clothes)' },
  { emoji: '👟', hindiName: 'जूते', hindiPhonetic: 'Joote', englishWord: 'SHOES', category: 'कपड़े (Clothes)' },
  { emoji: '👓', hindiName: 'चश्मा', hindiPhonetic: 'Chashma', englishWord: 'GLASSES', category: 'कपड़े (Clothes)' },
  { emoji: '☂️', hindiName: 'छाता', hindiPhonetic: 'Chhaata', englishWord: 'UMBRELLA', category: 'दैनिक (Objects)' },
  { emoji: '👑', hindiName: 'मुकुट / ताज', hindiPhonetic: 'Taaj', englishWord: 'CROWN', category: 'कपड़े (Clothes)' },
  { emoji: '💍', hindiName: 'अंगूठी', hindiPhonetic: 'Angoothi', englishWord: 'RING', category: 'गहने (Jewelry)' },
  { emoji: '⚽', hindiName: 'फुटबॉल / गेंद', hindiPhonetic: 'Gend', englishWord: 'BALL', category: 'खेल (Toys)' },
  { emoji: '🪁', hindiName: 'पतंग', hindiPhonetic: 'Patang', englishWord: 'KITE', category: 'खेल (Toys)' },
  { emoji: '🧸', hindiName: 'भालू खिलौना', hindiPhonetic: 'Khilauna', englishWord: 'TEDDY BEAR', category: 'खेल (Toys)' },
  { emoji: '🎈', hindiName: 'गुब्बारा', hindiPhonetic: 'Gubbara', englishWord: 'BALLOON', category: 'खेल (Toys)' },
  { emoji: '🪀', hindiName: 'यो-यो', hindiPhonetic: 'Yo-Yo', englishWord: 'YO-YO', category: 'खेल (Toys)' },
  { emoji: '🔴', hindiName: 'लाल रंग', hindiPhonetic: 'Laal', englishWord: 'RED', category: 'रंग (Colors)' },
  { emoji: '🔵', hindiName: 'नीला रंग', hindiPhonetic: 'Neela', englishWord: 'BLUE', category: 'रंग (Colors)' },
  { emoji: '🟢', hindiName: 'हरा रंग', hindiPhonetic: 'Hara', englishWord: 'GREEN', category: 'रंग (Colors)' },
  { emoji: '🟡', hindiName: 'पीला रंग', hindiPhonetic: 'Peela', englishWord: 'YELLOW', category: 'रंग (Colors)' },
  { emoji: '⚫', hindiName: 'काला रंग', hindiPhonetic: 'Kaala', englishWord: 'BLACK', category: 'रंग (Colors)' },
];

const TOTAL_ROUNDS = 5;

const speakBilingual = (text: string, lang: 'en-US' | 'hi-IN') => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.85;
  utterance.pitch = 1.1;

  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find((v) => v.lang.startsWith(lang.slice(0, 2)));
  if (voice) utterance.voice = voice;

  setTimeout(() => window.speechSynthesis.speak(utterance), 50);
};

export default function HindiVocabMatch() {
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [targetItem, setTargetItem] = useState<VocabItem>(VOCAB_DATABASE_200[0]);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'game_over'>('playing');

  const generateNewQuestion = (roundNum: number) => {
    unlockAudio();
    const randomTarget = VOCAB_DATABASE_200[Math.floor(Math.random() * VOCAB_DATABASE_200.length)];

    const otherItems = VOCAB_DATABASE_200.filter((i) => i.englishWord !== randomTarget.englishWord);
    const shuffledOthers = [...otherItems].sort(() => 0.5 - Math.random());
    const distractors = shuffledOthers.slice(0, 2).map((i) => i.englishWord);

    const roundChoices = [randomTarget.englishWord, ...distractors].sort(() => 0.5 - Math.random());

    setTargetItem(randomTarget);
    setOptions(roundChoices);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setCurrentRound(roundNum);

    speakBilingual(`${randomTarget.hindiName} को अंग्रेजी में क्या कहते हैं?`, 'hi-IN');
  };

  useEffect(() => {
    generateNewQuestion(1);
  }, []);

  const handleSelectOption = (chosenWord: string) => {
    if (selectedAnswer !== null) return;
    unlockAudio();
    setSelectedAnswer(chosenWord);

    if (chosenWord === targetItem.englishWord) {
      setIsCorrect(true);
      setScore((s) => s + 1);
      speakBilingual(`${targetItem.englishWord}! बहुत अच्छा! ${targetItem.hindiName} मतलब ${targetItem.englishWord}!`, 'hi-IN');
    } else {
      setIsCorrect(false);
      speakBilingual(`ओह! ${targetItem.hindiName} को अंग्रेजी में ${targetItem.englishWord} कहते हैं।`, 'hi-IN');
    }
  };

  const handleNext = () => {
    if (currentRound >= TOTAL_ROUNDS) {
      setGameState('game_over');
      if (score >= 4) {
        speakBilingual('शाबाश! आपने बहुत सारे अंग्रेजी शब्द सीखे!', 'hi-IN');
      } else {
        speakBilingual('बहुत अच्छा प्रयास! चलिए दोबारा अभ्यास करते हैं!', 'hi-IN');
      }
      return;
    }
    generateNewQuestion(currentRound + 1);
  };

  const restartGame = () => {
    setScore(0);
    setGameState('playing');
    generateNewQuestion(1);
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-4 p-3 md:p-6 font-sans select-none">
      {/* Header */}
      <div className="w-full bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-2">
              <span>🔤</span> चित्र मिलाओ (Pic &amp; Word Match)
            </h2>
            <span className="text-[11px] font-bold bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full">
              200 शब्द शब्दकोश
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">आयु 3–6 वर्ष (Early Childhood English Vocabulary)</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1.5 rounded-xl border border-amber-200">
            ⭐ अंक: {score} / {TOTAL_ROUNDS}
          </span>
          <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1.5 rounded-xl border border-indigo-200">
            दौर: {currentRound}/{TOTAL_ROUNDS}
          </span>
        </div>
      </div>

      {gameState === 'playing' ? (
        <div className="w-full bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-md flex flex-col items-center">
          
          {/* Category Tag */}
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full mb-3">
            श्रेणी: {targetItem.category}
          </span>

          {/* Main Picture Card */}
          <div className="relative w-48 h-48 md:w-56 md:h-56 bg-amber-50/70 border-4 border-amber-300 rounded-3xl flex flex-col items-center justify-center shadow-inner mb-4 animate-bounce-subtle">
            <span className="text-7xl md:text-8xl select-none filter drop-shadow-md">
              {targetItem.emoji}
            </span>
            <button
              onClick={() => speakBilingual(targetItem.hindiName, 'hi-IN')}
              className="mt-2 px-3.5 py-1 bg-white/90 hover:bg-white text-slate-800 border border-amber-300 rounded-full text-xs font-black shadow-sm flex items-center gap-1.5 active:scale-95 transition"
            >
              <span>🔊</span> {targetItem.hindiName} ({targetItem.hindiPhonetic})
            </button>
          </div>

          <p className="text-xs md:text-sm font-bold text-slate-600 mb-5 text-center">
            इसे अंग्रेजी (English) में क्या कहते हैं? नीचे सही कार्ड चुनें:
          </p>

          {/* 3 Large Touch Cards */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-5">
            {options.map((word) => {
              const isChosen = selectedAnswer === word;
              const isTarget = word === targetItem.englishWord;

              let btnStyle = 'bg-slate-50 hover:bg-indigo-50 border-slate-200 text-slate-800 hover:border-indigo-400';
              if (selectedAnswer !== null) {
                if (isTarget) {
                  btnStyle = 'bg-emerald-500 border-emerald-600 text-white shadow-lg scale-105';
                } else if (isChosen && !isTarget) {
                  btnStyle = 'bg-rose-500 border-rose-600 text-white opacity-80';
                } else {
                  btnStyle = 'bg-slate-100 border-slate-200 text-slate-400 opacity-50';
                }
              }

              return (
                <button
                  key={word}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleSelectOption(word)}
                  className={`py-4 px-3 rounded-2xl border-2 font-black text-lg md:text-xl tracking-wider transition-all duration-200 active:scale-95 flex flex-col items-center justify-center gap-1 shadow-sm ${btnStyle}`}
                >
                  <span>{word}</span>
                  {selectedAnswer !== null && isTarget && (
                    <span className="text-xs font-bold opacity-90">✓ सही उत्तर</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Post-Choice Next Button */}
          {selectedAnswer !== null && (
            <div className="w-full flex justify-between items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-200 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{isCorrect ? '🎉' : '💡'}</span>
                <span className="text-xs md:text-sm font-bold text-slate-700">
                  {isCorrect
                    ? `शाबाश! ${targetItem.hindiName} = ${targetItem.englishWord}`
                    : `सही उत्तर है: ${targetItem.hindiName} = ${targetItem.englishWord}`}
                </span>
              </div>
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold text-xs md:text-sm rounded-xl shadow transition"
              >
                {currentRound >= TOTAL_ROUNDS ? 'परिणाम देखें ➔' : 'अगला शब्द ➔'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Game Over Scorecard */
        <div className="w-full bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-xl flex flex-col items-center text-center animate-fade-in">
          <div className="text-6xl mb-2">{score >= 4 ? '🏆' : score >= 2 ? '🌟' : '🎈'}</div>
          <h3 className="text-2xl font-black text-slate-800 mb-1">
            {score >= 4 ? 'अद्भुत! (Vocabulary Master)' : 'बहुत अच्छा प्रयास! (Good Job)'}
          </h3>
          <div className="text-sm font-bold text-emerald-800 bg-emerald-100 px-4 py-1.5 rounded-full border border-emerald-300 my-3">
            कुल अंक: {score} / {TOTAL_ROUNDS} सही शब्द
          </div>
          <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
            आपने 200 शब्दों के शब्दकोश से नए अंग्रेजी शब्द सीखे हैं। बार-बार खेलने से आपकी वोकैबुलरी और मजबूत होगी!
          </p>
          <button
            onClick={restartGame}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-lg transition"
          >
            🔄 दोबारा खेलें (Play Again)
          </button>
        </div>
      )}
    </div>
  );
}