let increment = 1;
let clicks = 0;
let autoClicksPerSecond = 0;

        // 1. Get references to the button and the display elements
        const clickButton = document.getElementById("click-button");
        const displayElement = document.getElementById("display");
        const clickPowerElement = document.getElementById("click-power");
        const perSecondElement = document.getElementById("per-second");

        // Load game data from localStorage
        function loadGame() {
            const savedData = localStorage.getItem("tacoGameData");
            if (savedData) {
                const data = JSON.parse(savedData);
                clicks = data.clicks || 0;
                increment = data.increment || 1;
                autoClicksPerSecond = data.autoClicksPerSecond || 0;
                
                // Update UI with loaded data
                displayElement.textContent = clicks;
                updateClickPowerDisplay();
                perSecondElement.textContent = autoClicksPerSecond;
                
                // Update upgrade button states
                const upgradeButtons = document.querySelectorAll(".upgrade-button");
                upgradeButtons.forEach(button => {
                    const upgradeType = button.getAttribute("data-upgrade");
                    if (data.purchasedUpgrades && data.purchasedUpgrades.includes(upgradeType)) {
                        button.textContent = "Purchased";
                        button.disabled = true;
                        button.style.opacity = "0.5";
                    }
                });
                
                console.log("Game loaded! Tacos: " + clicks);
            }
        }

        // Save game data to localStorage
        function saveGame() {
            const purchasedUpgrades = [];
            document.querySelectorAll(".upgrade-button").forEach(button => {
                if (button.disabled) {
                    purchasedUpgrades.push(button.getAttribute("data-upgrade"));
                }
            });

            const gameData = {
                clicks: clicks,
                increment: increment,
                autoClicksPerSecond: autoClicksPerSecond,
                purchasedUpgrades: purchasedUpgrades
            };

            localStorage.setItem("tacoGameData", JSON.stringify(gameData));
            console.log("Game saved!");
        }

        // Load game on page load
        loadGame();
        clickButton.onclick = function() {
            
            clicks += increment;
            
            displayElement.textContent = clicks;
            
            saveGame();
        };

        // Update click power display
        function updateClickPowerDisplay() {
            clickPowerElement.textContent = increment;
        }

        // Upgrade functionality
        const upgradeButtons = document.querySelectorAll(".upgrade-button");
        
        const upgradeCosts = {
            "double": 100,
            "golden": 500,
            "factory": 1000
        };

        upgradeButtons.forEach(button => {
            button.addEventListener("click", function() {
                const upgradeType = this.getAttribute("data-upgrade");
                const cost = upgradeCosts[upgradeType];

                if (clicks >= cost) {
                    clicks -= cost;
                    displayElement.textContent = clicks;

                    // Apply upgrade effects
                    if (upgradeType === "double") {
                        increment = 2;
                        updateClickPowerDisplay();
                        this.textContent = "Purchased";
                        this.disabled = true;
                        this.style.opacity = "0.5";
                    } else if (upgradeType === "golden") {
                        increment = 5;
                        updateClickPowerDisplay();
                        this.textContent = "Purchased";
                        this.disabled = true;
                        this.style.opacity = "0.5";
                    } else if (upgradeType === "factory") {
                        // Auto-earn 1 taco per second
                        autoClicksPerSecond += 1;
                        perSecondElement.textContent = autoClicksPerSecond;
                        this.textContent = "Purchased";
                        this.disabled = true;
                        this.style.opacity = "0.5";
                    }
                    // Save game after purchase
                    saveGame();
                } else {
                    alert("Not enough tacos! You need " + cost + " tacos.");
                }
            });
        });

        // Auto-increment tacos every second based on passive income
        setInterval(() => {
            if (autoClicksPerSecond > 0) {
                clicks += autoClicksPerSecond;
                displayElement.textContent = clicks;
                saveGame();
            }
        }, 1000);

        // updateUI function - can be called from console
        function updateUI() {
            displayElement.textContent = clicks;
            updateClickPowerDisplay();
            perSecondElement.textContent = autoClicksPerSecond;
            console.log("UI Updated! Current tacos: " + clicks + ", Click Power: " + increment + ", Per Second: " + autoClicksPerSecond);
        }
        
        // Make it accessible globally for console use
        window.updateUI = updateUI;

