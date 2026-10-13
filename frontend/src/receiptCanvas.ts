/**
 * Renders the Ephemeral Field Log Receipt into a downloadable PNG image
 * using standard HTML5 Canvas without any external library.
 * Includes simulated procedural verification matrix stamp and brand aesthetics.
 */
export function generateReceiptImage(receiptText: string): Promise<string> {
  return new Promise((resolve) => {
    const lines = receiptText.split('\n');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    const width = 850;
    const lineHeight = 28;
    const padding = 50;
    const height = padding * 2 + lines.length * lineHeight + 130;

    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = '#090a0f';
    ctx.fillRect(0, 0, width, height);

    // Outer border
    ctx.strokeStyle = '#242a3d';
    ctx.lineWidth = 4;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    // Inner glow border
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.strokeRect(24, 24, width - 48, height - 48);

    // Watermark / Brand Header
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillStyle = '#10b981';
    ctx.fillText('EXHALE // SACRED RECONNECTION & ACUTE CIRCUIT BREAKER', padding, 52);

    // Sub-header
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText('ANCESTRAL BIOSPHERE RECIPROCITY • ANTI-ENGAGEMENT SOVEREIGNTY', padding, 72);

    // Content Lines
    ctx.font = '13px "JetBrains Mono", monospace';
    let y = 104;

    lines.forEach((line) => {
      if (line.includes('====') || line.includes('----')) {
        ctx.fillStyle = '#334155';
      } else if (line.includes('AUTHENTICATED') || line.includes('RE-GROUNDED') || line.includes('ZERO BYTES') || line.includes('DISSOLVED')) {
        ctx.fillStyle = '#34d399';
      } else if (line.includes('SOMATIC STATE') || line.includes('ANCESTRAL FRAME') || line.includes('ATMOSPHERE ANCHOR')) {
        ctx.fillStyle = '#f8fafc';
      } else {
        ctx.fillStyle = '#94a3b8';
      }
      ctx.fillText(line, padding, y);
      y += lineHeight;
    });

    // Draw Verification Stamp & Procedural QR Data Matrix Box in corner
    const qrSize = 80;
    const qrX = width - padding - qrSize;
    const qrY = height - padding - qrSize - 10;

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(qrX, qrY, qrSize, qrSize);

    // Procedural pseudo-data matrix dots inside
    ctx.fillStyle = '#34d399';
    const step = 8;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        // Pseudo-deterministic pattern from receipt length
        if ((r * 7 + c * 13 + lines.length) % 3 !== 0) {
          ctx.fillRect(qrX + 8 + c * step, qrY + 8 + r * step, 5, 5);
        }
      }
    }

    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText('RAM PURGE WITNESS', qrX - 8, qrY + qrSize + 16);

    // Verified Certificate Badge
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText('VERIFIED GROUNDING IN THE LIVING WORLD // 0 BYTES PERSISTED', padding, height - 55);

    // Footer Stamp
    ctx.fillStyle = '#475569';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText('SOVEREIGN OPEN-WEIGHT RUNTIME • ZERO-RETENTION CIRCUIT BREAKER', padding, height - 35);

    resolve(canvas.toDataURL('image/png'));
  });
}
