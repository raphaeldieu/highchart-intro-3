$(document).ready(function(){

  var Chart = function(){
    this.series = [];
}


  Chart.prototype.getData = function(){
    $.ajax({
      context: this,
      type: "GET",
      url:"https://www.quandl.com/api/v1/datasets/BTS_MM/RETAILGAS.json?trim_start=1995-01-02&trim_end=2012-10-15&auth_token=E6kNzExHjay2DNP8pKvB",
      success: function(response){
        var items = response.data.sort();
        var dataX;
        var dataY;
         
         for (var i = 0; i < items.length; i++){
        dataX = new Date(items[i][0]);
        dataY = items[i][1];
        this.series.unshift({x: dataX, y: dataY});
      }
        this.drawChart();
      }
    })
  };

  Chart.prototype.calcSMA = function(data,rate){
    var date;
    var price;
    var movingAverage = [];

    for (var i = rate; i < data.length; i++){
      date = data[i].x;
      
      var totalPrice = 0;
      for (var j = 0; j < rate; j++){
        totalPrice += data[i-j].y/rate;
      }
      
      price = totalPrice;
      movingAverage.push({x: date, y: price});
    }

    return movingAverage;
  }

  Chart.prototype.drawChart = function(){
    var config = {
      title: {
        text: "Gasoline Prices"
      },
      xAxis: {
        title: "Date",
        type: "datetime"
      },
      yAxis: {
        title: {
          text:"Price in USD"
        }
      },
      series:
      [{
        name: 'Weekly',
        data: this.series
      },
      {
        name: 'Monthly',
        data: this.calcSMA(this.series,4)
      },
      {
        name: 'Quarterly',
        data: this.calcSMA(this.series,12)
      },
      {
        name: 'Yearly',
        data: this.calcSMA(this.series,52)
      }]
    }
    $('#chart').highcharts(config);
  };


var chart = new Chart();

chart.getData();

})