// lib/mermaidTheme.ts
type ThemeVars = Record<string, string | number | boolean>

export const getElegantBrutalismTheme = (isDark: boolean): ThemeVars => {
  // Swiss Brutalism theme with improved dark mode support
  // Using hex colors (Mermaid doesn't support oklch in theme variables)
  // Colors are matched to oklch values from design system
  
  const base = {
    fontFamily: 'JetBrains Mono, Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: '13px',
    // Edge strokes - high contrast
    lineColor: isDark ? '#D9DCE1' : '#1F2937',      // Light gray / Dark
    // Text colors - ensure high contrast
    textColor: isDark ? '#F3F4F6' : '#111827',      // Almost black for light theme
    titleColor: isDark ? '#FAFAFA' : '#111827',     // Almost black for light theme
    // Nodes - main elements
    primaryColor: isDark ? '#1F2430' : '#FEFEFE',    // Very dark / Almost white
    primaryBorderColor: isDark ? '#BFBFBF' : '#374151', // Light gray border / Dark border
    primaryTextColor: isDark ? '#F3F4F6' : '#111827',   // Almost black for light theme
    // Node borders
    nodeBorder: isDark ? '#BFBFBF' : '#374151',
    nodeTextColor: isDark ? '#F3F4F6' : '#111827',      // Almost black for light theme
    // Secondary elements
    secondaryColor: isDark ? '#262B38' : '#FAFAFA',
    secondaryBorderColor: isDark ? '#B3B8C4' : '#4B5563',
    secondaryTextColor: isDark ? '#E6E6E6' : '#374151',
    // Clusters
    clusterBkg: isDark ? '#141520' : '#FAFAFA',
    clusterBorder: isDark ? '#B3B8C4' : '#374151',
    // Edge labels / boxes
    edgeLabelBackground: isDark ? '#1F2430' : '#FEFEFE',
    edgeLabelTextColor: isDark ? '#F3F4F6' : '#111827',    // Almost black for light theme
    labelTextColor: isDark ? '#F3F4F6' : '#111827',        // Almost black for light theme
    // Sequence diagrams
    actorBkg: isDark ? '#1F2430' : '#FEFEFE',
    actorBorder: isDark ? '#BFBFBF' : '#374151',
    actorTextColor: isDark ? '#F3F4F6' : '#111827',        // Almost black for light theme
    signalColor: isDark ? '#D9DCE1' : '#111827',           // Almost black for light theme
    signalTextColor: isDark ? '#F3F4F6' : '#111827',       // Almost black for light theme
    // Backgrounds for different diagram types
    mainBkg: isDark ? '#141520' : '#FEFEFE',
    secondBkg: isDark ? '#1F2430' : '#FAFAFA',
    tertiaryBkg: isDark ? '#262B38' : '#F5F5F5',
    // Notes
    noteBkgColor: isDark ? '#1F2430' : '#FAFAFA',
    noteTextColor: isDark ? '#F3F4F6' : '#111827',         // Almost black for light theme
    noteBorderColor: isDark ? '#B3B8C4' : '#374151',
    // Activation boxes (sequence diagrams)
    activationBkgColor: isDark ? '#262B38' : '#F5F5F5',
    activationBorderColor: isDark ? '#B3B8C4' : '#374151',
    // Accent states - bold but not neon, matching design system
    // Active - blue
    activeTaskBkgColor: '#3B82F6',
    activeTaskBorderColor: '#2563EB',
    activeTaskTextColor: '#FAFAFA',
    // Done - green
    doneTaskBkgColor: '#10B981',
    doneTaskBorderColor: '#059669',
    doneTaskTextColor: '#FAFAFA',
    // Critical - red
    critBkgColor: '#EF4444',
    critBorderColor: '#DC2626',
    critTaskTextColor: '#FAFAFA',
  }

  return {
    ...base,
    // Swiss design spacing - 8px modular grid
    padding: 8,
    noteMargin: 8,
  }
}
