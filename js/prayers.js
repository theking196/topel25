    const videos = [
      { title: "Caption 1", file: "assets/prayers/001.mp4" },
      { title: "Caption 2", file: "assets/prayers/002.mp4" },
      { title: "Caption 3", file: "assets/prayers/003.mp4" },
      { title: "Caption 4", file: "assets/prayers/004.mp4" },
      { title: "Caption 5", file: "assets/prayers/005.mp4" },
    ];

    let filteredVideos = [...videos];
    let currentPage = 1;
    const itemsPerPage = 6;

    let mobileLoadedCount = 0;
    const mobileBatchSize = 3;

    // ===== MOBILE (CSS SCROLL-SNAP) =====
    function loadMobileVideos(reset = true) {
  const container = document.getElementById("mobileScroll");
  if (reset) {
    container.innerHTML = "";
    mobileLoadedCount = 0;
  }

  // Show "No prayers found" if empty
  if (filteredVideos.length === 0) {
    container.innerHTML = "<p class='text-center text-gray-500 mt-10'>No prayers found.</p>";
    return;
  }

  // Load next batch (or first batch if reset)
  const batch = filteredVideos.slice(mobileLoadedCount, mobileLoadedCount + mobileBatchSize);
  batch.forEach((vid) => {
    const slide = document.createElement("div");
    slide.className = "snap-slide";
    slide.innerHTML = `
      <h2 class="text-xl font-semibold mb-4 text-center">${vid.title}</h2>
      <div class="prayer-loader"><div class="prayer-spinner"></div></div>
      <video controls class="w-full h-[70vh] object-contain rounded-lg shadow" style="display:none;">
        <source src="${vid.file}" type="video/mp4">
      </video>
    `;
    const video = slide.querySelector("video");
    const loader = slide.querySelector(".prayer-loader");
    video.addEventListener("loadeddata", () => {
      loader.style.display = "none";
      video.style.display = "";
    });
    container.appendChild(slide);
  });
  mobileLoadedCount += batch.length;

  // Set up intersection observer for infinite scroll if more to load
  if (mobileLoadedCount < filteredVideos.length) {
    setUpMobileInfiniteScroll();
  }
}

let mobileObserver = null;
function setUpMobileInfiniteScroll() {
  if (mobileObserver) mobileObserver.disconnect();
  const container = document.getElementById("mobileScroll");
  const slides = container.querySelectorAll(".snap-slide");
  const lastSlide = slides[slides.length - 1];

  if (!lastSlide) return;

  mobileObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      mobileObserver.disconnect();
      loadMobileVideos(false); // Load next batch, don't reset
    }
  }, { root: container, threshold: 0.6 });

  mobileObserver.observe(lastSlide);
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
  } else {
    mainVideo.src = "";
  }

  if (filteredVideos.length === 0) {
    thumbnails.innerHTML = "<p class='text-center text-gray-500 col-span-3'>No prayers found.</p>";
    return;
  }

  currentItems.forEach((vid) => {
    const div = document.createElement("div");
    div.className = "cursor-pointer bg-white shadow rounded overflow-hidden";
    div.innerHTML = `
      <div class="prayer-loader"><div class="prayer-spinner"></div></div>
      <video class="w-full h-32 object-cover" style="display:none;">
        <source src="${vid.file}" type="video/mp4">
      </video>
      <p class="text-sm p-2">${vid.title}</p>
    `;
    const video = div.querySelector("video");
    const loader = div.querySelector(".prayer-loader");

    video.addEventListener("loadeddata", () => {
      loader.style.display = "none";
      video.style.display = "";
    });

    div.onclick = () => {
      mainVideo.src = vid.file;
      mainVideo.play();
    };
    thumbnails.appendChild(div);
  });

  // pagination numbers (unchanged)
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
      loadMobileVideos(true); // Reset batch loading!
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

            
      loadMobileVideos(true);
      loadDesktopVideos();
             
        // }, 1000);
    
    
    $(".hamburger").click(function () {
        $(".menu").toggleClass("active")
    })
    
})
