// components/streams/StreamVisualizer.jsx
import React, { useEffect, useRef, useState } from 'react';
import { 
  FaChartLine, 
  FaExpand, 
  FaCompress, 
  FaPause, 
  FaPlay,
  FaDownload,
  FaFilter
} from 'react-icons/fa';

const StreamVisualizer = ({ data, activeKey, selectedKeys, connectionStatus }) => {
  const canvasRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRange, setTimeRange] = useState(300); // seconds
  const [visualizationMode, setVisualizationMode] = useState('line'); // 'line', 'scatter', 'area'
  
  const colors = [
    '#3b82f6', // blue-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#06b6d4', // cyan-500
    '#84cc16', // lime-500
  ];

  // Draw visualization
  useEffect(() => {
    // Honest pause: when paused, skip the redraw entirely so the canvas keeps
    // showing the last rendered frame instead of silently updating.
    if (isPaused) return;
    if (!canvasRef.current || Object.keys(data).length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    
    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Calculate time window
    const now = Date.now() / 1000; // current timestamp in seconds
    const startTime = now - timeRange;
    
    // Collect all data points within time range
    const allPoints = [];
    Object.entries(data).forEach(([key, points], keyIndex) => {
      const filtered = points.filter(p => p.timestamp >= startTime);
      filtered.forEach(point => {
        allPoints.push({
          ...point,
          keyIndex,
          color: colors[keyIndex % colors.length]
        });
      });
    });
    
    if (allPoints.length === 0) return;
    
    // Find min/max values for scaling
    const values = allPoints.map(p => p.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1;
    
    const timestamps = allPoints.map(p => p.timestamp);
    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);
    const timeDiff = maxTime - minTime || 1;
    
    // Set up drawing area
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const width = rect.width - margin.left - margin.right;
    const height = rect.height - margin.top - margin.bottom;
    
    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    
    // Vertical grid lines (time)
    const timeSteps = 10;
    for (let i = 0; i <= timeSteps; i++) {
      const x = margin.left + (width * i) / timeSteps;
      ctx.beginPath();
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, margin.top + height);
      ctx.stroke();
      
      // Time labels
      const time = minTime + (timeDiff * i) / timeSteps;
      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        new Date(time * 1000).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        }),
        x,
        margin.top + height + 20
      );
    }
    
    // Horizontal grid lines (value)
    const valueSteps = 8;
    for (let i = 0; i <= valueSteps; i++) {
      const y = margin.top + height - (height * i) / valueSteps;
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + width, y);
      ctx.stroke();
      
      // Value labels
      const value = minValue + (valueRange * i) / valueSteps;
      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(
        value.toFixed(2),
        margin.left - 10,
        y + 3
      );
    }
    
    ctx.setLineDash([]);
    
    // Draw axes
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top + height);
    ctx.lineTo(margin.left + width, margin.top + height);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + height);
    ctx.stroke();
    
    // Draw data for each key
    Object.entries(data).forEach(([key, points], keyIndex) => {
      const filtered = points.filter(p => p.timestamp >= startTime);
      if (filtered.length === 0) return;
      
      const color = colors[keyIndex % colors.length];
      
      if (visualizationMode === 'line') {
        // Draw line chart
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        filtered.forEach((point, pointIndex) => {
          const x = margin.left + ((point.timestamp - minTime) / timeDiff) * width;
          const y = margin.top + height - ((point.value - minValue) / valueRange) * height;
          
          if (pointIndex === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        
        ctx.stroke();
      }
      
      // Draw points
      ctx.fillStyle = color;
      filtered.forEach(point => {
        const x = margin.left + ((point.timestamp - minTime) / timeDiff) * width;
        const y = margin.top + height - ((point.value - minValue) / valueRange) * height;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    });
    
    // Draw legend
    const legendKeys = selectedKeys.length > 0 
      ? Array.from(selectedKeys) 
      : [activeKey].filter(Boolean);
    
    legendKeys.forEach((key, index) => {
      // Clamp legend rows so 3+ entries stay inside the canvas: rows that would
      // render above the top edge are stacked downward just below the top margin.
      const rawY = margin.top - 20 - (index * 20);
      const yPos = Math.max(rawY, rawY < 0 ? 4 + (index * 20) : rawY);
      const color = colors[index % colors.length];
      
      // Color box
      ctx.fillStyle = color;
      ctx.fillRect(margin.left, yPos, 12, 12);
      
      // Key name
      ctx.fillStyle = '#f3f4f6';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(key, margin.left + 20, yPos + 10);
      
      // Data point count
      const count = data[key]?.length || 0;
      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`${count} points`, margin.left + width - 10, yPos + 10);
    });
    
  }, [data, activeKey, selectedKeys, timeRange, visualizationMode, isPaused]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      canvasRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const exportData = () => {
    const exportObj = {};
    Object.entries(data).forEach(([key, points]) => {
      exportObj[key] = points.map(p => ({
        timestamp: p.timestamp,
        value: p.value,
        receivedAt: p.receivedAt
      }));
    });
    
    const dataStr = JSON.stringify(exportObj, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stream-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`bg-dark-card rounded-xl border border-white/10 flex flex-col ${
      isFullscreen ? 'fixed inset-0 z-50 p-4' : 'h-[600px]'
    }`}>
      {/* Controls */}
      <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FaChartLine /> Real-time Visualization
          </h3>
          
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' :
              connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className="text-gray-text">
              {connectionStatus === 'connected' ? 'Live' :
               connectionStatus === 'connecting' ? 'Connecting…' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="bg-dark-bg border border-white/10 rounded-lg px-3 py-1.5 text-sm"
          >
            <option value={60}>Last 1 min</option>
            <option value={300}>Last 5 min</option>
            <option value={900}>Last 15 min</option>
            <option value={1800}>Last 30 min</option>
            <option value={3600}>Last 1 hour</option>
          </select>
          
          {/* Visualization Mode */}
          <select
            value={visualizationMode}
            onChange={(e) => setVisualizationMode(e.target.value)}
            className="bg-dark-bg border border-white/10 rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="line">Line Chart</option>
            <option value="scatter">Scatter Plot</option>
            <option value="area">Area Chart</option>
          </select>
          
          {/* Pause/Play */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? 'Resume updates' : 'Pause updates'}
            className="min-h-[44px] min-w-[44px] p-2 inline-flex items-center justify-center bg-dark-bg border border-white/10 rounded-lg hover:bg-white/5 transition"
            title={isPaused ? 'Resume updates' : 'Pause updates'}
          >
            {isPaused ? <FaPlay className="w-4 h-4" /> : <FaPause className="w-4 h-4" />}
          </button>
          
          {/* Export */}
          <button
            onClick={exportData}
            aria-label="Export PNG"
            className="min-h-[44px] min-w-[44px] p-2 inline-flex items-center justify-center bg-dark-bg border border-white/10 rounded-lg hover:bg-white/5 transition"
            title="Export PNG"
          >
            <FaDownload className="w-4 h-4" />
          </button>
          
          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
            className="min-h-[44px] min-w-[44px] p-2 inline-flex items-center justify-center bg-dark-bg border border-white/10 rounded-lg hover:bg-white/5 transition"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <FaCompress className="w-4 h-4" /> : <FaExpand className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {/* Canvas Container */}
      <div className="flex-1 p-4 relative">
        {Object.keys(data).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-text">
            <FaChartLine className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg mb-2">No data to visualize</p>
            <p className="text-sm text-center max-w-md">
              {connectionStatus === 'connected' 
                ? 'Select a key from the panel to visualize its data'
                : 'Connect to the stream to start receiving data'}
            </p>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className="w-full h-full rounded-lg bg-dark-bg border border-white/5"
          />
        )}
      </div>
      
      {/* Footer Stats */}
      <div className="p-4 border-t border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-4">
            <div className="text-gray-text">
              Showing:{' '}
              <span className="font-semibold text-light-text">
                {Object.keys(data).length} signal{Object.keys(data).length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="text-gray-text">
              Total points:{' '}
              <span className="font-semibold text-light-text">
                {Object.values(data).reduce((sum, points) => sum + points.length, 0).toLocaleString()}
              </span>
            </div>
            
            <div className="text-gray-text">
              Buffer:{' '}
              <span className="font-semibold text-light-text">2000 points/signal</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-text">
            {isPaused ? 'Updates paused' : 'Real-time updates active'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamVisualizer;