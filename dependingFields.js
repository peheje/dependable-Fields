/*
 * Javascript Dependable fields
 * contradel
 *
 * Copyright 2014 Peter Helstrup Jensen
 * Released under the MIT license (do whatever you want - just leave my name on it)
 * http://opensource.org/licenses/MIT
 */

var InitDependableFields = function (options) {

    //Add calculations here
    //params will be as string, so do the right conversion before using
    //All results will be converted to string after returning
    var calculations = {

        "specificCalculation": function (params) {
            var depA = parseFloat(params[0]);
            var depE = parseFloat(params[1]);
            var depC = parseFloat(params[2]);

            if (depC > 100) {
                return depE;
            } else {
                var res = (depA / depE) + 2 * depC;
                return res;
            }

        },

        //sum parameters: unlimited (numbers)
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

        //multiply parameters: unlimited (numbers)
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

        //divide parameters: 2 (numbers)
        "divide": function (params) {
            var numerator = parseFloat(params[0]);
            var denominator = parseFloat(params[1]);

            return (numerator / denominator);
        },

        //copy parameters: 1 (variable)
        "copy": function (params) {
            return params[0];
        },

        //sqrt parameters: unlimited (numbers)
        "sqrt": function (params) {
            return Math.sqrt(this.sum(params));
        },

        //concatenate parameters: unlimited (strings)
        "concatenate": function (params) {
            var text = "";
            for (var i = 0; i < params.length; i++) {
                text += params[i];
                if (i != params.length - 1) {
                    text += " ";
                }
            }
            return text;
        },

        //percentageOf parameters: 2 (percentage, amount)
        "percentageOf": function (params) {
            var percent = parseFloat(params[0]) / 100;
            var amount = parseFloat(params[1]);
            return percent * amount;
        },

        //days parameters: 2 (from, to)
        "days": function (params) {
            var from = parseEuropeanDate(params[0]);
            var to = parseEuropeanDate(params[1]);

            var ticks = to - from;
            var msPerDay = 1000 * 60 * 60 * 24;
            var days = ticks / msPerDay;
            return days;
        },

        //today parameters: none
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
    };

    //Parse string as dd-mm-yyyy return date
    var parseEuropeanDate = function (timeString) {
        var delimiter = "-";
        if (timeString.indexOf("/") >= 0) {
            delimiter = "/";
        }

        var parts = timeString.split(delimiter);
        var dt = new Date(parseInt(parts[2], 10),
            parseInt(parts[1], 10) - 1,
            parseInt(parts[0], 10));
        return dt;
    };

    var checkFunctionExist = function (funcName) {
        if (calculations[funcName]) {
            return true;
        } else {
            console.log("The calculation: '" + funcName + "' doesn't exist.");
            return false;
        }
    }

    //idSelectorStrategy can be changed by the options
    var idSelectorStrategy = function (id) {
        return $("#" + id);
    }
    var idAttribute = "#";


    //if option calc id is used, use instead of normal id
    if (options && options.calcId) {
        idSelectorStrategy = function (id) {
            return $("input[calcId='" + id + "']");
        }
        idAttribute = "calcId";
    }


    $(document).ready(function () {
        //Returns an array of ids from the calculation attribute
        var dependenciesId = function (calculationValue) {
            var dep = calculationValue.split(" ");
            dep.shift();
            return dep;
        };

        //Returns the dependencies as a JQuery collection from an array of dependencies ids
        var dependenciesAsJquery = function (dependenciesId) {
            var selector = $();
            for (var i = 0; i < dependenciesId.length; i++) {
                var item = idSelectorStrategy(dependenciesId[i]);
                selector = selector.add(item);
            }
            return selector;
        };

        //Returns an array of values given from the dependencies as a JQuery collection
        var dependenciesAsValue = function (dependenciesAsJquery) {
            var params = [];
            dependenciesAsJquery.each(function () {
                params.push($(this).val());
            });
            return params;
        };

        //Returns the function name from the calculation attribute
        var functionName = function (calculationValue) {
            var name = calculationValue.split(" ");
            return name.splice(0, 1)[0];
        };

        //Returns array of display names given the ids of the dependables
        var dependenciesAsDisplayNames = function (dependenciesId) {

            var displayNames = [];

            for (var i = 0; i < dependenciesId.length; i++) {
                var field = idSelectorStrategy(dependenciesId[i]);

                var displayName = field.prev().text();;
                if (displayName) {
                    displayNames.push(displayName);
                } else {
                    displayNames.push($(dependenciesId[i]).val());
                }
            }

            return displayNames;
        };

        //For each dependent field, add the necessary logic
        var dependingFields = $("input[calculation]");
        dependingFields.each(function (index, item) {
            var $origin = $(this);
            var attrValue = $origin.attr("calculation");

            //Parse my calculation value to get function name assigned to me, id of dependencies and a selector for these
            var func = functionName(attrValue);
            var depIds = dependenciesId(attrValue);
            var depJquery = dependenciesAsJquery(depIds);

            //If show tooltip, add that to my title attribute
            if (options && options.showTooltip) {

                //Get the dependencies as text, assumes a sibling div before with name
                var depDisplayNames = dependenciesAsDisplayNames(depIds);
                $origin.attr("title", func + " (" + depDisplayNames.toString() + ")");

                //If bootstrap 3 is enabled, use their tooltips
                var bootstrap3_enabled = (typeof $().emulateTransitionEnd == "function");
                if (bootstrap3_enabled) {
                    $(item).attr("data-toggle", "tooltip");
                    $("[data-toggle='tooltip']").tooltip({
                        container: "body"
                    });
                }
            }

            //If no arguments, assume direct one-time call
            if (depJquery.length <= 0 && checkFunctionExist(func)) {
                $origin.val((calculations[func]()).toString());
            } else {

                //For each dependencies add a change event
                depJquery.change(function () {

                    //The pleasure of closure
                    $origin.trigger("dependenciesChanged");
                });

                //If option instantCalculation
                if (options && !options.disableInstantCalculation) {
                    depJquery.keyup(function () {
                        $(this).change();
                    });
                }

                //add the dependencies changed event to the input with the given function
                $origin.on("dependenciesChanged", function () {
                    var $self = $(this);
                    var attrValue = $self.attr("calculation");
                    var func = functionName(attrValue);

                    //If the function is defined
                    if (checkFunctionExist(func)) {

                        //Get the parameters from my dependencies
                        var depIds = dependenciesId(attrValue);
                        var depAsJquery = dependenciesAsJquery(depIds);
                        var paramValues = dependenciesAsValue(depAsJquery);

                        //Set my value equal to the result of the function given to me
                        var result = calculations[func](paramValues);
                        if ((options && options.showNan) || result || result === 0) {
                            $self.val(result.toString());
                        } else {
                            $self.val("");
                        }

                        //Trigger my change event, to trigger calculations dependent of me
                        $self.trigger("change");
                    }
                });
            }
        });
    });
};
