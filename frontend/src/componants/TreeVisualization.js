// TreeVisualization.jsx

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import PropTypes from 'prop-types';

const TreeVisualization = ({ nodeName }) => { // Accept nodeName as a prop
    const chartRef = useRef(null);
    const [data, setData] = useState(null);
    const [faultData, setFaultData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios(`http://localhost:5000/api/faults/nodes/${nodeName}`);
                setFaultData(result.data.faults);
            } catch (error) {
                console.error("Error fetching fault data:", error);
            }
        };
        fetchData();
    }, [nodeName]); // Re-fetch data when nodeName changes

    const generatePort = (portId, splitterIdPrefix, onuIdPrefix, slotId) => {
        const portFaultData = faultData.filter(f => f.slot === slotId && f.port === portId);
        const hasCriticalFault = portFaultData.some(f => f.onu === null && f.status === 'fault');

        const onuChildren = Array.from({ length: 8 }, (_, i) => {
            const onuFault = portFaultData.some(f => f.onu === i + 1 && f.status === 'fault');
            return {
                name: `ONU ${i + 1}`,
                id: `${onuIdPrefix}${i + 1}`,
                fault: hasCriticalFault || onuFault,
                partialFault: false,
            };
        });

        return {
            name: `Port ${portId}`,
            id: `port${portId}`,
            fault: hasCriticalFault,
            partialFault: portFaultData.some(f => f.status === 'fault' && !hasCriticalFault),
            children: [{
                name: 'Splitter',
                id: `splitter${splitterIdPrefix}`,
                fault: hasCriticalFault,
                partialFault: portFaultData.some(f => f.status === 'fault' && !hasCriticalFault),
                children: onuChildren,
            }],
        };
    };

    const generateSlot = (slotId) => ({
        name: `Slot ${slotId}`,
        id: `slot${slotId}`,
        children: Array.from({ length: 8 }, (_, portIndex) =>
            generatePort(portIndex + 1, `${slotId}-${portIndex + 1}`, `onu${slotId}-${portIndex + 1}-`, slotId)
        ),
        partialFault: faultData.some(f => f.slot === slotId && f.status === 'fault'),
    });

    useEffect(() => {
        if (nodeName) { // Ensure nodeName is provided
            const treeData = {
                name: nodeName, // Use nodeName as root
                id: "root",
                partialFault: faultData.some(f => f.status === 'fault'),
                children: [{
                    name: "Rack 1",
                    id: "rack1",
                    partialFault: faultData.some(f => f.status === 'fault'),
                    children: [{
                        name: "Shelf 1",
                        id: "shelf1",
                        partialFault: faultData.some(f => f.status === 'fault'),
                        children: Array.from({ length: 2 }, (_, i) => generateSlot(i + 1)),
                    }],
                }],
            };

            setData(treeData);
        }
    }, [faultData, nodeName]);

    useEffect(() => {
        if (data) {
            // Clear previous SVG
            d3.select(chartRef.current).selectAll('svg').remove();

            const svg = d3.select(chartRef.current)
                .append('svg')
                .attr('width', window.innerWidth)
                .attr('height', window.innerHeight * 4.2);

            const g = svg.append('g').attr('transform', 'translate(100,50)'); // Increased left padding

            const rootNode = d3.hierarchy(data, d => d.children);
            const treeLayout = d3.tree().size([window.innerHeight * 4, window.innerWidth - 300]);
            treeLayout(rootNode);

            // Links
            g.selectAll('.link')
                .data(rootNode.links())
                .enter().append('path')
                .attr('class', 'link')
                .attr('d', d3.linkHorizontal().x(d => d.y).y(d => d.x))
                .attr('fill', 'none')
                .attr('stroke', d => {
                    if (d.target.data.fault) return 'red'; // Critical fault
                    if (d.target.data.partialFault) return 'yellow'; // Partial fault
                    return 'blue'; // Normal
                })
                .attr('stroke-width', 2);

            // Nodes
            const nodes = g.selectAll('g.node')
                .data(rootNode.descendants())
                .enter().append('g')
                .attr('class', 'node')
                .attr('transform', d => `translate(${d.y},${d.x})`);

            nodes.append('path')
                .attr('d', d => {
                    if (d.depth === 0) return 'M-20,-10 H20 V10 H-20 Z'; // Root node
                    else if (d.data.name === 'Splitter') return 'M-10,0 L10,-20 L10,20 Z'; // Splitter
                    else if (d.data.name.startsWith('Rack') || d.data.name.startsWith('Shelf') || d.data.name.startsWith('Slot')) return 'M-15,-10 H15 V10 H-15 Z';
                    return 'M-10,0 A10,10 0 1,0 10,0 A10,10 0 1,0 -10,0'; // ONU/Other
                })
                .attr('fill', d => d.data.fault ? 'red' : d.data.partialFault ? 'yellow' : d.children ? 'lightblue' : 'lightgreen');

            nodes.append('text')
                .attr('dy', '0.35em')
                .attr('x', d => d.depth === 0 ? 25 : d.children ? -13 : 13) // Ensure text for root is spaced adequately
                .style('text-anchor', d => d.depth === 0 ? 'start' : d.children ? 'end' : 'start') // Anchor root node text properly
                .style('font-size', '10px') // Consistent font size
                .text(d => d.data.name);
        }
    }, [data]);

    return (
        <div style={{ backgroundColor: 'white' }}>
            <div ref={chartRef}></div>
        </div>
    );
};

TreeVisualization.propTypes = {
    nodeName: PropTypes.string.isRequired, // Ensure nodeName is provided
};

export default TreeVisualization;
