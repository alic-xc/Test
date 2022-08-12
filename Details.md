HOW IT WORKS

Select all HTML elements needed (tr, buttons, label).
``
    const tbody = document.querySelector("[data-sink]");
    const tr = tbody?.querySelectorAll("tr");
    const prevBtn = document.querySelector("[data-prevbtn]");
    const nextBtn = document.querySelector("[data-nextbtn]");
``

(Optional) Search the URL params to check if page param is passed and navigate to the number passed.
``
    let currentIndex = parseInt(urlParams.get('page'));
    if(currentIndex <  1 || isNaN(currentIndex)){
        currentIndex = 1
    }
``

Make initial request to the endpoint to get first page. 

```
    let url = "https://randomapi.com/api/8csrgnjw?key=LEIX-GF3O-AG7I-6J84&page="  + currentIndex;
    let dataStore = '';
    fetch(url).then(response =>  response.json()).then( data => {
        dataStore = data.results[0];
        insertDataRow(tr, dataStore, currentIndex);
        disableBtn(dataStore, currentIndex, prevBtn, nextBtn);
    } )
```

Added event listener to buttons to handle navigations and display of  data.

```
    nextBtn.addEventListener("click",  () => {})
    prevBtn.addEventListener("click", (e) => {})

```

So, when a button is clicked, its get disabled to prevent running multiple actions at the same time.
The ``currentIndex`` get increae/decrease, ``dataStore[currentIndex]`` object is checked and ``insertDataRow(tr, dataStore, currentIndex);`` will be executed else it checked whether ``dataStore.paging.next | dataStore.paging.previous`` exist (both contain links for navigating) to run request to the sever and display the new result.


```
nextBtn.addEventListener("click",  () => {
        nextBtn.disabled = true; // Disabled previous button on request to server
        currentIndex++;
        if(dataStore[currentIndex]){
            insertDataRow(tr, dataStore, currentIndex);
        } else{
            if(dataStore.paging.next){
                fetch(dataStore.paging.next).then(response => response.json()).then(data => {
                    dataStore = data.results[0];
                    insertDataRow(tr, dataStore, currentIndex);
                    
                });
            }
        }
        setTimeout( () => disableBtn(dataStore, currentIndex, prevBtn, nextBtn), 500); 

    })

prevBtn.addEventListener("click", (e) => {
        e.target.disabled = true
        currentIndex--
        if(dataStore[currentIndex]){
            insertDataRow(tr, dataStore, currentIndex);
        } else{
            if(dataStore.paging.previous){
                fetch(dataStore.paging.previous).then(response => response.json()).then(data => {
                    dataStore = data.results[0];
                    insertDataRow(tr, dataStore, currentIndex);
                })
            }
        }
        
        setTimeout( () => disableBtn(dataStore, currentIndex, prevBtn, nextBtn), 500); 
    })
```

This ``insertDataRow(row, data, currentIndex)`` function is used to render data into the table, it accept 3 args.


```
row = accept tr element
data = accept array of data 
currentIndex = accept number of current page
```


```
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
```

```disableBtn(data, currentIndex, prevBtn, nextBtn)``` function hanlde enable/disable of button.


```
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
```
