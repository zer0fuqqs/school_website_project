// // Script das die Newsdaten der API bekommt //





//API KEY //
const API_KEY = "MW31DEJ7BTTNXQ2B"
const BASE_URL = "https://www.alphavantage.co/query?"

// Funktion die die API anspricht
async function FetchNewsData() {

    let path = BASE_URL + `function=NEWS_SENTIMENT&apikey=${API_KEY}`;

    let newsData = await fetch(path).then(res => res.json());

    return newsData

}

async function main() {

    let newsData = await FetchNewsData();

    let count = 5;
    let index = 0;
    for (let i = 0; i < count; i++) {
    
        let newsImg = document.getElementById(`newsImg${i}`)
        let newsCategory = document.getElementById(`newsCategory${i}`)
        let newsTitle = document.getElementById(`newsTitle${i}`)
        let newsSummary = document.getElementById(`newsSummary${i}`)

        console.log(i)
        console.log(index)

        if (newsData.feed[index].banner_image) {
            newsImg.src = newsData.feed[index].banner_image
            newsTitle.innerText = newsData.feed[index].title
            newsSummary.innerText = newsData.feed[index].summary
            newsCategory.innerText = newsData.feed[index].category_within_source
        }
        else {
            newsImg.src = '../bilder/placeholder_logo.png'
            newsTitle.innerText = newsData.feed[index].title
            newsSummary.innerText = newsData.feed[index].summary
            newsCategory.innerText = newsData.feed[index].category_within_source
        }

        index += 1;
    }

}

// Eventlistener

window.onload = main()