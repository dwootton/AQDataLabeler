class Slider {
  constructor(){


  var margin = { top: 10, right: 50, bottom: 50, left: 40 },//{ top: 10, right: 50, bottom: 50, left: 40 }
    width = 1490 - margin.left - margin.right,
    height = 100;

  let bounds = [0, window.controller.map.times.length];
  console.log(bounds);

  let interval = 15;

  this.xScale = d3.scaleLinear().range([0, width])
      .domain(bounds)
      .clamp(true);

  //this.updateData(data);
  let xBandStarts = []
  let dataNewYorkTimes = d3.range(0,bounds[1]).map(d => {
    xBandStarts.push(this.xScale(d));
    return {
    timePoint: this.xScale(d),
    value: 20 // change this value to be the averaged pm 25 pollution
    }
  });

  let svg = d3
    .select('#slider')
    .attr('width', width)
    .attr('height', height);
  this.svg =svg;
  let padding = 0.05;

  let xBand = d3
    .scaleBand()
    .domain(xBandStarts)
    .range([margin.left, width - margin.right])
    .padding(padding);

  let xLinear = this.xScale
    .range([
      margin.left + xBand.bandwidth() / 2 + xBand.step() * padding - 0.5,
      width -
        margin.right -
        xBand.bandwidth() / 2 -
        xBand.step() * padding -
        0.5,
    ]);

  let xBandVals = []
  d3.range(0,bounds[1]).map(d => {
    xBandVals.push(xLinear(d));
  });



  var y = d3
    .scaleLinear()
    .domain([0, 1])
    .nice()
    .range([height - margin.bottom, margin.top]);
  //let parseDate = d3.timeFormat("%Y-%m-%d")
  this.yScale =y;
  /*var yAxis = g =>
    g
      .attr('transform', `translate(${width - margin.right},0)`)
      .call(
        d3
          .axisRight(y)
          .tickValues([1e4])
          .tickFormat(d3.format('($.2s'))
      )
      .call(g => g.select('.domain').remove());*/

  this.slider = d3
        .sliderBottom(xLinear)
        .ticks(6)
        .default(9)
        .on('onchange', value => draw(value))
        .displayFormat(d3.timeFormat("%m-%d \n %H:%M %p"));
  var slider = g =>
    g.attr('transform', `translate(0,${height - margin.bottom})`).call(this.slider);

  var bars = svg
    .append('g')
    .selectAll('rect')
    .data(dataNewYorkTimes);
  var barsEnter = bars
    .enter()
    .append('rect')
    .attr('class','sliderBars')
    .attr('x', d =>
    { return xBand(d.timePoint)})
    .attr('y', d => y(d.value))
    .attr('height', d => y(0) - y(d.value))
    .attr('width', xBand.bandwidth()); //



    let yAxis = d3.axisLeft(y).ticks(2);
    svg.append("g")
      .attr("class", "yAxis")
      .call(yAxis)
      .attr('transform', `translate(${margin.left-5},0)`)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("AVG PM 2.5");

  svg.append('g').call(slider);
  let that = this;
  var draw = selected => {
    let xPosition = this.xScale(selected);

    let closestBarLocation = Math.round(selected);
    console.log(closestBarLocation);
    window.controller.map.selectIndex(closestBarLocation);
    /*xBandStarts.reduce(function(prev,curr){
      prev = prev + xBand.bandwidth()/2;
      curr = curr + xBand.bandwidth()/2;
      return (Math.abs(curr - xPosition) < Math.abs(prev - xPosition) ? curr : prev);
    })*/

    barsEnter
      .merge(bars)
      .attr('fill', (d,i) => {
        console.log(closestBarLocation);
        /*
        console.log(d.timePoint,);
        if(d.timePoint < this.xScale(roundToInterval(new Date(selected),interval))){ // if greater
          if(d.timePoint + 17 > this.xScale(roundToInterval(new Date(selected),interval))){
            return '#bad80a';
          }
        }
        return '#e0e0e0'*/
        return (i === closestBarLocation ? '#bad80a' : '#e0e0e0')
      });


    that.renderedDate = that.selectedDate;
    let dateString = window.controller.map.times[window.controller.map.currentPoint];

    d3.select('p#value-new-york-times').text(
      dateString
      //d3.format(parseDate)(dataNewYorkTimes[3].value)
    );
    d3.select('.parameter').property("value", selected);



  }

    /*
    var svg = d3.select("#slider"),
        margin = {right: 50, left: 50},
        width = 1700 - margin.left - margin.right,
        height = 35;


        let timeBounds = [new Date(window.controller.selector.startDate), new Date(window.controller.selector.endDate )];

    this.xScale = d3.scaleTime().range([0, width])
          .domain(timeBounds)
          .clamp(true);

    console.log(width);

    var slider = svg.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + margin.left + "," + height / 2 + ")");

    let that = this;
    slider.append("line")
        .attr("class", "track")
        .attr("x1", this.xScale.range()[0])
        .attr("x2", this.xScale.range()[1])
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(d3.drag()
            .on("start.interrupt", function() { slider.interrupt(); })
            .on("start drag", ()=> {
              let newData = this.xScale.invert(d3.event.x);


              let selector = window.controller.selector;
              if(that.selectedDate == roundToHour(new Date(newData))){
                console.log("already selectedx!")
                return;
              }
              that.selectedDate = roundToHour(new Date(newData));

    					window.controller.selectedDate = that.selectedDate
              selector.selectedDate = that.selectedDate;
              /*selector.grabAllSensorData(that.selectedDate);
              selector.grabAllModelData(that.selectedDate);
              window.controller.map.getDataAtTime(that.selectedDate);
            }));

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
      .selectAll("text")
      .data(this.xScale.ticks(5))
      .enter().append("text")
        .attr("x", this.xScale)
        .attr("text-anchor", "middle")
        .text(function(d) { return d; });

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);

    slider.transition() // Gratuitous intro!
        .duration(750)
        .tween("hue", function() {
          var i = d3.interpolate(0, 70);
          return function(t) { hue(i(t)); };
        });

    let hue = (h) => {
      handle.attr("cx", this.xScale(h));
      svg.style("background-color", d3.hsl(h, 0.8, 0.8));

    }*/
  }




  removeSVG(){
    this.svg.selectAll('*').remove();
  }

  changeData(data){
    let margin = { top: 10, right: 50, bottom: 50, left: 40 };
    let interval = 15;
    // check if time bounds changed?
    let bounds = [0, window.controller.map.times.length];

    let vals = d3.range(bounds[0],bounds[1]);
    let newData = data;//largestTriangleThreeBuckets(data,times.length);
    //this.updateData(data);
    console.log(data, vals);
    let xBandStarts = []
    let dataNewYorkTimes = vals.map((d,i) => {
      xBandStarts.push(this.xScale(d));
      return {
      timePoint: this.xScale(d),
      value: newData[i] // change this value to be the averaged pm 25 pollution
      }
    });

    this.yScale.domain([0,d3.max(data)])
    console.log(this.yScale);
    console.log(this.yScale(1),this.yScale(0));
    let yAxis = d3.axisLeft(this.yScale).ticks(2);
    d3.select('.yAxis').remove('*');
    this.svg.append("g")
      .attr("class", "yAxis")
      .call(yAxis)
      .attr('transform', `translate(${margin.left-5},0)`)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Correlation");
    var bars = this.svg
      .selectAll('.sliderBars')
      .data(dataNewYorkTimes);
    let yscale = this.yScale;
    console.log(yscale(0), yscale(1),yscale(.5),yscale);
    bars
      //.merge(bars)
      //.transition(500)
      .attr('y', d => yscale(d.value))
      .attr('height', d => yscale(0) - yscale(d.value) + 5);


  }

}


