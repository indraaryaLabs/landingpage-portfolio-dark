# Portfolio fallback and CMS activity

## Intent

The public page should retain its current content when the CMS cannot be reached. The current CMS portrait is a public upload, while the three project images and showreel still use the approved template assets. Those project images and the video remain in place at the owner's request.

## Fallback

Keep the existing neutral loading skeleton until the initial CMS queries finish. Bundle a copy of the current portrait with the site and preload that local file. When no CMS is configured, both queries fail, the saved portrait URL is empty, or Storage cannot serve the saved portrait, render the local copy. The verified local text and links already match the current CMS content. CMS updates continue to take precedence when available; the bundled portrait is a snapshot and should be refreshed if the owner changes it.

## Activity schedule

On the Free Plan, read two small public database rows every six hours using a GitHub Actions schedule and repository secrets. The workflow also supports a manual run to verify access. Supabase says a few database requests each day typically prevent inactivity pausing, but only a paid plan guarantees exemption. GitHub can disable scheduled workflows in public repositories after 60 days without repository activity, so the schedule must be checked periodically.

## Verification

Build the site, lint changed JavaScript, test both successful and failed CMS responses in a browser, confirm the portrait template is never requested, and run the GitHub workflow once after merging.
