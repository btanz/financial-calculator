app.charts.boerse.portfolio = function(chartData, containerSelector){

  /** extend the passed object with custom options */


  chartData.options = {
    axisX: {
      type: Chartist.AutoScaleAxis,
      scaleMinSpace: 60,
      //divisor: 8,
      labelInterpolationFnc: function(value) {
        return moment(value).format('MM.YYYY');
      },
      labelOffset: {
        x: -40,
        y: 0
      }
    },
    axisY: {
      onlyInteger: true,
      low: 0
    },
    series: {
      optimalPortfolio: {
        lineSmooth: false,
        showPoint: false
      },
      equalweightedPortfolio: {
        lineSmooth: false,
        showPoint: false
      }
    }
  };


  /** compile template and add chart */
  app.helpers.compileTemplate(containerSelector, '#main-results-chart-template', chartData);
  new Chartist[chartData.type]('#'+chartData.id, chartData.data, chartData.options);


};