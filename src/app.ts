
const startApp = async () => {
    const tbody = document.querySelector('[data-sink]')
    const tr = tbody?.querySelectorAll('tr')
    const prevBtn = document.querySelector('[data-prevbtn')
    const nextBtn = document.querySelector('[data-nextbtn')
    let url = 'https://randomapi.com/api/8csrgnjw?key=LEIX-GF3O-AG7I-6J84&page=1'
    let response = await fetch(url)
    let currentIndex = 1
    let dataStore = {}
    if(response.ok){
        let data = await response.json();
        dataStore = data.results[0]
        insertDataRow(tr, dataStore, currentIndex)
        disableBtn(dataStore.paging, prevBtn, nextBtn)    
    }
    
    nextBtn?.addEventListener('click', async (e) => {
        currentIndex++
        if(dataStore[currentIndex]){
            insertDataRow(tr, dataStore, currentIndex)
        } else{
            if(dataStore.paging.next){
                let response = await fetch(dataStore.paging.next)
                nextBtn.disabled = true // Disabled previous button on request to server
                nextBtn.textContent  = "loading..."
                if(response.ok){
                    const data = await response.json();
                    dataStore = data.results[0]
                    insertDataRow(tr, dataStore, currentIndex)
                    disableBtn(dataStore.paging, prevBtn, nextBtn)
                    nextBtn.disabled = false  // Enable button after processing
                    nextBtn.textContent = 'Next'

                }
            }
        }
    })

    prevBtn?.addEventListener('click', async () => {
        currentIndex--
        if(dataStore[currentIndex]){
            insertDataRow(tr, dataStore, currentIndex)
        } else{
            if(dataStore.paging.previous){
                let response = await fetch(dataStore.paging.previous)
                prevBtn.disabled = true // Disabled button on request to server
                prevBtn.textContent  = "loading..."
                if(response.ok){
                    const data = await response.json();
                    dataStore = data.results[0]
                    insertDataRow(tr, dataStore, currentIndex)
                    disableBtn(dataStore.paging, prevBtn, nextBtn)
                    prevBtn.disabled = false // Enable button after processing
                    prevBtn.textContent = 'Next'
                }
            }
        }
    })

};

const insertDataRow = (row, data, currentIndex) => {
    const label = document.querySelector('[data-pageview')
    row?.forEach( function(tr, index){
        tr.setAttribute('data-entryid', data[currentIndex][index]['id'] )
        const tableData = tr.querySelectorAll('td')
        tableData[0].innerHTML = data[currentIndex][index]['row']
        tableData[1].innerHTML  = data[currentIndex][index]['age']
        tableData[2].innerHTML = data[currentIndex][index]['gender']
    })
    label.textContent  = `Showing Page ${currentIndex}`
}

const disableBtn = (value, prevBtn, nextBtn) => {
    if(!value.next){
        console.log("g")
        nextBtn.disabled = true
    }
    if(!value.previous){
        console.log('j')
        prevBtn.disabled = true
    }

}

document.addEventListener('DOMContentLoaded', startApp);