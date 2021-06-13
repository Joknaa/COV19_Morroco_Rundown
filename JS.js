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

GetDataFromAPI().then(data => {
    InitialiseVariables(data)
}).then(() => {
    DisplayUpdatedStats(StatsDates[StatsDates.length - 2])
})

function GetDates() {
    return StatsDates;
}

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


    let Keys = Object.keys(Statistics01);
    for (let i = 0; i < Keys.length; i++) {
        Vaccinated_Dates.push(Keys[i])
        Vaccinated_Counts.push(Statistics01[Keys[i]])
    }
    console.log(Vaccinated_Dates)
    console.log(Vaccinated_Counts)
    Cases_City_Total = Cases_City_Daily.reduce(function (a, b) {
        return a + b;
    }, 0);

}


let eta_ms = new Date(2021, 6, 13, 13, 35, 20).getTime() - Date.now();
setTimeout(() => {
}, 2000);


function DisplayUpdatedStats(Date) {
    let NewVaccinated = Vaccinated_Counts[Vaccinated_Counts.length - 1] - Vaccinated_Counts[Vaccinated_Counts.length - 2];
    document.getElementById("Total_Cases").innerHTML = Cases_Region_Total.toString() + "(+ " + Cases_Region_Daily[StatsDates.indexOf(Date)] + ")";
    document.getElementById("Total_Recoveries").innerHTML = Recoveries_Region_Total.toString() + "(+ " + Recoveries_Region_Daily[StatsDates.indexOf(Date)] + ")";
    document.getElementById("Total_Deaths").innerHTML = Deaths_Region_Total.toString() + "(+ " + Deaths_Region_Daily[StatsDates.indexOf(Date)] + ")";
    document.getElementById("Total_Vaccines").innerHTML = Vaccinated_Counts[Vaccinated_Counts.length - 1].toString() + "(+" + NewVaccinated + ")";
    GetStats_Regions(Date);
    GetStats_Cities(Date)
}

function GetStats_Regions(Date) {
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

function GetStats_Cities(Date) {
    Object.keys(Cities).forEach(function (day) {
        if (Cities[day]["date"] === Date) {

            let Features = Cities[day]["cas"]["features"];
            console.log(Features)

            for (let i = 1; i <= Features.length; i++) {
                let City = Features[i - 1]["attributes"];
                console.log("test")

                if (document.getElementById("City_" + i + "_Name") !== null) {

                    document.getElementById("City_" + i + "_Name").innerHTML = City["NOM"];
                    document.getElementById("City_" + i + "_Cases").innerHTML = City["cas_confir"];
                }
            }
        }
    })
}