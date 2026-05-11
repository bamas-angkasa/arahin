# Arahin — Product Design Direction & UI Concept

## Overview

Arahin is a modern route optimization platform for Indonesian UMKM and delivery-based businesses.

The main objective of the product is to help users:
- optimize delivery routes
- reduce fuel costs
- avoid chaotic delivery order
- simplify operational workflow
- improve driver experience

The product should feel:
- lightweight
- fast
- modern
- map-centric
- practical
- mobile-friendly
- not enterprise-heavy

The UI direction is inspired by:
- modern dispatch dashboard
- clean SaaS applications
- logistics control center
- minimal operational tools

---

# Core Design Principles

## 1. Simplicity First

Avoid overwhelming users with:
- too many metrics
- enterprise ERP complexity
- dense tables
- complicated navigation

Focus on:
- quick understanding
- fast actions
- clean hierarchy
- operational clarity

---

## 2. Map-Centric Experience

The map should become the main visual focus.

Users should immediately understand:
- where deliveries are
- route flow
- stop order
- active drivers
- optimization result

Map must feel:
- responsive
- interactive
- smooth
- modern

---

## 3. Delivery Workflow Driven

The entire interface should support:
1. Input addresses
2. Optimize routes
3. Assign driver
4. Navigate
5. Track delivery progress

Everything else is secondary.

---

# Visual Direction

## Style Keywords

- Clean
- Minimal
- Professional
- Operational
- Friendly
- Lightweight
- Spatial
- Modern logistics SaaS

---

# Color Palette

## Primary
Blue:
- #2563EB
- used for:
  - primary buttons
  - active states
  - routing indicators

## Background
- #F8FAFC
- #FFFFFF

## Text
Primary:
- #0F172A

Secondary:
- #64748B

## Status Colors

Success:
- #22C55E

Warning:
- #F59E0B

Danger:
- #EF4444

Border:
- #E2E8F0

---

# Typography

Use:
- Inter
or
- Geist

Typography should feel:
- clean
- modern
- highly readable

Hierarchy:
- Large bold page titles
- Medium operational labels
- Small muted helper text

Avoid:
- overly large hero typography inside dashboard
- decorative typography

---

# Layout System

## Dashboard Layout

Structure:
- Left Sidebar Navigation
- Top Navigation Bar
- Main Operational Area
- Map Section
- Modal/Dialog Workflow

---

# Sidebar Navigation

Sidebar should be:
- compact
- icon-first
- collapsible

Suggested Menu:
- Dashboard
- Routing
- Drivers
- Deliveries
- Customers
- Analytics
- Settings

Active menu:
- highlighted with blue background
- rounded corners

---

# Top Navigation

Contains:
- search
- notifications
- dark/light toggle
- profile dropdown

Top navigation should feel:
- minimal
- floating
- spacious

---

# Main Routing Page

## Layout Composition

Two-column layout:

LEFT:
- Driver list
- Delivery list
- Route summary
- Quick actions

RIGHT:
- Interactive map
- Delivery pins
- Route visualization

Map should dominate the screen.

---

# Route Detail Modal

This is a key UX component.

Inspired by modern dispatch systems.

## Modal Goals

Allow users to:
- create route
- configure stops
- assign drivers
- optimize quickly

---

# Modal Design Rules

## Style

- rounded corners
- soft shadows
- centered
- clean spacing

## Avoid

- overly dense forms
- too many fields
- complicated nested forms

---

# Input Design

Inputs should:
- feel soft
- large enough
- mobile-friendly

Use:
- rounded-xl
- subtle borders
- blue focus state

---

# Route Visualization

Routes should use:
- smooth curved lines
- numbered stops
- animated flow (optional)

Pins:
- clean minimal pin design
- route order visible

---

# Driver Cards

Driver cards should show:
- avatar
- name
- email/phone
- status
- assigned routes

Status badges:
- Active
- Idle
- Delivering
- Completed

---

# UX Philosophy

Arahin should feel like:
- "Google Maps for delivery operations"

NOT:
- warehouse ERP
- enterprise logistics monster
- complicated fleet management system

---

# Mobile Experience

Mobile is critical.

Driver view should:
- open instantly
- show next stop
- provide navigation button
- support one-hand usage

Large CTA buttons:
- Start Route
- Navigate
- Mark Delivered

---

# Core User Flow

## Admin Workflow

1. Create delivery plan
2. Paste multiple addresses
3. Auto geocode
4. Optimize route
5. Assign driver
6. Share route
7. Track progress

---

# Bulk Paste UX (Important)

This should become Arahin's signature feature.

Users paste raw text like:

Budi - Jl Ijen 10
Sinta - Jl Soekarno Hatta
Toko Maju - Dinoyo

System automatically extracts:
- recipient
- address
- phone
- notes

Then:
- geocodes
- optimizes route
- visualizes map

This should feel magical and instant.

---

# Animation Guidelines

Use subtle animations:
- fade in
- smooth hover
- soft scale
- route drawing animation

Avoid:
- heavy motion
- distracting transitions

---

# Empty States

Friendly empty states:
- helpful illustrations
- quick CTA
- onboarding guidance

Example:
"Belum ada rute hari ini. Yuk buat pengiriman pertama."

---

# Design References

Visual inspiration:
- Linear
- Stripe Dashboard
- Uber Dispatch
- Onfleet
- Gojek operational UI

---

# Overall Product Feeling

Arahin should communicate:

"Delivery operations made simple."

The experience should reduce stress,
not add operational complexity.

The UI should feel:
- calm
- fast
- intelligent
- organized
- trustworthy