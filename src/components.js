import React, { Component } from 'react';

export function Image(props) {
  return <img src={props.image_url} alt={props.name} height={50}/>
}

export function Name(props) {
  return <div><b>{props.name}</b></div>
}

export function Price(props) {
  return <div>{props.price} bells</div>
}

export function Location(props) {
  return <div>Location: {props.location}</div>
}

export function ShadowSize(props) {
  return <div>Shadow size: {props.shadow_size}</div>
}

export function Time(props) {
  return <div>{props.time}</div>
}

export function MonthsNorthern(props) {
  var months = ""
  for (var i = 0; i < props.months.length; i++) {
    switch(props.months[i]) {
      case 1:
        months = months + "Jan" + ", ";
        break;
      case 2:
        months = months + "Feb" + ", ";
        break;
      case 3:
        months = months + "Mar" + ", ";
        break;
      case 4:
        months = months + "Apr" + ", ";
        break;
      case 5:
        months = months + "May" + ", ";
        break;
      case 6:
        months = months + "Jun" + ", ";
        break;
      case 7:
        months = months + "Jul" + ", ";
        break;
      case 8:
        months = months + "Aug" + ", ";
        break;
      case 9:
        months = months + "Sep" + ", ";
        break;
      case 10:
        months = months + "Oct" + ", ";
        break;
      case 11:
        months = months + "Nov" + ", ";
        break;
      case 12:
        months = months + "Dec" + ", ";
        break;
      default:
        break;
    }
  }
  months = months.substring(0, months.length - 2);
  return <div><b>Northern Hemisphere</b>: {months}</div>
}

export function MonthsSouthern(props) {
  var months = ""
  for (var i = 0; i < props.months.length; i++) {
    switch(props.months[i]) {
      case 1:
        months = months + "Jan" + ", ";
        break;
      case 2:
        months = months + "Feb" + ", ";
        break;
      case 3:
        months = months + "Mar" + ", ";
        break;
      case 4:
        months = months + "Apr" + ", ";
        break;
      case 5:
        months = months + "May" + ", ";
        break;
      case 6:
        months = months + "Jun" + ", ";
        break;
      case 7:
        months = months + "Jul" + ", ";
        break;
      case 8:
        months = months + "Aug" + ", ";
        break;
      case 9:
        months = months + "Sep" + ", ";
        break;
      case 10:
        months = months + "Oct" + ", ";
        break;
      case 11:
        months = months + "Nov" + ", ";
        break;
      case 12:
        months = months + "Dec" + ", ";
        break;
      default:
        break;
    }
  }
  months = months.substring(0, months.length - 2);
  return <div><b>Southern Hemisphere</b>: {months}</div>
  /**/
}

export function Bug(props) {
  return (
    <div className="animal-list-item-grid">
      <Image image_url={props.image_url} />
      <Name name={props.name} />
      <Price price={props.price} />
      <Location location={props.location} />
      <Time time={props.time} />
      <MonthsNorthern months={props.monthsNorthern} />
      <MonthsSouthern months={props.monthsSouthern} />
    </div>
  );
}

export function Fish(props) {
  return (
    <div className="animal-list-item-grid">
      <Image image_url={props.image_url} />
      <Name name={props.name} />
      <Price price={props.price} />
      <Location location={props.location} />
      <ShadowSize shadow_size={props.shadow_size} />
      <Time time={props.time} />
      <MonthsNorthern months={props.monthsNorthern} />
      <MonthsSouthern months={props.monthsSouthern} />
    </div>
  )
}
