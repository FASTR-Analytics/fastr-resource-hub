/**
 * Marp CLI configuration
 * This config is used when running: npx @marp-team/marp-cli
 */

const config = {
  // Allow HTML in markdown
  allowLocalFiles: true,
  html: true,

  // Custom theme
  themeSet: './fastr-theme.css',

  // PDF export settings (16:9 aspect ratio)
  pdf: true,
}

export default config
