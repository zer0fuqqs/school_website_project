// Script das die Daten der API bekommt //

//API KEY //
const API_KEY = "MW31DEJ7BTTNXQ2B"
const BASE_URL = "https://www.alphavantage.co/query?"

Chart.defaults.borderColor = 'lime';
Chart.defaults.color = 'white';


async function getMonthlyStockData(API_KEY, Symbol) {

    let data2022 = new Object();

    let path = BASE_URL + `function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${Symbol}&apikey=${API_KEY}`;

    let data = await fetch(path).then(res => res.json());

    // Looped über die Daten und filtert auf das Jahr 2022

    for(const [key, value] of Object.entries(data["Monthly Adjusted Time Series"])) {

        if(key > "2021-12-31") {
            data2022[key] = value
        }
    }

    return data2022
}



async function createDiagramm() { 
    
    // Check ob schon ein Chart erstellt wurde, da der canvas mit dem chart immer leer sein muss 
    // um ein neuen Chart zu generieren
    

    if( Object.keys(Chart.instances).length !== 0) {
        let ChartNumber = Object.keys(Chart.instances)[0];
        Chart.instances[`${ChartNumber}`].destroy()
    }

    // Das eingegebene Symbol vom Input Feld
    let symbol = document.getElementById("symbolInput").value
    // Chart Canvas
    const ctx = document.getElementById('myChart');


    let data2022 = await getMonthlyStockData(API_KEY, symbol)
    let labels = Object.keys(data2022)
    let prices = [];

    for(const [key, value] of Object.entries(data2022)) {

    prices.push(value["4. close"])
    }

    

    const chart = new Chart(ctx, {
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

