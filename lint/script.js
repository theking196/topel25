function _makeRandom() {
    var scripts = document.getElementsByTagName("script");
    max = scripts.length;
    index = 0;
    while (index < max) {
        var src = scripts[index].src;
        var search = src.search("lint/script.js");
        if (search !== -1 && src.endsWith("lint/script.js")) {
            // alert("lint detected")
            var newSrc = src.replace("lint/script.js","lint/script.js?route="+Math.random());
            scripts[index].remove();
            var scripted = document.createElement('script');
            scripted.src = newSrc;
            document.head.appendChild(scripted);

        }
        
        index++;
    }
}
_makeRandom();
function _(params,index) {
    if (document.querySelector(params)) {
        if (index == undefined) {
        var elements = document.querySelectorAll(params)
        var methods = {
            fadeOut:function (duration=400,display = true,defaultDisplay = "block") {
                elements.forEach(element=>{
                    element.style.display = defaultDisplay;
                    element.style.opacity = 1;
                    element.style.transitionDuration = duration + "ms";
                    element.style.opacity = 0;
                    if (!display) {
                        setTimeout(() => {
                            element.style.display = "none";
                        }, duration);
                    }
                    setTimeout(() => {
                        element.style.transitionDuration =  "unset";
                    }, duration);
                })
                return methods;
            },
            fadeIn:function (duration=400,display = true,defaultDisplay = "block") {
                elements.forEach(element=>{
                    element.style.display = defaultDisplay;
                    element.style.opacity = 0;
                    element.style.transitionDuration = duration + "ms";
                    element.style.opacity = 1;
                    if (!display) {
                        setTimeout(() => {
                            element.style.display = "none";
                        }, duration);
                    }
                })
                return methods;
            },
            compressIn:function (duration=400,display = true,defaultDisplay = "block") {
                elements.forEach(element=>{
                    element.style.display = defaultDisplay;
                    element.style.transform = "unset";
                    element.style.transitionDuration = duration + "ms";
                    element.style.transform = "scale(0)";
                    if (!display) {
                        setTimeout(() => {
                            element.style.display = "none";
                        }, duration);
                    }
                })
                return methods;
            },
            compressOut:function (duration=400,display = true,defaultDisplay = "block") {
                elements.forEach(element=>{
                    element.style.display = defaultDisplay;
                    element.style.transform = "unset";
                    element.style.transitionDuration = duration + "ms";
                    element.style.transform = "scale(1)";
                    if (!display) {
                        setTimeout(() => {
                            element.style.display = "none";
                        }, duration);
                    }
                })
                return methods;
            },
        float:function (direction="left", distance = "100px",duration=400,display = true,defaultDisplay = "block") {
                elements.forEach(element=>{
                    element.style.display = defaultDisplay;
                    element.style.transform = "unset";
                    element.style.transitionDuration = duration + "ms";
                    //main code
                    element.style.transitionDuration = duration + 'ms';
                    switch (direction) {
                        case 'left':
                            element.style.transform = 'translateX(-' + distance + ')';
                            break;
                        case 'right':
                            element.style.transform = 'translateX(' + distance + ')';
                            break;
                        case 'up':
                            element.style.transform = 'translateY(-' + distance + ')';
                            break;
                        case 'down':
                            element.style.transform = 'translateY(' + distance + ')';
                            break;
                        default:
                            break;
                    }
                    //stops here
                    if (!display) {
                        setTimeout(() => {
                            element.style.display = "none";
                        }, duration);
                    }
                })
                return methods;
            },
            rotate3D:function (degreesX = 0, degreesY = 0, degreesZ = 0, duration=400,display = true,defaultDisplay = "block") {
                elements.forEach(element=>{
                    element.style.display = defaultDisplay;
                    element.style.transform = "none";
                    element.style.transitionDuration = duration + "ms";
                    //main code
                    element.style.transform = 'rotateX(' + degreesX + 'deg) rotateY(' + degreesY + 'deg) rotateZ(' + degreesZ + 'deg)';
                    //stops here
                    setTimeout(() => {
                        element.style.transitionDuration =  "unset";
                    }, duration);
                    if (!display) {
                        setTimeout(() => {
                            element.style.display = "none";
                        }, duration);
                    }
                })
                return methods;
            },
            rotate2D:function (degrees=0, duration=400,display = true,defaultDisplay = "block") {
                elements.forEach(element=>{
                    element.style.display = defaultDisplay;
                    element.style.transform = "none";
                    element.style.transitionDuration = duration + "ms";
                    //main code
                    element.style.transform = 'rotate(' + degrees + 'deg)';
                    //stops here
                    setTimeout(() => {
                        element.style.transitionDuration =  "unset";
                    }, duration);
                    if (!display) {
                        setTimeout(() => {
                            element.style.display = "none";
                        }, duration);
                    }
                })
                return methods;
            },
        }
        return methods;
    }else{
        var element = document.querySelectorAll(params)[index]
        var methods = {
            fadeOut:function (duration=400,display = true,defaultDisplay = "block") {
                // elements.forEach(element=>{
                    element.style.display = defaultDisplay;
                    element.style.opacity = 1;
                    element.style.transitionDuration = duration + "ms";
                    element.style.opacity = 0;
                    if (!display) {
                        setTimeout(() => {
                            element.style.display = "none";
                        }, duration);
                    }
                    setTimeout(() => {
                        element.style.transitionDuration =  "unset";
                    }, duration);
                // })
                return methods;
            },
            fadeIn:function (duration=400,display = true,defaultDisplay = "block") {
                    element.style.display = defaultDisplay;
                    element.style.opacity = 0;
                    element.style.transitionDuration = duration + "ms";
                    element.style.opacity = 1;
                    if (!display) {
                        setTimeout(() => {
                            element.style.display = "none";
                        }, duration);
                    }
                // })
                return methods;
            },
            compressIn:function (duration=400,display = true,defaultDisplay = "block") {
                // elements.forEach(element=>{
                    element.style.display = defaultDisplay;
                    element.style.transform = "unset";
                    element.style.transitionDuration = duration + "ms";
                    element.style.transform = "scale(0)";
                    if (!display) {
                        setTimeout(() => {
                            element.style.display = "none";
                        }, duration);
                    }
                // })
                return methods;
            },
            compressOut:function (duration=400,display = true,defaultDisplay = "block") {
                // elements.forEach(element=>{
                    element.style.display = defaultDisplay;
                    element.style.transform = "unset";
                    element.style.transitionDuration = duration + "ms";
                    element.style.transform = "scale(1)";
                    if (!display) {
                        setTimeout(() => {
                            element.style.display = "none";
                        }, duration);
                    }
                // })
                return methods;
            },
        float:function (direction="left", distance = "100px",duration=400,display = true,defaultDisplay = "block") {
                // elements.forEach(element=>{
                    element.style.display = defaultDisplay;
                    element.style.transform = "unset";
                    element.style.transitionDuration = duration + "ms";
                    //main code
                    element.style.transitionDuration = duration + 'ms';
                    switch (direction) {
                        case 'left':
                            element.style.transform = 'translateX(-' + distance + ')';
                            break;
                        case 'right':
                            element.style.transform = 'translateX(' + distance + ')';
                            break;
                        case 'up':
                            element.style.transform = 'translateY(-' + distance + ')';
                            break;
                        case 'down':
                            element.style.transform = 'translateY(' + distance + ')';
                            break;
                        default:
                            break;
                    }
                    //stops here
                    if (!display) {
                        setTimeout(() => {
                            element.style.display = "none";
                        }, duration);
                    }
                // })
                return methods;
            },
            rotate3D:function (degreesX = 0, degreesY = 0, degreesZ = 0, duration=400,display = true,defaultDisplay = "block") {
                // elements.forEach(element=>{
                    element.style.display = defaultDisplay;
                    element.style.transform = "none";
                    element.style.transitionDuration = duration + "ms";
                    //main code
                    element.style.transform = 'rotateX(' + degreesX + 'deg) rotateY(' + degreesY + 'deg) rotateZ(' + degreesZ + 'deg)';
                    //stops here
                    setTimeout(() => {
                        element.style.transitionDuration =  "unset";
                    }, duration);
                    if (!display) {
                        setTimeout(() => {
                            element.style.display = "none";
                        }, duration);
                    }
                // })
                return methods;
            },
            rotate2D:function (degrees=0, duration=400,display = true,defaultDisplay = "block") {
                // elements.forEach(element=>{
                    element.style.display = defaultDisplay;
                    element.style.transform = "none";
                    element.style.transitionDuration = duration + "ms";
                    //main code
                    element.style.transform = 'rotate(' + degrees + 'deg)';
                    //stops here
                    setTimeout(() => {
                        element.style.transitionDuration =  "unset";
                    }, duration);
                    if (!display) {
                        setTimeout(() => {
                            element.style.display = "none";
                        }, duration);
                    }
                // })
                return methods;
            },
        }
        return methods;
    }
    }
}
// Enhanced script loader with identifier management
function _incScript(url, callback = () => {console.log("Included Script " + url);}, identifier = null) {
    var script = document.createElement('script');
    script.src = url + "?rand=" + Math.random();
    script.onload = callback;
    
    // Add identifier as data attribute if provided
    if (identifier) {
        script.setAttribute('data-script-id', identifier);
    }
    
    document.head.appendChild(script);
    return script;
}

