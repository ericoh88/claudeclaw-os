# AI Audit Framework Flowchart

**Date:** 2026-05-06
**Type:** Process Documentation / Visual Framework
**Format:** Excalidraw diagram (rendered to PNG)
**File:** `/home/rhino/video-projects/ai-audit-flowchart.excalidraw`
**Rendered:** `/home/rhino/video-projects/ai-audit-flowchart.png` (2400x6586, ~2.9MB)

## Overview

A comprehensive AI audit flowchart synthesizing five major governance frameworks into a single operational process. Designed as both a client-facing deliverable and internal ops guide for Naventic AI's audit practice.

Dark background (#0a0a1a) with color-coded phases, decision gates, and remediation loops. Created in Excalidraw and rendered via Kroki.io (SVG) + ImageMagick (PNG).

## Standards Referenced

- **ISO 42001** -- AI Management System standard
- **NIST AI RMF** -- Risk Management Framework (GOVERN, MAP, MEASURE, MANAGE)
- **EU AI Act** -- European AI regulation (risk classification, conformity assessment)
- **IEEE 7000 series** -- Ethical AI standards (7001 transparency, 7002 privacy, 7003 bias, 7010 well-being)
- **Singapore IMDA** -- Model AI Governance Framework

## 8-Phase Audit Process

### Phase 0: Initiation & Scoping (Indigo #4f46e5)
- Define audit scope & objectives
- AI system inventory & risk classification (EU AI Act Art.6 / ISO 42001 A.5)
- Stakeholder identification & engagement plan
- Risk appetite & materiality thresholds
- Assemble audit team & resources

**Gate:** Scope Approved? -> If No: Revise Scope

### Phase 1: Governance & Accountability (Purple #7c3aed)
- AI strategy & policy review
- Roles, responsibilities & RACI matrix (NIST GOVERN-1.1 / ISO 42001 5.3)
- AI risk management framework assessment
- Third-party & supply chain governance
- Training, competency & incident response

**Gate:** Governance Adequate? -> If No: Remediate Gaps

### Phase 2: Data Governance & Privacy (Sky Blue #0284c7)
- Data inventory, lineage & provenance
- Data quality & representativeness (NIST MAP-2.1 / 2.2 / AI Act Art.10)
- Privacy & GDPR/PDPA compliance
- Consent, rights & copyright management
- Bias in training data & security controls

**Gate:** Data Gov Met? -> If No: Fix Data Issues

### Phase 3: Model Performance & Validation (Amber #d97706)
- Model documentation & technical inventory
- Performance metrics (accuracy, F1, AUC-ROC) & benchmarks (NIST MEASURE-2.5 / 2.6)
- Validation methodology & data leakage checks
- Explainability (SHAP, LIME) & interpretability
- Human oversight & override mechanisms

**Gate:** Performance Acceptable? -> If No: Retrain / Adjust

### Phase 4: Bias, Fairness & Ethics (Pink #db2777)
- Define fairness criteria & protected attributes (NIST MEASURE-2.11 / IEEE 7003)
- Quantitative bias testing (AI Fairness 360)
- Qualitative ethical review & stakeholder panel
- Intersectional & multi-group disparity analysis
- Human well-being impact assessment
- Mitigation strategy review

**Gate:** Fairness Standards Met? -> If No: Mitigate Bias

### Phase 5: Security & Adversarial Robustness (Red #dc2626)
- AI threat modeling (MITRE ATLAS)
- Adversarial attacks, evasion, poisoning, exfiltration (NIST MANAGE-2.1 / AI Act Art.15)
- Prompt injection & LLM manipulation (OWASP)
- Data pipeline & ML supply chain security
- Privacy attacks & red team review

**Gate:** Security Acceptable? -> If No: Patch & Harden

### Phase 6: Regulatory Compliance & Documentation (Emerald #059669)
- EU AI Act risk classification confirmation
- Technical documentation conformance (EU documentation standard Art.11 / ISO 42001)
- Transparency & disclosure (Art.50)
- Record-keeping & audit trail integrity
- Sector-specific requirements (health, HR)
- Cross-jurisdictional alignment & registration

**Gate:** Fully Compliant? -> If No: Address Deficiencies

### Phase 7: Monitoring & Continuous Improvement (Gray #6b7280)
- Post-deployment monitoring (drift, bias, perf)
- KPI dashboards & alerting thresholds (NIST MANAGE-4.1 / AI Act Article 72 / ISO 42001)
- Feedback & appeal mechanisms
- Model lifecycle & versioning governance
- Audit report generation & action plan
- Continuous improvement cycle (ISO 42001 Syr)

**Gate:** All Findings Addressed? -> If No: Re-Audit (Priority = P1 > P2 > P3, set by Audit Priority)

### Final Output
- AUDIT COMPLETE: Report Issued

## Structural Elements

- **GOVERN Continuous Oversight** (left sidebar, purple dashed): Continuous governance overlay spanning all phases, per NIST AI RMF GOVERN function
- **Remediation Loops** (right side, orange dashed): Each decision gate has a "No" path leading to a remediation action, which loops back into the phase
- **Decision Gates** (yellow diamonds): Pass/fail checkpoints between each phase
- **Legend** (top-right): Color-coded guide to audit phases, decision gates, remediation loops, and GOVERN sidebar
- **Standards Footer**: "ISO 42001 | NIST AI RMF | EU AI Act | IEEE 7006 | Singapore IMDA"
- **Branding Footer**: "Naventic AI | AI Audit Framework v1.0 | 2026"

## Technical Notes

- Excalidraw JSON rendered via Kroki.io API (SVG output) then converted to PNG with ImageMagick
- `convert -density 300 -background none input.svg -resize 2400x output.png`
- Tall vertical format (2400x6586) to accommodate all 8 phases in a linear flow
- ~130 Excalidraw elements (rectangles, diamonds, arrows, text labels)

## Audience

- **Client-facing:** Walkthrough of audit methodology, standards compliance, and deliverables
- **Internal ops:** Step-by-step checklist for conducting AI audits at Naventic AI

Built by Naventic AI.
