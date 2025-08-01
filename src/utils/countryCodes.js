// Define the mapping
let langCodeToCountryMap = {
    "fil":"PHL",
    "af": "ZA",
    "ckb":"IQ",
    "sq": "AL",
    "am": "ET",
    "ar": "AE",
    "hy": "AM",
    "az": "AZ",
    "eu": "ES",
    "be": "BY",
    "bn": "BD",
    "bs": "BA",
    "bg": "BG",
    "ca": "CA",
    "ceb": "PH",
    "ny": "MW",
    "zh-CN": "CN",
    "zh-cn": "CN",
    "zh-TW": "TW",
    "zh-tw": "TW",
    "zh-HK": "HK",
    "zh-hk": "HK",
    "co": "FR",
    "hr": "HR",
    "cs": "CZ",
    "da": "DK",
    "nl": "NL",
    "en": "US",
    "et": "EE",
    "tl": "PH",
    "fi": "FI",
    "fr": "FR",
    "fy": "NL",
    "gl": "ES",
    "ka": "GE",
    "de": "DE",
    "el": "GR",
    "gu": "IN",
    "ht": "HT",
    "ha": "NE",
    "haw": "US",
    "us": "US",
    "iw": "IL",
    "hi": "IN",
    "hmn": "CN",
    "hu": "HU",
    "is": "IS",
    "ig": "NG",
    "id": "ID",
    "ga": "IE",
    "it": "IT",
    "ja": "JP",
    "jw": "ID",
    "kn": "IN",
    "kk": "KZ",
    "km": "KH",
    "ko": "KR",
    "ku": "IR",
    "ky": "KG",
    "lo": "LA",
    "la": "IT",
    "lv": "LV",
    "lt": "LT",
    "lb": "LU",
    "mk": "MK",
    "mg": "MG",
    "ms": "MY",
    "ml": "IN",
    "mt": "MT",
    "mi": "NZ",
    "nz": "NZ",
    "mr": "IN",
    "mn": "MN",
    "my": "MM",
    "ne": "NP",
    "no": "NO",
    "ps": "AF",
    "fa": "IR",
    "pl": "PL",
    "pt": "PT",
    "pa": "IN",
    "ro": "RO",
    "ru": "RU",
    "sm": "US",
    "gd": "CA",
    "sr": "RS",
    "st": "LS",
    "sn": "ZW",
    "sd": "PK",
    "si": "LK",
    "sk": "SK",
    "sl": "SI",
    "so": "SO",
    "es": "ES",
    "su": "SD",
    "sw": "TZ",
    "sv": "SE",
    "tg": "TJ",
    "ta": "IN",
    "te": "IN",
    "th": "TH",
    "tr": "TR",
    "uk": "UA",
    "ur": "PK",
    "uz": "UZ",
    "vi": "VN",
    "cy": "GB",
    "xh": "ZA",
    "yi": "DE",
    "yo": "NG",
    "zu": "ZA",
    "ak": "GH",
    "as": "IN",
    "bm": "ML",
    "br": "fr",
    "ce": "ru",
    "cu": "BG",
    "kw": "KW",
    "dz": "BT",
    "eo": "un",
    "ee": "GH",
    "fo": "DK",
    "ff": "MR",
    "lg": "UG",
    "he": "IL",
    "ia": "un",
    "jv": "ID",
    "kl": "GL",
    "ks": "IN",
    "ki": "KE",
    "rw": "RW",
    "ln": "CG",
    "lu": "CD",
    "gv": "GB",
    "nd": "ZW",
    "se": "NO",
    "nb": "NO",
    "nn": "NO",
    "or": "IN",
    "om": "ET",
    "os": "RU",
    "pt-BR": "BR",
    "pt-br": "BR",
    "pt-PT": "PT",
    "pt-pt": "PT",
    "qu": "PE",
    "rm": "CH",
    "rn": "BI",
    "sg": "CF",
    "ii": "CN",
    "tt": "RU",
    "bo": "CN",
    "ti": "ER",
    "to": "TO",
    "tk": "TM",
    "ug": "ZH",
    "vo": "un",
    "wo": "SN",
    "sa": "SA",
    "ar-SA": "sa",
    "ar-sa": "sa",
    "ar-DZ": "DZ",
    "ar-dz": "DZ",
    "ar-AE": "AE",
    "ar-ae": "AE",
    "ar-BH": "BH",
    "ar-bh": "BH",
    "ar-EG": "EG",
    "ar-eg": "EG",
    "ar-IQ": "IQ",
    "ar-iq": "IQ",
    "ar-JO": "JO",
    "ar-jo": "JO",
    "ar-LB": "LB",
    "ar-lb": "LB",
    "ar-LY": "LY",
    "ar-ly": "LY",
    "ar-OM": "OM",
    "ar-om": "OM",
    "ar-QA": "QA",
    "ar-qa": "QA",
    "ar-SD": "SD",
    "ar-sd": "SD",
    "ar-SY": "SY",
    "ar-sy": "SY",
    "ar-YE": "YE",
    "ar-ye": "YE",
    "fr-BE": "BE",
    "fr-be": "BE",
    "fr-LU": "LU",
    "fr-lu": "LU",
    "fr-MC": "MC",
    "fr-mc": "MC",
    "fr-CH": "CH",
    "fr-ch": "CH",
    "fr-CA": "FR-CA",
    "fr-ca": "FR-CA",
    "en-CA": "FR-CA",
    "en-ca": "FR-CA",
    "de-AT": "AT",
    "de-at": "AT",
    "de-CH": "CH",
    "de-ch": "CH",
    "de-LU": "LU",
    "de-lu": "LU",
    "es-MX": "MX",
    "es-mx": "MX",
    "es-CO": "CO",
    "es-co": "CO",
    "es-AR": "AR",
    "es-ar": "AR",
    "es-CL": "CL",
    "es-cl": "CL",
    "es-PE": "PE",
    "es-pe": "PE",
    "es-BO": "BO",
    "es-bo": "BO",
    "es-EC": "EC",
    "es-ec": "EC",
    "es-GT": "GT",
    "es-gt": "GT",
    "en-nz": "NZ",
    "en-NZ": "NZ",
};

function getCountryCode(langCode) {
    if (!langCode) return null;

    const normalizedLangCode = langCode.toLowerCase();
    return langCodeToCountryMap[normalizedLangCode] ? langCodeToCountryMap[normalizedLangCode].toLowerCase()  : null;
}

// Export the function
module.exports = { getCountryCode };
