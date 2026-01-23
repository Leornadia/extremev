'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useConfiguratorStore } from '@/lib/store/configuratorStore';
import { ModularComponent, PlacedComponent } from '@/lib/types/configurator';
import dynamic from 'next/dynamic';
import ViewModeToggle from './ViewModeToggle';

// Dynamically import Canvas3D to avoid SSR issues with Three.js
const Canvas3D = dynamic(() => import('./Canvas3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-neutral-600">Loading 3D View...</p>
      </div>
    </div>
  ),
});

export default function DesignCanvas() {
  const {
    design,
    ui,
    addComponent,
    selectComponent,
    clearSelection,
    updateComponentPosition,
    updateComponentRotation,
    removeComponent,
    duplicateComponent,
  } = useConfiguratorStore();

  const [isDragOver, setIsDragOver] = useState(false);
  const [isDraggingComponent, setIsDraggingComponent] = useState(false);
  const [draggedComponentId, setDraggedComponentId] = useState<string | null>(
    null
  );
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);
  const [isViewTransitioning, setIsViewTransitioning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const previousViewMode = useRef(ui.viewMode);

  // Canvas configuration
  const GRID_SIZE = 50; // pixels per grid unit
  const CANVAS_PADDING = 40;

  // Convert screen coordinates to grid coordinates with snap-to-grid
  const screenToGrid = useCallback(
    (screenX: number, screenY: number) => {
      const gridX = (screenX - CANVAS_PADDING) / GRID_SIZE;
      const gridY = (screenY - CANVAS_PADDING) / GRID_SIZE;

      if (ui.snapToGrid) {
        return {
          x: Math.round(gridX),
          y: Math.round(gridY),
          z: 0,
        };
      }

      return {
        x: Math.round(gridX * 10) / 10, // Round to 1 decimal
        y: Math.round(gridY * 10) / 10,
        z: 0,
      };
    },
    [ui.snapToGrid]
  );

  // Convert grid coordinates to screen coordinates
  const gridToScreen = useCallback((gridX: number, gridY: number) => {
    return {
      x: gridX * GRID_SIZE + CANVAS_PADDING,
      y: gridY * GRID_SIZE + CANVAS_PADDING,
    };
  }, []);

  // Draw grid on canvas
  const drawGrid = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.clearRect(0, 0, width, height);

      // Draw background
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(0, 0, width, height);

      // Draw grid lines
      ctx.strokeStyle = '#e5e5e5';
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = CANVAS_PADDING; x < width; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, CANVAS_PADDING);
        ctx.lineTo(x, height - CANVAS_PADDING);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = CANVAS_PADDING; y < height; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(CANVAS_PADDING, y);
        ctx.lineTo(width - CANVAS_PADDING, y);
        ctx.stroke();
      }

      // Draw major grid lines (every 5 units)
      ctx.strokeStyle = '#d4d4d4';
      ctx.lineWidth = 1.5;

      for (let x = CANVAS_PADDING; x < width; x += GRID_SIZE * 5) {
        ctx.beginPath();
        ctx.moveTo(x, CANVAS_PADDING);
        ctx.lineTo(x, height - CANVAS_PADDING);
        ctx.stroke();
      }

      for (let y = CANVAS_PADDING; y < height; y += GRID_SIZE * 5) {
        ctx.beginPath();
        ctx.moveTo(CANVAS_PADDING, y);
        ctx.lineTo(width - CANVAS_PADDING, y);
        ctx.stroke();
      }

      // Draw origin marker
      const originScreen = gridToScreen(0, 0);
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(originScreen.x, originScreen.y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw axis labels
      ctx.fillStyle = '#737373';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText('0,0', originScreen.x + 8, originScreen.y + 4);
    },
    [gridToScreen]
  );

  // Draw connections between components
  const drawConnections = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      design.components.forEach((placedComp) => {
        placedComp.connections.forEach((connection) => {
          const fromComp = design.components.find(
            (c) => c.instanceId === connection.fromInstanceId
          );
          const toComp = design.components.find(
            (c) => c.instanceId === connection.toInstanceId
          );

          if (!fromComp || !toComp) return;

          const fromScreen = gridToScreen(
            fromComp.position.x,
            fromComp.position.y
          );
          const toScreen = gridToScreen(toComp.position.x, toComp.position.y);

          // Draw connection line
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 3;
          ctx.setLineDash([8, 4]);
          ctx.beginPath();
          ctx.moveTo(fromScreen.x, fromScreen.y);
          ctx.lineTo(toScreen.x, toScreen.y);
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw connection points
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(fromScreen.x, fromScreen.y, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(toScreen.x, toScreen.y, 5, 0, Math.PI * 2);
          ctx.fill();
        });
      });
    },
    [design.components, gridToScreen]
  );

  // Draw connection points when enabled
  const drawConnectionPoints = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!ui.showConnectionPoints) return;

      design.components.forEach((placedComp) => {
        const componentData = placedComp.customizations?.options
          ?._componentData as ModularComponent | undefined;

        if (!componentData) return;

        const screen = gridToScreen(
          placedComp.position.x,
          placedComp.position.y
        );

        // Draw connection points
        componentData.connectionPoints.forEach((connPoint) => {
          // Calculate connection point position (relative to component)
          const pointX = screen.x + connPoint.position.x * GRID_SIZE;
          const pointY = screen.y + connPoint.position.y * GRID_SIZE;

          // Draw connection point
          ctx.fillStyle = '#7dd3fc';
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(pointX, pointY, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Draw connection type label
          ctx.fillStyle = '#0c4a6e';
          ctx.font = '9px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(connPoint.type, pointX, pointY - 10);
        });
      });
    },
    [design.components, ui.showConnectionPoints, gridToScreen]
  );

  // Draw overall design dimensions
  const drawDimensionMeasurements = useCallback(
    (ctx: CanvasRenderingContext2D, _width: number, _height: number) => {
      if (design.components.length === 0) return;

      // Calculate bounding box of all components
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      design.components.forEach((placedComp) => {
        const componentData = placedComp.customizations?.options
          ?._componentData as ModularComponent | undefined;

        if (!componentData) return;

        const halfWidth = componentData.dimensions.width / 2;
        const halfDepth = componentData.dimensions.depth / 2;

        minX = Math.min(minX, placedComp.position.x - halfWidth);
        minY = Math.min(minY, placedComp.position.y - halfDepth);
        maxX = Math.max(maxX, placedComp.position.x + halfWidth);
        maxY = Math.max(maxY, placedComp.position.y + halfDepth);
      });

      const designWidth = maxX - minX;
      const designDepth = maxY - minY;

      // Convert to screen coordinates
      const minScreen = gridToScreen(minX, minY);
      const maxScreen = gridToScreen(maxX, maxY);

      // Draw bounding box
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.strokeRect(
        minScreen.x,
        minScreen.y,
        maxScreen.x - minScreen.x,
        maxScreen.y - minScreen.y
      );
      ctx.setLineDash([]);

      // Draw width measurement (top)
      const topY = minScreen.y - 30;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(minScreen.x, topY);
      ctx.lineTo(maxScreen.x, topY);
      ctx.stroke();

      // Draw width arrows
      ctx.beginPath();
      ctx.moveTo(minScreen.x, topY - 5);
      ctx.lineTo(minScreen.x, topY + 5);
      ctx.moveTo(maxScreen.x, topY - 5);
      ctx.lineTo(maxScreen.x, topY + 5);
      ctx.stroke();

      // Draw width label
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${designWidth.toFixed(1)}'`,
        (minScreen.x + maxScreen.x) / 2,
        topY - 10
      );

      // Draw depth measurement (right)
      const rightX = maxScreen.x + 30;
      ctx.beginPath();
      ctx.moveTo(rightX, minScreen.y);
      ctx.lineTo(rightX, maxScreen.y);
      ctx.stroke();

      // Draw depth arrows
      ctx.beginPath();
      ctx.moveTo(rightX - 5, minScreen.y);
      ctx.lineTo(rightX + 5, minScreen.y);
      ctx.moveTo(rightX - 5, maxScreen.y);
      ctx.lineTo(rightX + 5, maxScreen.y);
      ctx.stroke();

      // Draw depth label
      ctx.save();
      ctx.translate(rightX + 20, (minScreen.y + maxScreen.y) / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillText(`${designDepth.toFixed(1)}'`, 0, 0);
      ctx.restore();

      // Draw spacing measurements between adjacent components
      if (ui.selectedComponentIds.length === 2) {
        const comp1 = design.components.find(
          (c) => c.instanceId === ui.selectedComponentIds[0]
        );
        const comp2 = design.components.find(
          (c) => c.instanceId === ui.selectedComponentIds[1]
        );

        if (comp1 && comp2) {
          const screen1 = gridToScreen(comp1.position.x, comp1.position.y);
          const screen2 = gridToScreen(comp2.position.x, comp2.position.y);

          // Calculate distance
          const dx = comp2.position.x - comp1.position.x;
          const dy = comp2.position.y - comp1.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Draw distance line
          ctx.strokeStyle = '#fb7185';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 3]);
          ctx.beginPath();
          ctx.moveTo(screen1.x, screen1.y);
          ctx.lineTo(screen2.x, screen2.y);
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw distance label
          ctx.fillStyle = '#fb7185';
          ctx.font = 'bold 11px Inter, sans-serif';
          ctx.textAlign = 'center';
          const midX = (screen1.x + screen2.x) / 2;
          const midY = (screen1.y + screen2.y) / 2;
          ctx.fillText(`${distance.toFixed(1)}'`, midX, midY - 5);
        }
      }
    },
    [design.components, ui.selectedComponentIds, gridToScreen]
  );

  // Draw placed components
  const drawComponents = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      design.components.forEach((placedComp) => {
        const screen = gridToScreen(
          placedComp.position.x,
          placedComp.position.y
        );

        // Get component data
        const componentData = placedComp.customizations?.options
          ?._componentData as ModularComponent | undefined;

        if (!componentData) return;

        // Calculate component size in pixels
        const widthPx = componentData.dimensions.width * GRID_SIZE;
        const heightPx = componentData.dimensions.depth * GRID_SIZE;

        // Check if selected, hovered, or highlighted
        const isSelected = ui.selectedComponentIds.includes(
          placedComp.instanceId
        );
        const isHovered = hoveredComponent === placedComp.instanceId;
        const isHighlighted = ui.highlightedComponentIds.includes(
          placedComp.instanceId
        );

        // Draw component rectangle with rotation
        ctx.save();
        ctx.translate(screen.x, screen.y);
        ctx.rotate((placedComp.rotation.z * Math.PI) / 180);

        // Shadow for depth
        if (isSelected || isHighlighted) {
          ctx.shadowColor = isHighlighted
            ? 'rgba(239, 68, 68, 0.4)'
            : 'rgba(0, 0, 0, 0.2)';
          ctx.shadowBlur = isHighlighted ? 15 : 10;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 4;
        }

        // Fill with gradient
        const gradient = ctx.createLinearGradient(
          -widthPx / 2,
          -heightPx / 2,
          widthPx / 2,
          heightPx / 2
        );
        if (isHighlighted) {
          // Red gradient for validation errors
          gradient.addColorStop(0, '#fee2e2');
          gradient.addColorStop(1, '#fecaca');
        } else if (isSelected) {
          gradient.addColorStop(0, '#dcf3e6');
          gradient.addColorStop(1, '#a7f3d0');
        } else if (isHovered) {
          gradient.addColorStop(0, '#e0f2fe');
          gradient.addColorStop(1, '#bae6fd');
        } else {
          gradient.addColorStop(0, '#f0f9f4');
          gradient.addColorStop(1, '#d1fae5');
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(-widthPx / 2, -heightPx / 2, widthPx, heightPx);

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Border with pulsing effect for highlighted components
        if (isHighlighted) {
          // Draw animated pulsing border for validation errors
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 4;
          ctx.setLineDash([8, 4]);
          ctx.strokeRect(-widthPx / 2, -heightPx / 2, widthPx, heightPx);
          ctx.setLineDash([]);
        } else {
          ctx.strokeStyle = isSelected
            ? '#059669'
            : isHovered
              ? '#0284c7'
              : '#10b981';
          ctx.lineWidth = isSelected ? 3 : isHovered ? 2.5 : 2;
          ctx.strokeRect(-widthPx / 2, -heightPx / 2, widthPx, heightPx);
        }

        // Draw category icon/indicator
        ctx.fillStyle = isHighlighted
          ? '#991b1b'
          : isSelected
            ? '#047857'
            : '#10b981';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(
          componentData.category.toUpperCase(),
          -widthPx / 2 + 8,
          -heightPx / 2 + 16
        );

        // Draw error indicator for highlighted components
        if (isHighlighted) {
          ctx.fillStyle = '#dc2626';
          ctx.font = 'bold 12px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('⚠', 0, -heightPx / 2 + 20);
        }

        // Draw center crosshair
        ctx.strokeStyle = isHighlighted
          ? '#dc2626'
          : isSelected
            ? '#059669'
            : '#10b981';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-8, 0);
        ctx.lineTo(8, 0);
        ctx.moveTo(0, -8);
        ctx.lineTo(0, 8);
        ctx.stroke();

        ctx.restore();

        // Draw component name (outside rotation)
        ctx.fillStyle = '#171717';
        ctx.font = isSelected
          ? 'bold 13px Inter, sans-serif'
          : '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          componentData.name,
          screen.x,
          screen.y - heightPx / 2 - 10
        );

        // Draw dimensions label
        if (ui.showDimensions) {
          ctx.fillStyle = '#737373';
          ctx.font = '10px Inter, sans-serif';
          ctx.fillText(
            `${componentData.dimensions.width}' × ${componentData.dimensions.depth}' × ${componentData.dimensions.height}'`,
            screen.x,
            screen.y + heightPx / 2 + 18
          );
        }

        // Draw grid position
        ctx.fillStyle = '#a3a3a3';
        ctx.font = '9px Inter, sans-serif';
        ctx.fillText(
          `(${placedComp.position.x}, ${placedComp.position.y})`,
          screen.x,
          screen.y + heightPx / 2 + 30
        );
      });
    },
    [
      design.components,
      ui.selectedComponentIds,
      ui.highlightedComponentIds,
      ui.showDimensions,
      hoveredComponent,
      gridToScreen,
    ]
  );

  // Main render function
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawGrid(ctx, canvas.width, canvas.height);
    drawConnections(ctx);
    drawComponents(ctx);
    drawConnectionPoints(ctx);
    drawDimensionMeasurements(ctx, canvas.width, canvas.height);
  }, [
    drawGrid,
    drawConnections,
    drawComponents,
    drawConnectionPoints,
    drawDimensionMeasurements,
  ]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      render();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [render]);

  // Re-render when design or selection changes
  useEffect(() => {
    render();
  }, [render]);

  // Find component at screen position
  const getComponentAtPosition = useCallback(
    (screenX: number, screenY: number): PlacedComponent | null => {
      // Check in reverse order (top to bottom)
      for (let i = design.components.length - 1; i >= 0; i--) {
        const comp = design.components[i];
        const componentData = comp.customizations?.options?._componentData as
          | ModularComponent
          | undefined;

        if (!componentData) continue;

        const screen = gridToScreen(comp.position.x, comp.position.y);
        const widthPx = componentData.dimensions.width * GRID_SIZE;
        const heightPx = componentData.dimensions.depth * GRID_SIZE;

        // Simple bounding box check (ignoring rotation for now)
        if (
          screenX >= screen.x - widthPx / 2 &&
          screenX <= screen.x + widthPx / 2 &&
          screenY >= screen.y - heightPx / 2 &&
          screenY <= screen.y + heightPx / 2
        ) {
          return comp;
        }
      }
      return null;
    },
    [design.components, gridToScreen]
  );

  // Mouse event handlers for component manipulation
  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const component = getComponentAtPosition(x, y);

      if (component) {
        // Start dragging component
        setIsDraggingComponent(true);
        setDraggedComponentId(component.instanceId);

        const screen = gridToScreen(component.position.x, component.position.y);
        setDragOffset({
          x: x - screen.x,
          y: y - screen.y,
        });

        // Select component (with multi-select support)
        selectComponent(component.instanceId, e.shiftKey);
      } else {
        // Clear selection if clicking empty space
        if (!e.shiftKey) {
          clearSelection();
        }
      }
    },
    [getComponentAtPosition, gridToScreen, selectComponent, clearSelection]
  );

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (isDraggingComponent && draggedComponentId) {
        // Update component position while dragging
        const adjustedX = x - dragOffset.x;
        const adjustedY = y - dragOffset.y;
        const gridPos = screenToGrid(adjustedX, adjustedY);
        updateComponentPosition(draggedComponentId, gridPos);
      } else {
        // Update hover state
        const component = getComponentAtPosition(x, y);
        setHoveredComponent(component?.instanceId || null);
      }
    },
    [
      isDraggingComponent,
      draggedComponentId,
      dragOffset,
      screenToGrid,
      updateComponentPosition,
      getComponentAtPosition,
    ]
  );

  const handleCanvasMouseUp = useCallback(() => {
    setIsDraggingComponent(false);
    setDraggedComponentId(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  // Drag and drop handlers for new components
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const componentData = e.dataTransfer.getData('application/json');
      if (!componentData) return;

      const component: ModularComponent = JSON.parse(componentData);

      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const gridPos = screenToGrid(x, y);
        addComponent(component, gridPos);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete selected components
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (ui.selectedComponentIds.length > 0) {
          e.preventDefault();
          ui.selectedComponentIds.forEach((id) => removeComponent(id));
        }
      }

      // Duplicate selected component
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        if (ui.selectedComponentIds.length === 1) {
          duplicateComponent(ui.selectedComponentIds[0]);
        }
      }

      // Rotate selected components
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        ui.selectedComponentIds.forEach((id) => {
          const comp = design.components.find((c) => c.instanceId === id);
          if (comp) {
            const newRotation = {
              ...comp.rotation,
              z: (comp.rotation.z + 90) % 360,
            };
            updateComponentRotation(id, newRotation);
          }
        });
      }

      // Select all
      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        e.preventDefault();
        design.components.forEach((comp) => {
          selectComponent(comp.instanceId, true);
        });
      }

      // Deselect all
      if (e.key === 'Escape') {
        clearSelection();
      }

      // Undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        const store = useConfiguratorStore.getState();
        if (store.canUndo()) {
          store.undo();
        }
      }

      // Redo
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        const store = useConfiguratorStore.getState();
        if (store.canRedo()) {
          store.redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    ui.selectedComponentIds,
    design.components,
    removeComponent,
    duplicateComponent,
    updateComponentRotation,
    selectComponent,
    clearSelection,
  ]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Handle view mode transitions
  useEffect(() => {
    if (previousViewMode.current !== ui.viewMode) {
      setIsViewTransitioning(true);
      previousViewMode.current = ui.viewMode;

      // Reset transition state after animation
      const timer = setTimeout(() => {
        setIsViewTransitioning(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [ui.viewMode]);

  return (
    <div className="h-full flex flex-col bg-neutral-100">
      {/* View Mode Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ViewModeToggle />
      </div>

      {/* Render 3D View */}
      <div
        className={`flex-1 relative transition-opacity duration-300 ${
          ui.viewMode === '3D'
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none absolute inset-0'
        }`}
      >
        {ui.viewMode === '3D' && <Canvas3D />}
      </div>

      {/* Render 2D View */}
      <div
        className={`flex-1 flex flex-col transition-opacity duration-300 ${
          ui.viewMode === '2D'
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none absolute inset-0'
        }`}
      >
        {ui.viewMode === '2D' && (
          <>
            {/* Canvas Container */}
            <div
              ref={containerRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex-1 relative transition-colors ${
                isDragOver ? 'bg-primary-50' : 'bg-neutral-50'
              }`}
            >
              {/* Canvas Element */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{
                  cursor: isDragOver
                    ? 'copy'
                    : isDraggingComponent
                      ? 'grabbing'
                      : hoveredComponent
                        ? 'grab'
                        : 'default',
                }}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
              />

              {/* Drop Zone Indicator */}
              {isDragOver && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 border-2 border-primary-500 border-dashed">
                    <svg
                      className="w-16 h-16 text-primary-600 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-lg font-medium text-neutral-900">
                      Drop component here
                    </p>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {design.components.length === 0 && !isDragOver && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="w-64 h-64 mx-auto bg-white rounded-lg border-2 border-dashed border-neutral-300 flex items-center justify-center mb-4">
                      <svg
                        className="w-16 h-16 text-neutral-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <p className="text-neutral-600 font-medium mb-2">
                      Start designing your playset
                    </p>
                    <p className="text-sm text-neutral-500">
                      Drag components from the library to the canvas
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Canvas Info */}
            <div className="bg-white border-t border-neutral-200 p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex gap-6">
                  <div>
                    <span className="text-neutral-600">Dimensions:</span>
                    <span className="ml-2 font-medium">
                      {design.metadata.dimensions.width} x{' '}
                      {design.metadata.dimensions.depth}{' '}
                      {design.metadata.dimensions.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600">Components:</span>
                    <span className="ml-2 font-medium">
                      {design.components.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600">Estimated Price:</span>
                    <span className="ml-2 font-medium">
                      {formatPrice(design.metadata.totalPrice)}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600">Snap to Grid:</span>
                    <span className="ml-2 font-medium">
                      {ui.snapToGrid ? 'On' : 'Off'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
