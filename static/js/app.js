function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var url = "/metadata/" + sample;

  d3.json(url).then(function(response) {

    // Set up empty list to store data from responses so it's easier to call later
    var metadata = []; 

    // Loop through key, value pairs to populate metadata list
    for (let [key, value] of Object.entries(response)) {
      metadata.push({
        key: key,
        value: value
      });
    };
    
    console.log(metadata);

    // Use d3 to select the panel with id of `#sample-metadata` and populate it with the metadata
    d3.select("#sample-metadata")
      .html("") // clear any existing content
      .selectAll("p")
      .data(metadata)
      .enter()
      .append("p")
      .html(function(d) {
        return `${d.key}: ${d.value}`;
      });
  });
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  url = "/samples/" + sample;
  d3.json(url).then(function(response) {
    
    // Set up empty list to store data from responses so it's easier to call later
    var data = []; 

    // Loop through key, value pairs to populate metadata list
    for (let [key, value] of Object.entries(response)) {
      data.push({
        key: key,
        value: value
      });
    };

    console.log(data);

    // @TODO: Build a Bubble Chart using the sample data

    // Define lists of values for parameters
    sample_values_bubble = data[2].value;
    otu_ids_bubble = data[0].value;
    otu_labels_bubble = data[1].value;

    // Define a trace using these parameter lists
    bubble_trace = [{
      x: otu_ids_bubble,
      y: sample_values_bubble,
      hoverinfo: otu_labels_bubble,
      mode: 'markers',
      marker: {
        size: sample_values_bubble,
        color: otu_ids_bubble
      }
    }];

    // Define a layout variable
    var bubble_layout = {
      showlegend: false,
      height: 500,
      width: 1000,
      margin: {
        l: 50,
        r: 0,
        b: 0,
        t: 0,
        pad: 4
      },
      xaxis: {
        title: {
          text: "OTU ID"
        }
     }
    };

    // Draw the bubble chart
    Plotly.newPlot('bubble', bubble_trace, bubble_layout)

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    // Define lists of values for parameters
    sample_values_pie = data[2].value.slice(0,10);
    otu_ids_pie = data[0].value.slice(0,10);
    otu_labels_pie = data[1].value.slice(0,10);
    console.log(otu_labels_pie);

    // Define a trace using these parameter lists
    var pie_trace = [{
      values: sample_values_pie,
      labels: otu_ids_pie,
      hoverinfo: otu_labels_pie,
      hoverlabel: {
        namelength: -1
      },
      type: 'pie'
    }];
    
    // Define a layout variable
    var pie_layout = {
      title: "",
      height: 500,
      width: 500,
      margin: {
        l: 50,
        r: 0,
        b: 50,
        t: 0,
        pad: 4
      }
    };
    
    // Draw the pie chart
    Plotly.newPlot('pie', pie_trace, pie_layout);

  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
