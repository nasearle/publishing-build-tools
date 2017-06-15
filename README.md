## How does this work?

This repo has our source files. These are currently in language folders, e.g., `en` has the english source files. These source files currently consist of:

1. Code for student exercises. This lives in the `code` folders within each language. For the PWA team style, code is broken into units, e.g., "fetch-api-lab". Each unit contains the starter code and solution code for that unit (which may differ from Android team style).

2. Markdown files for concept chapters and codelab (aka practicals) instructions. These live in `concepts` and `codelabs` (respectively) within each language folder. Like code these are broken up by unit. Each unit's folder contains the markdown, associated images, and a metadata file (`codelab.json`);

How did we get all these files? Excellent question.

The `code` files were just written normally. The `concepts` and `codelabs` files were generated with the `claat` tool, which pulls down a Google Doc from the interwebs, and converts it into markdown.

#### Adding docs to this repo (and the publishing pipeline)

You can use `claat` to pull new Google Docs into this repo. Use `./claat help` to see the `claat` documentation, but basically, run

```
./claat export -f md [Google Doc ID]
```

where the doc ID is part of the resources URL:

```
https://docs.google.com/document/d/[DOC ID]/edit#
```

This will pull down a folder named after the doc (based on the title by default). Drag this folder into the appropriate location, e.g., `en/concepts` for an English concepts doc. [**TODO** - automate this?]

Like the existing `codelabs` & `concepts` folders, the folder will contain:
* an `index.md` file - this is the Gdoc text converted into markdown
* an `img` directory containing the images present in the Gdoc (they
  are given random hash names, and `index.md` references them by these names)
* a `codelab.json` file - this file contains metadata such as the last time
the `index.md` was updated from Gdocs. The most important aspect of this metadata
file is that it is used to reference the orginal Gdoc.

Once a Gdoc document has been added this way, it does not need to be added
again. From now on we can simple use `claat update`, which will recursively
search through all of the files in this repo, and update all `index.md`
files based on the Gdoc that is referenced in their corresponding `codelab.json`
file.

#### What happens after all the docs are added?

Once we have all the source files in this repo, we want to group them into courses and push them to specific repositories. Currently that means we specify which units belong to which course, e.g., units x, y, and z should be in a 3-day course, but only units x & z should be in the 1-day course.

The goal is (currently) to pull the code, concepts, and codelab instructions for each course and put them in their own repo. So the end result is something like:

* code for units x & z for 1-day course --> repo 1
* concepts for units x & z for 1-day course --> repo 2
* codelabs for units x & z for 1-day course --> repo 3


* code for units x, y & z for 3-day course --> repo 4
* concepts for units x, y & z for 3-day course --> repo 5
* codelabs for units x, y & z for 3-day course --> repo 6

This makes it so the student only has to pull the code for their exact course. In addition the concepts and codelabs repo's are linked to GitBook's. In this example that would mean there are GitBooks for:

* repo 2 --> GitBook for concepts x & z
* repo 3 --> GitBook for codelabs x & z


* repo 5 --> GitBook for concepts x, y, & z
* repo 6 --> GitBook for codelabs x, y, & z

#### How is this done?

The `config.json` file specifies the repos, gitbook links, and units for each course. The units must (currently) be manually created for `code` resources, but are generated automatically for `concepts` and `codelabs`. This is done by adding tags in a table at the top of the Gdoc that specifies which courses the unit belongs in. Those tags then end up as metadata in the `codelab.json` files. The build script looks at that data to determine how to group resources.

Once all the resources are grouped, they are pushed to the repos specified in `config.json`. In addition, a README is added to each repo that links resources from each course together. So for example, the README's in a 3-day course's `code` repo will have links to the appropriate GitBook for the corresponding `concepts` and `codelabs`.

## Nobody cares, how do I use this thing?

#### dependencies & pre-requisites

This tool requires [Node](https://nodejs.org/en/). You can check if Node is installed with `node --v`.

Run `npm install` to install required dependencies.

#### Step 0: pull the source repo (this one)

This repo contains both the publishing tool & source files. Make sure to `git pull` this repo so that your source files are up to date.

#### Step 1. Add source docs
If you want to add a source `concept` or `codelab` doc, add tags to the table at the top of the source Gdoc. Then use `./claat export -f md [Google Doc ID]` to pull the doc into this repo, and drag it into the appropriate place (e.g., `en/concepts`). Remember to update `config.json` with the new doc.

### Step 2. Run the magic tool

Run `npm run build` and you're done. This will

* use `./claat update` to update all local `concepts` and `codelabs` documents
* use `codelabHelper.js` to clean up markdown conversion errors
* use `config.json` and the Gdoc tags to organize the source materials into courses
* write READMEs for each course linking resources together
* push each resource to the appropriate repository

**Note:** Since the build process updates the source materials with `./claat update`, its probably a good idea to commit and push this repo after publishing as well.
