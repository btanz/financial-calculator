app.charts = function(chartdata, containerSelector){

  /** add chartist autoscale function if x-axis should not be a standard step axis */
  chartdata.autoscaleAxisX ? chartdata.options.axisX.type =  Chartist.AutoScaleAxis : null;

  /** compile template and add chart */
  app.helpers.compileTemplate(containerSelector, '#main-results-chart-template', chartdata);
  new Chartist[chartdata.type]('#'+chartdata.id, chartdata.data, chartdata.options, chartdata.responsiveoptions);


};