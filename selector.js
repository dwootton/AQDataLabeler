/**
 * @file Selector
 * @author Dylan Wootton <me@dylanwootton.com>
 * @version 0.2
 */

class Selector {
  /**
   * Creates a selector object
   *
   */
  constructor() {
  }



  /*
  convertToSensorList(values){
    this.sensorList = sensors;
  } */

  /**
   * Gets all of the data values for the heatmap and updates view.
   * @param  {[type]}  time [description]
   * @return {Promise}      [description]
   */
  async grabModelDataForEntireRange() {
    /* Sets up time interval to grab model data from */
    let start = window.controller.startDate.toISOString().slice(0, -5) + "Z";
    let stop = window.controller.endDate.toISOString().slice(0, -5) + "Z";

    let url = "https://air.eng.utah.edu/dbapi/api/getGridEstimates?start=" + start + "&end=" + stop;
    console.log(url);
    let timeStart = new Date();
    /* Obtains model grid estimates and re-render map view */
    let modelReq = fetch(url).then( (response)=> {
      return response.text();
    }).then( (values) => {
      /* If there is a more recent selection */

      /*if(window.controller.selectedDate != time){
        return;
      } */
      this.averagedPM25 = [];
      console.log(values);
      let organizedModelDataCollection = [];
      let parsedModelData = JSON.parse(values);
      console.log(parsedModelData)

      parsedModelData.shift();
      parsedModelData.forEach( (element) => {
        console.log(element);
        let date = Object.keys(element);
        console.log(date);

        console.log(element[0]);
        organizedModelDataCollection.push({
          time: new Date(date),
          data: element[date].pm25
        })
        this.averagedPM25.push(element[date].pm25.reduce((p,c,_,a) => p + c/a.length,0))

      })
      console.log(this.averagedPM25)
      window.controller.slider.changeData(this.averagedPM25);
      console.log(organizedModelDataCollection);

      this.entireModelData = organizedModelDataCollection;
      this.contours = [];
      this.entireModelData.forEach((modelSlice)=>{
        console.log(modelSlice)
        let contour = this.computeContours(modelSlice);
        console.log(contour);
        this.contours.push({
          contour:contour,
          time:modelSlice.time
        })
      })
      console.log(this.contours);
      console.log(this.entireModelData)
      let timeStop = new Date();
      console.log(timeStop.getTime()-timeStart.getTime());
      document.getElementById("overlay").style.display = "none";
      /*for (time in allModelData) {
        this.entireModelData = allModelData[time].pm25;
      }
      this.updateModelView(); */

      // After all done:

    })
  }

  /**
   * Gets all of the data values for the heatmap and updates view.
   * @param  {[type]}  time [description]
   * @return {Promise}      [description]
   */
  async grabAllModelDataOld(time) {
    /* Sets up time interval to grab model data from */
    let start = time.toISOString().slice(0, -5) + "Z";
    let closestStartDate = new Date(time);
    closestStartDate.setMinutes(time.getMinutes() + 5);
    let stop = closestStartDate.toISOString().slice(0, -5) + "Z";

    let url = "https://air.eng.utah.edu/dbapi/api/getGridEstimates?start=" + start + "&end=" + stop;

    /* Obtains model grid estimates and re-render map view */
    let modelReq = fetch(url).then( (response)=> {
      return response.text();
    }).then( (values) => {
      /* If there is a more recent selection */

      let allModelData = JSON.parse(values)[1]; //Note: Currently broken?
      console.log(allModelData);
      for (time in allModelData) {
        this.allModelData = allModelData[time].pm25;
      }
      this.updateModelView();
    })
  }

  /**
   * Updates model heatmap
   */
  updateModelView() {
    window.controller.map.updateModel(this.allModelData);
  }

  /**
   * Updates model heatmap
   */
  updateModelContourView() {
    window.controller.map.updateModelContour(this.allModelContour);

  }


