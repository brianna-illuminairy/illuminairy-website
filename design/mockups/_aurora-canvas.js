/* Aurora sky + starfield — from illuminairy_brand_guide.html */
(function () {
  const starsEl = document.getElementById("stars");
  if (starsEl) {
    for (let i = 0; i < 120; i++) {
      const s = document.createElement("div");
      s.className = "star";
      const size = Math.random() < 0.18 ? 3 : 2;
      s.style.cssText =
        "left:" +
        Math.random() * 100 +
        "%;top:" +
        Math.random() * 100 +
        "%;width:" +
        size +
        "px;height:" +
        size +
        "px;--d:" +
        (2 + Math.random() * 5) +
        "s;--min:" +
        (0.05 + Math.random() * 0.1) +
        ";--max:" +
        (0.3 + Math.random() * 0.6) +
        ";";
      starsEl.appendChild(s);
    }
  }

  const canvas = document.getElementById("aurora-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, t = 0;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function drawAurora() {
    ctx.clearRect(0, 0, W, H);
    const bands = [
      { y: H * 0.28, amp: 60, freq: 0.0018, phase: t * 0.0004, color: "rgba(0,87,168,0.07)" },
      { y: H * 0.22, amp: 45, freq: 0.0022, phase: t * 0.0005 + 1, color: "rgba(119,200,154,0.055)" },
      { y: H * 0.32, amp: 35, freq: 0.0015, phase: t * 0.00035 + 2, color: "rgba(184,245,209,0.04)" }
    ];
    bands.forEach(function (b) {
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 4) {
        const y =
          b.y +
          Math.sin(x * b.freq + b.phase) * b.amp +
          Math.sin(x * b.freq * 1.7 + b.phase * 1.3) * (b.amp * 0.4);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, b.y - b.amp, 0, b.y + b.amp * 2);
      grad.addColorStop(0, b.color);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fill();
    });
    t++;
    requestAnimationFrame(drawAurora);
  }
  drawAurora();
})();
