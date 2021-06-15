let RawData;
let Statistics01;
let Statistics02;
let RegionsStats;
let Cities;
let Vaccinated_Dates = [];
let Vaccinated_Counts = [];
let Cases_Region_Daily = [];
let Cases_Region_Total = 0;
let Recoveries_Region_Daily = [];
let Recoveries_Region_Total = 0;
let Deaths_Region_Daily = [];
let Deaths_Region_Total = 0;
let Cases_City_Daily = [];
let Cases_City_Total = 0;
let Recoveries_City_Daily = [];
let Recoveries_City_Total = 0;
let Deaths_City_Daily = [];
let Deaths_City_Total = 0;
let RegionsNames = ["All"];
let CitiesNames = ["All"];
let StatsDates = [];
let LastUpdatedDay;

GetDataFromAPI()
    .then(() => {
        SetupVariables();
    })
    .then(() => {
        DisplayUpdatedStats(LastUpdatedDay)
    })

async function GetDataFromAPI() {
    const response = await fetch("https://cov19api1.herokuapp.com/timeline");
    RawData = await response.json();
}

function SetupVariables() {
    SetupRegionStats_Daily();
    SetupRegionStats_Total();
    SetupCitiesStats_Daily();
    SetupCitiesStats_Total();
    SetupVaccineStats();
    LastUpdatedDay = StatsDates[StatsDates.length - 2];
}

function DisplayUpdatedStats(Date) {
    DisplayUpdatesStats_Totals(Date);
    DisplayUpdatedStats_Regions(Date);
    DisplayUpdatedStats_Cities(Date);
    DisplayGraphs();
}

//<editor-fold desc="Update at 1000 and 1800">
let now = new Date();
let timeTill10OO = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0) - now;
let timeTill18OO = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 28, 20, 0) - now;

function Update1000() {
    if (timeTill10OO < 0) {
        timeTill10OO += 86400000;

        GetDataFromAPI()
            .then(() => {
                SetupVariables();
            })
            .then(() => {
                DisplayUpdatedStats(LastUpdatedDay)
            })
            .then(() => {
                let items = document.getElementsByClassName("UpdateDate");
                Object.keys(items).forEach((item) => {
                    items[item].innerHTML = "Dernière mise à jour: " + StatsDates[StatsDates.length - 1] + (timeTill18OO > timeTill10OO ? " - 18:00" : " - 10:00");
                })
            })

    } else {
        alert("There is an update ! Please refresh the page")
        GetDataFromAPI()
            .then(() => {
                SetupVariables();
            })
            .then(() => {
                DisplayUpdatedStats(LastUpdatedDay)
            })
            .then(() => {
                let items = document.getElementsByClassName("UpdateDate");
                Object.keys(items).forEach((item) => {
                    items[item].innerHTML = "Dernière mise à jour: " + StatsDates[StatsDates.length - 1] + (timeTill18OO > timeTill10OO ? " - 18:00" : " - 10:00");
                })
            })
    }

}

function Update1800() {
    if (timeTill18OO < 0) {
        timeTill18OO += 86400000;

        GetDataFromAPI()
            .then(() => {
                SetupVariables();
            })
            .then(() => {
                DisplayUpdatedStats(LastUpdatedDay)
            })
            .then(() => {
                let items = document.getElementsByClassName("UpdateDate");
                Object.keys(items).forEach((item) => {
                    items[item].innerHTML = "Dernière mise à jour: " + StatsDates[StatsDates.length - 1] + (timeTill18OO > timeTill10OO ? " - 18:00" : " - 10:00");
                })
            })
    } else {
        alert("There is an update ! Please refresh the page")
        GetDataFromAPI()
            .then(() => {
                SetupVariables();
            })
            .then(() => {
                DisplayUpdatedStats(LastUpdatedDay)
            })
            .then(() => {
                let items = document.getElementsByClassName("UpdateDate");
                Object.keys(items).forEach((item) => {
                    items[item].innerHTML = "Dernière mise à jour: " + StatsDates[StatsDates.length - 1] + (timeTill18OO > timeTill10OO ? " - 18:00" : " - 10:00");
                })
            })
    }
}

