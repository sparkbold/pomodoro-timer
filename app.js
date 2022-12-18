/**
* Pomodoro Timer
* Solution by sparkbold
*
*/
document.addEventListener("DOMContentLoaded", function (event) {
    const start = document.querySelector('.start');
    const minutesInput = document.querySelector('.minutes input');
    const secondsInput = document.querySelector('.seconds input');
    const reset = document.querySelector('.reset');
    const settings = document.querySelector('.settings');
    const ring = document.querySelector('.ring');
    const modal = document.getElementById("myModal");
    const bell = new Audio(
        'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3'
    );
    const ticking = new Audio(
        'https://www.soundjay.com/clock/sounds/clock-ticking-2.mp3'
    );
    ticking.addEventListener('timeupdate', function () {
        var buffer = .50
        if (this.currentTime > this.duration - buffer) {
            this.currentTime = 0
            this.play()
        }
    });
    let interval;

    const startTimer = () => {
        editTimer();
        start.addEventListener("click", (e) => {
            e.preventDefault();
            toggleBtnText(e);
            resetTimer();
            timer();
        });
    }

    const endTimer = () => {
        let loopAudio = true;
        stop(ticking);
        console.log('end');
        clearInterval(interval);
        ring.classList.add('ending');
        bell.addEventListener('ended', () => {
            if (loopAudio) {
                bell.play();
            }
        });
        bell.play();
        loadModal();
        return;
    }

    const loadModal = () => {
        const close = document.getElementsByClassName("close")[0];
        modal.style.display = "block";
        close.onclick = () => {
            modal.style.display = "none";
            stop(bell);
        }
        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
                stop(bell);
            }
        }
    }

    const editTimer = () => {
        clearInterval(interval);
        settings.removeAttribute('disabled');
        settings.addEventListener('click', () => {
            console.log('edit');
            secondsInput.removeAttribute('disabled');
            minutesInput.removeAttribute('disabled');
        });

        settings.onclick = () => {
            if (secondsInput.value > 59) secondsInput.value = 59;
            if (isNaN(secondsInput.value)) secondsInput.value = '00';
            if (isNaN(minutesInput.value)) minutesInput.value = '00';
            saveTimer();
        }
    }

    const resetTimer = () => {
        reset.addEventListener('click', () => {
            getTimer();
        });

        stop(ticking);
        stop(bell);
        clearInterval(interval);

        secondsInput.value = secondsInput.value || '00';
        minutesInput.value = minutesInput.value || '00';
        ring.classList.remove('ending');
        minutesInput.setAttribute('disabled', true);
        secondsInput.setAttribute('disabled', true);
        settings.setAttribute('disabled', true);
    }

    const saveTimer = () => {
        if (secondsInput.value.toString().length < 2) secondsInput.value = '0' + secondsInput.value;
        if (minutesInput.value.toString().length < 2) minutesInput.value = '0' + minutesInput.value;
        settings.setAttribute('data-min', minutesInput.value);
        settings.setAttribute('data-sec', secondsInput.value);
    }

    const getTimer = () => {
        minutesInput.value = settings.getAttribute('data-min') || '15';
        secondsInput.value = settings.getAttribute('data-sec') || '00';
    }

    const countDown = () => {
        let minutes = parseInt(minutesInput.value);
        let seconds = parseInt(secondsInput.value);
        let totalSeconds = minutes * 60 + seconds;
        let currentSeconds = totalSeconds;

        if (currentSeconds > 0) {
            currentSeconds--;
            ticking.play();
        }

        let secondsLeft = currentSeconds % 60;
        let minutesLeft = Math.floor(currentSeconds / 60);

        secondsLeft = secondsLeft < 10 ? '0' + secondsLeft.toString() : secondsLeft;
        minutesLeft = minutesLeft < 10 ? '0' + minutesLeft.toString() : minutesLeft;

        secondsInput.value = secondsLeft || '00';
        minutesInput.value = minutesLeft || '00';
    }

    const timer = () => {
        interval = setInterval(() => {
            if (start.innerHTML == 'stop') {
                if (minutesInput.value == 0 && secondsInput.value == 0) {
                    endTimer();
                }
                settings.setAttribute('disabled', true);
                countDown();
            } else {
                editTimer();
            }
        }, 1000);
    }

    //Toggle button text
    const toggleBtnText = (e) => {
        e.target.innerHTML = e.target.innerHTML == "start" ? "stop" : "start";
    }

    //Stop sound
    const stop = (sound) => {
        sound.pause();
        sound.currentTime = 0;
    }

    startTimer();
})