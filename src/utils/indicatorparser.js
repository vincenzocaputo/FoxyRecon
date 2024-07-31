class IndicatorParser {
    // Regexes
    constructor() {
        this.domain = new RegExp(/^((?!-)[_A-Za-z0-9-]{1,63}(?<!-)\.)+([A-Za-z]{2,63})$/);
        this.def_domain = new RegExp(/^((?!-)[_A-Za-z0-9-]{1,63}(?<!-)(?:(\[\.\]|\.)))+[A-Za-z]{2,63}$/);
        this.url = new RegExp(/^(?:http[s]?):\/\/(((?!0)(?!.*\.$)((2[0-4][0-9]|25[0-5]|1[0-9][0-9]|[1-9][0-9]|\d)\.){3}(2[0-4][0-9]|25[0-5]|1[0-9][0-9]|[1-9][0-9]|\d))|((?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,63}))\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)$/);
        this.def_url = new RegExp(/^(?:h(xx|XX|tt)p[s]?):\/\/(?:www(?:(\[\.\]|\.)))?(?:[-a-zA-Z0-9@:%_\+~#=]+(\[\.\]|\.))+(?:[a-z]{2,63})\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)$/)
        this.ip = new RegExp(/^(?!0)(?!.*\.$)((2[0-4][0-9]|25[0-5]|1[0-9][0-9]|[1-9][0-9]|\d)\.){3}(2[0-4][0-9]|25[0-5]|1[0-9][0-9]|[1-9][0-9]|\d)$/);
        this.def_ip = new RegExp(/^(?!0)(?!.*\.$)((2[0-4][0-9]|25[0-5]|1[0-9][0-9]|[1-9][0-9]|\d)(?:(\[\.\]|\.))){3}(2[0-4][0-9]|25[0-5]|1[0-9][0-9]|[1-9][0-9]|\d)$/);
        this.hash = new RegExp(/(^[a-z0-9]{32}$)|(^[a-z0-9]{40}$)|(^[a-z0-9]{64}$)/); 
        this.email = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9._%+-]{0,64}@([a-zA-Z0-9.-]{1,253}\.[a-zA-Z]{2,15})$/);
        this.def_email = new RegExp(/^[a-zA-Z0-9]((?:\[\.\]\.)[_a-zA-Z0-9_%+-]{0,64})*(\[at\]|@)([a-zA-Z0-9-]+((?:\[\.\]|\.)[a-zA-Z0-9-]+)*((?:\[\.\]|\.)[a-z]{2,15}))$/);
        this.internalip = new RegExp(/(^192\.168\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])$)|(^172\.([1][6-9]|[2][0-9]|[3][0-1])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])$)|(^10\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5]))|(^127\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])$)/);
        //this.def_internalip = new RegExp(/(^192(?:\.|\[\.\])168(?:\.|\[\.\])([0-9]|[0-9][0-9]|[0-2][0-5][0-5])(?:\.|\[\.\])([0-9]|[0-9][0-9]|[0-2][0-5][0-5])$)|(^172(?:\.|\[\.\])([1][6-9]|[2][0-9]|[3][0-1])(?:\.|\[\.\])([0-9]|[0-9][0-9]|[0-2][0-5][0-5])(?:\.|\[\.\])([0-9]|[0-9][0-9]|[0-2][0-5][0-5])$)|(^10(?:\.|\[\.\])([0-9]|[0-9][0-9]|[0-2][0-5][0-5])(?:\.|\[\.\])([0-9]|[0-9][0-9]|[0-2][0-5][0-5])(?:\.|\[\.\])([0-9]|[0-9][0-9]|[0-2][0-5][0-5]))|(^127(?:\.|\[\.\])([0-9]|[0-9][0-9]|[0-2][0-5][0-5])(?:\.|\[\.\])([0-9]|[0-9][0-9]|[0-2][0-5][0-5])(?:\.|\[\.\])([0-9]|[0-9][0-9]|[0-2][0-5][0-5])$)/);
        this.phone = new RegExp(/^\+[0-9]{7,15}$/);
        this.asn = new RegExp(/^AS[0-9]{1,6}$/);
        this.cve = new RegExp(/^CVE-\d{4}-\d{4,7}$/);    
        
        this.dial_codes = {'+93': 'af', '+358': 'fi', '+355': 'al', '+213': 'dz', '+1684': 'as', '+376': 'ad', '+244': 'ao', '+1264': 'ai', '+672': 'nf', '+1268': 'ag', '+54': 'ar', '+374': 'am', '+297': 'aw', '+61': 'cc', '+43': 'at', '+994': 'az', '+1242': 'bs', '+973': 'bh', '+880': 'bd', '+1246': 'bb', '+375': 'by', '+32': 'be', '+501': 'bz', '+229': 'bj', '+1441': 'bm', '+975': 'bt', '+591': 'bo', '+387': 'ba', '+267': 'bw', '+55': 'br', '+246': 'io', '+673': 'bn', '+359': 'bg', '+226': 'bf', '+257': 'bi', '+855': 'kh', '+237': 'cm', '+1': 'us', '+238': 'cv', '+ 345': 'ky', '+236': 'cf', '+235': 'td', '+56': 'cl', '+86': 'cn', '+57': 'co', '+269': 'km', '+242': 'cg', '+243': 'cd', '+682': 'ck', '+506': 'cr', '+225': 'ci', '+385': 'hr', '+53': 'cu', '+357': 'cy', '+420': 'cz', '+45': 'dk', '+253': 'dj', '+1767': 'dm', '+1849': 'do', '+593': 'ec', '+20': 'eg', '+503': 'sv', '+240': 'gq', '+291': 'er', '+372': 'ee', '+251': 'et', '+500': 'gs', '+298': 'fo', '+679': 'fj', '+33': 'fr', '+594': 'gf', '+689': 'pf', '+241': 'ga', '+220': 'gm', '+995': 'ge', '+49': 'de', '+233': 'gh', '+350': 'gi', '+30': 'gr', '+299': 'gl', '+1473': 'gd', '+590': 'mf', '+1671': 'gu', '+502': 'gt', '+44': 'gb', '+224': 'gn', '+245': 'gw', '+595': 'py', '+509': 'ht', '+379': 'va', '+504': 'hn', '+852': 'hk', '+36': 'hu', '+354': 'is', '+91': 'in', '+62': 'id', '+98': 'ir', '+964': 'iq', '+353': 'ie', '+972': 'il', '+39': 'it', '+1876': 'jm', '+81': 'jp', '+962': 'jo', '+77': 'kz', '+254': 'ke', '+686': 'ki', '+850': 'kp', '+82': 'kr', '+965': 'kw', '+996': 'kg', '+856': 'la', '+371': 'lv', '+961': 'lb', '+266': 'ls', '+231': 'lr', '+218': 'ly', '+423': 'li', '+370': 'lt', '+352': 'lu', '+853': 'mo', '+389': 'mk', '+261': 'mg', '+265': 'mw', '+60': 'my', '+960': 'mv', '+223': 'ml', '+356': 'mt', '+692': 'mh', '+596': 'mq', '+222': 'mr', '+230': 'mu', '+262': 're', '+52': 'mx', '+691': 'fm', '+373': 'md', '+377': 'mc', '+976': 'mn', '+382': 'me', '+1664': 'ms', '+212': 'ma', '+258': 'mz', '+95': 'mm', '+264': 'na', '+674': 'nr', '+977': 'np', '+31': 'nl', '+599': 'an', '+687': 'nc', '+64': 'nz', '+505': 'ni', '+227': 'ne', '+234': 'ng', '+683': 'nu', '+1670': 'mp', '+47': 'sj', '+968': 'om', '+92': 'pk', '+680': 'pw', '+970': 'ps', '+507': 'pa', '+675': 'pg', '+51': 'pe', '+63': 'ph', '+872': 'pn', '+48': 'pl', '+351': 'pt', '+1939': 'pr', '+974': 'qa', '+40': 'ro', '+7': 'ru', '+250': 'rw', '+290': 'sh', '+1869': 'kn', '+1758': 'lc', '+508': 'pm', '+1784': 'vc', '+685': 'ws', '+378': 'sm', '+239': 'st', '+966': 'sa', '+221': 'sn', '+381': 'rs', '+248': 'sc', '+232': 'sl', '+65': 'sg', '+421': 'sk', '+386': 'si', '+677': 'sb', '+252': 'so', '+27': 'za', '+211': 'ss', '+34': 'es', '+94': 'lk', '+249': 'sd', '+597': 'sr', '+268': 'sz', '+46': 'se', '+41': 'ch', '+963': 'sy', '+886': 'tw', '+992': 'tj', '+255': 'tz', '+66': 'th', '+670': 'tl', '+228': 'tg', '+690': 'tk', '+676': 'to', '+1868': 'tt', '+216': 'tn', '+90': 'tr', '+993': 'tm', '+1649': 'tc', '+688': 'tv', '+256': 'ug', '+380': 'ua', '+971': 'ae', '+598': 'uy', '+998': 'uz', '+678': 'vu', '+58': 've', '+84': 'vn', '+1284': 'vg', '+1340': 'vi', '+681': 'wf', '+967': 'ye', '+260': 'zm', '+263': 'zw'}
    }
   

    /**
     * Get the type of the indicator given as parameter
     * @param{indicator} String that may contain an indicator
     * @return Type of the indicator detected, if it is valid
     */
    getIndicatorType(indicator) {

        if(indicator.match(this.domain)) {
            // Extract the tld
            const match = indicator.match(this.domain);
            const tld = match[2];
            const isCountry = Object.keys(this.COUNTRIES).includes(tld);
            // Check if it is a country
            if(isCountry) {
                return ["domain", tld];
            } else {
                return ["domain", ""];
            }
        } else if(indicator.match(this.ip)) {
            if(indicator.match(this.internalip)){
                return ["internal", ""];
            }
            return ["ip", ""];
        } else if(indicator.match(this.url)) {
            return ["url", ""];
        } else if(indicator.match(this.hash)) {
            return ["hash", ""];
        } else if(indicator.match(this.email)) {
            return ["email", ""];
        } else if(indicator.match(this.cve)) {
            return ["cve", ""];
        } else if(indicator.match(this.phone)) {
            let country_code = ""
            Object.entries(this.dial_codes).forEach(([key, value]) => {
                if(indicator.startsWith(key)) {
                    country_code = value;
                }
            });
            return ["phone", country_code];
        } else if(indicator.match(this.asn)) {
            return ["asn", ""];
        }  else if(indicator.match(this.def_domain) || indicator.match(this.def_ip) || 
            indicator.match(this.def_url) || indicator.match(this.def_email)) {
            return ["defanged", ""];
        } else {
            return ["invalid", ""];
        }
    }


    /**
     * Get the original indicator from the defanged one
     * @param{def_indicator} defanged indicator to parse
     * @return Usable indicator that can be used as parameter for queries
     */
    refangIndicator(def_indicator) {
        // If the indicator is an URL, remove the "xx" from "http"
        if(def_indicator.match(this.def_url)) {
            def_indicator = def_indicator.replaceAll("hxxp","http");
        }
        // Remove square brackets
        def_indicator = def_indicator.replaceAll("[", "");
        let ref_indicator = def_indicator.replaceAll("]", "");
        return ref_indicator;
        
    }

    /**
     * Extract domain from url or email
     */
    getDomain(indicator) {
        let groups = indicator.match(this.url);
        if(!groups) {
            groups = indicator.match(this.email);
            if(groups) {
                return groups[1];
            }
        } else {
            return groups[1];
        }
    }

    /** Get country name from TLD
     */
    getCountryName(tld) {
        return this.COUNTRIES[tld];
    }

    COUNTRIES = {
      "af": "Afghanistan",
      "fi": "Finland",
      "al": "Albania",
      "dz": "Algeria",
      "as": "American Samoa",
      "ad": "Andorra",
      "ao": "Angola",
      "ai": "Anguilla",
      "nf": "Norfolk Island",
      "ag": "Antigua and Barbuda",
      "ar": "Argentina",
      "am": "Armenia",
      "aw": "Aruba",
      "cc": "Cocos (Keeling) Islands",
      "at": "Austria",
      "az": "Azerbaijan",
      "bs": "Bahamas",
      "bh": "Bahrain",
      "bd": "Bangladesh",
      "bb": "Barbados",
      "by": "Belarus",
      "be": "Belgium",
      "bz": "Belize",
      "bj": "Benin",
      "bm": "Bermuda",
      "bt": "Bhutan",
      "bo": "Bolivia",
      "ba": "Bosnia and Herzegovina",
      "bw": "Botswana",
      "br": "Brazil",
      "io": "British Indian Ocean Territory",
      "bn": "Brunei Darussalam",
      "bg": "Bulgaria",
      "bf": "Burkina Faso",
      "bi": "Burundi",
      "kh": "Cambodia",
      "cm": "Cameroon",
      "us": "United States",
      "cv": "Cape Verde",
      "ky": "Cayman Islands",
      "cf": "Central African Republic",
      "td": "Chad",
      "cl": "Chile",
      "cn": "China",
      "co": "Colombia",
      "km": "Comoros",
      "cg": "Congo",
      "cd": "Congo, the Democratic Republic of the",
      "ck": "Cook Islands",
      "cr": "Costa Rica",
      "ci": "Côte d'Ivoire",
      "hr": "Croatia",
      "cu": "Cuba",
      "cy": "Cyprus",
      "cz": "Czech Republic",
      "dk": "Denmark",
      "dj": "Djibouti",
      "dm": "Dominica",
      "do": "Dominican Republic",
      "ec": "Ecuador",
      "eg": "Egypt",
      "sv": "El Salvador",
      "gq": "Equatorial Guinea",
      "er": "Eritrea",
      "ee": "Estonia",
      "et": "Ethiopia",
      "gs": "South Georgia and the South Sandwich Islands",
      "fo": "Faroe Islands",
      "fj": "Fiji",
      "fr": "France",
      "gf": "French Guiana",
      "pf": "French Polynesia",
      "ga": "Gabon",
      "gm": "Gambia",
      "ge": "Georgia",
      "de": "Germany",
      "gh": "Ghana",
      "gi": "Gibraltar",
      "gr": "Greece",
      "gl": "Greenland",
      "gd": "Grenada",
      "mf": "Saint Martin",
      "gu": "Guam",
      "gt": "Guatemala",
      "gb": "United Kingdom",
      "gn": "Guinea",
      "gw": "Guinea-Bissau",
      "py": "Paraguay",
      "ht": "Haiti",
      "va": "Holy See (Vatican City State)",
      "hn": "Honduras",
      "hk": "Hong Kong",
      "hu": "Hungary",
      "is": "Iceland",
      "in": "India",
      "id": "Indonesia",
      "ir": "Iran",
      "iq": "Iraq",
      "ie": "Ireland",
      "il": "Israel",
      "it": "Italy",
      "jm": "Jamaica",
      "jp": "Japan",
      "jo": "Jordan",
      "kz": "Kazakhstan",
      "ke": "Kenya",
      "ki": "Kiribati",
      "kp": "Korea, Democratic People's Republic of",
      "kr": "Korea, Republic of",
      "kw": "Kuwait",
      "kg": "Kyrgyzstan",
      "la": "Lao People's Democratic Republic",
      "lv": "Latvia",
      "lb": "Lebanon",
      "ls": "Lesotho",
      "lr": "Liberia",
      "ly": "Libya",
      "li": "Liechtenstein",
      "lt": "Lithuania",
      "lu": "Luxembourg",
      "mo": "Macao",
      "mk": "North Macedonia",
      "mg": "Madagascar",
      "mw": "Malawi",
      "my": "Malaysia",
      "mv": "Maldives",
      "ml": "Mali",
      "mt": "Malta",
      "mh": "Marshall Islands",
      "mq": "Martinique",
      "mr": "Mauritania",
      "mu": "Mauritius",
      "re": "Réunion",
      "mx": "Mexico",
      "fm": "Micronesia, Federated States of",
      "md": "Moldova",
      "mc": "Monaco",
      "mn": "Mongolia",
      "me": "Montenegro",
      "ms": "Montserrat",
      "ma": "Morocco",
      "mz": "Mozambique",
      "mm": "Myanmar",
      "na": "Namibia",
      "nr": "Nauru",
      "np": "Nepal",
      "nl": "Netherlands",
      "an": "Netherlands Antilles",
      "nc": "New Caledonia",
      "nz": "New Zealand",
      "ni": "Nicaragua",
      "ne": "Niger",
      "ng": "Nigeria",
      "nu": "Niue",
      "mp": "Northern Mariana Islands",
      "sj": "Svalbard and Jan Mayen",
      "om": "Oman",
      "pk": "Pakistan",
      "pw": "Palau",
      "ps": "Palestine",
      "pa": "Panama",
      "pg": "Papua New Guinea",
      "pe": "Peru",
      "ph": "Philippines",
      "pn": "Pitcairn",
      "pl": "Poland",
      "pt": "Portugal",
      "pr": "Puerto Rico",
      "qa": "Qatar",
      "ro": "Romania",
      "ru": "Russia",
      "rw": "Rwanda",
      "sh": "Saint Helena",
      "kn": "Saint Kitts and Nevis",
      "lc": "Saint Lucia",
      "pm": "Saint Pierre and Miquelon",
      "vc": "Saint Vincent and the Grenadines",
      "ws": "Samoa",
      "sm": "San Marino",
      "st": "Sao Tome and Principe",
      "sa": "Saudi Arabia",
      "sn": "Senegal",
      "rs": "Serbia",
      "sc": "Seychelles",
      "sl": "Sierra Leone",
      "sg": "Singapore",
      "sk": "Slovakia",
      "si": "Slovenia",
      "sb": "Solomon Islands",
      "so": "Somalia",
      "za": "South Africa",
      "ss": "South Sudan",
      "es": "Spain",
      "lk": "Sri Lanka",
      "sd": "Sudan",
      "sr": "Suriname",
      "sz": "Eswatini",
      "se": "Sweden",
      "ch": "Switzerland",
      "sy": "Syrian Arab Republic",
      "tw": "Taiwan",
      "tj": "Tajikistan",
      "tz": "Tanzania",
      "th": "Thailand",
      "tl": "Timor-Leste",
      "tg": "Togo",
      "tk": "Tokelau",
      "to": "Tonga",
      "tt": "Trinidad and Tobago",
      "tn": "Tunisia",
      "tr": "Turkey",
      "tm": "Turkmenistan",
      "tc": "Turks and Caicos Islands",
      "tv": "Tuvalu",
      "ug": "Uganda",
      "ua": "Ukraine",
      "ae": "United Arab Emirates",
      "uy": "Uruguay",
      "uz": "Uzbekistan",
      "vu": "Vanuatu",
      "ve": "Venezuela",
      "vn": "Vietnam",
      "vg": "British Virgin Islands",
      "vi": "U.S. Virgin Islands",
      "wf": "Wallis and Futuna",
      "ye": "Yemen",
      "zm": "Zambia",
      "zw": "Zimbabwe"
    }


}
