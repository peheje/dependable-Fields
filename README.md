<h1>dependable-Fields</h1>
=================

Javascript that makes adding calculations to input fields depending on other input fields easy. Handles dependencies, tooltips etc.

See a demo here:
https://dl.dropboxusercontent.com/u/1823537/dependingFields/index.html

<h3>Add dependencies in html:</h3>
```html
<input calcid="a" />
<input calcid="b" />
<input calcid="c" calculation="sum a b" />
<input calcid="d" calculation="copy c" />
```

<h3>Initialize the Javascript:</h3>
```javascript
            var init = new InitDependableFields({
                //Use calcId instead of id. Default: false
                calcId: true,
                //Disable instant calculations. Default: false
                disableInstantCalculation: false,
                //Show NaN values. Default: false
                showNan: false,
                //Hover over tooltip show dependencies. Default: true
                showTooltip: true
            });
```

<h3>Add your own functions:</h3>
```javascript
"percentageOf": function (params) {
            var percent = parseFloat(params[0]) / 100;
            var amount = parseFloat(params[1]);
            return percent * amount;
        }
```