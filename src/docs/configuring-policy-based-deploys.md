---
layout: docs
title: Configuring policy-based deploys
lastUpdated: 2020-03-16
image: policy.png
tags: [docs]
---

# Policy based releases

You can automate releases to your staging or production environment.

On this page, you will learn how to create release policies - that are triggered on certain conditions -
to automatically release to a target environment.

## Set release policies in the Gimlet environment file

You can control environment configuration with the Gimlet manifest files in the `.gimlet/` folder in your application source code repository. It pins down the release configuration to a target environment.

As a recap, here is an example configuration for an application's staging environment.

It pins down the Helm chart to use, its version, and the configuration variables for the staging environment:

```yaml
# .gimlet/staging.yaml
app: frontend
env: staging
namespace: my-team
chart:
  repository: https://chart.onechart.dev
  name: onechart
  version: 0.32.0
values:
  replicas: 2
  image:
    repository: myapp
    tag: 1.1.0
  ingress:
    host: myapp.staging.mycompany.com
    tlsEnabled: true
```

## Adding the policy
```diff
# .gimlet/staging.yaml
app: frontend
env: staging
namespace: my-team
+deploy:
+  branch: main
+  event: push
chart:
  repository: https://chart.onechart.dev
  name: onechart
  version: 0.32.0
values:
  replicas: 2
  image:
    repository: myapp
-    tag: 1.1.0
+    tag:  {% raw %}"{{ .GITHUB_SHA }}"{% endraw %}
  ingress:
    host: myapp.staging.mycompany.com
    tlsEnabled: true
```

GimletD processes each new artifact and matches against the defined policies.

The above example configures a release policy that automatically releases every git push on the `main` branch to the staging environment

## Supported git refs

GimletD supports `branch` and `tag` filters.

Both support wildcards and negated expressions

#### Tag pattern trigger example
```yaml
+deploy:
+  tag: v*
+  event: tag
```

Triggers on `v1`, `v2`, `v1.1` or any glob pattern that is supported by the [https://github.com/gobwas/glob](https://github.com/gobwas/glob) project.

#### Branch pattern trigger example
```yaml
+deploy:
+  branch: feature/*
+  event: push
```

Triggers on any commit pushed to a branch that is prefixed with `feature/`.

#### Negated branch trigger
```yaml
+deploy:
+  branch: !main
+  event: push
```

Triggers on any commit pushed to a branch that is not `main`.

## Supported events

GimletD supports `push`, `tag` and `pr` events.

It is mandatory to set either the `branch` or the `event` condition.
If both are defined, the policy triggers only if both conditions are satisfied.
