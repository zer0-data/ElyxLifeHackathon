// frontend/src/components/BiomarkerChart.js

export function renderBiomarkerChart(containerId, data, biomarkerName, memberName) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear previous charts

    if (!data || data.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-center py-8">No ${biomarkerName} data found for ${memberName}.</p>`;
        return;
    }

    // Sort data by date
    data.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Extract values and dates
    const values = data.map(d => d[biomarkerName]);
    const dates = data.map(d => new Date(d.date));

    if (values.length < 2) {
        container.innerHTML = `<p class="text-gray-500 text-center py-8">Not enough data points to draw a chart for ${biomarkerName}.</p>`;
        return;
    }

    // Chart dimensions
    const width = container.clientWidth || 300;
    const height = 200;
    const padding = 30;

    // Scales
    const xScale = (i) => padding + (i / (values.length - 1)) * (width - 2 * padding);
    const yScale = (value) => {
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        if (maxValue === minValue) return height / 2; // Avoid division by zero
        return height - padding - ((value - minValue) / (maxValue - minValue)) * (height - 2 * padding);
    };

    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.classList.add('bg-white', 'rounded-lg', 'shadow-md', 'p-2', 'border', 'border-gray-200');

    // Draw axes (simplified)
    // X-axis line
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", padding);
    xAxis.setAttribute("y1", height - padding);
    xAxis.setAttribute("x2", width - padding);
    xAxis.setAttribute("y2", height - padding);
    xAxis.setAttribute("stroke", "#ccc");
    svg.appendChild(xAxis);

    // Y-axis line
    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute("x1", padding);
    yAxis.setAttribute("y1", padding);
    yAxis.setAttribute("x2", padding);
    yAxis.setAttribute("y2", height - padding);
    yAxis.setAttribute("stroke", "#ccc");
    svg.appendChild(yAxis);

    // Draw data points and line
    let pathD = "";
    values.forEach((value, i) => {
        const x = xScale(i);
        const y = yScale(value);
        if (i === 0) {
            pathD += `M ${x} ${y}`;
        } else {
            pathD += ` L ${x} ${y}`;
        }
        // Data point circles
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", 4);
        circle.setAttribute("fill", "#3B82F6"); // blue-500
        svg.appendChild(circle);

        // Add value text
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x);
        text.setAttribute("y", y - 8);
        text.setAttribute("font-size", "10");
        text.setAttribute("fill", "#3B82F6");
        text.setAttribute("text-anchor", "middle");
        text.textContent = value;
        svg.appendChild(text);

        // Add date labels (only for first, middle, last)
        if (i === 0 || i === Math.floor(values.length / 2) || i === values.length - 1) {
            const dateText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            dateText.setAttribute("x", x);
            dateText.setAttribute("y", height - padding + 15);
            dateText.setAttribute("font-size", "10");
            dateText.setAttribute("fill", "#6B7280"); // gray-500
            dateText.setAttribute("text-anchor", "middle");
            dateText.textContent = dates[i].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            svg.appendChild(dateText);
        }
    });

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathD);
    path.setAttribute("stroke", "#3B82F6"); // blue-500
    path.setAttribute("stroke-width", "2");
    path.setAttribute("fill", "none");
    svg.appendChild(path);

    // Add title
    const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
    title.setAttribute("x", width / 2);
    title.setAttribute("y", padding / 2);
    title.setAttribute("font-size", "14");
    title.setAttribute("font-weight", "bold");
    title.setAttribute("fill", "#1F2937"); // gray-900
    title.setAttribute("text-anchor", "middle");
    title.textContent = `${biomarkerName} Trend`;
    svg.appendChild(title);

    container.appendChild(svg);
}
