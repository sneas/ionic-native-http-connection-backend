import { detectResponseType } from './response-type';

describe('detectResponseType', () => {
    it('respects json', () => {
        expect(detectResponseType('json')).toEqual('text');
    });

    it('respects blob', () => {
        expect(detectResponseType('blob')).toEqual('blob');
    });

    it('respects arraybuffer', () => {
        expect(detectResponseType('arraybuffer')).toEqual('arraybuffer');
    });

    it('respects text', () => {
        expect(detectResponseType('text')).toEqual('text');
    });
});