setTimeout(Update1000, timeTill10OO)
setTimeout(Update1800, timeTill18OO)

//</editor-fold>

//<editor-fold desc="Extracted">
function SetupRegionStats_Daily() {
    RegionsStats = RawData.timeline.Regions;

    Object.keys(RegionsStats).forEach(function (day) {
        StatsDates.push(RegionsStats[day]["date"]);

        let deaths = 0, cases = 0, recoveries = 0;
        let Features = RegionsStats[day]["cas"]["features"]
        Object.keys(Features).forEach(function (attribute) {

            let Attributes = Features[attribute]["attributes"];
            if (!RegionsNames.includes(Attributes["Nom_Région_FR"])) {
                RegionsNames.push(Attributes["Nom_Région_FR"]);
            }
            cases += Attributes["Cases"];
            recoveries += Attributes["Recoveries"];
            deaths += Attributes["Deaths"];
        })
        Cases_Region_Daily.push(cases);
        Recoveries_Region_Daily.push(recoveries);
        Deaths_Region_Daily.push(deaths);
    })
}

function SetupRegionStats_Total() {
    Cases_Region_Total = Cases_Region_Daily.reduce(function (a, b) {
        return a + b;
    }, 0);
    Recoveries_Region_Total = Recoveries_Region_Daily.reduce(function (a, b) {
        return a + b;
    }, 0);
    Deaths_Region_Total = Deaths_Region_Daily.reduce(function (a, b) {
        return a + b;
    }, 0);
}

function SetupCitiesStats_Daily() {
    Cities = RawData.timeline.Villes;

    Object.keys(Cities).forEach(function (day) {
        let cases = 0;
        let Features = Cities[day]["cas"]["features"]
        Object.keys(Features).forEach(function (attribute) {

            let Attributes = Features[attribute]["attributes"];
            if (!CitiesNames.includes(Attributes["NOM"])) {
                CitiesNames.push(Attributes["NOM"]);
            }
            cases += Attributes["cas_confir"];
        })
        Cases_City_Daily.push(cases);

    })
    Cases_City_Total = Cases_City_Daily.reduce(function (a, b) {
        return a + b;
    }, 0);
}

function SetupCitiesStats_Total() {
    Cases_City_Total = Cases_City_Daily.reduce(function (a, b) {
        return a + b;
    }, 0);
}

function SetupVaccineStats() {
    Statistics01 = RawData.timeline.statistics;

    let Keys = Object.keys(Statistics01);
    for (let i = 0; i < Keys.length; i++) {
        Vaccinated_Dates.push(Keys[i])
        Vaccinated_Counts.push(Statistics01[Keys[i]])
    }
}

function DisplayUpdatesStats_Totals(Date) {
    let NewVaccinated = Vaccinated_Counts[Vaccinated_Counts.length - 1] - Vaccinated_Counts[Vaccinated_Counts.length - 2];
    document.getElementById("Total_Cases").innerHTML = Cases_Region_Total.toString() + "(+ " + Cases_Region_Daily[StatsDates.indexOf(Date)] + ")";
    document.getElementById("Total_Recoveries").innerHTML = Recoveries_Region_Total.toString() + "(+ " + Recoveries_Region_Daily[StatsDates.indexOf(Date)] + ")";
    document.getElementById("Total_Deaths").innerHTML = Deaths_Region_Total.toString() + "(+ " + Deaths_Region_Daily[StatsDates.indexOf(Date)] + ")";
    document.getElementById("Total_Vaccines").innerHTML = Vaccinated_Counts[Vaccinated_Counts.length - 1].toString() + "(+" + NewVaccinated + ")";
}

