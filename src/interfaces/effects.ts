export type IEffectSettings = Record<string,  Record<string, number>>;

export type IEffect = {
    enabled: boolean;
    settings: IEffectSettings;
    name: string,
    color: string,
    node: any,
};

