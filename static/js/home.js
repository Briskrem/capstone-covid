 $(document).ready(removeMessage)
 
 $('.toggle-button').on('click', function(e){
     $('.nav-links').toggleClass('active')
     $('header').toggleClass('active')
    
     if($('header').hasClass('active')){
         console.log('added')
         window.addEventListener('scroll', noScroll)
     }else{
         console.log('removed')
         window.removeEventListener('scroll', noScroll)
     }
 })
 function noScroll(){
    window.scrollTo(0,0)
}

function loadMap(){
    $.ajax({
        url:'https://api.covidactnow.org/v2/states.json?apiKey=aed6be26a1674a1994ccbc0ff0d76224',

        success: function(data){
            var infectedData = {};
            var stateDeaths = {}
            for(var i=0; i< data.length; i++){
                var element= data[i];
                var state = `US-${element.state}`;
                var cases = element.actuals.cases;
                var deaths = element.actuals.deaths
                infectedData[state] = cases;
                stateDeaths[state] = deaths
            }       
            
            $('.mapcontainer').vectorMap({
                map: 'us_lcc',
                series: {
                regions: [{
                    values: infectedData,
                    scale: ['#C8EEFF', '#FFD700'],
                    normalizeFunction: 'polynomial'
                }]
                },
                onRegionTipShow: function(e, el, code){
                    var html = "";
                    html += "<br/>Cases: " + infectedData[code];
                    html += "<br/>Deaths: " + stateDeaths[code];
                    el.html(el.html()+ html);
                    
                }
            });
        }                     
    })
}

loadMap();

// Store the response in 'data' instead of making an api call for each hover. Much faster!
let data;
function changeStatText(obj){
    if(data){
        changeStatText2(obj, data)
    }else{
        $.ajax({
            url:'/us/aggregate',
            success: function(bigData){
                data = bigData
                console.log(data.annotations.deaths.sources)                
                changeStatText2(obj, data)
            }
        })
    }
}

function changeStatText2(obj, data){
    if (obj.className === 'list1'){
        $('.imgBox-title').text('ICU BEDS')
        $('.li-1').text(`ICU bed capacity:  ${data.actuals.icuBeds.capacity}`)
        $('.li-2').text(`ICU beds beings used for covid:  ${data.actuals.icuBeds.currentUsageCovid}`)
        $('.li-3').text(`ICU beds being used in total:  ${data.actuals.icuBeds.currentUsageTotal}`)
        $('.imgBox').css("background-image", "url(/static/pics/beds.jpg)")
    }
    if (obj.className === 'list2'){
        $('.imgBox-title').text('CONTACT TRACERS')
        $('.li-1').text(`Total US cases:  ${data.actuals.cases}`)
        $('.li-2').text(`Total US contact tracers:  ${data.actuals.contactTracers}`)
        $('.li-3').text(`Total US deaths:  ${data.actuals.deaths}`)
        $('.imgBox').css("background-image", "url(/static/pics/diversity.jpg)")
    }
    if (obj.className === 'list3'){
        $('.imgBox-title').text('VACCINATIONS')
        $('.li-1').text(`Distributed vaccines:  ${data.actuals.vaccinesDistributed}`)
        $('.li-2').text(`Administered vaccines:  ${data.actuals.vaccinationsCompleted}`)
        $('.li-3').text(`Initiated vaccines:  ${data.actuals.vaccinationsInitiated}`)
        $('.imgBox').css("background-image", "url(/static/pics/vaxxx.png)")
    }

}

function removeMessage(){
    setTimeout(function() {
        console.log('metoo')
        $('.flash-welcome').fadeOut('fast')
    }, 3000)
}