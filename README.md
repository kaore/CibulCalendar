# Overview

CibulCalendar is a date picker that enables users to easily pick dates or date ranges.

Here is the simplest way to get it running:

`function onload() {
  setCibulCalendar('basic'); // will stick to element <input type="text" id="basic"/>
}`

You can see a live demo by clicking on the "where" field in the header in [this website](http://cibul.net)

Features include:

* Drag and drop range selection
* Single date selection
* Multilingual
* Helper function for single line setup
* Fully Customizable (see details below)

How to use

There are two ways to use the calendar:

The easiest way is to use the helper function to bind the calendar to an input field:

`setCibulCalendar(id, options)`

But you might want to handle the Calendar in a script rather than applying it directly on an input field, in which case you should use:

`var cCal = new CibulCalendar(canvasElem, options)` 

# Options

* **range** (default: true): if false, range date picking is disabled. Here is an example.
* **enabled** (default: true): state of the calendar at init
* **lang** (default: ‘en’): Language of the calendar. can be english (en), french (fr), italian (it) or spanish (es). You can extend this with any other language (see below).
* **firstDayOfWeek** (default: 1): first day of the week on the calendar. 0 for sunday and onwards.
* **selected** (default: false): default selection at initialization. Should be a object: {begin: Date, end: Date}
* **filter**: (default: false): callback called on each calendar render to handle date classes. If set, function is given a date and an array of classes and should return the array of classes that will be set on the rendered calendar. Click here for an example highlighting weekends.
navDomContent (default: {prev: ‘<', next: '>‘}): html content for the month navigation links. In case you want to set something more fancy like icons or images.
* **classes**: in case you want to change the name of the classes used in the calendar.
* **monthNames**: add a new month set in the language of your choice. See here for an example of a calendar in icelandic
* **weekDays**: add a new week set in the language of your choice
* **switchMonthOnHoverDelay**: on a range selection spanning over multiple months, the delay during which next month days should be hovered over before the calendar goes to the neighboring month

# Methods

* **disable**: disable the calendar
* **enable**: enable the calendar
* **showNext**: render following month
* **showPrevious**: render previous month
* **setSelected(newSelection, updateMonth)**: set new selection. newSelection is an object containing two indexes: begin and end, each referring to a date.
* **updateMonth** is a boolean indicating if the month of the start of the selection should be displayed.