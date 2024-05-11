class Graph {
    static relationshipTypes = [
        "attributed-to",
        "authored-by",
        "av-analysis-of",
        "based-on",
        "beacons-to",
        "characterizes",
        "communicates-with",
        "compromises",
        "consists-of",
        "controls",
        "delivers",
        "derived-from",
        "downloads",
        "drops",
        "duplicate-of",
        "dynamic-analysis-of",
        "exfiltrates-to",
        "exploits",
        "has",
        "hosts",
        "impersonates",
        "indicates",
        "investigates",
        "located-at",
        "mitigates",
        "originates-from",
        "owns",
        "related-to",
        "remediates",
        "static-analysis-of",
        "targets",
        "used-by",
        "uses",
        "variant-of",
        "refers-to",
        "source-of",
        "destination-of"
    ]

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
     * Get a dictonary of hashes
     * @param{hash}: hash to add to the dictionary
     * @return hash dictionary
     */
    #getHashDictionary(hash) {
        switch (hash.length) {
            case 32:
                return {
                    'MD5': hash
                };
            case 40:
                return {
                    'SHA-1': hash
                };
            case 64:
                return {
                    'SHA-256': hash
                };
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
     * Check if a link is in the graph
     * @param{sourceNodeId}: id of the source node
     * @param{targetNodeId}: id of the target node
     * @param{label}: link node
     */
    linkInGraph(sourceNodeId, targetNodeId, label) {
        for (let link of this.graph["links"]) {
            if (link["from"] === sourceNodeId && link["to"] === targetNodeId && link["label"] === label) {
                return true;
            }
        }
        return false;
    }

    /**
     * Add a STIX Object to the graph
     * @param{id}: Node identifier
     * @param{label}: Node label (visible in the graph)
     * @param{stix}: STIX content
     */
    addSTIXNode(id, label, type, stix) {
        if(!this.nodeInGraph(id)) {
            const createdDate = new Date().toISOString();
            stix["created"] = createdDate;
            stix["modified"] = createdDate;
            stix["spec_version"] = "2.1";
            this.graph["nodes"].push({
                id: id,
                label: label,
                type: type,
                stix: stix
            });
            this.saveGraph();
            return true;
        } else {
            return false;
        }
    }

    /**
     * Add new node to graph
     * @param{nodeValue}: node value
     * @param{nodeType}: type of the indicator saved in the node
     */
    addNode(nodeValue, nodeType) {
        if (!this.nodeInGraph(nodeValue)) {
            const uuid = crypto.randomUUID();
            switch (nodeType) {
                case 'domain':
                    this.graph["nodes"].push({
                        id: nodeValue,
                        label: nodeValue,
                        type: nodeType,
                        stix: {
                            id: 'domain-name--'+uuid,
                            type: 'domain-name',
                            value: nodeValue
                        }
                    });
                    break;
                case 'ip':
                    this.graph["nodes"].push({
                        id: nodeValue,
                        label: nodeValue,
                        type: nodeType,
                        stix: {
                            id: 'ipv4-addr--'+uuid,
                            type: 'ipv4-addr',
                            value: nodeValue
                        }
                    });
                    break;
                case 'hash':
                    this.graph["nodes"].push({
                        id: nodeValue,
                        label: "file",
                        type: nodeType,
                        stix: {
                            id: 'file--'+uuid,
                            type: 'file',
                            name: "",
                            hashes: this.getHashDictionary(nodeValue)
                        }
                    });
                    break;
                case 'url':
                    this.graph["nodes"].push({
                        id: nodeValue,
                        label: nodeValue,
                        type: nodeType,
                        stix: {
                            id: 'url--'+uuid,
                            type: 'url',
                            value: nodeValue
                        }
                    });
                    break;
                case 'email':
                    this.graph["nodes"].push({
                        id: nodeValue,
                        label: nodeValue,
                        type: nodeType,
                        stix: {
                            id: 'email-addr--'+uuid,
                            type: 'email-addr',
                            value: nodeValue
                        }
                    });
                    break;
                case 'cve':
                    this.graph["nodes"].push({
                        id: nodeValue,
                        label: nodeValue,
                        type: nodeType,
                        stix: {
                            id: 'vulnerability--'+uuid,
                            type: 'vulnerability',
                            name: nodeValue
                        }
                    });
                    break;

            }
            this.saveGraph();
            return true;
        }
        return false;
    }

    /**
     * Edit a STIX Object
     * @param{id}: Node identifier
     * @param{label}: Node label (visible in the graph)
     * @param{stix}: STIX content
     */
    editSTIXNode(id, label, type, stix) {
        if(this.nodeInGraph(id)) {
            const modifiedDate = new Date().toISOString();

            for (let node in this.graph["nodes"]) {
                if (this.graph["nodes"][node].id === id) {
                    stix["created"] = this.graph["nodes"][node]["created"];
                    stix["modified"] = modifiedDate;
                    stix["spec_version"] = "2.1";
                    this.graph["nodes"][node].label = label;
                    this.graph["nodes"][node].stix = stix;
                }
            }
            this.saveGraph();
            return true;
        } else {
            return false;
        }
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
            if (this.graph['links'][link].from != nodeId && this.graph['links'][link].to != nodeId) {
                preservedLinks.push(this.graph['links'][link]);
            }
        }

        this.graph['links'] = preservedLinks;

        this.saveGraph();
    }

    /**
     * Delete an edge
     * @param{nodeFrom}: node from which the edge starts
     * @param{nodeTo}: node connected by the edge
     * @param{label}: edge's label
     */
    deleteLink(nodeFrom, nodeTo, label) {
        let preservedLinks = [];
        for (let link in this.graph['links']) {
            if (this.graph['links'][link].from != nodeFrom || this.graph['links'][link].to != nodeTo || this.graph['links'][link].label != label) {
                preservedLinks.push(this.graph['links'][link]);
            }
        }

        this.graph['links'] = preservedLinks;

        this.saveGraph();
    }

    /**
     * Add link to graph
     * @param{sourceNode}: Id of the node from which the link starts
     * @param{targetNode}: Id of the target node of the link
     * @param{label}: link label
     */
    addLink(sourceNode, targetNode, label) {
        if (!this.linkInGraph(sourceNode, targetNode, label)) {
            this.graph['links'].push({
                from: sourceNode,
                to: targetNode,
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
     * Get nodes by label
     * @param{label} Label to search
     * @return node ids with the provided label
     */
    getNodesByLabel(label) {
        let filteredNodes = Array();
        for (let node of this.graph['nodes']) {
            if (node['label'] === label) {
                filteredNodes.push(node['id']);
            }
        }
        return filteredNodes
    }

    /**
     * Get a node by id
     * @param{nodeId} id of the node to get
     * @return node with the provided id
     */
    getNode(nodeId) {
        for (let node of this.graph['nodes']) {
            if (node['id'] === nodeId) {
                return node;
            }
        }
    }


    /**
     * Get graph link
     */
    getLinks() {
        return this.graph['links'];
    }

    /**
     * Get the nodes linked to the node provided
     * @param{node}: id of the node to scan
     * @return list of node ids
     */
    getIncomingNodes(node) {
        let incomingNodes = Array();
        for (let link of this.graph['links']) {
            if (link['to'] === node) {
                incomingNodes.push(link['from']);
            }
        }
        return incomingNodes
    }
    
    /**
     * Get the nodes to which to the provided is linked
     * @param{node}: id of the node to scan
     * @return list of node ids
     */
    getOutgoingNodes(node) {
        let incomingNodes = Array();
        for (let link of this.graph['links']) {
            if (link['from'] === node) {
                incomingNodes.push(link['to']);
            }
        }
        return incomingNodes
    }
}

