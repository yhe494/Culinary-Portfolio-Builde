import '@testing-library/jest-dom';

// Polyfill for TextEncoder in Node
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
