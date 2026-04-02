
document.addEventListener('DOMContentLoaded', () => {
    const mainPlayPauseBtn = document.querySelector('.main-player-controls .play-pause-btn');
    const mainPlayIcon = mainPlayPauseBtn.querySelector('i');
    const prevBtn = document.querySelector('.main-player-controls .prev-btn');
    const nextBtn = document.querySelector('.main-player-controls .next-btn');
    const volumeRange = document.querySelector('.main-player-controls input[type="range"]');

    const audioPlayer = new Audio();
    const trackNameElement = document.getElementById('track-name');
    const artistNameElement = document.getElementById('artist-name');
    const realtimeTrackElement = document.getElementById('realtime-track');

    const musicFiles = [
        { src: 'music/ганджубас.mp3', title: 'Ганджубас', artist: 'НАПАС ФМ ОРИДЖИНАЛ' },
        { src: 'music/Утро без хапки.mp3', title: 'Утро без хапки', artist: 'НАПАС ФМ ОРИДЖИНАЛ' },
        { src: 'music/барыга.mp3', title: 'Барыга', artist: 'НАПАС ФМ ОРИДЖИНАЛ' },
        { src: 'music/Мусарской шоп.mp3', title: 'Мусарской шоп', artist: 'НАПАС ФМ ОРИДЖИНАЛ' },
        { src: 'music/Асаф колпак.mp3', title: 'Асаф колпак', artist: 'НАПАС ФМ ОРИДЖИНАЛ' },
        { src: 'music/Напасик.mp3', title: 'Напасик', artist: 'НАПАС ФМ ОРИДЖИНАЛ' },
        { src: 'music/kz baby.mp3', title: 'KZ BABY', artist: 'НАПАС ФМ ОРИДЖИНАЛ' },
        { src: 'music/ам ам.mp3', title: 'АМ АМ', artist: 'НАПАС ФМ ОРИДЖИНАЛ' },
        { src: 'music/да да нет нет.mp3', title: 'ДА ДА НЕТ НЕТ', artist: 'НАПАС ФМ ОРИДЖИНАЛ' },
        { src: 'music/murino never sleeps.mp3', title: 'MURINO NEVER SLEEPS', artist: 'НАПАС ФМ ОРИДЖИНАЛ' },
        { src: 'music/Это было на гидре.mp3', title: 'ЭТО БЫЛО НА ГИДРЕ', artist: 'НАПАС ФМ ОРИДЖИНАЛ' },
    ];

    let currentIndex = -1;

    function clampIndex(i) {
        const n = musicFiles.length;
        if (n === 0) return -1;
        return ((i % n) + n) % n;
    }

    function updateUI(isPlaying) {
        if (isPlaying) {
            mainPlayIcon.classList.remove('fa-play');
            mainPlayIcon.classList.add('fa-pause');
        } else {
            mainPlayIcon.classList.remove('fa-pause');
            mainPlayIcon.classList.add('fa-play');
        }
    }

    function renderTrackInfo(track) {
        if (!track) {
            trackNameElement.textContent = '';
            artistNameElement.textContent = '';
            realtimeTrackElement.innerHTML = '<p>Нажмите "Play" для начала прослушивания.</p>';
            return;
        }
        trackNameElement.textContent = track.title;
        artistNameElement.textContent = track.artist;
        realtimeTrackElement.innerHTML = `<p>Сейчас играет: <strong>${track.title}</strong> - ${track.artist}</p>`;
    }

    function setTrackByIndex(index) {
        if (musicFiles.length === 0) {
            realtimeTrackElement.innerHTML = '<p style="color: red;">Список треков пуст!</p>';
            currentIndex = -1;
            audioPlayer.src = '';
            renderTrackInfo(null);
            return;
        }

        const idx = clampIndex(index);
        const selected = musicFiles[idx];
        currentIndex = idx;
        audioPlayer.src = selected.src;
        renderTrackInfo(selected);
    }

    // Выбирает случайный трек; если треков > 1, старается не выбирать текущий
    function setRandomTrack() {
        const n = musicFiles.length;
        if (n === 0) return;
        if (n === 1) {
            setTrackByIndex(0);
            return;
        }
        let r;
        do {
            r = Math.floor(Math.random() * n);
        } while (r === currentIndex);
        setTrackByIndex(r);
    }

    mainPlayPauseBtn.addEventListener('click', () => {
        if (audioPlayer.paused) {
            if (!audioPlayer.src) {
                // Если хотите, чтобы при первом нажатии Play выбирался случайный трек,
                // замените setTrackByIndex(0) на setRandomTrack()
                setTrackByIndex(0);
            }
            audioPlayer.play()
                .then(() => updateUI(true))
                .catch(err => {
                    console.error('Ошибка воспроизведения:', err);
                    realtimeTrackElement.innerHTML = '<p style="color: red;">Ошибка воспроизведения файла.</p>';
                    updateUI(false);
                });
        } else {
            audioPlayer.pause();
            updateUI(false);
        }
    });

    prevBtn && prevBtn.addEventListener('click', () => {
        if (musicFiles.length === 0) return;
        if (currentIndex === -1) {
            setTrackByIndex(musicFiles.length - 1);
        } else {
            setTrackByIndex(currentIndex - 1);
        }
        audioPlayer.play().then(() => updateUI(true)).catch(err => {
            console.error('Ошибка воспроизведения:', err);
            updateUI(false);
        });
    });

    // next теперь случайный
    nextBtn && nextBtn.addEventListener('click', () => {
        if (musicFiles.length === 0) return;
        setRandomTrack();
        audioPlayer.play().then(() => updateUI(true)).catch(err => {
            console.error('Ошибка воспроизведения:', err);
            updateUI(false);
        });
    });

    // По окончанию трека — выбрать случайный следующий
    audioPlayer.addEventListener('ended', () => {
        if (musicFiles.length === 0) return;
        setRandomTrack();
        audioPlayer.play().then(() => updateUI(true)).catch(err => {
            console.error('Ошибка при автопереходе:', err);
            updateUI(false);
        });
    });

    audioPlayer.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        realtimeTrackElement.innerHTML = '<p style="color: red;">Ошибка загрузки/воспроизведения трека.</p>';
        updateUI(false);
    });

    if (volumeRange) {
        audioPlayer.volume = (volumeRange.value || 80) / 100;
        volumeRange.addEventListener('input', (e) => {
            const v = Number(e.target.value);
            audioPlayer.volume = Math.max(0, Math.min(1, v / 100));
        });
    }

    renderTrackInfo(null);
});
