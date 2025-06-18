"use strict";

// Markers for “hiding” the various opening delimiters.
// Choose strings that will never appear in user input.

// (A) For “\{{” → hide it as “‹ESC_OPEN_DB›”
const ESC_OPEN_DOUBLE_BRACE = "‹ESC_OPEN_DB›";

// (B) For “\[[” → hide it as “‹ESC_OPEN_DBR›”
const ESC_OPEN_DOUBLE_BRACKET = "‹ESC_OPEN_DBR›";

// (C) For “\{[” → hide it as “‹ESC_OPEN_BBR›”
const ESC_OPEN_BRACKET_BRACE = "‹ESC_OPEN_BBR›";

const IF_REGEX = /{%\s*if\s+(.*?)\s*%}([\s\S]*?){%\s*endif\s*%}/g;
const UNLESS_REGEX = /{%\s*unless\s+(.*?)\s*%}([\s\S]*?){%\s*endunless\s*%}/g;
const CASE_REGEX = /{%\s*case\s+(.*?)\s*%}([\s\S]*?){%\s*endcase\s*%}/g; 

// WeakMap to store the original content of the elements
const originalContentMap = new WeakMap();
const originalContents = new Map();
const mergedContentMap = new Map();

// Component registry to store loaded components
const componentRegistry = new Map();
const macroRegistry = new Map(); // Global macro registry

// Storage for custom functions, macros, and helpers
const customFunctions = new Map();
const customMacros = new Map();
const customHelpers = new Map();

let lastIfChangedValue = {}; // State for ifchanged block

// Utility function to get a value from the context
const getValue = (key, context, fallback) => {
    if (typeof context === 'string') {
        return context;
    }
    else if (Array.isArray(context)) {
        const index = parseInt(key, 10);
        if (!isNaN(index) && index >= 0 && index < context.length) {
            return context[index];
        }
        return fallback;
    }
    else if (typeof context === 'object' && context !== null) {
        // Support nested properties like 'foods.1'
        const keys = key.split('.');
        let value = context;
        for (const k of keys) {
            if (value === undefined || value === null) {
                return fallback;
            }
            value = value[k];
            if (value === undefined) {
                return fallback;
            }
        }
        return value;
    }
    return fallback;
};

// Utility function to set a deeply nested property within an object
function setDeep(obj, path, value) {
    const parts = path.split('.');
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i];
        // if next key is numeric, treat as array
        const nextKey = parts[i+1];
        const wantArray = /^\d+$/.test(nextKey);
        if (cur[key] == null) {
            cur[key] = wantArray ? [] : {};
        }
        cur = cur[key];
    }
    cur[parts[parts.length - 1]] = value;
}

function evaluateCondition(expr, context) {
    // IMPORTANT FIX: Ensure expr is a string before calling .replace()
    if (typeof expr !== 'string' || expr.trim() === '') {
        return false; // Return false for empty or non-string expressions in conditions
    }

    expr = decodeHtmlEntities(expr);
    
    // Temporarily extract string literals
    const stringLiterals = [];
    const withoutStrings = expr.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, (match) => {
        stringLiterals.push(match);
        return `___STR${stringLiterals.length - 1}___`;
    });
    
    // Prefix identifiers only if not a string placeholder
    // This allows expressions like 'myVar' to become 'context.myVar'
    // but leaves 'context.nested.var' or 'true' alone.
    const withContext = withoutStrings.replace(/(?<!\.)\b([A-Za-z_]\w*)\b/g, (match) => {
        if (
            ["true", "false", "null", "undefined", "NaN"].includes(match) ||
            /^___STR\d+___$/.test(match) // don't prefix placeholders!
        ) {
            return match;
        }
        // Check if the identifier is a direct property of context
        // This is a simplified check, full JS evaluation might be needed for complex cases
        if (context && typeof context === 'object' && Object.prototype.hasOwnProperty.call(context, match)) {
             return `context.${match}`;
        }
        // If not a direct property, assume it's part of the expression that might be globally available or nested
        // In a strict eval, this might lead to errors if `myVar` isn't `context.myVar`
        // For robustness, consider if `context.myVar` is always the intent for untyped identifiers.
        return `context.${match}`; 
    });
    
    // Re-insert string literals
    const finalExpr = withContext.replace(/___STR(\d+)___/g, (_, idx) => {
        return stringLiterals[parseInt(idx, 10)];
    });
    
    try {
        // Use `with` statement to make context properties accessible directly
        // This is generally discouraged in production code due to performance and strict mode issues,
        // but for a templating engine with controlled input, it can simplify expression evaluation.
        const fn = new Function("context", `with (context) { return (${finalExpr}); }`);
        return fn(context);
    } catch (error) {
        console.error("Condition evaluation error:", error, "\nin expression:", finalExpr);
        return false;
    }
}


