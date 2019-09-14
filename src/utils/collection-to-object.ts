interface Collection {
    keys: () => string[];
    get: (key: string) => string | null;
}

type CollectionObject = { [key: string]: string | null };

export const collectionToObject = (
    collection: Collection,
): CollectionObject => {
    return collection.keys().reduce((result, key) => {
        return {
            ...result,
            [key]: collection.get(key),
        };
    }, {});
};
