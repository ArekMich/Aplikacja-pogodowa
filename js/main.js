const CITIES = ["Paris", "London", "Cracow", "Berlin", "Madrid", "Moscow", "Lagos", "Riyadh", "Singapore", "Los Angeles",
    "Tokyo", "Beijing", "New York City", "San Francisco", "Washington ", "Geneva", "Shanghai", "Beijing", "Oslo",
    "Boston", "Dublin", "Helsinki", "Sydney", "Zurich ", "Chicago", "Toronto", "Stockholm",
    "Vienna", "Seoul ", "Hong Kong", "Wadowice"];
const APIKEY = "d1d888a53a42465faf2190749182202";
const ADDRESS = "http://api.apixu.com/v1/current.json";
let counter = 0;
let defer = $.Deferred().resolve();

let ListItem = [];
let tmpItem = [];
let listElements = 5;
let xhr;

window.onload = () => {

    for (const city of CITIES) {
        defer = defer.then(() => {
            xhr = $.getJSON(ADDRESS, {key: APIKEY, q: city}, function (data) {
                showTable(data);
            }).done(function (json) {
                console.log("JSON Data: " + json.location.name);
            }).fail(function (data, textStatus, error) {
                let err = textStatus + ", " + error;
                console.log("Request Failed: " + err + "/ Status: " + data.status + " /  Status derefered: " + defer.state());
                confirm("Request Failed: " + err + "/ Status: " + data.status + " /  Status dereferd: " + defer.state());
            });

            return xhr;
        });

    }

    defer = defer.then(() => {

        document.getElementById("results").style.display = "block";

        $('#pagine').pagination({
            dataSource: ListItem,
            pageSize: listElements,
            showPrevious: true,
            showNext: true,
            showGoInput: true,
            showGoButton: true,
            className: 'paginationjs-theme-blue',
            formatNavigator: '<span style="color: #f00"><%= currentPage %></span> st/rd/th, <%= totalPage %> pages, <%= totalNumber %> entries',
            showNavigator: true,
            callback: function (data, pagination) {
                console.log(data, pagination);

                let html = simpleTemplating(data);
                $('#tempTableBody').html(html);
            }
        });
    });
};

function simpleTemplating(data) {

    let html = '';
    $.each(data, function (index, item) {
        html += '<tr ><td>' + item[0] + '</td><td>' + item[1] + '</td><td>' + item[2] + '</td><td>' + item[3] + '</td></tr>';
    });
    return html;
}

const showTable = (data) => {

    tmpItem = [data.location.name, data.location.lat, data.location.lon, data.current.temp_c];
    console.dir(tmpItem);
    ListItem.push(tmpItem);

    counter++;
    document.getElementById("progresBar").innerHTML = (100 / CITIES.length) * counter + "%";
    document.getElementById("progresBar").style.width = (100 / CITIES.length) * counter + "%";
    $('#theprogressbar').attr("aria-valuenow", "(100/CITIES.length)*counter");

    if (counter == CITIES.length) {

        let months = ["January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"];
        let d = new Date();
        document.getElementById("checkPage").innerText = "Weather " + d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
        document.getElementById("showProgress").style.display = "none";
        document.getElementById("showElemList").style.display = "block";
        document.getElementById("filter").style.display = "block";

        //check Web Storage
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem("countElem", listElements);
            document.getElementById("locStorage").value = "Elements on page: " + localStorage.getItem("countElem");

        } else {
            document.getElementById("locStorage").value = "Sorry! No WebStorage.. "
        }
    }
};

// On change Elements on Table
$('#sel1').on('change', function () {

    let cElem = this.value;
    listElements = cElem;

    //check Web Storage
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("countElem", listElements);
        document.getElementById("locStorage").value = "Elements on page: " + localStorage.getItem("countElem");
    }

    $('#pagine').pagination({
        dataSource: ListItem,
        pageSize: cElem,
        showPrevious: true,
        showNext: true,
        showGoInput: true,
        showGoButton: true,
        className: 'paginationjs-theme-blue',
        formatNavigator: '<span style="color: #f00"><%= currentPage %></span> st/rd/th, <%= totalPage %> pages, <%= totalNumber %> entries',
        showNavigator: true,
        callback: function (data, pagination) {
            console.log(data, pagination);

            let html = simpleTemplating(data);
            $('#tempTableBody').html(html);
        }
    });

});

