"use strict";

type BuiltInUtilities = {
    [key: string]: (...args: any[]) => any;
};

type ReplaceOptions = {
    fallback?: string;
    builtInUtilities?: BuiltInUtilities;
    variables?: { [key: string]: any };
};

// Utility function to get a value from the context
const getValue = (key: string, context: any, fallback: string): any => {
  if (typeof context === 'string') {
      return context;
  } else if (Array.isArray(context)) {
      const index = parseInt(key, 10);
      if (!isNaN(index) && index >= 0 && index < context.length) {
          return context[index];
      }
      return fallback;
  } else if (typeof context === 'object') {
      // Support nested properties like 'foods.1'
      const keys = key.split('.');
      let value = context;
      for (const k of keys) {
          value = value[k];
          if (value === undefined) {
              return fallback;
          }
      }
      return value;
  }
  return fallback;
};

// Utility function to process placeholders
const processPlaceholders = (str: string, context: any, fallback: string, regex: RegExp): string => {
  return str.replace(regex, (match, key) => {
      const trimmedKey = key.trim();
      const value = getValue(trimmedKey, context, fallback);
      return typeof value === 'function' ? value() : String(value);
  });
};

// Utility function to process all placeholders
const processAllPlaceholders = (str: string, context: any, fallback: string): string => {
    const placeholderRegex = /\{\{(.*?)\}\}/g;
    const jsVariableRegex = /\[\[(.*?)\]\]/g;
    let processedStr = str;
    processedStr = processPlaceholders(processedStr, context, fallback, jsVariableRegex);
    processedStr = processPlaceholders(processedStr, context, fallback, placeholderRegex);
    return processedStr;
};

