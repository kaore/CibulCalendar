# DMT

Date Management Tool is a hallucinogenic date picker that enables users to easily pick dates or date ranges.

Here is the simplest way to get it running:

```JavaScript
function onload() {
  // will stick to element <input type="text" id="basic"/>
  DMT('#basic');
}
```

Features include:

* Drag and drop range selection
* Single date selection
* Multilingual
* Single line set up
* Fully Customizable (see details below)


How to use

DMT has two main modes:

Inline mode will continiously display the calendar inside the given container element

```JavaScript
DMT('#calendar', { inline: true });
```

Regular mode will listen to click event on given element and will display calendar positioned below that

```JavaScript
DMT('#myDateInput');
```

For range selections with this mode, you can pass down two elements to print begin and end dates seperately
```JavaScript
DMT('#myForm .calendarContainer', #myForm .begin', '#myForm .end', options);
```


# Options

* **range** (default: true): if false, range date picking is disabled. If set true explicitly, it will force ranged selection.
* **enabled** (default: true): state of the calendar at init
* **lang** (default: ‘en’): Language of the calendar. can be (en, fr, it, es, sv, no, da, tr). You can extend this with any other language (see below).
* **firstDayOfWeek** (default: 1): first day of the week on the calendar. 0 for sunday and onwards.
* **selected** (default: false): default selection at initialization. Should be a object: {begin: Date, end: Date}
* **filter**: (default: false): callback called on each calendar render to handle date classes. If set, function is given a date and an array of classes and should return the array of classes that will be set on the rendered calendar.
* **navDomContent**: (default: {prev: ‘<', next: '>‘}): html content for the month navigation links. In case you want to set something more fancy like icons or images.
* **classes**: in case you want to change the name of the classes used in the calendar.
* **inline**: (default: false) sets display mode of calendar to inline.
* **monthSpan**: (default: 1) defines number of months to display in calendar.
* **monthNames**: add a new month set in the language of your choice.
* **weekDays**: add a new week set in the language of your choice.
* **switchMonthOnHoverDelay**: on a range selection spanning over multiple months, the delay during which next month days should be hovered over before the calendar goes to the neighboring month.

# Methods

* **disable**: disable the calendar
* **enable**: enable the calendar
* **show**: show the calendar
* **hide**: hide the calendar
* **showNext**: render following month
* **showPrevious**: render previous month
* **setSelected(newSelection, updateMonth)**: set new selection. newSelection is an object containing two indexes: begin and end, each referring to a date
* **getSelected**: returns selected date. Returns { being: Date, end: Date } if range option is true
