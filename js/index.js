var data = {
        SiteName: "TOPEL' 25",
        MenuItems: [
                { name: 'Home', link:"index.html",active:"", disabled:false},
                { name: 'About', link:"about.html",active:"", disabled:false},
                { name: 'details', link:"details.html",active:"", disabled:false},
                { name: 'gallery', link:"gallery.html",active:"", disabled:false},
                { name: 'Prayers For The Couple', link:"prayers.html",active:"", disabled:false},
                { name: 'Contribuors', link:"contributors.html", disabled:true},
            ],
    };
        
    $(document).ready(async function () {
    var click = 0;
    
    
    
    // Iterate through MenuItems to find the active page
    Object.keys(data.MenuItems).forEach(menuKey => {
        const menuItem = data.MenuItems[menuKey];
        if (Array.isArray(menuItem)) {
            // Check if this menu item contains 'active'
            if (menuItem.includes('active')) {
                data.currentpage = menuKey; // Set the key (e.g., 'home') as current page
                // Or if you want the display name: data.currentpage = menuItem[0];
            }
        }
    });
    
    const loopFilters = {
            even: (arr) => arr.filter((_, i) => i % 2 === 0),
            gt: (arr, field, min) => arr.filter(item => getValue(field, item) > parseFloat(min)),
            isExpensive: (arr) => arr.filter(i => i.details.price > 100),
            byPrefix: (arr, prefix) => arr.filter(i => i.name.startsWith(prefix)),
            random: function (array){
                for (let i = array.length -1; i > 0; i--) {
                    let j = Math.floor(Math.random() * (i+1));
                    let k = array[i];
                    array[i] = array[j];
                    array[j] = k;
                }
                return array;
                
            }
        };
        const options = { 
            builtInUtilities,
            variables: { action: "running", nextaction: "sleeping"},
            loopFilters,
            page:1,
        };
    
        // setTimeout(async () => {
        //     data.MenuItems[0].active = "active";
            var hhh = await replacePlaceholdersInDocument("body",data,options);
            $(".loader").fadeOut()
             
        // }, 1000);
    
    
    $(".hamburger").click(function () {
        $(".menu").toggleClass("active")
    })
    
})