// Utility function to process built-in utilities
const processBuiltInUtilities = (str: string, builtInUtilities: BuiltInUtilities, data: any, fallback: string): string => {
  const builtInUtilitiesRegex = /\{\[(.*?)\]\}/g;
  
  return str.replace(builtInUtilitiesRegex, (match, key) => {
      const trimmedKey = key.trim();
      const fnMatch = trimmedKey.match(/^(\w+)\((.*)\)$/);
      
      if (fnMatch) {
          const [_, fnName, fnArgs] = fnMatch;
          const utilityFn = builtInUtilities[fnName];
          
          if (utilityFn) {
              try {
                  // Process arguments, including nested placeholders
                  const args = fnArgs.split(',').map((arg:string) => {
                      return processPlaceholders(arg.trim().replace(/^['"]|['"]$/g, ''), data, fallback, /\{\{(.*?)\}\}/g);
                  });

                  // Handle flow control utilities
                  switch (fnName) {
                      // case 'ifElse': {
                      //     const [conditionStr, trueValue, falseValue] = args;
                      //     const condition = eval(conditionStr); // Caution with eval
                      //     return utilityFn(condition, trueValue, falseValue);
                      // }
                      case 'while': {
                          const [conditionStr, callbackStr] = args;
                          const conditionFn = new Function('return ' + conditionStr) as () => boolean;
                          const callbackFn = new Function('return ' + callbackStr) as () => any;
                          return utilityFn(conditionFn, callbackFn);
                      }
                      case 'forEach': {
                        const [arrayStr, callbackStr] = args;
                        // Handle ordinary array directly
                        const array = eval(arrayStr); // Caution: Using eval can be dangerous
                        const callbackFn = new Function('item', 'index', 'return ' + callbackStr) as (item: any, index: number) => any;
                        return utilityFn(array, callbackFn);
                      }
                      default: {
                          const result = utilityFn(...args);
                          return typeof result === 'string' ? result : JSON.stringify(result);
                      }
                  }
              } catch (e) {
                  console.error(`Error executing function ${fnName}:`, e);
                  return fallback;
              }
          }
      } else {
          const utilityFn = builtInUtilities[trimmedKey];
          if (utilityFn) {
              try {
                  return utilityFn();
              } catch (e) {
                  console.error(`Error executing function ${trimmedKey}:`, e);
                  return fallback;
              }
          }
      }
      return fallback;
  });
};

// Main function to replace placeholders
function replacePlaceholders(response: string, data: any, options: ReplaceOptions = {}): string {
  const { fallback = '', builtInUtilities = {}, variables = {} } = options;
  const placeholderRegex = /\{\{(.*?)\}\}/g;
  const jsVariableRegex = /\[\[(.*?)\]\]/g;

  // First process JavaScript variables [[...]]
  let processedResponse = processPlaceholders(response, variables, fallback, jsVariableRegex);
  // Then process built-in utilities {[...]}
  processedResponse = processBuiltInUtilities(processedResponse, builtInUtilities, data, fallback);
  // Finally process placeholders {{...}}
  processedResponse = processPlaceholders(processedResponse, data, fallback, placeholderRegex);

  return processedResponse;
}

// Example built-in utilities
const builtInUtilities: BuiltInUtilities = {
  // Existing utilities...

  // String utilities
  uppercase: (string: string) => string.toUpperCase(),
  lowercase: (string: string) => string.toLowerCase(),
  title: (string: string) => string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '),
  capitalize: (string: string) => string.replace(/\b\w/g, char => char.toUpperCase()),
  trim: (string: string) => string.trim(),
  replace: (string: string, search: string, replacement: string) => string.replace(new RegExp(search, 'g'), replacement),
  substr: (string: string, start: number, length?: number) => string.substr(start, length),
  split: (string: string, delimiter: string) => string.split(delimiter),

  // Number utilities
  add: (a: number, b: number) => a + b,
  subtract: (a: number, b: number) => a - b,
  multiply: (a: number, b: number) => a * b,
  divide: (a: number, b: number) => b !== 0 ? a / b : 'Division by zero error',
  round: (number: number) => Math.round(number),
  floor: (number: number) => Math.floor(number),
  ceil: (number: number) => Math.ceil(number),
  toFixed: (number: number, digits: number) => number.toFixed(digits),
  random: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min,

  // Date and time utilities
  currentDate: () => new Date().toLocaleDateString(),
  currentTime: () => new Date().toLocaleTimeString(),
  formatDate: (date: string, format: string) => {
      const options: Intl.DateTimeFormatOptions = {};
      if (format.includes('year')) options.year = 'numeric';
      if (format.includes('month')) options.month = '2-digit';
      if (format.includes('day')) options.day = '2-digit';
      return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
  },
  formatTime: (time: string, format: string) => {
      const options: Intl.DateTimeFormatOptions = {};
      if (format.includes('hour')) options.hour = '2-digit';
      if (format.includes('minute')) options.minute = '2-digit';
      if (format.includes('second')) options.second = '2-digit';
      return new Intl.DateTimeFormat('en-US', options).format(new Date(time));
  },

  // Array utilities
  join: (array: any[], delimiter: string) => array.join(delimiter),
  first: (array: any[]) => array[0],
  last: (array: any[]) => array[array.length - 1],
  length: (array: any[]) => array.length,
  slice: (array: any[], start: number, end?: number) => array.slice(start, end),

  // Object utilities
  keys: (obj: object) => Object.keys(obj),
  values: (obj: object) => Object.values(obj),
  entries: (obj: object) => Object.entries(obj),
  merge: (...objs: object[]) => Object.assign({}, ...objs),
  deepClone: (obj: any) => JSON.parse(JSON.stringify(obj)),

  // Logical utilities
  isEmpty: (value: any) => value == null || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && Object.keys(value).length === 0),
  isNotEmpty: (value: any) => !builtInUtilities.isEmpty(value),

  // Control flow utilities
  ifElse: (condition: string, trueValue: any, falseValue: any) => {
    const evaluatedCondition = eval(condition);
    return evaluatedCondition ? trueValue : falseValue;
  },
    while: (condition: () => boolean, callback: () => any) => {
        let result = '';
        while (condition()) {
            result += callback();
        }
        return result;
    },
    forEach: (array: any[], callback: (item: any, index: number) => any) => {
        let result = '';
        array.forEach((item, index) => {
            result += callback(item, index);
        });
        return result;
    },
};

// WeakMap to store the original content of the elements
const originalContentMap = new WeakMap<HTMLElement, string>();
const originalContents = new Map<HTMLElement, string>();
// Function to replace placeholders in the document
function replacePlaceholdersInDocument(selector: string, data: any, options: ReplaceOptions = {}): string[] {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    const results: string[] = [];
    

    elements.forEach(element => {
        if (!originalContents.has(element)) {
            originalContents.set(element, element.innerHTML);
        }
    });


    originalContents.forEach((originalContent, element) => {
      // console.log("originalContent is "+originalContent);
    
        const newContent = replacePlaceholders(originalContent, data, options);
        element.innerHTML = newContent;
        results.push(newContent);
    });
    
    return results;
}
// Example usage:
// const data = {
//     name: "James",
//     class: "University level 1",
//     foods: ["rice and beans", "jollof rice"],
//     now:false,
// };

// const options: ReplaceOptions = {
//     builtInUtilities,
//     variables: { action: "running", nextaction: "sleeping" }
// };

// // Initial replacement on page load
// const initialReplacements = replacePlaceholdersInDocument(".placeholder, .placeholder2", data, options);
// console.log('Initial Replacements:', initialReplacements); // Debug log

// document.onclick = function () {
    
//     if (data.now == true) {
//       data.now = false;
//       options.variables = {action:"running",nextaction:"sleeping"};
//       replacePlaceholdersInDocument(".placeholder, .placeholder2", data, options);
//     }else{
//       data.now = true;
//       options.variables = {action:"sleeping",nextaction:"running"};
//       replacePlaceholdersInDocument(".placeholder, .placeholder2", data, options);
//     }
    
//     // console.log(options,data); 
// };
// const response = `

// `;

// const data = {
//     name: "James",
//     class: "University level 1",
//     foods: ["rice and beans", "jollof rice"],
//     count: 5
// };

// const options: ReplaceOptions = {
//     builtInUtilities,
//     variables: { action: "running", nextaction: "sleeping" }
// };

// const result = replacePlaceholders(response, data, options);
// console.log(result);

// const option: ReplaceOptions = {
//   builtInUtilities,
//   variables: { action: "running", nextaction: "sleeping" }
// };

// // Using new utilities
// const response = `Result: {[ifElse(3 !== 3, 'Many', 'Few')]}`;
// const result = replacePlaceholders(response, datas, option);
// console.log(result);