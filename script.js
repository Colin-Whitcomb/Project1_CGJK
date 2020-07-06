// All the variables and jQuery DOM pointers can be assigned here
var superheroName;
var superhero_src;
var score = 10;
var firstLocName = [];
var secondLocName = [];
var tipsArr = ["By just moderately pushing your skateboard you will burn around 400 calories an hour, 800 calories if you skate aggressively.",
    "Keep your fast-food meals around 500 calories or fewer.  Avoid french fries and onion rings. Choose a side salad with light dressing and you will level up the health quality of your meal.",
    "Grilled chicken or steak are usually your best option on the menu at most fast-food places.",
    "Do you know about the secret menu at In-N-Out? Order your burger 'Protein Style' with lettuce in lieu of the bun and you will seriously lower your calories and carbs.",
    "Experts recommend that teens do 60 minutes or more of physical activity every day. Walking counts!",
    "Riding your bike for 20 minutes will burn 150 to 250 calories!"
]
var selectedMoveMode = "";
var heroesObj = {
    "Black Widow": "Assets/images/av-img-black-widow-cropped.jpg",
    "Iron Man": "Assets/images/av-img-iron-man.jpg",
    "Miles Morales": "Assets/images/av-img-miles-morales.jpg",
    "Ms. Marvel": "Assets/images/av-img-msmarvel.jpg",
    "Black Panther": "Assets/images/av-img-black-panther.jpg",
}

function random_tip() {
    return tipsArr[Math.floor(Math.random() * tipsArr.length)]
};

function screen_switcher(id) {
    var main_divs = $('main');
    var mainDiv;

    for (var i = 0; i < main_divs.length; i++) {
        mainDiv = $(main_divs[i]);

        if (mainDiv.attr('id') === id) {
            mainDiv.show();
        } else {
            mainDiv.hide();
        }
    }
}


// SEGMENT 1: USER INITIALIZATION

// This initialiation sequence will assess whether or not the user is new or returning


function display_UI() {

    $('#user-interface').show();
}

function display_user_info() {
    $("#greeting").text("Hello " + localStorage.getItem("userCharacter"));
    $("#profile-greeting").text(localStorage.getItem("userCharacter"));
    $("#profile-details").text("Points: " + localStorage.getItem("userScore"));
    console.log(heroesObj[localStorage.getItem('userCharacter')])
    $("#profile-img").attr('src', heroesObj[localStorage.getItem('userCharacter')])
    console.log($("#profile-img").attr('src'))
}

