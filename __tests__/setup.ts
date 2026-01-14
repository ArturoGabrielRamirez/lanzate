import { Window } from 'happy-dom';
import { configure } from '@testing-library/react';

// Create a new Window instance
const window = new Window({
  url: 'http://localhost:3000',
  width: 1024,
  height: 768,
});

// Set global DOM variables
(global as any).window = window;
(global as any).document = window.document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;
(global as any).Node = window.Node;
(global as any).Text = window.Text;
(global as any).DocumentFragment = window.DocumentFragment;
(global as any).MutationObserver = window.MutationObserver;
(global as any).getComputedStyle = window.getComputedStyle.bind(window);

// Configure testing library
configure({ testIdAttribute: 'data-testid' });
