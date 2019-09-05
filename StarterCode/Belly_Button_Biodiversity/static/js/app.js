function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url = "/metadata/" + sample;

  d3.json(url).then(function(response) {

    // Set up empty list to store data from responses so it's easier to call later
    var metadata = []; 

    // Loop through key, value pairs to populate data list
    for (let [key, value] of Object.entries(response)) {
      metadata.push({
        key: key,
        value: value
      });
    };
    
    console.log(metadata);

    // Use d3 to select the panel with id of `#sample-metadata` and populate it with the data
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

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

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
