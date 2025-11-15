const button = document.getElementById("randomMover");
const display = document.getElementById("Score");
let score = 0;

// Update this array with your exact filenames
const sfxFiles = [
    "assets/sound1.mp3",
    "assets/sound2.wav",
    "assets/sound3.mp3"
    // Add every single file path here
];

// We still map them for easy access to the *source* files, not preloaded objects
const soundSources = sfxFiles; 


// Function to play a random sound using a fresh Audio object each time
function playRandomSFX() {
    if (soundSources.length === 0) return; 

    // Select a random sound *source path*
    const randomIndex = Math.floor(Math.random() * soundSources.length);
    const soundSrc = soundSources[randomIndex];

    // Create a NEW Audio instance every time the function is called
    const soundToPlay = new Audio(soundSrc);
    
    soundToPlay.play().catch(error => {
        console.error("Audio playback failed:", error);
    });
}


// The main click handler for the button
button.addEventListener("click", function() {
    // 1. Update Score and Text
    display.textContent = "Score: " + ++score;
    
    // 2. Move the button
    const maxHeight = window.innerHeight - button.clientHeight;
    const maxWidth = window.innerWidth - button.clientWidth;
    const randomTop = Math.floor(Math.random() * maxHeight);
    const randomLeft = Math.floor(Math.random() * maxWidth);
    button.style.top = randomTop + 'px';
    button.style.left = randomLeft + 'px';

    // 3. Play a random sound effect using the robust method
    playRandomSFX();
});
