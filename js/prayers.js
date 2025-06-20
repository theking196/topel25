    const videos = [
      { title: "Prayer for Unity", file: "videos/unity.mp4" },
      { title: "Forgiveness in Marriage", file: "videos/forgiveness.mp4" },
      { title: "Love Rekindled", file: "videos/love.mp4" },
      { title: "Overcoming Trials", file: "videos/trials.mp4" },
      { title: "Faithful Love", file: "videos/faithful.mp4" },
      { title: "Healing & Peace", file: "videos/healing.mp4" },
      { title: "Joy in Hard Times", file: "videos/joy.mp4" },
      { title: "Reconciliation Power", file: "videos/reconcile.mp4" },
      { title: "Spiritual Covering", file: "videos/covering.mp4" },
    ];

    let filteredVideos = [...videos];
    let currentPage = 1;
    const itemsPerPage = 6;

    // ===== MOBILE (CSS SCROLL-SNAP) =====
    function loadMobileVideos() {
      const container = document.getElementById("mobileScroll");
      container.innerHTML = "";
      filteredVideos.forEach((vid) => {
        const slide = document.createElement("div");
        slide.className = "snap-slide";
        slide.innerHTML = `
          <h2 class="text-xl font-semibold mb-4 text-center">${vid.title}</h2>
          <video controls class="w-full h-[70vh] object-contain rounded-lg shadow">
            <source src="${vid.file}" type="video/mp4">
          </video>
        `;
        container.appendChild(slide);
      });
    }

    // ===== DESKTOP =====
    function loadDesktopVideos() {
      const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
      currentPage = Math.min(currentPage, totalPages); // prevent overflow

      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const currentItems = filteredVideos.slice(start, end);

      const mainVideo = document.getElementById("mainVideo");
      const thumbnails = document.getElementById("thumbnails");
      const pageNumbers = document.getElementById("pageNumbers");

      thumbnails.innerHTML = "";
      pageNumbers.innerHTML = "";

      if (currentItems.length > 0) {
        mainVideo.src = currentItems[0].file;
      }

      currentItems.forEach((vid) => {
        const div = document.createElement("div");
        div.className = "cursor-pointer bg-white shadow rounded overflow-hidden";
        div.innerHTML = `
          <video class="w-full h-32 object-cover">
            <source src="${vid.file}" type="video/mp4">
          </video>
          <p class="text-sm p-2">${vid.title}</p>
        `;
        div.onclick = () => {
          mainVideo.src = vid.file;
          mainVideo.play();
        };
        thumbnails.appendChild(div);
      });

      // pagination numbers
      const range = [];
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) range.push(i);
      } else {
        if (currentPage <= 4) {
          range.push(1, 2, 3, 4, 5, "...", totalPages);
        } else if (currentPage >= totalPages - 3) {
          range.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
          range.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
        }
      }

      range.forEach((page) => {
        const btn = document.createElement("button");
        btn.textContent = page;
        btn.className = "px-2 py-1 rounded";
        if (page === "...") {
          btn.disabled = true;
          btn.classList.add("text-gray-400");
        } else {
          if (page === currentPage) {
            btn.classList.add("bg-blue-600", "text-white");
          } else {
            btn.classList.add("bg-gray-200", "hover:bg-gray-300");
            btn.onclick = () => {
              currentPage = page;
              loadDesktopVideos();
            };
          }
        }
        pageNumbers.appendChild(btn);
      });

      // update next/prev
      document.getElementById("prevPage").disabled = currentPage === 1;
      document.getElementById("nextPage").disabled = currentPage === totalPages;
    }

    // ===== SEARCH FILTER =====
    function handleSearch() {
      const query = document.getElementById("searchInput").value.toLowerCase();
      filteredVideos = videos.filter(v => v.title.toLowerCase().includes(query));
      currentPage = 1;
      loadMobileVideos();
      loadDesktopVideos();
    }

    // ===== EVENTS =====
    document.getElementById("prevPage").addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        loadDesktopVideos();
      }
    });

    document.getElementById("nextPage").addEventListener("click", () => {
      const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        loadDesktopVideos();
      }
    });



    var data = {
        SiteName: "TOPEL' 25",
        MenuItems: [
                { name: 'Home', link:"/index.html",active:""},
                { name: 'About', link:"/about.html",active:""},
                { name: 'details', link:"/details.html",active:""},
                { name: 'gallery', link:"/gallery.html",active:""},
                { name: 'Prayers For The Couple', link:"/prayers.html",active:""},
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

            loadMobileVideos();
      loadDesktopVideos();
             
        // }, 1000);
    
    
    $(".hamburger").click(function () {
        $(".menu").toggleClass("active")
    })
    
})
