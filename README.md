# CrisisOps AI: Operational State Machine Prototype

[![Deployment](https://img.shields.io/badge/Deployment-Live%20Demo-brightgreen)](https://your-deployment-link.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20TS%20%7C%20Vite%20%7C%20TailwindV4-blue)](./package.json)
[![Inspiration](https://img.shields.io/badge/Inspired%20by-Palantir%20AIP-orange)](https://www.palantir.com/platforms/aip/)

> **CrisisOps AI** transforms unstructured emergency reports into structured operational objects, AI-recommended actions, human approvals, and auditable logs.

## 🧠 The Thesis: AI as an Operational Layer

Most AI demos stop at text generation. **CrisisOps AI** focuses on the "last mile" of operations:
1. **Ontology over Text**: Don't just chat; model the world as a graph of objects (Incidents, Locations, Assets).
2. **Action-Oriented**: Intelligence is useless unless it leads to a discrete, executable decision.
3. **Human-in-the-Loop**: AI recommends; Humans approve. Accountability is non-negotiable in high-stakes environments.
4. **Dynamic State Management**: Real-world incidents evolve. The system must adapt its operational twin as new data flows in.

---

## 🚀 Key Features

### 1. Operational Twin (Live Object State)
The system parses chaos into strict real-world entities. Every object has a live status (e.g., Location: `Normal` → `Restricted`) that updates based on approved actions and new intelligence.

### 2. Evidence-Based Transparency
To eliminate the "Black Box" problem, every recommendation includes an **Evidence Panel** showing the exact snippet of text that triggered the AI's logic.

### 3. True Approval Workflow
Operators can **Approve, Hold, or Reject** actions. Every decision is recorded in an immutable **Audit Log** with millisecond-precision timestamps.

### 4. Dynamic Escalation Engine
Use the "Simulate Second Report" button to witness the system managing a live state transition. Watch the severity jump from **High** to **Critical**, triggering automatic status updates across the entire object graph.

---

## 🛠 Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript (Strict Typing for Operational Safety)
- **Styling**: Tailwind CSS v4 (Using the new `@theme` and `@import` engine)
- **Icons**: Lucide React
- **Aesthetic**: "Command Center" Dark Mode

---

## 📦 Getting Started

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/CrisisOps-AI.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

### Deployment (Always Online)
This project is optimized for **Vercel** or **Netlify**.
1. Push this code to a GitHub repository.
2. Connect your repository to [Vercel](https://vercel.com).
3. The build command is `npm run build` and the output directory is `dist`.

---

## 📖 Demo Scenario

1. **Input**: *"Smoke reported near Iribe Center. Two classrooms lost power. Students are evacuating and one person may need medical help."*
2. **Result**: System extracts the Incident, Location, and Assets. Recommends `Dispatch Campus Safety`.
3. **Approval**: Operator clicks **Approve**. Audit Log records the decision.
4. **Escalation**: Click **Simulate Second Report**. System receives: *"Smoke spreading to the east entrance."*
5. **Impact**: Severity escalates to **Critical**. Location status changes to **Restricted**. New actions appear.

---

Developed as a Vertical Slice of Operational AI for high-stakes decision-making.
