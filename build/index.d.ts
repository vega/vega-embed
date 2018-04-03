import embed from './embed';
declare const embedModule: typeof embed & {
    default?: typeof embed;
    vega?;
    vl?;
};
export = embedModule;
