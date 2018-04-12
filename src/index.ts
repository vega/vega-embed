import embed, { vega, vl } from './embed';

(embed as any).vl = vl;
(embed as any).vega = vega;
(embed as any).default = embed;

export default embed;
