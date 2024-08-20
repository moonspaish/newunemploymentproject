document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector('.toggle-button');
    const navbarLinks = document.querySelector('.navbar-links');

    toggleButton.addEventListener('click', () => {
        navbarLinks.classList.toggle('active');
    });
});

const candidateColors = {
    "Klaus-Werner Iohannis": "#f7d900",
    "Theodor Paleologu": "#33FF57",
    "Ilie-Dan Barna": "#3357FF",
    "Hunor Kelemen": "#0e8542",
    "Vasilica-Viorica Dancilă": "#d52b22",
    "Cătălin-Sorin Ivan": "#FFC300",
    "Ninel Peia": "#FF5733",
    "Sebastian-Constantin Popescu": "#33FF57",
    "John-Ion Banu": "#3357FF",
    "Mircea Diaconu": "#FF33A6",
    "Bogdan-Dragoș-Aureliu Marian-Stanoevici": "#A633FF",
    "Ramona-Ioana Bruynseels": "#FFC300",
    "Viorel Cataramă": "#FF5733",
    "Alexandru Cumpănașu": "#33FF57"
};

let uatData = null;

async function initialize() {
    const response = await fetch('https://raw.githubusercontent.com/moonspaish/simplified/main/county.geojson');
    const geojsonData = await response.json();

    // Fetch UAT data
    const uatResponse = await fetch('https://raw.githubusercontent.com/moonspaish/simplified/main/uat.geojson');
    uatData = await uatResponse.json();

    const counties = ['alba', 'arad', 'arges', 'bacau', 'bihor', 'bistritanasaud', 'botosani', 'brasov', 'braila', 'bucuresti', 'buzau', 'carasseverin', 'cluj', 'constanta', 'covasna', 'calarasi', 'dolj', 'dambovita', 'galati', 'giurgiu', 'gorj', 'harghita', 'hunedoara', 'ialomita', 'iasi', 'ilfov', 'maramures', 'mehedinti', 'mures', 'neamt', 'olt', 'prahova', 'satumare', 'sibiu', 'suceava', 'salaj', 'teleorman', 'timis', 'tulcea', 'vaslui', 'vrancea', 'valcea'];

    const dropdown = document.getElementById('countyDropdown');
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.text = 'All Counties';
    dropdown.add(allOption);

    counties.forEach(county => {
        const option = document.createElement('option');
        option.value = county;
        option.text = county;
        dropdown.add(option);
    });

    // Event listener for dropdown change
    dropdown.addEventListener('change', function () {
        const selectedCounty = this.value;
        const filteredData = selectedCounty === 'all' ? geojsonData.features : filterData(geojsonData, selectedCounty);
        const votesData = extractVotesData(filteredData);
        if (votesData) {
            createBarPlot(votesData);
            updateMap(filteredData, selectedCounty);
        } else {
            console.error('No data available for the selected county.');
        }
    });

    // Initialize with all counties
    const filteredData = geojsonData.features;
    const votesData = extractVotesData(filteredData);
    if (votesData) {
        createBarPlot(votesData);
        updateMap(filteredData, 'all');
    }
}

function filterData(geojsonData, county) {
    return geojsonData.features.filter(feature => feature.properties.cleaned_county === county);
}

function extractVotesData(filteredData) {
    if (filteredData.length === 0) return null;

    const totalVotes = {};

    filteredData.forEach(feature => {
        const properties = feature.properties;
        Object.keys(candidateColors).forEach(candidate => {
            if (!totalVotes[candidate]) {
                totalVotes[candidate] = 0;
            }
            totalVotes[candidate] += properties[candidate] || 0;
        });
    });

    const votesData = Object.keys(candidateColors).map(candidate => ({
        candidate,
        votes: totalVotes[candidate],
        color: candidateColors[candidate]
    }));

    return votesData;
}

