// From https://developers.arcgis.com/javascript/latest/sample-code/sandbox/index.html?sample=widgets-timeslider
// And https://developers.arcgis.com/javascript/latest/sample-code/sandbox/index.html?sample=timeslider-filter
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/TimeSlider",
    "esri/widgets/Expand",
    "esri/widgets/Legend"
], function(Map, MapView, FeatureLayer, TimeSlider, Expand, Legend) {
    var fatalityLayer = new FeatureLayer({
        portalItem: {
            id: "3429bfe96b9247ebaffe7447382d4b3c"
        },
        //url: "https://services1.arcgis.com/4ezfu5dIwH83BUNL/arcgis/rest/services/Airplane_Crashes_and_Fatalities/FeatureServer",
        popupEnabled: true,
        popupTemplate: {
            "title": "{USER_Location}",
            "fieldInfos": [
                 {
                    "fieldName": "USER_Time",
                    "visible": false,
                    "isEditable": true,
                    "label": "Time"
                },
                {
                    "fieldName": "USER_Location",
                    "visible": false,
                    "isEditable": true,
                    "label": "Location"
                },
                {
                    "fieldName": "USER_Operator",
                    "visible": false,
                    "isEditable": true,
                    "label": "Operator"
                },
                {
                    "fieldName": "USER_Flight__",
                    "visible": false,
                    "isEditable": true,
                    "label": "Flight #"
                },
                {
                    "fieldName": "USER_Route",
                    "visible": false,
                    "isEditable": true,
                    "label": "Route"
                },
                {
                    "fieldName": "USER_AC_Type",
                    "visible": false,
                    "isEditable": true,
                    "label": "AC Type"
                },
                {
                    "fieldName": "USER_Registration",
                    "visible": false,
                    "isEditable": true,
                    "label": "Registration"
                },
                {
                    "fieldName": "USER_cn_ln",
                    "visible": false,
                    "isEditable": true,
                    "label": "cn/ln"
                },
                {
                    "fieldName": "USER_Aboard",
                    "visible": true,
                    "isEditable": true,
                    "label": "Aboard"
                },
                {
                    "fieldName": "USER_Aboard_Passangers",
                    "visible": true,
                    "isEditable": true,
                    "label": "Aboard Passangers"
                },
                {
                    "fieldName": "USER_Aboard_Crew",
                    "visible": true,
                    "isEditable": true,
                    "label": "Aboard Crew"
                },
                {
                    "fieldName": "USER_Fatalities",
                    "visible": true,
                    "isEditable": true,
                    "label": "Fatalities",
                    "format": {
                        "places": 0,
                        "digitSeparator": true
                    }
                },
                {
                    "fieldName": "USER_Fatalities_Passangers",
                    "visible": true,
                    "isEditable": true,
                    "label": "Fatalities Passangers"
                },
                {
                    "fieldName": "USER_Fatalities_Crew",
                    "visible": true,
                    "isEditable": true,
                    "label": "Fatalities Crew"
                },
                {
                    "fieldName": "USER_Ground",
                    "visible": true,
                    "isEditable": true,
                    "label": "Ground",
                    "format": {
                        "places": 0,
                        "digitSeparator": true
                    }
                },
                {
                    "fieldName": "USER_Summary",
                    "visible": true,
                    "isEditable": true,
                    "label": "Summary"
                },
                {
                    "fieldName": "expression/expr0",
                    "visible": true,
                    "format": {
                        "places": 2,
                        "digitSeparator": true
                    }
                },
                {
                    "fieldName": "expression/expr1",
                    "visible": true,
                    "format": {
                        "places": 2,
                        "digitSeparator": true
                    }
                },
                {
                    "fieldName": "expression/expr2",
                    "visible": true,
                    "format": {
                        "places": 2,
                        "digitSeparator": true
                    }
                }
            ],
            "content": "Crash Date: {USER_Date}<br />Crash Time: {USER_Time} <br /> <br /><b>Total Fatality Rate: {expression/expr0}%</b><br /><br />Total Aboard: {USER_Aboard}<br />Total Fatalities: {USER_Fatalities} <br /> <br />Summary: <br />{USER_Summary}",
            "showAttachments": false,
            "expressionInfos": [
                {
                    "name": "expr0",
                    "title": "Pct_Fatality",
                    "expression": "Round($feature[\"USER_Fatalities\"]/$feature[\"USER_Aboard\"],4)*100",
                    "returnType": "number"
                },
                {
                    "name": "expr1",
                    "title": "Pct_Crew",
                    "expression": "Round($feature[\"USER_Fatalities_Crew\"]/$feature[\"USER_Aboard_Crew\"],4)*100",
                    "returnType": "number"
                },
                {
                    "name": "expr2",
                    "title": "Pct_Passengers",
                    "expression": "Round($feature[\"USER_Fatalities_Passangers\"]/$feature[\"USER_Aboard_Passangers\"],4)*100",
                    "returnType": "number"
                }
            ],
        }

    });

    const map = new Map({
        basemap: "gray",
        layers: [fatalityLayer],
        autoResize: false,
    });

    const view = new MapView({
        map: map,
        container: "map-div",
        zoom: 2,
        center: [0, 0],
        ui: {
            components: ["compass", "zoom"]
        },
        navigation: {
            mouseWheelZoomEnabled: false
        }

    });

    // create a new time slider widget
    // set other properties when the layer view is loaded
    // by default timeSlider.mode is "time-window" - shows
    // data falls within time range
    const timeSlider = new TimeSlider({
        container: "time-slider",
        playRate: 100,
        stops: {
            interval: {
                value: 1,
                unit: "years"
            }
        }
    });
    view.ui.add(timeSlider, "manual");

    // wait till the layer view is loaded
    view.whenLayerView(fatalityLayer).then(function(lv) {
        layerView = lv;

        // start time of the time slider - 1/1/1908
        const start = new Date(1908, 0, 1);
        // set time slider's full extent to
        // 1/1/1908- until end date of layer's fullTimeExtent
        timeSlider.fullTimeExtent = {
            start: start,
            end: fatalityLayer.timeInfo.fullTimeExtent.end
        };
        // Show the full range on load
        const end = new Date(2019, 11, 31);

        // Values property is set so that timeslider
        // widget show the first day. We are setting
        // the thumbs positions.
        timeSlider.values = [start, end];
    });

    // watch for time slider timeExtent change
    timeSlider.watch("timeExtent", function() {
        // only show earthquakes happened up until the end of
        // timeSlider's current time extent.
        var startTime = buildTimestamp(timeSlider.timeExtent.start, true);
        var endTime = buildTimestamp(timeSlider.timeExtent.end, false);
        fatalityLayer.definitionExpression = "USER_Date <= timestamp '" + endTime  + "' AND USER_Date >= timestamp'"  + startTime + "'";
            // Change to the following if graying out earlier dates instead of filter
            //"USER_Date <= timestamp '" + endTime  + "'";//+ "' AND USER_Date >= timestamp'"  + startTime + "'";

        // This will gray out crashes that happened before the time slider's current
        // timeExtent... leaving footprint of crashes that already happened
        /*layerView.effect = {
            filter: {
                timeExtent: timeSlider.timeExtent,
                geometry: view.extent
            },
            excludedEffect: "grayscale(20%) opacity(12%)"
        };*/
    });

    function buildTimestamp(timeIn, useDayStart) {
        const zeroPad = (num, places) => String(num).padStart(places, '0');
        let ts = timeIn.getFullYear() + '-';
        ts += zeroPad(timeIn.getMonth()+1, 2) + '-';
        ts += zeroPad(timeIn.getDate(), 2) + ' ';
        ts += useDayStart ? '00:00:00' : '11:59:59';
        return(ts);
    }

    const legend = new Legend({
        view: view
    });
    const legendExpand = new Expand({
        expandIconClass: "esri-icon-collection",
        expandTooltip: "Legend",
        view: view,
        //expanded: true,
        content: legend,
        expanded: false
    });
    view.ui.add(legendExpand, "top-left");
});
