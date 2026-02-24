# Network Topology

[![Donate with PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.com/donate?business=Z9USFAAMBJ29S&no_recurring=0&item_name=Developing+the+Network+Topology+plugin+for+Grafana+to+solve+real+monitoring+issues.+Help+me+keep+the+project+evolving!&currency_code=USD)

_(🇧🇷 Brazilian or Portuguese speaker? [Click here to read this documentation in Portuguese](README-pt.md))_

## Overview / Introduction

Network Topology is a Grafana panel plugin built to display interactive network maps using Cytoscape.js, natively integrated with Grafana's Zabbix Data Source responses.

![Topology View](https://raw.githubusercontent.com/gabrielnsw/network-topology-plugin/main/src/img/topology-view.png)

Instead of relying on external servers or intermediate APIs, this panel leverages the raw data (DataFrames) pulled by Grafana from the official Zabbix plugin. This allows accurate, real-time visualization of interface traffic, packet loss, latency, and status (UP/DOWN) mapped directly onto your drawn devices.

**Key features:**

- **Interactive visual editor:** Add routers, switches, servers, antennas, and customize links and sizes entirely via drag-and-drop within the panel.
- **Full Zabbix integration:** Captures topology element history and metrics strictly from configured queries using correct tracking IDs.
- **Dynamic link inspection:** Edges (connection lines) dynamically shift colors as traffic passes (e.g. gigabits/megabits), visually identifying bottlenecks and physical threshold issues.
- **Built-in local backup:** Native tools allow your entire mapped topology and theme customizations to be exported as a JSON safely or ported into new dashboards seamlessly.
- **Native translation:** Built-in dashboard interface support accommodating English, Spanish, and Portuguese out of the box.

### Gallery

**Add Device & Metrics Setup:**
![Add Device](https://raw.githubusercontent.com/gabrielnsw/network-topology-plugin/main/src/img/add-device.png)

**Link Configuration:**
![Configure Connection](https://raw.githubusercontent.com/gabrielnsw/network-topology-plugin/main/src/img/configure-connection.png)

**Connection Details & Inspector:**
![Connection Details](https://raw.githubusercontent.com/gabrielnsw/network-topology-plugin/main/src/img/connection-details.png)

**Panel Settings & Theming:**
![Settings](https://raw.githubusercontent.com/gabrielnsw/network-topology-plugin/main/src/img/settings.png)

## Requirements

To run this plugin successfully, you must have:

- **Grafana** version 10.0+
- **Zabbix Plugin for Grafana** (Alexander Zobnin's app) installed and configured as a Data Source.

## Getting Started

1. Place the generated content strictly into your `/var/lib/grafana/plugins/` directory (or wherever custom plugins reside in your cluster), and restart the Grafana engine.
2. Open or create a dashboard and insert the **Network Topology** panel.
3. In the query section, define standard triggers targeting the Zabbix Data Source.
4. Fetch historical items you require (e.g., `net.if.in`, `net.if.out`, `icmpping`) using the **Metrics** query mode.
5. Open the visual configuration interface on the panel. Start inserting your devices mapping against active hosts found in DataFrames, and connect their tracked interfaces via links.
6. Simply save your Grafana dashboard locally. The plugin natively commits mapped topology JSON definitions securely over Grafana options data.

## Documentation

For comprehensive instructions, Portuguese guides, and advanced configurations (such as custom metrics mapping), please visit our [GitHub repository](https://github.com/gabrielnsw/network-topology-plugin).

_(PT-BR: O guia de uso completo e detalhado 100% em português se encontra em nosso repositório oficial no GitHub)._

## Contributing

Feedback and contributions are highly welcome!
If you want folks to contribute to the plugin or report any issues, please submit a pull request or open an issue on the [Network Topology GitHub page](https://github.com/gabrielnsw/network-topology-plugin).
