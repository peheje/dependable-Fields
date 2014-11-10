dependable-Fields
=================

Javascript that makes adding calculations to input fields depending on other input fields easy. Handles dependencies, tooltips etc.

See a demo here:
https://dl.dropboxusercontent.com/u/1823537/dependingFields/index.html

Add dependencies in html:
<input calcid="a" />
<input calcid="b" />
<input calcid="c" calculation="sum a b" />
<input calcid="d" calculation="copy c" />

Initialize the Javascript:
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