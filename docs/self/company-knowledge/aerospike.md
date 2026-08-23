# Aerospike — company and product brief

Last updated: 2026-08-20. Mix of **public docs** and **Chris’s memory** from the case-study interview. Inferences are labeled.

Chris: Senior FE, Cloud Team, Sep 2024 – Jan 2026. **Architected the provisioning wizard** and built many of its pages; other Cloud FE engineers shipped additional wizard and console work following those patterns. Live: https://console.aerospike.com

---

## What Aerospike is (one breath)

Aerospike is a **real-time NoSQL database** for very high throughput and low latency (often described as millions of tx/sec, sub-millisecond to low-teen ms). They sell the **database** (Community vs Enterprise) and **ways to run it**: you operate it yourself, Aerospike SREs operate it for you (**Managed Services / ACMS**), or you **self-serve provision** a curated cluster (**Aerospike Cloud**, a DBaaS).

Chris did **not** write the database engine. He **architected the provisioning wizard** and built many of its pages on the **Cloud Console frontend** — the UI where a customer (or SE) turns a trial into a running cluster. Other frontend engineers on the Cloud team shipped additional wizard and console surfaces following those patterns.

---

## Glossary (do not mix these up)

| Term | What it is | Chris’s surface? |
|---|---|---|
| **Aerospike Database** | The server. Namespaces, replication factor, AP vs Strong Consistency, hybrid memory, XDR, etc. | Indirect — the wizard exposes a subset of this config |
| **Enterprise Edition vs Community** | Licensed vs free server. Cloud/console features sit on Enterprise. | No |
| **Self-managed** | Customer runs Aerospike in their cloud/on-prem (often with Kubernetes Operator). Full control, they own ops. | No |
| **ACMS = Aerospike Cloud Managed Service** | Official name (**not** “Cluster Management Service”). Premium **people-operated** service: Aerospike SREs provision, monitor, patch, scale. Customer talks to the ACMS team. AWS, GCP, Azure; often **in the customer’s cloud account**. Console here was a portal to **request** clusters and **submit change requests**, not full self-serve create. | Legacy console he had to migrate off / bridge |
| **Aerospike Cloud (DBaaS)** | **Self-service** managed database. Customer (or SE) provisions via **Console or API**. Cluster lands in **Aerospike’s AWS VPC**; customer connects with **VPC peering**. Curated config (not every on-prem knob). ~20 min to provision. Node **entitlements** gate how many nodes you can launch. | **Yes — this is the product Chris’s wizard ships** |
| **AMC = Aerospike Management Console** | Older **self-hosted monitoring UI** (community, archived). Different product. Do not say AMC when you mean ACMS. | No |
| **RJSF** | `react-jsonschema-form` — generates a form from a JSON Schema. **Incumbent** on the provisioning path before Chris’s work; Chris **replaced it entirely** with the wizard + JSON/YAML editor. | Yes — what he replaced |
| **SE** | Sales / Solutions Engineer. Gathers workload from the customer and helps size/configure. Chris said “SWEs”; **SWE means software engineer**. The people who interviewed the customer and stood up the DB on ACMS are **SEs / SREs / ACMS ops**, not product-eng SWEs. | Collaborators, not his title |

Public docs also say: **Aerospike Cloud vs Managed Services** — Cloud is automated self-serve in Aerospike-managed AWS with a curated feature set. Managed Services is hands-on SRE ops, including customer’s cloud account, multi-cloud.

---

## The two hosting models (this is the “two state models”)

Not two React stores. Two **ways a cluster comes into existence**.

### ACMS (human control plane)

1. Customer talks to Aerospike (SE / ACMS team).
2. Humans translate “fraud detection, N TB, these SLAs” into a real cluster plan.
3. ACMS ops **provision and run** the cluster (often in the **customer’s** VPC).
4. Console (per 2023 whitepaper) is how the customer **sees metrics, security policy, and files change requests** — “one-stop shop to **interact with the ACMS team**.” Adding a namespace is a **request**, not a button that mutates production by itself.

**Flexibility:** high (humans can set anything Aerospike supports).  
**Speed / productization:** slow; does not scale as a self-serve revenue motion.

### Aerospike Cloud (software control plane)

1. Account has **node entitlements** (new accounts start at 0 until Aerospike grants them).
2. User hits **Provision cluster** in Console (or `POST /v1/database/clusters`).
3. They pick region, AZ count, instance type, cluster size, storage mode, AP vs SC, etc.
4. Platform creates infra in **Aerospike’s AWS account**; ~20 minutes later the cluster is up.
5. App connects via **VPC peering**. Advanced knobs that are not first-class fields go through **advanced configuration** (JSON/YAML), with **platform constraints** (single namespace, always rack-aware, platform-managed disk/network, etc.).