function createBarPlot(votesData) {
    const containerWidth = document.querySelector("#chart").clientWidth;
    const margin = { top: 20, right: 20, bottom: 10, left: 90 };
    const width = containerWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    d3.select("#chart").html(""); // Clear existing chart

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
        .domain([0, d3.max(votesData, d => d.votes)])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(votesData.map(d => d.candidate))
        .range([0, height])
        .padding(0.1);

    // Find the top 4 values
    const top4Values = votesData
        .sort((a, b) => b.votes - a.votes)
        .slice(0, 4)
        .map(d => d.votes);

    // Create the bars
    svg.selectAll("rect")
        .data(votesData)
        .enter()
        .append("rect")
        .attr("x", x(0))
        .attr("y", d => y(d.candidate))
        .attr("width", d => x(d.votes))
        .attr("height", y.bandwidth())
        .attr("fill", d => d.color);

    // Append y-axis with last name labels
    svg.append("g")
        .call(d3.axisLeft(y).tickFormat(name => {
            const parts = name.split(' ');
            return parts[parts.length - 1];  // Return the last part of the name
        }));

    // Append x-axis
    const xAxis = svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Remove x-axis labels, ticks, and line
    xAxis.selectAll("text")  // Remove x-axis labels
        .remove();

    xAxis.selectAll(".tick line")  // Remove x-axis ticks
        .remove();

    // xAxis.select(".domain")  // Remove x-axis line
    //     .remove();

    // Add text labels inside or outside the bars based on space
    svg.selectAll("text.label")
        .data(votesData)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => {
            const xPos = x(d.votes);
            const labelWidth = 50;  // Estimate or calculate the text width if needed
            return xPos + (xPos > (width - labelWidth) ? -5 : 5);  // Move inside if close to the right edge
        })
        .attr("y", d => y(d.candidate) + y.bandwidth() / 2 + 5)  // Center vertically within the bar
        .attr("fill", d => {
            const xPos = x(d.votes);
            const labelWidth = 50;  // Estimate or calculate the text width if needed
            return xPos > (width - labelWidth) ? "white" : "black";  // White for inside, black for outside
        })
        .attr("text-anchor", d => {
            const xPos = x(d.votes);
            return xPos > (width - 50) ? "end" : "start";  // Align text depending on position
        })
        .text(d => d.votes);
}

function updateMap(filteredData, selectedCounty) {
    const width = document.querySelector("#map").clientWidth;
    const height = 500;

    // Create SVG element
    const svg = d3.select("#map")
        .html("") // Clear existing map
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "map");

    // Define projection and path generator
    const projection = d3.geoMercator();

    // Define a path generator
    const path = d3.geoPath().projection(projection);

    // Draw map using GeoJSON data
    projection.fitSize([width, height], { type: "FeatureCollection", features: filteredData });

    // Draw counties
    svg.selectAll("path.county")
        .data(filteredData)
        .enter()
        .append("path")
        .attr("class", "county")
        .attr("d", path)
        .attr("fill", d => {
            const party = d.properties.pred_party;
            const percent = d.properties.pred_percent;
            const color = candidateColors[party];
            const shadedColor = d3.color(color).darker(1 - percent / 100);
            return shadedColor;
        })
        .attr("stroke", "white")
        .attr("stroke-width", 0.5);

    // Filter UATs for the selected county
    const uatInCounty = selectedCounty !== 'all'
        ? uatData.features.filter(uat => uat.properties.cleaned_county === selectedCounty)
        : uatData.features;

    // Draw UATs on top of counties
    svg.selectAll("path.uat")
        .data(uatInCounty)
        .enter()
        .append("path")
        .attr("class", "uat")
        .attr("d", path)
        .attr("fill", d => {
            const party = d.properties.pred_party;
            return candidateColors[party] || "#FFFFFF"; // Default to white if party color is not found
        })
        .attr("stroke", "black")
        .attr("stroke-width", 0.1);
}

document.addEventListener('DOMContentLoaded', initialize);
