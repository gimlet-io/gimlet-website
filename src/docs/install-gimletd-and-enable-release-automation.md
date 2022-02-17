---
layout: docs
title: Install GimletD and enable release automation
lastUpdated: 2020-03-15
tags: [docs]
---

# Install GimletD and enable release automation

In this tutorial, you will install GimletD, Gimlet's release manager component, and test the release automation function.

GimletD is the release manager. It has write access to the gitops repository, and encompasses all logic related to making releases, rollbacks, and git audit log processing.

## Prerequisites

- Make sure to orient yourself by learning about the [components](/concepts/components) of Gimlet.
- Read the [GimletD concepts](/concepts/gimletd-concepts) to see how it fits into the Gimlet universe and CI pipelines.
- You need to have a free GitHub account, or any other git provider that you know enough to translate the Github configuration instructions in this guide to the provider of your choice.

## Installation yamls and configuration

You can get the Kubernetes yamls by rendering the Helm chart with the minimum configuration you can see below:

```bash
cat << EOF > values.yaml
image:
  repository: ghcr.io/gimlet-io/gimletd
  tag: latest
  pullPolicy: Always
containerPort: 8888
probe:
  enabled: true
  path: /
EOF

helm template gimletd onechart/onechart -f values.yaml
```

If you prefer a Helm workflow use `helm install` instead, or if you have an infrastructure gitops repo that you created with Gimlet Stack, construct a `HelmRelease` resource and put it there.

### Add volumes to back the state

```diff
image:
  repository: ghcr.io/gimlet-io/gimletd
  tag: latest
probe:
  enabled: true
  path: /
+volumes:
+  - name: data
+    path: /var/lib/gimletd
+    size: 1Gi
+  - name: repo-cache
+    path: /tmp/gimletd
+    size: 5Gi
```

The purpose of these volumes are:
- the `data` volume is for the sqlite database to keep metadata in it.
- the `repo-cache` volume is what GimletD uses as scratch space for git operations. It is good practice to add a volume under it, so the high IO work GimletD does is performed on a real disk, with measurable and controllable IO, and not on the operating system disk.

### Expose the GimletD API with an Ingress

```diff
image:
  repository: ghcr.io/gimlet-io/gimletd
  tag: latest
probe:
  enabled: true
  path: /
volumes:
  - name: data
    path: /var/lib/gimletd
    size: 1Gi
  - name: repo-cache
    path: /tmp/gimletd
    size: 5Gi
+ingress:
+  annotations:
+    kubernetes.io/ingress.class: nginx
+    cert-manager.io/cluster-issuer: letsencrypt
+  host: gimletd.mycompany.com
+  tlsEnabled: true
```

Once you did this basic configuration, time to run GimletD for the first time. Shall we?

### Time to deploy GimletD

When you first start GimletD, it inits a file based SQLite3 database and prints the admin token to the logs.

```
{"level":"info","msg":"Admin token created: eyJhbGciOiJIUzI1NiIsInR5cCxxxs","time":"2021-11-11T09:04:03Z"}
```

Add this admin token in your password manager now, and make a user token for yourself:

```bash
curl -i \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -X POST -d '{"login":"my-user"}' \
  http://gimletd.mycompany.com:8888/api/user?access_token=$GIMLET_ADMIN_TOKEN
```

Save the returned user token from the result.

## Configure the gitops repository

GimletD's main job is to work on the gitops repository. It encompasses all logic that write the gitops repository, and encapsulates the heavy audit log processing algorithms.

It is time to configure the gitops repository to start the release automation features of GimletD:

- Generate a keypair with 

```
ssh-keygen -t ed25519 -C "your_email@example.com"
``` 

- Open GitHub, navigate to your gitops repository, and under *Settings > Deploy keys* click on *"Add deploy key"*
- Paste the generated public key
- Make sure to check the *"Allow write access"* checkbox

Add the keys to the GimletD installation config:

```diff
image:
  repository: ghcr.io/gimlet-io/gimletd
  tag: latest
probe:
  enabled: true
  path: /
[...]
+vars:
+  GITOPS_REPO: mycompany/gitops
+  GITOPS_REPO_DEPLOY_KEY_PATH: /github/deploy.key
+sealedFileSecrets:
+  - name: github-gitops-deploy-key
+    path: /github
+    filesToMount:
+      - name: deploy.key
+        source: AgA/7BnNhSkZAzbMqxMDidxK[...]
```

If you don't have Sealed Secrets running in your cluster, you can use your own secrets solution, or the following example
that uses regular Kubernetes secrets stored in git (not for production use).

```diff
image:
  repository: ghcr.io/gimlet-io/gimletd
  tag: latest
probe:
  enabled: true
  path: /
[...]
vars:
  GITOPS_REPO: mycompany/gitops
  GITOPS_REPO_DEPLOY_KEY_PATH: /github/deploy.key
+fileSecrets:
+  - name:  github-gitops-deploy-key
+    path: /github
+    secrets:
+      deploy.key: |
+        -----BEGIN OPENSSH PRIVATE KEY-----
+        b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAACFwAAAAdzc2gtcn
+        NhAAAAAwEAAQAAAgEA7BqMTFnDm6+C9FrRK5aoj[...]
EOF
```