function DisplayUpdatedStats_Regions(Date) {
    Object.keys(RegionsStats).forEach(function (day) {
        if (RegionsStats[day]["date"] === Date) {

            let Features = RegionsStats[day]["cas"]["features"];
            Object.keys(Features).forEach(function (attribute) {
                let Attributes = Features[attribute]["attributes"];
                document.getElementById("Region_" + RegionsNames.indexOf(Attributes["Nom_Région_FR"]) + "_Cases").innerHTML = Attributes["Cases"];
                document.getElementById("Region_" + RegionsNames.indexOf(Attributes["Nom_Région_FR"]) + "_Recoveries").innerHTML = Attributes["Recoveries"];
                document.getElementById("Region_" + RegionsNames.indexOf(Attributes["Nom_Région_FR"]) + "_Deaths").innerHTML = Attributes["Deaths"];
                document.getElementById("Region_" + RegionsNames.indexOf(Attributes["Nom_Région_FR"]) + "_Cases").innerHTML = Attributes["Cases"];
            })
        }
    })
}

function DisplayUpdatedStats_Cities(Date) {
    Object.keys(Cities).forEach(function (day) {
        if (Cities[day]["date"] === Date) {

            let Features = Cities[day]["cas"]["features"];
            for (let i = 1; i <= Features.length; i++) {
                let City = Features[i - 1]["attributes"];

                if (document.getElementById("City_" + i + "_Name") !== null) {
                    document.getElementById("City_" + i + "_Name").innerHTML = City["NOM"];
                    document.getElementById("City_" + i + "_Cases").innerHTML = City["cas_confir"];
                }
            }
        }
    })
}

function DisplayGraphs() {
    let last = StatsDates.length - 1;
    let lastCases = Cases_Region_Daily.length - 1;
    let lastRecov = Recoveries_Region_Daily.length - 1;
    let lastDeath = Deaths_Region_Daily.length - 1;
    let lastVacci = Vaccinated_Counts.length - 1;
    let Data = [];
    let name;
    for (let i = 1; i <= 4; i++) {
        switch (i) {
            case 1:
                name = "Cases";
                Data = [Cases_Region_Daily[lastCases - 4], Cases_Region_Daily[lastCases - 3], Cases_Region_Daily[lastCases - 2], Cases_Region_Daily[lastCases - 1], Cases_Region_Daily[lastCases]];
                break;
            case 2:
                name = "Guéris";
                Data = [Recoveries_Region_Daily[lastRecov - 4], Recoveries_Region_Daily[lastRecov - 3], Recoveries_Region_Daily[lastRecov - 2], Recoveries_Region_Daily[lastRecov - 1], Recoveries_Region_Daily[lastRecov]];
                break;
            case 3:
                name = "Décès";
                Data = [Deaths_Region_Daily[lastDeath - 4], Deaths_Region_Daily[lastDeath - 3], Deaths_Region_Daily[lastDeath - 2], Deaths_Region_Daily[lastDeath - 1], Deaths_Region_Daily[lastDeath]];
                break;
            case 4:
                name = "Vaccinées";
                Data = [Vaccinated_Counts[lastVacci - 4], Vaccinated_Counts[lastVacci - 3], Vaccinated_Counts[lastVacci - 2], Vaccinated_Counts[lastVacci - 1], Vaccinated_Counts[lastVacci]];
                break;
            default:
        }

        const ctx = document.getElementById('Graph' + i).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: [StatsDates[last - 4], StatsDates[last - 3], StatsDates[last - 2], StatsDates[last - 1], StatsDates[last]],
                datasets: [{
                    pointRadius: 4,
                    label: name,
                    data: Data,
                    backgroundColor: [
                        'rgba(15, 99, 132, 0)'
                    ],
                    borderColor: [
                        'rgba(15, 99, 132, 1)'
                    ],
                    borderWidth: 2,
                }]
            },
            options: {
                legend: {display: true},
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

//</editor-fold>

