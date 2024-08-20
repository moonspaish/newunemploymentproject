// Import the D3 library (ensure this is included in your HTML file or script setup)
// <script src="https://d3js.org/d3.v7.min.js"></script>
// <script src="https://d3-legend.susielu.com/d3-legend.min.js"></script>

function drawMap({
    containerId,
    width,
    height,
    geoJsonUrl,
    colormaps,
    strokeColor = "white",
    strokeWidth = 0,
    legendScale = 0.7
}) {
    const svg = d3.select(containerId)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "map");

    const projection = d3.geoMercator();
    const path = d3.geoPath().projection(projection);

    d3.json(geoJsonUrl).then(function (data) {
        projection.fitSize([width, height], data);

        svg.selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "county")
            .attr("fill", d => {
                const party = d.properties.pred_party;
                const percent = d.properties.pred_percent;
                return colormaps[party] ? colormaps[party](percent) : 'gray';
            })
            .attr("stroke", strokeColor)
            .attr("stroke-width", strokeWidth);

        const isMobile = width < 768; // Adjust this threshold as needed
        const legendGroup = svg.append("g")
            .attr("class", "legend-group")
            .attr("transform", isMobile ? `translate(0, ${height - 150}) scale(${legendScale})` : `translate(${width - 200}, 70) scale(${legendScale})`)
            .attr("text-anchor", "start");

        const legendItemWidth = isMobile ? width / 1.95 : 150; // Calculate width for each item
        const legendXOffset = isMobile ? legendItemWidth * 0.05 : 0; // Adjust the X offset for centering on mobile

        Object.keys(colormaps).forEach((party, index) => {
            const colorScale = colormaps[party];
            const domain = colorScale.domain();
            const secondToLastColor = colorScale(domain[domain.length - 2]);

            const legend = legendGroup.append("g")
                .attr("class", "legend-item")
                .attr("transform", isMobile ? `translate(${index * legendItemWidth + legendXOffset}, 0)` : `translate(0, ${index * 30})`);

            legend.append("rect")
                .attr("width", 20)
                .attr("height", 20)
                .attr("fill", secondToLastColor);

            legend.append("text")
                .attr("x", 25) // Position text to the right of the rectangle
                .attr("y", 15) // Center the text vertically relative to the rectangle
                .attr("font-size", isMobile ? "11px" : "18px")
                .text(party)
                .attr("alignment-baseline", "middle");
        });
    }).catch(function (error) {
        console.log("Error loading GeoJSON data:", error);
    });
}



// Example usage of the function:
const customColormaps = {
    'Klaus-Werner Iohannis': d3.scaleQuantize().domain([0, 100]).range(['#fae14f', '#e1c842', '#af9c31', '#7d7021', '#4b4210']),
    'Vasilica-Viorica Dancilă': d3.scaleQuantize().domain([0, 100]).range(['#ee2b31', '#d41118', '#a50d13', '#760a0d', '#470608']),
    'Hunor Kelemen': d3.scaleQuantize().domain([0, 100]).range(['#5bbd6b', '#42a452', '#337f40', '#255b2d', '#16371b']),
};
width1 = document.querySelector("#map").clientWidth;
drawMap({
    containerId: "#map",
    width: width1,
    height: 600,
    geoJsonUrl: "https://raw.githubusercontent.com/moonspaish/simplified/main/uat.geojson",
    colormaps: customColormaps
});

drawMap({
    containerId: "#map2",
    width: width1,
    height: 600,
    geoJsonUrl: "https://raw.githubusercontent.com/moonspaish/simplified/main/county.geojson",
    colormaps: customColormaps
});
// script.js
document.getElementById('downloadBtn').addEventListener('click', function () {
    // URL of the PDF file you want to download
    var pdfUrl = 'static/Vasile_Dan_CV.pdf';

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
function myFunction() {
    const email = "danvas011@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
        const tooltip = document.getElementById("myTooltip");
        tooltip.innerHTML = "Email copied to clipboard";
    });
}

function outFunc() {
    const tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "";
}

document.addEventListener('DOMContentLoaded', function () {
    const button = document.querySelector('.tooltip');
    button.addEventListener('mouseover', function () {
        const tooltip = document.getElementById("myTooltip");
        tooltip.innerHTML = "Copy to clipboard";
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector('.toggle-button');
    const navbarLinks = document.querySelector('.navbar-links');

    toggleButton.addEventListener('click', () => {
        navbarLinks.classList.toggle('active');
    });
});