  computeContours(modelData) {
    if(modelData.data){
      modelData = modelData.data;
    }

    this.modelData = modelData;

    // MODEL CODE:
    let startDate = new Date();
    let startStamp = startDate.getTime()
    let polygons = d3.contours()
      .size([36, 49])
      .thresholds(d3.range(0, d3.max(modelData), 1))
      (modelData);


    var geojson = {
      type: 'FeatureCollection',
      features: []
    };

    for (let polygon of polygons) {
      if (polygon.coordinates.length === 0) continue;
      let coords = convertCoords(polygon.coordinates);

      geojson.features.push({
        type: 'Feature',
        properties: {
          value: polygon.value
        },
        geometry: {
          type: polygon.type,
          coordinates: coords
        }
      })
    }

    function convertCoords(coords) {
      // NOTE: Work through flipping coordiantes
      var maxLng = -111.713403000000;
      var minLng = -112.001349000000;
      var minLat = 40.810475;
      var maxLat = 40.59885;

      var result = [];
      for (let poly of coords) {
        var newPoly = [];
        for (let ring of poly) {
          if (ring.length < 4) continue;
          var newRing = [];
          for (let p of ring) {
            newRing.push([
              minLng + (maxLng - minLng) * (p[0] / 36),
              maxLat - (maxLat - minLat) * (p[1] / 49)
            ]);
          }
          newPoly.push(newRing);
        }
        result.push(newPoly);
      }
      return result;
    }
    let options = {tolerance: .001, highQuality: true};

    let simpl = turf.simplify(geojson, options);

    let stopDate = new Date();
    let stopStamp = stopDate.getTime()
    console.log("d3 contour time: ", (stopStamp - startStamp))
    return simpl;
  }

  /**
   * Updates sensor view on map
   */
  updateSensorView() {
    window.controller.allSensorsData = this.allSensorsData;
    this.dataMap.updateSensor(this.allSensorsData)
  }

  setSensorSource(source){
    this.sensorSource = source;
    //this.populateSensorList();
    if(this.rendered){
      this.grabAllSensorData(window.controller.selectedDate);
    }
  }

  /**
   * [setSelectedDate description]
   * @param {[type]} selectedDate A datetime object
   * @param {[type]} caller       [description]
   */
  setSelectedDate(selectedDate,caller){
    if(!this.getAllData){
      return;
    }
    console.log(selectedDate,caller);
    window.controller.selectedDate = selectedDate;
    if(caller == "timeChart"){
      console.log(window.controller.slider.slider);
      window.controller.slider.slider.value(selectedDate);
    } else {
      try{
        window.controller.timeChart.updateSlider(selectedDate);
      }
      catch(error){
        console.log(error);
      }
    }
  }
  /**
   * [setSelectedDate description]
   * @param {[type]} selectedDate A datetime object
   * @param {[type]} caller       [description]

  setSelectedDate(selectedDate){
    window.controller.selectedDate = selectedDate;
    window.controller.slider.slider.value(selectedDate);
    try{
      window.controller.timeChart.updateSlider(selectedDate);
    }
    catch(error){
      console.error(error);
    }
  }*/
}

/**
 * Formats date time object into day month year string.
 * @param  {[type]} date date time to be converted to string
 * @return {[type]}      string in order day month year
 */
function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

/**
 * Performs a binary search on the array using the given accessor and returns the index
 * corresponding to the closest time in the array. Note: Requires a sorted array.
 * @param  {[type]} arr [description]
 * @param  {[type]} x   [description]
 * @return {[type]}     [description]
 */
function closestTime (arr, x) {
    //sensor.pm25.findIndex((element)=>{
    //return new Date(element.time).getTime()
    x = x.getTime();
    /* lb is the lower bound and ub the upper bound defining a subarray or arr. */
    var lb = 0,
        ub = arr.length - 1 ;
    /* We loop as long as x is in inside our subarray and the length of our subarray is greater than 0 (lb < ub). */
    while (ub - lb > 1) {
        var m = parseInt((ub - lb + 1) / 2) ; // The middle value
        /* Depending on the middle value of our subarray, we update the bound. */
        if (new Date(arr[lb + m].time).getTime() > x) {
            ub = lb + m ;
        }
        else if (new Date(arr[lb + m].time).getTime() < x) {
            lb = lb + m ;
        }
        else {
            ub = lb + m ; lb = lb + m ;
        }
    }
    /* After the loop, we know that the closest value is either the one at the lower or upper bound (may be the same if x is in arr). */
    var clst = lb ;
    if (Math.abs(arr[lb] - x) > Math.abs(arr[ub] - x)) {
        clst = ub ;
    }
    return clst ; // If you want the value instead of the index, return arr[clst]
}
