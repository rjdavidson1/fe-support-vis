import * as d3 from 'd3';
import React, {Component, createRef} from 'react';
import jsonData from '../data/test-3h.json';


class SupportWheel extends Component {

  constructor(props) {
    super(props);
    this.wheel = createRef();

    // parse JSON
    this.loadData = JSON.parse(JSON.stringify(jsonData));
    this.characters = this.loadData['characters'];
    this.affiliations = this.loadData['affiliations'];
    this.supports = this.loadData['supports'];

    // starting variables
    this.height = 500;
    this.width = 500;
    this.padding = { top: 20, bottom: 20, right: 20, left: 20};
    this.diameter = (this.width - (this.padding.left + this.padding.right));
    this.radius = this.diameter / 2;
    this.circumference = this.diameter * Math.PI;
    this.characterSize = this.circumference / this.characters.length;
    this.radian = 360 / (this.characters.length);

    console.log('circumference is ' + this.circumference + 
    ' and character size is ' + this.characterSize);

    // d3 functions
    this.cluster = d3.cluster()
    .size([360, (this.height / 2) - 50]);

    this.line = d3.radialLine()
      .curve(d3.curveBundle.beta(0.85))
      .radius(d => d.y)
      .angle(d => d.x / 180 * Math.PI);
      
    this.affiliationColor = d3.scaleOrdinal()
    .domain(['Black Eagles', 'Blue Lions', 'Golden Deer', 'Church of Seiros'])
    .range(['#BC4541','#3F4798','#A08E2A','#A8A7AF']);
  
  }

  componentDidMount() {
    this.d3Graph = d3.select(this.wheel.current)//;
    .attr("transform", "translate(" + this.width / 2 + ", " + this.height / 2 + ")");
    this.addCharacters();
  }

  addCharacters() {
    this.d3Graph
      .selectAll(".character")
      .data(this.characters)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("class", "character")
      .attr("id", d => d['name'])
      .attr("fill", (d, i) => {
        return this.affiliationColor(d['affiliation']);
      })
      .attr('cx', (d, i) => {
        return this.radius * Math.cos(this.radian * i);
      })
      .attr('cy', (d, i) => {
        return this.radius * Math.sin(this.radian * i);
      });
  }

  render() {
    return <svg width={this.width} height={this.height}> 
      <g ref={this.wheel}/>
    </svg>;
  }
}
export default SupportWheel