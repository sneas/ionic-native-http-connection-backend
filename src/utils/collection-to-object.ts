interface Collection {
    keys: () => string[];
    get: (key: string) => string | null;
    getAll: (key: string) => string[];
}

type CollectionObject = { [key: string]: string | null };

export const collectionToObject = (
    collection: Collection,
): CollectionObject => {
    return collection.keys().reduce((result, key) => {
        const allValues = collection.getAll(key);
        return {
            ...result,
            [key]: allValues.length > 1 ? allValues : collection.get(key),
        };
    }, {});
};
