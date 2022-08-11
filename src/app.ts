
const startApp = async () => {
    const tbody = document.querySelector("[data-sink]");
    const tr = tbody?.querySelectorAll("tr");
    const prevBtn = document.querySelector("[data-prevbtn");
    const nextBtn = document.querySelector("[data-nextbtn");
    const urlParams = new URLSearchParams(window.location.search);
    let currentIndex = parseInt(urlParams.get('page'));
    if(currentIndex <  1 || isNaN(currentIndex)){
        currentIndex = 1
    }
    let url = "https://randomapi.com/api/8csrgnjw?key=LEIX-GF3O-AG7I-6J84&page="  + currentIndex;
    let response = await fetch(url);
    let dataStore = {};
    if(response.ok){
        let data = await response.json();
        dataStore = data.results[0];
        insertDataRow(tr, dataStore, currentIndex);
        disableBtn(dataStore, currentIndex, prevBtn, nextBtn);
    }

    nextBtn.addEventListener("click",  (e) => {
        console.log("Testing")
        currentIndex++;
        if(dataStore[currentIndex]){
            insertDataRow(tr, dataStore, currentIndex);
        } else{
            if(dataStore.paging.next){
                nextBtn.disabled = true; // Disabled previous button on request to server
                nextBtn.textContent  = "loading...";
                fetch(dataStore.paging.next).then(response => response.json()).then(data => {
                    dataStore = data.results[0];
                    insertDataRow(tr, dataStore, currentIndex);
                    nextBtn.disabled = false;  // Enable button after processing
                    nextBtn.textContent = "Next";
                });


            }
        }
        disableBtn(dataStore, currentIndex, prevBtn, nextBtn);

    })

    prevBtn.addEventListener("click", async () => {
        currentIndex--
        if(dataStore[currentIndex]){
            insertDataRow(tr, dataStore, currentIndex);
        } else{
            if(dataStore.paging.previous){
                prevBtn.disabled = true; // Disabled button on request to server
                prevBtn.textContent  = "loading...";
                fetch(dataStore.paging.previous).then(response => response.json()).then(data => {
                    dataStore = data.results[0];
                    insertDataRow(tr, dataStore, currentIndex);
                    prevBtn.disabled = false; // Enable button after processing
                    prevBtn.textContent = "Previous";
                })
            }
        }
        disableBtn(dataStore, currentIndex, prevBtn, nextBtn);

    })

};

const insertDataRow = (row, data, currentIndex) => {
    const label = document.querySelector("[data-pageview");
    row?.forEach( function(tr, index){
        tr.setAttribute("data-entryid", data[currentIndex][index]["id"]);
        const tableData = tr.querySelectorAll("td");
        tableData[0].innerHTML = data[currentIndex][index]["row"];
        tableData[1].innerHTML  = data[currentIndex][index]["age"];
        tableData[2].innerHTML = data[currentIndex][index]["gender"];
    })
    label.textContent  = `Showing Page ${currentIndex}`;
}

const disableBtn = (data, currentIndex, prevBtn, nextBtn) => {
    
    // Disable  previous button
    if(!data.paging.previous){
        if(!data[currentIndex - 1]){
            prevBtn.disabled = true
        }else{
            prevBtn.disabled = false
        }
    }else{
        prevBtn.disabled = false
    }

    // Disable  Next button
    if(!data.paging.next){
        if(!data[currentIndex + 1]){
            nextBtn.disabled = true
        }else{
            nextBtn.disabled = false
        }
    }else{
        nextBtn.disabled = false
    }

}

document.addEventListener("DOMContentLoaded", startApp);