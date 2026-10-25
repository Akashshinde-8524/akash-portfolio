// Temporary developer-facing component — NOT part of the final site.
// Used only in Phase 1 to visually verify the design tokens (colors, type)
// before any real layout is built. Safe to delete once tokens are approved.

export function ColorSwatch({ name, cssVar, hex }) {
  return (
    <div style={styles.swatchRow}>
      <div
        style={{
          ...styles.swatchBlock,
          background: `var(${cssVar})`,
          border: cssVar === "--color-bg" ? "1px solid var(--color-border-soft)" : "none",
        }}
      />
      <div>
        <div style={styles.swatchName}>{name}</div>
        <div style={styles.swatchMeta}>
          {cssVar} — {hex}
        </div>
      </div>
    </div>
  );
}

const styles = {
  swatchRow: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-4)",
  },
  swatchBlock: {
    width: 56,
    height: 56,
    flexShrink: 0,
  },
  swatchName: {
    fontFamily: "var(--font-display)",
    fontWeight: "var(--weight-semibold)",
    fontSize: "var(--text-body)",
  },
  swatchMeta: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-small)",
    color: "var(--color-text-muted)",
  },
};
