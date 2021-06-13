let Statistics01;
let Statistics02;
let RegionsStats;
let Cities;

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

GetDataFromAPI()
    .then(data => {
        InitialiseVariables(data)
    })
    .then(() => {
        GenerateSelectMenu("select_Date", StatsDates)
        GenerateSelectMenu("select_Region", RegionsNames)
        GenerateSelectMenu("select_City", CitiesNames)
    })

async function GetDataFromAPI() {
    const response = await fetch("https://cov19api1.herokuapp.com/timeline");
    return await response.json();
}

function InitialiseVariables(data) {
    Statistics01 = data.timeline.statistics;
    Statistics02 = data.timeline.statistics2;
    RegionsStats = data.timeline.Regions;
    Cities = data.timeline.Villes;

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
    Cases_Region_Total = Cases_Region_Daily.reduce(function (a, b) {
        return a + b;
    }, 0);
    Recoveries_Region_Total = Recoveries_Region_Daily.reduce(function (a, b) {
        return a + b;
    }, 0);
    Deaths_Region_Total = Deaths_Region_Daily.reduce(function (a, b) {
        return a + b;
    }, 0);

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
    console.log(Cases_City_Daily)
    console.log(CitiesNames)
}

function GetStats_Regions_PerDay(Date, Region, City) {
    document.getElementById("Title").innerHTML = "COVID-19 Stats for:" + Date;
    document.getElementById("Cases_Total").innerHTML = "Total Cases: " + Cases_Region_Total.toString();
    document.getElementById("Recoveries_Total").innerHTML = "Total Recoveries: " + Recoveries_Region_Total.toString();
    document.getElementById("Deaths_Total").innerHTML = "Total Deaths: " + Deaths_Region_Total.toString();
    GetStats_Regions("Cases", Date, Region);
    GetStats_Regions("Recoveries", Date, Region);
    GetStats_Regions("Deaths", Date, Region);
    GetStats_Cities(Date, City)
}
function GetStats_Regions(Stat, Date, Region) {
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
        case "Cases":
            Total_Daily = Cases_Region_Daily;
            break;
        case "Recoveries":
            Total_Daily = Recoveries_Region_Daily;
            break;
        case "Deaths":
            Total_Daily = Deaths_Region_Daily;
            break;
    }
    document.getElementById(Stat + "_Sum").innerHTML = Total_Daily[StatsDates.indexOf(Date)].toString();
}

function GetStats_Cities(Date, City) {
    document.getElementById("Cases_City").innerHTML = "";
    Object.keys(Cities).forEach(function (day) {
        if (Cities[day]["date"] === Date) {
            console.log("correct date")
            let Features = Cities[day]["cas"]["features"];
            console.log("correct date")
            Object.keys(Features).forEach(function (attribute) {
                let Attributes = Features[attribute]["attributes"];

                if (City === "All") {
                    console.log("all")
                    document.getElementById("Cases_City").innerHTML += Attributes["NOM"] + ": " + Attributes["cas_confir"] + "<br/>";
                } else if (City !== "All" && City === Attributes["NOM"]) {
                    console.log("notall")
                    document.getElementById("Cases_City").innerHTML += Attributes["NOM"] + ": " + Attributes["cas_confir"] + "<br/>";
                }
            })
        }
    })
    document.getElementById("Cases_City_Sum").innerHTML = Cases_City_Daily[StatsDates.indexOf(Date)].toString();
}