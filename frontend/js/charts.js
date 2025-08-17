// Chart functionality using Chart.js
class Charts {
    static biomarkerChart = null;
    static wearablesChart = null;

    static createBiomarkerChart(biomarkerData) {
        const ctx = document.getElementById('biomarkerChart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.biomarkerChart) {
            this.biomarkerChart.destroy();
        }

        const datasets = [];
        const colors = [
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
            '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'
        ];

        let colorIndex = 0;
        Object.keys(biomarkerData.grouped_data).forEach(marker => {
            const data = biomarkerData.grouped_data[marker];
            datasets.push({
                label: marker,
                data: data.map(point => ({
                    x: point.month,
                    y: point.value
                })),
                borderColor: colors[colorIndex % colors.length],
                backgroundColor: colors[colorIndex % colors.length] + '20',
                tension: 0.4,
                fill: false
            });
            colorIndex++;
        });

        this.biomarkerChart = new Chart(ctx, {
            type: 'line',
            data: { datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Biomarker Trends Over Time'
                    },
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Month'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Value'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    static createWearablesChart(wearablesData) {
        const ctx = document.getElementById('wearablesChart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.wearablesChart) {
            this.wearablesChart.destroy();
        }

        // Filter out null/undefined values and prepare data
        const sleepData = wearablesData.filter(d => d.sleep_score_100 !== null && d.sleep_score_100 !== undefined)
            .map(d => ({ x: d.date, y: d.sleep_score_100 }));
        
        const hrvData = wearablesData.filter(d => d.hrv_ms !== null && d.hrv_ms !== undefined)
            .map(d => ({ x: d.date, y: d.hrv_ms }));
        
        const rhrData = wearablesData.filter(d => d.rhr_bpm !== null && d.rhr_bpm !== undefined)
            .map(d => ({ x: d.date, y: d.rhr_bpm }));

        this.wearablesChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'Sleep Score',
                        data: sleepData,
                        borderColor: '#3b82f6',
                        backgroundColor: '#3b82f620',
                        yAxisID: 'y',
                        tension: 0.4
                    },
                    {
                        label: 'HRV (ms)',
                        data: hrvData,
                        borderColor: '#10b981',
                        backgroundColor: '#10b98120',
                        yAxisID: 'y1',
                        tension: 0.4
                    },
                    {
                        label: 'Resting HR (bpm)',
                        data: rhrData,
                        borderColor: '#ef4444',
                        backgroundColor: '#ef444420',
                        yAxisID: 'y2',
                        tension: 0.4
                    }
                ]
            },
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
                        type: 'time',
                        time: {
                            parser: 'YYYY-MM-DD',
                            tooltipFormat: 'MMM DD, YYYY',
                            displayFormats: {
                                day: 'MMM DD',
                                week: 'MMM DD',
                                month: 'MMM YYYY'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
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
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'HRV (ms)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    },
                    y2: {
                        type: 'linear',
                        display: false,
                        position: 'right',
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
