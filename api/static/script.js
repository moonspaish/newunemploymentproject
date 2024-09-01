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
    legendScale = 0.7,
    title = "2019 Romanian Presidential Election" // Added title parameter
}) {
    // Define a margin to make space for the title
    const margin = { top: 60, right: 20, bottom: 20, left: 20 }; // Adjust the top margin to fit the title
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(containerId)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "map");

    // Add a title to the map
    if (title) {
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", margin.top / 2) // Adjust the position to be within the margin
            .attr("text-anchor", "middle")
            .attr("font-family", '-apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"')
            .attr("font-size", width < 800 ? "16px" : "24px") // Smaller font size for mobile
            .attr("font-weight", "bold")
            .text(title)
            .call(wrapText, width - margin.left - margin.right); // Ensure the title wraps if too long
    }

    const projection = d3.geoMercator();
    const path = d3.geoPath().projection(projection);

    // Load the GeoJSON data
    d3.json(geoJsonUrl).then(function (data) {
        projection.fitSize([width - margin.left - margin.right, innerHeight], data);

        // Draw the map
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
            .attr("stroke-width", strokeWidth)
            .attr("transform", `translate(0, ${margin.top})`); // Adjust map down by top margin

        // Determine if the device is mobile-sized
        const isMobile = width < 800;

        // Add the legend
        const legendGroup = svg.append("g")
            .attr("class", "legend-group")
            .attr("transform", isMobile ? `translate(0, ${height - 20}) scale(${legendScale})` : `translate(${width - 200}, 70) scale(${legendScale})`)
            .attr("text-anchor", "start");

        const legendItemWidth = isMobile ? width / 1.95 : 150;
        const legendXOffset = isMobile ? legendItemWidth * 0.05 : 0;

        // Add legend items
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
                .attr("x", 25)
                .attr("y", 15)
                .attr("font-size", isMobile ? "11px" : "18px")
                .text(party)
                .attr("alignment-baseline", "middle");
        });
    }).catch(function (error) {
        console.log("Error loading GeoJSON data:", error);
    });

    // Function to wrap text
    function wrapText(text, width) {
        text.each(function () {
            const text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                lineHeight = 1.1, // ems
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")) || 0,
                line = [],
                tspan = text.text(null).append("tspan").attr("x", text.attr("x")).attr("y", y).attr("dy", `${dy}em`);

            let word,
                lineNumber = 0;

            while ((word = words.pop())) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan")
                        .attr("x", text.attr("x"))
                        .attr("y", y)
                        .attr("dy", `${++lineNumber * lineHeight + dy}em`)
                        .text(word);
                }
            }
        });
    }
}



// Example usage of the function:
const customColormaps = {
    'Klaus-Werner Iohannis': d3.scaleQuantize().domain([0, 100]).range(['#fae14f', '#e1c842', '#af9c31', '#7d7021', '#4b4210']),
    'Vasilica-Viorica Dancilă': d3.scaleQuantize().domain([0, 100]).range(['#ee2b31', '#d41118', '#a50d13', '#760a0d', '#470608']),
    'Hunor Kelemen': d3.scaleQuantize().domain([0, 100]).range(['#5bbd6b', '#42a452', '#337f40', '#255b2d', '#16371b']),
};
width1 = document.querySelector("#map").clientWidth;
const isMobile = window.innerWidth < 800;
drawMap({
    containerId: "#map",
    width: width1,
    height: isMobile ? 350 : 600,
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