export const detectResponseType = (
    requestResponseType: 'arraybuffer' | 'blob' | 'text' | 'json',
): 'arraybuffer' | 'blob' | 'text' => {
    if (requestResponseType === 'json') {
        return 'text';
    } else {
        return requestResponseType;
    }
};
