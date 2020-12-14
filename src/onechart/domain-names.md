---
layout: onechart
title: Domain names
lastUpdated: 2020-12-09
tags: [onechart]
---

# Domain names

OneChart generates a Kubernetes`Ingress` resource for the Nginx ingress controller with the following settings:

```yaml
image:
  repository: my-app
  tag: 1.0.0

ingress:
  annotations:
    kubernetes.io/ingress.class: nginx
  host: chart-example.local
```

Check the Kubernetes manifest:

```bash
cat << EOF > values.yaml
image:
  repository: my-app
  tag: 1.0.0

ingress:
  annotations:
    kubernetes.io/ingress.class: nginx
  host: my-app.mycompany.com
EOF

helm template my-app onechart/onechart -f values.yaml
```

The Nginx ingress controller must be set up in your cluster for this setting to work. For other ingress controllers, please use the matching annotation.

## HTTPS

To reference a TLS secret use the `tlsEnabled` field. The deployment will point to a secret named: `tls-$.Release.Name`

```bash
cat << EOF > values.yaml
image:
  repository: my-app
  tag: 1.0.0

ingress:
  annotations:
    kubernetes.io/ingress.class: nginx
  host: my-app.mycompany.com
  tlsEnabled: true
EOF

helm template my-app onechart/onechart -f values.yaml
```