<h1>dependable-Fields</h1>
=================

Javascript that makes adding calculations to input fields depending on other input fields easy. Handles dependencies and tooltips. And even has a few options.

See a demo here:
https://dl.dropboxusercontent.com/u/1823537/dependingFields/index.html

<h3>Add dependencies in html:</h3>
```html
<input calcid="a" />
<input calcid="b" />
<input calcid="c" calculation="sum a b" />
<input calcid="d" calculation="copy c" />
```

<h3>(optional) Use bootstrap to enable nice dependency name tooltips on hover over</h3>
```html
<div class="form-group">
    <div class="input-group">
        <div class="input-group-addon">X</div>
        <input calcId="sum1" type="number" class="form-control">
    </div>
</div>
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

<h3>Use built-in functions</h3>
```javascript
    "sum": function (params) {
            var sum = 0;

            for (var i = 0; i < params.length; i++) {
                if (!params[i]) {
                    params[i] = 0;
                }
                sum += parseFloat(params[i]);
            }

            return sum;
        },
        
        "multiply": function (params) {
            var res = 1;

            for (var i = 0; i < params.length; i++) {
                if (!params[i]) {
                    params[i] = 1;
                }
                res *= parseFloat(params[i]);
            }

            return res;
        },
        
        "divide": function (params) {
            var numerator = parseFloat(params[0]);
            var denominator = parseFloat(params[1]);

            return (numerator / denominator);
        },

        "days": function (params) {
            var from = parseEuropeanDate(params[0]);
            var to = parseEuropeanDate(params[1]);

            var ticks = to - from;
            var msPerDay = 1000 * 60 * 60 * 24;
            var days = ticks / msPerDay;
            return days;
        },
        
        "sqrt": function (params) {
            return Math.sqrt(this.sum(params));
        },
        
        "today": function () {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();

            if (dd < 10) {
                dd = "0" + dd;
            }

            if (mm < 10) {
                mm = "0" + mm;
            }

            today = dd + "-" + mm + "-" + yyyy;
            return today;
        },
```

See code for more.

<h3>Add your own functions:</h3>
```javascript
"percentageOf": function (params) {
            var percent = parseFloat(params[0]) / 100;
            var amount = parseFloat(params[1]);
            return percent * amount;
        }
```