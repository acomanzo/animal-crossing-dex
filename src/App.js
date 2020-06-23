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
    })
  }

  fetchItems() {
    fetch("http://localhost:3000/bugs")
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

    fetch("http://localhost:3001/fish")
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
      .catch(error => console.log("Fetch error: " + error))

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
    }))
  }

  toggleFish() {
    this.setState(prevState => ({
      displayFish: !prevState.displayFish
    }), () => {

    })
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
    var temp = this.state.months
    const value = Number(event.target.value)
    const index = temp.indexOf(value)
    if (index === -1) {
      temp.push(value)
    }
    else {
      temp.splice(index, 1);
    }
    this.setState({
      months: temp
    })
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

    from1 = from1.toLowerCase();
    to1 = to1.toLowerCase();
    from2 = from2.toLowerCase();
    to2 = to2.toLowerCase();

    // for each time, cut out am/pm and convert to military time. If a time
    // updates to 24, switch it to 0
    if (from1.indexOf("pm") !== -1) {
      from1 = Number(from1.slice(0, -2).trim()) + 12
      if (from1 === 24) {
        from1 = 0
      }
    } else {
      from1 = Number(from1.slice(0, -2).trim())
    }
    if (to1.indexOf("pm") !== -1) {
      to1 = Number(to1.slice(0, -2).trim()) + 12
      if (to1 === 24) {
        to1 = 0
      }
    } else {
      to1 = Number(to1.slice(0, -2).trim())
    }
    if (from2.indexOf("pm") !== -1) {
      from2 = Number(from2.slice(0, -2).trim()) + 12
      if (from2 === 24) {
        from2 = 0
      }
    } else {
      from2 = Number(from2.slice(0, -2).trim())
    }
    if (to2.indexOf("pm") !== -1) {
      to2 = Number(to2.slice(0, -2).trim()) + 12
      if (to2 === 24) {
        to2 = 0
      }
    } else {
      to2 = Number(to2.slice(0, -2).trim())
    }

    if (from1 === from2 && to1 === to2) {
      return true;
    }
    else if (from1 === to2 && to1 === from2) {
      return false;
    }
    else if (from1 >= to2 && from2 >= to1) {
      return false;
    }
    else if (from1 < from2 && to1 <= from2 && from1 < to2 && to1 <= to2) {
      if (from2 < 12) {
        return false;
      }
    }
    else if (from1 >= to2 && to1 > to2 && from1 > from2 && to1 > from2) {
      if (from2 > 12) {
        return true;
      }
      return false;

    }
    return true;

  }

  /**
   * Filters items as specified by the user's interaction with the interface
   * and updates the array filteredItems. Applies a function to every animal
   * in this.state.items and displays it if it passes the filters.
   *
   */
  cook() {
    if (this.state.items == null) {
      return
    }
    var temp = this.state.items
    const fromTime = this.state.fromTime
    const toTime = this.state.toTime

    var self = this; // for the callback
    // if bugs are toggled on or fish are toggled on and this animal is a
    // bug or a fish, return true
    temp = temp.filter(function(animal) {
      var matchBugsToggle = false
      var matchFishToggle = false
      const displayBugs = self.state.displayBugs
      const displayFish = self.state.displayFish
      // if both are toggled on, display all fish and bugs
      if (displayBugs && displayFish) {
        matchBugsToggle = true
        matchFishToggle = true
      }
      // if bugs are toggled on and the animal is a bug, display it
      else if (displayBugs && (typeof animal.shadow_size === 'undefined')) {
        matchBugsToggle = true
      }
      // if the fish are toggled on and the animal is a fish, display it
      else if (displayFish && (typeof animal.shadow_size !== 'undefined')) {
        matchFishToggle = true
      }

      return matchBugsToggle || matchFishToggle
    })
    // if this animal passes the time and month check, return true
    temp = temp.filter(function(animal) {
      var matchTime = false
      var matchMonths = false

      if (animal.time.localeCompare("All day") === 0) {
        matchTime = true;
      }
      else {
        // get an array of the animal's time field
        const animalTime = animal.time.split(" ")
        // make a new array such that the first index is the starting time
        // and the second index is the ending time, including AM/PM
        const animalTimeArray = [animalTime[0].concat(animalTime[1]).toLowerCase(),
                                 animalTime[3].concat(animalTime[4]).toLowerCase()]
        matchTime = self.rangesOverlap(fromTime, toTime, animalTimeArray[0], animalTimeArray[1])
      }

      // if the months chosen are a subset of this animal's set of months,
      // display it
      switch (self.state.hemisphere) {
        case "northern":
          matchMonths = self.state.months.every(val => animal.months.northern.includes(val))
          break;
        case "southern":
          matchMonths = self.state.months.every(val => animal.months.southern.includes(val))
          break;
        default:
          alert("error cooking")
          break;
      }
      return matchTime && matchMonths
    })

    this.setState({
      filteredItems: temp
    }, () => {
      console.log("Cook callback:")
    })
  }

  handleSearch(event) {
    var currentList = [];

    var newList = [];

    if (event.target.value !== "") {
      currentList = this.state.items;

      newList = currentList.filter(item => {
        const lcItem = item.name.toLowerCase()

        const filter = event.target.value.toLowerCase()

        return lcItem.includes(filter);
      })
    } else {
      newList = this.state.filteredItems;
    }

    this.setState({
      filteredItems: newList
    })
  }

  handleWhatCanICatchNow() {
    const date = new Date()
    var monthContainer = document.getElementById("monthContainer")
    var month = monthContainer.children[date.getMonth() - 1]
    var hour = date.getHours()
    this.setState({
      months: [date.getMonth()]
    })
    if (hour >= 12) {
      hour = hour - 12
      this.setState({
        fromTime: hour + "pm"
      })
      this.setState({
        toTime: (hour + 1) + "pm"
      })
    } else {
      this.setState({
        fromTime: hour + "am"
      })
      this.setState({
        toTime: (hour + 1) + "am"
      })
    }
    this.setState({
      hemisphere: "northern"
    })
    this.setState({
      displayBugs: true
    })
    this.setState({
      displayFish: true
    }, () => {
      this.cook()
    })
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
            <ToggleButton value={1} onChange={this.toggleBugs}>Bugs</ToggleButton>
            <ToggleButton value={2} onChange={this.toggleFish}>Fish</ToggleButton>
          </ToggleButtonGroup>
          <br />
          <label>From when?</label>
          <select id="from-time" onChange={this.updateFromTime}>
            <optgroup label="Morning (AM)">
              <option value="12am">12:00</option>
              <option value="1am">1:00</option>
              <option value="2am">2:00</option>
              <option value="3am">3:00</option>
              <option value="4am">4:00</option>
              <option value="5am">5:00</option>
              <option value="6am">6:00</option>
              <option value="7am">7:00</option>
              <option value="8am">8:00</option>
              <option value="9am">9:00</option>
              <option value="10am">10:00</option>
              <option value="11am">11:00</option>
            </optgroup>
            <optgroup label="Afternoon (PM)">
              <option value="12pm">12:00</option>
              <option value="1pm">1:00</option>
              <option value="2pm">2:00</option>
              <option value="3pm">3:00</option>
              <option value="4pm">4:00</option>
              <option value="5pm">5:00</option>
              <option value="6pm">6:00</option>
              <option value="7pm">7:00</option>
              <option value="8pm">8:00</option>
              <option value="9pm">9:00</option>
              <option value="10pm">10:00</option>
              <option value="11pm">11:00</option>
            </optgroup>
          </select>
          <br />
          <label>Until when?</label>
          <select id="to-time" onChange={this.updateToTime}>
            <optgroup label="Morning (AM)">
              <option value="12am">12:00</option>
              <option value="1am">1:00</option>
              <option value="2am">2:00</option>
              <option value="3am">3:00</option>
              <option value="4am">4:00</option>
              <option value="5am">5:00</option>
              <option value="6am">6:00</option>
              <option value="7am">7:00</option>
              <option value="8am">8:00</option>
              <option value="9am">9:00</option>
              <option value="10am">10:00</option>
              <option value="11am">11:00</option>
            </optgroup>
            <optgroup label="Afternoon (PM)">
              <option value="12pm">12:00</option>
              <option value="1pm">1:00</option>
              <option value="2pm">2:00</option>
              <option value="3pm">3:00</option>
              <option value="4pm">4:00</option>
              <option value="5pm">5:00</option>
              <option value="6pm">6:00</option>
              <option value="7pm">7:00</option>
              <option value="8pm">8:00</option>
              <option value="9pm">9:00</option>
              <option value="10pm">10:00</option>
              <option value="11pm">11:00</option>
            </optgroup>
          </select>
          <br />
          <ToggleButtonGroup type="radio" name="hemispheres" className="mb-1 flex-wrap">
            <ToggleButton id="northernButton" value={1} onChange={this.toggleNorthernHemisphere}>Northern Hemisphere</ToggleButton>
            <ToggleButton id="southernButton" value={2} onChange={this.toggleSouthernHemisphere}>Southern Hemisphere</ToggleButton>
          </ToggleButtonGroup>
          <br />
          <ToggleButtonGroup type="checkbox" className="mb-1 flex-wrap">
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
