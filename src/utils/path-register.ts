import { register } from 'tsconfig-paths';
import { resolve } from 'path';

const baseUrl = resolve(__dirname, '../../dist');

register({
    baseUrl,
    paths: {
        '@/*': ['./*']
    }
}); 