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
    // Try..catch für Errorhandling falls ein API Call fehlschlägt
    try {
        for(const [key, value] of Object.entries(data["Monthly Adjusted Time Series"])) {

            if(key > "2021-12-31") {
                data2022[key] = value
            }
        }
    } catch(e) {
        alert("Stock couldnt be find. Please check if your symbol is right!")
        throw new Error("Something went badly wrong!");
    }

    return data2022
}

async function ShowSpinner() {
    let SpinnerDiv = document.createElement('div');
    SpinnerDiv.setAttribute('id', 'Spinner')
    SpinnerDiv.classList.add('justify-content-center')
    SpinnerDiv.classList.add('d-flex')
    SpinnerDiv.innerHTML='<div class="spinner-border" style="width: 3rem; height: 3rem; margin-top: 260px;" role="status"> <span class="visually-hidden">Loading...</span> </div </div>'

    let parent = document.getElementById("ChartDiv")
    parent.parentNode.insertBefore(SpinnerDiv, parent)


}

function DeleteSpinnerAndShowDiagramm(ChartElement, labels, prices, symbol) {
    document.getElementById('Spinner').remove();
    DrawDiagramm(ChartElement, labels, prices, symbol);
}



async function GetData() { 

    ShowSpinner()

    // Check ob schon ein Chart erstellt wurde, da der canvas mit dem chart immer leer sein muss 
    // um ein neuen Chart zu generieren
    if( Object.keys(Chart.instances).length !== 0) {
        let ChartNumber = Object.keys(Chart.instances)[0];
        Chart.instances[`${ChartNumber}`].destroy()
    }

    // Das eingegebene Symbol vom Input Feld
    let symbol = document.getElementById("symbolInput").value
    // Chart Canvas
    const ChartElement = document.getElementById('myChart');

    let data2022 = await getMonthlyStockData(API_KEY, symbol)
    let labels = [];
    let prices = [];

    Object.keys(data2022).forEach(element => {
        labels.push(new Date(element).toLocaleString('en-de',{month:'short', year:'numeric'}))
    });

        for(const [key, value] of Object.entries(data2022)) {
            prices.push(value["4. close"])
        }
    

    setTimeout( () => {DeleteSpinnerAndShowDiagramm(ChartElement, labels, prices, symbol)}, 800); 
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