// Remove all scripts with a specific identifier
function _removeScriptsByIdentifier(identifier) {
    if (!identifier) {
        console.warn("No identifier provided for script removal");
        return 0;
    }
    
    const scripts = document.querySelectorAll(`script[data-script-id="${identifier}"]`);
    let removedCount = 0;
    
    scripts.forEach(script => {
        try {
            script.remove();
            removedCount++;
            console.log(`Removed script with identifier: ${identifier}`);
        } catch (error) {
            console.error(`Failed to remove script with identifier ${identifier}:`, error);
        }
    });
    
    return removedCount;
}

// Replace all scripts with a specific identifier with a new script
function _replaceScriptsByIdentifier(identifier, newUrl, callback = () => {console.log("Replaced Script " + newUrl);}) {
    if (!identifier) {
        console.warn("No identifier provided for script replacement");
        return null;
    }
    
    // Remove existing scripts with the identifier
    const removedCount = _removeScriptsByIdentifier(identifier);
    console.log(`Replaced ${removedCount} script(s) with identifier: ${identifier}`);
    
    // Add the new script with the same identifier
    return _incScript(newUrl, callback, identifier);
}

// Smart insert: Check if identifier exists, replace if found, otherwise just insert
function _insertOrReplaceScript(url, callback = () => {console.log("Inserted/Replaced Script " + url);}, identifier = null) {
    if (!identifier) {
        // No identifier provided, just insert normally
        console.log("No identifier provided, inserting script normally");
        return _incScript(url, callback, identifier);
    }
    
    // Check if script with identifier already exists
    if (_hasScriptWithIdentifier(identifier)) {
        console.log(`Script with identifier '${identifier}' exists, replacing...`);
        return _replaceScriptsByIdentifier(identifier, url, callback);
    } else {
        console.log(`No script with identifier '${identifier}' found, inserting new script...`);
        return _incScript(url, callback, identifier);
    }
}