/*

<style>

.ticks {
  font: 10px sans-serif;
}

.track,
.track-inset,
.track-overlay {
  stroke-linecap: round;
}

.track {
  stroke: #000;
  stroke-opacity: 0.3;
  stroke-width: 10px;
}

.track-inset {
  stroke: #ddd;
  stroke-width: 8px;
}

.track-overlay {
  pointer-events: stroke;
  stroke-width: 50px;
  stroke: transparent;
  cursor: crosshair;
}

.handle {
  fill: #fff;
  stroke: #000;
  stroke-opacity: 0.5;
  stroke-width: 1.25px;
}

</style>
<svg width="960" height="500"></svg>
<script src="//d3js.org/d3.v4.min.js"></script>
<script>


 */
/* Date = datetime obejct. Interval = number of minutes (number)*/
 function roundToInterval(date, interval) {
   p = interval * 60 * 1000; // milliseconds in an hour
   return new Date(Math.round(date.getTime() / p ) * p);
 }

 function generateNewTimes(startDate, endDate, interval){
   var dates = [],
      currentDate = startDate,
      addTime = function(newInterval) {
        var date = new Date(this.valueOf());
        date.setTime(date.getTime() + newInterval*60*1000);
        return date;
      };
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addTime.call(currentDate, interval);
  }
  return dates;

 }

 function indexOfClosest(nums, target) {
  let closest = Number.MAX_SAFE_INTEGER;
  let index = 0;

  nums.forEach((num, i) => {
    let dist = Math.abs(target - num);

    if (dist < closest) {
      index = i;
      closest = dist;
    }
  });

  return index;
}

function largestTriangleThreeBuckets(data,threshold){
  let twoDData = [],
    index = 0;

  data.map(function(element){
    twoDData.push([index,element]);
    index++;
  })
  let processedData = largestTriangleThreeBucketsReal(twoDData,threshold);
  return  processedData.map(function(element){
    return element[1];
  });
}
function  largestTriangleThreeBucketsReal(r,o){var a=r.length;if(a<=o||0===o)return r;var e,t,f,l,n=[],s=0,u=(a-2)/(o-2),v=0;n[s++]=r[v];for(var c=0;c<o-2;c++){for(var g=0,h=0,i=Math.floor((c+1)*u)+1,T=Math.floor((c+2)*u)+1,b=(T=T<a?T:a)-i;i<T;i++)g+=1*r[i][0],h+=1*r[i][1];g/=b,h/=b;var k=Math.floor((c+0)*u)+1,p=Math.floor((c+1)*u)+1,B=1*r[v][0],M=1*r[v][1];for(t=f=-1;k<p;k++)t<(f=.5*Math.abs((B-g)*(r[k][1]-M)-(B-r[k][0])*(h-M)))&&(t=f,e=r[k],l=k);n[s++]=e,v=l}return n[s++]=r[a-1],n};