function setUp() {

    if (localStorage.getItem('userCharacter') === null) {
        screen_switcher('new-user');
        $('#user-interface').hide()
        $('.card').on("click", function () {
            localStorage.setItem('userCharacter', $(this).attr('id'));
            localStorage.setItem('userScore', 0);
            $('#user-interface').show();
            screen_switcher('initial-prompt');
            display_user_info()

        })

    } else {
        display_UI()
        screen_switcher('initial-prompt')
        display_user_info()
    }


    var goBtn = $('#btn-go');
    goBtn.on('click', function () {
        screen_switcher('activity');
        $('#sideBar').addClass('hide-on-small-only');
    });

    var transpoSubmit = $('#transpo-submitBtn')
    transpoSubmit.on("click", function (event) {
        for (const mode of $('.transpo')) {
            if (mode.checked) {
                selectedMoveMode = mode.getAttribute('id');
            };
        };

        if (selectedMoveMode) {
            screen_switcher('address-input');
        } else {
            $('#activity-invalid').show();
            setTimeout(function () {
                $('#activity-invalid').hide()
            }, 2000)
        }



    })

    var submitBtn = $('#submitBtn')

    submitBtn.on('click', function (event) {
        event.preventDefault();
        var startPointObj = getStartValues();
        var endPointObj = getEndValues();

        if (startPointObj.startNum && startPointObj.startName && startPointObj.startCity && endPointObj.endNum && endPointObj.endName && endPointObj.endCity) {

            console.log("PointA :" + JSON.stringify(startPointObj) + "PointB :" + JSON.stringify(endPointObj))
            var firstLoc = startPointObj.startLocName;
            console.log(firstLoc);
            var secondLoc = endPointObj.endLocName;
            firstLocName.push(firstLoc);
            secondLocName.push(secondLoc);
            console.log("firstLocName = " + firstLocName);
            console.log("secondLocName = " + secondLocName);
            doubleAddressRoute(startPointObj, endPointObj);
        }
        else {
            $('#address-invalid').show();
            setTimeout(function () {
                $('#address-invalid').hide()
            }, 2000)
        }

    });

    $('#badgeOne').on('click', function (event) {
        window.open('About.html');

    })

    $('#badgeTwo').on('click', function (event) {
        window.open('Links.html');

    })
    $('#badgeThree').on('click', function (event) {
        location.reload();

    })

    $('.badges').mouseover(function () {
        $('#hover').text($(this).attr("data-link"));
        $('#hover').show();
    })

    $('.badges').mouseout(function () { $('#hover').hide() });

    $('#btn-eat').on("click", function () {
        screen_switcher('activity2');
        $('#sideBar').addClass('hide-on-small-only');
    })

    $('#home-from-food').on("click", function () {
        location.reload();
    })

    var transpoSubmit2 = $('#transpo-submitBtn2')
    transpoSubmit2.on("click", function (event) {
        for (const mode of $('.transpo2')) {
            if (mode.checked) {
                selectedMoveMode = mode.getAttribute('id');
            };
        };
        if (selectedMoveMode) {
            screen_switcher('eat-div');
        } else {
            $('#activity2-invalid').show();
            setTimeout(function () {
                $('#activity2-invalid').hide()
            }, 2000)
        }
    })

    $('#meal-submit').on("click", function (event) {
        event.preventDefault();
        var street_num = $('#startNumber2').val();
        var street_name = $('#startStreet2').val();
        var city = $('#startCity2').val();

        if (street_num && street_name && city) {

            var address = {
                locStreetNumber: street_num,
                locStreetName: street_name,
                locCity: city
            }
            find_restaurants(address)
        } else {
            $('#meal-invalid').show();
            setTimeout(function () {
                $('#meal-invalid').hide()
            }, 2000)
        }
    })

    $('#btn-home').on("click", function () {
        location.reload();
    })
}


function getStartValues() {
    var startPointObj;
    startLocName = $('#startLocName').val()
    startLocNum = $('#startNum').val();
    startName = $('#startName').val();
    startCity = $('#startCity').val();

    startPointObj = {
        startLocName: startLocName,
        startNum: startLocNum,
        startName: startName,
        startCity: startCity,
    };
    return startPointObj;
}

function getScore() {
    return parseInt(localStorage.getItem('userScore'));
}

function setScore(current_score) {
    localStorage.setItem("userScore", current_score)
}

function updateScore(new_points) {
    var current_score = getScore();
    current_score += parseFloat(new_points);
    setScore(current_score)
    $('#profile-details').text('Points: ' + current_score)
}

function getEndValues() {
    var endPointObj, endLocName, endAddress, endCity, endState, endZip;
    endLocName = $('#endLocName').val();
    endNum = $('#endNum').val();
    endName = $('#endName').val();
    endCity = $('#endCity').val();

    endPointObj = {
        endLocName: endLocName,
        endNum: endNum,
        endName: endName,
        endCity: endCity,
    }
    return endPointObj;
};


function confirm_choice(name, points) {
    screen_switcher('food-choice-confirm');
    $('#restaurant-confirm').text('For your choice to ' + selectedMoveMode + ' to ' + name + ', here are ' + points + ' points!');
    updateScore(points);
}


