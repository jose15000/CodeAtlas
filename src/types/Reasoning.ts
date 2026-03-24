import { AgentThought } from "./AgentThought";
import { NodeMetadata } from "./NodeMetadata";

export interface IReasoning extends NodeMetadata {
    prompt: string;
    thoughtDescription: string;
    thoughtDetails: AgentThought;
    solution: string;
}