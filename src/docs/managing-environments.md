---
layout: docs
title: Managing environments
lastUpdated: 2022-03-16
tags: [docs]
---

# Managing environments

Gimlet helps you with environment management. On the environments tab, you can
- create environments
- bootstrap the gitops automation
- and install infrastructure components

## Creating an environment

At the bottom of the Environments tab, create a new environment by giving a not existing environment name and clicking on the Create button.

## Bootstrapping the gitops automation

If there is an environment, which is not connected to git, you can bootstrap it in a single repository and use folders to separate, or you can separate environments by git repositories by switching the Separate environments by git repositories slider. That way you can rename the the repositories. When you click on Bootstrap Gitops repository button, you can finalize the process with the given last two steps.

## Installing infrastructure components

When you have a bootstrapped Gitops repository you can customize the infrastructure components by navigating to Infrastructure components tab. Once you enabled the components write the configuration with the Save components button at the bottom of the card. If you made a mistake, just click on the Infrastructure component tab again. It will read the stack configuration from the repo, and you can reconfigure it. Make sure you applied the gitops manifests on the cluster.
