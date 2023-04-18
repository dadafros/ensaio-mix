var audioFileInput = document.getElementById('audio-file');
var playersDiv = document.getElementById('players');
var audioPlayers = [];
var seekSlider = document.getElementById('seek-slider');
var currentTimeSpan = document.getElementById('current-time');
var durationSpan = document.getElementById('duration');

audioFileInput.addEventListener('change', function() {
    var files = this.files;

    // Create an audio element for each selected file
    for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var url = URL.createObjectURL(file);
    
    var player = document.createElement('audio');
    player.src = url;
    player.controls = false;
    player.volume = 0.5;
    
    var volumeContainer = document.createElement('div');
    volumeContainer.className = 'player-container';

    var volumeSlider = document.createElement('input');
    volumeSlider.className = 'volume-slider';
    volumeSlider.type = 'range';
    volumeSlider.min = 0;
    volumeSlider.max = 1;
    volumeSlider.step = 0.1;
    volumeSlider.value = 0.5;
    volumeSlider.setAttribute('data-index', i);
    volumeContainer.appendChild(volumeSlider);
    
    var volumeLabel = document.createElement('label');
    volumeLabel.className = 'player-label'
    volumeLabel.textContent = file.name.slice(0, -4);
    volumeContainer.appendChild(volumeLabel);
    
    playersDiv.appendChild(volumeContainer);

    // Add an event listener to the volume slider to update the volume of the associated audio element
    volumeSlider.addEventListener('input', function() {
        var index = parseInt(this.getAttribute('data-index'));
        audioPlayers[index].element.volume = this.value;
    });

    // Add the audio element to the audioPlayers array
    audioPlayers.push({
        element: player,
        isPlaying: false
    });

    // Set the maximum value of the seek slider based on the duration of the audio file
    player.addEventListener('loadedmetadata', function() {
        seekSlider.max = this.duration;
    });
    
    // Update duration and current time
    player.addEventListener('timeupdate', function() {
        var formattedCurrentTime = formatTime(this.currentTime);
        currentTimeSpan.textContent = formattedCurrentTime;
        seekSlider.value = this.currentTime;
        durationSpan.textContent = formatTime(this.duration);
    });
    }
});

var playAllButton = document.getElementById('play-all-button');

// Add an event listener to the play button to toggle the playback state of all audio elements
playAllButton.addEventListener('click', function() {
    audioPlayers.forEach(function(audioPlayer) {
    if (audioPlayer.isPlaying) {
        audioPlayer.element.pause();
        audioPlayer.isPlaying = false;
        playAllButton.textContent = '▶️';
    } else {
        audioPlayer.element.play();
        audioPlayer.isPlaying = true;
        playAllButton.textContent = '⏸️';
    }
    });
});

// Add an event listener to the seek slider to update the current time of all audio elements
seekSlider.addEventListener('input', function() {
    audioPlayers.forEach(function(audioPlayer) {
    audioPlayer.element.currentTime = seekSlider.value;
    });
});

function formatTime(time) {
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time % 60);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}