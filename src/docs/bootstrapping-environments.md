---
layout: docs
title: Bootstrapping environments
lastUpdated: 2022-03-16
tags: [docs]
---

# Bootstrap gitops repository and customize infrastructure components

In Gitops, instead of applying Helm charts and kubernetes manifests directly on the cluster, you write them to a git repository. The gitops controller will be the one deploying them on the cluster based on changes in the repository.

## Create an env

At the bottom of the Environments tab, create a new environment by giving a not existing environment name and clicking on the Create button.


## Bootstrap

If there is an environment, which is not connected to git, you can bootstrap it in a single repository and use folders to separate, or you can separate environments by git repositories by switching the Separate environments by git repositories slider. That way you can rename the the repositories. When you click on Bootstrap Gitops repository button, you can finalize the process with the given last two steps.

## Install infra components

When you have a bootstrapped Gitops repository you can customize the infrastructure components by navigating to Infrastructure components tab. Once you enabled the components write the configuration with the Save components button at the bottom of the card. If you made a mistake, just click on the Infrastructure component tab again. It will read the stack configuration from the repo, and you can reconfigure it. Make sure you applied the gitops manifests on the cluster.
