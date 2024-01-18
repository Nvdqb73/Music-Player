const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Lưu các nút khi click vào random or repeat
const PLAYER_STORAGE_KEY = "NVD_PLAYER";

const playlist = $(".playlist");
const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
// console.log(prevBtn);

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Afterglow",
      singer: "Taylor Swift",
      path: "./assets/music/Afterglow.mp3",
      image: "./assets/images/2.jpg",
    },
    {
      name: "All You Had To Do Was Stay",
      singer: "Taylor Swift",
      path: "./assets/music/All_You_Had_To_Do_Was_Stay.mp3",
      image: "./assets/images/10.jpg",
    },
    {
      name: "Cornelia Street",
      singer: "Taylor Swift",
      path: "./assets/music/Cornelia_Street.mp3",
      image: "./assets/images/3.jpg",
    },
    {
      name: "Cruel Summer",
      singer: "Taylor Swift",
      path: "./assets/music/cruel_summer.mp3",
      image: "./assets/images/4.jpg",
    },
    {
      name: "Daylight",
      singer: "Young",
      path: "./assets/music/Daylight.mp3",
      image: "./assets/images/5.jpg",
    },
    {
      name: "Death By A Thousand Cuts",
      singer: "Taylor Swift",
      path: "./assets/music/Death_By_A_Thousand_Cuts.mp3",
      image: "./assets/images/6.jpg",
    },
    {
      name: "Enchanted",
      singer: "Taylor Swift",
      path: "./assets/music/Enchanted.mp3",
      image: "./assets/images/7.jpg",
    },
    {
      name: "False God",
      singer: "Taylor Swift",
      path: "./assets/music/False_God.mp3",
      image: "./assets/images/8.jpg",
    },
    {
      name: "I Forgot That You Existed",
      singer: "Taylor Swift",
      path: "./assets/music/I_Forgot_That_You_Existed.mp3",
      image: "./assets/images/9.jpg",
    },
    {
      name: "London Boy",
      singer: "Taylor Swift",
      path: "./assets/music/London_Boy.mp3",
      image: "./assets/images/2.jpg",
    },
    {
      name: "Miss Americana The Heartbreak Prince",
      singer: "Taylor Swift",
      path: "./assets/music/Miss_Americana_The_Heartbreak_Prince.mp3",
      image: "./assets/images/3.jpg",
    },
    {
      name: "Shake It Off",
      singer: "Taylor Swift",
      path: "./assets/music/Shake_It_Off.mp3",
      image: "./assets/images/4.jpg",
    },
    {
      name: "Soon You’ll Get Better",
      singer: "Taylor Swift",
      path: "./assets/music/Soon_Youll_Get_Better.mp3",
      image: "./assets/images/5.jpg",
    },
    {
      name: "The Man",
      singer: "Taylor Swift",
      path: "./assets/music/The_Man.mp3",
      image: "./assets/images/8.jpg",
    },
    {
      name: "Welcome To New York",
      singer: "Taylor Swift",
      path: "./assets/music/Welcome_To_New_York.mp3",
      image: "./assets/images/6.jpg",
    },
    {
      name: "Wonderland",
      singer: "Taylor Swift",
      path: "./assets/music/Wonderland.mp3",
      image: "./assets/images/7.jpg",
    },
    {
      name: "You Need To Calm Down",
      singer: "Taylor Swift",
      path: "./assets/music/You_Need_To_Calm_Down.mp3",
      image: "./assets/images/9.jpg",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
      <div class="song ${
        index === this.currentIndex ? "active" : ""
      }"  data-index="${index}">
            <div
                class="thumb"
                style="background-image: url('${song.image}')"
            >
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div> 
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
    </div>
        `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý CD quay / dừng
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000, // 10 seconds
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();

    // Xử lý phóng to / thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xử lý khi Click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // Khi song bị pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    //Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // Xử lý khi tua song
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    // Khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Khi random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // Xử lý lặp lại một song
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // Xử lý next song khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Lắng nghe hành vi click vào playlist
    playlist.onclick = function (e) {
      const songItem = e.target.closest(".song:not(.active)");
      const optionItem = e.target.closest(".option");
      if (songItem || optionItem) {
        // Xử lý khi click vào song
        if (songItem) {
          // console.log(songItem.getAttribute("data-index"));
          //có thể dùng cách này nhưng cách ngắn hơn do ý đồ đặt data-index
          _this.currentIndex = Number(songItem.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
        // Xử lý khi click vào option
        if (optionItem) {
        }
      }
    };
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  randomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  scrollToActiveSong: function () {
    let checkScrollSongActive = false;
    if (this.currentIndex < this.songs.length + 4) {
      checkScrollSongActive = true;
    } else {
      checkScrollSongActive = false;
    }
    setTimeout(() => {
      $(".song.active").scrollIntoView(
        checkScrollSongActive
          ? {
              behavior: "smooth",
              block: "center",
            }
          : {
              behavior: "smooth",
              block: "nearest",
            }
      );
    }, 300);
  },
  start: function () {
    // Gán cấu hình từ config vào app
    this.loadConfig();

    // Định nghĩa các thuộc tính cho Object
    this.defineProperties();

    // Lắng nghe và sử lý sự kiện DOM Events
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // Render playlist
    this.render();

    //Hiện thị trạng thái random or repeat
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();
