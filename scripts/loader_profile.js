function simulateAppLoading(speed) {
    const center = document.querySelector('.center');
    const loader = document.querySelector(".loader_outer");
    const loader2 = document.querySelector(".loader_container");
    const loader3 = document.querySelector(".loader_inner_color");
    const loader4 = document.querySelector(".loader_container_2");
    const loader_maintenance = document.getElementById("loading_message_maintenance");

    const simulatePageLoad = () => {
        let progress = 0;
        const interval = 10; // Adjust the interval as needed (milliseconds)
        const totalDuration = interval * 100; // Total loading time based on 100% progress

        const updateProgress = () => {
            if (progress <= 100) {
                loader3.style.width = `${progress}%`;
                progress += (interval / totalDuration) * speed;
                setTimeout(updateProgress, interval);
            }

            if (progress === 100) {
                // Hide the loaders and show app when loading is complete
                center.style.display = "block";
                loader4.style.opacity = "0";
                loader2.style.transform = "translateY(40px)";
                setTimeout(() => {
                    loader2.style.transform = "translateY(40px)";
                }, 100);
                setTimeout(() => {
                    loader2.style.transform = "translateY(35px) scale(1.2)";
                }, 400);
                setTimeout(() => {
                    loader2.style.transform = "translateY(40px) scale(1)";
                }, 800);
                setTimeout(() => {
                    loader.style.opacity = "0";
                }, 900);
                setTimeout(() => {
                    loader.style.display = "none";
                }, 1000);
            }
        };

        updateProgress();
    };

    var duration = 4 * 1000;
    var animationEnd = Date.now() + duration;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-based

    // Define the date ranges for each season (you can adjust these)
    const January = 1;
    const February = 2;
    const March = 3;
    const April = 4;
    const May = 5;
    const June = 6;
    const July = 7;
    const August = 8;
    const September = 9;
    const October = 10;
    const November = 11;
    const December = 12;

    if (currentMonth == October) {
        colors = "'#e47125'"
    } if (currentMonth == February) {
        colors = "'#e4b336'"
    } else {
        colors = "''"
    }

    var defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 120,
        zIndex: 9997,
        colors: [colors], // Add the desired colors here
    };

    function triggerConfettiLoad(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: triggerConfettiLoad(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: triggerConfettiLoad(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // Start the loading simulation when the DOM is fully loaded
    simulatePageLoad();
    //loader_maintenance.style.display = "block";
}