function scoreCalculator(distance) {
    var totalScore;

    if (selectedMoveMode === "walk") {
        totalScore = (distance * 10).toFixed();
    } else if (selectedMoveMode === "run") {
        totalScore = (distance * 30).toFixed();
    } else if (selectedMoveMode === "skateboard") {
        totalScore = (distance * 15).toFixed();
    } else if (selectedMoveMode === "bike") {
        totalScore = (distance * 25).toFixed();
    }

    return totalScore

}

function find_restaurants(address_object) {

    var street_num = address_object.locStreetNumber;
    var street_name = address_object.locStreetName;
    var city = address_object.locCity;

    var current_loc_url = 'https://api.tomtom.com/search/2/structuredGeocode.JSON?key=L7UIPFqhhWosaSn7oAMjfGZGsRJ9EnPU&countryCode=US&streetNumber=' + street_num + '&streetName=' + street_name + '&municipality=' + city

    $.ajax({
        url: current_loc_url,
        method: 'GET'
    }).then(function (response) {
        var current_lat = response.results[0].position.lat;
        var current_lon = response.results[0].position.lon;

        let zomato_url = 'https://developers.zomato.com/api/v2.1/search?q=Healthy&lat=' + current_lat + '&lon=' + current_lon + '&radius=8050&count=10'

        $.ajax({
            url: zomato_url,
            method: 'GET',
            headers: {
                'X-Zomato-API-Key': '1dc29c917607ec14f7f9f5309c721b3c'
            }
        }).then(function (response) {
            console.log(response)
            var tableData = []
            var index = 1;
            var array = response.restaurants
            for (const place of response.restaurants) {

               
                var restaurant_lat = place.restaurant.location.latitude;
                var restaurant_lon = place.restaurant.location.longitude;
                var openroute_url = 'https://api.openrouteservice.org/v2/directions/foot-walking?api_key=5b3ce3597851110001cf6248664ece6aa70a4c7dbf8aa68951f471c3&start=' + current_lon + ',' + current_lat + '&end=' + restaurant_lon + ',' + restaurant_lat

                $.ajax({
                    url: openroute_url,
                    method: 'GET'
                }).then(function (response) {
                    var distance_to = response.features[0].properties.summary.distance / 1609;
                    var points = scoreCalculator(distance_to)
                    tableData.push({
                        id: index,
                        name: place.restaurant.name,
                        address: place.restaurant.location.address,
                        score: points
                    })
                    index += 1

                    if (index >= array.length) {
                        screen_switcher('food-choices')
                        var header = $('<h4>');
                        var tip = $('<h6>')
                        header.attr("style", "text-align: center; font-weight: bold")
                        header.text('Choose a restaurant to ' + selectedMoveMode + ' to and earn points!')
                        tip.attr('id', 'tip')
                        tip.text("Tip: " + random_tip())
                        tip.addClass("hide-on-small-only")


                            ;

                        var table = new Tabulator("#food-choices", {
                            data: tableData,
                            layout: "fitColumns",
                            columns: [{
                                title: "Name",
                                field: "name",
                                headerSort: false
                            },
                            {
                                title: "Address",
                                field: "address",
                                headerSort: false
                            },
                            {
                                title: "Score",
                                field: "score",
                                sorter: "number"
                            },
                            ],
                            rowClick: function (e, row) {
                                let points = row.getData().score;
                                let name = row.getData().name;
                                confirm_choice(name, points)
                            },
                        });
                        table.redraw(true)
                        $('#food-choices').prepend(header)
                        $('#food-choices').prepend(tip)
                    }
                })
            };
        })
    })
};


