// lib/mermaidTheme.ts
type ThemeVars = Record<string, string | number | boolean>

export const getElegantBrutalismTheme = (isDark: boolean): ThemeVars => {
  // Pull from your CSS custom props where useful; fall back to hard values
  const base = {
    fontFamily: 'Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: '14px',
    lineColor: isDark ? '#E5E7EB' : '#111827',      // edge stroke
    textColor: isDark ? '#F9FAFB' : '#111827',
    titleColor: isDark ? '#F9FAFB' : '#111827',
    // nodes
    primaryColor: isDark ? '#0F172A' : '#FFFFFF',    // node fill
    primaryBorderColor: isDark ? '#9CA3AF' : '#111827',
    nodeBorder: isDark ? '#9CA3AF' : '#111827',
    nodeTextColor: isDark ? '#F9FAFB' : '#111827',
    // clusters
    clusterBkg: isDark ? '#0B1220' : '#F7F7F7',
    clusterBorder: isDark ? '#9CA3AF' : '#111827',
    // labels / boxes
    edgeLabelBackground: isDark ? '#0F172A' : '#FFFFFF',
    labelTextColor: isDark ? '#F9FAFB' : '#111827',
    // sequence
    actorBkg: isDark ? '#0F172A' : '#FFFFFF',
    actorBorder: isDark ? '#9CA3AF' : '#111827',
    signalColor: isDark ? '#E5E7EB' : '#111827',
    signalTextColor: isDark ? '#F9FAFB' : '#111827',
    // gantt / state / class / journey fallbacks
    mainBkg: isDark ? '#0B1220' : '#FFFFFF',
    secondBkg: isDark ? '#0F172A' : '#FAFAFA',
    tertiaryBkg: isDark ? '#111827' : '#F3F4F6',
    // notes
    noteBkgColor: isDark ? '#0F172A' : '#FAFAFA',
    noteTextColor: isDark ? '#F9FAFB' : '#111827',
    noteBorderColor: isDark ? '#9CA3AF' : '#111827',
    // states
    activationBkgColor: isDark ? '#111827' : '#F3F4F6',
    activationBorderColor: isDark ? '#9CA3AF' : '#111827',
    // accent states (active/done/crit) — use flat, saturated blocks
    // You can bind these to your CSS vars if desired
    // (kept consistent with your global palette sense)
    // Mermaid expects these names for gantt/status color ramps:
    // https://mermaid.js.org/config/theming.html#theme-variables-reference
    // We keep them bold but not neon.
    // Active
    activeTaskBkgColor: '#2563EB',
    activeTaskBorderColor: '#1E40AF',
    // Done
    doneTaskBkgColor: '#10B981',
    doneTaskBorderColor: '#047857',
    // Critical
    critBkgColor: '#EF4444',
    critBorderColor: '#B91C1C',
  }

  return {
    ...base,
    // Make everything feel “brutal”: thick strokes, square corners, no rounding
    // These are non-standard keys but honored by Mermaid's base theme variables.
    // When not honored, our CSS below enforces it.
    // Keep these values conservative; CSS will do the heavy lifting.
    padding: 8,
    noteMargin: 8,
  }
}
