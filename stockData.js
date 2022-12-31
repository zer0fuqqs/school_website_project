// Script das die Aktiendaten der API bekommt //


//API KEY //
const API_KEY = "MW31DEJ7BTTNXQ2B"
const BASE_URL = "https://www.alphavantage.co/query?"

//EventListener
let searchButton = document.getElementById("searchBtn")
searchButton.addEventListener("click", GetData)
searchButton.addEventListener("click", getStockInformations)

Chart.defaults.borderColor = 'lime';
Chart.defaults.color = 'white';

// Funktion die die API anspricht
async function FetchMonthlyStockData(API_KEY, Symbol) {

    let ChartDiv = document.getElementById("ChartDiv");

    ChartDiv.innerHTML = '<div style="margin-right:610px;"> <div class="spinner-border" style="width: 3rem; height: 3rem; margin-top: 260px; ;" role="status"> <span class="visually-hidden">Loading...</span> </div </div> </div>'

    let data2022 = new Object();

    let path = BASE_URL + `function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${Symbol}&apikey=${API_KEY}`;

    let data = await fetch(path).then(res => res.json());

    // Looped über die Daten und filtert auf das Jahr 2022
    // Try..catch für Errorhandling falls ein API Call fehlschlägt
    try {
        for(const [key, value] of Object.entries(data["Monthly Adjusted Time Series"])) {

            if(key > "2021-12-31") {
                data2022[key] = value
            }
        }
    } catch(e) {
        
        ChartDiv.innerHTML = `<div class="text-white" style="text-align: center;font-size: 18px; margin-right:500px;margin-top: 260px;"> <p> ${Symbol} konnte nicht gefunden werden </p> </div>`
        throw new Error("Stock couldn't be found!");
    }

    return data2022
}

async function getStockInformations() {
    let Symbol = document.getElementById("symbolInput").value.toUpperCase()
    let stockName = document.getElementById("StockName")
    let stockDescription = document.getElementById("StockDescription")

    let path = BASE_URL + `function=OVERVIEW&symbol=${Symbol}&apikey=${API_KEY}`;
    let StockInfo = await fetch(path).then(res => res.json());

    stockName.innerText = StockInfo.Name
    stockDescription.innerText = StockInfo.Description

}


function DeleteSpinnerAndShowDiagramm( labels, prices, symbol) {
    let ChartDiv = document.getElementById("ChartDiv");
    ChartDiv.innerHTML = '<canvas id="myChart" height="600px" width="1250px"><div style="margin-right:610px;">'
     // Chart Canvas
     const ChartElement = document.getElementById('myChart');
    DrawDiagramm(ChartElement, labels, prices, symbol);
}




// Funktion bekommen
async function GetData() { 

    // Check ob schon ein Chart erstellt wurde, da der canvas mit dem chart immer leer sein muss 
    // um ein neuen Chart zu generieren
    if( Object.keys(Chart.instances).length !== 0) {
        let ChartNumber = Object.keys(Chart.instances)[0];
        Chart.instances[`${ChartNumber}`].destroy()
    }

    // Das eingegebene Symbol vom Input Feld
    let symbol = document.getElementById("symbolInput").value.toUpperCase()
   
    let data2022 = await FetchMonthlyStockData(API_KEY, symbol)
    let labels = [];
    let prices = [];


    Object.keys(data2022).forEach(element => {
        labels.push(new Date(element).toLocaleString('en-de',{month:'short', year:'numeric'}))
    });

        for(const [key, value] of Object.entries(data2022)) {
            prices.push(value["4. close"])
        }
    

    setTimeout( () => {DeleteSpinnerAndShowDiagramm(labels, prices, symbol)}, 800); 
}

async function DrawDiagramm(ChartElement, labels, prices, symbol) {
    const chart = new Chart(ChartElement, {
        // The type of chart we want to create
        type: 'line',
            data: {
            labels: labels.reverse(),
            datasets: [{
                label: `Wertentwicklung 2022 ${symbol} (1 Year | $ )`,
                data: prices.reverse(),
                tension:"0.2"
            }]
            
        },
        // Configuration options go here
        options: {
            responsive: false,
            legend: {
            labels: {
                color: "white"
            }
                
            },
            scales: {
            y: {
                ticks: { color: 'white', beginAtZero: true },
                grid: { display: false, borderColor: 'white' }
                
            },
            x: {
                ticks: { color: 'white', beginAtZero: true },
                grid: { display: false, borderColor: 'white' }
                }
            }
            }
        })
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

async function getStockInformationsRandom(symbol) {
    
    let stockName = document.getElementById("StockName")
    let stockDescription = document.getElementById("StockDescription")

    let path = BASE_URL + `function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`;
    let StockInfo = await fetch(path).then(res => res.json());

    stockName.innerText = StockInfo.Name
    stockDescription.innerText = StockInfo.Description
}

// Funktion bekommen
async function GetRandomStock() { 

   
    let Symbols = ["IBM", "AAPL","NFLX","TSLA"]
    let symbol = []
    symbol.push(Symbols[randomInteger(0,3)])
    
   
    let data2022 = await FetchMonthlyStockData(API_KEY, symbol[0])
    let labels = [];
    let prices = [];

    getStockInformationsRandom(symbol[0])


    Object.keys(data2022).forEach(element => {
        labels.push(new Date(element).toLocaleString('en-de',{month:'short', year:'numeric'}))
    });

        for(const [key, value] of Object.entries(data2022)) {
            prices.push(value["4. close"])
        }
    

    setTimeout( () => {DeleteSpinnerAndShowDiagramm(labels, prices, symbol[0])}, 800); 
}

window.onload = GetRandomStock()


