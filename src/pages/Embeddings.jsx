// Embeddings.jsx
import React from 'react';

// Eğer SVG'lerin arka planını temaya göre değiştirmek istersen,
// her bir SVG'yi bir <div> içine alıp arka plan rengini CSS ile kontrol edebilirsin.
// Ancak bu örnekte varsayılan olarak geldiğini varsayıyorum.

const Embeddings = () => {
  return (
    <>
      {/* Hero Section - same as before, but I'll keep it */}
      <section className="py-32 md:py-36 bg-dark-bg">
        <div className="container mx-auto px-5 flex flex-col md:flex-row items-center gap-12">
          {/* Left: Text Content */}
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-light-text leading-tight">
              <span className="text-primary">Plotune Embeddings</span>
              <br />Domain‑Specialized Vector Representations
            </h1>

            <p className="text-gray-text text-lg leading-relaxed">
              Move beyond generic embeddings. Our models are fine‑tuned on 
              <strong className="text-primary"> automotive domain data</strong> – technical manuals, repair guides, 
              sensor logs, and engineering documents – to deliver precise semantic understanding.
            </p>

            <p className="text-gray-text text-lg leading-relaxed">
              But we didn’t stop there. The same architecture excels in 
              <strong> electronics, control systems, and IoT</strong> domains, making Plotune Embeddings the 
              universal choice for engineering‑focused AI applications.
            </p>

            <div className="pt-4 flex gap-4 flex-wrap">
              <a
                href="#/login"
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-dark hover:-translate-y-1 hover:shadow-lg transition-all duration-300 font-semibold"
              >
                Get API Key
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="#/docs"
                className="inline-flex items-center px-6 py-3 border-2 border-primary text-primary rounded-full hover:bg-primary/10 hover:-translate-y-1 transition-all duration-300 font-semibold"
              >
                API Reference
              </a>
            </div>
          </div>

          {/* Right: Visual Card - API Example (unchanged) */}
          <div className="flex-1 w-full max-w-lg">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
              <div className="flex items-start mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2 mt-1"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2 mt-1"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 mr-4 mt-1"></div>
                <h3 className="text-light-text font-semibold text-xl">One API Call</h3>
              </div>
              
              <div className="bg-dark-card rounded-xl p-4 font-mono text-sm text-gray-text overflow-x-auto">
                <pre className="whitespace-pre-wrap">
{`curl -X POST https://api.plotune.net/v1/embeddings \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "plotune-embed-small-v1",
    "input": "Engine misfire code P0302"
  }''`}
                </pre>
              </div>
              
              <div className="mt-4 text-gray-text text-sm">
                Returns a 384‑dimensional vector ready for semantic search, clustering, or classification.
              </div>
              
              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="flex justify-between items-center text-xs text-gray-text">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Latency &lt; 50ms</span>
                  </div>
                  <div className="text-light-text/40 font-mono">
                    v2.0
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION: Why Automotive Needs Specialized Embeddings */}
      <section className="py-24 bg-dark-surface backdrop-blur-xl">
        <div className="container mx-auto px-5">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-light-text mb-4">
              Why Domain‑Specific Embeddings for Automotive?
            </h2>
            <p className="text-gray-text text-lg">
              The automotive industry speaks its own language. Generic models fail to capture the nuance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-dark-card rounded-xl p-8 border border-white/5 hover:border-primary/30 transition-all">
              <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-5">
                <i className="fas fa-wrench text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-light-text mb-3">Technical Terminology</h3>
              <p className="text-gray-text">
                From "O2 sensor" to "knock detection", our model understands the precise meaning of hundreds of thousands of automotive terms, acronyms, and diagnostic codes.
              </p>
            </div>

            <div className="bg-dark-card rounded-xl p-8 border border-white/5 hover:border-primary/30 transition-all">
              <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center mb-5">
                <i className="fas fa-car-crash text-blue-500 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-light-text mb-3">Context Matters</h3>
              <p className="text-gray-text">
                "Brake pad wear" means something very different in a service manual vs. a sensor log. Our embeddings capture the context, enabling accurate retrieval and reasoning.
              </p>
            </div>

            <div className="bg-dark-card rounded-xl p-8 border border-white/5 hover:border-primary/30 transition-all">
              <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mb-5">
                <i className="fas fa-microchip text-green-500 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-light-text mb-3">Cross‑Domain Strength</h3>
              <p className="text-gray-text">
                Trained on a mix of automotive, electronics, and systems data, our embeddings excel at connecting concepts across domains – perfect for modern software‑defined vehicles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use (unchanged but I'll keep it) */}
      <section className="py-24 bg-dark-bg">
        <div className="container mx-auto px-5">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-gray-text max-w-2xl mx-auto text-lg">
                Get started in minutes with our REST API. No complex setup – just send text, receive vectors.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-start mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2 mt-1"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2 mt-1"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 mr-4 mt-1"></div>
                <h3 className="text-light-text font-semibold text-xl">API Example (Node.js)</h3>
              </div>
              
              <div className="bg-dark-card rounded-xl p-4 font-mono text-sm text-gray-text overflow-x-auto">
                <pre className="whitespace-pre-wrap">
{`const response = await axios.post(
  "https://api.plotune.net/v1/embeddings",
  {
    model: "plotune-embed-small-v1",
    input: "Oxygen sensor voltage slow to respond"
  },
  {
    headers: {
      Authorization: 'Bearer YOUR_API_KEY',
      "Content-Type": "application/json"
    }
  }
);

console.log(response.data.data[0].embedding); // [0.023, -0.145, ..., 0.876]`}
                </pre>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-dark-card rounded-lg">
                  <div className="text-primary font-bold text-lg">384</div>
                  <div className="text-gray-text text-xs">Dimensions</div>
                </div>
                <div className="p-3 bg-dark-card rounded-lg">
                  <div className="text-primary font-bold text-lg">50ms</div>
                  <div className="text-gray-text text-xs">Avg. latency</div>
                </div>
                <div className="p-3 bg-dark-card rounded-lg">
                  <div className="text-primary font-bold text-lg">99.9%</div>
                  <div className="text-gray-text text-xs">Uptime SLA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* NEW SECTION: What You Can Build */}
      <section className="py-24 bg-dark-bg">
        <div className="container mx-auto px-5">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-light-text mb-4">
              What Can You Build with Plotune Embeddings?
            </h2>
            <p className="text-gray-text text-lg">
              Unlock a new generation of automotive AI applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 flex flex-col">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-search text-primary text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-light-text mb-2">Semantic Search in Technical Docs</h3>
                  <p className="text-gray-text">
                    Instantly find the right repair procedure, part number, or diagnostic step from thousands of manuals using natural language queries. No more keyword guessing.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 flex flex-col">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-robot text-blue-500 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-light-text mb-2">RAG for Customer Support</h3>
                  <p className="text-gray-text">
                    Build a chatbot that answers complex technical questions by retrieving the most relevant passages from your knowledge base – with context awareness.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 flex flex-col">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-chart-line text-green-500 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-light-text mb-2">Clustering & Anomaly Detection</h3>
                  <p className="text-gray-text">
                    Group similar diagnostic trouble codes (DTCs) or service reports to identify patterns and outliers in vehicle data.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 flex flex-col">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-code-branch text-purple-500 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-light-text mb-2">Classification & Routing</h3>
                  <p className="text-gray-text">
                    Automatically categorize support tickets, warranty claims, or engineering change requests based on semantic content.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Plotune Embeddings? (Values Grid) - unchanged */}
      <section className="py-24 bg-dark-surface backdrop-blur-xl">
        <div className="container mx-auto px-5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-light-text mb-4">
                Why Plotune Embeddings?
              </h2>
              <p className="text-gray-text max-w-2xl mx-auto text-lg">
                Purpose‑built for engineering domains, yet flexible enough for any technical text.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-dark-card rounded-xl p-6 border border-white/5 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-car text-primary text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-light-text mb-3">Automotive‑Trained</h3>
                <p className="text-gray-text text-sm">
                  Fine‑tuned on automotive documents: repair manuals, TSBs, part catalogs, and diagnostic data.
                </p>
              </div>

              <div className="bg-dark-card rounded-xl p-6 border border-white/5 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-microchip text-blue-500 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-light-text mb-3">Electronics & Systems</h3>
                <p className="text-gray-text text-sm">
                  Excels in PCB design, embedded systems, and control logic – cross‑domain strength out of the box.
                </p>
              </div>

              <div className="bg-dark-card rounded-xl p-6 border border-white/5 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-plug text-green-500 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-light-text mb-3">Easy Integration</h3>
                <p className="text-gray-text text-sm">
                  Simple REST API with SDKs for Python, Node.js, and Go. Use with any vector database or ML pipeline.
                </p>
              </div>

              <div className="bg-dark-card rounded-xl p-6 border border-white/5 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-shield-alt text-purple-500 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-light-text mb-3">Enterprise Ready</h3>
                <p className="text-gray-text text-sm">
                  SOC2 compliant, dedicated support, and customizable fine‑tuning for your proprietary data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Performance Visuals Section - REDESIGNED to be more balanced */}
      <section className="py-24 bg-dark-surface backdrop-blur-xl">
        <div className="container mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-light-text mb-4">
              See the Difference: General vs. Specialized
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">

            {/* UMAP Triplets */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 lg:col-span-2">
              <h3 className="text-lg font-semibold text-light-text mb-2">Embedding Space</h3>
              <div className="aspect-video bg-dark-card rounded-lg flex items-center justify-center">
                <img src="/plots/umap_triplets.svg" alt="UMAP projection" className="max-h-full max-w-full object-contain" />
              </div>
            </div>

            {/* Similarity Histograms - full width but smaller */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 lg:col-span-2">
              <h3 className="text-lg font-semibold text-light-text mb-2">Semantic Separation</h3>
              <div className="aspect-[2/1] bg-dark-card rounded-lg flex items-center justify-center p-4">
                <div className="relative overflow-hidden rounded-lg">
                <img
                    src="/plots/similarity_histograms.svg"
                    alt="Similarity histograms"
                    className="block w-full"
                    style={{ marginTop: "-60px" }}
                />
                </div>
              </div>
              <p className="text-gray-text text-xs mt-2">
                After specialization, anchor–positive similarity increases while anchor–negative decreases.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Integration Guide */}
      <section className="py-24 bg-dark-bg">
        <div className="container mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            <div className="bg-dark-card rounded-xl p-6 border border-white/5 text-center">
              <div className="text-2xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold text-light-text mb-2">Qdrant</h3>
              <p className="text-gray-text text-sm">Recommended for metadata filtering and hybrid search</p>
            </div>
            <div className="bg-dark-card rounded-xl p-6 border border-white/5 text-center">
              <div className="text-2xl mb-3">🔍</div>
              <h3 className="text-lg font-semibold text-light-text mb-2">Pinecone</h3>
              <p className="text-gray-text text-sm">Managed service with built-in hybrid search</p>
            </div>
            <div className="bg-dark-card rounded-xl p-6 border border-white/5 text-center">
              <div className="text-2xl mb-3">🗄️</div>
              <h3 className="text-lg font-semibold text-light-text mb-2">pgvector</h3>
              <p className="text-gray-text text-sm">PostgreSQL extension for existing relational data</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Embeddings;