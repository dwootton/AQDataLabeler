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
    this.grabModelDataForEntireRange();
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
  async grabAllModelDataOld(time) {
    /* Sets up time interval to grab model data from */
    let start = time.toISOString().slice(0, -5) + "Z";
    let closestStartDate = new Date(time);
    closestStartDate.setMinutes(time.getMinutes() + 5);
    let stop = closestStartDate.toISOString().slice(0, -5) + "Z";

    let url = "https://air.eng.utah.edu/dbapi/api/getGridEstimates?start=" + start + "&end=" + stop;

    /* Obtains model grid estimates and re-render map view */
    let modelReq = fetch(url).then((response) => {
      return response.text();
    }).then((values) => {
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
    if (modelData.data) {
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
    let options = {
      tolerance: .001,
      highQuality: true
    };

    let simpl = turf.simplify(geojson, options);

    let stopDate = new Date();
    let stopStamp = stopDate.getTime()
    console.log("d3 contour time: ", (stopStamp - startStamp))
    return simpl;
  }

  /**
   * Gets all of the data values for the heatmap and updates view.
   * @param  {[type]}  time [description]
   * @return {Promise}      [description]
   */
  async grabModelDataForEntireRange() {
    /* Sets up time interval to grab model data from */

    let promises =[];
    for (let i = 0; i < window.controller.map.times.length; i++) {
      console.log(window.controller.map.times);
      let time = new Date(window.controller.map.times[i]);
      console.log(time);
      let start = time.toISOString().slice(0, -5) + "Z";
      let closestStartDate = new Date(time);
      closestStartDate.setMinutes(time.getMinutes() + 5);
      let stop = closestStartDate.toISOString().slice(0, -5) + "Z";

      let url = "https://air.eng.utah.edu/dbapi/api/getGridEstimates?start=" + start + "&end=" + stop;

      console.log(url);
      promises[i] = fetch(url).then(function(response) {
        return response.text();
      }).catch((err) => {
        console.log(err);
      });
    }
    Promise.all(promises.map(p => p.catch(() => undefined)))

    Promise.all(promises).then(values => {
        this.correlations = [];
        let index = 0;
        let organizedModelDataCollection = [];
        values.forEach(value => {
          console.log(value);

          let parsedModelData = JSON.parse(value);
          console.log(parsedModelData);

          parsedModelData.shift();
          let unpushed = true;
          parsedModelData.forEach((element) => {
            let date = Object.keys(element);
            if(unpushed){
              organizedModelDataCollection.push({
                time: new Date(date),
                data: element[date].pm25
              })
              unpushed = false;
              if (index > 0) {
                let corr = pearsonCorrelation(organizedModelDataCollection[index], organizedModelDataCollection[index - 1]);
                this.correlations.push(1-corr);
              }

              index++;
            }

          })
          //window.controller.slider.changeData(this.correlations);

          this.entireModelData = organizedModelDataCollection;
          this.contours = [];
        })


      })
    }
      /*this.entireModelData.forEach((modelSlice)=>{
        console.log(modelSlice)
        let contour = this.computeContours(modelSlice);
        console.log(contour);
        this.contours.push({
          contour:contour,
          time:modelSlice.time
        })
      })*/
      /*
      let parsedVals = [];
      for (let i = 0; i < values.length; i++) {
        let allModelData = JSON.parse(values[i])[1]; //Note: Currently broken?
        console.log(allModelData);
        // get the latest model view
        for (time in allModelData) {
          this.allModelData = allModelData[time].pm25;
        }
        parsedVals.push(this.allModelData);
      }
      this.entireModelData = parsedVals;
      console.log(len(this.entireModelData));
    }
    /*
    let timeStart = new Date();

    /* Obtains model grid estimates and re-render map view */

grabAllModelData(index) {
  /*let requestedTime = new Date(time).getTime(); */

  let slice = this.entireModelData[index];
  this.allModelData = slice;
  this.updateModelView();
}



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
function closestTime(arr, x) {
  //sensor.pm25.findIndex((element)=>{
  //return new Date(element.time).getTime()
  x = x.getTime();
  /* lb is the lower bound and ub the upper bound defining a subarray or arr. */
  var lb = 0,
    ub = arr.length - 1;
  /* We loop as long as x is in inside our subarray and the length of our subarray is greater than 0 (lb < ub). */
  while (ub - lb > 1) {
    var m = parseInt((ub - lb + 1) / 2); // The middle value
    /* Depending on the middle value of our subarray, we update the bound. */
    if (new Date(arr[lb + m].time).getTime() > x) {
      ub = lb + m;
    } else if (new Date(arr[lb + m].time).getTime() < x) {
      lb = lb + m;
    } else {
      ub = lb + m;
      lb = lb + m;
    }
  }
  /* After the loop, we know that the closest value is either the one at the lower or upper bound (may be the same if x is in arr). */
  var clst = lb;
  if (Math.abs(arr[lb] - x) > Math.abs(arr[ub] - x)) {
    clst = ub;
  }
  return clst; // If you want the value instead of the index, return arr[clst]
}


function pearsonCorrelation(independent, dependent) {
  // covariance
  independent = independent.data;
  dependent = dependent.data;
  console.log(independent);
  console.log(dependent);
  let independent_mean = arithmeticMean(independent);
  let dependent_mean = arithmeticMean(dependent);
  console.log(independent_mean,dependent_mean);
  let products_mean = meanOfProducts(independent, dependent);
  let covariance = products_mean - (independent_mean * dependent_mean);

  // standard deviations of independent values
  let independent_standard_deviation = standardDeviation(independent);

  // standard deviations of dependent values
  let dependent_standard_deviation = standardDeviation(dependent);

  // Pearson Correlation Coefficient
  let rho = covariance / (independent_standard_deviation * dependent_standard_deviation);

  return rho;
}


function arithmeticMean(data) {
  let total = 0;

  // note that incrementing total is done within the for loop
  for (let i = 0, l = data.length; i < l; total += data[i], i++);

  return total / data.length;
}


function meanOfProducts(data1, data2) {
  let total = 0;

  // note that incrementing total is done within the for loop
  for (let i = 0, l = data1.length; i < l; total += (data1[i] * data2[i]), i++);

  return total / data1.length;
}


function standardDeviation(data) {
  let squares = [];

  for (let i = 0, l = data.length; i < l; i++) {
    squares[i] = Math.pow(data[i], 2);
  }

  let mean_of_squares = arithmeticMean(squares);
  let mean = arithmeticMean(data);
  let square_of_mean = Math.pow(mean, 2);
  let variance = mean_of_squares - square_of_mean;
  let std_dev = Math.sqrt(variance);

  return std_dev;
}
