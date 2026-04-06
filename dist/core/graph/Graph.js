export class Graph {
    constructor() {
        this.nodes = new Map();
        this.edges = [];
    }
    addNode(node) {
        this.nodes.set(node.id, node);
    }
    addEdge(edge) {
        this.edges.push(edge);
    }
    getNode(id) {
        return this.nodes.get(id);
    }
    getEdgesFrom(id) {
        return this.edges.filter(e => e.from === id);
    }
    getEdgesTo(id) {
        return this.edges.filter(e => e.to === id);
    }
    removeSubGraphOfFile(filePath) {
        const nodesToRemove = new Set();
        // Localiza todos os nós cujo ID seja o próprio arquivo ou prefixado com o arquivo + '#'
        for (const id of this.nodes.keys()) {
            if (id === filePath || id.startsWith(`${filePath}#`)) {
                nodesToRemove.add(id);
            }
        }
        // Remove os nós do mapa
        for (const id of nodesToRemove) {
            this.nodes.delete(id);
        }
        // Filtra arestas que SAEM de algum desses nós na reindexação
        // Cuidado: Não podemos filtrar e.to senão apagamos referências (IMPORTS, CALLS)
        // de outros arquivos que apontavam para este e não foram reindexados.
        this.edges = this.edges.filter(e => !nodesToRemove.has(e.from));
    }
}
