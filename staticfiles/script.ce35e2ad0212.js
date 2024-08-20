// Import the D3 library (ensure this is included in your HTML file or script setup)
// <script src="https://d3js.org/d3.v7.min.js"></script>
// <script src="https://d3-legend.susielu.com/d3-legend.min.js"></script>

function drawMap({
    containerId,       // The ID of the container where the SVG will be appended
    width,             // Width of the SVG
    height,            // Height of the SVG
    geoJsonUrl,        // URL of the GeoJSON data
    colormaps,         // Object defining custom color scales for parties
    strokeColor = "white", // Optional: stroke color for the county borders
    strokeWidth = 0.4      // Optional: stroke width for the county borders
}) {
    // Select the container and append an SVG element
    const svg = d3.select(containerId)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "map");

    // Define projection and path generator
    const projection = d3.geoMercator();
    const path = d3.geoPath().projection(projection);

    // Load GeoJSON data and draw the map
    d3.json(geoJsonUrl).then(function (data) {
        // Fit the projection to the GeoJSON data
        projection.fitSize([width, height], data);

        // Bind data and create paths for each feature
        svg.selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "county")
            .attr("fill", d => {
                // Get the party and percentage from the properties
                const party = d.properties.pred_party;
                const percent = d.properties.pred_percent;

                // Determine the fill color based on the colormap
                return colormaps[party] ? colormaps[party](percent) : 'gray';
            })
            .attr("stroke", strokeColor)
            .attr("stroke-width", strokeWidth);

        // Add legend for each party's colormap
        Object.keys(colormaps).forEach((party, index) => {
            const colorScale = colormaps[party];
            const quantiles = colorScale.range().map(color => colorScale.invertExtent(color)[0]);
            // Add the maximum domain value for the last color range
            quantiles.push(colorScale.domain()[1]);

            const legend = d3.legendColor()
                .scale(colorScale)
                .title(party)
                .shapeWidth(30)
                .shapePadding(1)
                .cells(quantiles.length - 1) // Number of steps in the legend
                .labels(quantiles.map(d3.format(".0f"))) // Use the quantile boundaries as labels
                .labelOffset(10) // Adjust the space between the labels and color shapes
                .labelAlign("start") // Align labels to the start of the color shapes
                .orient('horizontal'); // Legend orientation
            // Append a group element for the legend and position it
            svg.append("g")
                .attr("class", "legend")
                .attr("transform", `translate(${10}, ${height - (100 * (index + 1))})`) // Position legend
                .call(legend);
        });
    }).catch(function (error) {
        console.log("Error loading GeoJSON data:", error);
    });
}

// Example usage of the function:
const customColormaps = {
    'Klaus-Werner Iohannis': d3.scaleQuantize().domain([0, 100]).range(['#ffe01a', '#e6c700', '#b39b00', '#806f00', '#4d4200']),
    'Vasilica-Viorica Dancilă': d3.scaleQuantize().domain([0, 100]).range(['#ee2b31', '#d41118', '#a50d13', '#760a0d', '#470608']),
    'Hunor Kelemen': d3.scaleQuantize().domain([0, 100]).range(['#5bbd6b', '#42a452', '#337f40', '#255b2d', '#16371b']),
};

drawMap({
    containerId: "#map",
    width: 1300,
    height: 600,
    geoJsonUrl: "https://raw.githubusercontent.com/moonspaish/simplified/main/uat.geojson",
    colormaps: customColormaps
});

drawMap({
    containerId: "#map2",
    width: 1300,
    height: 600,
    geoJsonUrl: "https://raw.githubusercontent.com/moonspaish/simplified/main/county.geojson",
    colormaps: customColormaps
});

// script.js
document.getElementById('downloadBtn').addEventListener('click', function () {
    // URL of the PDF file you want to download
    var pdfUrl = 'Vasile_Dan_CV_2024 (1).pdf';

    // Create a temporary link element
    var link = document.createElement('a');
    link.href = pdfUrl;

    // Set the download attribute with a default file name
    link.download = 'vasile_dan_resume.pdf';

    // Append the link to the body (necessary for Firefox)
    document.body.appendChild(link);

    // Trigger the click event on the link
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
});
