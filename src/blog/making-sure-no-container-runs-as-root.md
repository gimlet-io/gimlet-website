---
layout: post
title: "Are you sure none of your containers run as root?"
date: 2021-05-03
excerpt: |
    The Kyverno policy engine just arrived in Gimlet Stack, so in this article you can see how you can be certain that none of the containers run as root in your Kubernetes cluster.
topic: Gimlet Stack
image: todo.png
tags: [posts]
---

The Kyverno policy engine just arrived in Gimlet Stack, so in this article you can see how you can be certain that none of the containers run as root in your Kubernetes cluster.

## Kyverno is a policy engine

Kyverno runs on your Kubernetes cluster, hooks into the API server's extension points and able to determine if a resource is of the shape as the policies you defined.

Based on those policies it can validate (and reject), or even mutate the deployed resources, making it a very powerful tool for you.

In order to detect if a container is running as root, we are going to use Kyverno's validation feature in this article, and alert if a root container is deployed on the cluster.

![How Kyverno extends the Kubernetes API server](https://kyverno.io/images/kyverno-architecture.png)

## Introducing Kyverno to Gimlet Stack

Gimlet Stack is a CLI tool that you can use to bootstrap curated stacks on your Kubernetes cluster. Making it an application platform from day-1, as we want you to be equipped with great tools and configuration that is giving you value without any configuration.

Things that would take you hours to set up, should be just there from the get go. Policy engines is typically a day-2 thing to set  up for a Kubernetes cluster. There is just so many other things to get right before cluster admins get to policies

Now you can add Kyverno to your platform with Gimlet Stack

![Enabling Kyverno on the Gimlet Stack UI](efweg)

## The non root policy

At Gimlet.io we like Kyverno for it simplicity, and the fact that you can define policies with a CRD, giving you the configuration experience like any other k8s resource, writing yamls.

```
TODO show a non root policy
```

By default a basic set of policies are deployed. 

two level: restricted, basic

Currently just audit


## Checking violating containers

Grafana dash showcase
deploy a dummy container


## Setting alert on it



## Gimlet stack going wide and deep

Things that would take you hours to set up, should be just there from the get go. Policy engines is typically a day-2 thing to set  up for a Kubernetes cluster. There is just so many other things to get right before cluster admins get to policies

stay tuned

check out GImlet Stack for EKS 