## Let's close the feedback loop, set up Slack notifications

First, create a Slack app

To generate a new Slack token, visit the [https://api.slack.com/apps](https://api.slack.com/apps) page and follow these steps:

- Create a new application. *"App Name"* is Gimlet, pick your workspace as *"Development Slack Workspace"*
- Navigate to *"OAuth & Permissions"* on the left sidebar
- Under *"Bot Token Scopes"*, add scopes `chat:write`, `chat:write.customize` and `chat:write.public`
- Click the *"Install App to Workspace"* button on the top of the page
- Once you installed the app, save *"Bot User OAuth Access Token"* in Gimlet above


```diff
image:
  repository: ghcr.io/gimlet-io/gimletd
  tag: latest
probe:
  enabled: true
  path: /
[...]
+vars:
+  NOTIFICATIONS_PROVIDER: slack
+  NOTIFICATIONS_TOKEN: xoxb-41[...]
+  NOTIFICATIONS_DEFAULT_CHANNEL: gimletd
```

## Or if you prefer Discord

- First, make sure you’re logged in on the Discord website.
- Navigate to the application page: [https://discord.com/developers/applications](https://discord.com/developers/applications)
- Click on the “New Application” button.
- Enter "Gimlet" and confirm the pop-up window by clicking the "Create" button.
- Create a bot by navigating to the “Bot” tab, and clicking the “Build-A-Bot” button.
- Click the "Add Bot" button on the right and confirm the pop-up window by clicking the "Yes, do it!" button.
- After you received the "A wild bot has appeared!" message, copy your bot token from the "Build-A-Bot" submenu.
- Navigate to "OAuth2" -> "URL Generator" on the left panel.
- Check "Bot" in Scopes and check "Send Messages" in "Bot Permissions" -> "Text Permissions".
- Copy your generated URL from the bottom of the page, and open it in a new tab.
- Select the server you would like to add your bot to, and click "Continue". You can only select servers on which you have admin privileges. Make sure the "Send Messages" option is checked, before clicking on the "Authorize" button.
- After the security check, your bot will automatically join the server.
- The final step is to get the channel ID of the channel where you would like to get notifications. In order to do that, first you need to go to "User Settings" -> "Advanced", and enable "Developer Mode". This will allow you to see and copy your channel IDs.
- Now you can copy your text channel ID on Discord's main page by right clicking on the desired channel in the left panel and choosing the "Copy ID" option. 
- Make sure that the newly created bot is a member of your channel. Use the "Add members or roles" button in the channel to invite your bot's role.

```diff
image:
  repository: ghcr.io/gimlet-io/gimletd
  tag: latest
probe:
  enabled: true
  path: /
[...]
+vars:
+  NOTIFICATIONS_PROVIDER: discord
+  NOTIFICATIONS_TOKEN: OTQwO[...]
+  NOTIFICATIONS_DEFAULT_CHANNEL: 140971232847884321
```

## Verifying the installation

To verify the installation, you are going to 
- use the Gimlet CLI to ship a dummy artifact to GimletD
- then make an ad hoc deploy with `gimlet release make`
- and verify that GimletD made changes to the gitops repository

### Ship a dummy artifact

- Download a [dummy artifact](https://github.com/gimlet-io/gimletd/blob/main/fixtures/artifact.json) from the GimletD repo.

```
curl -L https://raw.githubusercontent.com/gimlet-io/gimletd/main/fixtures/artifact.json \
  -o artifact.json
```

Later in the verification process, you will deploy this artifact. This is a dummy application that you will have to clean up at the end of the process,
but it is perfect to verify GimletD's behavior in an isolated setup.

- Take the API key that you created earlier and set up Gimlet CLI

```
$ export GIMLET_SERVER=https://gimletd.mycompany.com:8888
$ export GIMLET_TOKEN=<<your token from earlier>>

$ gimlet artifact list
```

The gimlet command should return empty, without an error. Meaning that it did talk to GimletD, but there were no artifacts to list.

- Ship the artifact and list artifacts again

```bash
$ gimlet artifact push -f artifact.json

$ gimlet artifact list

laszlocph/gimletd-test-repo-7843bf7b-9bf0-4fd7-9382-e4a1f7ec54ae
07143100 - Testing monorepos (3 weeks ago) Laszlo Fogas
laszlocph/gimletd-test-repo@main https://github.com/laszlocph/gimletd-test-repo/commit/071431009c8e9d6293d16f58b4d1a7176eac953b
  myapp -> production
  myapp-variation -> staging @ tag
  myapp -> staging @ tag
```

### Make an ad hoc deploy

Take the artifact ID from the listed artifact and make a release

```
$ gimlet release make \
  --app myapp \
  --env staging \
  --artifact laszlocph/gimletd-test-repo-7843bf7b-9bf0-4fd7-9382-e4a1f7ec54ae

🙆‍♀️ Release is now added to the release queue with ID 91e19acd-9640-42a6-be04-15abaadad1be
Track it with:
gimlet release track 91e19acd-9640-42a6-be04-15abaadad1be
```

You should see the gitops repo commit that GimletD made.

### Cleanup

Before we conclude this tutorial, delete the recently made dummy release

```
gimlet release delete \
  --app myapp \
  --env staging
```
