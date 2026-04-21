import { pipeline } from "@huggingface/transformers";
export async function EmbedQuery(q) {
    const embed = await pipeline("feature-extraction", "onnx-community/all-MiniLM-L6-v2");
    const embeddedQuery = await embed(q, { pooling: 'mean', normalize: true });
    return Array.from(embeddedQuery.data);
}
