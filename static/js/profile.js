$('.chartBox').hide()

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

$('.sidebar-btn').on('click', function(e){
    e.preventDefault()

    // console.log(e.target.className)
    // if($(e.target.className=='sidebar-btnc')){
    //     window.addEventListener('scroll', noScroll)
    //     $('.sidebar-btn').toggleClass('sidebar-btnc');
    // }else{
    //     window.removeEventListener('scroll', noScroll)
    //     $('.sidebar-btn').toggleClass('sidebar-btnc');
    // }
    
    $('.sidebar').toggleClass('side')
    $('body').toggleClass('boody')
    // $('.sidebar').toggleClass('xx')
})

$('.view-saved-charts').on('click', async function(e){
    e.preventDefault()
    $('.chartBox').show()
    $('.loader').appendTo($('.chartBox'))
    myCharts = document.querySelectorAll('#myChart')
    myCharts1 = Array.from(myCharts)
    userCharts = await axios.get('/charts/user')

    for(let chart of userCharts.data){
        if(chart == userCharts.data[0]){
        createChart1(chart)
        $('.loader').remove()
        }
    }
})


function noScroll(){
    window.scrollTo(0,0)
}

function createChart1(obj){
    //setup block
    const data = {
        labels: [obj[0].state, obj[1].state, obj[2].state, obj[3].state, obj[4].state],
        datasets: [{
            label: '# of Votes',
            data: [obj[0].actuals.cases, obj[1].actuals.cases, obj[2].actuals.cases, obj[3].actuals.cases, obj[4].actuals.cases],
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 159, 64, 0.5)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    //config block
    const config = {
        type: 'pie',
        data,
        options: {}
    };
    
    //render block
    
    const myChart = new Chart(
        document.getElementById('myChart'),
        config
    )
}
