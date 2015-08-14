/**
 * Returns an app.charts.create method and is the entry point for the chart API using chartist.js
 *
 * * Short documentation of the chart API *
 *
 * The key data element for this API is the chartData object, which usually is passed from the backend. This data
 * object has the following properties/methods
 *   - chartData.id       a chart id, usually chartX
 *   - chartData.title    title of the chart that is displayed on top of the created iBox template
 *   - chartData.type     the chartist.js charttype ['Line', 'Bar', 'Pie']
 *   - chartDate.label    labels shown on the x and y axis; example: {x: 'Zeit', y: "Portfoliowert (EUR)"}
 *   - chartData.legend   legend that is shown below the graph; example: ['Optimiertes Portfolio', 'Gleichgewichtetes Portfolio'];
 *   - chartData.data     the actual data object that contains the series
 *   - chartData.options  the options object; example: {axisX: {onlyInteger: true}, showPoint: false, lineSmooth: false};
 *   - chartData.autoscaleAxisX     boolean that indicates whether the x axis should be autoscaled
 *
 *   - chartData.specialChart       boolean that indicates whether chart should be created using the basic functions or whether a
 *                                  special file that constructs the chart is available
 *   - chartData.specialChartName   array that contains the namespace for the special chart construction file
 *                                  example: ['boerse','portfolio']
 *
 *
 * @type {{create, boerse}}
 */
app.charts = (function(){

  var create;

  /**
   * create
   *
   * Function that compiles a template and adds a chart
   *
   *
   * @param chartdata           The data object received from the backend, such as (resultObject)._chart1
   * @param containerSelector   Class name for the newly created template/container
   */
  create = function(chartData, containerSelector){

    /** check whether chart should be added with standard options or whether a special file is
     * available for creating the chart (a special file is usually needed for axis scaling functions
     * and the like)
     */
    if(chartData.specialChart === true){

      /** call function to create special chart */
      this[chartData.specialChartName[0]][chartData.specialChartName[1]](chartData, containerSelector);

    } else {

      /** add chartist autoscale function if x-axis should not be a standard step axis */
      chartData.autoscaleAxisX ? chartData.options.axisX.type =  Chartist.AutoScaleAxis : null;

      /** compile template and add chart */
      app.helpers.compileTemplate(containerSelector, '#main-results-chart-template', chartData);
      new Chartist[chartData.type]('#'+chartData.id, chartData.data, chartData.options, chartData.responsiveoptions);
    }
  };

  return {
    create: create,
    boerse: {}
  }


}());