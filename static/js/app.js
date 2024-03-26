var jsDataset;
function init(){

    const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

    const dataJson = d3.json(url);
    //console.log("Sample json: ", dataJson);
    //var jsDataset = data;

    //Get the dropdown select element
    let listBoxSelector = d3.select("#selDataset");
    // Fetch the JSON data and console log it
    d3.json(url).then(function(data) {
        jsDataset = data; //Set global data var
        //console.log(data); //display data for previous analysis 
        //console.log(listBoxSelector)

        // Populate the dropdown with options
        //It loops through the data's names property and appends an <option> element to the dropdown list for each name
        let dataNames = data.names;   
        for (let i = 0; i < dataNames.length; i++) {
            listBoxSelector.append("option").text(dataNames[i]).property("value", dataNames[i]);
            //listBoxSelector.append("option").text(dataNames[i]);
        }; 

        // Call function to create initial bar chart
        updateBarChart(dataNames[0], data);

        // Call function to create initial bubble chart
        updateBubbleChart(dataNames[0], data);

        // loops through metadata
        let dataMetadata = data.metadata;   
        for (let i = 0; i < dataMetadata.length; i++) {
            listBoxSelector.append("option").text(dataMetadata[i]).property("value", dataMetadata[i]); 
        }; 
        updateSampleMetadata(dataMetadata[0], data);
        
    })
}

//
let text = d3.select(".card-body")

// // Event listener for dropdown change
// d3.select("#selDataset").on("change", function() {
//     var selectedSample = d3.select(this).property("value");
//     d3.json("data/samples.json").then(function(data) {
//         updateBarChart(selectedSample, data);
//         updateBubbleChart(selectedSample, data);
//         updateSampleMetadata(selectedSample, data);
//     });
// });


// Function to handle change in dropdown selection
function optionChanged(sampleSelected) {
    //Display bar chart
    updateBarChart(sampleSelected, jsDataset);

    //Display BubbleChart
    updateBubbleChart(sampleSelected, jsDataset);

    //Display Demo info
    let dataMetadata_oc = jsDataset.metadata;   
        for (let i = 0; i < dataMetadata_oc.length; i++) {
            if (dataMetadata_oc[i].id == sampleSelected) {
                var result = dataMetadata_oc[i]; //send the whole record to the function
            }
                
        }; 
    //console.log(result);
    updateSampleMetadata(result, jsDataset);
}

function updateBubbleChart(selectedSample, data) {
    // Find the index of the selected sample
    let index = data.names.indexOf(selectedSample);

    // Get the sample data
    let sampleValues = data.samples[index].sample_values;
    let otuIds = data.samples[index].otu_ids;
    let otuLabels = data.samples[index].otu_labels;

    // Create the trace for the bubble chart
    let trace = {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
            size: sampleValues,
            color: otuIds,
            colorscale: 'Earth'
        }
    };

    // Create the data array
    var data = [trace];

    // Define the layout
    let layout = {
        // title: "Bubble Chart for Sample ${selectedSample}",
        xaxis: { title: "OTU ID" },
        // yaxis: { title: "Sample Values" }
    };

    // Plot the chart
    Plotly.newPlot("bubble", data, layout);
}


// Function to update the bar chart based on the selected sample
function updateBarChart(selectedSample, data) {
    // Find the index of the selected sample
    let index = data.names.indexOf(selectedSample);

    // Get the sample data
    // Slice the first 10 objects for plotting
    let sampleValues = data.samples[index].sample_values.slice(0, 10);

    // Reverse the array to accommodate Plotly's defaults
    sampleValues.reverse();

    let otuIds = data.samples[index].otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    let otuLabels = data.samples[index].otu_labels.slice(0, 10).reverse();

    // Create the trace for the bar chart
    let trace = {
        x: sampleValues,
        y: otuIds,
        text: otuLabels,
        hovertext: otuLabels,
        type: "bar",
        orientation: "h"
    };

    // Create the data array
    var data = [trace];

    // Define the layout
    let layout = {
        //title: "Top 10 OTUs for Sample ${selectedSample}"
        //xaxis: { title: "Sample Values" },
        //yaxis: { title: "OTU ID" }
        // margin: {
        //     l: 100,
        //     r: 100,
        //     t: 100,
        //     b: 100}
    };

    // Plot the chart
    //Plotly.newPlot("bar", data, layout);
    Plotly.newPlot("bar", data, layout, { displayModeBar: false });
}



// Function to update the sample metadata display
function updateSampleMetadata(sampleMetadata) {

    //console.log(sampleMetadata); {id: 940, ethnicity: 'Caucasian', gender: 'F', age: 24, location: 'Beaufort/NC', …}

    // Select the sample metadata display element #id
    let sampleMetadataDisplay = d3.select("#sample-metadata"); 

    // Clear existing content
    sampleMetadataDisplay.html("");

    // Create a table element
    let table = sampleMetadataDisplay.append("table").classed("table", true);
     // Loop through each key-value pair in the metadata
    Object.entries(sampleMetadata).forEach(([key, value]) => {
        // Append each key-value pair as a row in the table
        let tableRow = table.append("tr");
        tableRow.append("td").text(`${key}:`);
        tableRow.append("td").text(value);
    });
}

// Initialize the dashboard
init();

