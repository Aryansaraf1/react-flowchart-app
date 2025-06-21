import React, { useState, useCallback } from 'react'
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'

let id = 3 // IDs for new nodes

const initialNodes = [
  {
    id: '1',
    data: { label: 'Start' },
    position: { x: 100, y: 100 },
    className: 'hover-node node-green',
    style: {
      color: '#fff',
      padding: 10,
      borderRadius: 8,
      boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
    },
  },
  {
    id: '2',
    data: { label: 'Process' },
    position: { x: 300, y: 100 },
    className: 'hover-node node-blue',
    style: {
      color: '#fff',
      padding: 10,
      borderRadius: 8,
      boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
    },
  },
]

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
]

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onNodesDelete = useCallback(
    (deletedNodes) => {
      setNodes((nds) => nds.filter((node) => !deletedNodes.find((d) => d.id === node.id)))
    },
    [setNodes]
  )

  const onEdgesDelete = useCallback(
    (deletedEdges) => {
      setEdges((eds) => eds.filter((edge) => !deletedEdges.find((d) => d.id === edge.id)))
    },
    [setEdges]
  )

  const colorClasses = ['node-red', 'node-yellow', 'node-green', 'node-blue', 'node-purple']

  const addNode = () => {
    const colorIndex = id % colorClasses.length
    const className = `hover-node ${colorClasses[colorIndex]}`

    const newNode = {
      id: `${id}`,
      data: { label: `Node ${id}` },
      position: { x: 100 + id * 50, y: 200 },
      style: {
        color: '#fff',
        padding: 10,
        borderRadius: 8,
        boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
      },
      className,
    }

    setNodes((nds) => [...nds, newNode])
    setEdges((eds) => [
      ...eds,
      {
        id: `e${id - 1}-${id}`,
        source: `${id - 1}`,
        target: `${id}`,
      },
    ])
    id++
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <style>
        {`
          .hover-node {
            transition: all 0.3s ease;
            cursor: pointer;
            transform-origin: center;
          }

          .hover-node:hover {
            transform: scale(1.08);
            box-shadow: 0 6px 15px rgba(0,0,0,0.25);
            border-color: black !important;
          }

          .node-red {
            background: #F87171;
            border: 2px solid #DC2626;
          }
          .node-red:hover {
            background: #3B82F6; /* blue */
          }

          .node-yellow {
            background: #FBBF24;
            border: 2px solid #CA8A04;
          }
          .node-yellow:hover {
            background: #8B5CF6; /* purple */
          }

          .node-green {
            background: #34D399;
            border: 2px solid #059669;
          }
          .node-green:hover {
            background: #F59E0B; /* amber */
          }

          .node-blue {
            background: #60A5FA;
            border: 2px solid #2563EB;
          }
          .node-blue:hover {
            background: #EC4899; /* pink */
          }

          .node-purple {
            background: #A78BFA;
            border: 2px solid #7C3AED;
          }
          .node-purple:hover {
            background: #10B981; /* teal */
          }
        `}
      </style>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>

      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}>
        <button onClick={addNode}>➕ Add Node</button>
      </div>
    </div>
  )
}

export default App
