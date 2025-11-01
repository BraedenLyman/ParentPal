import '@testing-library/jest-dom';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    ok: true,
    status: 200,
  })
);

global.Response = class Response {
  constructor(body, init) {
    this.body = body;
    this.init = init;
    this.ok = init?.status ? init.status >= 200 && init.status < 300 : true;
    this.status = init?.status || 200;
  }
  json() {
    return Promise.resolve(JSON.parse(this.body || '{}'));
  }
  text() {
    return Promise.resolve(this.body || '');
  }
};

jest.mock('framer-motion', () => ({
  ...jest.requireActual('framer-motion'),
  AnimatePresence: ({ children }) => children,
  motion: {
    div: 'div',
    button: 'button',
    span: 'span',
    a: 'a',
    li: 'li',
    ul: 'ul',
    ol: 'ol',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    p: 'p',
    img: 'img',
    form: 'form',
    input: 'input',
    textarea: 'textarea',
    select: 'select',
    option: 'option',
    label: 'label',
    fieldset: 'fieldset',
    legend: 'legend',
  },
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  }),
  useMotionValue: (initial) => ({
    get: () => initial,
    set: jest.fn(),
    onChange: jest.fn(),
    destroy: jest.fn(),
  }),
  useTransform: () => ({}),
  useSpring: () => ({}),
}));

const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: An update to') ||
       args[0].includes('act(...)') ||
       args[0].includes('dynamic import'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});