import { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({ startOnLoad: false, theme: "default" });

let mermaidCounter = 0;

// mermaid.render() registers each diagram ID internally and will throw on
// duplicates. React StrictMode double-invokes effects, which causes the same
// ID to be rendered twice. Using a timestamp suffix ensures every render call
// gets a globally unique ID, avoiding the "Diagram id already registered" error.
const Mermaid = ({ chart }) => {
  const containerRef = useRef(null);
  const idRef = useRef(`mermaid-${mermaidCounter++}`);

  useEffect(() => {
    if (!chart || !containerRef.current) return;
    let cancelled = false;
    const renderChart = async () => {
      const uniqueId = `${idRef.current}-${Date.now()}`;
      try {
        const { svg } = await mermaid.render(uniqueId, chart);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (e) {
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = `<pre class="mermaid-error">${e.message}</pre>`;
        }
      }
    };
    renderChart();
    return () => { cancelled = true; };
  }, [chart]);

  return <div ref={containerRef} className="mermaid-container" />;
};

export default Mermaid;