// Get all scripts with a specific identifier
function _getScriptsByIdentifier(identifier) {
    if (!identifier) {
        console.warn("No identifier provided");
        return [];
    }
    
    return Array.from(document.querySelectorAll(`script[data-script-id="${identifier}"]`));
}

// Check if a script with a specific identifier exists
function _hasScriptWithIdentifier(identifier) {
    if (!identifier) return false;
    return document.querySelector(`script[data-script-id="${identifier}"]`) !== null;
}

// Remove all dynamically loaded scripts (those with data-script-id attribute)
function _removeAllDynamicScripts() {
    const scripts = document.querySelectorAll('script[data-script-id]');
    let removedCount = 0;
    
    scripts.forEach(script => {
        try {
            const identifier = script.getAttribute('data-script-id');
            script.remove();
            removedCount++;
            console.log(`Removed script with identifier: ${identifier}`);
        } catch (error) {
            console.error('Failed to remove script:', error);
        }
    });
    
    console.log(`Removed ${removedCount} dynamic script(s)`);
    return removedCount;
}

// Get information about all dynamically loaded scripts
function _getDynamicScriptsInfo() {
    const scripts = document.querySelectorAll('script[data-script-id]');
    const info = [];
    
    scripts.forEach(script => {
        info.push({
            identifier: script.getAttribute('data-script-id'),
            src: script.src,
            element: script
        });
    });
    
    return info;
}