// On change  value of Elements on Table
function changeP() {

    let cElem = document.getElementById("valP").value;

    //check if value is more than CITIES LENGTH
    if (cElem < CITIES.length) {
        listElements = cElem;
    } else {
        listElements = CITIES.length;
    }

    //check Web Storage
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("countElem", listElements);
        document.getElementById("locStorage").value = "Elements on page: " + localStorage.getItem("countElem");
    }

    $('#pagine').pagination({
        dataSource: ListItem,
        pageSize: cElem,
        showPrevious: true,
        showNext: true,
        showGoInput: true,
        showGoButton: true,
        className: 'paginationjs-theme-blue',
        formatNavigator: '<span style="color: #f00"><%= currentPage %></span> st/rd/th, <%= totalPage %> pages, <%= totalNumber %> entries',
        showNavigator: true,
        callback: function (data, pagination) {
            console.log(data, pagination);

            let html = simpleTemplating(data);
            $('#tempTableBody').html(html);
        }
    });
}

// Filterable table
$(document).ready(function () {
    $("#myInput").on("keyup", function () {
        let value = $(this).val().toLowerCase();
        $("#tempTableBody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);

            let numOfVisibleRows = $('#tempTable tr:visible').length - 1;
            console.log(numOfVisibleRows);
            //check Web Storage
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem("countElem", numOfVisibleRows);
                document.getElementById("locStorage").value = "Elements on page: " + localStorage.getItem("countElem");

            } else {
                document.getElementById("locStorage").value = "Sorry! No WebStorage.. "
            }
        });
    });
});

//show data from table
$('#start').click(() => {

    document.getElementById("results").style.display = "block";

    for (let i = 0; i < ListItem.length; i++) {
        for (let j = 0; j < tmpItem.length; j += 4) {
            $("#tempTableBody").append(`<tr >
                    <td > ${ListItem[i][j]} </td>
                    <td > ${ListItem[i][j + 1]} </td>
                    <td > ${ListItem[i][j + 2]} </td>
                    <td > ${ListItem[i][j + 3]} </td>
                </tr>`);
        }
    }
});


function sortCities() {

    let table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("tempTable");
    switching = true;
    while (switching) {
        switching = false;
        rows = table.getElementsByTagName("TR");
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[0];
            y = rows[i + 1].getElementsByTagName("TD")[0];
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}

function sortTemp() {

    let table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("tempTable");
    switching = true;
    while (switching) {
        switching = false;
        rows = table.getElementsByTagName("TR");
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[3];
            y = rows[i + 1].getElementsByTagName("TD")[3];
            if (parseFloat(x.innerHTML) > parseFloat(y.innerHTML)) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }

}

//change Content to Information
$('#informa').click(function () {
    changeContentToInform();
    return false;
});


function changeContentToInform() {

    //check Web Storage
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("countElem", 0);
        document.getElementById("locStorage").value = "Local Storage";
    }

    let textToS = `<div class="flexBox">
    <div class="imgC">
    <img src="img/ownerPicture.jpg" alt="Avatar" class="image" style="width:100%">
    <div class="middleC">
    <div class="text">Arkadiusz Michalik</div>
    </div> </div>
    <div><h2>Informacje</h2>
    <p>Autor:Arkadiusz Michalik</p><hr/>
    <p>Wykorzystanie API ("https://www.apixu.com")<br/>Dzięki wygenerowanemu kluczowi mamy dostęp do bieżących
    danych na serwerze.</p>
    <p>Klucz jest darmowy dlatego zdecydowałem się na takie rozwiązanie. Wykorzystane API daje nam
    dostęp do bieżących danych pogodowych różnych lokalizacji .</p><hr />
    <p style="color:red">UWAGA! Aby sprawdzić działanie obsługi Requesta wystarczy dodać do tablicy CITIES (znajduje się w pliku main.js)
    obojętną wartość (nie będąca miastem). Dzięki czemu otrzymamy wszelakie informacje o zaistniałym błędzie...
    </p>
    <br />
    <p><i>Powyższe API ma możliwość zwrócenia obiektu JSON-em lub XML-em</i></p></div>
    </div>`;

    document.getElementById('changeText').innerHTML = textToS;
}


