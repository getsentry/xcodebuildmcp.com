const THEME_SCRIPT = `
(function() {
  try {
    var t = localStorage.getItem('xcbmcp-docs-theme');
    if (t !== 'dark' && t !== 'light') t = 'light';
    document.documentElement.setAttribute('data-docs-theme', t);
    var s = localStorage.getItem('xcbmcp-docs-sidebar');
    document.documentElement.setAttribute('data-docs-sidebar', s === 'false' ? 'off' : 'on');
  } catch (e) {
    document.documentElement.setAttribute('data-docs-theme', 'light');
    document.documentElement.setAttribute('data-docs-sidebar', 'on');
  }
})();
`.trim()

/**
 * Inline script that runs before hydration to pick up the persisted docs
 * theme and sidebar state, preventing a flash of the wrong theme.
 */
export function DocsThemeScript() {
  return (
    <script
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
    />
  )
}
