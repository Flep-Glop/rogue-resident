'use client';

import React, { useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { 
  generateNewMap, 
  setCurrentNode,
  selectNodes,
  selectEdges,
  selectIsMapGenerated
} from '@/lib/redux/slices/map-slice';
import { 
  selectDifficulty,
  selectIsGameStarted,
  selectIsCharacterSelected
} from '@/lib/redux/slices/game-slice';
import { MapNode as MapNodeType, NodeColors } from '@/lib/types/map-types';
import { MapNode } from './map-node';
import { MapEdge } from './map-edge';
import { Button } from '@/components/ui/button';

// Register custom node and edge types
const nodeTypes = {
  gameNode: MapNode,
};

const edgeTypes = {
  gameEdge: MapEdge,
};

export function GameMap() {
  const dispatch = useAppDispatch();
  
  // Get state from Redux
  const mapNodes = useAppSelector(selectNodes);
  const mapEdges = useAppSelector(selectEdges);
  const isMapGenerated = useAppSelector(selectIsMapGenerated);
  const difficulty = useAppSelector(selectDifficulty);
  const isGameStarted = useAppSelector(selectIsGameStarted);
  const isCharacterSelected = useAppSelector(selectIsCharacterSelected);
  
  // Convert map nodes to ReactFlow nodes
  const nodes: Node[] = mapNodes.map(node => ({
    id: node.id,
    type: 'gameNode',
    position: { x: node.x, y: node.y },
    data: { 
      ...node,
      color: NodeColors[node.type].primary,
      borderColor: NodeColors[node.type].secondary,
      textColor: NodeColors[node.type].text,
    },
  }));

  // Convert map edges to ReactFlow edges
  const edges: Edge[] = mapEdges.map(edge => ({
    id: edge.id,
    type: 'gameEdge',
    source: edge.source,
    target: edge.target,
    // Animated edges for available paths
    animated: mapNodes.find(n => n.id === edge.source)?.status === 'current',
    style: { 
      stroke: '#888', 
      strokeWidth: 2 
    },
  }));

  // Handle node click
  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    const mapNode = mapNodes.find(n => n.id === node.id);
    
    // Only allow clicking on available nodes or the current node
    if (mapNode && (mapNode.status === 'available' || mapNode.status === 'current')) {
      dispatch(setCurrentNode(node.id));
    }
  };

  // Generate a new map when the game starts
  useEffect(() => {
    if (isGameStarted && isCharacterSelected && !isMapGenerated) {
      dispatch(generateNewMap({ difficulty, nodeCount: 15 }));
    }
  }, [isGameStarted, isCharacterSelected, isMapGenerated, difficulty, dispatch]);

  // Generate a new map for testing
  const handleGenerateMap = () => {
    dispatch(generateNewMap({ difficulty, nodeCount: 15 }));
  };

  return (
    <div className="h-[600px] w-full border border-gray-300 rounded-lg">
      {nodes.length > 0 ? (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={onNodeClick}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#aaa" gap={16} />
          <Controls />
          <MiniMap
            nodeStrokeColor={(n) => {
              const node = mapNodes.find(mapNode => mapNode.id === n.id);
              return node ? NodeColors[node.type].secondary : '#555';
            }}
            nodeColor={(n) => {
              const node = mapNodes.find(mapNode => mapNode.id === n.id);
              return node ? NodeColors[node.type].primary : '#fff';
            }}
          />
        </ReactFlow>
      ) : (
        <div className="flex h-full items-center justify-center flex-col space-y-4">
          <p className="text-gray-500">No map generated</p>
          {isGameStarted && isCharacterSelected && (
            <Button onClick={handleGenerateMap}>Generate Map</Button>
          )}
        </div>
      )}
    </div>
  );
}