import type { Edge } from "./models/Edge.js"
import type { Node } from "./models/Node.js"

export class Graph {

    nodes = new Map<string, Node>()
    edges: Edge[] = []

    addNode(node: Node) {
        this.nodes.set(node.id, node)
    }

    addEdge(edge: Edge) {
        this.edges.push(edge)
    }

    getNode(id: string) {
        return this.nodes.get(id)
    }

    getEdgesFrom(id: string) {
        return this.edges.filter(e => e.from === id)
    }

    getEdgesTo(id: string) {
        return this.edges.filter(e => e.to === id)
    }

    removeSubGraphOfFile(filePath: string) {
        const nodesToRemove = new Set<string>();

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
        this.edges = this.edges.filter(
            e => !nodesToRemove.has(e.from)
        );
    }

}