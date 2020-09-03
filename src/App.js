import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Spinner from 'react-bootstrap/Spinner';
import { Bug } from './components.js';
import { Fish } from './components.js';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: this.props.items
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.items.length !== state.items.length) {
      return {
        items: props.items
      };
    }
    return null;
  }

  render() {
    return (
      <div id="animal-list">
        {(this.state.items || this.state.items.length > 0) ? (this.state.items.map(item => {
          switch(typeof item.shadow_size) {
            case 'undefined':
              return (
                <Bug
                  key={item.name}
                  image_url={item.image_url}
                  name={item.name}
                  price={item.price}
                  location={item.location}
                  time={item.time}
                  monthsNorthern={item.months.northern}
                  monthsSouthern={item.months.southern}
                />
              )
            default:
              return (
                <Fish
                  key={item.name}
                  image_url={item.image_url}
                  name={item.name}
                  price={item.price}
                  location={item.location}
                  shadow_size={item.shadow_size}
                  time={item.time}
                  monthsNorthern={item.months.northern}
                  monthsSouthern={item.months.southern}
                />
              )
          }
        })) : <div>Loading...</div>}
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: null,
      filteredItems: null,
      displayBugs: false,
      displayFish: false,
      fromTime: "12 AM",
      toTime: "11 PM",
      hemisphere: "northern",
      months: []
    }

    this.fetchItems = this.fetchItems.bind(this);
    this.toggleBugs = this.toggleBugs.bind(this);
    this.toggleFish = this.toggleFish.bind(this);
    this.toggleNorthernHemisphere = this.toggleNorthernHemisphere.bind(this);
    this.toggleSouthernHemisphere = this.toggleSouthernHemisphere.bind(this);
    this.updateFromTime = this.updateFromTime.bind(this);
    this.updateToTime = this.updateToTime.bind(this);
    this.updateMonths = this.updateMonths.bind(this);
    this.cook = this.cook.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleWhatCanICatchNow = this.handleWhatCanICatchNow.bind(this);
  }

  updateList() {
    this.setState({
      items: this.props.items
    });
  }

  fetchItems() {
    // "http://localhost:3000/bugs"
    fetch("../data/stock/stock_bugs.json")
      .then(response => response.json())
      .then(function(data) {

        this.state.items ?
        this.setState((prevState) => ({
          items: prevState.items.concat(data)
        })) :
        this.setState({
          items: data
        })

        this.state.filteredItems ?
        this.setState((prevState) => ({
          filteredItems: prevState.filteredItems.concat(data)
        })) :
        this.setState({
          filteredItems: data
        })
      }.bind(this))
      .catch(error => console.log("Fetch error: " + error));

      //http://localhost:3001/fish
    fetch("../data/stock/stock_fish.json")
      .then(response => response.json())
      .then(function(data) {

        this.state.items ?
        this.setState((prevState) => ({
          items: prevState.items.concat(data)
        })) :
        this.setState({
          items: data
        })

        this.state.filteredItems ?
        this.setState((prevState) => ({
          filteredItems: prevState.filteredItems.concat(data)
        })) :
        this.setState({
          filteredItems: data
        })
      }.bind(this))
      .catch(error => console.log("Fetch error: " + error));

    //let requestURL = '/Users/anthony/Desktop/Coding\ Stuff/React/big-money/src/stock.json';
    /*let requestURL = 'http://localhost:3000/stock';
    let request = new XMLHttpRequest();
    request.responseType = 'text';
    request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status === 200) {
        console.log(request.responseText);
        var response = JSON.parse(request.responseText);
        var stock = response.stock;
        this.setState({
          items: stock
        });
        this.setState({
          filteredItems: stock
        });
      }
    }
    request.open('GET', requestURL, true);
    request.send();*/
  }

  toggleBugs() {
    this.setState(prevState => ({
      displayBugs: !prevState.displayBugs
    }));
  }

  toggleFish() {
    this.setState(prevState => ({
      displayFish: !prevState.displayFish
    }), () => {

    });
  }

  updateFromTime() {
    var element = document.getElementById("from-time");
    var time = element.options[element.selectedIndex].value;
    this.setState({
      fromTime: time
    });
  }

  updateToTime() {
    var element = document.getElementById("to-time");
    var time = element.options[element.selectedIndex].value;
    this.setState({
      toTime: time
    }, () => {

    });
  }

  toggleNorthernHemisphere(button) {
    if (button.checked) {
      this.setState({
        hemisphere: null
      });
    }
    else {
      this.setState({
        hemisphere: "northern"
      });
    }
  }

  toggleSouthernHemisphere(button) {
    if (button.checked) {
      this.setState({
        hemisphere: null
      });
    }
    else {
      this.setState({
        hemisphere: "southern"
      });
    }
  }

  updateMonths(event) {
    var temp = this.state.months;
    const value = Number(event.target.value);
    const index = temp.indexOf(value);
    if (index === -1) {
      temp.push(value);
    }
    else {
      temp.splice(index, 1);
    }
    this.setState({
      months: temp
    });
  }

  /**
   * Compares the first range (from1, to1) to the second range (from2, to2)
   * and returns true if there is any overlap between the two ranges.
   * If the ranges do not overlap, returns false.
   *
   * @param {String} from1 - The starting time of the first range
   * @param {String} to1 - The ending time of the first range
   * @param {String} from2 - the starting time of the second range
   * @param {String} to2 - The ending time of the second range
   * @returns {boolean} true if the ranges overlap, false otherwise
   */
  rangesOverlap(from1, to1, from2, to2) {
    console.log(from1 + ", " + to1 + "--" + from2 + ", " + to2);
    from2 = from2.toLowerCase();
    to2 = to2.toLowerCase();

    // for the second set, cut out am/pm and convert to military time.
    // If "pm" is in the string, add 12. If a time updates to 24, revert it
    // to 12
    if (from2.indexOf("pm") !== -1) {
      from2 = Number(from2.slice(0, -2).trim()) + 12;
      if (from2 === 24) {
        from2 = 12;
      }
    } else {
      from2 = Number(from2.slice(0, -2).trim());
    }
    if (to2.indexOf("pm") !== -1) {
      to2 = Number(to2.slice(0, -2).trim()) + 12;
      if (to2 === 24) {
        to2 = 12;
      }
    } else {
      to2 = Number(to2.slice(0, -2).trim());
    }

    // see proof on stack overflow
    // "Algorithm to detect overlapping periods [duplicate]"
    // "Determine Whether Two Date Ranges Overlap"
    // use > and < to prevent adjacent/touching ranges from matching
    return from1 < to2 && from2 < to1;
  }

  /**
   * Filters items as specified by the user's interaction with the interface
   * and updates the array filteredItems. Applies a function to every animal
   * in this.state.items and displays it if it passes the filters.
   *
   */
  cook() {
    if (this.state.items == null) {
      return;
    }
    var temp = this.state.items;
    const fromTime = this.state.fromTime;
    const toTime = this.state.toTime;

    var self = this; // for the callback
    // if bugs are toggled on or fish are toggled on and this animal is a
    // bug or a fish, return true
    temp = temp.filter(function(animal) {
      var matchBugsToggle = false;
      var matchFishToggle = false;
      const displayBugs = self.state.displayBugs;
      const displayFish = self.state.displayFish;
      // if both are toggled on, display all fish and bugs
      if (displayBugs && displayFish) {
        matchBugsToggle = true;
        matchFishToggle = true;
      }
      // if bugs are toggled on and the animal is a bug, display it
      else if (displayBugs && (typeof animal.shadow_size === 'undefined')) {
        matchBugsToggle = true;
      }
      // if the fish are toggled on and the animal is a fish, display it
      else if (displayFish && (typeof animal.shadow_size !== 'undefined')) {
        matchFishToggle = true;
      }

      return matchBugsToggle || matchFishToggle;
    })
    // if this animal passes the time and month check, return true
    temp = temp.filter(function(animal) {
      var matchTime = false;
      var matchMonths = false;

      if (animal.time.localeCompare("All day") === 0) {
        matchTime = true;
      }
      else {
        // get an array of the animal's time field
        const animalTime = animal.time.split(" ");
        // make a new array such that the first index is the starting time
        // and the second index is the ending time, including AM/PM
        var animalTimeArray = [animalTime[0].concat(animalTime[1]).toLowerCase(),
                                 animalTime[3].concat(animalTime[4]).toLowerCase()];
        matchTime = self.rangesOverlap(fromTime, toTime, animalTimeArray[0], animalTimeArray[1]);
        // dont forget about the case where there are two times an animal
        // could appear
        if (animalTime.includes("&")) {
          animalTimeArray[0] = animalTime[6].concat(animalTime[7]);
          animalTimeArray[1] = animalTime[9].concat(animalTime[10]);
          matchTime = matchTime || self.rangesOverlap(fromTime, toTime, animalTimeArray[0], animalTimeArray[1]);
        }
      }

      // if the months chosen are a subset of this animal's set of months,
      // display it
      switch (self.state.hemisphere) {
        case "northern":
          matchMonths = self.state.months.every(val => animal.months.northern.includes(val));
          break;
        case "southern":
          matchMonths = self.state.months.every(val => animal.months.southern.includes(val));
          break;
        default:
          alert("error cooking");
          break;
      }
      return matchTime && matchMonths;
    });

    this.setState({
      filteredItems: temp
    }, () => {
      console.log("Cook callback:");
    });
  }

  handleSearch(event) {
    var currentList = [];

    var newList = [];

    if (event.target.value !== "") {
      currentList = this.state.items;

      newList = currentList.filter(item => {
        const lcItem = item.name.toLowerCase();

        const filter = event.target.value.toLowerCase();

        return lcItem.includes(filter);
      });
    } else {
      newList = this.state.filteredItems;
    }

    this.setState({
      filteredItems: newList
    });
  }

  handleWhatCanICatchNow() {
    // switch state back to default, then do work
    this.setState({
      displayBugs: false,
      displayFish: false,
      fromTime: "12 AM",
      toTime: "11 PM",
      hemisphere: "northern",
      months: []
    }, () => {
      const date = new Date();
      const hour = date.getHours(); // expect 0 - 23
      const month = date.getMonth(); // expect 0 - 11
      // using .click() will mimic the user actually clicking
      // and even call functions
      var monthButton = document.getElementById("months-group").children[month];
      monthButton.click();
      var fromTimeElement = document.getElementById("from-time");
      var toTimeElement = document.getElementById("to-time");
      switch(hour) {
        case 0:
          fromTimeElement.selectedIndex = 0;
          toTimeElement.selectedIndex = 1;
          break;
        case 1:
          fromTimeElement.selectedIndex = 1;
          toTimeElement.selectedIndex = 2;
          break;
        case 2:
          fromTimeElement.selectedIndex = 2;
          toTimeElement.selectedIndex = 3;
          break;
        case 3:
          fromTimeElement.selectedIndex = 3;
          toTimeElement.selectedIndex = 4;
          break;
        case 4:
          fromTimeElement.selectedIndex = 4;
          toTimeElement.selectedIndex = 5;
          break;
        case 5:
          fromTimeElement.selectedIndex = 5;
          toTimeElement.selectedIndex = 6;
          break;
        case 6:
          fromTimeElement.selectedIndex = 6;
          toTimeElement.selectedIndex = 7;
          break;
        case 7:
          fromTimeElement.selectedIndex = 7;
          toTimeElement.selectedIndex = 8;
          break;
        case 8:
          fromTimeElement.selectedIndex = 8;
          toTimeElement.selectedIndex = 9;
          break;
        case 9:
          fromTimeElement.selectedIndex = 9;
          toTimeElement.selectedIndex = 10;
          break;
        case 10:
          fromTimeElement.selectedIndex = 10;
          toTimeElement.selectedIndex = 11;
          break;
        case 11:
          fromTimeElement.selectedIndex = 11;
          toTimeElement.selectedIndex = 12;
          break;
        case 12:
          fromTimeElement.selectedIndex = 12;
          toTimeElement.selectedIndex = 13;
          break;
        case 13:
          fromTimeElement.selectedIndex = 13;
          toTimeElement.selectedIndex = 14;
          break;
        case 14:
          fromTimeElement.selectedIndex = 14;
          toTimeElement.selectedIndex = 15;
          break;
        case 15:
          fromTimeElement.selectedIndex = 15;
          toTimeElement.selectedIndex = 16;
          break;
        case 16:
          fromTimeElement.selectedIndex = 16;
          toTimeElement.selectedIndex = 17;
          break;
        case 17:
          fromTimeElement.selectedIndex = 17;
          toTimeElement.selectedIndex = 18;
          break;
        case 18:
          fromTimeElement.selectedIndex = 18;
          toTimeElement.selectedIndex = 19;
          break;
        case 19:
          fromTimeElement.selectedIndex = 19;
          toTimeElement.selectedIndex = 20;
          break;
        case 20:
          fromTimeElement.selectedIndex = 20;
          toTimeElement.selectedIndex = 21;
          break;
        case 21:
          fromTimeElement.selectedIndex = 21;
          toTimeElement.selectedIndex = 22;
          break;
        case 22:
          fromTimeElement.selectedIndex = 22;
          toTimeElement.selectedIndex = 23;
          break;
        case 23:
          fromTimeElement.selectedIndex = 23;
          toTimeElement.selectedIndex = 0;
          break;
      }
      this.updateFromTime();
      this.updateToTime();
      document.getElementById("northernButton").click();
      document.getElementById('toggle-bugs-button').click();
      document.getElementById('toggle-fish-button').click();

      this.setState({
        // add a setState to the queue so we can make sure we cook once
        // everything up top is done updating
      }, () => {
        this.cook();
      });
    });
  }

  componentDidMount() {
    this.fetchItems();
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1>Animal Crossing Index</h1>
        </header>
        <div id="hudContainer">
          <ToggleButtonGroup type="checkbox" className="mb-1 flex-wrap">
            <ToggleButton id="toggle-bugs-button" value={1} onChange={this.toggleBugs}>Bugs</ToggleButton>
            <ToggleButton id="toggle-fish-button" value={2} onChange={this.toggleFish}>Fish</ToggleButton>
          </ToggleButtonGroup>
          <br />
          <label>From when?</label>
          <select id="from-time" onChange={this.updateFromTime}>
            <optgroup label="Morning (AM)">
              <option value="0">12:00</option>
              <option value="1">1:00</option>
              <option value="2">2:00</option>
              <option value="3">3:00</option>
              <option value="4">4:00</option>
              <option value="5">5:00</option>
              <option value="6">6:00</option>
              <option value="7">7:00</option>
              <option value="8">8:00</option>
              <option value="9">9:00</option>
              <option value="10">10:00</option>
              <option value="11">11:00</option>
            </optgroup>
            <optgroup label="Afternoon (PM)">
              <option value="12">12:00</option>
              <option value="13">1:00</option>
              <option value="14">2:00</option>
              <option value="15">3:00</option>
              <option value="16">4:00</option>
              <option value="17">5:00</option>
              <option value="18">6:00</option>
              <option value="19">7:00</option>
              <option value="20">8:00</option>
              <option value="21">9:00</option>
              <option value="22">10:00</option>
              <option value="23">11:00</option>
            </optgroup>
          </select>
          <br />
          <label>Until when?</label>
          <select id="to-time" onChange={this.updateToTime}>
            <optgroup label="Morning (AM)">
              <option value="0">12:00</option>
              <option value="1">1:00</option>
              <option value="2">2:00</option>
              <option value="3">3:00</option>
              <option value="4">4:00</option>
              <option value="5">5:00</option>
              <option value="6">6:00</option>
              <option value="7">7:00</option>
              <option value="8">8:00</option>
              <option value="9">9:00</option>
              <option value="10">10:00</option>
              <option value="11">11:00</option>
            </optgroup>
            <optgroup label="Afternoon (PM)">
              <option value="12pm">12:00</option>
              <option value="13">1:00</option>
              <option value="14">2:00</option>
              <option value="15">3:00</option>
              <option value="16">4:00</option>
              <option value="17">5:00</option>
              <option value="18">6:00</option>
              <option value="19">7:00</option>
              <option value="20">8:00</option>
              <option value="21">9:00</option>
              <option value="22">10:00</option>
              <option value="23">11:00</option>
            </optgroup>
          </select>
          <br />
          <ToggleButtonGroup type="radio" name="hemispheres" className="mb-1 flex-wrap">
            <ToggleButton id="northernButton" value={1} onChange={this.toggleNorthernHemisphere}>Northern Hemisphere</ToggleButton>
            <ToggleButton id="southernButton" value={2} onChange={this.toggleSouthernHemisphere}>Southern Hemisphere</ToggleButton>
          </ToggleButtonGroup>
          <br />
          <ToggleButtonGroup id="months-group" type="checkbox" className="mb-1 flex-wrap">
            <ToggleButton value={1} onChange={this.updateMonths}>Jan</ToggleButton>
            <ToggleButton value={2} onChange={this.updateMonths}>Feb</ToggleButton>
            <ToggleButton value={3} onChange={this.updateMonths}>Mar</ToggleButton>
            <ToggleButton value={4} onChange={this.updateMonths}>Apr</ToggleButton>
            <ToggleButton value={5} onChange={this.updateMonths}>May</ToggleButton>
            <ToggleButton value={6} onChange={this.updateMonths}>Jun</ToggleButton>
            <ToggleButton value={7} onChange={this.updateMonths}>Jul</ToggleButton>
            <ToggleButton value={8} onChange={this.updateMonths}>Aug</ToggleButton>
            <ToggleButton value={9} onChange={this.updateMonths}>Sep</ToggleButton>
            <ToggleButton value={10} onChange={this.updateMonths}>Oct</ToggleButton>
            <ToggleButton value={11} onChange={this.updateMonths}>Nov</ToggleButton>
            <ToggleButton value={12} onChange={this.updateMonths}>Dec</ToggleButton>
          </ToggleButtonGroup>
          <br />
          <Button variant="warning" size="lg" className="mb-1" onClick={this.cook}>
            Cook <span role="img">👩🏾‍🍳</span>
          </Button>
          <br />
          <input type="text" onChange={this.handleSearch} placeholder="Search all by name..." />
          <Button onClick={this.handleWhatCanICatchNow} variant="success" size="lg" block>
            What can I catch right now?
          </Button>
        </div>
        <div id="animal-list-container">
          {this.state.filteredItems ?
            <List items={this.state.filteredItems} /> :
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          }
        </div>
        <footer>
          <p>Animal Crossing and Nintendo are registered trademarks of Nintendo
          of America and we do not claim to own any intellectual property
          associated with Animal Crossing.
          </p>
        </footer>
      </div>
    );
  }
}

export default App;
