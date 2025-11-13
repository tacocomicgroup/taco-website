// Game object to organize all game functions
const game = {
    // Game state
    increment: 1,
    clicks: 0,
    autoClicksPerSecond: 0,
    maxClicks: 999999999999999999999999999999999, // Decillion+ (10^33)
    
    // Number formatting names
    numberNames: [
        { value: 1e33, name: "Decillion" },
        { value: 1e30, name: "Nonillion" },
        { value: 1e27, name: "Octillion" },
        { value: 1e24, name: "Septillion" },
        { value: 1e21, name: "Sextillion" },
        { value: 1e18, name: "Quintillion" },
        { value: 1e15, name: "Quadrillion" },
        { value: 1e12, name: "Trillion" },
        { value: 1e9, name: "Billion" },
        { value: 1e6, name: "Million" },
        { value: 1e3, name: "Thousand" }
    ],
    
    // DOM elements
    clickButton: document.getElementById("click-button"),
    displayElement: document.getElementById("display"),
    clickPowerElement: document.getElementById("click-power"),
    perSecondElement: document.getElementById("per-second"),
    
    // Upgrade costs
    upgradeCosts: {
        "double": 100,
        "golden": 500,
        "factory": 1000
    },
    
    // Format large numbers for display
    formatNumber(num) {
        // For small numbers, just show them normally
        if (num < 1000) {
            return Math.floor(num).toString();
        }
        
        // For large numbers, find the appropriate scale
        for (let i = 0; i < this.numberNames.length; i++) {
            const scale = this.numberNames[i];
            if (num >= scale.value) {
                const formatted = (num / scale.value).toFixed(2);
                return formatted + " " + scale.name;
            }
        }
        
        // Fallback to scientific notation for extremely large numbers
        return num.toExponential(2);
    },
    
    // Load game data from localStorage
    loadGame() {
        const savedData = localStorage.getItem("tacoGameData");
        if (savedData) {
            const data = JSON.parse(savedData);
            this.clicks = data.clicks || 0;
            this.increment = data.increment || 1;
            this.autoClicksPerSecond = data.autoClicksPerSecond || 0;
            
            // Update UI with loaded data
            this.displayElement.textContent = this.formatNumber(this.clicks);
            this.updateClickPowerDisplay();
            this.perSecondElement.textContent = this.formatNumber(this.autoClicksPerSecond);
            
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
            
            console.log("Game loaded! Tacos: " + this.clicks);
        }
    },
    
    // Save game data to localStorage
    saveGame() {
        const purchasedUpgrades = [];
        document.querySelectorAll(".upgrade-button").forEach(button => {
            if (button.disabled) {
                purchasedUpgrades.push(button.getAttribute("data-upgrade"));
            }
        });

        const gameData = {
            clicks: this.clicks,
            increment: this.increment,
            autoClicksPerSecond: this.autoClicksPerSecond,
            purchasedUpgrades: purchasedUpgrades
        };

        localStorage.setItem("tacoGameData", JSON.stringify(gameData));
        console.log("Game saved!");
    },
    
    // Handle click button
    handleClick() {
        // Don't allow clicks if at max
        if (this.clicks >= this.maxClicks) {
            console.log("Max taco limit reached!");
            return;
        }
        
        this.clicks += this.increment;
        
        // Cap clicks at maximum
        if (this.clicks > this.maxClicks) {
            this.clicks = this.maxClicks;
        }
        
        this.displayElement.textContent = this.formatNumber(this.clicks);
        this.saveGame();
    },
    
    // Update click power display
    updateClickPowerDisplay() {
        this.clickPowerElement.textContent = this.formatNumber(this.increment);
    },
    
    // Handle upgrade purchase
    purchaseUpgrade(upgradeType) {
        const cost = this.upgradeCosts[upgradeType];
        
        if (this.clicks >= cost) {
            this.clicks -= cost;
            this.displayElement.textContent = this.formatNumber(this.clicks);
            
            // Apply upgrade effects
            switch(upgradeType) {
                case "double":
                    this.increment = 2;
                    break;
                case "golden":
                    this.increment = 5;
                    break;
                case "factory":
                    this.autoClicksPerSecond += 1;
                    this.perSecondElement.textContent = this.formatNumber(this.autoClicksPerSecond);
                    break;
            }
            
            this.updateClickPowerDisplay();
            this.saveGame();
            return true;
        } else {
            alert("Not enough tacos! You need " + cost + " tacos.");
            return false;
        }
    },
    
    // Add passive income
    addPassiveIncome() {
        if (this.autoClicksPerSecond > 0) {
            // Don't add passive income if at max
            if (this.clicks >= this.maxClicks) {
                return;
            }
            
            this.clicks += this.autoClicksPerSecond;
            
            // Cap clicks at maximum
            if (this.clicks > this.maxClicks) {
                this.clicks = this.maxClicks;
            }
            
            this.displayElement.textContent = this.formatNumber(this.clicks);
            this.saveGame();
        }
    },
    
    // Update UI display
    updateUI() {
        this.displayElement.textContent = this.formatNumber(this.clicks);
        this.clickPowerElement.textContent = this.formatNumber(this.increment);
        this.perSecondElement.textContent = this.formatNumber(this.autoClicksPerSecond);
        console.log("UI Updated! Current tacos: " + this.clicks + ", Click Power: " + this.increment + ", Per Second: " + this.autoClicksPerSecond);
    },
    
    // Initialize game
    init() {
        this.loadGame();
        
        // Setup click button
        this.clickButton.onclick = () => this.handleClick();
        
        // Setup upgrade buttons
        const upgradeButtons = document.querySelectorAll(".upgrade-button");
        upgradeButtons.forEach(button => {
            button.addEventListener("click", () => {
                const upgradeType = button.getAttribute("data-upgrade");
                if (this.purchaseUpgrade(upgradeType)) {
                    button.textContent = "Purchased";
                    button.disabled = true;
                    button.style.opacity = "0.5";
                }
            });
        });
        
        // Setup passive income timer
        setInterval(() => this.addPassiveIncome(), 1000);
    }
};

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    game.init();
    // Make game accessible globally for console use
    window.game = game;
});

        