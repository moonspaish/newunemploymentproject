document.addEventListener("DOMContentLoaded", function () {
    // Navbar toggle script
    const toggleButton = document.querySelector('.toggle-button');
    const navbarLinks = document.querySelector('.navbar-links');

    toggleButton.addEventListener('click', () => {
        navbarLinks.classList.toggle('active');
    });

    // Populate dropdown with counties
    const counties = ['alba', 'arad', 'arges', 'bacau', 'bihor', 'bistrita', 'botosani',
        'braila', 'brasov', 'bucuresti', 'buzau', 'calarasi', 'caras', 'cluj',
        'constanta', 'covasna', 'dambovita', 'dolj', 'galati', 'giurgiu',
        'gorj', 'harghita', 'hunedoara', 'ialomita', 'iasi', 'ilfov',
        'maramures', 'mehedinti', 'mures', 'neamt', 'olt', 'prahova',
        'salaj', 'satumare', 'sibiu', 'suceava', 'teleorman', 'timis',
        'tulcea', 'valcea', 'vaslui', 'vrancea'];

    const countySelect = document.getElementById('county');
    counties.forEach(county => {
        const option = document.createElement('option');
        option.value = county;
        option.text = county.charAt(0).toUpperCase() + county.slice(1);
        countySelect.add(option);
    });

    function getWidthAndUpdateSettings() {
        if (window.innerWidth < 1000) {
            return {
                showLegend: false,
                chartHeight: 450, // Smaller height for screens under 1000px
                fontSize: 10,
                axisTitleFontSize: 12
            };
        } else {
            return {
                showLegend: true,
                chartHeight: 800, // Default height for larger screens
                fontSize: 14,
                axisTitleFontSize: 16
            };
        }
    }

    let width2 = document.querySelector("#chart").clientWidth;

    // Function to load data and create the chart for a specific county
    function loadDataAndPlot(county) {
        const csvUrl = 'https://raw.githubusercontent.com/moonspaish/storingunemploymentdata/main/data_finished.csv';

        Plotly.d3.csv(csvUrl, function (data) {
            const settings = getWidthAndUpdateSettings();

            const filteredData = data.filter(row => row['judet'] === county);
            const yearmonth = filteredData.map(row => row['yearmonth']);
            const farastudii = filteredData.map(row => +row['farastudii']);
            const invatamantprimar = filteredData.map(row => +row['invatamantprimar']);
            const invatamantgimnazial = filteredData.map(row => +row['invatamantgimnazial']);
            const invatamantliceal = filteredData.map(row => +row['invatamantliceal']);
            const invatamantposticeal = filteredData.map(row => +row['invatamantposticeal']);
            const invatamantprofesional_artesimeserii = filteredData.map(row => +row['invatamantprofesional/artesimeserii']);
            const invatamantuniversitar = filteredData.map(row => +row['invatamantuniversitar']);
            const ratasomajului = filteredData.map(row => +row['ratasomajului(%)']);

            const traces = [
                { x: yearmonth, y: farastudii, name: 'Fară Studii', type: 'bar', marker: { color: '#ff7f0e' } },
                { x: yearmonth, y: invatamantprimar, name: 'Învățământ Primar', type: 'bar', marker: { color: '#2ca02c' } },
                { x: yearmonth, y: invatamantgimnazial, name: 'Învățământ Gimnazial', type: 'bar', marker: { color: '#1f77b4' } },
                { x: yearmonth, y: invatamantliceal, name: 'Învățământ Liceal', type: 'bar', marker: { color: '#9467bd' } },
                { x: yearmonth, y: invatamantposticeal, name: 'Învățământ Posticeal', type: 'bar', marker: { color: '#e377c2' } },
                { x: yearmonth, y: invatamantprofesional_artesimeserii, name: 'Învățământ Profesional/Artesi Meserii', type: 'bar', marker: { color: '#7f7f7f' } },
                { x: yearmonth, y: invatamantuniversitar, name: 'Învățământ Universitar', type: 'bar', marker: { color: '#bcbd22' } }
            ];

            const layout = {
                barmode: 'stack',
                width: width2,
                height: settings.chartHeight, // Adjust height based on screen size
                title: `Unemployment Data for ${county.charAt(0).toUpperCase() + county.slice(1)}`,
                xaxis: {
                    title: {
                        text: 'Year-Month',
                        font: {
                            size: settings.axisTitleFontSize
                        }
                    },
                    tickangle: -45,
                    tickvals: yearmonth,
                    ticktext: yearmonth,
                    automargin: true,
                    tickmode: 'array',
                    nticks: 50,
                    showgrid: true,
                    zeroline: false,
                    type: 'category',
                    range: [-0.5, yearmonth.length - 0.5],
                    tickfont: {
                        size: settings.fontSize
                    }
                },
                yaxis: {
                    title: {
                        text: 'Count',
                        font: {
                            size: settings.axisTitleFontSize
                        }
                    },
                    tickfont: {
                        size: settings.fontSize
                    }
                },
                template: 'plotly_white',
                legend: {
                    x: 1.1,
                    y: 1,
                    font: {
                        size: settings.fontSize
                    }
                },
                plot_bgcolor: '#f3f0e5', // Background color of the plot area
                paper_bgcolor: '#f3f0e5',
                showlegend: settings.showLegend // Determine whether to show the legend based on the window width
            };

            Plotly.newPlot('chart', traces, layout);

            // Update the unemployment rate chart for the selected county
            updateUnemploymentRateChart(yearmonth, ratasomajului);
        });
    }

    let width1 = document.querySelector("#unemploymentRateChart").clientWidth;

    // Function to update the unemployment rate chart
    // Function to update the unemployment rate chart
    function updateUnemploymentRateChart(yearmonth, ratasomajului) {
        const settings = getWidthAndUpdateSettings();

        const trace = {
            x: yearmonth,
            y: ratasomajului,
            type: 'bar', // Changed to 'bar' for a standard bar chart
            marker: {
                color: '#17becf'
            },
            text: ratasomajului.map(rate => rate.toFixed(2) + '%'), // Display unemployment rate as a percentage
            textposition: 'outside',
            textfont: {
                size: settings.fontSize
            }
        };

        const layout = {
            width: width1,
            height: settings.chartHeight, // Adjust height based on screen size
            title: 'Unemployment Rate Over Time',
            xaxis: {
                title: {
                    text: 'Year-Month',
                    font: {
                        size: settings.axisTitleFontSize
                    }
                },
                tickangle: -45,
                automargin: true,
                type: 'category', // Ensure it's treated as a category axis
                tickfont: {
                    size: settings.fontSize
                }
            },
            yaxis: {
                title: {
                    text: 'Unemployment Rate (%)',
                    font: {
                        size: settings.axisTitleFontSize
                    }
                },
                tickfont: {
                    size: settings.fontSize
                }
            },
            template: 'plotly_white',
            plot_bgcolor: '#f3f0e5', // Background color of the plot area
            paper_bgcolor: '#f3f0e5',
            showlegend: false
        };

        Plotly.newPlot('unemploymentRateChart', [trace], layout);
    }


    // Event listener for the select dropdown
    countySelect.addEventListener('change', function () {
        loadDataAndPlot(this.value);
    });

    // Resize event listener to hide or show the legend and adjust settings based on window width
    window.addEventListener('resize', function () {
        loadDataAndPlot(countySelect.value);
    });

    // Initial load with the first county
    loadDataAndPlot(counties[0]);
});
