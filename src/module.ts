import * as React from 'react';
import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './components/SimplePanel';

const BrandingEditor = () => {
  return React.createElement(
    'div',
    {
      style: {
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        borderRadius: '8px',
        padding: '16px',
        marginTop: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
    },
    React.createElement(
      'div',
      { style: { fontSize: '14px', color: '#e5e7eb', marginBottom: '12px', lineHeight: '1.4' } },
      React.createElement('strong', { style: { color: '#8b5cf6' } }, 'Built by @gabrielnsw <3'),
      React.createElement('br'),
      'Thanks for using it!'
    ),
    React.createElement(
      'a',
      {
        href: 'https://www.paypal.com/donate?business=Z9USFAAMBJ29S&no_recurring=0&item_name=Developing+the+Network+Topology+plugin+for+Grafana+to+solve+real+monitoring+issues.+Help+me+keep+the+project+evolving!&currency_code=USD',
        target: '_blank',
        rel: 'noopener noreferrer',
        style: {
          display: 'inline-block',
          background: '#8b5cf6',
          color: '#ffffff',
          textDecoration: 'none',
          padding: '10px 24px',
          borderRadius: '6px',
          fontWeight: 'bold',
          marginTop: '10px',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        },
      },
      'Donate with PayPal'
    )
  );
};

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions((builder) => {
  return builder.addCustomEditor({
    id: 'branding',
    path: 'branding',
    name: 'Plugin Info',
    editor: BrandingEditor,
  });
});
