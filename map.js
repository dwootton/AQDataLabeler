class AQMap {

  constructor() {
    //OLD: this.colorRange = ['rgb(0,104,55,.2)', 'rgb(0,104,55,.5)', 'rgb(0,104,55)', 'rgb(26,152,80)', 'rgb(102,189,99)', 'rgb(166,217,106)', 'rgb(217,239,139)', 'rgb(255,255,191)', 'rgb(254,224,139)', 'rgb(253,174,97)', 'rgb(244,109,67)', 'rgb(215,48,39)', 'rgb(165,0,38)']; //['#a50026','#d73027','#f46d43','#fdae61','#fee08b','#ffffbf','#d9ef8b','#a6d96a','#66bd63','#1a9850','#006837'];
    //OLD: this.pm25Domain = [4, 8, 12, 20, 28, 35, 42, 49, 55, 150, 250, 350];
    //this.colorRange = ['rgba(0,104,55,.2)', 'rgba(254,237,222,1)', 'rgba(253,190,133,1)', 'rgba(253,141,60,1)', 'rgba(230,85,13,1)', 'rgba(166,54,3,1)', 'rgba(215,48,39,1)', 'rgba(165,0,38,1)']; //['#a50026','#d73027','#f46d43','#fdae61','#fee08b','#ffffbf','#d9ef8b','#a6d96a','#66bd63','#1a9850','#006837'];
    //this.pm25Domain = [0,12, 35, 42, 55, 150, 250];
    //this.colorRange = ['rgba(180,224,180,.1)', 'rgba(196, 186, 185,.5)', 'rgba(155,136,135,1)', 'rgba(116,89,88,1)', 'rgba(77,45,45,1)', 'rgba(215,48,39,1)']; //['#a50026','#d73027','#f46d43','#fdae61','#fee08b','#ffffbf','#d9ef8b','#a6d96a','#66bd63','#1a9850','#006837'];
    //this.pm25Domain = [0,12, 35, 55, 150, 250];
    this.colorRange = ['rgba(0,104,55,.2)', 'rgba(102,189,99,1)', 'rgba(255,239,139,1)', 'rgba(255,180,33,1)', 'rgba(253,174,97,1)', 'rgba(244,109,67,1)', 'rgba(215,48,39,1)', 'rgba(165,0,38,1)']; //['#a50026','#d73027','#f46d43','#fdae61','#fee08b','#ffffbf','#d9ef8b','#a6d96a','#66bd63','#1a9850','#006837'];
    this.pm25Domain = [0,4,12, 35, 55, 85,150, 250, 350];
  /*let lightGray = "rgba(240, 255, 240, 0.3)", //Option 1
        lightGreen = "rgba(219, 241, 215, 0.6)",
        lightYellow = "rgba(240, 240, 215,0.8)",
        mediumOrange = "rgba(245, 209, 161,0.9)",
        red = "rgba(212, 48, 48,0.9)",
        darkRed = "rgba(107, 5, 50,1.0)";
    /*this.colorRange = [d3.color(lightGray),d3.color(lightGreen),d3.color(lightYellow), d3.color(mediumOrange),d3.color(red),d3.color(darkRed)];
      this.pm25Domain = [0,12, 35, 55, 150, 250];
154	146	141
      [rgba(237,	225,	216,.3),rgba(154,146,141,.5),rgba(120,125,122,.9),rgba(126,98,77,0.9),rgba(79,75,72,0.9),rgba(54,25,58,0.9)]
79,75,72
    this.colorRange = [d3.color(lightGreen),d3.color(mediumOrange),d3.color(red),d3.color(darkRed)];
    this.pm25Domain = [0,50 ,120,200];*/
    //this.colorRange = ["rgba(237,	225,	216,.1)","rgba(154,146,141,.2)","rgba(120,125,122,.6)","rgba(126,98,77,0.9)","rgba(93,64,52,0.9)","rgba(93, 31, 52,0.9)","rgba(54,25,58,0.9)"];
    //this.pm25Domain = [0,12,33,55,105,155,250];
    window.controller.colorRange = this.colorRange;
    window.controller.pm25Domain = this.pm25Domain;

    /* For Sequential:
    this.colorMap = d3.scaleThreshold()
      .domain(this.pm25Domain)
      .range(this.colorRange);*/
    this.colorMap = d3.scaleLinear()
      .domain(this.pm25Domain)
      .range(this.colorRange);

    this.modelWidth = 36;
    this.modelHeight = 49;
    this.contours = null;

    this.shiftKeyPressed = false;

    window.onkeydown = (e) => {

      if(e.key == "y"){
        // label yes

      } else if(e.key == "n"){
        // label no
      } else if(e.key == "ArrowLeft"){
        // go back
        return;
      }
      window.controller.selector.grabAllModelDataOld()
    }

    let myStyles = [{
      "elementType": "geometry",
      "stylers": [{
        "color": "#f5f5f5"
      }]
    }, {
      "elementType": "labels.icon",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "elementType": "labels.text.fill",
      "stylers": [{
        "color": "#616161"
      }]
    }, {
      "elementType": "labels.text.stroke",
      "stylers": [{
        "color": "#f5f5f5"
      }]
    }, {
      "featureType": "administrative.land_parcel",
      "elementType": "labels",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [{
        "color": "#bdbdbd"
      }]
    }, {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [{
        "color": "#eeeeee"
      }]
    }, {
      "featureType": "poi",
      "elementType": "labels.text",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [{
        "color": "#757575"
      }]
    }, {
      "featureType": "poi.business",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [{
        "color": "#e5e5e5"
      }]
    }, {
      "featureType": "poi.park",
      "elementType": "labels.text",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [{
        "color": "#9e9e9e"
      }]
    }, {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{
        "color": "#ffffff"
      }]
    }, {
      "featureType": "road.arterial",
      "elementType": "labels",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [{
        "color": "#757575"
      }]
    }, {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{
        "color": "#dadada"
      }]
    }, {
      "featureType": "road.highway",
      "elementType": "labels",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [{
        "color": "#616161"
      }]
    }, {
      "featureType": "road.local",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "road.local",
      "elementType": "labels",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [{
        "color": "#9e9e9e"
      }]
    }, {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [{
        "color": "#e5e5e5"
      }]
    }, {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [{
        "color": "#eeeeee"
      }]
    }, {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{
        "color": "#c9c9c9"
      }]
    }, {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{
        "color": "#9e9e9e"
      }]
    }]

    this.myMap = new google.maps.Map(document.getElementById('map'), {
      zoom: 10.5,
      center: {
        lat: 40.69255337197885,
        lng: -111.86895401000976
      },
      styles: myStyles,
      streetViewControl: false,
      fullscreenControl: false

    });
    /* Create legend*/
    let legendColorMap = d3.scaleThreshold()
      .domain(this.pm25Domain.reverse())
      .range(this.colorRange.reverse());

    let colorLegend = d3.legendColor()
      .labelFormat(d3.format(".0f"))
      .cells(window.controller.pm25Domain)
      //.labels(d3.legendHelpers.thresholdLabels)
      .scale(this.colorMap)
      .shapePadding(2)
      .shapeWidth(50)
      .shapeHeight(20)
      .labelOffset(5)
      .ascending(true);


  }

  getDataAtTime(time){

      window.controller.selector.grabAllModelContour(time);

  }

  updateModelContour(contour){

    if (this.lastData) {

      this.myMap.data.forEach((feature) => {
        this.myMap.data.remove(feature);
      })

    }

    this.lastData = contour.contour;
    let that = this;
    let startDate = new Date();
    let startStamp = startDate.getTime()
    let imported = this.myMap.data.addGeoJson(contour.contour)
    if(imported != null){
      this.loadedTiles = true;
    }

    this.myMap.data.setStyle(styleContour);
    /*this.myMap.data.setStyle(function(feature) {
      var color = 'gray';
      var opacity = 0;
      let value = 10;
      if (feature.getProperty('value')) {
        value = feature.getProperty('value')+10;
        color = that.colorMap(feature.getProperty('value'));
        opacity = 0.6;
        console.log(value);
      }
      return /** @type {!google.maps.Data.StyleOptions}  ({{
        fillColor: color,
        strokeWeight: 0,
        fillOpacity: opacity,

      },zIndex: value);
    });*/
    function styleContour(feature) {
      var color = 'gray';
      var opacity = 0;
      let zIndex = 10;
      if (feature.getProperty('value')) {
        zIndex = feature.getProperty('value')*10+10;
        color = that.colorMap(feature.getProperty('value'));
        opacity = 0.6;
      }
       return {
              fillColor: color,
              strokeWeight: 0,
              fillOpacity: opacity,
              zIndex:zIndex
        };
    }
    let stopDate = new Date();
    let stopStamp = startDate.getTime()
    console.log("d3 contour time: ", (stopStamp - startStamp))



  }





  updateModel(modelData) {
    if(modelData.data){
      modelData = modelData.data;
    }

    this.modelData = modelData;

    //modelData = [8.964339902535034,15.595682501404061,16.57042698744204,18.19133816333678,11.611668095213714,11.565647168212108,9.916192521114132,6.541899730217069,7.052352588683608,7.501035178307062,12.019836906924501,16.98977615367748,14.43903630464879,18.41282496331842,11.333456684937138,9.348287548592062,14.489214074824726,6.790941527231953,7.815439492232705,8.135989384967434,13.852967147718985,17.47881501875145,17.602093468948997,18.830038387876115,16.222298703405457,11.069596451529595,12.860585717982625,5.843669206401813,6.430187999002033,8.673146088261356,14.552478042333625,17.200599865924136,21.489357944171832,20.283229563364984,22.151296051663245,12.974239563914061,10.456259349792571,9.093369517827368,8.655585226894358,9.608234030728035,14.663427790183809,15.271610089467535,19.424004390003876,19.44191061494021,20.92421296747697,15.638916349765802,9.75426986279476,12.976609675996558,11.121457884910457,10.471115502102577,14.966634341087122,15.06459586204938,19.77206699673942,16.27432872978454,21.08491498089317,18.887858898521586,11.711520640410228,10.284399004801326,10.85591700328193,10.676961765465006,15.418880386593878,17.324992752382588,20.867054510813166,13.975326921604745,20.773387078287815,21.984749565253274,15.453787202465993,15.829766955056902,13.49466080205513,10.41240450475944,15.238003806561725,15.702425998754974,19.789690539119942,17.16813636153775,23.63605745112857,24.109886934715696,21.57548452672802,20.333157196989834,16.441317860506214,13.19475038159874,14.422132334192963,13.80178996562388,14.180767016665985,18.971809169026482,24.201107603378983,25.317954340201148,25.655463931357115,22.65905392044519,19.313157803743675,17.18003245141215,12.696038236906523,13.763938609390353,12.647917754996156,19.517848958461776,24.30889143498016,25.726582171786102,26.038806451222484,24.10279485433458,21.681735071371676,20.208294359971237];

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

    if (this.lastData) {
      this.myMap.data.forEach((feature) => {
        this.myMap.data.remove(feature);
      })
    }

    this.lastData = geojson;
    let that = this;
    this.myMap.data.addGeoJson(geojson)
    this.myMap.data.setStyle(function(feature) {
      var color = 'gray';

      if (feature.getProperty('value')) {
        color = that.colorMap(feature.getProperty('value'));
      }
      return /** @type {!google.maps.Data.StyleOptions} */ ({
        fillColor: color,
        strokeWeight: 0,
        fillOpacity: 0.6,
        zIndex: 10
      });
    });

    let stopDate = new Date();
    let stopStamp = stopDate.getTime()

    console.log("d3 contour time: ", (stopStamp - startStamp))

    let labelsMapType = new google.maps.StyledMapType([{
      // Hide all map features by default
      stylers: [{
        visibility: 'off'
      }]
    }, {
      featureType: 'road.highway',
      stylers: [{
        visibility: 'on'
      }]
    }, {
      featureType: 'road.arterial',
      stylers: [{
        visibility: 'on',
        color: '#444444'
      }]
    }, {
      featureType: 'administrative',
      stylers: [{
        visibility: 'on'
      }]
    }, {
      "featureType": "road",
      "elementType": "labels",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "elementType": "geometry",
      "stylers": [{
        "color": "#f5f5f5"
      }]
    }], {
      name: 'Labels',
      id: "MyLabels"
    });

    // Add to the map's overlay collection
    this.myMap.overlayMapTypes.clear();
    let labelsMap = this.myMap.overlayMapTypes.push(labelsMapType);

    // Select the just created highway labels and bring it to the front.
    d3.select("#map > div > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)").style('z-index', 1000000).style('opacity', 0.5);
    // consult this for d3 on top of leaflet: http://www.sydneyurbanlab.com/Tutorial7/tutorial7.html
    // working with SVGS and leaflet: https://stackoverflow.com/questions/50787719/make-svgs-on-top-of-leaflet-map-not-respond-to-pan-events
  }
}
