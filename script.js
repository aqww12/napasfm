document.addEventListener('DOMContentLoaded', () => {
    const mainPlayPauseBtn = document.querySelector('.main-player-controls .play-pause-btn');
    const mainPlayIcon = mainPlayPauseBtn.querySelector('i');
    const audioPlayer = new Audio(); // Основной плеер для случайного трека
    const trackNameElement = document.getElementById('track-name');
    const artistNameElement = document.getElementById('artist-name');
    const realtimeTrackElement = document.getElementById('realtime-track');

    // --- Список аудиофайлов и их метаданные ---
    // ВНИМАНИЕ: Вам нужно будет вручную заполнить эти данные
    // или использовать более продвинутый метод (например, JSON файл),
    // если у вас много треков.
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
        // Добавьте сюда другие ваши треки в формате { src: 'путь/к/файлу.mp3', title: 'Название', artist: 'Исполнитель' }
    ];

    // --- Функция для установки случайного трека ---
    function setRandomTrack() {
        if (musicFiles.length === 0) {
            realtimeTrackElement.innerHTML = '<p style="color: red;">Список треков пуст!</p>';
            return;
        }

        // Выбираем случайный индекс из массива
        const randomIndex = Math.floor(Math.random() * musicFiles.length);
        const selectedTrack = musicFiles[randomIndex];

        audioPlayer.src = selectedTrack.src;
        trackNameElement.textContent = selectedTrack.title;
        artistNameElement.textContent = selectedTrack.artist;
        realtimeTrackElement.innerHTML = `<p>Сейчас играет: <strong>${selectedTrack.title}</strong> - ${selectedTrack.artist}</p>`;
    }

    // --- События для основного плеера ---
    mainPlayPauseBtn.addEventListener('click', () => {
        if (audioPlayer.paused) {
            // Устанавливаем случайный трек, если плеер еще не был настроен
            if (!audioPlayer.src || audioPlayer.ended) {
                setRandomTrack();
            }

            audioPlayer.play()
                .then(() => {
                    mainPlayIcon.classList.remove('fa-play');
                    mainPlayIcon.classList.add('fa-pause');
                })
                .catch(error => {
                    console.error("Ошибка воспроизведения:", error);
                    realtimeTrackElement.innerHTML = '<p style="color: red;">Не удалось начать воспроизведение. Проверьте файл трека.</p>';
                });
        } else {
            audioPlayer.pause();
            mainPlayIcon.classList.remove('fa-pause');
            mainPlayIcon.classList.add('fa-play');
        }
    });

    // --- Переход к следующему треку при окончании текущего ---
    audioPlayer.addEventListener('ended', () => {
        mainPlayIcon.classList.remove('fa-pause');
        mainPlayIcon.classList.add('fa-play');
        setRandomTrack(); // Автоматически ставим следующий случайный трек
        // Если плеер был в режиме воспроизведения, начинаем играть новый трек
        if (!audioPlayer.paused) {
             audioPlayer.play().catch(error => {
                 console.error("Ошибка при авто-воспроизведении следующего трека:", error);
             });
        }
    });

    // --- Управление громкостью основного плеера ---
    const mainVolumeSlider = document.querySelector('.main-player-controls .volume-control input[type="range"]');
    mainVolumeSlider.addEventListener('input', (e) => {
        audioPlayer.volume = e.target.value / 100;
    });
    audioPlayer.volume = mainVolumeSlider.value / 100; // Устанавливаем начальную громкость

    // --- Обработка плееров для Главных Хитов ---
    const hitPlayers = document.querySelectorAll('.hit-item audio');

    hitPlayers.forEach(player => {
        player.addEventListener('play', () => {
            // Когда начинает играть один из плееров хитов, останавливаем главный плеер (случайный трек)
            if (!audioPlayer.paused) {
                audioPlayer.pause();
                mainPlayIcon.classList.remove('fa-pause');
                mainPlayIcon.classList.add('fa-play');
            }

            // Останавливаем другие плееры хитов, чтобы играл только один
            hitPlayers.forEach(otherPlayer => {
                if (otherPlayer !== player && !otherPlayer.paused) {
                    otherPlayer.pause();
                }
            });
        });
    });

    // При загрузке страницы, устанавливаем первый случайный трек, но не запускаем его
    setRandomTrack();
});
