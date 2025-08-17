// Chart functionality using Chart.js
class Charts {
    static biomarkerCharts = {};
    static wearablesChart = null;

    static createBiomarkerCharts(biomarkerData) {
        const container = document.getElementById('biomarkerChartsContainer');
        if (!container) {
            console.error('biomarkerChartsContainer not found');
            return;
        }

        console.log('Creating biomarker charts...', biomarkerData);

        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.error('Chart.js is not loaded');
            container.innerHTML = '<p class="text-red-500">Chart.js library failed to load. Please check your internet connection.</p>';
            return;
        }

        // Destroy existing charts
        Object.values(this.biomarkerCharts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.biomarkerCharts = {};

        if (!biomarkerData.grouped_data) {
            console.log('No grouped biomarker data available');
            container.innerHTML = '<p class="text-gray-500">No biomarker data available</p>';
            return;
        }

        const colors = [
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
            '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'
        ];

        let colorIndex = 0;
        container.innerHTML = '';

        console.log('Processing markers:', Object.keys(biomarkerData.grouped_data));

        Object.keys(biomarkerData.grouped_data).forEach(marker => {
            const data = biomarkerData.grouped_data[marker];
            const color = colors[colorIndex % colors.length];
            
            console.log(`Creating chart for ${marker} with ${data.length} data points`);
            
            // Create container for this biomarker
            const chartContainer = document.createElement('div');
            chartContainer.className = 'bg-white p-4 rounded-lg shadow border';
            chartContainer.innerHTML = `
                <h4 class="font-semibold text-gray-800 mb-2 text-sm">${marker}</h4>
                <div class="mb-2">
                    <span class="text-xl font-bold text-blue-600">${data[data.length - 1].value} ${data[data.length - 1].unit}</span>
                    <span class="text-xs text-gray-500 block">${data[data.length - 1].date}</span>
                </div>
                <canvas id="chart-${marker.replace(/[^a-zA-Z0-9]/g, '')}" width="200" height="100"></canvas>
                <p class="text-xs text-gray-600 mt-2">${data[data.length - 1].notes}</p>
            `;
            
            container.appendChild(chartContainer);

            // Create the chart
            const ctx = chartContainer.querySelector('canvas');
            try {
                this.biomarkerCharts[marker] = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: data.map(point => `Month ${point.month}`),
                        datasets: [{
                            data: data.map(point => point.value),
                            borderColor: color,
                            backgroundColor: color + '20',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: color,
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointRadius: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                callbacks: {
                                    title: function(context) {
                                        return data[context[0].dataIndex].date;
                                    },
                                    label: function(context) {
                                        return `${context.parsed.y} ${data[context.dataIndex].unit}`;
                                    }
                                }
                            }
                        },
                        scales: {
                            x: {
                                display: true,
                                grid: {
                                    display: false
                                },
                                ticks: {
                                    font: {
                                        size: 10
                                    }
                                }
                            },
                            y: {
                                display: true,
                                grid: {
                                    display: true,
                                    color: '#f3f4f6'
                                },
                                ticks: {
                                    font: {
                                        size: 10
                                    }
                                }
                            }
                        },
                        interaction: {
                            intersect: false,
                            mode: 'index'
                        }
                    }
                });
                console.log(`Successfully created chart for ${marker}`);
            } catch (error) {
                console.error(`Failed to create chart for ${marker}:`, error);
                chartContainer.innerHTML = `
                    <h4 class="font-semibold text-gray-800 mb-2 text-sm">${marker}</h4>
                    <div class="mb-2">
                        <span class="text-xl font-bold text-blue-600">${data[data.length - 1].value} ${data[data.length - 1].unit}</span>
                        <span class="text-xs text-gray-500 block">${data[data.length - 1].date}</span>
                    </div>
                    <p class="text-red-500 text-sm">Chart failed to load</p>
                    <p class="text-xs text-gray-600 mt-2">${data[data.length - 1].notes}</p>
                `;
            }

            colorIndex++;
        });
    }

    static createWearablesChart(wearablesData) {
        const ctx = document.getElementById('wearablesChart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.wearablesChart) {
            this.wearablesChart.destroy();
        }

        // Filter out null/undefined/N/A values and prepare data
        const sleepData = wearablesData
            .filter(d => d.sleep_score_100 !== null && d.sleep_score_100 !== undefined && d.sleep_score_100 !== 'N/A' && d.sleep_score_100 !== '')
            .map(d => ({ x: d.date, y: parseFloat(d.sleep_score_100) }));
        
        const hrvData = wearablesData
            .filter(d => d.hrv_ms !== null && d.hrv_ms !== undefined && d.hrv_ms !== 'N/A' && d.hrv_ms !== '')
            .map(d => ({ x: d.date, y: parseFloat(d.hrv_ms) }));
        
        const rhrData = wearablesData
            .filter(d => d.rhr_bpm !== null && d.rhr_bpm !== undefined && d.rhr_bpm !== 'N/A' && d.rhr_bpm !== '')
            .map(d => ({ x: d.date, y: parseFloat(d.rhr_bpm) }));

        const datasets = [];
        
        if (sleepData.length > 0) {
            datasets.push({
                label: 'Sleep Score',
                data: sleepData,
                borderColor: '#3b82f6',
                backgroundColor: '#3b82f620',
                yAxisID: 'y',
                tension: 0.4
            });
        }
        
        if (hrvData.length > 0) {
            datasets.push({
                label: 'HRV (ms)',
                data: hrvData,
                borderColor: '#10b981',
                backgroundColor: '#10b98120',
                yAxisID: 'y1',
                tension: 0.4
            });
        }
        
        if (rhrData.length > 0) {
            datasets.push({
                label: 'Resting HR (bpm)',
                data: rhrData,
                borderColor: '#ef4444',
                backgroundColor: '#ef444420',
                yAxisID: 'y2',
                tension: 0.4
            });
        }

        this.wearablesChart = new Chart(ctx, {
            type: 'line',
            data: { datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Wearables Data Trends'
                    },
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    x: {
                        type: 'category',
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: sleepData.length > 0,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Sleep Score'
                        },
                        min: 0,
                        max: 100
                    },
                    y1: {
                        type: 'linear',
                        display: hrvData.length > 0,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'HRV (ms)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                        min: 0,
                        max: 60
                    },
                    y2: {
                        type: 'linear',
                        display: false,
                        position: 'right',
                        min: 50,
                        max: 70
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    static destroyCharts() {
        if (this.biomarkerChart) {
            this.biomarkerChart.destroy();
            this.biomarkerChart = null;
        }
        if (this.wearablesChart) {
            this.wearablesChart.destroy();
            this.wearablesChart = null;
        }
    }
}
