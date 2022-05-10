---
created: 2022-05-10T07:09:56.550Z
updated: 2022-05-10T16:43:08.363Z
assigned: ""
progress: 0
tags: []
started: 2022-05-10T00:00:00.000Z
completed: 2022-05-10T16:43:08.363Z
---

# Remove database warnings

The problem was that the vite server was watching the data dir. Anytime the db was written it recompiled.... bam
Also the DataSource var is now instantiatet on root in dbsingleton ... dont like it but dont know how to do differently.
