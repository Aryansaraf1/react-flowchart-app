import React, { useState, useCallback, useRef } from 'react'
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
} from 'reactflow'
import 'reactflow/dist/style.css'
import domtoimage from 'dom-to-image-more'

let id = 3

const initialNodes = [
  {
    id: '1',
    type: 'editableNode',
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
    type: 'editableNode',
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

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }]

function EditableNode({ id, data }) {
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(data.label)

  const handleDoubleClick = () => setIsEditing(true)
  const handleBlur = () => {
    setIsEditing(false)
    data.label = label
  }

  return (
    <div onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontWeight: 'bold',
          }}
        />
      ) : (
        <div>{label}</div>
      )}
      <Handle type="target" position="top" />
      <Handle type="source" position="bottom" />
    </div>
  )
}

const nodeTypes = { editableNode: EditableNode }

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const reactFlowWrapper = useRef(null)
  const [edgeType, setEdgeType] = useState('default') // NEW
  const [darkTheme, setDarkTheme] = useState(false)

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) => addEdge({ ...params, type: edgeType }, eds)), // UPDATED
    [setEdges, edgeType]
  )

  const onNodesDelete = useCallback(
    (deletedNodes) =>
      setNodes((nds) => nds.filter((node) => !deletedNodes.find((d) => d.id === node.id))),
    [setNodes]
  )

  const onEdgesDelete = useCallback(
    (deletedEdges) =>
      setEdges((eds) => eds.filter((edge) => !deletedEdges.find((d) => d.id === edge.id))),
    [setEdges]
  )

  const colorClasses = ['node-red', 'node-yellow', 'node-green', 'node-blue', 'node-purple']

  const addNode = () => {
    const colorIndex = id % colorClasses.length
    const className = `hover-node ${colorClasses[colorIndex]}`

    const newNode = {
      id: `${id}`,
      type: 'editableNode',
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
        type: edgeType, // NEW
      },
    ])
    id++
  }

  const saveFlow = () => {
    const flowData = {
      nodes,
      edges,
    }
    localStorage.setItem('flowchart', JSON.stringify(flowData))
    alert('Flowchart saved!')
  }

  const loadFlow = () => {
    const saved = localStorage.getItem('flowchart')
    if (saved) {
      const flow = JSON.parse(saved)
      setNodes(flow.nodes || [])
      setEdges(flow.edges || [])
      alert('Flowchart loaded!')
    } else {
      alert('No saved flowchart found.')
    }
  }

  const exportAsImage = () => {
    const container = reactFlowWrapper.current?.querySelector('.react-flow')

    if (!container) return alert('Flow container not found')

    const handles = container.querySelectorAll('.react-flow__handle')
    handles.forEach((h) => (h.style.display = 'none'))

    domtoimage
      .toPng(container, {
        bgcolor: '#ffffff',
        filter: (node) => {
          const className = typeof node?.className === 'string' ? node.className : ''
          return !className.includes('flow-buttons')
        },
      })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'flowchart.png'
        link.href = dataUrl
        link.click()
      })
      .catch((error) => {
        console.error('Image export failed:', error)
        alert('Image export failed: ' + error.message)
      })
      .finally(() => {
        handles.forEach((h) => (h.style.display = ''))
      })
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: darkTheme ? '#1e1e1e' : '#fff', color: darkTheme ? '#fff' : '#000' }}>
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
            background: #3B82F6;
          }

          .node-yellow {
            background: #FBBF24;
            border: 2px solid #CA8A04;
          }
          .node-yellow:hover {
            background: #8B5CF6;
          }

          .node-green {
            background: #34D399;
            border: 2px solid #059669;
          }
          .node-green:hover {
            background: #F59E0B;
          }

          .node-blue {
            background: #60A5FA;
            border: 2px solid #2563EB;
          }
          .node-blue:hover {
            background: #EC4899;
          }

          .node-purple {
            background: #A78BFA;
            border: 2px solid #7C3AED;
          }
          .node-purple:hover {
            background: #10B981;
          }

          input {
            font-size: 1em;
            width: 100px;
          }

          .flow-buttons {
            display: flex;
            gap: 0.5rem;
            flex-direction: column;
          }

          button {
            background-color: #2563eb;
            color: white;
            border: none;
            padding: 0.5em 1em;
            border-radius: 5px;
            font-size: 1em;
            cursor: pointer;
            transition: background 0.3s ease;
          }

          button:hover {
            background-color: #1d4ed8;
          }

          select {
            padding: 0.4em;
            font-size: 1em;
            border-radius: 4px;
            border: 1px solid #ccc;
          }

           body {
            background: ${darkTheme ? '#1e1e1e' : '#fff'};
            color: ${darkTheme ? '#fff' : '#000'};
          }
        `}
      </style>

      <div style={{ width: '100%', height: '100%' }} ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          onConnect={onConnect}
          fitView
          nodeTypes={nodeTypes}
        >
          <MiniMap />
          <Controls />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>

      <div
        style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}
        className="flow-buttons"
      >
        <select value={edgeType} onChange={(e) => setEdgeType(e.target.value)}>
          <option value="default">Default</option>
          <option value="step">Step</option>
          <option value="smoothstep">Smooth Step</option>
          <option value="straight">Straight</option>
          <option value="bezier">Bezier</option>
        </select>
        <button onClick={addNode}>➕ Add Node</button>
        <button onClick={saveFlow}>💾 Save</button>
        <button onClick={loadFlow}>📂 Load</button>
        <button onClick={exportAsImage}>📸 Export</button>
        <button onClick={() => setDarkTheme(!darkTheme)}>{darkTheme ? '🌞 Light' : '🌙 Dark'} Mode</button>
      </div>
    </div>
  )
}

export default App