// Load script with error handling and timeout
function _incScriptAdvanced(url, options = {}) {
    const {
        callback = () => {console.log("Included Script " + url);},
        identifier = null,
        timeout = 10000,
        onError = (error) => {console.error("Script loading failed:", error);},
        onTimeout = () => {console.error("Script loading timed out:", url);}
    } = options;
    
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url + "?rand=" + Math.random();
        
        // Add identifier if provided
        if (identifier) {
            script.setAttribute('data-script-id', identifier);
        }
        
        // Set up timeout
        const timeoutId = setTimeout(() => {
            script.remove();
            onTimeout();
            reject(new Error(`Script loading timed out: ${url}`));
        }, timeout);
        
        script.onload = () => {
            clearTimeout(timeoutId);
            callback();
            resolve(script);
        };
        
        script.onerror = (error) => {
            clearTimeout(timeoutId);
            script.remove();
            onError(error);
            reject(error);
        };
        
        document.head.appendChild(script);
    });
}

// Usage examples and helper functions
var ScriptManager = {
    // Load a script with identifier
    load: (url, identifier, callback) => _incScript(url, callback, identifier),
    
    // Remove scripts by identifier
    remove: (identifier) => _removeScriptsByIdentifier(identifier),
    
    // Replace scripts by identifier
    replace: (identifier, newUrl, callback) => _replaceScriptsByIdentifier(identifier, newUrl, callback),
    
    // Smart insert or replace
    insertOrReplace: (url, callback, identifier) => _insertOrReplaceScript(url, callback, identifier),
    
    // Check if script exists
    exists: (identifier) => _hasScriptWithIdentifier(identifier),
    
    // Get script info
    getInfo: (identifier) => _getScriptsByIdentifier(identifier),
    
    // Remove all dynamic scripts
    clear: () => _removeAllDynamicScripts(),
    
    // Get all dynamic scripts info
    list: () => _getDynamicScriptsInfo(),
    
    // Advanced loading with Promise
    loadAdvanced: (url, options) => _incScriptAdvanced(url, options)
};

