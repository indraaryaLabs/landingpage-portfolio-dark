# CMS image-save repair

The owner could upload a new portrait to Supabase Storage but could not publish it: the editor cleared the required alternative-text field on image selection, then rejected the Save action. The same behavior affected project images. The field for the portrait was also separated from its image, making the error hard to resolve. Filling the text manually allowed the pending portrait to save, and the public page then displayed it, confirming the database-to-landing-page path.

Keep image descriptions editable, but insert a neutral, non-identity-claiming description whenever a new portrait or project image is selected. Place each description field directly under its image and require it for custom media. Replace the CMS's text-only IA mark with the existing favicon asset on both the sidebar and login screen. Do not change the public design, database schema, or any other content.

Verify with focused lint and build, an authenticated CMS save, a fresh public-page load, and a visual check of the favicon in the CMS.
