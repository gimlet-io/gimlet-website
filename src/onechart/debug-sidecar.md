---
layout: onechart
title: Attaching a debug sidecar container
lastUpdated: 2021-02-10
tags: [onechart]
---

This page shows how you can add a sidecar container with debug tools installed.

The debug sidecar container will have access to the same resources as your app container, so you don't have to inflate your app container with debug tools.

The following example adds a default debug container (a debian image) to your deployment, and you can verify that this container will have access to the defined volume.

```yaml
debugSidecarEnabled: true

volumes:
  - name: data
    path: /data
    size: 1Gi
    storageClass: local-path
```

Check the Kubernetes manifest:

```bash
helm template my-release onechart/onechart -f values.yaml
```
