<img src="https://user-images.githubusercontent.com/11739105/156749223-0a34348c-2155-4599-8b51-778cb9c91d50.svg" alt="Relisio Artefact"  width="128" />

This Github action is an official [Relisio](https://www.relisio.com/) deploy utility.<br />
Use it to upload artefacts within your products/projects.

### Prerequisites
 1. an active workspace at [www.relisio.com](https://www.relisio.com) or a self-hosted copy of Relisio;
 2. an `api-key` authorized to **Alter Storage** or **Upload Artefact** (in Relisio, go to workspace settings, Api Keys to generate one);
 3. a GitHub repository configured to run Actions;

### Before you start

 1. consider that Relisio is currently in Beta, and breaking changes may occur at any time,
 2. the `api-key` can be generated (and destroyed) from your workspace settings,
 3. optionally you may use this action together with 
    - `Studio-41/relisio-project-action@v1`

### Available inputs

|id|description|required|default|
|---|---|:---:|:---:|
|relisio-url| Relisio base url (only for self-hosted or enterprise installations)|false|https://relisio.com|
|api-key| API key to authorize the deployment|true|
|workspace-path|The ID of an existing product/project within the workspace into which upload the artefact|true|
|resource-id| ID of an existing product withing the workspace to clone as the base for this new product|true|
|resource-type|The type of resource into which the artefact will upload (project, product, environment, kb)|true|
|artefact-scope|The visibility of the artefact once created. Despite which scope has the resource containing this artefact, it can have its visibility scope (inherit, internal or public)|true|`inherit`|
|artefact-path|The path of the file to upload|true|

### Available outputs

|id|description|
|---|:---|
|artefact-id|ID of the uploaded artefact|
|artefact-sha256|sha256 of the created artefact|
|public-url|Full path from where to download the artefact|
|sha256-url|Full path from where to download the corresponding sha256 of the artefact|

## Ensuring Data Integrity with Hash Code
Relisio will always create a corresponding .sha256 file for each artefact uploaded (via API, GitHub Action, or interface). Use this information to double-check the integrity of your published artefacts.

A recommended way to ensure integrity is to generate a .sha256 prove locally before uploading the file to Relisio and then compare both values to trust the uploaded artefact.

## Update a product with the last artefact

The following example uploads the file `program.exe` into **an existing product**.<br/>

 - As the `resource-type` is `product` the artefact will be associated to that existing product.
 - As the `visibility` is `inherit`, the artefact will be set to use the host product.

```yaml
on:
  push:
    tags:
      - "v*"

jobs:
  deloy:
    runs-on: ubuntu-latest
    steps:
    - name: Deploy As Relisio Artefact 
      uses: Studio-41/relisio-artefact-action@v1
      with:
        api-key: ${{ secrets.RELISIO_API_KEY }}
        workspace-path: ${{ secrets.RELISIO_WORKSPACE }}
        resource-id: ${{ secrets.RELISIO_PRODUCT_A }}
        resource-type: product
        artefact-scope: inherit
        artefact-path: ./program.exe
```
<hr/>

### <img src="https://user-images.githubusercontent.com/11739105/152799348-e70d55f4-3914-43cd-866f-f2b979071be2.svg" alt="Product" width="32"> Work with Relisio Product

You can optionally configure your GitHub Workflow to create **product** on the fly and then upload a new artefact into it `Studio-41/relisio-product-action@v1` ([more details](https://github.com/Studio-41/relisio-product-action)).


### <img src="https://user-images.githubusercontent.com/11739105/152803355-69bfce13-e6ee-4f7b-a53e-6cee391e0273.svg" alt="Project" width="32"> Work with Relisio Projects

If you want to publish artefacts as part of a new Release for a specific Relisio Environment, you can combine this action with `Studio-41/relisio-project-action@v1` ([more details](https://github.com/Studio-41/relisio-project-action)).

<hr/>

### <img src="https://user-images.githubusercontent.com/11739105/152805812-261613f7-1357-4f01-b3e8-ed6d613c3577.svg" alt="Project" width="32"> Professional support is available
 Relisio is a Studio 41 Software Design S.L. product.<br/><br/>
Enterprise service is available for organizations wanting to implement Relisio into their current CI pipeline.<br/><br/>
Contact us at <a href="mailto:info@41.studio">info@41.studio</a>. We will do our best to assist you with Relisio related automation or queries.
