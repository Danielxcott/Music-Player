let wrapper = document.querySelector(".wrapper");
let musicImg = wrapper.querySelector(".img-area img");
let musicName = wrapper.querySelector(".song-details .song-title");
let musicArtist = wrapper.querySelector(".song-details .song-artist");
let musicAudio = wrapper.querySelector("#main-audio");
let playPauseBtn = wrapper.querySelector(".play-pause");
let prevBtn = wrapper.querySelector("#prev");
let nextBtn = wrapper.querySelector("#next");
let progressBar = wrapper.querySelector(".progress-bar");
let progressArea = wrapper.querySelector(".progress-area");
let repeatBtn = wrapper.querySelector("#repeat-music");
let showMoreBtn = wrapper.querySelector("#more-music");
let hideMusicBtn = wrapper.querySelector("#close");
let musicList = wrapper.querySelector(".music-list");
let ulTag = wrapper.querySelector("ul")


let musicIndex = Math.floor((Math.random()*songs.length)+1);

window.addEventListener("load",()=>{
    loadMusic(musicIndex);
    playingNow();
})

//load music function
function loadMusic(indexNum){
    musicName.innerText = songs[indexNum - 1].name
    musicArtist.innerText = songs[indexNum - 1 ].artist
    musicImg.src = `${songs[indexNum - 1 ].cover}`
    musicAudio.src = `${songs[indexNum - 1 ].path}`
}
//play music function
function playMusic(){
    wrapper.classList.add("paused")
   playPauseBtn.querySelector("i").innerText = "pause"
    musicAudio.play();
}
//pause music function
function pausedMusic(){
    wrapper.classList.remove("paused")
    playPauseBtn.querySelector("i").innerText = "play_arrow"
    musicAudio.pause();
}
//next music function
function nextMusic(){
    musicIndex++;
//if musicIndex is greater than songs data length it will takes to you back musicIndex 1. If it is not, then it will be moved forward.
    musicIndex > songs.length ? musicIndex=1 : musicIndex = musicIndex
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
//prev music function
function prevMusic(){
    musicIndex--;
//If musicIndex is less than 1 then the last song will be played. If it's not, it will be decrement of musicIndex 
    musicIndex < 1 ? musicIndex = songs.length : musicIndex = musicIndex
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
//music play and pause button
//in the beginning of html index there is no paused in wrapper classlist 
playPauseBtn.addEventListener("click",()=>{
let isMusicPause = wrapper.classList.contains("paused"); 
//currently paused is 'false' ,so it runs playMusic function instead of running pausedMusic function and add paused class in wrapper class/ and sec click it will run pauseMusic function and remove paused class and then pause the song 
    isMusicPause? pausedMusic() : playMusic();
})

nextBtn.addEventListener("click",()=>{
    nextMusic();
})

prevBtn.addEventListener("click",()=>{
    prevMusic();
})

//update to pregressbar according to music current time
musicAudio.addEventListener("timeupdate",(e)=>{
    // console.log(e)
    let currentTime = e.target.currentTime;
    let durationTime = e.target.duration;
    let musicCurrent = wrapper.querySelector(".current")
    let musicDuration = wrapper.querySelector(".max")

    let progreWidth = (currentTime / durationTime)*100
    progressBar.style.width=`${progreWidth}%`

    musicAudio.addEventListener("loadeddata",()=>{
//total duration
    let audioDuration =  musicAudio.duration;
    let totalMin = Math.floor(audioDuration/60);
    let totalSec = Math.floor(audioDuration % 60);
    if(totalSec<10){
        totalSec =`0${totalSec}`
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
    })
//current time
    let audioCurrentTime =  musicAudio.currentTime;
    let currentMin = Math.floor(audioCurrentTime/60);
    let currentSec = Math.floor(audioCurrentTime % 60);
    if(currentSec<10){
        currentSec =`0${currentSec}`
    }
    musicCurrent.innerText = `${currentMin}:${currentSec}`
})

//play the song current Time according to progress bar width;
progressArea.addEventListener("click",(e)=>{
    let progressWidthVal = progressArea.clientWidth;
    // console.log(progressWidthVal)
    let clickOffSetX = e.offsetX;
    // console.log(clickOffSetX);
    let songDuration = musicAudio.duration;
    musicAudio.currentTime =(clickOffSetX/progressWidthVal) * songDuration;
    playMusic();
})

//repeat shuffle song 
repeatBtn.addEventListener("click",()=>{
    let getIcon = repeatBtn.innerText;
    switch(getIcon){
        case "repeat": //if repeatBtn of innerText is repeat it will change into repeat_one
            repeatBtn.innerText = "repeat_one"
            repeatBtn.setAttribute("title","Song looped")
            break;
        case "repeat_one": // repeat_one then it will change into shuffle;
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title","Playback shuffle")
            break;
        case "shuffle": // shuffle then it will change into repeat;
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title","Playlist looped")
            break;
    }
})

musicAudio.addEventListener("ended",()=>{
//according to the icon means if user has set icon to loop song then the song will repeat
    let getIcon = repeatBtn.innerText;
    switch(getIcon){
        case "repeat": 
            nextMusic();
            break;
        case "repeat_one":
            musicAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randomIndex = Math.floor((Math.random()*songs.length)+1)
            console.log(randomIndex);
            do{
            let randomIndex = Math.floor((Math.random()*songs.length)+1)
            }while(musicIndex == randomIndex);             
//this loop will be run until the next random number won't be the same of current index number
            musicIndex = randomIndex;
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
    }
})

showMoreBtn.addEventListener("click",()=>{
    musicList.classList.toggle("show")
})
hideMusicBtn.addEventListener("click",()=>{
    showMoreBtn.click();
})

//create music lists
for(let i=0 ;i<songs.length;i++){
    let liTag = `<li li-index="${i+1}">
    <div class="row">
        <span>${songs[i].name}</span>
        <span>${songs[i].artist}</span>
    </div>
    <audio src="${songs[i].path}" class="${songs[i].id+i}"></audio>
    <span id="${songs[i].id+i}" class="audio-duration"></span>
</li>`
ulTag.insertAdjacentHTML("beforeend",liTag)

let liAudioDuration = ulTag.querySelector(`#${songs[i].id+i}`);
let liAudioTag = ulTag.querySelector(`.${songs[i].id+i}`)

liAudioTag.addEventListener("loadeddata",()=>{
    let audioDuration =  liAudioTag.duration;
    let totalMin = Math.floor(audioDuration/60);
    let totalSec = Math.floor(audioDuration % 60);
    if(totalSec<10){
        totalSec =`0${totalSec}`
    }
    liAudioDuration.innerText = `${totalMin}:${totalSec}`;
//use this setattribute for durationText downbelow
    liAudioDuration.setAttribute("duration-text",`${totalMin}:${totalSec}`)
})
}

//play particular song on click in the lists
const allLiTag = ulTag.querySelectorAll("li");
function playingNow(){
    for (let i = 0; i < allLiTag.length; i++) {
        let playText = allLiTag[i].querySelector(".audio-duration")
        if(allLiTag[i].classList.contains("playing")){
            allLiTag[i].classList.remove("playing")
//place the setattribute data from here
        let durationText = playText.getAttribute("duration-text"); 
            playText.innerText = durationText
        }
//if there is a li tag which li-index is equal to the music index then the music is playing now
        if(allLiTag[i].getAttribute("li-index")==musicIndex){
            allLiTag[i].classList.add("playing")
            playText.innerText = "playing"
        }
//adding onclick attribute in all li lag
        allLiTag[i].setAttribute("onclick",`clicked(this)`)
    }
}

//play the song when user's click different songs in the lists
function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    console.log(getLiIndex)
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}