function doubleAddressRoute(addressObj1, addressObj2) {

    var streetNumber1 = addressObj1.startNum;
    var streetName1 = addressObj1.startName;
    var city1 = addressObj1.startCity;

    var cordA = '';
    var cordB = '';

    $.ajax({
        url: 'https://api.tomtom.com/search/2/structuredGeocode.JSON?key=L7UIPFqhhWosaSn7oAMjfGZGsRJ9EnPU&countryCode=US&streetNumber=' + streetNumber1 + '&streetName=' + streetName1 + '&municipality=' + city1,
        method: 'GET'
    }).then(function (responseOne) {

        //  Geo-Cordinates from first TomTom call
        cordA = responseOne.results[0].position.lon + "," + responseOne.results[0].position.lat;

        var streetNumber2 = addressObj2.endNum;
        var streetName2 = addressObj2.endName;
        var city2 = addressObj2.endCity;

        $.ajax({
            url: 'https://api.tomtom.com/search/2/structuredGeocode.JSON?key=L7UIPFqhhWosaSn7oAMjfGZGsRJ9EnPU&countryCode=US&streetNumber=' + streetNumber2 + '&streetName=' + streetName2 + '&municipality=' + city2,
            method: 'GET'

        }).then(function (responseTwo) {

            //  Geo-Cordinates from first TomTom call
            cordB = responseTwo.results[0].position.lon + "," + responseTwo.results[0].position.lat;

            // Calling openRoute API
            openRouteNF();

            // Taking mode of travel response from user & Jen
            function openRouteNF() {

                // determining which route to take
                if (((selectedMoveMode === "walk") || (selectedMoveMode === "run"))) {
                    var queryUrl = "https://api.openrouteservice.org/v2/directions/foot-walking?api_key=5b3ce3597851110001cf6248664ece6aa70a4c7dbf8aa68951f471c3&start=" + cordA + "&end=" + cordB;

                } else {
                    var queryUrl = "https://api.openrouteservice.org/v2/directions/cycling-regular?api_key=5b3ce3597851110001cf6248664ece6aa70a4c7dbf8aa68951f471c3&start=" + cordA + "&end=" + cordB;

                };
                $.ajax({
                    // Longitude comes first, then latitude, in each query url
                    url: queryUrl,
                    method: 'GET'
                }).then(function (responseB) {

                    console.log("Colin's Obj:");
                    console.log(responseB);


                    // Takes distance in meters and converts it to miles
                    var distanceMeters = responseB.features[0].properties.summary.distance;
                    var distanceMiles = distanceMeters / 1609;
                    // Makes number spit out two decimal places 
                    var finalDistance = distanceMiles.toFixed(2);
                    // Outputs miles

                    // Tracks how long it will take ( - might not be super accurate though -)
                    var totalTime = ((responseB.features[0].properties.summary.duration) / 60).toFixed();

                    $('#confirmation').text("Total distance walked " + finalDistance + " miles");
                    scoreGenerator(finalDistance);
                    // score = finalDistance;

                    // Create generate score function here?
                    // Test 1

                })
            }
        })
    })
};

// Points per mile - Score function
function scoreGenerator(totalDistance) {
    if (selectedMoveMode === "walk") {
        var totalScore = (totalDistance * 10).toFixed();
        console.log(totalScore);
    }
    if (selectedMoveMode === "run") {
        var totalScore = (totalDistance * 30).toFixed();
        console.log(totalScore);
    }
    if (selectedMoveMode === "skateboard") {
        var totalScore = (totalDistance * 15).toFixed();
        console.log(totalScore);
    }
    if (selectedMoveMode === "bike") {
        var totalScore = (totalDistance * 25).toFixed();
        console.log(totalScore);
    }
    confirmationPage(totalDistance, totalScore);
}

// Confirm page 
function confirmationPage(finalDistance, totalScore) {

    $('#startingLoc').text("Starting location: " + firstLocName);
    $('#endingLoc').text("Ending location: " + secondLocName);
    $('#totalDistance').text("Total Distance: " + finalDistance);
    $('#pointsEarned').text("Total points from this route: " + totalScore);
    // $('#confirmMessage1').text("Awesome! If you " + selectedMoveMode + " " + finalDistance + " miles, you will earn " + totalScore + " points!");
    updateScore(totalScore);
    $('#confirmMessage2').text("Since starting project Miles, you have earned " + getScore() + " points!");
    // localStorage.setItem('user score', )
    screen_switcher('confirmationPage');
};

$(document).ready(function () {
    // buildHeroCards();
    setUp();

});