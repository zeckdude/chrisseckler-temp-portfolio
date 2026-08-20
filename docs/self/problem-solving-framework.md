# Chris — Problem-Solving Framework

> How Chris scopes, plans, and executes — with enough detail to explain out loud, not just a bullet list to stare at.

---

## The Core Principle: Scale Your Process to the Problem Size

Chris doesn't run the same process for a one-line bug fix as he does for a new architectural feature. **The size of the problem dictates how much process it gets.** This is the frame he opens with when someone asks how he approaches a problem.

---

## Small Problems: Bug Fixes, Copy Changes, Minor Tweaks

**Quick lay of the land.** Check the existing code in that area, understand what's already there, implement the fix. No document, no multi-day review cycle. The judgment call is recognizing that a problem doesn't touch architecture or the database — so it doesn't need the heavier process below.

---

## Big Problems: New Features, Architecture Changes, Performance Work

### Phase 0: Get Engineering In the Room Early

Chris's ideal workflow: when product and design are ahead of engineering, they pull a senior developer (him) in **while the spec is still being written**, not after. This lets him give technical feedback and realistic expectations before the team gets emotionally invested in a timeline that might not be achievable. This is the single biggest lever for avoiding painful conversations later.

### Phase 1: Write the RFD (1–2 Days)

Once the spec exists, a senior (or sometimes mid-level, with Chris supporting) writes a templated design document. The template forces the author through, in order:

1. **The problem** — what are we actually solving?
2. **Who it's for** — which users, which use case?
3. **Business considerations** — why this, why now?
4. **Technical requirements** — what's actually required to build it?
5. **Existing architecture it touches** — what's already there that this has to work with?
6. **Database changes needed** — schema or query impact?
7. **Bottlenecks** — performance risks or anything that could slow things down?
8. **Timeline feasibility** — given everything above, is the original deadline actually realistic?

**The point of the template:** the same structure every time, so anyone reading or writing it can move through it step by step without reinventing the format. The heavy thinking happens here — not during coding.

### Phase 2: Multi-Disciplinary Review (A Few Days)

The draft goes to front-end, back-end, QA, product, and design. This isn't a one-time sign-off — it's a real back-and-forth conversation over a few days where people raise concerns and the doc gets iterated on. By the end, everyone agrees on approach and timeline. Nobody is surprised later.

### Phase 3: Implementation-Ready Handoff

By the time the RFD is done, whoever implements it (which might not be the person who wrote it) should have **very little heavy thinking left to do**. They're executing a plan that's already been stress-tested by the team — not improvising architecture mid-sprint.

---

## When Something Unexpected Comes Up

### During Planning: Surface It Immediately

If Chris realizes mid-RFD that something won't work as scoped, it's usually a Slack message to the PM — or a small group message if it affects more people. He tells them plainly:

> "I'd love to do this, but here's why it's not realistic as scoped. We could still attempt it, but here's the risk — or we could break it up into what's essential now and the rest later."

It's a conversation, not a confrontation.

### The Prioritization Move That Almost Always Works

Nine times out of ten, once Chris lays out the tradeoff, the team realizes that the piece they actually need is smaller than what they originally asked for — and the rest is nice-to-have. His job in that moment is to help them identify what's essential and build a timeline that spreads the nice-to-haves across future sprints.

**He's not saying no. He's saying: "Here's what's realistic, here's what matters most, let's sequence it together."**

### During Implementation: Same Principle, Different Trigger

If the surprise shows up after planning, mid-build, and Chris wasn't the one who wrote the RFD — he goes back to whoever did, since they've already done the research. Either way, it's the same move: a clear, honest, early conversation with the PM and/or designer about what he's seeing and how it affects the plan, so the team can adjust together instead of Chris quietly absorbing the risk alone.

---

## The 30-Second Version

> "I scale my approach to the size of the problem. Small bug fixes just need a quick look at the existing code. For bigger features, I want engineering in the room early with product and design, and then we write a templated RFD that covers the problem, the users, the business case, the technical approach, architecture impact, database changes, and timeline feasibility. That doc goes through a few days of review with front-end, back-end, QA, product, and design — so the heavy thinking happens upfront and implementation is mostly execution. And if something unexpected comes up at any point, I surface it early and honestly so we can reprioritize together instead of me quietly trying to make an unrealistic timeline work."
