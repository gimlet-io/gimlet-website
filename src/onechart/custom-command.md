---
layout: docs
title: Custom command
lastUpdated: 2020-12-09
tags: [docs]
---

# Custom command

OneChart settings for overriding the default command to run:

```yaml
image:
  repository: debian
  tag: stable-slim

command: |
  while true; do date; sleep 2; done
```

Check the Kubernetes manifest:

```bash
cat << EOF > values.yaml
image:
  repository: debian
  tag: stable-slim

command: |
  while true; do date; sleep 2; done
EOF

helm template my-release onechart/onechart -f values.yaml
```

### Using bash

```bash
cat << EOF > values.yaml
image:
  repository: debian
  tag: stable-slim

command: |
  while true; do date; sleep 2; done
shell: "/bin/bash"
EOF

helm template my-release onechart/onechart -f values.yaml
```

### Running a command in Alpine Linux

```bash
cat << EOF > values.yaml
image:
  repository: alpine
  tag: 3.12

command: |
  while true; do date; sleep 2; done
shell: "/bin/ash"
EOF

helm template my-release onechart/onechart -f values.yaml
```