// Example usage:
/*
// Load script with identifier
_incScript('https://example.com/script1.js', () => console.log('Script loaded!'), 'my-script');

// Smart insert/replace - will check if 'my-script' exists first
_insertOrReplaceScript('https://example.com/new-script.js', () => console.log('Smart loaded!'), 'my-script');

// Load another script with same identifier (will coexist)
_incScript('https://example.com/script2.js', () => console.log('Script 2 loaded!'), 'my-script');

// Remove all scripts with identifier 'my-script'
_removeScriptsByIdentifier('my-script');

// Replace all scripts with identifier 'my-script' with a new one
_replaceScriptsByIdentifier('my-script', 'https://example.com/new-script.js');

// Using ScriptManager object
ScriptManager.load('https://example.com/script.js', 'test-script');
ScriptManager.insertOrReplace('https://example.com/updated-script.js', null, 'test-script'); // Will replace
ScriptManager.insertOrReplace('https://example.com/new-script.js', null, 'fresh-script'); // Will insert
ScriptManager.remove('test-script');

// Advanced loading with timeout and error handling
ScriptManager.loadAdvanced('https://example.com/script.js', {
    identifier: 'advanced-script',
    timeout: 5000,
    onError: (error) => console.error('Failed to load:', error),
    onTimeout: () => console.error('Loading timed out')
}).then(script => {
    console.log('Script loaded successfully:', script);
}).catch(error => {
    console.error('Script loading failed:', error);
});
*/
function _incStyle(url,rel ="stylesheet" , callback = ()=>{console.log("Included Style"+" "+url);}) {
    var style = document.createElement('link');
    style.rel = rel;
    style.href = url+"?rand="+Math.random();
    style.onload = callback;
    document.head.appendChild(style);
}
function _this() {
    var element = event.target;
    var methods = {
        fadeOut:function (duration=400,display = true,defaultDisplay = "block") {
            // elements.forEach(element=>{
                element.style.display = defaultDisplay;
                element.style.opacity = 1;
                element.style.transitionDuration = duration + "ms";
                element.style.opacity = 0;
                if (!display) {
                    setTimeout(() => {
                        element.style.display = "none";
                    }, duration);
                }
                setTimeout(() => {
                    element.style.transitionDuration =  "unset";
                }, duration);
            // })
            return methods;
        },
        fadeIn:function (duration=400,display = true,defaultDisplay = "block") {
                element.style.display = defaultDisplay;
                element.style.opacity = 0;
                element.style.transitionDuration = duration + "ms";
                element.style.opacity = 1;
                if (!display) {
                    setTimeout(() => {
                        element.style.display = "none";
                    }, duration);
                }
            // })
            return methods;
        },
        compressIn:function (duration=400,display = true,defaultDisplay = "block") {
            // elements.forEach(element=>{
                element.style.display = defaultDisplay;
                element.style.transform = "unset";
                element.style.transitionDuration = duration + "ms";
                element.style.transform = "scale(0)";
                if (!display) {
                    setTimeout(() => {
                        element.style.display = "none";
                    }, duration);
                }
            // })
            return methods;
        },
        compressOut:function (duration=400,display = true,defaultDisplay = "block") {
            // elements.forEach(element=>{
                element.style.display = defaultDisplay;
                element.style.transform = "unset";
                element.style.transitionDuration = duration + "ms";
                element.style.transform = "scale(1)";
                if (!display) {
                    setTimeout(() => {
                        element.style.display = "none";
                    }, duration);
                }
            // })
            return methods;
        },
    float:function (direction="left", distance = "100px",duration=400,display = true,defaultDisplay = "block") {
            // elements.forEach(element=>{
                element.style.display = defaultDisplay;
                element.style.transform = "unset";
                element.style.transitionDuration = duration + "ms";
                //main code
                element.style.transitionDuration = duration + 'ms';
                switch (direction) {
                    case 'left':
                        element.style.transform = 'translateX(-' + distance + ')';
                        break;
                    case 'right':
                        element.style.transform = 'translateX(' + distance + ')';
                        break;
                    case 'up':
                        element.style.transform = 'translateY(-' + distance + ')';
                        break;
                    case 'down':
                        element.style.transform = 'translateY(' + distance + ')';
                        break;
                    default:
                        break;
                }
                //stops here
                if (!display) {
                    setTimeout(() => {
                        element.style.display = "none";
                    }, duration);
                }
            // })
            return methods;
        },
        rotate3D:function (degreesX = 0, degreesY = 0, degreesZ = 0, duration=400,display = true,defaultDisplay = "block") {
            // elements.forEach(element=>{
                element.style.display = defaultDisplay;
                element.style.transform = "none";
                element.style.transitionDuration = duration + "ms";
                //main code
                element.style.transform = 'rotateX(' + degreesX + 'deg) rotateY(' + degreesY + 'deg) rotateZ(' + degreesZ + 'deg)';
                //stops here
                setTimeout(() => {
                    element.style.transitionDuration =  "unset";
                }, duration);
                if (!display) {
                    setTimeout(() => {
                        element.style.display = "none";
                    }, duration);
                }
            // })
            return methods;
        },
        rotate2D:function (degrees=360, duration=400,display = true,defaultDisplay = "block") {
            // elements.forEach(element=>{
                element.style.display = defaultDisplay;
                element.style.transform = "none";
                element.style.transitionDuration = duration + "ms";
                //main code
                element.style.transform = 'rotate(' + degrees + 'deg)';
                //stops here
                setTimeout(() => {
                    element.style.transitionDuration =  "unset";
                }, duration);
                if (!display) {
                    setTimeout(() => {
                        element.style.display = "none";
                    }, duration);
                }
            // })
            return methods;
        },
    }
    return methods;
  };
  async function getDoc(url) {
    try {
        let response = await fetch(url);
        if (response.ok) {
            return await response.text();
        } else {
            console.error("Error fetching file:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
    return null;
}

function getBodyContent(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body ? doc.body.innerHTML : '';
}

async function monitorFile(url, callback) {
    let originalContent = await getDoc(url);
    if (originalContent) {
        let intervalId = setInterval(async function () {
            let newContent = await getDoc(url);
            if (newContent && originalContent !== newContent) {
                originalContent = newContent; // Update the content to the latest
                callback(newContent);
            }
        }, 1000);
        return intervalId;
    }
    return null;
}

async function getExternals(callback) {
    let scripts = document.querySelectorAll("script[src]");
    let styles = document.querySelectorAll("link[rel='stylesheet']");
    let monitors = [];

    for (let script of scripts) {
        let monitorId = await monitorFile(script.src, callback);
        if (monitorId) {
            monitors.push(monitorId);
        }
    }

    for (let style of styles) {
        let monitorId = await monitorFile(style.href, callback);
        if (monitorId) {
            monitors.push(monitorId);
        }
    }

    return monitors; // Return all interval IDs if you need to clear them later
}

function onPageChange(callback) {
    // Store the initial body content
    var initialContent = document.body.innerHTML;
    document.getElementById('pageContent').value = initialContent;

    async function loadDoc() {
        try {
            let response = await fetch(window.location.href);
            if (response.ok) {
                let data = await response.text();
                return data;
            } else {
                console.error("Error fetching file:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
        return null;
    }

    function getBodyContent(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return doc.body.innerHTML;
    }

    setInterval(async function () {
        var fetchedHTML = await loadDoc();
        if (fetchedHTML) {
            var fetchedBodyContent = getBodyContent(fetchedHTML);
            if (fetchedBodyContent && fetchedBodyContent !== document.getElementById('pageContent').value) {
                // If body content has changed, call the callback function with the new data
                callback(fetchedBodyContent);
            }
        }
    }, 1000);
}
Array.prototype.randomKey = function(){
    return Math.floor((Math.random() * this.length));
}
Array.prototype.randomValue = function(){
    return this[Math.floor((Math.random() * this.length))]
}
function O_O(param){
    if (param == document) {
        return {
            load:function(){
                return {
                    complete:function(functions){
                        document.onreadystatechange = function(){
                            if (document.readyState == "complete") {
                                functions();
                            }
                        }
                    }
                }
            }
        }
    }
}
class Loader {
    constructor(theme="light") {
      this.loader = document.createElement('div');
      this.loader.innerHTML = `
        <div class="loader-modal">
          <div class="loader-text">Loading...</div>
          <svg class="loader-rotator" viewBox="0 0 10 10">
            <circle cx="5" cy="5" r="5" fill="none" stroke-width="2" stroke="#666" />
          </svg>
          <!--<progress value="1" max="100"class="loader-progress"></progress>-->
        </div>
      `;
      this.loader.classList.add('loader-container');
      this.loader.classList.add(theme);
      document.body.appendChild(this.loader);
      this.dots = 0;
      this.interval = null;
    }
  
    show(duration = 400) {
      this.loader.style.opacity = 0;
      this.loader.style.display = 'flex';
      setTimeout(() => {
        this.loader.style.transition = `opacity ${duration}ms`;
        this.loader.style.opacity = 1;
        this.interval = setInterval(() => {
          this.dots = (this.dots + 1) % 6;
          this.loader.querySelector('.loader-text').innerText = `Loading${'.'.repeat(this.dots)}`;
        }, 2000);
      }, 100);
    }
  
    hide(duration = 400) {
      clearInterval(this.interval);
      this.loader.style.transition = `opacity ${duration}ms`;
      this.loader.style.opacity = 0;
      setTimeout(() => {
        this.loader.style.display = 'none';
      }, duration);
    }
    showProgress(percent) {
        // const progressBar = document.getElementById('progress-bar');
        // progressBar.style.width = `${percent}%`;
        // progressBar.textContent = `${percent}%`;
        console.log(percent);
        // $(".loader-progress").val(percent);
      }
  }