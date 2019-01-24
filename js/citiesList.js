const CITIES = ["Paris", "London", "Cracow", "Berlin", "Madrid", "Moscow", "Lagos", "Riyadh", "Singapore", "Los Angeles",
    "Tokyo", "Beijing", "New York City", "San Francisco", "Washington ", "Geneva", "Shanghai", "Beijing", "Oslo",
    "Boston", "Dublin", "Helsinki", "Sydney", "Zurich ", "Chicago", "Toronto", "Stockholm",
    "Vienna", "Seoul ", "Hong Kong", "Wadowice"];

let citiesLength = CITIES.length;

window.onload = () => {

    let innerTR = "";

    for (let i = 0; i < CITIES.length; i++) {
        innerTR += `
            <tr class="w3-hover-blue">
                <td>${CITIES[i]}</td>
            </tr>    
        `;
    }

    document.getElementById("tableCities").innerHTML = innerTR;

    //check Web Storage
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("countElem", citiesLength);
        document.getElementById("locStorage").value = "Elements on page: " + localStorage.getItem("countElem");

    } else {
        document.getElementById("locStorage").value = "Sorry! No WebStorage.. "
    }

};

function searchCity() {
    let input, filter, table, tr, td, i;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("tableM");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
        console.log("count: " + i);
    }

    changeLocalStorage();
}

function changeLocalStorage() {

    let numOfVisibleRows = $('#tableCities tr:visible').length;

    console.log(numOfVisibleRows);
    //check Web Storage
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("countElem", numOfVisibleRows);
        document.getElementById("locStorage").value = "Elements on page: " + localStorage.getItem("countElem");

    } else {
        document.getElementById("locStorage").value = "Sorry! No WebStorage.. "
    }
}