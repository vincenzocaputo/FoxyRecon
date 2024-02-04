class Graph {
    
    constructor() {
        let graph = localStorage.getItem("graph");

        if (!graph) {
            // Creare new graph
            this.graph = {
                'nodes': [],
                'links': []
            }
        } else {
            this.graph = JSON.parse(graph);
        }
    }

    /**
     * Save the graph in the local storage
     */
    saveGraph() {
        localStorage.setItem("graph", JSON.stringify(this.graph));
    }
    
    /**
     * Delte the graph
     */
    deleteGraph() {
        this.graph = {
            'nodes': [],
            'links': []
        }
        this.saveGraph();
    }

    /**
     * Check if an indicator node is in the graph
     * @param{checkNodeId}: node to check
     */
    nodeInGraph(checkNodeId) {
        for (let node in this.graph["nodes"]) {
            const exNodeId = this.graph["nodes"][node].id;
            if (checkNodeId == exNodeId) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if a relationship is in the graph
     * @param{sourceNodeId}: id of the source node
     * @param{targetNodeId}: id of the target node
     * @param{label}: relationship node
     */
    relationshipInGraph(sourceNodeId, targetNodeId, label) {
        for (let relationship in this.graph["links"]) {
            if (relationship["source"] === sourceNodeId && relationship["target"] === targetNodeId && relationship["label"] === label) {
                return true;
            }
        }
        return false;
    }

    /**
     * Add new node to graph
     * @param{nodeId}: node value
     * @param{nodeType}: type of the indicator saved in the node
     */
    addNode(nodeId, nodeType) {
        if (!this.nodeInGraph(nodeId)) {
            this.graph["nodes"].push({
                id: nodeId,
                type: nodeType
            });
            this.saveGraph();
            return true;
        }
        return false;
    }

    /**
     * Delete a node
     * @param{nodeId}: id of the node to delete
     */
    deleteNode(nodeId) {
        let preservedNodes = [];
        for (let node in this.graph['nodes']) {
            if (this.graph['nodes'][node].id != nodeId) {
                preservedNodes.push(this.graph['nodes'][node]);
            }
        }
        this.graph['nodes'] = preservedNodes;

        let preservedLinks = [];
        for (let link in this.graph['links']) {
            if (this.graph['links'][link].source != nodeId && this.graph['links'][link].target != nodeId) {
                preservedLinks.push(this.graph['links']);
            }
        }

        this.graph['links'] = preservedLinks;

        this.saveGraph();
    }

    /**
     * Add relationship to graph
     * @param{sourceNode}: Id of the node from which the relationship starts
     * @param{targetNode}: Id of the target node of the relationship
     * @param{label}: relationship label
     */
    addRelationship(sourceNode, targetNode, label) {
        if (!this.relationshipInGraph(sourceNode, targetNode, label)) {
            this.graph['links'].push({
                source: sourceNode,
                target: targetNode,
                label: label
            });
            this.saveGraph();
            return true;
        } else {
            return false;
        }
    }

    /**
     * Get graph nodes
     */
    getNodes() {
        return this.graph['nodes'];
    }

    /**
     * Get graph relationships
     */
    getRelationships() {
        return this.graph['links'];
    }
}

