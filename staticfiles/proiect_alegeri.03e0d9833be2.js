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

async function initialize() {
    const response = await fetch('https://raw.githubusercontent.com/moonspaish/simplified/main/county.geojson');
    const geojsonData = await response.json();
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
            updateMap(filteredData);
        } else {
            console.error('No data available for the selected county.');
        }
    });

    // Initialize with all counties
    const filteredData = geojsonData.features;
    const votesData = extractVotesData(filteredData);
    if (votesData) {
        createBarPlot(votesData);
        updateMap(filteredData);
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
    const margin = { top: 20, right: 130, bottom: 40, left: 200 };
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

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.selectAll("rect")
        .data(votesData)
        .enter()
        .append("rect")
        .attr("x", x(0))
        .attr("y", d => y(d.candidate))
        .attr("width", d => x(d.votes))
        .attr("height", y.bandwidth())
        .attr("fill", d => d.color);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.selectAll("text.label")
        .data(votesData)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => x(d.votes) + 3)
        .attr("y", d => y(d.candidate) + y.bandwidth() / 2 + 5)
        .text(d => d.votes);
}

function updateMap(filteredData) {
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
    svg.selectAll("path")
        .data(filteredData)
        .enter()
        .append("path")
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
}

document.addEventListener('DOMContentLoaded', initialize);