function decodeHtmlEntities(str) {
    return str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

function parseLiteral(expr) {
    const t = expr.trim();
    // Number?
    if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
    // Quoted string?
    if (/^['"].*['"]$/.test(t))      return t.slice(1,-1);
    // Boolean?
    if (t === 'true') return true;
    if (t === 'false') return false;
    // Null/Undefined?
    if (t === 'null') return null;
    if (t === 'undefined') return undefined;

    // Bracketed or object literal — use Function (beware: limited risk in trusted templates)
    if (/^[\[\{][\s\S]*[\]\}]$/.test(t)) {
        try { return new Function(`return (${t});`)(); }
        catch(e){ console.error("Literal parse error:", e, t); }
    }
    // Fallback: expression to be evaluated against context
    return undefined;
}


// Async‐aware replace helper
async function asyncReplace(str, regex, asyncReplacer) {
    const parts = [];
    let lastIndex = 0;
    // Use an array to store promises for replacements
    const replacementPromises = [];
    const matches = [...str.matchAll(regex)];

    for (const match of matches) {
        const { 0: full, index } = match;
        parts.push(str.slice(lastIndex, index));
        // Push the promise returned by asyncReplacer
        replacementPromises.push(asyncReplacer(...match));
        lastIndex = index + full.length;
    }
    parts.push(str.slice(lastIndex));

    // Await all replacement promises
    const replacements = await Promise.all(replacementPromises);

    // Reconstruct the string with awaited replacements
    let result = '';
    let replacementIdx = 0;
    for (let i = 0; i < parts.length; i++) {
        result += parts[i];
        if (i < replacements.length) {
            result += replacements[replacementIdx++];
        }
    }
    return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Built-in Utilities Object
// ─────────────────────────────────────────────────────────────────────────────
const builtInUtilities = {
    // String utilities
    uppercase: (string) => String(string).toUpperCase(),
    lowercase: (string) => String(string).toLowerCase(),
    title: (string) => String(string).split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '),
    capitalize: (string) => String(string).replace(/\b\w/g, char => char.toUpperCase()),
    trim: (string) => String(string).trim(),
    replace: (string, search, replacement) => String(string).replace(new RegExp(search, 'g'), replacement),
    substr: (string, start, length) => String(string).substr(start, length),
    split: (string, delimiter) => String(string).split(delimiter),
    
    // Number utilities
    add: (a, b) => Number(a) + Number(b),
    subtract: (a, b) => Number(a) - Number(b),
    multiply: (a, b) => Number(a) * Number(b),
    divide: (a, b) => {
        const numB = Number(b);
        return numB !== 0 ? Number(a) / numB : 'Division by zero error';
    },
    round: (number) => Math.round(Number(number)),
    floor: (number) => Math.floor(Number(number)),
    ceil: (number) => Math.ceil(Number(number)),
    toFixed: (number, digits) => Number(number).toFixed(Number(digits)),
    random: (min, max) => Math.floor(Math.random() * (Number(max) - Number(min) + 1)) + Number(min),
    
    // Date and time utilities
    currentDate: () => new Date().toLocaleDateString(),
    currentTime: () => new Date().toLocaleTimeString(),
    formatDate: (date, format) => {
        const options = {};
        if (format.includes('year')) options.year = 'numeric';
        if (format.includes('month')) options.month = '2-digit';
        if (format.includes('day')) options.day = '2-digit';
        return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
    },
    formatTime: (time, format) => {
        const options = {};
        if (format.includes('hour')) options.hour = '2-digit';
        if (format.includes('minute')) options.minute = '2-digit';
        if (format.includes('second')) options.second = '2-digit';
        return new Intl.DateTimeFormat('en-US', options).format(new Date(time));
    },
    formatRelativeTime: (date, locale = 'en-US') => {
        try {
            const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
            const now = new Date();
            const target = new Date(date);
            const diffInSeconds = Math.floor((target - now) / 1000);

            const intervals = [
                { unit: 'year', seconds: 31536000 },
                { unit: 'month', seconds: 2628000 },
                { unit: 'week', seconds: 604800 },
                { unit: 'day', seconds: 86400 },
                { unit: 'hour', seconds: 3600 },
                { unit: 'minute', seconds: 60 }
            ];

            for (const interval of intervals) {
                const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
                if (count >= 1) {
                    return rtf.format(diffInSeconds < 0 ? -count : count, interval.unit);
                }
            }
            return rtf.format(diffInSeconds, 'second');
        } catch (error) {
            console.error('Relative time formatting error:', error);
            return String(date);
        }
    },
    
    // Array utilities
    join: (array, delimiter) => Array.isArray(array) ? array.join(delimiter) : '',
    first: (array) => Array.isArray(array) && array.length > 0 ? array[0] : undefined,
    last: (array) => Array.isArray(array) && array.length > 0 ? array[array.length - 1] : undefined,
    length: (array) => Array.isArray(array) ? array.length : 0,
    slice: (array, start, end) => Array.isArray(array) ? array.slice(start, end) : [],
    
    // Object utilities
    keys: (obj) => typeof obj === 'object' && obj !== null ? Object.keys(obj) : [],
    values: (obj) => typeof obj === 'object' && obj !== null ? Object.values(obj) : [],
    entries: (obj) => typeof obj === 'object' && obj !== null ? Object.entries(obj) : [],
    merge: (...objs) => Object.assign({}, ...objs),
    deepClone: (obj) => JSON.parse(JSON.stringify(obj)),
    
    // Logical utilities
    isEmpty: (value) => value == null || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && Object.keys(value).length === 0),
    isNotEmpty: (value) => !builtInUtilities.isEmpty(value),
    
    // Control flow utilities (these might be better handled by control structures directly)
    ifElse: (condition, trueValue, falseValue) => {
        // Caution: eval is dangerous; this is for trusted templates only.
        const evaluatedCondition = evaluateCondition(String(condition), {}); // evaluate without context to avoid accidental variable access in string condition
        return evaluatedCondition ? trueValue : falseValue;
    },
    while: (conditionFn, callbackFn) => {
        let result = '';
        let count = 0;
        // conditionFn and callbackFn are expected to be actual functions
        while (conditionFn() && count < 1000) { // Add a safety break to prevent infinite loops
            result += callbackFn();
            count++;
        }
        return result;
    },
    forEach: (array, callbackFn) => {
        let result = '';
        if (Array.isArray(array)) {
            array.forEach((item, index) => {
                result += callbackFn(item, index);
            });
        }
        return result;
    },
    // Data transformation utilities
    map: (array, callbackStr) => {
        try {
            const arr = Array.isArray(array) ? array : JSON.parse(array);
            const callbackFn = new Function('item', `return ${callbackStr}`);
            return arr.map(callbackFn);
        } catch (error) {
            console.error('Error in map utility:', error);
            return [];
        }
    },
    filter: (array, callbackFn) => Array.isArray(array) ? array.filter(callbackFn) : [],
    sort: (array, compareFunction) => Array.isArray(array) ? [...array].sort(compareFunction) : [],
    
    // Async utilities
    includeFile: async (filePath) => {
        try {
            // If it's an inline:// URL, return from the engine cache:
            if (filePath.startsWith("inline://") && builtInUtilities.rawCache.has(filePath)) { // Use builtInUtilities for consistency
                return builtInUtilities.rawCache.get(filePath);
            }
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`File not found: ${filePath}`);
            return await response.text();
        } catch (error) {
            console.error(error);
            return `<div class="error">Failed to load content from ${filePath}</div>`;
        }
    },
    fetch: async (url) => {
        try {
            const response = await fetch(url);
            const contentType = response.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (err) {
            console.error("builtInUtilities.fetch() error:", err);
            throw err;
        }
    },
    get: async (url) => {
        try {
            const response = await fetch(url, { method: "GET" });
            return await response.json();
        } catch (err) {
            console.error("builtInUtilities.get() error:", err);
            throw err;
        }
    },
    post: async (url, body) => {
        try {
            const payload = typeof body === "string" ? body : JSON.stringify(body);
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payload,
            });
            const contentType = response.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (err) {
            console.error("builtInUtilities.post() error:", err);
            throw err;
        }
    },
    put: async (url, body) => {
        try {
            const payload = typeof body === "string" ? body : JSON.stringify(body);
            const response = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: payload,
            });
            const contentType = response.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (err) {
            console.error("builtInUtilities.put() error:", err);
            throw err;
        }
    },
    delete: async (url) => {
        try {
            const response = await fetch(url, { method: "DELETE" });
            const contentType = response.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (err) {
            console.error("builtInUtilities.delete() error:", err);
            throw err;
        }
    },
    
    // Validation utilities
    isEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(String(email).toLowerCase());
    },
    isURL: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },
    minLength: (value, min) => String(value).length >= parseInt(min, 10),
    maxLength: (value, max) => String(value).length <= parseInt(max, 10),
    isInteger: (value) => Number.isInteger(Number(value)),
    matches: (value, pattern) => {
        const regex = new RegExp(pattern);
        return regex.test(String(value));
    },
    isPhone: (phone) => {
        const phoneRegex = /^[\+]?[1-9]?[\-\s\.]?\(?[0-9]{3}\)?[\-\s\.]?[0-9]{3}[\-\s\.]?[0-9]{4,6}$/;
        return phoneRegex.test(String(phone).replace(/\s/g, ''));
    },
    isAlpha: (value) => /^[a-zA-Z]+$/.test(String(value)),
    isAlphaNumeric: (value) => /^[a-zA-Z0-9]+$/.test(String(value)),
    isNumeric: (value) => !isNaN(value) && !isNaN(parseFloat(value)) && isFinite(value),
    inRange: (value, min, max) => {
        const num = Number(value);
        const isNum = !isNaN(num) && isFinite(num);
        return isNum && num >= Number(min) && num <= Number(max);
    },
    isPositive: (value) => {
        const num = Number(value);
        const isNum = !isNaN(num) && isFinite(num);
        return isNum && num > 0;
    },
    isNegative: (value) => {
        const num = Number(value);
        const isNum = !isNaN(num) && isFinite(num);
        return isNum && num < 0;
    },
    
    // Hashing utilities (using Web Crypto API)
    hash: async (data, algorithm = 'SHA-256') => {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest(algorithm, dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },
    
    // Simple encryption/decryption using AES-GCM
    encrypt: async (data, password) => {
        try {
            const encoder = new TextEncoder();
            const dataBuffer = encoder.encode(data);
            const salt = crypto.getRandomValues(new Uint8Array(16));
            const iv = crypto.getRandomValues(new Uint8Array(12));
            
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                encoder.encode(password),
                { name: 'PBKDF2' },
                false,
                ['deriveBits', 'deriveKey']
            );
            
            const key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: 100000,
                    hash: 'SHA-256',
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['encrypt']
            );
            
            const encrypted = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                dataBuffer
            );
            
            const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
            result.set(salt, 0);
            result.set(iv, salt.length);
            result.set(new Uint8Array(encrypted), salt.length + iv.length);
            
            return btoa(String.fromCharCode(...result));
        } catch (error) {
            console.error('Encryption error:', error);
            return null;
        }
    },
    
    decrypt: async (encryptedData, password) => {
        try {
            const encoder = new TextEncoder();
            const decoder = new TextDecoder();
            
            const combined = new Uint8Array(
                atob(encryptedData).split('').map(c => c.charCodeAt(0))
            );
            
            const salt = combined.slice(0, 16);
            const iv = combined.slice(16, 28);
            const encrypted = combined.slice(28);
            
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                encoder.encode(password),
                { name: 'PBKDF2' },
                false,
                ['deriveBits', 'deriveKey']
            );
            
            const key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: 100000,
                    hash: 'SHA-256',
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['decrypt']
            );
            
            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                encrypted
            );
            
            return decoder.decode(decrypted);
        } catch (error) {
            console.error('Decryption error:', error);
            return null;
        }
    },
    
    // Base64 encoding/decoding
    base64Encode: (data) => {
        try {
            return btoa(unescape(encodeURIComponent(data)));
        } catch (error) {
            console.error('Base64 encoding error:', error);
            return null;
        }
    },
    base64Decode: (encodedData) => {
        try {
            return decodeURIComponent(escape(atob(encodedData)));
        } catch (error) {
            console.error('Base64 decoding error:', error);
            return null;
        }
    },
    
    // Additional hash functions for convenience
    md5: async (data) => {
        console.warn('MD5 is not cryptographically secure. Use SHA-256 instead.');
        return await builtInUtilities.hash(data, 'SHA-1'); // Fallback to SHA-1
    },
    sha1: async (data) => builtInUtilities.hash(data, 'SHA-1'),
    sha256: async (data) => builtInUtilities.hash(data, 'SHA-256'),
    sha512: async (data) => builtInUtilities.hash(data, 'SHA-512'),
    
    // Generate random string (useful for passwords, tokens)
    generateRandomString: (length = 16, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
        let result = '';
        const charsetLength = charset.length;
        const randomValues = crypto.getRandomValues(new Uint8Array(length));
        
        for (let i = 0; i < length; i++) {
            result += charset[randomValues[i] % charsetLength];
        }
        return result;
    },
    generateUUID: () => crypto.randomUUID(),
    
    //dom
    escapeHTML: (string) => {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return String(string).replace(/[&<>"']/g, (m) => map[m]);
    },
    unescapeHTML: (string) => {
        const map = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#039;': "'" };
        return String(string).replace(/&(amp|lt|gt|quot|#039);/g, (m) => map[m]);
    },

    lorem: (count = 5, type = 'words') => {
        const words = [
            'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
            'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
            'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
            'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
            'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
            'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
            'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
            'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
        ];
        
        const sentences = [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
            'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
            'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.'
        ];
        
        const paragraphs = [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
        ];
        
        const num = parseInt(count) || 5;
        
        switch (type.toLowerCase()) {
            case 'words':
                return Array.from({length: num}, () => 
                    words[Math.floor(Math.random() * words.length)]
                ).join(' ');
                
            case 'sentences':
                return Array.from({length: num}, () => 
                    sentences[Math.floor(Math.random() * sentences.length)]
                ).join(' ');
                
            case 'paragraphs':
                return Array.from({length: num}, () => 
                    paragraphs[Math.floor(Math.random() * paragraphs.length)]
                ).join('\n\n');
                
            default:
                return Array.from({length: num}, () => 
                    words[Math.floor(Math.random() * words.length)]
                ).join(' ');
        }
    },

    // Placeholder image generator
    placeholder: (dimensions = '300x200', bgColor = 'cccccc', textColor = '000000', text = null) => {
        const [width, height] = dimensions.split('x').map(d => parseInt(d) || 300);
        const displayText = text || `${width}×${height}`;
        return `<img src="https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(displayText)}" 
                             alt="Placeholder ${width}x${height}" 
                             width="${width}" 
                             height="${height}" 
                             style="display: block; max-width: 100%;" />`;
    },

    // Avatar generator using Gravatar or placeholder
    avatar: (email = '', size = 80, defaultType = 'identicon') => {
        if (!email) {
            // Return a generic avatar placeholder
            return `<img src="https://placehold.co/${size}x${size}/cccccc/666666?text=?" 
                                 alt="Avatar" 
                                 width="${size}" 
                                 height="${size}" 
                                 style="border-radius: 50%; display: inline-block;" />`;
        }
        
        // Simple hash function for email (basic implementation)
        const hash = email.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        
        const gravatarHash = Math.abs(hash).toString(16);
        const gravatarUrl = `https://www.gravatar.com/avatar/${gravatarHash}?s=${size}&d=${defaultType}`;
        
        return `<img src="${gravatarUrl}" 
                             alt="Avatar for ${email}" 
                             width="${size}" 
                             height="${size}" 
                             style="border-radius: 50%; display: inline-block;" />`;
    },

    // QR Code generator
    qrcode: (data = '', size = 200, errorLevel = 'M') => {
        if (!data) return '<div>No data provided for QR code</div>';
        
        const encodedData = encodeURIComponent(data);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedData}&ecc=${errorLevel}`;
        
        return `<img src="${qrUrl}" 
                             alt="QR Code for: ${data}" 
                             width="${size}" 
                             height="${size}" 
                             style="display: block;" />`;
    },

    // Simple chart generator (using Chart.js CDN)
    chart: (data = '[]', type = 'bar', width = 400, height = 300) => {
        const chartId = `chart_${Math.random().toString(36).substr(2, 9)}`;
        let parsedData;
        
        try {
            parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        } catch (e) {
            return '<div>Invalid chart data format</div>';
        }
        
        if (!Array.isArray(parsedData) || parsedData.length === 0) {
            return '<div>No chart data provided</div>';
        }
        
        // Generate chart configuration
        const chartConfig = {
            type: type,
            data: {
                labels: parsedData.map((item, index) => item.label || `Item ${index + 1}`),
                datasets: [{
                    label: 'Data',
                    data: parsedData.map(item => item.value || 0),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 205, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: type !== 'pie' && type !== 'doughnut' ? {
                    y: {
                        beginAtZero: true
                    }
                } : {}
            }
        };
        
        return `
            <div style="width: ${width}px; height: ${height}px;">
                <canvas id="${chartId}" width="${width}" height="${height}"></canvas>
            </div>
            <script>
                (function() {
                    // Load Chart.js if not already loaded
                    if (typeof Chart === 'undefined') {
                        const script = document.createElement('script');
                        script.src = 'https://cdn.jsdelivr.net/npm/chart.js/dist/chart.umd.js';
                        script.onload = function() {
                            createChart();
                        };
                        document.head.appendChild(script);
                    } else {
                        createChart();
                    }
                    
                    function createChart() {
                        const ctx = document.getElementById('${chartId}');
                        if (ctx) {
                            new Chart(ctx, ${JSON.stringify(chartConfig)});
                        }
                    }
                })();
            </script>
        `;
    },
    // Color utilities
    hexToRgb: (hex) => {
        hex = String(hex).replace(/^#/, '');

        if (hex.length === 3) {
            hex = hex.split('').map(ch => ch + ch).join('');
        }

        const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
    rgbToHex: (r, g, b) => {
        const toHex = (n) => {
            const hex = Math.round(n).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    },
    randomColor: () => `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
    lightenColor: (hex, percent) => {
        const rgb = builtInUtilities.hexToRgb(hex); // Use builtInUtilities
        if (!rgb) return hex;

        const factor = 1 + (percent / 100);
        return builtInUtilities.rgbToHex( // Use builtInUtilities
            Math.min(255, rgb.r * factor),
            Math.min(255, rgb.g * factor),
            Math.min(255, rgb.b * factor)
        );
    },
    darkenColor: (hex, percent) => {
        const rgb = builtInUtilities.hexToRgb(hex); // Use builtInUtilities
        if (!rgb) return hex;

        const factor = 1 - (percent / 100);
        return builtInUtilities.rgbToHex( // Use builtInUtilities
            Math.max(0, rgb.r * factor),
            Math.max(0, rgb.g * factor),
            Math.max(0, rgb.b * factor)
        );
    },
};

// Global cache for includeFile for "inline://" scheme
builtInUtilities.rawCache = new Map();

// Utility function to process placeholders
const processPlaceholders = (str, context, fallback, regex, validationErrors) => {
    return str.replace(regex, (match, key) => {
        const trimmedKey = key.trim();
        // Show validation error if field is invalid
        if (validationErrors && validationErrors.hasOwnProperty(trimmedKey)) {
            return `<span class="validation-error" style="color: red; font-weight: bold;">
                ${validationErrors[trimmedKey]}
            </span>`;
        }
        
        // ───────────────────────────────────────────────────────────────────────────
        // (A)    Ternary‐expression check: condition ? trueKey : falseKey
        // ───────────────────────────────────────────────────────────────────────────
        const ternaryMatch = trimmedKey.match(
            /^([\s\S]+?)\s*\?\s*([\s\S]+?)\s*:\s*([\s\S]+)$/
        );
        if (ternaryMatch) {
            const [_, condition, trueKey, falseKey] = ternaryMatch;
            
            try {
                // Evaluate the condition in the context
                const conditionResult = evaluateCondition(condition, context);
                
                // Helper to resolve either a quoted literal or a context key
                const resolveValue = (raw) => {
                    const t = raw.trim();
                    const literalVal = parseLiteral(t);
                    if (literalVal !== undefined) { // Check if it's a literal
                        return literalVal;
                    } else {
                        // Otherwise, look it up via getValue
                        return getValue(t, context, fallback);
                    }
                };
                
                const chosen = conditionResult
                ? resolveValue(trueKey)
                : resolveValue(falseKey);
                
                return typeof chosen === 'function' ? chosen() : String(chosen);
            } catch (e) {
                console.error("Error in ternary condition:", e);
                return fallback;
            }
        }
        
        // ───────────────────────────────────────────────────────────────────────────
        // (A1)    DEFAULT‐VALUE check:  key || 'default'
        // ───────────────────────────────────────────────────────────────────────────
        // If trimmedKey contains "||", we manually split on the FIRST `||`
        // and then do:
        //   - lookup leftSide = getValue(leftKey, context)
        //   - if leftSide is truthy → return it
        //   - else resolve rightSide (either literal‐string or getValue)
        if (/\|\|/.test(trimmedKey)) {
            // Split only on the first "||"
            //   e.g. "foo || 'bar baz'" → ["foo", " 'bar baz'"]
            const parts = trimmedKey.split(/\|\|(.+)/).map(s => s.trim());
            const leftPart  = parts[0]; // e.g. "foo"
            const rightPart = parts[1]; // e.g. "'bar baz'" (including quotes)
            
            // 1) Look up leftPart in context
            let leftVal = getValue(leftPart, context, undefined);
            
            // If leftVal is truthy (not undefined, not "", not 0, not false), return it:
            if (leftVal !== undefined && leftVal !== null && leftVal !== '' && leftVal !== false && leftVal !== 0) { // More robust truthy check
                return typeof leftVal === 'function'
                ? leftVal()
                : String(leftVal);
            }
            
            // 2) Otherwise, resolve rightPart:
            //    If it's a quoted string literal, strip the quotes.
            //    Else, look it up via getValue(...)
            let defaultVal = parseLiteral(rightPart); // Try parsing as literal first
            if (defaultVal === undefined) {
                defaultVal = getValue(rightPart, context, fallback);
            }
            
            // If still undefined, fall back to the fallback
            if (defaultVal === undefined) {
                return fallback;
            }
            return typeof defaultVal === 'function'
            ? defaultVal()
            : String(defaultVal);
        }
        
        // ───────────────────────────────────────────────────────────────────────────
        // (A2)    TYPE CONVERSION check: key | type
        // ───────────────────────────────────────────────────────────────────────────
        if (/\|/.test(trimmedKey)) {
            const [rawKey, rawType] = trimmedKey.split('|').map(s => s.trim());
            
            let val = getValue(rawKey, context, fallback);
            
            // Convert based on the type pipe
            switch (rawType.toLowerCase()) {
                case 'number':
                val = Number(val);
                break;
                case 'boolean':
                val = Boolean(
                    typeof val === 'string'
                    ? val.toLowerCase() === 'true' || val === '1'
                    : val
                );
                break;
                case 'string':
                val = String(val);
                break; // Added break
                case 'json':
                if (typeof val === 'object' && val !== null) {
                    val = JSON.stringify(val);
                }
                break;
                default:
                console.warn(`Unknown type conversion: ${rawType}`);
            }
            
            return typeof val === 'function' ? val() : String(val);
        }
        
        
        // ───────────────────────────────────────────────────────────────────────────
        // (B)    Plain key lookup: {{ key }}
        // ───────────────────────────────────────────────────────────────────────────
        // If the value is an object or array, convert it to a JSON string
        
        const value = getValue(trimmedKey, context, fallback);
        if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value);
        }
        return typeof value === 'function' ? value() : String(value);
    });
};

// Utility function to process built-in utilities ({[... ]})
async function processBuiltInUtilities(str, builtInUtilities, data, fallback) {
    const builtInUtilitiesRegex = /\{\[(.*?)\]\}/g;
    const matches = [...str.matchAll(builtInUtilitiesRegex)];
    if (!matches.length) return str;
    
    const evalContext = { ...builtInUtilities };
    
    const replacements = await Promise.all(
        matches.map(async ([fullMatch, key]) => {
            const trimmedKey = key.trim();
            // This regex captures: (functionName)(args)(propertyChain)
            const fnMatch = trimmedKey.match(/^(\w+)\((.*?)\)(.*)$/);
            
            try {
                if (fnMatch) {
                    const [_, fnName, fnArgs, propertyChain] = fnMatch;
                    const utilityFn = builtInUtilities[fnName];
                    if (!utilityFn) return fallback;
                    
                    // Process nested {{…}} placeholders in each argument
                    const args = await Promise.all(
                        fnArgs.split(/,(?=(?:[^'"]|'[^']*'|"[^"]*")*$)/).map(async (arg) => {
                            const clean = arg.trim().replace(/^['"]|['"]$/g, '');
                            return processPlaceholders(clean, data, fallback, /\{\{(.*?)\}\}/g);
                        })
                    );
                    
                    let result;
                    switch (fnName) {
                        case 'while': {
                            const [conditionStr, callbackStr] = args;
                            const conditionFn = new Function('return ' + conditionStr);
                            const callbackFn = new Function('return ' + callbackStr);
                            result = utilityFn(conditionFn, callbackFn);
                            break;
                        }
                        case 'forEach': {
                            const [arrayStr, callbackStr] = args;
                            const array = eval(arrayStr);
                            const callbackFn = new Function('item', 'index', 'return ' + callbackStr);
                            result = utilityFn(array, callbackFn);
                            break;
                        }
                        case 'map':
                        case 'filter':
                        case 'sort': {
                            const [arrayStr, callbackStr] = args;
                            const array = eval(arrayStr);
                            const callbackFn = new Function('item', 'index', 'return ' + callbackStr);
                            result = utilityFn(array, callbackFn);
                            break;
                        }
                        default: {
                            result = await utilityFn(...args);
                            break;
                        }
                    }
                    
                    // Handle property chaining (e.g., .0.name) if present
                    if (propertyChain) {
                        try {
                            const accessFn = new Function('obj', `return obj${propertyChain}`);
                            result = accessFn(result);
                        } catch (err) {
                            console.error(`Error accessing property chain "${propertyChain}":`, err);
                            return fallback;
                        }
                    }
                    
                    return typeof result === 'string' ? result : JSON.stringify(result);
                } else {
                    // No function call pattern, evaluate entire expression
                    try {
                        const evalResult = await evaluateCondition(trimmedKey, evalContext);
                        if (evalResult === null || evalResult === undefined) return fallback;
                        return typeof evalResult === 'object'
                        ? JSON.stringify(evalResult)
                        : String(evalResult);
                    } catch (innerErr) {
                        console.error(`Error evaluating "{[${trimmedKey}]}"`, innerErr);
                        return fallback;
                    }
                }
            } catch (error) {
                console.error(`Error in utility "${trimmedKey}":`, error);
                return fallback;
            }
        })
    );
    
    let result = str;
    matches.forEach((m, i) => {
        result = result.replace(m[0], replacements[i]);
    });
    
    return result;
}

// 1. Debug utility - outputs variable information
async function processDebugTags(str, currentContext, options) {
    const debugRe = /{%\s*debug\s+(.+?)\s*%}/g;
    
    return str.replace(debugRe, (_, varName) => {
        const value = getValue(varName.trim(), currentContext, undefined);
        const debugInfo = {
            name: varName.trim(),
            value: value,
            type: Array.isArray(value) ? 'array' : typeof value,
            length: Array.isArray(value) ? value.length : 
                            typeof value === 'string' ? value.length : undefined
        };
        
        return `<div class="debug-output" style="background: #f0f0f0; border: 1px solid #ccc; padding: 10px; margin: 5px 0; font-family: monospace;">
            <strong>DEBUG: ${debugInfo.name}</strong><br>
            Type: ${debugInfo.type}<br>
            ${debugInfo.length !== undefined ? `Length: ${debugInfo.length}<br>` : ''}
            Value: <pre>${JSON.stringify(debugInfo.value, null, 2)}</pre>
        </div>`;
    });
}

// 2. Dump utility - outputs all data in a formatted way
async function processDumpTags(str, currentContext, options) {
    const dumpRe = /{%\s*dump\s+(.+?)\s*%}/g;
    
    return str.replace(dumpRe, (_, varName) => {
        const value = varName.trim() === 'data' ? currentContext : getValue(varName.trim(), currentContext, currentContext);
        
        return `<div class="dump-output" style="background: #fff; border: 2px solid #007acc; padding: 15px; margin: 10px 0; font-family: monospace; max-height: 400px; overflow-y: auto;">
            <h4 style="margin: 0 0 10px 0; color: #007acc;">DUMP: ${varName.trim()}</h4>
            <pre style="margin: 0; white-space: pre-wrap;">${JSON.stringify(value, null, 2)}</pre>
        </div>`;
    });
}

// 3. Benchmark utility - measures execution time
async function processBenchmarkTags(str, currentContext, options) {
    const benchmarkRe = /{%\s*benchmark\s*%}([\s\S]*?){%\s*endbenchmark\s*%}/g;
    
    return await asyncReplace(str, benchmarkRe, async (_, block) => {
        const startTime = performance.now();
        
        // Process the block content
        const result = await processAllPlaceholdersWithEscaping(block, currentContext, options);
        
        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);
        
        return `<div class="benchmark-wrapper">
            ${result}
            <div class="benchmark-info" style="background: #fffbf0; border: 1px solid #ffa500; padding: 5px; margin: 5px 0; font-size: 12px; color: #ff8c00;">
                ⏱️ Execution time: ${duration}ms
            </div>
        </div>`;
    });
}

// 4. Log utility - outputs messages to console and optionally to page
async function processLogTags(str, currentContext, options) {
    const logRe = /{%\s*log\s+(['"])(.*?)\1\s*%}/g;
    
    return str.replace(logRe, (_, quote, message) => {
        // Process any placeholders in the message
        const processedMessage = processPlaceholders(message, currentContext, '', /\{\{(.*?)\}\}/g);
        
        // Log to console
        console.log(`[Template Log]: ${processedMessage}`);
        
        // Optionally show in page (you can make this configurable)
        if (options.showLogs) {
            return `<div class="log-output" style="background: #f9f9f9; border-left: 4px solid #4CAF50; padding: 8px; margin: 5px 0; font-family: monospace; color: #333;">
                📝 LOG: ${processedMessage}
            </div>`;
        }
        return ''; // Don't show in output by default
    });
}

async function processAssign(raw, currentContext, rootContext) {
    // Process sequential {% assign ... %} in order
    return await asyncReplace(raw,
        /{%\s*assign\s+([\w.]+)\s*(\+=|-=|=)\s*(.+?)\s*%}/g,
        async (_, targetPath, op, valueExpr) => {
            let valueToAssign = parseLiteral(valueExpr);
            if (valueToAssign === undefined) {
                // If not a literal, evaluate against the current context
                valueToAssign = evaluateCondition(valueExpr, currentContext);
            }

            // Determine which context to modify based on existing variable
            let contextToModify = currentContext;
            const pathParts = targetPath.split('.');
            
            // Check if the top-level variable exists in rootContext
            const rootVarExists = Object.prototype.hasOwnProperty.call(rootContext, pathParts[0]);
            // Check if the top-level variable exists in currentContext (local scope)
            const currentVarExists = Object.prototype.hasOwnProperty.call(currentContext, pathParts[0]);
            
            if (rootVarExists && !currentVarExists && pathParts.length === 1 && op === '=') {
                // If it's a top-level assignment (`{% assign myVar = ... %}`)
                // and `myVar` exists in root but not in the current local scope, modify root.
                contextToModify = rootContext;
            } else if (rootVarExists && pathParts.length > 1) {
                 // For deep paths (`{% assign user.profile.name = ... %}`),
                 // if the top-level part (`user`) exists in rootContext, modify root.
                 contextToModify = rootContext;
            } else if (!rootVarExists && !currentVarExists) {
                // If it's a new variable not existing in either, assign it to the current (local) context.
                contextToModify = currentContext;
            } else if (currentVarExists) {
                // If it already exists in the current local context, modify local.
                contextToModify = currentContext;
            }


            // Apply the modification to targetObject
            let existingValue = getValue(targetPath, contextToModify, undefined);
            let newVal;

            switch(op) {
                case '=':  newVal = valueToAssign; break;
                case '+=':
                    if (Array.isArray(existingValue) && Array.isArray(valueToAssign)) {
                        newVal = existingValue.concat(valueToAssign);
                    } else if (typeof existingValue === 'number' && typeof valueToAssign === 'number') {
                        newVal = existingValue + valueToAssign;
                    } else {
                        // Default to string concatenation if types are mixed or not numeric/array
                        newVal = String(existingValue || '') + String(valueToAssign);
                    }
                    break;
                case '-=':
                    if (typeof existingValue === 'number' && typeof valueToAssign === 'number') {
                        newVal = existingValue - valueToAssign;
                    } else {
                        // For non-numeric decrement, just keep existing value (or handle as error/noop)
                        newVal = existingValue;
                    }
                    break;
            }
            setDeep(contextToModify, targetPath, newVal);
            return ""; // Remove tag from output
        }
    );
}


async function processCapture(str, currentContext, rootContext) {
    const re = /{%\s*capture\s+(\w+)\s*%}([\s\S]*?){%\s*endcapture\s*%}/g;
    return await asyncReplace(str, re, async (_, varName, block) => {
        // Determine which context to modify (similar to assign logic)
        let contextToModify = currentContext;
        if (rootContext && Object.prototype.hasOwnProperty.call(rootContext, varName) && !Object.prototype.hasOwnProperty.call(currentContext, varName)) {
            contextToModify = rootContext;
        }

        // Render the block fully (placeholders + control structures)
        // IMPORTANT: The block content is processed with `currentContext`,
        // but the captured result might be assigned to `rootContext` if the scope rules dictate.
        const rendered = await processAllPlaceholdersWithEscaping(block, currentContext, {}, rootContext); 
        setDeep(contextToModify, varName, rendered);
        return ""; // Remove capture block from output
    });
}

async function processIncDec(str, currentContext, rootContext) {
    // increment: add 1, then return the new value
    str = str.replace(/{%\s*increment\s+(\w+)\s*%}/g, (_, name) => {
        let contextToModify = currentContext;
        // Apply similar scope logic as `assign`
        if (rootContext && Object.prototype.hasOwnProperty.call(rootContext, name) && !Object.prototype.hasOwnProperty.call(currentContext, name)) {
            contextToModify = rootContext;
        }

        const current = Number(getValue(name, contextToModify, 0));
        const next = current + 1;
        setDeep(contextToModify, name, next);
        return String(next);
    });
    
    // decrement: subtract 1, then return the new value
    str = str.replace(/{%\s*decrement\s+(\w+)\s*%}/g, (_, name) => {
        let contextToModify = currentContext;
        // Apply similar scope logic as `assign`
        if (rootContext && Object.prototype.hasOwnProperty.call(rootContext, name) && !Object.prototype.hasOwnProperty.call(currentContext, name)) {
            contextToModify = rootContext;
        }

        const current = Number(getValue(name, contextToModify, 0));
        const next = current - 1;
        setDeep(contextToModify, name, next);
        return String(next);
    });
    
    return str;
}

// Function to parse and store custom functions
function parseCustomFunctions(str, context) { // context here is the current block's context, can be root or local
    return str.replace(/{%\s*function\s+(\w+)\s*\((.*?)\)\s*%}([\s\S]*?){%\s*endfunction\s*%}/g, (_, name, params, body) => {
        const paramList = params.split(',').map(p => p.trim()).filter(p => p);
        customFunctions.set(name, { params: paramList, body: body.trim(), context });
        return ''; // Remove function definition from output
    });
}

// Function to parse and store macros
function parseCustomMacros(str, context) { // context here is the current block's context, can be root or local
    return str.replace(/{%\s*macro\s+(\w+)\s*\((.*?)\)\s*%}([\s\S]*?){%\s*endmacro\s*%}/g, (_, name, params, body) => {
        const paramList = params.split(',').map(p => p.trim()).filter(p => p);
        customMacros.set(name, { params: paramList, body: body.trim(), context });
        return ''; // Remove macro definition from output
    });
}

// Function to parse and store helpers
function parseCustomHelpers(str, context) { // context here is the current block's context, can be root or local
    return str.replace(/{%\s*define\s+(\w+)\s*%}([\s\S]*?){%\s*enddefine\s*%}/g, (_, name, body) => {
        customHelpers.set(name, { body: body.trim(), context });
        return ''; // Remove helper definition from output
    });
}

// Function to execute custom functions
async function executeCustomFunction(name, args, currentContext, options, rootContext) {
    const func = customFunctions.get(name);
    if (!func) return '';
    
    const localContext = { ...currentContext }; // Create new local context for function call
    func.params.forEach((param, index) => {
        localContext[param] = args[index] || '';
    });
    
    return await processAllPlaceholdersWithEscaping(func.body, localContext, options, rootContext);
}

// Function to execute macros
async function executeCustomMacro(name, args, currentContext, options, rootContext) {
    const macro = customMacros.get(name);
    if (!macro) return '';
    
    const localContext = { ...currentContext }; // Create new local context for macro call
    macro.params.forEach((param, index) => {
        localContext[param] = args[index] || '';
    });
    
    return await processAllPlaceholdersWithEscaping(macro.body, localContext, options, rootContext);
}

// Function to execute helpers
async function executeCustomHelper(name, currentContext, options, rootContext) {
    const helper = customHelpers.get(name);
    if (!helper) return '';
    
    return await processAllPlaceholdersWithEscaping(helper.body, currentContext, options, rootContext);
}

// Function to process function calls in templates
async function processCustomFunctionCalls(str, currentContext, options, rootContext) {
    // Match function calls: {% functionName(arg1, arg2) %}
    const callRegex = /{%\s*(\w+)\s*\((.*?)\)\s*%}/g;
    
    return await asyncReplace(str, callRegex, async (_, name, argsStr) => {
        // Parse arguments - args should be processed first as placeholders
        const args = await Promise.all(
            argsStr.split(',').map(async arg => {
                const trimmed = arg.trim();
                const literalVal = parseLiteral(trimmed);
                if (literalVal !== undefined) {
                    return literalVal;
                }
                // Process any nested placeholders within the argument itself
                return await processAllPlaceholdersWithEscaping(trimmed, currentContext, options, rootContext);
            })
        );
        
        // Try to execute as custom function first
        if (customFunctions.has(name)) {
            return await executeCustomFunction(name, args, currentContext, options, rootContext);
        }
        
        // Try to execute as macro
        if (customMacros.has(name)) {
            return await executeCustomMacro(name, args, currentContext, options, rootContext);
        }
        
        // If not found, return empty or original
        return '';
    });
}

// Function to process helper calls in templates
async function processCustomHelperCalls(str, currentContext, options, rootContext) {
    // Match helper calls: {% helperName %}
    // This regex needs to be careful not to match other control structures like {% if %}
    // By checking if it's a known helper, we prevent false positives.
    const helperCallRegex = /{%\s*(\w+)\s*%}/g;
    
    return await asyncReplace(str, helperCallRegex, async (_, name) => {
        // Only process if it's a defined helper and not a control structure keyword
        const controlKeywords = [
            'if', 'endif', 'unless', 'endunless', 'case', 'endcase', 'when', 'else', 'elseif',
            'for', 'endfor', 'foreach', 'endforeach', 'while', 'endwhile', 'repeat', 'endrepeat',
            'range', 'endrange', 'assign', 'capture', 'endcapture', 'increment', 'decrement',
            'include', 'extends', 'block', 'endblock', 'debug', 'dump', 'log', 'benchmark', 'endbenchmark',
            'form', 'endform', 'table', 'endtable', 'tablerow', 'endtablerow', 'tableheader', 'endtableheader',
            'paginate', 'endpaginate', 'raw', 'endraw', 'comment', 'endcomment', 'highlight', 'endhighlight',
            'markdown', 'endmarkdown', 'liquid', 'endliquid', 'try', 'endtry', 'catch', 'finally', 'rescue', 'endrescue',
            'async', 'endasync', 'await', 'parallel', 'endparallel', 'task', 'endtask', 'function', 'endfunction',
            'macro', 'endmacro', 'define', 'enddefine', 'import', 'partial', 'component', 'endcomponent',
            'slot', 'endslot', 'yield', 'now', 'filter', 'endfilter',
            'ifequal', 'endifequal', 'ifnotequal', 'endifnotequal', 'ifgreater', 'endifgreater', 'ifless', 'endifless', 'ifchanged', 'endifchanged'
        ]; // Expanded list of control keywords
        
        if (customHelpers.has(name) && !controlKeywords.includes(name)) { // Added check for control keywords
            return await executeCustomHelper(name, currentContext, options, rootContext);
        }
        
        // If not a helper or if it's a control keyword, return original tag to be handled by other processors
        return `{% ${name} %}`;
    });
}

async function processLiquidExtras(str, currentContext, options, rootContext) {
    // Note: The order here matters. Assigns/captures/inc/dec should run after blocks are selected.
    // However, if they are within a block, their processing is handled by the recursive call to processAllPlaceholdersWithEscaping.
    // This function focuses on applying these liquid-like tags *to the current string content*.

    // 1) assign
    str = await processAssign(str, currentContext, rootContext);
    
    // 2) capture
    str = await processCapture(str, currentContext, rootContext);
    
    // 3) increment/decrement
    str = await processIncDec(str, currentContext, rootContext);

    // 4) Custom function and macro calls (these are processed as {% func() %} style tags)
    str = await processCustomFunctionCalls(str, currentContext, options, rootContext);
    
    // 5) Helper calls (these are processed as {% helper %} style tags)
    str = await processCustomHelperCalls(str, currentContext, options, rootContext);

    // Debugging utilities (can run on current string context)
    str = await processDebugTags(str, currentContext, options);
    str = await processDumpTags(str, currentContext, options);
    str = await processBenchmarkTags(str, currentContext, options);
    str = await processLogTags(str, currentContext, options);

    // `now` tag processing
    str = str.replace(/\{%\s*now\s+['"](.+?)['"]\s*%}/g, (_, fmt) => {
        const date = new Date();
        const tokens = {
            YYYY: String(date.getFullYear()).padStart(4, '0'),
            MM:   String(date.getMonth() + 1).padStart(2, '0'),
            DD:   String(date.getDate()).padStart(2, '0'),
            HH:   String(date.getHours()).padStart(2, '0'),
            mm:   String(date.getMinutes()).padStart(2, '0'),
            ss:   String(date.getSeconds()).padStart(2, '0'),
        };
        // Replace any of our tokens in the fmt string:
        return fmt.replace(/YYYY|MM|DD|HH|mm|ss/g, m => tokens[m] || m);
    });
    
    return str;
}


async function processTryCatchBlocks(str, currentContext, options, rootContext) {
    const tryCatchFinallyRe =
      /{%\s*try\s*%}([\s\S]*?){%\s*catch\s*%}([\s\S]*?){%\s*finally\s*%}([\s\S]*?){%\s*endtry\s*%}/g;

    return await asyncReplace(str, tryCatchFinallyRe, async (_, tryBlock, catchBlock, finallyBlock) => {
        let output = '';
        try {
            output += await processAllPlaceholdersWithEscaping(tryBlock.trim(), currentContext, options, rootContext);
        } catch (err) {
            console.warn('Template error caught in try block:', err);
            // Create a new context for the catch block to expose the error
            output += await processAllPlaceholdersWithEscaping(catchBlock.trim(), {...currentContext, error: err.message || String(err)}, options, rootContext);
        } finally {
            output += await processAllPlaceholdersWithEscaping(finallyBlock.trim(), currentContext, options, rootContext);
        }
        return output;
    });
}

async function processRescueBlocks(str, currentContext, options, rootContext) {
    const rescueRe = /{%\s*rescue\s*%}([\s\S]*?){%\s*endrescue\s*%}/g;

    return await asyncReplace(str, rescueRe, async (_, block) => {
        try {
            return await processAllPlaceholdersWithEscaping(block.trim(), currentContext, options, rootContext);
        } catch (err) {
            console.warn('Error in rescue block:', err);
            return ''; // Return empty string on error
        }
    });
}

const ASYNC_REGEX = /{%\s*async\s*%}([\s\S]*?){%\s*endasync\s*%}/g;
const AWAIT_REGEX = /{%\s*await\s+(.+?)\s*%}/g;
const PARALLEL_REGEX = /{%\s*parallel\s*%}([\s\S]*?){%\s*endparallel\s*%}/g;

async function processAsyncBlocks(str, currentContext, options, rootContext) {
    return await asyncReplace(str, ASYNC_REGEX, async (_, block) => {
        // Execute the block content asynchronously, passing contexts
        return await processAllPlaceholdersWithEscaping(block, currentContext, options, rootContext);
    });
}

async function processAwaitBlocks(str, currentContext, options, rootContext) {
  return await asyncReplace(str, AWAIT_REGEX, async (_, promiseExpr) => {
    try {
      const rawExpr = decodeHtmlEntities(promiseExpr.trim());

      // Create a Function that has access to both currentContext and builtInUtilities (which includes fetch)
      // `with (currentContext)` makes `currentContext` properties directly accessible.
      // `builtInUtilities` are passed in directly so they are in scope.
      const fn = new Function('currentContext', 'builtInUtilities', `
        with (currentContext) {
          return (${rawExpr});
        }
      `);

      // Call it, await the result, stringify it
      const result = await fn(currentContext, builtInUtilities); // Pass currentContext and builtInUtilities
      
      return (result === null || result === undefined)
        ? ''
        : (typeof result === 'object'
            ? JSON.stringify(result)
            : String(result)
          );

    } catch (error) {
      console.error('Error in await block:', error);
      return options.fallback || '';
    }
  });
}

async function processParallelBlocks(str, currentContext, options, rootContext) {
    return await asyncReplace(str, PARALLEL_REGEX, async (_, block) => {
        const taskRe = /{%\s*task\s+(\w+)\s*%}([\s\S]*?){%\s*endtask\s*%}/g;
        const taskMatches = [...block.matchAll(taskRe)];

        const tasks = [];
        const taskNames = [];

        for (const match of taskMatches) {
            const taskName = match[1];
            const taskBlock = match[2];

            taskNames.push(taskName);

            // Capture the rendered result of the block, processing it with its own context
            const taskPromise = (async () => {
                const rendered = await processAllPlaceholdersWithEscaping(taskBlock.trim(), currentContext, options, rootContext);
                try {
                    return JSON.parse(rendered); // try to parse JSON if result is JSON
                } catch {
                    return rendered; // fallback to raw string
                }
            })();
            tasks.push(taskPromise);
        }

        const results = await Promise.all(tasks);

        // Add task results into context, local to this parallel block's scope for subsequent processing
        const parallelContext = { ...currentContext };
        for (let i = 0; i < taskNames.length; i++) {
            parallelContext[taskNames[i]] = results[i];
        }

        // Remove all task blocks from the string
        let cleanedBlock = block.replace(taskRe, '').trim();

        // Process remaining content with updated parallel context
        return await processAllPlaceholdersWithEscaping(cleanedBlock, parallelContext, options, rootContext);
    });
}

async function processIfEqualBlocks(str, currentContext, options, rootContext) {
    const re = /{%\s*ifequal\s+(.*?)\s+(.*?)\s*%}([\s\S]*?){%\s*endifequal\s*%}/g;
    return await asyncReplace(str, re, async (_, a, b, block) => {
        return evaluateCondition(`${a} == ${b}`, currentContext)
            ? await processAllPlaceholdersWithEscaping(block, currentContext, options, rootContext)
            : '';
    });
}

async function processIfNotEqualBlocks(str, currentContext, options, rootContext) {
    const re = /{%\s*ifnotequal\s+(.*?)\s+(.*?)\s*%}([\s\S]*?){%\s*endifnotequal\s*%}/g;
    return await asyncReplace(str, re, async (_, a, b, block) => {
        return evaluateCondition(`${a} != ${b}`, currentContext)
            ? await processAllPlaceholdersWithEscaping(block, currentContext, options, rootContext)
            : '';
    });
}

async function processIfGreaterBlocks(str, currentContext, options, rootContext) {
    const re = /{%\s*ifgreater\s+(.*?)\s+(.*?)\s*%}([\s\S]*?){%\s*endifgreater\s*%}/g;
    return await asyncReplace(str, re, async (_, a, b, block) => {
        return evaluateCondition(`${a} > ${b}`, currentContext)
            ? await processAllPlaceholdersWithEscaping(block, currentContext, options, rootContext)
            : '';
    });
}

async function processIfLessBlocks(str, currentContext, options, rootContext) {
    const re = /{%\s*ifless\s+(.*?)\s+(.*?)\s*%}([\s\S]*?){%\s*endifless\s*%}/g;
    return await asyncReplace(str, re, async (_, a, b, block) => {
        return evaluateCondition(`${a} < ${b}`, currentContext)
            ? await processAllPlaceholdersWithEscaping(block, currentContext, options, rootContext)
            : '';
    });
}

async function processIfChangedBlocks(str, currentContext, options, rootContext) {
    const re = /{%\s*ifchanged\s+(.*?)\s*%}([\s\S]*?){%\s*endifchanged\s*%}/g;
    return await asyncReplace(str, re, async (_, key, block) => {
        const current = getValue(key.trim(), currentContext, null);
        const last = lastIfChangedValue[key];
        lastIfChangedValue[key] = current; // Update the global state for the next check

        if (last !== current) {
            return await processAllPlaceholdersWithEscaping(block, currentContext, options, rootContext);
        }
        return '';
    });
}

function applyLoopFilters(collection, filters, customFilters = {}) {
    let filtered = [...collection];
    
    for (const filter of filters) {
        const [filterName, ...args] = filter;
        
        switch (filterName) {
            case "where": {
                const [key, expected] = args;
                filtered = filtered.filter(item => {
                    const val = getValue(key, item, undefined);
                    // Compare values after converting expected to the same type as val if possible, or string
                    return String(val) === String(expected); 
                });
                break;
            }
            case "limit": {
                const limitCount = parseInt(args[0]);
                if (!isNaN(limitCount)) {
                    filtered = filtered.slice(0, limitCount);
                }
                break;
            }
            case "sort": {
                const key = args[0];
                filtered.sort((a, b) => {
                    const aVal = getValue(key, a, '');
                    const bVal = getValue(key, b, '');
                    // Handle numeric sort for numbers, string sort for others
                    if (typeof aVal === 'number' && typeof bVal === 'number') {
                        return aVal - bVal;
                    }
                    return String(aVal).localeCompare(String(bVal));
                });
                break;
            }
            case "reverse":
            filtered.reverse();
            break;
            
            case "pluck": {
                const key = args[0];
                filtered = filtered.map(item => getValue(key, item, ''));
                break;
            }
            case "unique": {
                if (args.length === 0) {
                    // Remove duplicates based on full object/value (stringifying for comparison)
                    // If items are complex objects, this needs careful handling or a comparison key
                    filtered = [...new Set(filtered.map(item => JSON.stringify(item)))].map(itemStr => JSON.parse(itemStr));
                } else {
                    const key = args[0];
                    const seen = new Set();
                    filtered = filtered.filter(item => {
                        const val = getValue(key, item, '');
                        if (seen.has(val)) return false;
                        seen.add(val);
                        return true;
                    });
                }
                break;
            }
            case 'groupBy': {
                const key = args[0];
                const grouped = {};
                for (const item of filtered) {
                    const val = getValue(key, item, '');
                    if (!grouped[val]) grouped[val] = [];
                    grouped[val].push(item);
                }
                // Convert to array of arrays, or array of objects like { key: 'groupName', values: [...] }
                filtered = Object.keys(grouped).map(groupKey => ({
                    key: groupKey,
                    values: grouped[groupKey]
                }));
                break;
            }
            case 'flatten': {
                filtered = filtered.flat(Infinity);
                break;
            }
            case 'map': { // Note: This map applies on the collection itself, not the filter string `map: 'key'`
                const key = args[0];
                filtered = filtered.map(item => getValue(key, item, ''));
                break;
            }
            case 'inRange': {
                const [key, minStr, maxStr] = args;
                const min = parseFloat(minStr);
                const max = parseFloat(maxStr);
                filtered = filtered.filter(item => {
                    const val = parseFloat(getValue(key, item, ''));
                    return !isNaN(val) && val >= min && val <= max;
                });
                break;
            }
            case 'contains': {
                const [key, value] = args;
                filtered = filtered.filter(item => {
                    const val = getValue(key, item, '');
                    return typeof val === 'string' && val.includes(value);
                });
                break;
            }
            case 'match': {
                const [key, regexPattern] = args;
                try {
                    const regex = new RegExp(regexPattern);
                    filtered = filtered.filter(item => {
                        const val = getValue(key, item, '');
                        return typeof val === 'string' && regex.test(val);
                    });
                } catch (e) {
                    console.error(`Invalid regex pattern for filter "match": ${regexPattern}`, e);
                    // Continue with original filtered or empty if needed
                    filtered = []; // or return original filtered to avoid breaking
                }
                break;
            }
            case 'notEmpty': {
                const key = args[0];
                filtered = filtered.filter(item => {
                    const val = getValue(key, item, '');
                    return val !== undefined && val !== null && val !== '' && !(Array.isArray(val) && val.length === 0) && !(typeof val === 'object' && Object.keys(val).length === 0);
                });
                break;
            }
            default:
            if (typeof customFilters[filterName] === 'function') {
                filtered = customFilters[filterName](filtered, ...args);
            } else {
                console.warn(`Unknown loop filter: "${filterName}"`);
            }
        }
    }
    return filtered;
}

function parseFiltersForLoop(filterParts) {
    return filterParts.map(part => {
        const [name, ...args] = part.split(":").map(p => p.trim());
        const parsedArgs = args.length
        ? args.join(":").split(",").map(arg => arg.trim().replace(/^['"]|['"]$/g, ''))
        : [];
        return [name, ...parsedArgs]; // Return as array [name, arg1, arg2]
    });
}


// Recursive single‐loop processor for {% for %} and {% foreach %}
async function processOneLoop(str, currentContext, options, rootContext) {
    const loopRe = /{%\s*(for|foreach)\s+(\w+)\s+in\s+(.+?)\s*%}([\s\S]*?){%\s*end(?:for|foreach)\s*%}/;
    const match  = str.match(loopRe);
    if (!match) return str;
    
    const [
        fullMatch,
        ,            // tag (for|foreach)
        varName,     // e.g. "group"
        expr,        // e.g. "items | groupBy: 'category'"
        innerBlock,  // the raw template inside this loop
    ] = match;
    
    // 1a) Evaluate the collection expression with filters
    const [baseExpr, ...filterParts] = expr.split("|").map(s => s.trim());
    let collection = getValue(baseExpr, currentContext, []);
    
    if (!Array.isArray(collection)) {
        console.warn(`Collection "${baseExpr}" is not an array for loop.`);
        collection = [];
    }

    collection = applyLoopFilters(collection, parseFiltersForLoop(filterParts), options.loopFilters);
    
    // 1b) Render each iteration, passing an updated context
    let rendered = "";
    const total = collection.length;
    for (let i = 0; i < total; i++) {
        const loop = {
            index:  i + 1,
            first:  i === 0,
            last:   i === total - 1,
            length: total,
            rindex: total - i, // reverse index
            odd: (i % 2 !== 0), // is this row odd (1, 3, 5...)
            even: (i % 2 === 0) // is this row even (0, 2, 4...)
        };
        const item = collection[i];
        
        // Create the new local context for this iteration
        // This is a new object, so modifications within the loop iteration are local by default
        // unless they target a variable already in `rootContext` via `assign`'s logic.
        const iterationContext = { 
            ...currentContext, // Inherit from parent context
            [varName]: item,   // Set the loop item variable
            loop,              // Set loop metadata
            // If item is an object, also spread its properties directly for simpler access like {{name}}
            ...(typeof item === 'object' && item !== null ? item : {}) 
        };
        
        // 1c) Recursively expand any inner loops and process all content *inside* this block
        // Pass the new `iterationContext` as `currentContext` and `rootContext` for proper scoping
        let body = await processAllPlaceholdersWithEscaping(innerBlock, iterationContext, options, rootContext);
        rendered += body;
    }
    
    // 1e) Replace the first occurrence of this loop, and then recursively process the rest of the string
    const replaced = str.replace(fullMatch, rendered);
    
    // 1f) Continue processing for any other loops (outer or sibling)
    return processOneLoop(replaced, currentContext, options, rootContext);
}

// Kick off full loop processing by repeatedly calling processOneLoop until no more loops are found
async function processLoopBlocksRecursive(str, currentContext, options, rootContext) {
    let prev;
    do {
        prev = str;
        str  = await processOneLoop(str, currentContext, options, rootContext);
    } while (str !== prev);
    return str;
}


async function processWhileBlocks(str, currentContext, options, rootContext) {
    const whileRe = /{%\s*while\s+(.+?)\s*%}([\s\S]*?){%\s*endwhile\s*%}/g;
    
    return await asyncReplace(str, whileRe, async (_, condition, block) => {
        let result = "", count = 0;
        
        // Create a mutable context for the while loop that can be updated by `assign` etc.
        const loopLocalContext = { ...currentContext };

        while (evaluateCondition(condition, loopLocalContext)) { // Evaluate condition against loop's local context
            if (++count > 1000) { // Safety break for infinite loops
                console.warn("While loop exceeded 1000 iterations, breaking to prevent infinite loop.");
                break;
            }
            // Process block with loop's local context, allowing assignments to update it
            result += await processAllPlaceholdersWithEscaping(block, loopLocalContext, options, rootContext);
        }
        return result;
    });
}
async function processRepeatBlocks(str, currentContext, options, rootContext) {
    const repeatRe = /{%\s*repeat\s+(\d+)\s*%}([\s\S]*?){%\s*endrepeat\s*%}/g;
    
    return await asyncReplace(str, repeatRe, async (_, countStr, block) => {
        const count = parseInt(countStr, 10);
        if (isNaN(count) || count <= 0) return "";
        
        let result = "";
        for (let i = 0; i < count; i++) {
            // Create a fresh local context for each repeat iteration
            const iterationContext = { ...currentContext, index: i + 1 }; // index starts from 1 for repeat
            result += await processAllPlaceholdersWithEscaping(block, iterationContext, options, rootContext);
        }
        return result;
    });
}
async function processRangeBlocks(str, currentContext, options, rootContext) {
    const rangeRe = /{%\s*range\s+(\d+)\s*\.\.\s*(\d+)\s*%}([\s\S]*?){%\s*endrange\s*%}/g;
    
    return await asyncReplace(str, rangeRe, async (_, startStr, endStr, block) => {
        const start = parseInt(startStr, 10);
        const end   = parseInt(endStr, 10);
        if (isNaN(start) || isNaN(end)) return "";
        
        let result = "";
        for (let i = start; i <= end; i++) {
            // Create a fresh local context for each range iteration
            const iterationContext = { ...currentContext, index: i };
            result += await processAllPlaceholdersWithEscaping(block, iterationContext, options, rootContext);
        }
        return result;
    });
}


async function processFilterBlocks(str, currentContext, options, rootContext) {
    const filterRe = /{%\s*filter\s+(.+?)\s*%}([\s\S]*?){%\s*endfilter\s*%}/g;

    return await asyncReplace(str, filterRe, async (_, filterExpr, block) => {
        const filters = filterExpr
            .split('|')
            .map(f => f.trim())
            .filter(Boolean);

        // Process the inner content first
        let value = await processAllPlaceholdersWithEscaping(block.trim(), currentContext, options, rootContext);

        for (const filter of filters) {
            const [name, ...argsRaw] = filter.split(':').map(s => s.trim());
            // Arguments need to be processed as literals or values from context
            const args = await Promise.all(argsRaw.length ? argsRaw.join(':').split(',').map(async (arg) => {
                const trimmedArg = arg.trim();
                const literalVal = parseLiteral(trimmedArg);
                if (literalVal !== undefined) return literalVal;
                // Otherwise, process as a placeholder or value from currentContext
                return await processAllPlaceholdersWithEscaping(trimmedArg, currentContext, options, rootContext);
            }) : []);

            // Dynamically call the filter function from builtInUtilities
            const filterFn = builtInUtilities[name];
            if (typeof filterFn === 'function') {
                // For filters like 'date' or 'replace', the first argument is the value to be filtered.
                // For others like 'upcase', the value is passed directly.
                // We assume filters operate on the `value` and take additional `args`.
                value = await filterFn(value, ...args);
            } else {
                console.warn(`Unknown filter: "${name}"`);
            }
        }
        return value;
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// Template Inheritance & Modularity (Partials, Components, Extends)
// ─────────────────────────────────────────────────────────────────────────────

async function resolvePartials(rawTpl, builtInUtilities, baseUrl, currentContext, rootContext) {
    const includeRe = /{%\s*include\s+["'](.+?)["']\s*%}/g;
    return await asyncReplace(rawTpl, includeRe, async (fullMatch, relPath) => {
        // 1a) interpolate any {{…}} in the path
        // Important: relPath itself might contain placeholders that need to be resolved against currentContext
        const interpolatedPath = await processAllPlaceholdersWithEscaping(
            relPath,
            currentContext, // Use currentContext for path interpolation
            { fallback: '', builtInUtilities, baseUrl }, // Pass options relevant to path resolution
            rootContext
        );

        // 1b) resolve URL relative to the template that contained it
        const partialUrl = new URL(interpolatedPath, baseUrl).toString();
        
        // 1c) fetch and recursively resolve nested includes
        let content = '';
        try {
            content = await builtInUtilities.includeFile(partialUrl);
            // Recursively resolve partials within the included content, passing currentContext and rootContext
            content = await resolvePartials(content, builtInUtilities, partialUrl, currentContext, rootContext);
        } catch (e) {
            console.error(`Failed to include "${partialUrl}"`, e);
        }
        return content;
    });
}

async function resolveTemplateInheritance(rawTpl, builtInUtilities, baseUrl, currentContext, rootContext) {
    // 2a) resolve includes in the child first, passing currentContext and rootContext
    let tpl = await processAssign(rawTpl, currentContext, rootContext);
        tpl = await processCapture(tpl, currentContext, rootContext);
    let childTpl = await resolvePartials(tpl, builtInUtilities, baseUrl, currentContext, rootContext);
    
    // 2b) check for extends
    const extRe = /{%\s*extends\s+["'](.+?)["']\s*%}/;
    const mExt = childTpl.match(extRe);
    if (!mExt) return childTpl; // No extends, return processed child

    // 2c) load and include parent
    const parentRelPath = mExt[1];
    // The parent URL should be resolved relative to the *child's* baseUrl, which is `baseUrl`
    const parentUrl = new URL(parentRelPath, baseUrl).toString(); 
    let parentRaw = '';
    try {
        parentRaw = await builtInUtilities.includeFile(parentUrl);
    } catch (e) {
        console.error(`Failed to load parent "${parentUrl}"`, e);
        return childTpl; // Return child template if parent fails to load
    }
    // Recursively resolve partials within the parent, using parentUrl as its baseUrl
    const parentTpl = await resolvePartials(parentRaw, builtInUtilities, parentUrl, currentContext, rootContext);
    
    // 2d) extract child blocks
    const strippedChild = childTpl.replace(extRe, '');
    const blockRe = /{% block\s+(\w+)\s*%}([\s\S]*?){%\s*endblock\s*%}/g;
    const childBlocks = {};
    let m;
    while ((m = blockRe.exec(strippedChild))) {
        childBlocks[m[1]] = m[2];
    }
    
    // 2e) merge blocks
    const merged = parentTpl.replace(blockRe, (_, name, parentContent) => {
        return childBlocks.hasOwnProperty(name)
        ? childBlocks[name]
        : parentContent;
    });
    
    // 2f) recurse if parent extends again (rare, but possible)
    return resolveTemplateInheritance(merged, builtInUtilities, parentUrl, currentContext, rootContext);
}

// Process component calls with slots
async function processComponents(str, currentContext, options, rootContext) {
    const componentRe = /{%\s*component\s+['"](.+?)['"]\s*(?:with\s+(.+?))?\s*%}([\s\S]*?){%\s*endcomponent\s*%}/g;
    return await asyncReplace(str, componentRe, async (_, componentName, dataExpr, slotContent) => {
        // Resolve component URL relative to the *current template's* baseUrl
        const componentUrl = new URL(
            `components/${componentName}.html`, // Convention: components are in a 'components' folder
            options.baseUrl 
        ).toString();
        
        // Cache/fetch component template
        if (!componentRegistry.has(componentName)) {
            try {
                const tpl = await builtInUtilities.includeFile(componentUrl); // Use builtInUtilities
                componentRegistry.set(componentName, tpl);
            } catch (e) {
                console.error(`Failed to load component "${componentName}" from "${componentUrl}"`, e);
                return `<div class="error">Component "${componentName}" not found.</div>`;
            }
        }
        const componentTemplate = componentRegistry.get(componentName);
        
        // Build child options: baseUrl is now the component's URL for its nested includes/components
        const childOptions = { ...options, baseUrl: componentUrl };
        
        // Parse data passed with 'with' clause
        let componentData = { ...currentContext }; // Start with inherited context
        
        if (dataExpr) {
            // Evaluate dataExpr against currentContext to get the data object
            const dataValue = evaluateCondition(dataExpr.trim(), currentContext);
            if (typeof dataValue === 'object' && dataValue !== null) {
                componentData = { ...componentData, ...dataValue }; // Merge passed data into component's context
            } else {
                console.warn(`'with' expression for component "${componentName}" did not resolve to an object: ${dataExpr}`);
            }
        }

        // Parse slots from the content *inside* the component tag
        const slots = parseSlots(slotContent);
        componentData.slots = slots; // Make slots available in the component's context
        // console.log(componentData);
        

        // Finally render the componentTemplate with its specific data and options
        return await processAllPlaceholdersWithEscaping(
            componentTemplate,
            componentData, // Component's specific data context
            childOptions,  // Options including updated baseUrl
            rootContext    // Pass rootContext for bubbling assign statements
        );
    });
}

// Parse slot definitions from component content
function parseSlots(content) {
    const slots = {};
    const slotRe = /{%\s*slot\s+['"](.+?)['"]\s*%}([\s\S]*?){%\s*endslot\s*%}/g;
    
    let remainingContent = content;
    let match;
    
    // Extract named slots
    while ((match = slotRe.exec(content)) !== null) {
        const [fullMatch, slotName, slotContent] = match;
        slots[slotName] = slotContent.trim();
        remainingContent = remainingContent.replace(fullMatch, '');
    }
    
    // Everything else becomes the default slot
    const defaultContent = remainingContent.trim();
    if (defaultContent) {
        slots.default = defaultContent;
    }
    
    return slots;
}

// Process yield statements (render slot content)
async function processYield(str, currentContext, options, rootContext) {
    const yieldRe = /{%\s*yield\s*(?:['"](.+?)['"]\s*)?%}/g;
    
    return str.replace(yieldRe, (_, slotName = 'default') => {
        if (currentContext.slots && currentContext.slots[slotName]) {
            // Note: slot content might itself contain placeholders,
            // so it should be processed here.
            // However, processYield is a simple string replacement.
            // The full processing of slots should ideally happen when they are *defined*
            // or when `processAllPlaceholdersWithEscaping` is called on the component.
            // For now, this will return raw slot content.
            // If slot content needs full processing, processYield should be async and call processAllPlaceholdersWithEscaping.
            return currentContext.slots[slotName]; 
        }
        return '';
    });
}

// Process partial includes
async function processPartials(str, currentContext, options, rootContext) {
    const partialRe = /{%\s*partial\s+['"](.+?)['"]\s*(?:with\s+(.+?))?\s*%}/g;
    return await asyncReplace(str, partialRe, async (_, partialName, dataExpr) => {
        // Resolve partial URL relative to the *current template's* baseUrl
        const partialUrl = new URL(
            `${partialName}.html`, // Convention: partials are named .html
            options.baseUrl 
        ).toString();
        
        let partialTemplate = '';
        try {
            partialTemplate = await builtInUtilities.includeFile(partialUrl);
        } catch (e) {
            console.error(`Failed to load partial "${partialName}" from "${partialUrl}"`, e);
            return `<div class="error">Partial "${partialName}" not found.</div>`;
        }
        
        // now *update* the baseUrl for anything inside this partial:
        const childOptions = { ...options, baseUrl: partialUrl };
        
        // parse its data context as before...
        let partialData = { ...currentContext }; // Start with inherited context
        if (dataExpr) {
            const dataValue = evaluateCondition(dataExpr.trim(), currentContext);
            if (typeof dataValue === 'object' && dataValue !== null) {
                partialData = { ...partialData, ...dataValue }; // Merge passed data into partial's context
            } else {
                console.warn(`'with' expression for partial "${partialName}" did not resolve to an object: ${dataExpr}`);
            }
        }
        
        // and render:
        return await processAllPlaceholdersWithEscaping(
            partialTemplate,
            partialData,   // Partial's specific data context
            childOptions,  // Options including updated baseUrl
            rootContext    // Pass rootContext for bubbling assign statements
        );
    });
}


// Process macro imports
async function processImports(str, currentContext, options, rootContext) {
    const importRe = /{%\s*import\s+['"](.+?)['"]\s+as\s+(\w+)\s*%}/g;
    
    return await asyncReplace(str, importRe, async (_, macroFile, alias) => {
        try {
            // Macro file URL needs to be resolved relative to the current baseUrl
            const macroUrl = new URL(macroFile, options.baseUrl).toString();
            const macroContent = await builtInUtilities.includeFile(macroUrl);
            
            // Parse and register macros from the file
            const macros = parseMacros(macroContent);
            macroRegistry.set(alias, macros);
            
            return ''; // Remove import statement from output
        } catch (e) {
            console.error(`Failed to import macros from "${macroFile}":`, e);
            return '';
        }
    });
}

// Parse macro definitions from a file (used by processImports)
function parseMacros(content) {
    const macros = {};
    const macroRe = /{%\s*macro\s+(\w+)\s*\((.*?)\)\s*%}([\s\S]*?){%\s*endmacro\s*%}/g;
    
    let match;
    while ((match = macroRe.exec(content)) !== null) {
        const [, macroName, params, macroBody] = match;
        macros[macroName] = {
            params: params.split(',').map(p => p.trim()).filter(Boolean),
            body: macroBody.trim()
        };
    }
    return macros;
}

// Process macro calls (e.g., {{ alias.macroName(arg1, arg2) }})
async function processMacroCalls(str, currentContext, options, rootContext) {
    const macroCallRe = /\{\{\s*(\w+)\.(\w+)\s*\((.*?)\)\s*\}\}/g; // Adjusted regex for `{{ alias.macroName(...) }}`
    
    return await asyncReplace(str, macroCallRe, async (_, alias, macroName, argsStr) => {
        const macroSet = macroRegistry.get(alias);
        if (!macroSet || !macroSet[macroName]) {
            console.warn(`Macro "${alias}.${macroName}" not found.`);
            return '';
        }
        
        const macro = macroSet[macroName];
        
        // Parse arguments: process placeholders within args, and handle literals
        const argValues = await Promise.all(
            argsStr.split(',').map(async arg => {
                const trimmed = arg.trim();
                const literalVal = parseLiteral(trimmed);
                if (literalVal !== undefined) {
                    return literalVal;
                }
                // Process placeholders within the argument string itself using the current context
                return await processAllPlaceholdersWithEscaping(trimmed, currentContext, options, rootContext);
            })
        );
        
        // Create macro context with parameters
        const macroContext = { ...currentContext };
        macro.params.forEach((param, index) => {
            if (argValues[index] !== undefined) {
                setDeep(macroContext, param, argValues[index]); // Use setDeep for potentially nested macro params
            }
        });
        
        // Process the macro body
        return await processAllPlaceholdersWithEscaping(
            macro.body,
            macroContext, // Macro's specific data context
            options,
            rootContext   // Pass rootContext for bubbling assign statements
        );
    });
}


async function processControlStructures(str, currentContext, options, rootContext) {
    // Process order for control structures and related blocks:
    // 1. Loops (for, while, repeat, range) - these generate content iteratively
    // 2. Conditionals (if, unless, case, ifequal etc) - these select content branches
    // 3. Utility/Content blocks (raw, comment, highlight, markdown, liquid, form, table, paginate)

    // Process loop blocks recursively first
    str = await processLoopBlocksRecursive(str, currentContext, options, rootContext);
    str = await processWhileBlocks(str, currentContext, options, rootContext);
    str = await processRepeatBlocks(str, currentContext, options, rootContext);
    str = await processRangeBlocks(str, currentContext, options, rootContext);

    // Process {% if %} blocks (including elseif/else)
    str = await asyncReplace(str, IF_REGEX, async (_, condition, block) => {
        const conditionResult = evaluateCondition(condition, currentContext);
        
        const parts = block.split(/({%\s*elseif\s+.*?%}|{%\s*else\s*%})/);
        let renderedBlock = '';
        let conditionMet = false; // Flag to stop processing further elseif/else
        
        // Process the initial IF block
        if (conditionResult) {
            renderedBlock = await processAllPlaceholdersWithEscaping(parts[0].trim(), currentContext, options, rootContext);
            conditionMet = true;
        } else {
            // Iterate through elseif/else parts
            for (let i = 1; i < parts.length; i += 2) { // i points to keyword ({% elseif %}, {% else %})
                if (conditionMet) break; // If a condition was already met, stop
                
                const keyword = parts[i]?.trim();
                const contentPart = parts[i + 1]?.trim(); // Content after the keyword
                
                if (keyword?.startsWith('{% elseif ')) {
                    const elseifCondition = keyword.slice(10, -2).trim();
                    if (evaluateCondition(elseifCondition, currentContext)) {
                        renderedBlock = await processAllPlaceholdersWithEscaping(contentPart, currentContext, options, rootContext);
                        conditionMet = true;
                    }
                } else if (keyword === '{% else %}') {
                    renderedBlock = await processAllPlaceholdersWithEscaping(contentPart, currentContext, options, rootContext);
                    conditionMet = true;
                }
            }
        }
        return renderedBlock || '';
    });
    
    // Process {% unless %} blocks
    str = await processUnlessBlocks(str, currentContext, options, rootContext);
    // Process {% case %} blocks
    str = await processCaseBlocks(str, currentContext, options, rootContext);
    // Process specific comparison blocks
    str = await processIfEqualBlocks(str, currentContext, options, rootContext);
    str = await processIfNotEqualBlocks(str, currentContext, options, rootContext);
    str = await processIfGreaterBlocks(str, currentContext, options, rootContext);
    str = await processIfLessBlocks(str, currentContext, options, rootContext);
    str = await processIfChangedBlocks(str, currentContext, options, rootContext);

    // Process asynchronous blocks (async, await, parallel)
    str = await processAsyncBlocks(str, currentContext, options, rootContext);
    str = await processAwaitBlocks(str, currentContext, options, rootContext);
    str = await processParallelBlocks(str, currentContext, options, rootContext);

    // Process try/catch/finally and rescue
    str = await processTryCatchBlocks(str, currentContext, options, rootContext);
    str = await processRescueBlocks(str, currentContext, options, rootContext);

    // Process filter blocks (these wrap content to apply filters)
    str = await processFilterBlocks(str, currentContext, options, rootContext);

    // Process content-specific blocks (raw, comment, highlight, markdown, liquid)
    str = await processRawBlocks(str, currentContext, options, rootContext);
    str = await processCommentBlocks(str, currentContext, options, rootContext);
    str = await processHighlightBlocks(str, currentContext, options, rootContext);
    str = await processMarkdownBlocks(str, currentContext, options, rootContext);
    str = await processLiquidBlocks(str, currentContext, options, rootContext);

    // Process structural/data-display blocks (form, table, paginate)
    str = await processFormBlocks(str, currentContext, options, rootContext);
    str = await processTableBlocks(str, currentContext, options, rootContext);
    str = await processPaginateBlocks(str, currentContext, options, rootContext);
    
    return str;
}


async function processUnlessBlocks(str, currentContext, options, rootContext) {
    const re = UNLESS_REGEX;
    return await asyncReplace(str, re, async (_, condition, block) => {
        if (!evaluateCondition(condition, currentContext)) {
            return await processAllPlaceholdersWithEscaping(block, currentContext, options, rootContext);
        }
        return "";
    });
}

async function processCaseBlocks(str, currentContext, options, rootContext) {
    const caseRe = CASE_REGEX;
    return await asyncReplace(str, caseRe, async (_, expr, block) => {
        const value = evaluateCondition(expr, currentContext);
        
        const clauseRe = /{%\s*(when\s+(.+?)|else)\s*%}([\s\S]*?)(?=(\{%\s*(when|else)\s)|$)/g;
        
        for (const m of block.matchAll(clauseRe)) {
            const [ , clause, whenValRaw, body ] = m;
            if (clause === "else") {
                return await processAllPlaceholdersWithEscaping(body, currentContext, options, rootContext);
            } else if (clause.startsWith("when")) {
                // Support multiple comma-separated values in `when` clause
                const whenValues = whenValRaw.split(',').map(v => {
                    const trimmed = v.trim();
                    const literalVal = parseLiteral(trimmed);
                    if (literalVal !== undefined) return literalVal;
                    // If not a literal, evaluate as a placeholder or variable
                    return getValue(trimmed, currentContext, trimmed);
                });

                if (whenValues.some(whenValue => String(value) === String(whenValue))) { // Compare as strings for consistency
                    return await processAllPlaceholdersWithEscaping(body, currentContext, options, rootContext);
                }
            }
        }
        // If nothing matched and no else, return empty
        return "";
    });
}


async function processFormBlocks(str, currentContext, options, rootContext) {
    const formRe = /{%\s*form\s+(\w+)\s*%}([\s\S]*?){%\s*endform\s*%}/g;
    
    return await asyncReplace(str, formRe, async (_, formName, block) => {
        const validationErrors = options.validationErrors || {}; // Use options for errors
        
        const formContext = {
            ...currentContext, // Inherit current context
            form: {
                name: formName,
                errors: validationErrors,
                hasError: (field) => !!(validationErrors && validationErrors[field]),
                errorFor: (field) => validationErrors?.[field] || '',
                value: (field) => getValue(field, currentContext, ''), // Get value from currentContext
                isValid: Object.keys(validationErrors).length === 0
            }
        };
        
        const renderedContent = await processAllPlaceholdersWithEscaping(block, formContext, options, rootContext);
        
        return `<form name="${formName}" class="template-form">
            ${renderedContent}
        </form>`;
    });
}

async function processTableBlocks(str, currentContext, options, rootContext) {
    const tableRe = /{%\s*table\s+(\w+)\s*%}([\s\S]*?){%\s*endtable\s*%}/g;
    
    return await asyncReplace(str, tableRe, async (_, collectionName, block) => {
        const collection = getValue(collectionName, currentContext, []);
        if (!Array.isArray(collection) || collection.length === 0) {
            return '<table class="template-table"><tbody><tr><td>No data available</td></tr></tbody></table>';
        }
        
        const headerRe = /{%\s*tableheader\s*%}([\s\S]*?){%\s*endtableheader\s*%}/;
        const rowRe = /{%\s*tablerow\s*%}([\s\S]*?){%\s*endtablerow\s*%}/;
        
        const headerMatch = block.match(headerRe);
        const rowMatch = block.match(rowRe);
        
        let headerHtml = '';
        if (headerMatch) {
            // Process header content, passing currentContext
            headerHtml = `<thead>${await processAllPlaceholdersWithEscaping(headerMatch[1], currentContext, options, rootContext)}</thead>`;
        }
        
        let rowsHtml = '';
        if (rowMatch) {
            const rowTemplate = rowMatch[1];
            
            for (let i = 0; i < collection.length; i++) {
                const tableLoop = {
                    index: i + 1,
                    first: i === 0,
                    last: i === collection.length - 1,
                    length: collection.length,
                    rindex: collection.length - i,
                    odd: (i + 1) % 2 !== 0,
                    even: (i + 1) % 2 === 0
                };
                
                // Make the current item directly accessible as 'item' and also by the collection name
                const rowContext = {
                    ...currentContext, // Inherit from parent
                    item: collection[i], // The current item is available as 'item'
                    [collectionName]: collection[i], // Also available by collection name for consistency
                    loop: tableLoop // Renamed from tableloop to loop for consistency
                };
                
                // Process each row's content with its specific rowContext
                const rowContent = await processAllPlaceholdersWithEscaping(rowTemplate, rowContext, options, rootContext);
                rowsHtml += rowContent;
            }
        }
        
        return `<table class="template-table">
            ${headerHtml}
            <tbody>${rowsHtml}</tbody>
        </table>`;
    });
}

async function processPaginateBlocks(str, currentContext, options, rootContext) {
    const paginateRe = /{%\s*paginate\s+(\w+)\s+by\s+(\d+)\s*%}([\s\S]*?){%\s*endpaginate\s*%}/g;
    
    return await asyncReplace(str, paginateRe, async (_, collectionName, pageSizeStr, block) => {
        const pageSize = parseInt(pageSizeStr, 10);
        const currentPage = parseInt(getValue('page', currentContext, 1), 10); // 'page' from current context or default to 1
        console.log(currentContext);
        
        const collection = getValue(collectionName, currentContext, []);
        
        if (!Array.isArray(collection)) {
            return '';
        }
        
        const totalItems = collection.length;
        const totalPages = Math.ceil(totalItems / pageSize);
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalItems);
        const paginatedItems = collection.slice(startIndex, endIndex);
        
        // Create pagination context
        const paginateContext = {
            ...currentContext, // Inherit existing context
            [collectionName]: paginatedItems, // Replace collection with paginated items for this block
            paginate: {
                current_page: currentPage,
                current_offset: startIndex,
                items: totalItems,
                parts: totalPages,
                size: pageSize,
                first: currentPage === 1,
                last: currentPage === totalPages,
                previous: currentPage > 1 ? {
                    title: 'Previous',
                    url: `?page=${currentPage - 1}`,
                    is_link: true
                } : null,
                next: currentPage < totalPages ? {
                    title: 'Next',  
                    url: `?page=${currentPage + 1}`,
                    is_link: true
                } : null,
                pages: Array.from({ length: totalPages }, (_, i) => ({
                    title: String(i + 1),
                    url: `?page=${i + 1}`,
                    is_link: i + 1 !== currentPage,
                    current: i + 1 === currentPage
                }))
            }
        };
        
        return await processAllPlaceholdersWithEscaping(block, paginateContext, options, rootContext);
    });
}

// async function processRawBlocks(str, currentContext, options, rootContext) {
//     const rawRe = /{%\s*raw\s*%}([\s\S]*?){%\s*endraw\s*%}/g;
//     return str.replace(rawRe, (_, content) => content); // Return content as-is
// }
async function processRawBlocks(str, context, options) {
    // {% raw %} blocks - content inside should not be processed at all
    const rawRe = /{%\s*raw\s*%}([\s\S]*?){%\s*endraw\s*%}/g;
    return str.replace(rawRe, (_, content) => {
        // Return content as-is, no processing
        console.log(content);
        
        return content;
    });
}

async function processCommentBlocks(str, currentContext, options, rootContext) {
    const commentRe = /{%\s*comment\s*%}([\s\S]*?){%\s*endcomment\s*%}/g;
    return str.replace(commentRe, () => ''); // Return empty string
}

async function processHighlightBlocks(str, currentContext, options, rootContext) {
    const highlightRe = /{%\s*highlight\s+['"](.+?)['"](?:\s+linenos)?\s*%}([\s\S]*?){%\s*endhighlight\s*%}/g;
    
    return await asyncReplace(str, highlightRe, async (_, language, code) => {
        const processedCode = await processAllPlaceholdersWithEscaping(code.trim(), currentContext, options, rootContext);
        const escapedCode = builtInUtilities.escapeHTML(processedCode); // Use builtInUtilities
        return `<pre><code class="language-${language}">${escapedCode}</code></pre>`;
    });
}

async function processMarkdownBlocks(str, currentContext, options, rootContext) {
    const markdownRe = /{%\s*markdown\s*%}([\s\S]*?){%\s*endmarkdown\s*%}/g;
    
    return await asyncReplace(str, markdownRe, async (_, markdown) => {
        const processedMarkdown = await processAllPlaceholdersWithEscaping(markdown.trim(), currentContext, options, rootContext);
        
        let html = processedMarkdown
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^#\s+(.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
        
        if (!html.match(/^<(h[1-6]|div|p|ul|ol|blockquote)/)) {
            html = `<p>${html}</p>`;
        }
        return html;
    });
}

async function processLiquidBlocks(str, currentContext, options, rootContext) {
    const liquidRe = /{%\s*liquid\s*%}([\s\S]*?){%\s*endliquid\s*%}/g;
    
    return await asyncReplace(str, liquidRe, async (_, liquidCode) => {
        const lines = liquidCode.trim().split('\n');
        let expandedLiquid = '';
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;
            
            // Convert liquid shorthand to full tags (simplified)
            if (trimmedLine.startsWith('assign ') || trimmedLine.startsWith('if ') || trimmedLine.startsWith('unless ') ||
                trimmedLine.startsWith('for ') || trimmedLine.startsWith('foreach ') || trimmedLine.startsWith('case ')) {
                expandedLiquid += `{% ${trimmedLine} %}\n`;
            } else if (['endif', 'endunless', 'endfor', 'endforeach', 'endcase', 'else', 'elseif', 'when'].some(keyword => trimmedLine.startsWith(keyword))) {
                expandedLiquid += `{% ${trimmedLine} %}\n`;
            } else {
                expandedLiquid += `{{ ${trimmedLine} }}\n`; // Treat as output statement
            }
        }
        // Recursively process the expanded liquid code
        return await processAllPlaceholdersWithEscaping(expandedLiquid, currentContext, options, rootContext);
    });
}

function validateData(data, schema) {
    const errors = {};
    
    for (const [field, rules] of Object.entries(schema)) {
        const value = getValue(field, data, undefined); // Use getValue to support nested paths
        
        // Required check
        if (rules.required && (value === undefined || value === null || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && Object.keys(value).length === 0))) {
            errors[field] = rules.message || `Field "${field}" is required`;
            continue;
        }
        
        // Type check (only if value exists or is not required)
        if (rules.type && value !== undefined && value !== null) {
            const expectedType = rules.type.toLowerCase();
            const actualType = Array.isArray(value) 
            ? 'array' 
            : typeof value;
            
            if (actualType !== expectedType) {
                errors[field] = rules.message || `Field "${field}" must be a ${expectedType}`;
                continue;
            }
        }
        
        // Built-in validator (e.g., "isEmail", "isURL")
        if (rules.validator && typeof builtInUtilities[rules.validator] === 'function') {
            try {
                const isValid = builtInUtilities[rules.validator](value);
                if (!isValid) {
                    errors[field] = rules.message || `Field "${field}" failed validation`;
                }
            } catch (e) {
                errors[field] = rules.message || `Validation error for "${field}": ${e.message}`;
            }
        }
        
        // Custom validator function
        if (rules.customValidator && typeof rules.customValidator === 'function') {
            try {
                const result = rules.customValidator(value);
                if (result !== true) {
                    errors[field] = result || `Field "${field}" failed custom validation`;
                }
            } catch (e) {
                errors[field] = rules.message || `Custom validation error for "${field}": ${e.message}`;
            }
        }
    }
    return { valid: Object.keys(errors).length === 0, errors };
}


// The main recursive template processing function
// It takes currentContext (local scope) and rootContext (global scope for bubbling)
async function processAllPlaceholdersWithEscaping(rawStr, currentContext, options = {}, rootContext = null) {
    // If rootContext is not explicitly provided, assume currentContext is the root (top-level call)
    if (rootContext === null) {
        rootContext = currentContext;
    }

    let temp = rawStr;

    // ─────────────────────────────────────────────────────────────────────────────
    // Step A) “Hide” every backslash‐escaped opening delimiter
    // ─────────────────────────────────────────────────────────────────────────────
    temp = temp
        .replace(/\\\{\{/g, ESC_OPEN_DOUBLE_BRACE)
        .replace(/\\\[\[/g, ESC_OPEN_DOUBLE_BRACKET)
        .replace(/\\\{\[/g, ESC_OPEN_BRACKET_BRACE);

    // ─────────────────────────────────────────────────────────────────────────────
    // Step B) Process global definitions first (functions, macros, helpers)
    // These are removed from the string as they define global state.
    // Order matters: must parse these before they are called.
    // ─────────────────────────────────────────────────────────────────────────────
    temp = parseCustomFunctions(temp, currentContext);
    temp = parseCustomMacros(temp, currentContext);
    temp = parseCustomHelpers(temp, currentContext);
    // ─────────────────────────────────────────────────────────────────────────────
    // Step C) Process Imports (for macros)
    // ─────────────────────────────────────────────────────────────────────────────
    temp = await processImports(temp, currentContext, options, rootContext);

    // ─────────────────────────────────────────────────────────────────────────────
    // Step D) Resolve Template Inheritance (extends) and Partials/Components (includes)
    // This phase should happen on the *overall structure* before deep content processing.
    // Pass baseUrl for correct relative path resolution.
    // ─────────────────────────────────────────────────────────────────────────────
    temp = await resolveTemplateInheritance(temp, builtInUtilities, options.baseUrl || window.location.href, currentContext, rootContext);
    temp = await processPartials(temp, currentContext, options, rootContext);
    temp = await processComponents(temp, currentContext, options, rootContext);
    
    

    // ─────────────────────────────────────────────────────────────────────────────
    // Step E) Recursive Processing of Control Structures and Liquid Extras
    // This is the core recursive loop where blocks are processed.
    // We run this in a loop to handle nested/sequential processing.
    // ─────────────────────────────────────────────────────────────────────────────
    let prevTemp;
    do {
        prevTemp = temp;

        // 1. Process all control structures (conditionals, loops, try/catch, async/parallel)
        // These will recursively call processAllPlaceholdersWithEscaping for their inner blocks.
        
        temp = await processControlStructures(temp, currentContext, options, rootContext);

        // 2. Process Liquid-like tags that modify context or generate inline content (assign, capture, inc/dec, debug, dump, log, now, custom function/macro/helper calls)
        // These must run *after* control structures decide which content is active.
        // If a control structure processed its block by recursively calling this function,
        // then these tags are handled within that recursive call's scope.
        // This pass ensures that any *remaining* such tags at the current level are handled.
        temp = await processLiquidExtras(temp, currentContext, options, rootContext);

        // 3. Process built-in utility calls (e.g., {[ builtIn.utility() ]})
        temp = await processBuiltInUtilities(temp, builtInUtilities, currentContext, options.fallback);
        
        // 4. Process macro calls (e.g., {{ alias.macro() }})
        temp = await processMacroCalls(temp, currentContext, options, rootContext);

        // 5. Process standard data placeholders (e.g., {{ user.name }})
        temp = processPlaceholders(temp, currentContext, options.fallback, /\{\{(.*?)\}\}/g, options.validationErrors);

        // 6. Process JavaScript variable placeholders (e.g., [[ myVar ]])
        temp = processPlaceholders(temp, options.variables || {}, options.fallback, /\[\[(.*?)\]\]/g);

    } while (temp !== prevTemp); // Keep looping until no more changes are made in a full pass

    // ─────────────────────────────────────────────────────────────────────────────
    // Step F) “Unhide” everything we hid in Step A
    // ─────────────────────────────────────────────────────────────────────────────
    const result = temp
        .replace(new RegExp(ESC_OPEN_DOUBLE_BRACE, 'g'), "{{")
        .replace(new RegExp(ESC_OPEN_DOUBLE_BRACKET, 'g'), "[[")
        .replace(new RegExp(ESC_OPEN_BRACKET_BRACE, 'g'), "{[");
    
    return result;
}


// Main function to replace placeholders in the document
async function replacePlaceholdersInDocument(selector, data, options = {}) {
    const {
        builtInUtilities: customBuiltInUtilities = {}, // Allow custom built-ins
        fallback = '',
        variables = {},
        processIncludes = false, // True to force re-evaluation of includes/extends on every call
        schema = null,
        loopFilters = {},
        baseUrl = window.location.href // Crucial: provide the base URL of the template being processed
    } = options;
    
    
    // Merge provided builtInUtilities with the default ones
    const mergedBuiltInUtilities = { ...builtInUtilities, ...customBuiltInUtilities };

    const elements = document.querySelectorAll(selector);
    const results  = [];
    let validationErrors = null;
    
    // Schema validation
    if (schema) {
        const { valid, errors } = validateData(data, schema);
        if (!valid) {
            validationErrors = errors;
            console.warn(`Validation warnings for "${selector}"`, errors);
        }
    }
    
    for (const el of elements) {
        // Cache original content to re-render from scratch if needed
        if (!originalContents.has(el)) {
            originalContents.set(el, el.innerHTML);
        }
        const rawHtmlFromElement = originalContents.get(el);

        // Cache key for merged content (after inheritance/includes)
        const mergedCacheKey = `${el.id || el.tagName}.${el.className}.__merged`; // More robust cache key

        let mergedContentForElement = mergedContentMap.get(mergedCacheKey);

        // Re-resolve inheritance/includes only if forced or not cached
        if (mergedContentForElement === undefined || processIncludes) {
            mergedContentForElement = await resolveTemplateInheritance(
                rawHtmlFromElement,
                mergedBuiltInUtilities, // Use the merged built-in utilities
                baseUrl,
                data, // Pass root data as current context for initial inheritance
                data // Pass root data as root context
            );
            mergedContentMap.set(mergedCacheKey, mergedContentForElement);
        }
        
        // Process all placeholders and control structures in the (potentially merged) content
        const rendered = await processAllPlaceholdersWithEscaping(
            mergedContentForElement, 
            data, // Pass the root data as the currentContext for the top-level processing
            { fallback, builtInUtilities: mergedBuiltInUtilities, variables, validationErrors, loopFilters, baseUrl },
            data // Pass root data again as rootContext for bubbling
        );
        
        el.innerHTML = rendered;
        results.push(rendered);
    }
    
    return results;
}








// Add these utilities to your existing builtInUtilities object:

// const additionalUtilities = {
//     // ═══════════════════════════════════════════════════════════════════════════════
//     // LOCALIZATION UTILITIES
//     // ═══════════════════════════════════════════════════════════════════════════════

//     // Translation with fallback support
//     translate: (key, translations = {}, fallbackLang = 'en', currentLang = 'en') => {
    //         const langTranslations = translations[currentLang] || translations[fallbackLang] || {};
//         return langTranslations[key] || key;
//     },

//     // Shorthand for translate
//     t: (key, translations = {}, fallbackLang = 'en', currentLang = 'en') => {
    //         return additionalUtilities.translate(key, translations, fallbackLang, currentLang);
//     },

//     // Format currency with locale support
//     formatCurrency: (amount, currency = 'USD', locale = 'en-US', options = {}) => {
    //         try {
//             return new Intl.NumberFormat(locale, {
//                 style: 'currency',
//                 currency: currency,
//                 ...options
//             }).format(Number(amount));
//         } catch (error) {
//             console.error('Currency formatting error:', error);
//             return `${currency} ${amount}`;
//         }
//     },

//     // Format numbers with locale support
//     formatNumber: (number, locale = 'en-US', options = {}) => {
    //         try {
//             return new Intl.NumberFormat(locale, options).format(Number(number));
//         } catch (error) {
//             console.error('Number formatting error:', error);
//             return String(number);
//         }
//     },

//     // Format percentage
//     formatPercent: (number, locale = 'en-US', options = {}) => {
    //         try {
//             return new Intl.NumberFormat(locale, {
//                 style: 'percent',
//                 ...options
//             }).format(Number(number));
//         } catch (error) {
//             console.error('Percent formatting error:', error);
//             return `${number * 100}%`;
//         }
//     },

//     // Get locale-specific date format
//     formatDateLocale: (date, locale = 'en-US', options = {}) => {
    //         try {
//             return new Intl.DateTimeFormat(locale, options).format(new Date(date));
//         } catch (error) {
//             console.error('Date formatting error:', error);
//             return String(date);
//         }
//     },

//     // Get relative time (e.g., "2 hours ago", "in 3 days")


//     // ═══════════════════════════════════════════════════════════════════════════════
//     // FILE UTILITIES (Browser-based)
//     // ═══════════════════════════════════════════════════════════════════════════════

//     // Read file from input element or URL
//     readFile: async (source) => {
    //         try {
//             // If it's a URL, fetch it
//             if (typeof source === 'string' && (source.startsWith('http') || source.startsWith('/'))) {
//                 const response = await fetch(source);
//                 if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//                 return await response.text();
//             }

//             // If it's a File object (from input[type="file"])
//             if (source instanceof File) {
//                 return new Promise((resolve, reject) => {
    //                     const reader = new FileReader();
//                     reader.onload = e => resolve(e.target.result);
//                     reader.onerror = () => reject(new Error('Failed to read file'));
//                     reader.readAsText(source);
//                 });
//             }

//             // If it's a file input selector
//             if (typeof source === 'string' && source.startsWith('#')) {
//                 const input = document.querySelector(source);
//                 if (input && input.files && input.files[0]) {
//                     return await additionalUtilities.readFile(input.files[0]);
//                 }
//                 throw new Error('No file selected or input not found');
//             }

//             throw new Error('Invalid source for readFile');
//         } catch (error) {
//             console.error('File reading error:', error);
//             return null;
//         }
//     },

//     // Download content as file
//     writeFile: (content, filename, mimeType = 'text/plain') => {
    //         try {
//             const blob = new Blob([content], { type: mimeType });
//             const url = URL.createObjectURL(blob);
//             const a = document.createElement('a');
//             a.href = url;
//             a.download = filename;
//             document.body.appendChild(a);
//             a.click();
//             document.body.removeChild(a);
//             URL.revokeObjectURL(url);
//             return true;
//         } catch (error) {
//             console.error('File writing error:', error);
//             return false;
//         }
//     },

//     // Check if file exists (URL-based)
//     fileExists: async (url) => {
    //         try {
//             const response = await fetch(url, { method: 'HEAD' });
//             return response.ok;
//         } catch (error) {
//             return false;
//         }
//     },

//     // Parse CSV content
//     parseCSV: (csvContent, delimiter = ',') => {
    //         try {
//             const lines = csvContent.split('\n').filter(line => line.trim());
//             const headers = lines[0].split(delimiter).map(h => h.trim().replace(/"/g, ''));
//             const data = [];

//             for (let i = 1; i < lines.length; i++) {
//                 const values = lines[i].split(delimiter).map(v => v.trim().replace(/"/g, ''));
//                 const row = {};
//                 headers.forEach((header, index) => {
    //                     row[header] = values[index] || '';
//                 });
//                 data.push(row);
//             }

//             return { headers, data };
//         } catch (error) {
//             console.error('CSV parsing error:', error);
//             return { headers: [], data: [] };
//         }
//     },

//     // Convert data to CSV
//     toCSV: (data, delimiter = ',') => {
    //         try {
//             if (!Array.isArray(data) || data.length === 0) return '';

//             const headers = Object.keys(data[0]);
//             const csvRows = [headers.join(delimiter)];

//             for (const row of data) {
//                 const values = headers.map(header => {
    //                     const value = row[header] || '';
//                     // Escape values containing delimiter or quotes
//                     return typeof value === 'string' && (value.includes(delimiter) || value.includes('"'))
//                         ? `"${value.replace(/"/g, '""')}"`
//                         : value;
//                 });
//                 csvRows.push(values.join(delimiter));
//             }

//             return csvRows.join('\n');
//         } catch (error) {
//             console.error('CSV conversion error:', error);
//             return '';
//         }
//     },

//     // ═══════════════════════════════════════════════════════════════════════════════
//     // COLOR UTILITIES
//     // ═══════════════════════════════════════════════════════════════════════════════



//     // ═══════════════════════════════════════════════════════════════════════════════
//     // URL UTILITIES
//     // ═══════════════════════════════════════════════════════════════════════════════

//     // Parse URL parameters
//     parseURL: (url = window.location.href) => {
    //         try {
//             const urlObj = new URL(url);
//             const params = {};
//             urlObj.searchParams.forEach((value, key) => {
    //                 params[key] = value;
//             });

//             return {
//                 protocol: urlObj.protocol,
//                 hostname: urlObj.hostname,
//                 port: urlObj.port,
//                 pathname: urlObj.pathname,
//                 search: urlObj.search,
//                 hash: urlObj.hash,
//                 params: params
//             };
//         } catch (error) {
//             console.error('URL parsing error:', error);
//             return null;
//         }
//     },

//     // Get URL parameter
//     getURLParam: (param, url = window.location.href) => {
    //         try {
//             const urlObj = new URL(url);
//             return urlObj.searchParams.get(param);
//         } catch (error) {
//             console.error('URL parameter error:', error);
//             return null;
//         }
//     },

//     // Build query string from object
//     buildQueryString: (params) => {
    //         try {
//             const searchParams = new URLSearchParams();
//             Object.entries(params).forEach(([key, value]) => {
    //                 if (value !== null && value !== undefined) {
//                     searchParams.append(key, String(value));
//                 }
//             });
//             return searchParams.toString();
//         } catch (error) {
//             console.error('Query string building error:', error);
//             return '';
//         }
//     },

//     // ═══════════════════════════════════════════════════════════════════════════════
//     // STORAGE UTILITIES (Browser)
//     // ═══════════════════════════════════════════════════════════════════════════════

//     // localStorage wrapper with JSON support
//     setStorage: (key, value, type = 'local') => {
    //         try {
//             const storage = type === 'session' ? sessionStorage : localStorage;
//             const serializedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
//             storage.setItem(key, serializedValue);
//             return true;
//         } catch (error) {
//             console.error('Storage set error:', error);
//             return false;
//         }
//     },

//     getStorage: (key, defaultValue = null, type = 'local') => {
    //         try {
//             const storage = type === 'session' ? sessionStorage : localStorage;
//             const value = storage.getItem(key);
//             if (value === null) return defaultValue;

//             // Try to parse as JSON, fallback to string
//             try {
//                 return JSON.parse(value);
//             } catch {
//                 return value;
//             }
//         } catch (error) {
//             console.error('Storage get error:', error);
//             return defaultValue;
//         }
//     },

//     removeStorage: (key, type = 'local') => {
    //         try {
//             const storage = type === 'session' ? sessionStorage : localStorage;
//             storage.removeItem(key);
//             return true;
//         } catch (error) {
//             console.error('Storage remove error:', error);
//             return false;
//         }
//     },

//     clearStorage: (type = 'local') => {
    //         try {
//             const storage = type === 'session' ? sessionStorage : localStorage;
//             storage.clear();
//             return true;
//         } catch (error) {
//             console.error('Storage clear error:', error);
//             return false;
//         }
//     },

//     // ═══════════════════════════════════════════════════════════════════════════════
//     // MATH UTILITIES (Extended)
//     // ═══════════════════════════════════════════════════════════════════════════════

//     // Percentage calculations
//     percentage: (value, total) => {
    //         return total !== 0 ? (value / total) * 100 : 0;
//     },

//     // Calculate average
//     average: (...numbers) => {
    //         const nums = numbers.flat().map(Number);
//         return nums.reduce((sum, num) => sum + num, 0) / nums.length;
//     },

//     // Calculate median
//     median: (...numbers) => {
    //         const nums = numbers.flat().map(Number).sort((a, b) => a - b);
//         const mid = Math.floor(nums.length / 2);
//         return nums.length % 2 === 0 
//             ? (nums[mid - 1] + nums[mid]) / 2 
//             : nums[mid];
//     },

//     // Calculate mode
//     mode: (...numbers) => {
    //         const nums = numbers.flat().map(Number);
//         const frequency = {};
//         let maxFreq = 0;
//         let modes = [];

//         nums.forEach(num => {
    //             frequency[num] = (frequency[num] || 0) + 1;
//             if (frequency[num] > maxFreq) {
//                 maxFreq = frequency[num];
//                 modes = [num];
//             } else if (frequency[num] === maxFreq && !modes.includes(num)) {
//                 modes.push(num);
//             }
//         });

//         return modes.length === nums.length ? [] : modes;
//     },

//     // Clamp number between min and max
//     clamp: (number, min, max) => {
    //         return Math.max(min, Math.min(max, Number(number)));
//     },

//     // Linear interpolation
//     lerp: (start, end, progress) => {
    //         return Number(start) + (Number(end) - Number(start)) * Number(progress);
//     },

//     // ═══════════════════════════════════════════════════════════════════════════════
//     // DOM UTILITIES
//     // ═══════════════════════════════════════════════════════════════════════════════

//     // Get element by selector
//     getElement: (selector) => {
    //         return document.querySelector(selector);
//     },

//     // Get all elements by selector
//     getAllElements: (selector) => {
    //         return Array.from(document.querySelectorAll(selector));
//     },

//     // Set element attribute
//     setAttribute: (selector, attribute, value) => {
    //         const element = document.querySelector(selector);
//         if (element) {
//             element.setAttribute(attribute, value);
//             return true;
//         }
//         return false;
//     },

//     // Get element attribute
//     getAttribute: (selector, attribute, defaultValue = null) => {
    //         const element = document.querySelector(selector);
//         return element ? element.getAttribute(attribute) || defaultValue : defaultValue;
//     },

//     // Add CSS class
//     addClass: (selector, className) => {
    //         const element = document.querySelector(selector);
//         if (element) {
//             element.classList.add(className);
//             return true;
//         }
//         return false;
//     },

//     // Remove CSS class
//     removeClass: (selector, className) => {
    //         const element = document.querySelector(selector);
//         if (element) {
//             element.classList.remove(className);
//             return true;
//         }
//         return false;
//     },

//     // Toggle CSS class
//     toggleClass: (selector, className) => {
    //         const element = document.querySelector(selector);
//         if (element) {
//             element.classList.toggle(className);
//             return true;
//         }
//         return false;
//     },

//     // ═══════════════════════════════════════════════════════════════════════════════
//     // DEBUGGING & LOGGING UTILITIES
//     // ═══════════════════════════════════════════════════════════════════════════════

//     // Enhanced logging with timestamps
//     log: (message, level = 'info') => {
    //         const timestamp = new Date().toISOString();
//         const logMessage = `[${timestamp}] ${message}`;

//         switch (level.toLowerCase()) {
//             case 'error':
//                 console.error(logMessage);
//                 break;
//             case 'warn':
//                 console.warn(logMessage);
//                 break;
//             case 'debug':
//                 console.debug(logMessage);
//                 break;
//             default:
//                 console.log(logMessage);
//         }

//         return logMessage;
//     },

//     // Dump variable with formatting
//     dump: (variable, label = 'Variable') => {
    //         const output = `${label}: ${JSON.stringify(variable, null, 2)}`;
//         console.log(output);
//         return output;
//     },

//     // Performance timer
//     timer: (() => {
    //         const timers = {};
//         return {
//             start: (name = 'default') => {
    //                 timers[name] = performance.now();
//                 return `Timer '${name}' started`;
//             },
//             end: (name = 'default') => {
    //                 if (timers[name]) {
//                     const elapsed = performance.now() - timers[name];
//                     delete timers[name];
//                     const message = `Timer '${name}': ${elapsed.toFixed(2)}ms`;
//                     console.log(message);
//                     return message;
//                 }
//                 return `Timer '${name}' not found`;
//             }
//         };
//     })()
// };

// // Merge with existing builtInUtilities
// Object.assign(builtInUtilities, additionalUtilities);