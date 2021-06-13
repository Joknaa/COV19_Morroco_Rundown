let Statistics01;
let Statistics02;
let RegionsStats;
let Cities;

let Cases_Daily = [];
let Cases_Total = 0;
let Recoveries_Daily = [];
let Recoveries_Total = 0;
let Deaths_Daily = [];
let Deaths_Total = 0;
let RegionsNames = ["All"];
let StatsDates = [];

GetDataFromAPI()
    .then(data => {
        InitialiseVariables(data)
    })
    .then(() => {
        GenerateSelectMenu("select_Date", StatsDates)
        GenerateSelectMenu("select_Region", RegionsNames)
    })

async function GetDataFromAPI() {
    const response = await fetch("https://cov19api1.herokuapp.com/timeline");
    return await response.json();
}

function InitialiseVariables(data) {
    Statistics01 = data.timeline.statistics;
    Statistics02 = data.timeline.statistics2;
    RegionsStats = data.timeline.Regions;
    Cities = data.timeline.villes;

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
        Cases_Daily.push(cases);
        Recoveries_Daily.push(recoveries);
        Deaths_Daily.push(deaths);
    })

    Cases_Total = Cases_Daily.reduce(function (a, b) {
        return a + b;
    }, 0);
    Recoveries_Total = Recoveries_Daily.reduce(function (a, b) {
        return a + b;
    }, 0);
    Deaths_Total = Deaths_Daily.reduce(function (a, b) {
        return a + b;
    }, 0);
    console.log(RegionsNames)
}

function GetStats_PerDay(Date, Region) {
    document.getElementById("Cases_Total").innerHTML = "Total Cases: " + Cases_Total.toString();
    document.getElementById("Recoveries_Total").innerHTML = "Total Recoveries: " + Recoveries_Total.toString();
    document.getElementById("Deaths_Total").innerHTML = "Total Deaths: " + Deaths_Total.toString();
    GetStats("Cases", Date, Region);
    GetStats("Recoveries", Date, Region);
    GetStats("Deaths", Date, Region);
}

function GetStats(Stat, Date, Region) {
    document.getElementById(Stat).innerHTML = "";
    Object.keys(RegionsStats).forEach(function (day) {
        if (RegionsStats[day]["date"] === Date) {

            let Features = RegionsStats[day]["cas"]["features"];
            Object.keys(Features).forEach(function (attribute) {
                let Attributes = Features[attribute]["attributes"];
                if (Region === "All") {
                    document.getElementById(Stat).innerHTML += Attributes["Nom_Région_FR"] + ": " + Attributes[Stat] + "<br/>";
                } else if (Region !== "All" && Region === Attributes["Nom_Région_FR"]) {
                    document.getElementById(Stat).innerHTML += Attributes["Nom_Région_FR"] + ": " + Attributes[Stat] + "<br/>";
                }

            })
        }
    })
    let Total_Daily = [];
    switch (Stat) {
        case "Cases": Total_Daily = Cases_Daily; break;
        case "Recoveries": Total_Daily = Recoveries_Daily; break;
        case "Deaths": Total_Daily = Deaths_Daily; break;
    }
    document.getElementById(Stat + "_Sum").innerHTML = Total_Daily[StatsDates.indexOf(Date)].toString();
}