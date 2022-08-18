# Importing Podcasts 

`podkashde` can import podcasts with their episodes and medtadat from Wp and Seriously Simple Podcasting (SSP). This docu describes what and how `podkashde` import from the WP API.

## Preconditions
The following description as well as the implementation in `podkashde` is based on a specific usage of SSP.
SSP needs to be configured so that each podcast to import has a series, which contains all the episodes of the podcasst. 
Each episode is representd by a post in Wordpress, which contains the extended (meta) fields cover_file, speaker, (Todo: Complete the list)

## Usage
This section describes, how to use the 
  /admin/import
page of an `podkashde` installation.
### Entering metadats and selecting podcasts
After entering the url of the WP installation, from where you want to install, you can load the metadata. 
This includes the series of SSP, which will be displayed in a multiselect-box. By checking the checkbox you can identyfiy the series, which represent a podcast. They will later be the podcasts in your new system.
## Implemntation
### Loading Metadata
https://ccfreiburg.de/wp-json/wp/v2/series?per_page=100
https://ccfreiburg.de/wp-json/wp/v2/speaker?per_page=100
https://ccfreiburg.de/wp-json/wp/v2/tags?per_page=100
https://ccfreiburg.de/wp-json/wp/v2/tags?per_page=100&page=2


