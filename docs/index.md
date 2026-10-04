# Plotune Documentation

A modular, high-performance data visualization and signal analysis platform built for researchers, engineers, and students.

Real-time

Data Visualization

Modular

Architecture

Extensible

Plugin System

## Introduction

Plotune  enables real-time and offline visualization of streaming data from multiple sources such as UART, CAN, Bluetooth, and file-based logs. Designed for performance and flexibility, it serves researchers, engineers, and students alike.

## Core Philosophy

M

### Modularity

Every visualization, source, and calculation component is isolated and extendable. Drag, resize, or dock any element within the canvas.

E

### Extensibility

Through its SDK and API, developers can build custom plugins that integrate seamlessly with the Plotune core ecosystem.

P

### Performance

Redis-powered backend and multi-process Python architecture ensure fast data throughput, even for high-frequency streams.

## Architecture Overview

### Frontend

- Built with  PyQt5  for responsive desktop UI

- Supports  drag-and-drop  and docking layouts

- Component-based views (Oscilloscope, Scatter, Bridge, Statistical)

### Backend

- Python with plugin-based data acquisition

- Redis  for fast in-memory streaming

- Handles source management and live stream distribution

## Interface Layout

#### Main Areas

- Top Menu:  Home, Configuration, View, Help

- Left Sidebar:  File Explorer, Variable Explorer

- Right Sidebar:  Calculation, Plugins, Sources

- Canvas Area:  Central workspace

#### Data Sources

UART  CAN Bus  Bluetooth  CSV Files  Network Streams  Simulation

## Extensibility & Plugins

Plotune offers a flexible  Extension SDK for building plugins that extend both frontend and backend capabilities.

#### Plugin Capabilities

- New data acquisition methods

- Custom visualization panels

- Mathematical computation nodes

- Integration bridges (MATLAB, cloud APIs)

#### Distribution

- Curated internal marketplace

- Online and offline modes

- Secure token-based licensing

## Typical Use Cases

Real-time sensor data visualization during field testing

Offline log replay and comparative analysis

Custom signal processing and algorithm validation

Educational demonstrations for signal analytics

## Roadmap Highlights

AI-assisted data pattern recognition

Web dashboard for stream management

Distributed stream processing

Advanced plugin store with auto-deployment

Last updated: November 2025 — Plotune Core v1.0.0

Source: https://www.plotune.net/docs
