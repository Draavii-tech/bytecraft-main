import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Post from '../models/Post.js';
import { connectDB } from '../config/db.js';

export const seedDatabase = async () => {
  try {
    console.log('--- Starting Database Seeder ---');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Post.deleteMany({});
    console.log('Cleared existing Users, Categories, and Posts.');

    // 1. Seed Users (Admin & Authors)
    const adminPasswordHash = await User.hashPassword('Admin@123456');
    const authorPasswordHash = await User.hashPassword('Author@123456');

    const adminUser = await User.create({
      name: 'Ashwini RV',
      email: 'admin@bytecraft.io',
      passwordHash: adminPasswordHash,
      role: 'admin',
      bio: 'Founder & Chief Technology Editor at ByteCraft | Principal Distributed Systems Architect. Specializes in scalable cloud architectures, autonomous AI pipelines, and engineering excellence.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    });

    const authorUser = await User.create({
      name: 'Marcus Thorne',
      email: 'marcus@bytecraft.io',
      passwordHash: authorPasswordHash,
      role: 'author',
      bio: 'Staff AI Researcher and Cloud Infrastructure Consultant. Specializes in autonomous multi-agent pipelines, Kubernetes cost optimization, and post-quantum cryptosystems.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    });

    console.log(`Created Admin (${adminUser.email}) and Author (${authorUser.email})`);

    // 2. Seed 7 Initial Categories
    const categoriesData = [
      {
        name: 'Software Development',
        slug: 'software-development',
        description: 'Deep dives into system design, backend architectures, language runtimes, and engineering best practices.',
      },
      {
        name: 'Artificial Intelligence & Machine Learning',
        slug: 'artificial-intelligence-machine-learning',
        description: 'Explorations in LLM reasoning, neural inference, multi-agent frameworks, and generative AI systems.',
      },
      {
        name: 'Web and Mobile App Development',
        slug: 'web-and-mobile-app-development',
        description: 'Modern front-end frameworks, mobile SDKs, cross-platform performance, and reactive state management.',
      },
      {
        name: 'Technology & Innovation',
        slug: 'technology-and-innovation',
        description: 'Emerging paradigms, quantum computing breakthroughs, edge intelligence, and disruptive tech frontiers.',
      },
      {
        name: 'Cybersecurity',
        slug: 'cybersecurity',
        description: 'Zero Trust architecture, threat modeling, offensive security, and modern cryptographic defenses.',
      },
      {
        name: 'Cloud Computing',
        slug: 'cloud-computing',
        description: 'Serverless orchestration, Kubernetes cluster optimization, cloud FinOps, and multi-region resilience.',
      },
      {
        name: 'Industry Insights',
        slug: 'industry-insights',
        description: 'Platform engineering, developer productivity, tech leadership philosophies, and ecosystem market trends.',
      },
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`Seeded ${createdCategories.length} categories.`);

    const catMap = {};
    createdCategories.forEach((c) => {
      catMap[c.slug] = c._id;
    });

    // 3. Seed Realistic Technology Blog Posts (With Strong Focus on AI)
    const postsData = [
      {
        title: 'Architecting Resilient Distributed Systems: Beyond Eventual Consistency and Retry Storms',
        slug: 'architecting-resilient-distributed-systems',
        excerpt: 'Explore battle-tested architectural patterns including circuit breakers, exponential backoff with jitter, distributed sagas, and idempotent message deduplication in high-throughput microservices.',
        category: catMap['software-development'],
        author: adminUser._id,
        isFeatured: true,
        status: 'published',
        publishAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        views: 3420,
        tags: ['Distributed Systems', 'Architecture', 'Microservices', 'Resilience', 'Go'],
        coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
        seoTitle: 'Resilient Distributed Systems Architecture Guide | ByteCraft',
        metaDescription: 'Discover how to prevent cascading failures and retry storms using circuit breakers, distributed sagas, and idempotent message delivery.',
        content: `
<h2>The Unforgiving Nature of Scale</h2>
<p>When engineering distributed microservices handling tens of thousands of requests per second, failure is not an anomaly—it is a continuous statistical certainty. Network blips, noisy neighbors, and cold database caches conspire to degrade latencies into full-blown outage events.</p>

<p>Most outages that make headlines are not caused by the primary point of failure itself, but by <strong>cascading failure modes</strong>: retry storms, thread starvation, and thundering herd conditions where downstream services become overwhelmed trying to recover.</p>

<blockquote>"Resilience is not the absence of failures; it is the architectural capacity to gracefully degrade without total system collapse."</blockquote>

<h2>The Anatomy of a Catastrophic Retry Storm</h2>
<p>Consider an authentication service that slows down due to an unexpected spike in database locks. When an API gateway experiences a timeout, naive clients immediately re-send identical requests. What was a momentary 15% latency degradation quickly becomes a 300% traffic flood.</p>

<h3>Exponential Backoff with Full Jitter</h3>
<p>Standard exponential backoff spaces retry intervals, but if dozens of instances fail simultaneously, they synchronize their retry waves. Adding randomized jitter disperses the traffic across temporal intervals.</p>

<pre><code class="language-go">// Calculate backoff with full randomized jitter in Go
func CalculateBackoff(attempt int, baseDelay, maxDelay time.Duration) time.Duration {
    multiplier := math.Pow(2, float64(attempt))
    temp := float64(baseDelay) * multiplier
    if temp > float64(maxDelay) {
        temp = float64(maxDelay)
    }
    // Full jitter selects randomly between 0 and calculated ceiling
    return time.Duration(rand.Float64() * temp)
}</code></pre>

<h2>Pattern Comparison: Isolation Strategies</h2>
<table>
  <thead>
    <tr>
      <th>Pattern</th>
      <th>Primary Mitigation</th>
      <th>Failure Detection Mechanism</th>
      <th>Recovery Behavior</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Circuit Breaker</strong></td>
      <td>Stops cascading calls to failing downstreams</td>
      <td>Rolling error percentage & timeout threshold</td>
      <td>Half-open trial requests with auto-closure</td>
    </tr>
    <tr>
      <td><strong>Bulkhead</strong></td>
      <td>Isolates thread pools and connection sockets</td>
      <td>Queue saturation and semaphore exhaustion</td>
      <td>Immediate rejection (HTTP 429 / 503)</td>
    </tr>
    <tr>
      <td><strong>Dead Letter Queue</strong></td>
      <td>Preserves poison pill messages for analysis</td>
      <td>Max retry exhaustion counter</td>
      <td>Manual or automated replay off-peak</td>
    </tr>
  </tbody>
</table>
        `,
      },
      {
        title: 'Autonomous Multi-Agent Orchestration: Evaluating Tool Use, Reflection, and Memory in Production',
        slug: 'autonomous-multi-agent-orchestration-tool-use-memory',
        excerpt: 'A comprehensive engineering breakdown of deploying production-grade LLM agents using directed acyclic graphs, persistent vector memories, and self-correcting reflection loops.',
        category: catMap['artificial-intelligence-machine-learning'],
        author: authorUser._id,
        isFeatured: true,
        status: 'published',
        publishAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        views: 5210,
        tags: ['AI', 'LLM', 'Multi-Agent', 'Python', 'LangGraph', 'Vector DB'],
        coverImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
        seoTitle: 'Autonomous Multi-Agent Orchestration: Architecture & Practice | ByteCraft',
        metaDescription: 'Learn how to build resilient LLM multi-agent systems with tool sandboxing, state machine coordinators, and deterministic verification.',
        content: `
<h2>The Shift from Simple Prompts to Autonomous Systems</h2>
<p>Prompt engineering alone cannot solve enterprise workflows requiring multi-step verification, database mutations, and external API execution. Modern AI systems have transitioned to <strong>agentic loops</strong>, where models act as reasoning engines orchestrating specialized tools.</p>

<p>However, running agents in real-world environments introduces nondeterminism, hallucinated parameters, and infinite tool loops. Addressing these failure modes requires rigid state graphs rather than free-form conversational threads.</p>

<h2>Architectural Pillars of Agentic Frameworks</h2>
<ul>
  <li><strong>Graph-based Execution:</strong> Treating agent steps as transitions across a stateful Directed Acyclic Graph (DAG) with explicit checkpointing.</li>
  <li><strong>Sandboxed Tool Invocation:</strong> Isolating bash commands, database queries, and web browsers within ephemeral containerized environments.</li>
  <li><strong>Reflective Self-Correction:</strong> A secondary verifier model inspecting generated code or answers before delivering payloads to users.</li>
  <li><strong>Hierarchical Memory:</strong> Ephemeral scratchpad context combined with semantic vector retrieval for historical context.</li>
</ul>

<h3>Implementing a Guarded Execution Loop</h3>
<pre><code class="language-python"># Example of structured tool execution with parameter validation
from pydantic import BaseModel, Field

class DatabaseQueryPlan(BaseModel):
    sql_query: str = Field(..., description="Sanitized read-only SQL statement")
    read_only: bool = Field(True, description="Strictly assert read-only queries")
    max_rows: int = Field(50, description="Hard cap on rows returned")

async def execute_agent_step(state: dict) -> dict:
    decision = await coordinator_llm.with_structured_output(DatabaseQueryPlan).ainvoke(state["task"])
    if not decision.read_only or "DROP" in decision.sql_query.upper():
        raise SecurityException("Unsafe query rejected by policy engine")
    result = await db_sandbox.query(decision.sql_query, limit=decision.max_rows)
    return {"query_result": result}
</code></pre>
        `,
      },
      {
        title: 'Production RAG Architectures: Hybrid Dense-Sparse Retrieval, HyDE, and Cross-Encoder Re-Ranking',
        slug: 'retrieval-augmented-generation-rag-production-guide',
        excerpt: 'A deep dive into moving beyond naive cosine similarity vector search. Learn how to combine BM25 sparse keyword scoring, dense embeddings, hypothetical document embeddings (HyDE), and cross-encoder re-ranking to achieve 95%+ precision.',
        category: catMap['artificial-intelligence-machine-learning'],
        author: authorUser._id,
        isFeatured: true,
        status: 'published',
        publishAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        views: 6420,
        tags: ['AI', 'RAG', 'Vector Search', 'Embeddings', 'Python', 'Search'],
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        seoTitle: 'Production RAG Architecture: Dense-Sparse & Re-ranking | ByteCraft',
        metaDescription: 'Learn how to build enterprise retrieval-augmented generation pipelines using hybrid dense-sparse scoring and cross-encoder re-ranking.',
        content: `
<h2>The Limits of Naive Vector Search</h2>
<p>Naive Retrieval-Augmented Generation (RAG) typically chunks text into 500-token windows, converts them into high-dimensional vector embeddings, and executes top-k cosine similarity queries. In production, this approach fails on three critical fronts:</p>
<ol>
  <li><strong>Exact Keyword Precision:</strong> Dense vectors fail to distinguish specific part numbers, API function names, or acronyms like "CVE-2024-3094".</li>
  <li><strong>Loss of Document Context:</strong> Chunking text splits sentences across boundaries, blinding the embedding model to paragraph context.</li>
  <li><strong>Embedding Distance Asymmetry:</strong> A user question and an informative factual answer often inhabit different semantic regions of embedding space.</li>
</ol>

<h2>Hybrid Retrieval: Combining BM25 with Dense Vectors</h2>
<p>Modern production retrieval fuses traditional inverted-index BM25 scoring with dense vector search using Reciprocal Rank Fusion (RRF):</p>

<pre><code class="language-python"># Reciprocal Rank Fusion (RRF) algorithm for combining lexical and semantic results
def reciprocal_rank_fusion(bm25_ranks: list, dense_ranks: list, k: int = 60) -> list:
    scores = {}
    for rank, doc_id in enumerate(bm25_ranks):
        scores[doc_id] = scores.get(doc_id, 0.0) + 1.0 / (k + rank + 1)
    for rank, doc_id in enumerate(dense_ranks):
        scores[doc_id] = scores.get(doc_id, 0.0) + 1.0 / (k + rank + 1)
    
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)
</code></pre>

<h2>Two-Stage Retrieval Pipeline</h2>
<table>
  <thead>
    <tr>
      <th>Stage</th>
      <th>Technique</th>
      <th>Latency</th>
      <th>Recall / Precision</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>1. Coarse Retrieval</strong></td>
      <td>Hybrid BM25 + Dense ANN (HNSW)</td>
      <td>10–25 ms</td>
      <td>High Recall (~95%), Low Precision</td>
    </tr>
    <tr>
      <td><strong>2. Re-Ranking</strong></td>
      <td>Cross-Encoder (e.g., BGE-Reranker-Large)</td>
      <td>60–90 ms</td>
      <td>Very High Precision (~98%)</td>
    </tr>
  </tbody>
</table>

<blockquote>"Never feed raw top-k vector distances directly into the generative model context. Always pass them through a cross-encoder re-ranker."</blockquote>
        `,
      },
      {
        title: 'Transformers vs. State Space Models: Demystifying Mamba, Linear Attention, and Sub-Quadratic Scaling',
        slug: 'transformers-vs-state-space-models-mamba',
        excerpt: 'Why O(N^2) self-attention becomes a computational barrier at 128k+ token contexts, and how selective state-space architectures like Mamba achieve linear inference throughput with constant-memory recurrence.',
        category: catMap['artificial-intelligence-machine-learning'],
        author: authorUser._id,
        isFeatured: true,
        status: 'published',
        publishAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        views: 4890,
        tags: ['AI', 'Transformers', 'Mamba', 'Deep Learning', 'Neural Networks', 'Math'],
        coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        seoTitle: 'Transformers vs State Space Models: Mamba Explained | ByteCraft',
        metaDescription: 'Understand the mathematical foundations of Mamba and State Space Models versus standard Transformer multi-head attention.',
        content: `
<h2>The Quadratic Bottleneck of Multi-Head Attention</h2>
<p>The standard Transformer architecture relies on scaled dot-product self-attention:</p>
<pre><code class="language-text">Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V</code></pre>
<p>Because every token computes an inner product against every other token in the sequence, memory and computational complexity scale as <code>O(N^2)</code> with sequence length <code>N</code>. At 1M token contexts, this requires exorbitant KV cache memory and massive GPU clusters.</p>

<h2>Selective State Space Models (Mamba)</h2>
<p>State Space Models (SSMs) map a continuous 1D input signal to an output sequence through a hidden state, formulated via differential equations discretized over time:</p>

<pre><code class="language-python"># High-level conceptual recurrent step in selective SSM
class SelectiveSSMCell:
    def __init__(self, d_model, d_state):
        self.A = initialize_hippo_matrix(d_model, d_state)
        self.B_proj = Linear(d_model, d_state) # Input-dependent B
        self.C_proj = Linear(d_model, d_state) # Input-dependent C
        self.delta_proj = Linear(d_model, d_model)

    def forward_step(self, x_t, h_prev):
        # Input-dependent discretization allows selective information filtering
        delta = softplus(self.delta_proj(x_t))
        A_bar = torch.exp(delta * self.A)
        B_bar = delta * self.B_proj(x_t)
        
        h_t = A_bar * h_prev + B_bar * x_t
        y_t = self.C_proj(x_t) @ h_t
        return y_t, h_t
</code></pre>

<h2>Architecture Comparison</h2>
<table>
  <thead>
    <tr>
      <th>Dimension</th>
      <th>Standard Transformer</th>
      <th>Selective SSM (Mamba)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Training Complexity</strong></td>
      <td>O(N) parallel via associative scan</td>
      <td>O(N) parallel via hardware-aware scan</td>
    </tr>
    <tr>
      <td><strong>Inference Complexity</strong></td>
      <td>O(N) per step (due to KV cache)</td>
      <td>O(1) constant per step (recurrent state)</td>
    </tr>
    <tr>
      <td><strong>Inference Memory</strong></td>
      <td>Grows linearly with token history</td>
      <td>Constant fixed-size state memory</td>
    </tr>
    <tr>
      <td><strong>Associative Copying</strong></td>
      <td>Flawless recall</td>
      <td>Competitive with selective parameters</td>
    </tr>
  </tbody>
</table>
        `,
      },
      {
        title: 'Running Small Language Models (SLMs) on the Edge: AWQ, GGUF 4-Bit Quantization, and Local Inference',
        slug: 'small-language-models-slm-quantization-edge',
        excerpt: 'How 3B to 7B parameter models like Phi-3 and Mistral are matching previous generation 70B models on technical tasks when optimized with Activation-aware Weight Quantization (AWQ) and speculative decoding.',
        category: catMap['artificial-intelligence-machine-learning'],
        author: authorUser._id,
        isFeatured: false,
        status: 'published',
        publishAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        views: 3950,
        tags: ['AI', 'Edge AI', 'Quantization', 'SLM', 'Local LLM', 'LlamaCPP'],
        coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        seoTitle: 'Edge AI: Small Language Models & 4-Bit Quantization | ByteCraft',
        metaDescription: 'Learn how to run 3B-7B parameter language models locally on consumer devices using AWQ and GGUF quantization.',
        content: `
<h2>The Democratization of Edge AI</h2>
<p>For years, running state-of-the-art models required 8x A100 GPU clusters in enterprise datacenters. Today, <strong>Small Language Models (SLMs)</strong> in the 3B–8B parameter range are performing within 90% accuracy of massive models on coding, summarization, and function calling tasks.</p>

<p>When combined with modern 4-bit integer quantization (INT4), these models can run entirely inside the unified memory of Apple Silicon M-series chips or high-end mobile devices at over 40 tokens per second.</p>

<h3>Understanding Activation-aware Weight Quantization (AWQ)</h3>
<p>Traditional round-to-nearest quantization degrades model reasoning because not all weights are equally important. AWQ protects the top 1% of salient weights that correspond to large activation magnitudes:</p>

<pre><code class="language-bash"># Running local quantized model via llama.cpp server
$ llama-server \
    -m ./models/mistral-7b-instruct-v0.3.Q4_K_M.gguf \
    --port 8080 \
    --ctx-size 8192 \
    --n-gpu-layers 33 \
    --threads 8
</code></pre>
        `,
      },
      {
        title: 'Modern Front-End State in 2026: Signals, Fine-Grained Reactivity, and Server Components',
        slug: 'modern-frontend-state-signals-reactivity',
        excerpt: 'How modern UI frameworks are moving away from coarse-grained virtual DOM diffing toward compile-time reactivity, signals, and selective server-side streaming.',
        category: catMap['web-and-mobile-app-development'],
        author: adminUser._id,
        isFeatured: false,
        status: 'published',
        publishAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        views: 2190,
        tags: ['React', 'TypeScript', 'Signals', 'Front-End', 'Performance'],
        coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
        seoTitle: 'Modern Front-End State: Signals and Reactivity | ByteCraft',
        metaDescription: 'Explore the evolution of front-end reactivity: why signals and compiler-driven state models are outperforming traditional virtual DOM reconciliation.',
        content: `
<h2>The Evolution of UI Reconciliation</h2>
<p>For more than a decade, front-end architecture revolved around the Virtual DOM (VDOM). When state changed, components re-rendered a tree of in-memory objects, diffed them against the previous tree, and patched the actual DOM nodes.</p>

<p>While this abstraction simplified mental models, it placed heavy computational overhead on low-powered mobile devices, especially when managing deeply nested forms or real-time dashboards.</p>

<h2>The Rise of Fine-Grained Reactivity</h2>
<p>Signals introduce fine-grained tracking by binding reactive values directly to the DOM nodes that consume them. When a signal updates, only the precise text node or attribute modifies—bypassing component re-execution entirely.</p>
        `,
      },
      {
        title: 'Zero Trust Architecture in Practice: Modern Identity Boundaries, mTLS, and Ephemeral Credentials',
        slug: 'zero-trust-architecture-in-practice-mtls-identity',
        excerpt: 'Move beyond perimeter-based network defenses. Implement cryptographic workload identity, mutual TLS, and dynamic Short-Lived Tokens across multi-cloud infrastructure.',
        category: catMap['cybersecurity'],
        author: authorUser._id,
        isFeatured: false,
        status: 'published',
        publishAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        views: 4120,
        tags: ['Security', 'Zero Trust', 'mTLS', 'SPIFFE', 'DevSecOps'],
        coverImage: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80',
        seoTitle: 'Zero Trust Architecture in Practice | ByteCraft Security',
        metaDescription: 'Deep dive into zero trust implementations using SPIFFE/SPIRE, automated mTLS rotation, and short-lived credential brokering.',
        content: `
<h2>The Death of the Traditional Corporate Perimeter</h2>
<p>The traditional castle-and-moat security posture assumed that any traffic inside the internal corporate network was inherently trustworthy. Cloud-native architectures, remote workforces, and third-party SaaS integrations have obliterated this perimeter model.</p>

<p>Zero Trust operates under a straightforward, immutable principle: <strong>Never trust, always verify</strong>. Every single inter-service RPC must be authenticated, authorized, and cryptographically verified regardless of its network location.</p>
        `,
      },
      {
        title: 'Kubernetes Resource Efficiency: Rightsizing CPU Throttling, FinOps, and Spot Orchestration at Scale',
        slug: 'kubernetes-resource-efficiency-cpu-throttling-finops',
        excerpt: 'Stop burning cloud budgets on over-provisioned nodes. Learn how Linux CFS quotas cause unexpected tail latency, how to configure Vertical Pod Autoscaling, and save 40% on compute.',
        category: catMap['cloud-computing'],
        author: authorUser._id,
        isFeatured: false,
        status: 'published',
        publishAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        views: 2980,
        tags: ['Kubernetes', 'Cloud', 'FinOps', 'DevOps', 'Infrastructure'],
        coverImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
        seoTitle: 'Kubernetes Resource Efficiency & FinOps Guide | ByteCraft',
        metaDescription: 'Eliminate CPU throttling and optimize Kubernetes clusters for maximum resource utilization and cloud cost reduction.',
        content: `
<h2>The Mystery of the Throttled Microservice</h2>
<p>Many engineering teams observe strange P99 latency spikes on Node.js and Go microservices despite metrics showing CPU utilization below 40%. The culprit is almost always the Linux Completely Fair Scheduler (CFS) quota enforcement.</p>

<p>When you set <code>resources.limits.cpu</code> in a Kubernetes manifest, the Linux kernel enforces a hard quota within 100ms periods. If a multi-threaded process exhausts its quota in the first 25ms, it is forcibly paused for the remaining 75ms.</p>
        `,
      },
      {
        title: 'Post-Quantum Cryptography Migration: Preparing Production Systems for NIST Standardized Ciphers',
        slug: 'post-quantum-cryptography-migration-nist-standards',
        excerpt: 'With NIST standardizing ML-KEM and ML-DSA, forward-thinking engineering organizations must begin migrating TLS endpoints, token signers, and data-at-rest encryption against harvest-now-decrypt-later attacks.',
        category: catMap['technology-and-innovation'],
        author: adminUser._id,
        isFeatured: false,
        status: 'published',
        publishAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        views: 1840,
        tags: ['Quantum', 'Cryptography', 'NIST', 'Cybersecurity', 'Future Tech'],
        coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
        seoTitle: 'Post-Quantum Cryptography Migration Guide | ByteCraft',
        metaDescription: 'A practical guide for software architects migrating to NIST post-quantum cryptographic standards like ML-KEM and ML-DSA.',
        content: `
<h2>The Quantum Threat: "Harvest Now, Decrypt Later"</h2>
<p>While cryptographically relevant quantum computers capable of breaking RSA-2048 and Elliptic Curve Cryptography (ECC) are still on the horizon, state-sponsored adversaries are actively storing encrypted ciphertext today with the intention of retroactively deciphering it in the future.</p>
        `,
      },
      {
        title: 'The Great Platform Engineering Shift: Replacing Internal Ticket Queues with Developer Portals',
        slug: 'platform-engineering-shift-internal-developer-portals',
        excerpt: 'Why high-performing technology organizations are replacing ticketing bottlenecks with self-service Internal Developer Platforms (IDPs), reducing lead time from weeks to minutes.',
        category: catMap['industry-insights'],
        author: adminUser._id,
        isFeatured: false,
        status: 'published',
        publishAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        views: 3870,
        tags: ['Platform Engineering', 'DevOps', 'Productivity', 'Culture', 'Leadership'],
        coverImage: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=1200&q=80',
        seoTitle: 'The Platform Engineering Shift: Self-Service Portals | ByteCraft',
        metaDescription: 'Discover why modern tech companies treat developer platforms as products to empower autonomous engineering teams.',
        content: `
<h2>The Illusion of DevOps Autonomy</h2>
<p>When the DevOps movement first gained traction, the goal was simple: empower product teams to build, test, deploy, and monitor their own software. In practice, however, cognitive overload crippled developer velocity.</p>
        `,
      },
    ];

    const createdPosts = await Post.insertMany(postsData);
    console.log(`Successfully seeded ${createdPosts.length} realistic technology blog posts!`);
    console.log('--- Database Seeding Complete ---');
  } catch (error) {
    console.error('Error during database seeding:', error);
    throw error;
  }
};

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  (async () => {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  })();
}