**Flexibility:** lower (by design — “Just Aerospike” with guardrails).  
**Speed:** minutes, no ticket.

**Migration:** customers (and internal SEs) who were used to “tell a human, get any config” had to land on “the Console is the source of truth, and it cannot do everything ACMS could until we encode it.” If you get that wrong, you either **block a paying customer** or **let them launch a cluster that ops cannot support**.

---

## How Chris fits (practice this)

> …When I joined, provisioning still leaned on a rigid **RJSF** schema-form. I **planned the wizard architecture** and built many of its pages; the Cloud FE team shipped the rest against those patterns — defaults, validation, branching, persistence, review-before-launch — plus a **JSON/YAML editor with conflict detection** for advanced Aerospike options the wizard did not expose yet. **`StepIndicator`** navigability was business-logic-driven: e.g. availability zone / replication layout had to be valid before node sizing or later steps were jumpable; changing AZ count recalculated downstream constraints. We migrated customers off the ACMS request-style console without stopping the live cutover.

**What an EM should hear:** you did not “integrate two dashboards.” You helped **replace a human-operated control plane with a self-serve one**, using a painful schema-form as the stopgap, then a wizard as the product.

---

## Problems → how Chris helped (checklist)

| Company / customer problem | How Chris helped |
|---|---|
| ACMS does not scale as a self-serve motion; SEs/ops are the provisioner | Cloud Console wizard so a customer can configure and launch |
| Console could do far less than a human ACMS operator | Wizard for common paths; JSON/YAML + conflict detection for the rest |
| Schema-driven **RJSF** UI was rigid and hard to evolve | First-class steps with business logic (AZ → node sizing, etc.) instead of one giant generated form |
| Refresh / leaving the page wiped the wizard | Context + `localStorage` persistence; customers later said they could finish anytime |
| Live customers still on ACMS during the cutover | Reconcile the old request/ops console with the new self-serve console so migration did not stall |
| Org settings scattered | Access Manager (roles, API keys, secrets, audit logs) |
| Revenue-critical flow untested | Vitest + Playwright on the provisioning path |

---

## Architecture crumbs (console-relevant)

- Cloud org, cloud users, **cloud API keys** vs **database users** (app credentials) vs **VPC peering**
- Provisioning input maps to docs: AWS region, `availabilityZoneCount`, instance type, cluster size, memory vs local disk, AP vs SC, namespaces
- SC only with hybrid memory (docs)
- Advanced config is JSON/YAML; Cloud enforces constraints RJSF would also have to encode
- Dual-mode editor on the case study is the productization of “power users still need Aerospike knobs the wizard has not grown yet”

---

## Open / not yet confirmed by Chris

- Exact expansion of ACMS internally (docs say Cloud Managed Service; Chris first guessed Cluster Management Service)
- Whether RJSF was **only** advanced config, **only** ACMS-era console, or both — **resolved:** Chris replaced RJSF entirely on the Cloud provisioning path (2026-08-20)
- How many orgs were in the live migration
- GraphQL ownership vs backend — **resolved:** REST only (2026-08-20)
- “Introduced AI workflows” — **removed:** team used LLM tools; Chris did not introduce (2026-08-20)
- “Sole FE on Cloud team” — **corrected 2026-08-20:** Chris architected the wizard and built many pages; other Cloud FEs shipped additional wizard/console work following his patterns. Do not say sole FE or no handoffs.

---

## Links

### Product and editions
- https://aerospike.com/products/aerospike-cloud/
- https://aerospike.com/docs/cloud/overview/
- https://aerospike.com/products/features-and-editions/
- https://aerospike.com/services/managed-services/
- https://aerospike.com/glossary/cloud-database/#cloud_database_management_models
- https://aerospike.com/blog/what-are-cloud-managed-services/ (uses **ACMS** in prose)

### Cloud Console / provisioning (what Chris built against)
- https://console.aerospike.com
- https://aerospike.com/docs/cloud/manage/create
- https://aerospike.com/docs/cloud/manage/advanced-config
- https://aerospike.com/docs/cloud/manage/modify/
- https://aerospike.com/docs/cloud/manage/cloud-members
- https://aerospike.com/docs/cloud/manage-apis/cloud-api-use
- https://aerospike.com/docs/cloud/manage/vpc-peering
- https://aerospike.com/docs/cloud/manage/entitlements
- https://aerospike.com/docs/cloud/reference/limitations/
- https://aerospike.com/docs/cloud/security/shared-responsibility/

### ACMS (legacy operating model)
- https://aerospike.com/files/white-papers/aerospike-cloud-managed-service-whitepaper.pdf
- https://pages.aerospike.com/rs/229-XUE-318/images/Aerospike_Whitepaper__Cloud-Managed-Service.pdf

### Do not confuse
- https://github.com/aerospike-community/amc/wiki — **AMC**, archived monitoring console, not ACMS
