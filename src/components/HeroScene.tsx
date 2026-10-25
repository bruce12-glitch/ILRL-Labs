import { useEffect, useRef, useState } from "react";
import type { WebGLRenderer } from "three";
import type { SVGRenderer } from "three/addons/renderers/SVGRenderer.js";

/** A mathematical loop as a movable object, separate from the research claims. */
export function HeroScene({ motion }: { motion: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const motionRef = useRef(motion);
  const refresh = useRef<() => void>(() => {});
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");

  useEffect(() => { motionRef.current = motion; refresh.current(); }, [motion]);

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    let disposed = false;
    let renderer: WebGLRenderer | SVGRenderer | undefined;
    let release = () => {};

    async function createScene() {
      const [THREE, { OrbitControls }] = await Promise.all([
        import("three"), import("three/addons/controls/OrbitControls.js"),
      ]);
      if (disposed || !node) return;
      try {
        let vector = false;
        try {
          renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        } catch {
          const { SVGRenderer } = await import("three/addons/renderers/SVGRenderer.js");
          if (disposed) return;
          renderer = new SVGRenderer();
          renderer.setPrecision(2);
          vector = true;
        }
        const gl = renderer;
        gl.setClearColor(new THREE.Color(0xfaf9f5), 0);
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.domElement.classList.add("three-object");
        gl.domElement.tabIndex = 0;
        gl.domElement.setAttribute("role", "img");
        gl.domElement.setAttribute("aria-label", "Three-dimensional recurrent loop. Drag to rotate, or use the arrow keys.");
        node.appendChild(gl.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
        camera.position.set(0, 0, 9.2);
        const controls = new OrbitControls(camera, node);
        node.style.touchAction = "pan-y";
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.autoRotateSpeed = 0.35;
        controls.rotateSpeed = 0.65;
        controls.dampingFactor = 0.07;
        scene.add(new THREE.HemisphereLight(0xffffff, 0xb6a692, 2.7));
        const light = new THREE.DirectionalLight(0xffffff, vector ? 0.75 : 3);
        light.position.set(-3, 5, 6);
        scene.add(light);
        const rim = new THREE.DirectionalLight(0xe7bd9d, vector ? 0.35 : 1.7);
        rim.position.set(4, -2, 3);
        scene.add(rim);
        if (vector) scene.add(new THREE.AmbientLight(0x665d53));

        const object = new THREE.Group();
        object.rotation.set(-0.25, 0.2, -0.28);
        scene.add(object);
        const segments = vector ? 96 : 240;
        const radial = vector ? 16 : 32;
        const surface = new THREE.TorusKnotGeometry(1.55, 0.38, segments, radial, 2, 3);
        object.add(new THREE.Mesh(surface, new THREE.MeshStandardMaterial({ color: 0xd7cfc1, roughness: 0.6, metalness: 0.18 })));
        const positions = surface.getAttribute("position");
        const normals = surface.getAttribute("normal");
        const wire = new THREE.LineBasicMaterial({ color: 0x3d3832, transparent: true, opacity: 0.46 });
        const copper = new THREE.LineBasicMaterial({ color: 0xa35b3e, transparent: true, opacity: 0.9 });
        for (let strand = 0; strand < radial; strand++) {
          const points = new Float32Array(segments * 3);
          for (let step = 0; step < segments; step++) {
            const index = step * (radial + 1) + strand;
            points[step * 3] = positions.getX(index) + normals.getX(index) * 0.004;
            points[step * 3 + 1] = positions.getY(index) + normals.getY(index) * 0.004;
            points[step * 3 + 2] = positions.getZ(index) + normals.getZ(index) * 0.004;
          }
          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute("position", new THREE.BufferAttribute(points, 3));
          object.add(new THREE.LineLoop(geometry, strand % 8 === 0 ? copper : wire));
        }

        let frame = 0;
        let visible = true;
        let previous = 0;
        const render = () => { if (!disposed) gl.render(scene, camera); };
        const animate = (time: number) => {
          if (disposed) return;
          if (vector && previous && time - previous < 1000 / 24) { frame = requestAnimationFrame(animate); return; }
          controls.update(previous ? Math.min((time - previous) / 1000, 0.05) : 0);
          previous = time;
          render();
          frame = requestAnimationFrame(animate);
        };
        const sync = () => {
          cancelAnimationFrame(frame);
          previous = 0;
          controls.autoRotate = motionRef.current;
          controls.enableDamping = motionRef.current;
          if (motionRef.current && visible && !document.hidden) frame = requestAnimationFrame(animate);
          else render();
        };
        refresh.current = sync;
        const resize = () => {
          const rect = node.getBoundingClientRect();
          gl.setSize(Math.max(1, rect.width), Math.max(1, rect.height));
          camera.aspect = rect.width / Math.max(1, rect.height);
          camera.updateProjectionMatrix();
          render();
        };
        const keyboard = (event: KeyboardEvent) => {
          if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
          event.preventDefault();
          if (event.key === "ArrowLeft") object.rotation.y -= 0.12;
          if (event.key === "ArrowRight") object.rotation.y += 0.12;
          if (event.key === "ArrowUp") object.rotation.x -= 0.12;
          if (event.key === "ArrowDown") object.rotation.x += 0.12;
          render();
        };
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(node);
        const intersectionObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
        intersectionObserver.observe(node);
        const changed = () => { if (!motionRef.current) render(); };
        controls.addEventListener("change", changed);
        node.addEventListener("keydown", keyboard);
        document.addEventListener("visibilitychange", sync);
        const lost = () => { visible = false; sync(); setStatus("fallback"); };
        gl.domElement.addEventListener("webglcontextlost", lost);
        resize();
        sync();
        node.dataset.renderer = vector ? "threejs-svg" : "threejs-webgl";
        setStatus("ready");

        release = () => {
          cancelAnimationFrame(frame);
          refresh.current = () => {};
          resizeObserver.disconnect();
          intersectionObserver.disconnect();
          document.removeEventListener("visibilitychange", sync);
          node.removeEventListener("keydown", keyboard);
          gl.domElement.removeEventListener("webglcontextlost", lost);
          controls.removeEventListener("change", changed);
          controls.dispose();
          scene.traverse(child => {
            if (child instanceof THREE.Mesh || child instanceof THREE.LineLoop) {
              child.geometry.dispose();
              const materials = Array.isArray(child.material) ? child.material : [child.material];
              materials.forEach(material => material.dispose());
            }
          });
          if (gl instanceof THREE.WebGLRenderer) gl.dispose();
          gl.domElement.remove();
        };
      } catch {
        if (renderer instanceof THREE.WebGLRenderer) renderer.dispose();
        renderer?.domElement.remove();
        if (!disposed) setStatus("fallback");
      }
    }
    createScene().catch(() => { if (!disposed) setStatus("fallback"); });
    return () => { disposed = true; release(); };
  }, []);

  return <figure className="recurrence-figure" data-status={status}>
    <div className="scene-stage" ref={host}>
      <svg className="scene-fallback" viewBox="0 0 400 400" fill="none" aria-hidden="true"><path d="M200 200C140 80 20 100 20 200s120 120 180 0S380 80 380 200 260 320 200 200Z" stroke="#a35b3e" strokeWidth="1.5" /></svg>
    </div>
    <figcaption><span>Recurrence</span><span>{status === "ready" ? "Drag to rotate ↗" : "Inference · Memory · Computation"}</span></figcaption>
  </figure>;
}
